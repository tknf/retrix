import { Controller } from "@hotwired/stimulus";
import { menuPosition } from "./dropdown-menu-position";
import { layoutRect } from "../internal/layout-rect";

type OpenPanel = { panel: HTMLElement; anchor: HTMLElement };

/** 階層ごとのフォーカス、選択状態とトップレイヤーの配置を管理する。 */
export class DropdownMenuController extends Controller<HTMLElement> {
  private panels: OpenPanel[] = [];
  private hoverTimer: ReturnType<typeof setTimeout> | undefined;
  private search = "";
  private searchTime = 0;

  connect = () => {
    this.element.addEventListener("click", this.click);
    this.element.addEventListener("keydown", this.keydown);
    this.element.addEventListener("pointerover", this.pointerover);
    this.element.addEventListener("pointerout", this.pointerout);
    document.addEventListener("focusin", this.outside);
    document.addEventListener("dropdown-menu:open", this.otherMenu);
    document.addEventListener("turbo:before-cache", this.beforeCache);
    window.addEventListener("resize", this.reposition);
    document.addEventListener("scroll", this.reposition, true);
    window.visualViewport?.addEventListener("resize", this.reposition);
    window.visualViewport?.addEventListener("scroll", this.reposition);
  };

  disconnect = () => {
    this.close(false);
    this.element.removeEventListener("click", this.click);
    this.element.removeEventListener("keydown", this.keydown);
    this.element.removeEventListener("pointerover", this.pointerover);
    this.element.removeEventListener("pointerout", this.pointerout);
    document.removeEventListener("focusin", this.outside);
    document.removeEventListener("dropdown-menu:open", this.otherMenu);
    document.removeEventListener("turbo:before-cache", this.beforeCache);
    window.removeEventListener("resize", this.reposition);
    document.removeEventListener("scroll", this.reposition, true);
    window.visualViewport?.removeEventListener("resize", this.reposition);
    window.visualViewport?.removeEventListener("scroll", this.reposition);
  };

  private trigger = () =>
    this.element.querySelector<HTMLButtonElement>('[data-dropdown-menu-target="trigger"]');
  private root = () => this.element.querySelector<HTMLElement>('[data-menu-panel="root"]');
  private shield = () =>
    this.element.querySelector<HTMLElement>('[data-dropdown-menu-target="shield"]');
  private item = (event: Event) => {
    const item =
      event.target instanceof Element ? event.target.closest<HTMLElement>(".item") : null;
    return item && this.element.contains(item) ? item : null;
  };
  private disabled = (item: HTMLElement) =>
    item.matches(":disabled") || item.getAttribute("aria-disabled") === "true";
  private items = (panel: HTMLElement) =>
    Array.from(panel.querySelectorAll<HTMLElement>(".item")).filter(
      (item) => item.closest('[role="menu"]') === panel && !this.disabled(item) && !item.hidden,
    );
  private submenu = (item: HTMLElement) => {
    const id = item.getAttribute("aria-controls");
    const panel = id ? document.getElementById(id) : null;
    return panel && this.element.contains(panel) ? panel : null;
  };
  private emit = (name: string, detail: Record<string, string | boolean>, cancelable = false) =>
    this.element.dispatchEvent(
      new CustomEvent(`dropdown-menu:${name}`, { bubbles: true, cancelable, detail }),
    );

