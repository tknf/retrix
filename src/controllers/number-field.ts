import { NumberFieldController as BaseNumberFieldController } from "@tknf/stimulus-ui";

/** 上流の数値入力に、PageUp・PageDownで変えた値の標準の`input`・`change`を加える。 */
export class NumberFieldController extends BaseNumberFieldController {
  private paging = false;

  constructor(...args: ConstructorParameters<typeof BaseNumberFieldController>) {
    super(...args);
    const connectBase = this.connect;
    const disconnectBase = this.disconnect;
    this.connect = () => {
      this.element.addEventListener("keydown", this.watchPageKey, true);
      this.element.addEventListener("input", this.clearPageKey, true);
      this.element.addEventListener("number-field:change", this.notifyInput);
      connectBase();
    };
    this.disconnect = () => {
      this.element.removeEventListener("keydown", this.watchPageKey, true);
      this.element.removeEventListener("input", this.clearPageKey, true);
      this.element.removeEventListener("number-field:change", this.notifyInput);
      this.paging = false;
      disconnectBase();
    };
  }

  // 上流はPageUp・PageDownのkeydownの中で値を変え、number-field:changeを発火する。
  private watchPageKey = (event: KeyboardEvent) => {
    this.paging = event.key === "PageUp" || event.key === "PageDown";
  };

  // 標準の操作で値が変わる時は、ブラウザがinputを発火するので重ねて発火しない。
  private clearPageKey = () => {
    this.paging = false;
  };

  private notifyInput = (event: Event) => {
    if (!this.paging || event.target !== this.element) return;
    this.paging = false;
    this.element.dispatchEvent(new Event("input", { bubbles: true }));
    this.element.dispatchEvent(new Event("change", { bubbles: true }));
  };
}
