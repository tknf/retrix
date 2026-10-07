import { Controller } from "@hotwired/stimulus";
import { EditableController } from "@tknf/stimulus-ui";

/** 上流Editableの確定値を表示へ反映する。 */
export class EditablePropertyController extends Controller<HTMLElement> {
  static targets = ["input", "value"];
  static values = { empty: String };

  declare readonly inputTarget: HTMLInputElement | HTMLTextAreaElement;
  declare readonly valueTarget: HTMLElement;
  declare readonly emptyValue: string;

  private form: HTMLFormElement | null = null;
  private resetTask: number | undefined;
  private savedTask: number | undefined;

  connect = () => {
    this.form = this.inputTarget.form;
    this.form?.addEventListener("reset", this.afterReset);
  };

  disconnect = () => {
    this.form?.removeEventListener("reset", this.afterReset);
    window.clearTimeout(this.resetTask);
    window.clearTimeout(this.savedTask);
    delete this.element.dataset.saved;
    this.form = null;
  };

  /** 確定した値を表示へ移し、完了のマークをしばらく出す。 */
  commit = () => {
    this.sync();
    window.clearTimeout(this.savedTask);
    delete this.element.dataset.saved;
    // 続けて確定した時もマークを描き直すため、属性を外した状態を一度描画させる。
    void this.element.offsetWidth;
    this.element.dataset.saved = "true";
    this.savedTask = window.setTimeout(() => delete this.element.dataset.saved, 1600);
  };

  /**
   * 値そのものを押した時も、鉛筆と同じく編集を始める。文字を選択している時は選択を優先する。
   * 上流は鉛筆の押下だけを利用者の操作として扱い、公開のedit()はイベントを発火しないので、
   * 鉛筆と同じeditable:beforeedit（取り消し可能）とeditable:editをここで発火する。
   */
  start = (event: Event) => {
    if (!window.getSelection()?.isCollapsed) return;
    const editable = this.application.getControllerForElementAndIdentifier(
      this.element,
      "editable",
    );
    const input = this.inputTarget;
    if (
      !(editable instanceof EditableController) ||
      editable.editing ||
      input.matches(":disabled") ||
      input.readOnly ||
      this.element.querySelector('[data-editable-target="edit"]:disabled')
    )
      return;
    const detail = {
      value: input.value,
      previousValue: input.value,
      reason: event instanceof MouseEvent && event.detail === 0 ? "keyboard" : "pointer",
    };
    const before = new CustomEvent("editable:beforeedit", {
      detail,
      bubbles: true,
      cancelable: true,
    });
    if (!this.element.dispatchEvent(before) || !editable.edit()) return;
    // editable:editを受けて全体を選択する（data-actionのselect）。鉛筆で編集を始めた時と同じ流れにする。
    this.element.dispatchEvent(new CustomEvent("editable:edit", { detail, bubbles: true }));
  };

  /** 編集を始めたら、一行の値は全体を選択し、そのまま入力すれば置き換わるようにする。複数行は追記できるようカーソルを末尾に置く。 */
  select = () => {
    const input = this.inputTarget;
    if (input instanceof HTMLInputElement) input.select();
    else input.setSelectionRange(input.value.length, input.value.length);
  };

  sync = () => {
    this.valueTarget.textContent = this.inputTarget.value || this.emptyValue;
    if (this.inputTarget.value) delete this.valueTarget.dataset.empty;
    else this.valueTarget.dataset.empty = "true";
  };

  private afterReset = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (!event.defaultPrevented) this.sync();
    }, 0);
  };
}
