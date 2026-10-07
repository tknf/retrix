import { Controller } from "@hotwired/stimulus";

const controlsSelector = "li[data-tree-value] > .row > :is(a[href], .toggle)";

/**
 * TreeControllerを補う。開閉状態をCSSで使うdata属性へ反映し、キー操作を次のように整える。
 * - フォーカス位置はTreeControllerが一覧のaria-activedescendantで伝えるので、中のリンクと開閉ボタンをTabで止めない。
 * - 右から左に書く時は、←と→の役割を入れ替える（開く・子へ進むのが←）。
 * - Enterでフォーカス中の項目を選んだ時、リンクの項目はリンク先へ移る（名前を押した時と同じ）。
 * `data-controller="tree tree-presentation"`の順で、TreeControllerの後に接続する。
 */
export class TreePresentationController extends Controller<HTMLElement> {
  private observer: MutationObserver | null = null;

  connect = () => {
    this.observer = new MutationObserver(this.sync);
    this.observer.observe(this.element, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
    // キャプチャフェーズはTreeControllerのキー処理より前、バブリングフェーズは後に動く。
    this.element.addEventListener("keydown", this.mirrorArrows, true);
    this.element.addEventListener("keydown", this.afterKeydown);
    this.sync();
  };

  disconnect = () => {
    this.observer?.disconnect();
    this.observer = null;
    this.element.removeEventListener("keydown", this.mirrorArrows, true);
    this.element.removeEventListener("keydown", this.afterKeydown);
    for (const item of this.items()) delete item.dataset.expanded;
    for (const control of this.element.querySelectorAll(controlsSelector))
      control.removeAttribute("tabindex");
  };

  private items = () =>
    Array.from(this.element.querySelectorAll<HTMLLIElement>("li[data-tree-value]"));

  private sync = () => {
    for (const item of this.items()) {
      const expanded = item.getAttribute("aria-expanded");
      if (expanded === "true" || expanded === "false") item.dataset.expanded = expanded;
      else delete item.dataset.expanded;
    }
    // JavaScriptなしではリンクがTabで止まる。controllerがある時だけ一覧の一つのTab停止位置にまとめる。
    for (const control of this.element.querySelectorAll(controlsSelector))
      if (control.getAttribute("tabindex") !== "-1") control.setAttribute("tabindex", "-1");
  };

  /**
   * TreeControllerは←と→を画面の向きで決めている。右から左に書く時は、TreeControllerが読む前に
   * キーの名前だけを入れ替える（信頼されたイベントのまま渡すため、作り直さない）。
   */
  private mirrorArrows = (event: KeyboardEvent) => {
    if (event.target !== this.element || (event.key !== "ArrowLeft" && event.key !== "ArrowRight"))
      return;
    if (getComputedStyle(this.element).direction !== "rtl") return;
    const key = event.key === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
    Object.defineProperty(event, "key", { configurable: true, get: () => key });
  };

  private afterKeydown = (event: KeyboardEvent) => {
    // 入れ替えたキーの名前を戻し、外側の処理には押したキーのまま届ける。
    Reflect.deleteProperty(event, "key");
    if (
      event.target !== this.element ||
      event.key !== "Enter" ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      // TreeControllerがフォーカス中の項目を選んだ時だけ既定の動作を止める。
      !event.defaultPrevented
    )
      return;
    const id = this.element.getAttribute("aria-activedescendant");
    const item = id ? this.element.ownerDocument.getElementById(id) : null;
    if (!item || !this.element.contains(item) || item.getAttribute("aria-disabled") === "true")
      return;
    const link = item.querySelector(":scope > .row > a[href]");
    if (link instanceof HTMLAnchorElement) link.click();
  };
}
