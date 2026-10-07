import { ComboboxController as BaseComboboxController } from "@tknf/stimulus-ui";

const comboboxAttributes = [
  "role",
  "aria-controls",
  "aria-expanded",
  "aria-autocomplete",
  "aria-activedescendant",
] as const;

/**
 * 上流のComboboxに、接続中だけ候補の操作を見せること、選んだ値の標準の`input`・`change`、
 * 閲覧専用入力での候補操作の遮断を加える。
 */
export class ComboboxController extends BaseComboboxController {
  constructor(...args: ConstructorParameters<typeof BaseComboboxController>) {
    super(...args);
    const connectBase = this.connect;
    const disconnectBase = this.disconnect;
    this.connect = () => {
      // JavaScriptが無い時は一行の入力なので、候補を開く役割と操作は接続してから付ける。
      const input = this.inputTargets[0];
      const listbox = this.listboxTargets[0];
      if (input && listbox) {
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-controls", listbox.id);
      }
      connectBase();
      this.element.addEventListener("click", this.guardReadonly, true);
      this.element.addEventListener("keydown", this.guardReadonly, true);
      this.element.addEventListener("combobox:change", this.notifyInput);
      const toggle = this.toggleButton();
      if (toggle) toggle.hidden = false;
    };
    this.disconnect = () => {
      this.element.removeEventListener("click", this.guardReadonly, true);
      this.element.removeEventListener("keydown", this.guardReadonly, true);
      this.element.removeEventListener("combobox:change", this.notifyInput);
      disconnectBase();
      const toggle = this.toggleButton();
      if (toggle) toggle.hidden = true;
      const input = this.inputTargets[0];
      if (input) for (const attribute of comboboxAttributes) input.removeAttribute(attribute);
    };
  }

  private toggleButton = () => this.element.querySelector<HTMLButtonElement>(":scope > .toggle");

  private guardReadonly = (event: Event) => {
    const input = this.inputTargets[0];
    if (input && !input.matches(":disabled") && !input.readOnly) return;
    this.open = false;
    event.stopImmediatePropagation();
  };

  /** 候補で欄の値を変えた時も、入力して変えた時と同じく標準の`input`・`change`を発火する。 */
  private notifyInput = (event: Event) => {
    if (event.target !== this.element || this.multipleValue) return;
    const input = this.inputTargets[0];
    if (!input) return;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
}
