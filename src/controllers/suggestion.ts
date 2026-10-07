import { ComboboxController } from "@tknf/stimulus-ui";

/** 上流の候補選択に、絞り込み・標準入力への通知・リセットを加える。 */
export class SuggestionController extends ComboboxController {
  private fallbackList: string | null = null;
  private suggestionForm: HTMLFormElement | null = null;
  private suggestionReset: number | undefined;
  private suggestionComposing = false;

  constructor(...args: ConstructorParameters<typeof ComboboxController>) {
    super(...args);
    const connectCombobox = this.connect;
    const disconnectCombobox = this.disconnect;
    this.connect = () => {
      const input = this.inputTargets[0];
      const list = this.listboxTargets[0];
      if (input && list) {
        this.fallbackList = input.getAttribute("list");
        input.removeAttribute("list");
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-controls", list.id);
        this.suggestionForm = input.form;
      }
      connectCombobox();
      this.element.addEventListener("click", this.guardEditing, true);
      this.element.addEventListener("keydown", this.guardEditing, true);
      this.element.addEventListener("click", this.clickSuggestion);
      this.element.addEventListener("mousedown", this.keepInputFocus);
      this.element.addEventListener("keydown", this.confirmSuggestion);
      this.element.addEventListener("input", this.filterSuggestion);
      this.element.addEventListener("compositionstart", this.startComposition);
      this.element.addEventListener("compositionend", this.endComposition);
      this.element.addEventListener("combobox:change", this.selectSuggestion);
      this.suggestionForm?.addEventListener("reset", this.resetSuggestion);
      const toggle = this.element.querySelector<HTMLButtonElement>(".toggle");
      if (toggle) toggle.hidden = false;
    };
    this.disconnect = () => {
      this.element.removeEventListener("click", this.guardEditing, true);
      this.element.removeEventListener("keydown", this.guardEditing, true);
      this.element.removeEventListener("click", this.clickSuggestion);
      this.element.removeEventListener("mousedown", this.keepInputFocus);
      this.element.removeEventListener("keydown", this.confirmSuggestion);
      this.element.removeEventListener("input", this.filterSuggestion);
      this.element.removeEventListener("compositionstart", this.startComposition);
      this.element.removeEventListener("compositionend", this.endComposition);
      this.element.removeEventListener("combobox:change", this.selectSuggestion);
      this.suggestionForm?.removeEventListener("reset", this.resetSuggestion);
      this.suggestionForm = null;
      window.clearTimeout(this.suggestionReset);
      this.suggestionComposing = false;
      this.resetOptions();
      disconnectCombobox();
      const input = this.inputTargets[0];
      if (input) {
        if (this.fallbackList) input.setAttribute("list", this.fallbackList);
        for (const attribute of [
          "role",
          "aria-controls",
          "aria-expanded",
          "aria-autocomplete",
          "aria-activedescendant",
        ])
          input.removeAttribute(attribute);
      }
      const toggle = this.element.querySelector<HTMLButtonElement>(".toggle");
      if (toggle) toggle.hidden = true;
    };
  }

  private editable = () => {
    const input = this.inputTargets[0];
    return input && !input.matches(":disabled") && !input.readOnly;
  };

  private guardEditing = (event: Event) => {
    if (!this.editable()) {
      this.hide();
      event.stopImmediatePropagation();
    }
  };

  private setEmptyMessage = (empty: boolean) => {
    const note = this.element.querySelector(".note");
    if (note)
      note.textContent = empty ? "一致する候補はありません。入力した内容をそのまま使えます。" : "";
  };

  private resetOptions = () => {
    for (const option of this.optionTargets) option.hidden = false;
    this.setEmptyMessage(false);
  };

  private filterSuggestion = () => {
    if (!this.editable() || this.suggestionComposing) return;
    const query = this.value.normalize("NFKC").toLocaleLowerCase("ja").trim();
    let count = 0;
    for (const option of this.optionTargets) {
      const value = (option.dataset.comboboxValue ?? "").normalize("NFKC").toLocaleLowerCase("ja");
      option.hidden = !value.includes(query);
      if (!option.hidden) count += 1;
    }
    this.setEmptyMessage(count === 0);
    this.open = count > 0;
  };

  private clickSuggestion = (event: MouseEvent) => {
    const input = this.inputTargets[0];
    if (!input) return;
    if (event.target === input) {
      this.filterSuggestion();
      return;
    }
    const toggle = this.element.querySelector(".toggle");
    if (event.target instanceof Node && toggle?.contains(event.target)) {
      const wasOpen = this.open;
      this.resetOptions();
      this.open = !wasOpen && this.optionTargets.length > 0;
      this.setEmptyMessage(!wasOpen && this.optionTargets.length === 0);
      input.focus({ preventScroll: true });
      return;
    }
    const option = event
      .composedPath()
      .find((target) => target instanceof HTMLLIElement && this.optionTargets.includes(target));
    // 現在値を選び直した場合は、上流が変更イベントを発行しない。
    if (option instanceof HTMLLIElement && option.dataset.comboboxValue === input.value) {
      this.hide();
      input.focus({ preventScroll: true });
    }
  };

  private keepInputFocus = (event: MouseEvent) => {
    if (event.button !== 0 || !this.editable()) return;
    const target = event.target;
    const toggle = this.element.querySelector(".toggle");
    if (
      target instanceof Node &&
      (toggle?.contains(target) || this.optionTargets.some((option) => option.contains(target)))
    )
      event.preventDefault();
  };

  private selectSuggestion = () => {
    const input = this.inputTargets[0];
    if (input) {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.focus({ preventScroll: true });
    }
    this.resetOptions();
    this.hide();
  };

  private confirmSuggestion = (event: KeyboardEvent) => {
    if (
      event.key !== "Enter" ||
      event.isComposing ||
      event.keyCode === 229 ||
      this.suggestionComposing ||
      !this.open
    )
      return;
    const input = this.inputTargets[0];
    const activeId = input?.getAttribute("aria-activedescendant");
    const option = this.optionTargets.find((candidate) => candidate.id === activeId);
    if (input && option?.dataset.comboboxValue === input.value) this.hide();
  };

  private startComposition = () => {
    this.suggestionComposing = true;
  };

  private endComposition = () => {
    this.suggestionComposing = false;
    this.filterSuggestion();
  };

  private resetSuggestion = (event: Event) => {
    window.clearTimeout(this.suggestionReset);
    this.suggestionReset = window.setTimeout(() => {
      if (event.defaultPrevented) return;
      const input = this.inputTargets[0];
      if (input) this.value = input.value;
      this.resetOptions();
      this.hide();
    }, 0);
  };
}