  private focus = (item: HTMLElement) => {
    const panel = item.closest<HTMLElement>('[role="menu"]');
    if (panel) for (const peer of this.items(panel)) peer.removeAttribute("data-state");
    item.dataset.state = "active";
    item.focus({ preventScroll: true });
    item.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  private open = (panel: HTMLElement, anchor: HTMLElement, last = false, focus = true) => {
    if (this.disabled(anchor)) return;
    const parent = anchor.closest('[role="menu"]');
    const depth = parent ? this.panels.findIndex((entry) => entry.panel === parent) + 1 : 0;
    if (this.panels[depth]?.panel !== panel) {
      this.closeFrom(depth);
      if (depth === 0) {
        const shield = this.shield();
        if (shield) {
          shield.hidden = false;
          shield.showPopover?.();
        }
      }
      panel.hidden = false;
      panel.showPopover?.();
      this.panels.push({ panel, anchor });
      anchor.setAttribute("aria-expanded", "true");
      this.element.dataset.state = "open";
      this.reposition();
      if (depth === 0) this.emit("open", {});
    }
    if (focus) {
      const items = this.items(panel);
      const target = last ? items.at(-1) : items[0];
      if (target) this.focus(target);
      else panel.focus({ preventScroll: true });
    }
  };

  private closeFrom = (depth: number) => {
    clearTimeout(this.hoverTimer);
    for (const { panel, anchor } of this.panels.splice(depth).reverse()) {
      if (panel.matches(":popover-open")) panel.hidePopover();
      panel.hidden = true;
      anchor.setAttribute("aria-expanded", "false");
      for (const item of this.items(panel)) item.removeAttribute("data-state");
    }
  };

  private close = (returnFocus = true) => {
    const wasOpen = this.panels.length > 0;
    this.closeFrom(0);
    const shield = this.shield();
    if (shield) {
      if (shield.matches(":popover-open")) shield.hidePopover();
      shield.hidden = true;
    }
    this.element.dataset.state = "closed";
    this.search = "";
    if (wasOpen) {
      if (returnFocus) this.trigger()?.focus({ preventScroll: true });
      this.emit("close", {});
    }
  };

  private beforeCache = () => this.close(false);
  private outside = (event: Event) => {
    if (event.target instanceof Node && !this.element.contains(event.target)) this.close(false);
  };
  private otherMenu = (event: Event) => {
    if (event.target !== this.element) this.close(false);
  };

  private reposition = () => {
    if (!this.panels.length) return;
    const viewport = window.visualViewport;
    for (const [index, { panel, anchor }] of this.panels.entries()) {
      const rtl = getComputedStyle(panel).direction === "rtl";
      panel.style.maxInlineSize = `min(20rem, ${Math.max(0, (viewport?.width ?? window.innerWidth) - 16)}px)`;
      panel.style.maxBlockSize = `${Math.max(0, Math.min(384, (viewport?.height ?? window.innerHeight) - 16))}px`;
      const anchorBounds = anchor.getBoundingClientRect();
      const position = menuPosition({
        anchor: anchorBounds,
        panel: layoutRect(panel),
        viewport: {
          width: viewport?.width ?? window.innerWidth,
          height: viewport?.height ?? window.innerHeight,
          offsetLeft: viewport?.offsetLeft ?? 0,
          offsetTop: viewport?.offsetTop ?? 0,
        },
        layoutWidth: document.documentElement.clientWidth,
        rtl,
        submenu: index > 0,
        align: this.element.dataset.align === "end" ? "end" : "start",
      });
      panel.style.insetInlineStart = `${position.inlineStart}px`;
      panel.style.insetBlockStart = `${position.blockStart}px`;
      // 開閉のアニメーションを、開いた操作要素の側から始めるための向き。
      panel.dataset.side =
        index > 0 ? "inline" : position.blockStart < anchorBounds.top ? "top" : "bottom";
    }
  };

  private select = (item: HTMLElement) => {
    if (this.disabled(item)) return;
    if (item.dataset.menuKind === "submenu") {
      const submenu = this.submenu(item);
      if (submenu) this.open(submenu, item);
      return;
    }
    const kind = item.dataset.menuKind ?? "action";
    const checkable = kind === "checkbox" || kind === "radio";
    const checked = kind === "radio" || item.getAttribute("aria-checked") !== "true";
    const detail = {
      value: item.dataset.dropdownMenuValue ?? "",
      kind,
      ...(checkable ? { checked } : {}),
      ...(kind === "radio" ? { name: item.dataset.menuGroup ?? "" } : {}),
    };
    if (!this.emit("beforeselect", detail, true)) return;
    if (kind === "radio") {
      const panel = item.closest<HTMLElement>('[role="menu"]');
      if (panel)
        for (const peer of panel.querySelectorAll<HTMLElement>('[data-menu-kind="radio"]')) {
          if (
            peer.closest('[role="menu"]') === panel &&
            peer.dataset.menuGroup === item.dataset.menuGroup
          ) {
            peer.setAttribute("aria-checked", "false");
            peer.dataset.checked = "false";
          }
        }
    }
    if (checkable) {
      item.setAttribute("aria-checked", String(checked));
      item.dataset.checked = String(checked);
    }
    if (
      item.dataset.closeOnSelect === "true" ||
      (!checkable && item.dataset.closeOnSelect !== "false")
    )
      this.close();
    this.emit("select", detail);
  };

  private click = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    if (event.target === this.shield()) {
      this.close();
      return;
    }
    const trigger = this.trigger();
    if (trigger && event.target instanceof Node && trigger.contains(event.target)) {
      const panel = this.root();
      if (this.panels.length) this.close();
      else if (panel) this.open(panel, trigger);
      return;
    }
    const item = this.item(event);
    if (!item) return;
    if (this.disabled(item)) {
      event.preventDefault();
      return;
    }
    if (item instanceof HTMLAnchorElement) {
      this.close(false);
      return;
    }
    event.preventDefault();
    this.select(item);
  };

