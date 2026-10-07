import { Controller } from "@hotwired/stimulus";
/** 表の選択値をフォームから受け取る最小の接続例。 */
export class TableDemoController extends Controller<HTMLFormElement> {
  confirm = (event: SubmitEvent) => {
    event.preventDefault();
    const output = this.element.querySelector("output");
    if (output)
      output.textContent =
        "選択したID: " +
        new FormData(this.element)
          .getAll("ids")
          .filter((value): value is string => typeof value === "string")
          .join(", ");
  };
}
