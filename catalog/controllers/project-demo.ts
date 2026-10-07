import { Controller } from "@hotwired/stimulus";

/**
 * 利用例のプロジェクトの画面の動き。ボードの項目をキーワードと担当で絞り込み、Dialogから新しい項目を「これから」へ追加する。
 * 項目を移動する動きはBoardControllerが持つ。
 */
export class ProjectDemoController extends Controller<HTMLElement> {
  private query = "";
  private person = "all";

  connect = () => {
    for (const button of this.element.querySelectorAll<HTMLButtonElement>(
      'button[type="submit"][form="project-add-form"]',
    ))
      button.disabled = false;
  };

  private items = () =>
    Array.from(this.element.querySelectorAll<HTMLElement>(".rx-board .rx-board-item"));

  private apply = () => {
    let visible = 0;
    for (const item of this.items()) {
      const label = (item.dataset.boardLabel ?? "").toLocaleLowerCase();
      const owner = item.querySelector<HTMLElement>("[data-owner]")?.dataset.owner;
      item.hidden = !label.includes(this.query) || (this.person !== "all" && owner !== this.person);
      if (!item.hidden) visible += 1;
    }
    const status = this.element.querySelector('[data-project-demo-target="filterStatus"]');
    if (status)
      status.textContent =
        this.query || this.person !== "all" ? `${visible}件のタスクが見つかりました。` : "";
  };

  filter = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.query = event.target.value.trim().toLocaleLowerCase();
    this.apply();
  };

  /** 担当の切り替え（ToggleGroupのtoggle-group:change）。何も選ばない時は全員に戻す。 */
  owner = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    const selected =
      typeof detail === "object" && detail !== null && "selected" in detail
        ? detail.selected
        : undefined;
    const value = Array.isArray(selected) ? selected[0] : undefined;
    this.person = typeof value === "string" ? value : "all";
    this.apply();
  };

  add = (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.elements.namedItem("task");
    if (!(input instanceof HTMLInputElement)) return;
    const title = input.value.trim();
    if (!title) {
      input.setCustomValidity("タスクの名前を入力してください。");
      input.reportValidity();
      input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
      return;
    }
    const template = this.items()[0];
    const column = this.element.querySelector(".rx-board > section > .items");
    if (!template || !column) return;
    const item = template.cloneNode(true);
    if (!(item instanceof HTMLElement)) return;
    item.hidden = false;
    item.dataset.boardId = `new-${Date.now()}`;
    item.dataset.boardLabel = title;
    const code = item.querySelector(":scope > .code");
    if (code) code.textContent = "新規";
    const body = item.querySelector(":scope > .body");
    if (body) {
      const heading = document.createElement("h4");
      heading.textContent = title;
      const owner = body.querySelector("[data-owner]");
      body.replaceChildren(heading, ...(owner ? [owner] : []));
    }
    item
      .querySelector(":scope > [data-board-handle]")
      ?.setAttribute("aria-label", `「${title}」を移動`);
    column.prepend(item);
    const count = column.parentElement?.querySelector(":scope > .title > small");
    if (count)
      count.textContent = String(column.querySelectorAll(":scope > .rx-board-item").length);
    input.value = "";
    input.focus();
    const status = this.element.querySelector('[data-project-demo-target="status"]');
    if (status) status.textContent = `${title}を追加しました。`;
  };
}
