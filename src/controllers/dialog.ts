import { DialogController as BaseDialogController } from "@tknf/stimulus-ui";

type Swipe = { pointerId: number; startY: number; startTime: number; offset: number };

/**
 * closedby未対応環境にだけ、native backdropのクリックで閉じる処理を補う。対応環境の背景のクリックも、
 * 同じ`reason: "pointer"`でイベントを発火する。`method="dialog"`のフォームの送信で閉じる時も、閉じる前後のイベントを発火する。
 * 画面の下に付くシート（CSSの--rx-dialog-sheet）では、ハンドルと見出しを下へドラッグして閉じられるようにする。
 */
export class DialogController extends BaseDialogController {
  private backdropStart: HTMLDialogElement | null = null;
  private swipe: Swipe | null = null;

  constructor(...args: ConstructorParameters<typeof BaseDialogController>) {
    super(...args);
    const connectDialog = this.connect;
    const disconnectDialog = this.disconnect;
    this.connect = () => {
      connectDialog();
      this.element.addEventListener("pointerdown", this.startBackdrop);
      this.element.addEventListener("pointercancel", this.resetBackdrop);
      this.element.addEventListener("keydown", this.resetBackdrop);
      this.element.addEventListener("click", this.closeFromBackdrop);
      // cancelはバブリングしないので、dialogのキャプチャフェーズで受ける。
      this.element.addEventListener("cancel", this.cancelFromBackdrop, true);
      this.element.addEventListener("submit", this.closeFromSubmit);
      this.element.addEventListener("pointerdown", this.startSwipe);
      this.element.addEventListener("pointermove", this.moveSwipe);
      this.element.addEventListener("pointerup", this.endSwipe);
      this.element.addEventListener("pointercancel", this.cancelSwipe);
    };
    this.disconnect = () => {
      this.element.removeEventListener("pointerdown", this.startBackdrop);
      this.element.removeEventListener("pointercancel", this.resetBackdrop);
      this.element.removeEventListener("keydown", this.resetBackdrop);
      this.element.removeEventListener("click", this.closeFromBackdrop);
      this.element.removeEventListener("cancel", this.cancelFromBackdrop, true);
      this.element.removeEventListener("submit", this.closeFromSubmit);
      this.element.removeEventListener("pointerdown", this.startSwipe);
      this.element.removeEventListener("pointermove", this.moveSwipe);
      this.element.removeEventListener("pointerup", this.endSwipe);
      this.element.removeEventListener("pointercancel", this.cancelSwipe);
      this.cancelSwipe();
      this.resetBackdrop();
      disconnectDialog();
    };
  }

  private dialog = () =>
    this.element.querySelector<HTMLDialogElement>('[data-dialog-target="dialog"]');

  /**
   * 閉じる前後のイベントを発火して閉じる。閉じる前のイベントが取り消されたら開いたままにする。
   * 上流のclose()はブラウザのフォーカスの戻しに任せるが、WebKitはマウスで押したボタンにフォーカスを置かないので
   * 戻り先が無くなる。上流の利用者の閉じ方と同じく、モーダルだった時は開いた操作へフォーカスを戻す。
   */
  private closeWith = (reason: "pointer" | "swipe" | "submit", returnValue = "") => {
    const detail = { reason, returnValue };
    const dialog = this.dialog();
    if (
      !this.element.dispatchEvent(
        new CustomEvent("dialog:beforeclose", { bubbles: true, cancelable: true, detail }),
      ) ||
      !dialog?.open
    )
      return;
    const modal = dialog.matches(":modal");
    this.close(returnValue);
    const trigger = this.element.querySelector<HTMLButtonElement>('[data-dialog-target="trigger"]');
    if (modal && trigger?.isConnected && !trigger.disabled) trigger.focus();
    this.element.dispatchEvent(new CustomEvent("dialog:close", { bubbles: true, detail }));
  };

  /** 背景（native backdrop）を押した位置なら、そのdialogを返す。 */
  private backdropTarget = (event: MouseEvent) => {
    const dialog = this.dialog();
    if (
      !dialog ||
      !dialog.open ||
      !dialog.matches(":modal") ||
      dialog.getAttribute("closedby") !== "any" ||
      event.target !== dialog
    )
      return null;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
      ? dialog
      : null;
  };
  /** closedby未対応環境で、背景を押した位置ならそのdialogを返す。 */
  private backdropDialog = (event: MouseEvent) => {
    const dialog = this.backdropTarget(event);
    return dialog && !Reflect.has(dialog, "closedBy") ? dialog : null;
  };

