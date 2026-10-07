import { Controller } from "@hotwired/stimulus";

/** チェックの変化に合わせて、見出しの完了数と進捗を数え直す。 */
export class TaskListController extends Controller<HTMLElement> {
  static targets = ["done"];
  declare readonly doneTarget: HTMLElement;
  declare readonly hasDoneTarget: boolean;

  connect = () => {
    this.update();
  };

  update = () => {
    const boxes = Array.from(
      this.element.querySelectorAll<HTMLInputElement>(
        ".rx-task-list > .sheet > li > .rx-choice > input[type='checkbox']",
      ),
    );
    const done = boxes.filter((box) => box.checked).length;
    this.element.style.setProperty(
      "--rx-task-progress",
      String(boxes.length ? done / boxes.length : 0),
    );
    if (boxes.length > 0 && done === boxes.length) this.element.dataset.complete = "true";
    else delete this.element.dataset.complete;
    if (this.hasDoneTarget) this.doneTarget.textContent = String(done);
  };
}
