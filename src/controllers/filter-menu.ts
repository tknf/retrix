import { Controller } from "@hotwired/stimulus";

/**
 * 絞り込めるメニュー。入力した文字で候補を絞り込み、上下の矢印キーで候補を移動し、Enterで選ぶ。
 * 一つだけ選ぶ時は選ぶと閉じ、複数を選べる時は開いたままチェックマークを切り替える。
 */
export class FilterMenuController extends Controller<HTMLElement> {
  static targets = ["trigger", "panel", "input", "option", "empty"];
  static values = { multiple: Boolean };
  declare readonly hasTriggerTarget: boolean;
  declare readonly triggerTarget: HTMLElement;
  declare readonly panelTarget: HTMLElement;
  declare readonly inputTarget: HTMLInputElement;
  declare readonly optionTargets: HTMLElement[];
  declare readonly emptyTarget: HTMLElement;
  declare readonly multipleValue: boolean;

  private visible = () =>
    this.optionTargets.filter(
      (option) => !option.hidden && option.getAttribute("aria-disabled") !== "true",
    );

  private activate = (option: HTMLElement | undefined) => {
    for (const other of this.optionTargets) other.removeAttribute("data-active");
    if (!option) {
      this.inputTarget.removeAttribute("aria-activedescendant");
      return;
    }
    option.dataset.active = "true";
    this.inputTarget.setAttribute("aria-activedescendant", option.id);
    option.scrollIntoView({ block: "nearest" });
  };

  // 開閉の状態はcontrollerが持つ。JavaScriptなしではブラウザがpopovertargetから伝える。
  private expanded = (open: boolean) => {
    if (this.hasTriggerTarget) this.triggerTarget.setAttribute("aria-expanded", String(open));
  };

  connect = () => {
    this.expanded(this.panelTarget.matches(":popover-open"));
  };

  disconnect = () => {
    if (this.hasTriggerTarget) this.triggerTarget.removeAttribute("aria-expanded");
  };

  /** 開いた時は、前に入力した文字を消して絞り込みの入力欄へ移る。 */
  opened = (event: Event) => {
    if (!(event instanceof ToggleEvent)) return;
    this.expanded(event.newState === "open");
    if (event.newState !== "open") return;
    this.inputTarget.value = "";
    this.filter();
    this.inputTarget.focus();
  };

  filter = () => {
    const query = this.inputTarget.value.trim().toLocaleLowerCase();
    for (const option of this.optionTargets)
      option.hidden =
        query !== "" && !(option.dataset.label ?? "").toLocaleLowerCase().includes(query);
    const visible = this.visible();
    this.emptyTarget.hidden = visible.length > 0;
    this.activate(visible[0]);
  };

  key = (event: KeyboardEvent) => {
    // 日本語入力の変換中の矢印とEnter（確定）は、候補の移動や選択に使わない。
    if (event.isComposing) return;
    const visible = this.visible();
    const current = visible.findIndex((option) => option.dataset.active === "true");
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      this.activate(visible[(current + step + visible.length) % visible.length]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = visible[current];
      if (option) this.select(option);
    }
  };

  choose = (event: Event) => {
    const option = event.currentTarget;
    if (option instanceof HTMLElement && option.getAttribute("aria-disabled") !== "true")
      this.select(option);
  };

  create = () => {
    this.dispatch("create", { detail: { query: this.inputTarget.value.trim() } });
  };

  private select = (option: HTMLElement) => {
    const selected = this.multipleValue ? option.getAttribute("aria-selected") !== "true" : true;
    if (!this.multipleValue)
      for (const other of this.optionTargets) this.mark(other, other === option);
    else this.mark(option, selected);
    this.dispatch("select", { detail: { value: option.dataset.value, selected } });
    if (!this.multipleValue) this.panelTarget.hidePopover();
  };

  private mark = (option: HTMLElement, selected: boolean) => {
    option.setAttribute("aria-selected", selected ? "true" : "false");
    option.dataset.selected = selected ? "true" : "false";
    const input = option.querySelector("input[type='hidden']");
    if (input instanceof HTMLInputElement) input.disabled = !selected;
  };
}
