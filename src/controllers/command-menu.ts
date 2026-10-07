import { Controller } from "@hotwired/stimulus";

export class CommandMenuController extends Controller<HTMLElement> {
  private trigger: HTMLButtonElement | null = null;
  private panel: HTMLElement | null = null;
  private search: HTMLInputElement | null = null;
  private entries: HTMLElement[] = [];
  private active = -1;
  connect = () => {
    const trigger = this.element.querySelector('[data-command-menu-target="trigger"]');
    const panel = this.element.querySelector('[data-command-menu-target="panel"]');
    const search = this.element.querySelector('[data-command-menu-target="search"]');
    if (
      !(trigger instanceof HTMLButtonElement) ||
      !(panel instanceof HTMLElement) ||
      !(search instanceof HTMLInputElement)
    )
      return;
    this.trigger = trigger;
    this.panel = panel;
    this.search = search;
    panel.addEventListener("beforetoggle", this.toggled);
    panel.addEventListener("toggle", this.focusSearch);
    panel.addEventListener("click", this.select);
    panel.addEventListener("keydown", this.navigate);
    panel.addEventListener("focusin", this.focusedEntry);
    search.addEventListener("input", this.filter);
    this.element.addEventListener("focusout", this.leave);
    document.addEventListener("turbo:before-cache", this.close);
    if (this.element.dataset.commandMenuShortcut)
      document.addEventListener("keydown", this.shortcut);
    if (panel.matches(":popover-open")) {
      this.filter();
      search.focus({ preventScroll: true });
    }
  };
  disconnect = () => {
    this.panel?.removeEventListener("beforetoggle", this.toggled);
    this.panel?.removeEventListener("toggle", this.focusSearch);
    this.panel?.removeEventListener("click", this.select);
    this.panel?.removeEventListener("keydown", this.navigate);
    this.panel?.removeEventListener("focusin", this.focusedEntry);
    this.search?.removeEventListener("input", this.filter);
    this.element.removeEventListener("focusout", this.leave);
    document.removeEventListener("keydown", this.shortcut);
    document.removeEventListener("turbo:before-cache", this.close);
    this.close();
  };
  private close = () => {
    if (this.panel?.matches(":popover-open")) this.panel.hidePopover();
  };
  private toggled = (event: Event) => {
    if (!(event instanceof ToggleEvent)) return;
    const open = event.newState === "open";
    this.trigger?.setAttribute("aria-expanded", String(open));
    this.search?.setAttribute("aria-expanded", String(open));
    if (open && this.search) {
      this.search.value = "";
      this.filter();
    } else this.search?.removeAttribute("aria-activedescendant");
  };
  private leave = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && !this.element.contains(event.relatedTarget))
      this.close();
  };
  private focusSearch = () => {
    if (this.panel?.matches(":popover-open") && !this.panel.contains(document.activeElement))
      this.search?.focus({ preventScroll: true });
  };
  private focusedEntry = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return;
    const entry = event.target.closest<HTMLElement>('[data-command-menu-target="entry"]');
    const index = entry ? this.entries.indexOf(entry) : -1;
    if (index >= 0) this.choose(index);
  };
  private shortcut = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey) return;
    const target = event.target;
    const key = event.key.toLowerCase();
    const configured = this.element.dataset.commandMenuShortcut;
    if (
      configured === "shift+j" &&
      target instanceof Element &&
      target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')
    )
      return;
    const matches =
      configured === "shift+j"
        ? key === "j" && event.shiftKey && !event.ctrlKey && !event.metaKey
        : configured === "mod+k" &&
          key === "k" &&
          (event.ctrlKey || event.metaKey) &&
          !event.shiftKey;
    if (!matches) return;
    if (!this.trigger || this.trigger.disabled || this.trigger.getClientRects().length === 0)
      return;
    event.preventDefault();
    if (this.panel?.matches(":popover-open")) {
      this.close();
      this.trigger.focus();
    } else this.trigger.click();
  };
  private select = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const command = event.target.closest("button[data-command-value]");
    const close = event.target.closest('[data-command-menu-target="close"]');
    const link = event.target.closest("a[href]");
    if (command instanceof HTMLButtonElement && command.disabled) return;
    if (close || link || command) this.close();
    if (close || command) this.trigger?.focus();
    if (command instanceof HTMLButtonElement)
      this.dispatch("select", { detail: { value: command.dataset.commandValue } });
  };
  private choose = (index: number) => {
    this.active = this.entries.length ? Math.max(0, Math.min(index, this.entries.length - 1)) : -1;
    for (const entry of this.element.querySelectorAll<HTMLElement>(
      '[data-command-menu-target="entry"]',
    )) {
      const selected = entry === this.entries[this.active];
      entry.dataset.active = String(selected);
      entry.setAttribute("aria-selected", String(selected));
    }
    const entry = this.entries[this.active];
    if (entry) this.search?.setAttribute("aria-activedescendant", entry.id);
    else this.search?.removeAttribute("aria-activedescendant");
  };
  private navigate = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      this.trigger?.focus();
      return;
    }
    const inSearch = event.target === this.search;
    const inResults =
      event.target instanceof Element &&
      !!event.target.closest('[data-command-menu-target="entry"]');
    if (!inSearch && !inResults) return;
    const edge = inResults && (event.key === "Home" || event.key === "End");
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || edge) {
      event.preventDefault();
      this.choose(
        edge
          ? event.key === "Home"
            ? 0
            : this.entries.length - 1
          : this.active + (event.key === "ArrowDown" ? 1 : -1),
      );
      const entry = this.entries[this.active];
      if (inResults)
        entry
          ?.querySelector<HTMLElement>("a[href],button:not(:disabled)")
          ?.focus({ preventScroll: true });
      entry?.scrollIntoView({ block: "nearest" });
    }
    if (inSearch && event.key === "Enter") {
      event.preventDefault();
      this.entries[this.active]
        ?.querySelector<HTMLElement>("a[href],button:not(:disabled)")
        ?.click();
    }
  };
  private filter = () => {
    const query = this.search?.value.normalize("NFKC").trim().toLocaleLowerCase() ?? "";
    const terms = query.split(/\s+/).filter(Boolean);
    this.entries = [];
    let matches = 0;
    for (const entry of this.element.querySelectorAll<HTMLElement>(
      '[data-command-menu-target="entry"]',
    )) {
      const text = (entry.dataset.search ?? "").normalize("NFKC").toLocaleLowerCase();
      entry.hidden = !terms.every((term) => text.includes(term));
      if (!entry.hidden) {
        matches += 1;
        if (entry.dataset.disabled !== "true") this.entries.push(entry);
      }
    }
    for (const group of this.element.querySelectorAll<HTMLElement>(
      '[data-command-menu-target="group"]',
    ))
      group.hidden = !group.querySelector('[data-command-menu-target="entry"]:not([hidden])');
    const empty = this.element.querySelector('[data-command-menu-target="empty"]');
    if (empty instanceof HTMLElement) empty.hidden = matches !== 0;
    const status = this.element.querySelector('[data-command-menu-target="status"]');
    if (status)
      status.textContent = query
        ? `${matches}件の候補`
        : "矢印キーで移動、Enterで開く、Escで閉じる";
    this.choose(0);
  };
}
