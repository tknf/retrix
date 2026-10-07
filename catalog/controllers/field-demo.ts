import { Controller } from "@hotwired/stimulus";

export class FieldDemoController extends Controller<HTMLFormElement> {
  record = (event: Event) => {
    const input = event.target;
    const output = this.element.querySelector("output");
    if (!(input instanceof HTMLInputElement) || !output) return;
    output.textContent = `${input.labels?.[0]?.textContent ?? "入力"}：${input.value || "未入力"}`;
  };

  reset = () => {
    const output = this.element.querySelector("output");
    if (output) output.textContent = "入力を初期値に戻しました。";
  };
}