  private startBackdrop = (event: PointerEvent) => {
    this.backdropStart = event.button === 0 ? this.backdropTarget(event) : null;
  };
  private resetBackdrop = () => {
    this.backdropStart = null;
  };
  private closeFromBackdrop = (event: MouseEvent) => {
    const start = this.backdropStart;
    this.resetBackdrop();
    if (event.defaultPrevented || !start || this.backdropDialog(event) !== start) return;
    this.closeWith("pointer");
  };
  /**
   * closedby対応環境では、背景を押すとブラウザがcancelを発火し、上流はそれをEscapeと同じkeyboardとして扱う。
   * 背景から押し始めたcancelだけを受け取り、未対応環境の補完と同じpointerとして閉じる。
   */
  private cancelFromBackdrop = (event: Event) => {
    const start = this.backdropStart;
    this.resetBackdrop();
    if (!event.isTrusted || !start || event.target !== start) return;
    event.preventDefault();
    event.stopPropagation();
    this.closeWith("pointer");
  };

  /**
   * `method="dialog"`の送信はブラウザがdialogを閉じるだけで、上流はイベントを発火しない。
   * 送信を受け取って同じ閉じ方にし、送信した操作の`value`をreturnValueとして渡す。
   */
  private closeFromSubmit = (event: SubmitEvent) => {
    const dialog = this.dialog();
    const form = event.target;
    if (
      event.defaultPrevented ||
      !dialog?.open ||
      !(form instanceof HTMLFormElement) ||
      form.closest("dialog") !== dialog
    )
      return;
    const submitter = event.submitter;
    const method = submitter?.hasAttribute("formmethod")
      ? submitter.getAttribute("formmethod")
      : form.getAttribute("method");
    if (method?.toLowerCase() !== "dialog") return;
    event.preventDefault();
    const returnValue =
      submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement
        ? submitter.value
        : "";
    this.closeWith("submit", returnValue);
  };

  private sheet = () => {
    const dialog = this.dialog();
    if (!dialog?.open) return null;
    return getComputedStyle(dialog).getPropertyValue("--rx-dialog-sheet").trim() === "1"
      ? dialog
      : null;
  };

  /** ハンドルのある上端と見出しからドラッグし始めた時だけ扱う。本文のスクロールと操作は妨げない。 */
  private startSwipe = (event: PointerEvent) => {
    const dialog = this.sheet();
    const target = event.target;
    if (!dialog || event.button !== 0 || !(target instanceof Element)) return;
    const fromHandle = target === dialog && event.clientY < dialog.getBoundingClientRect().top + 32;
    const fromHeading =
      target.closest(".heading") !== null &&
      target.closest("button, a, input, select, textarea") === null;
    if (!fromHandle && !fromHeading) return;
    this.swipe = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startTime: event.timeStamp,
      offset: 0,
    };
    dialog.setPointerCapture(event.pointerId);
    dialog.dataset.dragging = "true";
  };

  private moveSwipe = (event: PointerEvent) => {
    const dialog = this.sheet();
    if (!dialog || !this.swipe || event.pointerId !== this.swipe.pointerId) return;
    this.swipe.offset = Math.max(0, event.clientY - this.swipe.startY);
    dialog.style.translate = `0 ${this.swipe.offset}px`;
  };

  private endSwipe = (event: PointerEvent) => {
    const swipe = this.swipe;
    const dialog = this.sheet();
    if (!swipe || event.pointerId !== swipe.pointerId) return;
    this.cancelSwipe();
    if (!dialog) return;
    const velocity = swipe.offset / Math.max(1, event.timeStamp - swipe.startTime);
    const far = swipe.offset > Math.min(160, dialog.offsetHeight * 0.3);
    // 触れただけや少しの揺れでは閉じない。
    if (swipe.offset < 24 || (!far && velocity < 0.6)) return;
    this.closeWith("swipe");
  };

  /** ドラッグ位置の指定を外すと、閉じる時は下へ、戻す時は元の位置へ、CSSのトランジションで動く。 */
  private cancelSwipe = () => {
    const dialog = this.dialog();
    this.swipe = null;
    if (!dialog) return;
    delete dialog.dataset.dragging;
    dialog.style.removeProperty("translate");
  };
}
