import { Controller } from "@hotwired/stimulus";
type Location = { column: HTMLElement; index: number };
export class BoardController extends Controller<HTMLElement> {
  private item: HTMLElement | null = null;
  private origin: Location | null = null;
  private snapshot: { column: HTMLElement; items: HTMLElement[] }[] = [];
  private pointer: {
    id: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
    handle: HTMLButtonElement;
  } | null = null;
  private mode: "pointer" | "keyboard" | null = null;
  private ghost: HTMLElement | null = null;
  /** ドラッグ中、移動先に表示する挿入位置の線。項目そのものは離すまで元の場所に残す。 */
  private marker: HTMLElement | null = null;
  /** 掴んだ位置。ドラッグ中のコピーを、項目を掴んだ位置のままポインターに合わせて動かす。 */
  private grab = { x: 12, y: 12 };
  private frame = 0;
  private suppressClick = false;
  connect = () => {
    this.element.addEventListener("pointerdown", this.down);
    this.element.addEventListener("keydown", this.key);
    this.element.addEventListener("click", this.click);
    document.addEventListener("pointermove", this.move);
    document.addEventListener("pointerup", this.up);
    document.addEventListener("pointercancel", this.cancel);
    document.addEventListener("turbo:before-cache", this.cancel);
    window.addEventListener("blur", this.cancel);
    // 開閉ボタンは、押して機能する時だけ表示する。
    for (const button of this.element.querySelectorAll<HTMLButtonElement>(
      ":scope > section > .title > button[data-board-toggle]",
    ))
      button.hidden = false;
    this.refresh();
  };
  disconnect = () => {
    this.cancel();
    this.element.removeEventListener("pointerdown", this.down);
    this.element.removeEventListener("keydown", this.key);
    this.element.removeEventListener("click", this.click);
    document.removeEventListener("pointermove", this.move);
    document.removeEventListener("pointerup", this.up);
    document.removeEventListener("pointercancel", this.cancel);
    document.removeEventListener("turbo:before-cache", this.cancel);
    window.removeEventListener("blur", this.cancel);
  };
  private columns = () =>
    Array.from(this.element.querySelectorAll<HTMLElement>(":scope > section"));
  private items = (column: HTMLElement) =>
    Array.from(column.querySelectorAll<HTMLElement>(":scope > .items > [data-board-id]"));
  private handle = (target: EventTarget | null) => {
    const button =
      target instanceof Element
        ? target.closest<HTMLButtonElement>("button[data-board-handle]")
        : null;
    return button && !button.disabled && button.closest(".rx-board") === this.element
      ? button
      : null;
  };
  private locate = (item: HTMLElement): Location | null => {
    const column = item.parentElement?.parentElement;
    return column instanceof HTMLElement && column.parentElement === this.element
      ? { column, index: this.items(column).indexOf(item) }
      : null;
  };
  private say = (message: string) => {
    const status = this.element.querySelector(":scope > [data-board-announcement]");
    if (status) status.textContent = message;
  };
  /** 列の開閉。表示だけを切り替え、取り消し可能なboard:toggleイベントを発火する。 */
  toggle = (event: Event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    const column = button.closest("section");
    if (!(column instanceof HTMLElement) || column.parentElement !== this.element) return;
    const collapsed = column.dataset.collapsed !== "true";
    const allowed = this.dispatch("toggle", {
      cancelable: true,
      detail: { column: column.dataset.columnId, collapsed },
    });
    if (allowed.defaultPrevented) return;
    const locked =
      column.dataset.disabled === "true" || !column.querySelector(':scope > .items[role="list"]');
    if (collapsed) {
      column.dataset.collapsed = "true";
      column.dataset.dropDisabled = "true";
      delete column.dataset.unfolding;
    } else {
      delete column.dataset.collapsed;
      if (!locked) delete column.dataset.dropDisabled;
      // 開いた時だけ、中の項目を1件ずつ順に表示する。読み込み時にはアニメーションしない。
      column.dataset.unfolding = "true";
      window.setTimeout(() => delete column.dataset.unfolding, 600);
    }
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    // たたんだ列だけピルの幅にするため、列の幅の決め方を並び順どおりに作り直す。
    this.element.style.setProperty(
      "--rx-board-tracks",
      this.columns()
        .map((section) => (section.dataset.collapsed === "true" ? "auto" : "minmax(auto, 1fr)"))
        .join(" "),
    );
    button.focus();
  };
  refresh = () => {
    for (const column of this.columns()) {
      if (!column.querySelector(':scope > .items[role="list"]')) continue;
      const count = column.querySelector(":scope > .title > small");
      if (count) count.textContent = String(this.items(column).length);
      for (const item of this.items(column)) {
        const button = item.querySelector<HTMLButtonElement>(":scope > [data-board-handle]");
        if (button) button.disabled = item.dataset.disabled === "true";
      }
    }
  };
  private begin = (handle: HTMLButtonElement, mode: "pointer" | "keyboard") => {
    const item = handle.closest<HTMLElement>("[data-board-id]");
    if (!item) return;
    const origin = this.locate(item);
    if (!origin) return;
    this.item = item;
    this.origin = origin;
    this.mode = mode;
    this.snapshot = this.columns().map((column) => ({ column, items: this.items(column) }));
    item.dataset.moving = "true";
    if (mode === "pointer") document.documentElement.dataset.rxBoardDragging = "true";
    handle.focus({ preventScroll: true });
    this.say((item.dataset.boardLabel ?? "項目") + "を持ち上げました。");
    return item;
  };
  private place = (column: HTMLElement, before: HTMLElement | null) => {
    if (!this.item || column.dataset.dropDisabled === "true" || before === this.item) return;
    const container = column.querySelector(":scope > .items");
    if (
      !container ||
      (this.item.parentElement === container && this.item.nextElementSibling === before)
    )
      return;
    container.insertBefore(this.item, before);
    for (const other of this.columns()) other.removeAttribute("data-over");
    column.dataset.over = "true";
    this.refresh();
    if (this.mode === "keyboard") {
      this.item
        .querySelector<HTMLButtonElement>(":scope > [data-board-handle]")
        ?.focus({ preventScroll: true });
      this.item.scrollIntoView({ block: "nearest", inline: "nearest" });
      this.say(
        (column.querySelector(".label")?.textContent ?? "") +
          "、" +
          ((this.locate(this.item)?.index ?? 0) + 1) +
          "番目",
      );
    }
  };
  /** ドラッグ中の挿入位置。項目は動かさずに移動先の列へ挿入位置の線だけを差し込む。 */
  private aim = (column: HTMLElement, before: HTMLElement | null) => {
    for (const other of this.columns()) if (other !== column) other.removeAttribute("data-over");
    const container = column.querySelector(":scope > .items");
    if (!container || column.dataset.dropDisabled === "true") {
      this.marker?.remove();
      column.removeAttribute("data-over");
      return;
    }
    column.dataset.over = "true";
    if (!this.marker) {
      this.marker = document.createElement("div");
      this.marker.className = "drop-marker";
      this.marker.setAttribute("aria-hidden", "true");
    }
    if (this.marker.parentElement === container && this.marker.nextElementSibling === before)
      return;
    container.insertBefore(this.marker, before);
  };
  private restore = () => {
    for (const { column, items } of this.snapshot)
      column.querySelector(":scope > .items")?.append(...items);
  };
  private finish = (commit: boolean) => {
    const item = this.item,
      origin = this.origin;
    const wasPointer = this.mode === "pointer";
    // ドラッグで移動した時は、離した時に初めて項目を挿入位置へ移す。
    if (item && commit && wasPointer && this.marker?.parentElement)
      this.marker.parentElement.insertBefore(item, this.marker);
    this.marker?.remove();
    this.marker = null;
    const destination = item ? this.locate(item) : null;
    let accepted = commit;
    if (item && origin && destination && commit) {
      const changed = origin.column !== destination.column || origin.index !== destination.index;
      if (changed) {
        const detail = {
          id: item.dataset.boardId,
          fromColumn: origin.column.dataset.columnId,
          toColumn: destination.column.dataset.columnId,
          fromIndex: origin.index,
          toIndex: destination.index,
        };
        accepted = this.element.dispatchEvent(
          new CustomEvent("board:beforemove", { bubbles: true, cancelable: true, detail }),
        );
        if (accepted)
          this.element.dispatchEvent(new CustomEvent("board:move", { bubbles: true, detail }));
      }
    }
    if (!accepted) this.restore();
    if (item) {
      item.removeAttribute("data-moving");
      item
        .querySelector<HTMLButtonElement>(":scope > [data-board-handle]")
        ?.focus({ preventScroll: true });
      this.say(accepted ? "移動を確定しました。" : "移動を取り消しました。");
    }
    for (const column of this.columns()) column.removeAttribute("data-over");
    this.ghost?.remove();
    this.ghost = null;
    cancelAnimationFrame(this.frame);
    this.item = null;
    this.origin = null;
    this.mode = null;
    if (wasPointer) delete document.documentElement.dataset.rxBoardDragging;
    this.pointer = null;
    this.snapshot = [];
    this.refresh();
  };
  private cancel = () => this.finish(false);
  /**
   * ドラッグ中の項目。項目そのもののコピーを同じ幅・同じ列の色で作り、
   * 掴んだ位置のままポインターに合わせて動かす。コピーは読み上げ・操作の対象から外し、idの重複を避ける。
   */
  private preview = (item: HTMLElement, pointer: { startX: number; startY: number }) => {
    const rect = item.getBoundingClientRect();
    this.grab = { x: pointer.startX - rect.left, y: pointer.startY - rect.top };
    const ghost = document.createElement("div");
    ghost.className = "drag-preview";
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    const copy = item.cloneNode(true);
    if (!(copy instanceof HTMLElement)) return ghost;
    for (const element of [copy, ...copy.querySelectorAll("[id]")]) element.removeAttribute("id");
    copy.removeAttribute("data-board-id");
    copy.removeAttribute("data-moving");
    copy.removeAttribute("role");
    copy.dir = getComputedStyle(item).direction;
    const column = item.closest("section");
    if (column) {
      const style = getComputedStyle(column);
      for (const name of ["--rx-lane-accent", "--rx-board-tint"])
        copy.style.setProperty(name, style.getPropertyValue(name));
    }
    copy.style.inlineSize = `${rect.width}px`;
    ghost.append(copy);
    return ghost;
  };
  private down = (event: PointerEvent) => {
    const handle = this.handle(event.target);
    if (!handle || event.button !== 0 || !event.isPrimary) return;
    if (this.item) this.cancel();
    this.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      handle,
    };
  };
  private move = (event: PointerEvent) => {
    const pointer = this.pointer;
    if (!pointer || event.pointerId !== pointer.id) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!this.item && Math.hypot(pointer.x - pointer.startX, pointer.y - pointer.startY) >= 6) {
      const item = this.begin(pointer.handle, "pointer");
      if (!item) {
        this.pointer = null;
        return;
      }
      this.ghost = this.preview(item, pointer);
      this.element.append(this.ghost);
      this.frame = requestAnimationFrame(this.tick);
    }
    if (this.mode === "pointer") event.preventDefault();
  };
  private tick = () => {
    const pointer = this.pointer;
    if (!pointer || this.mode !== "pointer") return;
    if (this.ghost)
      this.ghost.style.transform = `translate(${pointer.x - this.grab.x}px, ${pointer.y - this.grab.y}px)`;
    const rect = this.element.getBoundingClientRect();
    if (
      pointer.x > rect.left &&
      pointer.x < rect.right &&
      pointer.y > rect.top &&
      pointer.y < rect.bottom
    ) {
      this.element.scrollBy({
        left: pointer.x > rect.right - 32 ? 10 : pointer.x < rect.left + 32 ? -10 : 0,
      });
      const target = document.elementFromPoint(pointer.x, pointer.y);
      const column = target?.closest<HTMLElement>("[data-column-id]");
      if (column?.parentElement === this.element) {
        const before =
          this.items(column)
            .filter((item) => item !== this.item)
            .find((item) => {
              const box = item.getBoundingClientRect();
              return pointer.y < box.top + box.height / 2;
            }) ?? null;
        this.aim(column, before);
      }
    }
    if (pointer.y < 32 || pointer.y > window.innerHeight - 32)
      window.scrollBy({ top: pointer.y < 32 ? -10 : 10 });
    this.frame = requestAnimationFrame(this.tick);
  };
  private up = (event: PointerEvent) => {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    if (this.mode === "pointer") {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const column = target?.closest<HTMLElement>("[data-column-id]");
      this.suppressClick = true;
      this.finish(column?.parentElement === this.element && column.dataset.dropDisabled !== "true");
      window.setTimeout(() => {
        this.suppressClick = false;
      }, 0);
    } else this.pointer = null;
  };
  private click = (event: MouseEvent) => {
    // たたんだピルは、どこを押しても中の「開く」を押したことにする（キーボードではボタンそのものを使う）。
    const target = event.target instanceof Element ? event.target : null;
    const pill = target?.closest<HTMLElement>("section[data-collapsed='true'] > .title");
    if (pill && pill.parentElement?.parentElement === this.element && !target?.closest("button")) {
      pill.querySelector<HTMLButtonElement>(":scope > button[data-board-toggle]")?.click();
      return;
    }
    const handle = this.handle(event.target);
    if (!handle || this.suppressClick) return;
    if (this.item) this.finish(true);
    else this.begin(handle, "keyboard");
  };
  private key = (event: KeyboardEvent) => {
    const handle = this.handle(event.target);
    if (!handle) return;
    if (event.key === "Escape" && this.item) {
      event.preventDefault();
      this.cancel();
      return;
    }
    if (event.key === "Tab" && this.item) {
      this.cancel();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (this.item) this.finish(true);
      else this.begin(handle, "keyboard");
      return;
    }
    if (!this.item || this.mode !== "keyboard" || !event.key.startsWith("Arrow")) return;
    event.preventDefault();
    const location = this.locate(this.item);
    if (!location) return;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const items = this.items(location.column).filter((item) => item !== this.item);
      const index = Math.max(
        0,
        Math.min(items.length, location.index + (event.key === "ArrowUp" ? -1 : 1)),
      );
      this.place(location.column, items[index] ?? null);
    } else {
      const columns = this.columns();
      const direction = getComputedStyle(this.element).direction === "rtl" ? -1 : 1;
      const step = event.key === "ArrowRight" ? direction : -direction;
      let index = columns.indexOf(location.column) + step;
      while (columns[index]?.dataset.dropDisabled === "true") index += step;
      const next = columns[index];
      if (next) this.place(next, this.items(next)[location.index] ?? null);
    }
  };
}
