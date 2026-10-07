import { SliderController } from "@tknf/stimulus-ui";

/** 上流の操作・制約に、現在値の表示と数値入力を加える。 */
export class RangeController extends SliderController {
  private presentationForms = new Set<HTMLFormElement>();
  private presentationReset: number | undefined;
  private presentationReady = false;

  constructor(...args: ConstructorParameters<typeof SliderController>) {
    super(...args);
    // 上流のライフサイクルはインスタンス関数なので、保持してから表示処理を追加する。
    const connectSlider = this.connect;
    const disconnectSlider = this.disconnect;
    this.connect = () => {
      connectSlider();
      this.element.addEventListener("input", this.reflectInput);
      this.element.addEventListener("change", this.commitNumber);
      for (const input of this.rangeInputs()) {
        if (input.form) this.presentationForms.add(input.form);
      }
      for (const form of this.presentationForms) form.addEventListener("reset", this.resetDisplay);
      this.reflectValues();
    };
    this.disconnect = () => {
      this.element.removeEventListener("input", this.reflectInput);
      this.element.removeEventListener("change", this.commitNumber);
      for (const form of this.presentationForms)
        form.removeEventListener("reset", this.resetDisplay);
      this.presentationForms.clear();
      window.clearTimeout(this.presentationReset);
      this.presentationReady = false;
      delete this.element.dataset.motion;
      disconnectSlider();
    };
  }

  override get value() {
    return super.value;
  }
  override set value(value: number) {
    super.value = value;
    this.reflectValues();
  }
  override get start() {
    return super.start;
  }
  override set start(value: number) {
    super.start = value;
    this.reflectValues();
  }
  override get end() {
    return super.end;
  }
  override set end(value: number) {
    super.end = value;
    this.reflectValues();
  }

  private rangeInputs = () =>
    this.inputTargets.filter(
      (input): input is HTMLInputElement => input instanceof HTMLInputElement,
    );

  private reflectValues = () => {
    // 初期表示は確定位置で描画し、操作による変更から移動を補間する。
    if (this.presentationReady) this.element.dataset.motion = "";
    this.presentationReady = true;
    const inputs = this.rangeInputs();
    const input = inputs[0];
    const output = this.element.querySelector("output");
    if (input && output) {
      output.value = `${input.value}${output.dataset.rangeUnit ?? ""}`;
      output.hidden = false;
    }
    const values = this.element.querySelector<HTMLElement>(".values");
    if (values) values.hidden = false;
    for (const number of this.element.querySelectorAll<HTMLInputElement>(
      "input[data-range-bound]",
    )) {
      const range = inputs[number.dataset.rangeBound === "start" ? 0 : 1];
      if (range) number.value = range.value;
    }
  };

  private reflectInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement && event.target.type === "range")
      this.reflectValues();
  };

  private commitNumber = (event: Event) => {
    const input = event.target;
    if (
      input instanceof HTMLInputElement &&
      input.type === "number" &&
      Number.isFinite(input.valueAsNumber)
    ) {
      if (input.dataset.rangeBound === "start") this.start = input.valueAsNumber;
      if (input.dataset.rangeBound === "end") this.end = input.valueAsNumber;
    }
    this.reflectValues();
  };

  private resetDisplay = () => {
    window.clearTimeout(this.presentationReset);
    this.presentationReset = window.setTimeout(this.reflectValues, 0);
  };
}
