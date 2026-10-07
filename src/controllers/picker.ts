import { Controller } from "@hotwired/stimulus";
import { ComboboxController } from "@tknf/stimulus-ui";
import { cloneRemovableTag } from "../internal/tag-chip";

/** 標準selectの送信値と、検索用Comboboxの選択状態を同期する。 */
export class PickerController extends Controller<HTMLElement> {
  static targets = ["label", "native", "search", "values", "template", "listbox", "option", "note"];
  static values = { multiple: Boolean };

  declare readonly labelTarget: HTMLLabelElement;
  declare readonly nativeTarget: HTMLSelectElement;
  declare readonly searchTarget: HTMLInputElement;
  declare readonly valuesTarget: HTMLUListElement;
  declare readonly templateTarget: HTMLTemplateElement;
  declare readonly listboxTarget: HTMLUListElement;
  declare readonly optionTargets: HTMLLIElement[];
  declare readonly noteTarget: HTMLElement;
  declare readonly multipleValue: boolean;

  private form: HTMLFormElement | null = null;
  private resetTask: number | undefined;

  connect = () => {
    this.form = this.nativeTarget.form;
    this.nativeTarget.addEventListener("change", this.fromNative);
    this.nativeTarget.addEventListener("invalid", this.focusSearch);
    this.form?.addEventListener("reset", this.afterReset);
    this.element.addEventListener("input", this.filter);
    this.element.addEventListener("compositionend", this.filter);
    this.element.addEventListener("focusin", this.openOnFocus);
    this.element.addEventListener("click", this.handleClick);
    this.element.addEventListener("combobox:beforechange", this.alignSelectionDetail, true);
    queueMicrotask(() => {
      if (!this.element.isConnected) return;
      this.labelTarget.htmlFor = this.searchTarget.id;
      this.nativeTarget.hidden = true;
      this.searchTarget.hidden = false;
      this.fromNative();
    });
  };

  disconnect = () => {
    this.nativeTarget.removeEventListener("change", this.fromNative);
    this.nativeTarget.removeEventListener("invalid", this.focusSearch);
    this.form?.removeEventListener("reset", this.afterReset);
    this.element.removeEventListener("input", this.filter);
    this.element.removeEventListener("compositionend", this.filter);
    this.element.removeEventListener("focusin", this.openOnFocus);
    this.element.removeEventListener("click", this.handleClick);
    this.element.removeEventListener("combobox:beforechange", this.alignSelectionDetail, true);
    window.clearTimeout(this.resetTask);
    this.form = null;
    this.labelTarget.htmlFor = this.nativeTarget.id;
    this.nativeTarget.hidden = false;
    this.searchTarget.hidden = true;
    this.valuesTarget.hidden = true;
  };

