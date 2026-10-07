import { Controller } from "@hotwired/stimulus";

const isToast = (node: EventTarget | null): node is HTMLElement =>
  node instanceof HTMLElement && node.classList.contains("rx-toast");

/**
 * 開いているToastを、新しいものを手前にして重ねる。重ね方と広げ方の見た目はCSSが持ち、
 * ここでは順番（--rx-toast-index）・広げた時の持ち上げ幅（--rx-toast-offset）・手前の高さ（--rx-toast-front-size）を渡す。
 * 押すと広げ、外を押すかEscで畳む。キーボードで中へ入った時も広げる。
 */
export class ToastStackController extends Controller<HTMLElement> {
  private order: HTMLElement[] = [];
  private observer: ResizeObserver | null = null;

  connect = () => {
    this.element.dataset.expanded = "false";
    this.observer = new ResizeObserver(this.layout);
    this.element.addEventListener("toggle", this.toggle, true);
    this.element.addEventListener("click", this.click);
    this.element.addEventListener("focusin", this.focusin);
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("click", this.outside);
    for (const toast of this.toasts()) this.observer.observe(toast);
    this.order = this.toasts().filter((toast) => toast.matches(":popover-open"));
    this.layout();
  };
  disconnect = () => {
    this.element.removeEventListener("toggle", this.toggle, true);
    this.element.removeEventListener("click", this.click);
    this.element.removeEventListener("focusin", this.focusin);
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("click", this.outside);
    this.observer?.disconnect();
    this.observer = null;
  };

  private toasts = () =>
    Array.from(this.element.querySelectorAll<HTMLElement>(":scope > .rx-toast"));

  private toggle = (event: Event) => {
    if (!isToast(event.target) || !("newState" in event)) return;
    const toast = event.target;
    this.order = this.order.filter((item) => item !== toast);
    if (event.newState === "open") this.order.push(toast);
    if (this.order.length < 2) this.expand(false);
    this.layout();
  };

  /** 手前（最新）を0番にして、順番・持ち上げ幅・手前の高さを渡す。高さは変形の影響を受けない値で測る。 */
  private layout = () => {
    const open = this.order.slice().reverse();
    // 間隔はCSSがスタックのrow-gapに持つ。計算済みの長さで読む。
    const gap = parseFloat(getComputedStyle(this.element).rowGap) || 0;
    let offset = 0;
    open.forEach((toast, index) => {
      toast.style.setProperty("--rx-toast-index", String(index));
      toast.dataset.stack = index === 0 ? "front" : "back";
      toast.style.setProperty("--rx-toast-offset", `${offset}px`);
      offset += this.naturalSize(toast) + gap;
    });
    // 閉じたToastは順番の値を残し、閉じるアニメーションをその場で終えさせる。
    for (const toast of this.toasts()) if (!open.includes(toast)) delete toast.dataset.stack;
    const front = open[0];
    if (front)
      this.element.style.setProperty("--rx-toast-front-size", `${this.naturalSize(front)}px`);
    this.element.dataset.count = String(open.length);
  };

  /**
   * 畳んだ奥のToastは手前の高さに縮むので、要素の高さではなく中身の位置から本来の高さを求める。
   * offsetTopは変形の影響を受けないため、アニメーションの途中でも同じ値になる。
   */
  private naturalSize = (toast: HTMLElement) => {
    const children = Array.from(toast.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    const bottom = Math.max(0, ...children.map((child) => child.offsetTop + child.offsetHeight));
    const style = getComputedStyle(toast);
    return bottom + parseFloat(style.paddingBlockEnd) + parseFloat(style.borderBlockEndWidth);
  };

  private expand = (value: boolean) => {
    this.element.dataset.expanded = String(value && this.order.length > 1);
  };

  /** 操作（ボタン・リンク）を押した時はスタックを開閉しない。 */
  private click = (event: MouseEvent) => {
    if (!(event.target instanceof Element) || event.target.closest("a, button, input, select"))
      return;
    if (!isToast(event.target.closest(".rx-toast"))) return;
    this.expand(this.element.dataset.expanded !== "true");
  };

  private outside = (event: MouseEvent) => {
    if (this.element.dataset.expanded !== "true") return;
    if (event.target instanceof Node && this.element.contains(event.target)) return;
    this.expand(false);
  };

  private focusin = () => this.expand(true);

  private keydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.isComposing || this.element.dataset.expanded !== "true")
      return;
    event.preventDefault();
    this.expand(false);
  };
}
