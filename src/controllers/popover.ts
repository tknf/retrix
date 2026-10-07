import { Controller } from "@hotwired/stimulus";
import { menuPosition } from "./dropdown-menu-position";
import { isPopoverAnchored } from "./popover-position";
import { layoutRect } from "../internal/layout-rect";

/** CSSを優先し、実際の配置が成立しない場合だけ既存の座標計算で補う。 */
export class PopoverController extends Controller<HTMLElement> {
  private observer: ResizeObserver | null = null;
  private connected = false;
  private cssAnchors = false;
  private fallback = false;
  private panel = () => this.element.querySelector<HTMLElement>('[data-popover-target="panel"]');
  private trigger = () =>
    this.element.querySelector<HTMLElement>('[data-popover-target="trigger"]');

  connect = () => {
    this.cssAnchors =
      CSS.supports("inset-block-start", "anchor(end)") &&
      CSS.supports("position-try-fallbacks", "flip-block");
    this.connected = true;
    this.panel()?.addEventListener("beforetoggle", this.beforeToggle);
    this.panel()?.addEventListener("keydown", this.keydown);
    this.panel()?.addEventListener("click", this.click);
    document.addEventListener("scroll", this.position, true);
    window.addEventListener("resize", this.position);
    window.visualViewport?.addEventListener("resize", this.position);
    window.visualViewport?.addEventListener("scroll", this.position);
    this.observer = new ResizeObserver(this.position);
    const panel = this.panel();
    const trigger = this.trigger();
    if (panel) this.observer.observe(panel);
    if (trigger) this.observer.observe(trigger);
    this.position();
  };
  disconnect = () => {
    this.connected = false;
    this.panel()?.removeEventListener("beforetoggle", this.beforeToggle);
    this.panel()?.removeEventListener("keydown", this.keydown);
    this.panel()?.removeEventListener("click", this.click);
    document.removeEventListener("scroll", this.position, true);
    window.removeEventListener("resize", this.position);
    window.visualViewport?.removeEventListener("resize", this.position);
    window.visualViewport?.removeEventListener("scroll", this.position);
    this.observer?.disconnect();
    this.observer = null;
    this.resetPosition();
  };
  private beforeToggle = (event: Event) => {
    if ("newState" in event && event.newState === "open") queueMicrotask(this.position);
    else this.resetPosition();
  };
  private close = () => {
    this.panel()?.hidePopover();
    this.trigger()?.focus({ preventScroll: true });
  };
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.key !== "Escape" || event.isComposing) return;
    if (!(event.target instanceof Element) || event.target.closest("[popover]") !== this.panel())
      return;
    event.preventDefault();
    this.close();
  };
  private click = (event: MouseEvent) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const control = event.target.closest('button[popovertargetaction="hide"]');
    if (control?.getAttribute("popovertarget") !== this.panel()?.id) return;
    event.preventDefault();
    this.close();
  };
  private resetPosition = () => {
    this.fallback = false;
    const panel = this.panel();
    if (!panel) return;
    for (const property of [
      "translate",
      "inset-inline-start",
      "inset-inline-end",
      "inset-block-start",
      "inset-block-end",
      "max-inline-size",
      "max-block-size",
      "position-try-fallbacks",
    ])
      panel.style.removeProperty(property);
  };
  private position = () => {
    const panel = this.panel();
    const trigger = this.trigger();
    if (!this.connected || !panel?.matches(":popover-open") || !trigger) return;
    const viewport = window.visualViewport;
    const visibleViewport = {
      width: viewport?.width ?? window.innerWidth,
      height: viewport?.height ?? window.innerHeight,
      offsetLeft: viewport?.offsetLeft ?? 0,
      offsetTop: viewport?.offsetTop ?? 0,
    };
    if (
      this.cssAnchors &&
      !this.fallback &&
      isPopoverAnchored(trigger.getBoundingClientRect(), layoutRect(panel), visibleViewport)
    )
      return;
    this.fallback = true;
    // CSS側の再試行とJS座標を同時に働かせない。
    panel.style.setProperty("position-try-fallbacks", "none");
    panel.style.insetInlineEnd = "auto";
    panel.style.insetBlockEnd = "auto";
    panel.style.maxInlineSize = `${Math.max(0, (viewport?.width ?? window.innerWidth) - 16)}px`;
    panel.style.maxBlockSize = `${Math.max(0, (viewport?.height ?? window.innerHeight) - 16)}px`;
    const position = menuPosition({
      anchor: trigger.getBoundingClientRect(),
      panel: layoutRect(panel),
      viewport: visibleViewport,
      layoutWidth: document.documentElement.clientWidth,
      rtl: getComputedStyle(panel).direction === "rtl",
      submenu: false,
      align: this.element.dataset.align === "end" ? "end" : "start",
    });
    panel.style.translate = "none";
    panel.style.insetInlineStart = `${position.inlineStart}px`;
    panel.style.insetBlockStart = `${position.blockStart}px`;
  };
}