  selectionChanged = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    if (this.nativeTarget.disabled) return;
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null || !("value" in detail)) return;
    const value = detail.value;
    if (typeof value !== "string") return;
    const selected = this.selectedValues();
    const next = this.multipleValue
      ? selected.includes(value)
        ? selected.filter((candidate) => candidate !== value)
        : [...selected, value]
      : [value];
    // 一つを選ぶ時に選択済みの候補を選び直しても、標準のselectと同じく変更イベントを発火しない。
    if (
      next.length === selected.length &&
      next.every((candidate, index) => candidate === selected[index])
    )
      this.fromNative();
    else this.commit(next);
    const combobox = this.combobox();
    if (combobox) {
      combobox.value = "";
      combobox.open = false;
    }
    this.searchTarget.focus({ preventScroll: true });
    this.showAllOptions();
  };

  /**
   * 検索欄のComboboxは選択を保つために常に複数選択で動く。一つを選ぶ時は、
   * `combobox:beforechange`のdetail.selectedを実際に選ぶ結果（押した候補だけ）に直す。
   */
  private alignSelectionDetail = (event: Event) => {
    if (this.multipleValue || event.target !== this.element || !(event instanceof CustomEvent))
      return;
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null) return;
    if (!("value" in detail) || typeof detail.value !== "string") return;
    if (!("selected" in detail) || !Array.isArray(detail.selected)) return;
    detail.selected.splice(0, detail.selected.length, detail.value);
  };

  /** 非同期で取得した候補を入れ替える。既存の選択値が残る場合は保持する。 */
  replaceOptions = (options: readonly { value: string; label: string; disabled?: boolean }[]) => {
    const before = this.selectedValues();
    const seen = new Set<string>();
    const candidates = options.filter((option) => {
      if (option.value.trim() === "" || seen.has(option.value)) return false;
      seen.add(option.value);
      return true;
    });
    const nativeOptions = candidates.map((candidate) => {
      const option = new Option(
        candidate.label,
        candidate.value,
        false,
        before.includes(candidate.value),
      );
      option.disabled = candidate.disabled ?? false;
      return option;
    });
    if (!this.multipleValue) nativeOptions.unshift(new Option("選択してください", ""));
    const visibleOptions = candidates.map((candidate, index) => {
      const option = document.createElement("li");
      option.id = `${this.searchTarget.id}-option-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(before.includes(candidate.value)));
      if (candidate.disabled) option.setAttribute("aria-disabled", "true");
      option.dataset.comboboxTarget = "option";
      option.dataset.pickerTarget = "option";
      option.dataset.comboboxValue = candidate.value;
      option.textContent = candidate.label;
      return option;
    });
    this.nativeTarget.replaceChildren(...nativeOptions);
    this.listboxTarget.replaceChildren(...visibleOptions);
    this.showAllOptions();
    queueMicrotask(() => {
      if (!this.element.isConnected) return;
      this.fromNative();
      const after = this.selectedValues();
      if (before.length !== after.length || before.some((value, index) => value !== after[index])) {
        this.nativeTarget.dispatchEvent(new Event("input", { bubbles: true }));
        this.nativeTarget.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  };

  private combobox = () => {
    const controller = this.application.getControllerForElementAndIdentifier(
      this.element,
      "combobox",
    );
    return controller instanceof ComboboxController ? controller : null;
  };

  private selectedValues = () =>
    Array.from(this.nativeTarget.selectedOptions)
      .map((option) => option.value)
      .filter((value) => value !== "");

  private fromNative = () => {
    const selected = this.selectedValues();
    const combobox = this.combobox();
    if (combobox) combobox.selected = selected;
    this.renderValues(selected);
  };

  private commit = (values: readonly string[]) => {
    const allowed = new Set(
      Array.from(this.nativeTarget.options)
        .filter((option) => option.value !== "" && !option.disabled)
        .map((option) => option.value),
    );
    const selected = this.multipleValue
      ? values.filter((value) => allowed.has(value))
      : values.slice(0, 1);
    for (const option of this.nativeTarget.options)
      option.selected = selected.includes(option.value) && allowed.has(option.value);
    this.fromNative();
    this.searchTarget.removeAttribute("aria-invalid");
    this.searchTarget.removeAttribute("data-invalid");
    this.noteTarget.textContent = "一致する候補はありません。";
    this.noteTarget.hidden = true;
    this.nativeTarget.dispatchEvent(new Event("input", { bubbles: true }));
    this.nativeTarget.dispatchEvent(new Event("change", { bubbles: true }));
    this.element.dispatchEvent(
      new CustomEvent("picker:change", {
        bubbles: true,
        detail: { selected: this.selectedValues(), value: this.nativeTarget.value },
      }),
    );
  };

  private renderValues = (selected: readonly string[]) => {
    const items = selected.flatMap((value) => {
      const option = Array.from(this.nativeTarget.options).find(
        (candidate) => candidate.value === value,
      );
      if (!option) return [];
      const { item, remove } = cloneRemovableTag(this.templateTarget, option.text);
      remove.dataset.pickerRemove = value;
      remove.disabled = this.nativeTarget.disabled;
      return [item];
    });
    this.valuesTarget.replaceChildren(...items);
    this.valuesTarget.hidden = items.length === 0;
  };

  private showAllOptions = () => {
    this.searchTarget.value = "";
    for (const option of this.optionTargets) option.hidden = false;
    this.noteTarget.hidden = true;
  };

  private filter = (event: Event) => {
    if (event.target !== this.searchTarget) return;
    if (event instanceof InputEvent && event.isComposing) return;
    this.filterOptions();
  };

  private filterOptions = () => {
    const query = this.searchTarget.value.normalize("NFKC").toLocaleLowerCase("ja").trim();
    let visible = 0;
    for (const option of this.optionTargets) {
      option.hidden = !option.textContent
        ?.normalize("NFKC")
        .toLocaleLowerCase("ja")
        .includes(query);
      if (!option.hidden && option.getAttribute("aria-disabled") !== "true") visible += 1;
    }
    this.noteTarget.textContent = "一致する候補はありません。";
    this.noteTarget.hidden = visible > 0;
    const combobox = this.combobox();
    if (combobox) combobox.open = visible > 0;
  };

  private openOnFocus = (event: FocusEvent) => {
    if (event.target !== this.searchTarget || this.searchTarget.disabled) return;
    this.filterOptions();
  };

  private handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const remove = target.closest<HTMLButtonElement>("button[data-picker-remove]");
    if (!remove || !this.valuesTarget.contains(remove) || this.nativeTarget.disabled) return;
    const value = remove.dataset.pickerRemove;
    if (!value) return;
    this.commit(this.selectedValues().filter((candidate) => candidate !== value));
    this.searchTarget.focus({ preventScroll: true });
  };

  private focusSearch = (event: Event) => {
    if (this.searchTarget.hidden) return;
    event.preventDefault();
    this.searchTarget.setAttribute("aria-invalid", "true");
    this.searchTarget.dataset.invalid = "true";
    this.noteTarget.textContent = "候補を選択してください。";
    this.noteTarget.hidden = false;
    this.searchTarget.focus({ preventScroll: true });
  };

  private afterReset = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (event.defaultPrevented) return;
      this.showAllOptions();
      this.fromNative();
    }, 0);
  };
}
