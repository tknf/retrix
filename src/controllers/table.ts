import { Controller } from "@hotwired/stimulus";
import { TableSelectController, type TableSortSortDetail } from "@tknf/stimulus-ui";

const sortDetail = (value: unknown): value is TableSortSortDetail =>
  typeof value === "object" &&
  value !== null &&
  "column" in value &&
  typeof value.column === "string" &&
  "direction" in value &&
  (value.direction === "ascending" ||
    value.direction === "descending" ||
    value.direction === "none") &&
  "previousColumn" in value &&
  typeof value.previousColumn === "string" &&
  "previousDirection" in value &&
  (value.previousDirection === "ascending" ||
    value.previousDirection === "descending" ||
    value.previousDirection === "none") &&
  "reason" in value &&
  (value.reason === "pointer" || value.reason === "keyboard");

/** 並べ替え要求と選択の管理は上流。ここは行の比較と選択バーを接続する。 */
export class TableController extends Controller<HTMLElement> {
  private original = new Map<HTMLTableRowElement, number>();
  private nextIndex = 0;
  private observer: MutationObserver | null = null;
  private forms = new Set<HTMLFormElement>();
  private resetTask: number | undefined;
  connect = () => {
    // JavaScriptがない時は表の下に置いている選択バーを、接続したら浮かぶパネル（popover）にする。
    this.bar()?.setAttribute("popover", "manual");
    this.element.addEventListener("click", this.click);
    this.element.addEventListener("change", this.nativeChange);
    this.element.addEventListener("table-sort:beforesort", this.beforeSort);
    this.element.addEventListener("table-sort:sort", this.sorted);
    this.element.addEventListener("table-select:change", this.selectionChanged);
    this.observer = new MutationObserver(this.refresh);
    this.observer.observe(this.element, { childList: true, subtree: true });
    this.refresh();
  };
  disconnect = () => {
    this.element.removeEventListener("click", this.click);
    this.element.removeEventListener("change", this.nativeChange);
    this.element.removeEventListener("table-sort:beforesort", this.beforeSort);
    this.element.removeEventListener("table-sort:sort", this.sorted);
    this.element.removeEventListener("table-select:change", this.selectionChanged);
    for (const form of this.forms) form.removeEventListener("reset", this.reset);
    this.forms.clear();
    this.observer?.disconnect();
    window.clearTimeout(this.resetTask);
    const bar = this.bar();
    if (bar?.matches(":popover-open")) bar.hidePopover();
    bar?.removeAttribute("popover");
  };
  private table = () => this.element.querySelector<HTMLTableElement>(":scope > table");
  private bar = () => this.element.querySelector<HTMLElement>(":scope > .selection-bar");
  private own = (element: Element) => element.closest(".rx-table") === this.element;
  private rows = () =>
    Array.from(this.element.querySelectorAll<HTMLTableRowElement>(":scope > table > tbody > tr"));
  private checks = () =>
    Array.from(
      this.element.querySelectorAll<HTMLInputElement>('input[data-table-select-target="item"]'),
    ).filter(this.own);
  refresh = () => {
    for (const row of this.rows())
      if (!this.original.has(row)) this.original.set(row, this.nextIndex++);
    for (const row of this.original.keys())
      if (!this.element.contains(row)) this.original.delete(row);
    for (const button of this.element.querySelectorAll<HTMLButtonElement>(
      "button[data-table-sort]",
    ))
      if (this.own(button))
        button.disabled =
          this.element.dataset.state !== "ready" || button.dataset.sortDisabled === "true";
    const forms = new Set(
      this.checks()
        .map((input) => input.form)
        .filter((form): form is HTMLFormElement => form !== null),
    );
    for (const form of this.forms)
      if (!forms.has(form)) form.removeEventListener("reset", this.reset);
    for (const form of forms) if (!this.forms.has(form)) form.addEventListener("reset", this.reset);
    this.forms = forms;
    this.selection(false);
  };
  private announce = (message: string) => {
    const status = this.element.querySelector(":scope > [data-table-announcement]");
    if (status && status.textContent !== message) status.textContent = message;
  };
  private selection = (notify: boolean) => {
    const selected = this.checks().filter((input) => input.checked);
    for (const input of this.checks()) {
      const row = input.closest("tr");
      if (row) row.dataset.selected = String(input.checked);
    }
    const bar = this.bar();
    if (bar?.hasAttribute("popover")) {
      // 選択バーは浮かぶパネル（popover）。選んでいる間だけ出し、表は動かさない。
      const open = bar.matches(":popover-open");
      if (selected.length > 0 && !open) bar.showPopover();
      if (selected.length === 0 && open) bar.hidePopover();
      // 閉じるアニメーションの途中で「0件選択」に変わらないよう、件数は選んでいる間だけ書き換える。
      const count = bar.querySelector(".count");
      const text = selected.length + "件選択";
      if (selected.length > 0 && count && count.textContent !== text) count.textContent = text;
    }
    if (notify)
      this.element.dispatchEvent(
        new CustomEvent("table:selectionchange", {
          bubbles: true,
          detail: {
            ids: selected.map((input) => input.dataset.tableSelectValue),
            count: selected.length,
            scope: "rendered",
          },
        }),
      );
  };
  private reset = () => {
    this.resetTask = window.setTimeout(() => this.selection(false), 0);
  };
  private nativeChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement && this.own(event.target)) this.selection(false);
  };
  private selectionChanged = (event: Event) => {
    if (event.target === this.table()) this.selection(true);
  };
  private click = (event: MouseEvent) => {
    if (
      !(event.target instanceof Element) ||
      !this.own(event.target) ||
      !event.target.closest("[data-table-clear]")
    )
      return;
    const table = this.table();
    if (!table) return;
    const controller = this.application.getControllerForElementAndIdentifier(table, "table-select");
    if (!(controller instanceof TableSelectController)) return;
    controller.selected = [];
    this.selection(true);
    table.querySelector<HTMLInputElement>('input[data-table-select-target="all"]')?.focus();
  };
  private beforeSort = (event: Event) => {
    if (!(event instanceof CustomEvent) || event.target !== this.table()) return;
    const detail: unknown = event.detail;
    if (!sortDetail(detail)) return;
    if (
      !this.element.dispatchEvent(
        new CustomEvent("table:beforesort", { bubbles: true, cancelable: true, detail }),
      )
    )
      event.preventDefault();
  };
  private sorted = (event: Event) => {
    if (!(event instanceof CustomEvent) || event.target !== this.table()) return;
    const detail: unknown = event.detail;
    if (!sortDetail(detail)) return;
    const heading = Array.from(
      this.element.querySelectorAll<HTMLTableCellElement>(":scope > table > thead > tr > th"),
    ).find((th) => th.dataset.tableSortColumn === detail.column);
    const button = heading?.querySelector<HTMLButtonElement>("button[data-table-sort]");
    if (!heading || !button) return;
    if (this.element.dataset.sortMode === "local") {
      const rows = this.rows();
      const collator = new Intl.Collator(
        this.element.lang || document.documentElement.lang || "ja",
        { numeric: true, sensitivity: "base" },
      );
      const read = (row: HTMLTableRowElement) => {
        const cell = row.cells.item(heading.cellIndex);
        const text = (cell?.dataset.sortValue ?? cell?.textContent ?? "").trim();
        if (!text) return null;
        if (button.dataset.sortType === "number") {
          const value = Number(text.replaceAll(",", ""));
          return Number.isFinite(value) ? value : null;
        }
        if (button.dataset.sortType === "date") {
          const value = Date.parse(text);
          return Number.isFinite(value) ? value : null;
        }
        return text;
      };
      rows.sort((a, b) => {
        const stable = (this.original.get(a) ?? 0) - (this.original.get(b) ?? 0);
        if (detail.direction === "none") return stable;
        const left = read(a),
          right = read(b);
        if (left === null || right === null)
          return left === right ? stable : left === null ? 1 : -1;
        const result =
          typeof left === "number" && typeof right === "number"
            ? left - right
            : collator.compare(String(left), String(right));
        return (detail.direction === "ascending" ? result : -result) || stable;
      });
      for (const body of this.element.querySelectorAll(":scope > table > tbody"))
        body.append(...rows.filter((row) => row.parentElement === body));
      this.announce(
        (button.textContent ?? "").replace(/[↕↑↓]/g, "").trim() +
          (detail.direction === "none"
            ? "を元の順に戻しました。"
            : detail.direction === "ascending"
              ? "を昇順に並べました。"
              : "を降順に並べました。"),
      );
    }
    for (const th of this.element.querySelectorAll<HTMLTableCellElement>(
      ":scope > table > thead > tr > th",
    )) {
      const indicator = th.querySelector(".indicator");
      if (indicator)
        indicator.textContent =
          th.dataset.tableSortColumn === detail.column
            ? detail.direction === "ascending"
              ? "↑"
              : detail.direction === "descending"
                ? "↓"
                : "↕"
            : "↕";
    }
    this.element.dispatchEvent(new CustomEvent("table:sort", { bubbles: true, detail }));
  };
}