  private keydown = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const trigger = this.trigger();
    if (
      event.target === trigger &&
      trigger &&
      ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      const panel = this.root();
      if (panel) this.open(panel, trigger, event.key === "ArrowUp");
      return;
    }
    if (!this.panels.length) return;
    if (event.target === this.shield() && ["Escape", "Tab"].includes(event.key)) {
      if (event.key === "Escape") event.preventDefault();
      this.close();
      return;
    }
    const item = this.item(event);
    const panel =
      event.target instanceof Element ? event.target.closest<HTMLElement>('[role="menu"]') : null;
    if (!panel) return;
    const index = this.panels.findIndex((entry) => entry.panel === panel);
    const rtl = getComputedStyle(panel).direction === "rtl";
    if (event.key === "Tab") {
      this.close();
      return;
    }
    if (event.key === "Escape" || (event.key === (rtl ? "ArrowRight" : "ArrowLeft") && index > 0)) {
      event.preventDefault();
      const anchor = this.panels[index]?.anchor;
      if (index === 0) this.close();
      else {
        this.closeFrom(index);
        if (anchor) this.focus(anchor);
      }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      this.closeFrom(index + 1);
      const items = this.items(panel);
      const current = item ? items.indexOf(item) : -1;
      const target =
        event.key === "Home"
          ? items[0]
          : event.key === "End"
            ? items.at(-1)
            : items[(current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
      if (target) this.focus(target);
      return;
    }
    if (
      item &&
      event.key === (rtl ? "ArrowLeft" : "ArrowRight") &&
      item.dataset.menuKind === "submenu"
    ) {
      event.preventDefault();
      this.select(item);
      return;
    }
    if (item && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (item instanceof HTMLAnchorElement) {
        if (!this.disabled(item)) item.click();
      } else this.select(item);
      return;
    }
    if (event.key.length === 1 && event.key !== " ") {
      event.preventDefault();
      const now = Date.now();
      this.search = now - this.searchTime > 600 ? event.key : this.search + event.key;
      this.searchTime = now;
      const query = Array.from(this.search).every((letter) => letter === event.key)
        ? event.key
        : this.search;
      const items = this.items(panel);
      const current = item ? items.indexOf(item) : -1;
      const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
      const target = ordered.find((candidate) =>
        candidate.dataset.menuLabel
          ?.normalize("NFKC")
          .toLocaleLowerCase()
          .startsWith(query.normalize("NFKC").toLocaleLowerCase()),
      );
      if (target) {
        this.closeFrom(index + 1);
        this.focus(target);
      }
    }
  };

  private pointerout = (event: PointerEvent) => {
    const item = this.item(event);
    if (!(event.relatedTarget instanceof Node) || !item?.contains(event.relatedTarget))
      clearTimeout(this.hoverTimer);
  };
  private pointerover = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const item = this.item(event);
    if (
      !item ||
      this.disabled(item) ||
      (event.relatedTarget instanceof Node && item.contains(event.relatedTarget))
    )
      return;
    clearTimeout(this.hoverTimer);
    const parent = item.closest('[role="menu"]');
    const index = this.panels.findIndex((entry) => entry.panel === parent);
    if (index < 0) return;
    if (this.panels[index + 1]?.anchor !== item) this.closeFrom(index + 1);
    this.focus(item);
    const submenu = this.submenu(item);
    if (submenu) this.hoverTimer = setTimeout(() => this.open(submenu, item, false, false), 150);
  };
}
