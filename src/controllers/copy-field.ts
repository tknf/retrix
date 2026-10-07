import { Controller } from "@hotwired/stimulus";

/** コピー処理はClipboardControllerに任せ、コピーした時のアイコンの切り替えと読み上げを受け持つ。 */
export class CopyFieldController extends Controller<HTMLElement> {
  static targets = ["trigger", "status", "failure"];
  static values = { copied: String };
  declare readonly triggerTarget: HTMLButtonElement;
  declare readonly statusTarget: HTMLElement;
  declare readonly failureTarget: HTMLElement;
  declare readonly hasFailureTarget: boolean;
  declare readonly copiedValue: string;
  private timer: number | null = null;

  // コピーボタンはJavaScriptが無いと押しても何も起きないので、接続してから表示する。
  connect = () => {
    this.triggerTarget.hidden = !navigator.clipboard?.writeText;
    this.element.addEventListener("clipboard:beforecopy", this.clearFailure);
    this.element.addEventListener("clipboard:copy", this.copied);
  };
  disconnect = () => {
    this.element.removeEventListener("clipboard:beforecopy", this.clearFailure);
    this.element.removeEventListener("clipboard:copy", this.copied);
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    delete this.element.dataset.copied;
    this.clearFailure();
    this.triggerTarget.hidden = true;
  };
  /** 入力欄にフォーカスしたら値を全て選択し、キーボードでもコピーできるようにする。 */
  select = (event: Event) => {
    if (event.target instanceof HTMLInputElement) event.target.select();
  };
  private clearFailure = () => {
    if (this.hasFailureTarget) this.failureTarget.hidden = true;
    this.statusTarget.textContent = "";
  };
  private copied = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    if (!event.detail?.ok) {
      // コピーできなかった時は、アイコンを変えずに入力欄の下へ理由とコピーする方法を表示し、読み上げる。
      if (this.timer !== null) window.clearTimeout(this.timer);
      this.timer = null;
      delete this.element.dataset.copied;
      if (!this.hasFailureTarget) return;
      this.failureTarget.hidden = false;
      this.statusTarget.textContent = this.failureTarget.textContent?.trim() ?? "";
      return;
    }
    this.clearFailure();
    this.element.dataset.copied = "true";
    this.statusTarget.textContent = this.copiedValue;
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      delete this.element.dataset.copied;
      this.statusTarget.textContent = "";
    }, 1800);
  };
}
