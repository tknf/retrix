import { Controller } from "@hotwired/stimulus";

export class CommandDemoController extends Controller<HTMLElement> {
  selected = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    if (
      !detail ||
      typeof detail !== "object" ||
      !("value" in detail) ||
      typeof detail.value !== "string"
    )
      return;
    const output = this.element.querySelector("output");
    if (output) output.textContent = `選択した操作：${detail.value}`;
  };
}
