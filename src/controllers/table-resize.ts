import { Controller } from "@hotwired/stimulus";
import {
  parseTableWidths,
  serializeTableWidths,
  tableWidthMax,
  tableWidthMin,
  tableWidthsCookieName,
  type TableWidths,
} from "../internal/table-widths";

/** 矢印キーで変える幅（px）。Shiftを押している時は大きく変える。 */
const step = 16;
const largeStep = 64;
/** 幅を決めていない最後の列に残す幅（px）。Tableの初回の描画と同じ値にする。 */
const restColumnWidth = 128;

const clamp = (width: number) =>
  Math.min(tableWidthMax, Math.max(tableWidthMin, Math.round(width)));

type Drag = { index: number; startX: number; startWidth: number; handle: HTMLElement };

/**
 * 列の見出しの末尾側の縁にハンドルを置き、ドラッグか矢印キーで列の幅を変える。
 * 幅は<colgroup>の<col>に持ち、表をtable-layout: fixedにする。最後の列は残りの幅を使う。
 * storageKeyがあれば幅をcookieへ保存し、サーバーがTableのsavedColumnWidthsへ渡すと初回の描画から反映する。
 * 幅を変えるたびにtable-resize:changeイベントを発火する。ハンドルをダブルクリックすると、全ての列を元の幅に戻す。
 */
export class TableResizeController extends Controller<HTMLTableElement> {
  static values = { storageKey: String };
  declare readonly storageKeyValue: string;
  declare readonly hasStorageKeyValue: boolean;
  private handles: HTMLElement[] = [];
  private drag: Drag | null = null;

  connect = () => {
    const headers = this.headers();
    // 見出しが複数の列にまたがる表は、列と見出しの対応が決まらないので幅を変えない。
    if (headers.length < 2 || headers.some((header) => header.colSpan > 1)) return;
    if (this.element.dataset.resized !== "true") {
      const stored = this.read();
      if (stored.length === headers.length && stored.some((width) => width !== null))
        this.apply(stored);
    }
    this.addHandles(headers);
  };
  disconnect = () => {
    this.stopDrag();
    for (const handle of this.handles) handle.remove();
    this.handles = [];
  };

  private headers = () =>
    Array.from(
      this.element.querySelectorAll<HTMLTableCellElement>(":scope > thead > tr:last-child > th"),
    );
  private columns = () =>
    this.element.querySelector<HTMLTableColElement>(":scope > colgroup[data-table-resize-columns]");
  private rtl = () => getComputedStyle(this.element).direction === "rtl";

  private addHandles = (headers: HTMLTableCellElement[]) => {
    headers.forEach((header, index) => {
      // 最後の列は残りの幅を使い、行を選ぶチェックの列は幅を変えない。
      if (index === headers.length - 1 || header.querySelector(".rx-choice")) return;
      const name = (header.textContent ?? "").replace("↕", "").trim();
      const handle = document.createElement("span");
      handle.className = "resize";
      handle.tabIndex = 0;
      handle.setAttribute("role", "separator");
      handle.setAttribute("aria-orientation", "vertical");
      handle.setAttribute("aria-label", `「${name}」の列の幅`);
      handle.setAttribute("aria-valuemin", String(tableWidthMin));
      handle.setAttribute("aria-valuemax", String(tableWidthMax));
      handle.setAttribute(
        "aria-valuenow",
        String(Math.round(header.getBoundingClientRect().width)),
      );
      handle.dataset.column = String(index);
      handle.addEventListener("pointerdown", this.pointerDown);
      handle.addEventListener("keydown", this.keyDown);
      handle.addEventListener("dblclick", this.reset);
      header.append(handle);
      this.handles.push(handle);
    });
  };

  /** 今の列の幅。幅を変える前は、描画された見出しの幅を読んで固定する。 */
  private widths = (): TableWidths => {
    const headers = this.headers();
    const columns = this.columns();
    if (this.element.dataset.resized === "true" && columns) {
      const cols = Array.from(columns.children);
      return headers.map((header, index) => {
        if (index === headers.length - 1) return null;
        const value = Number.parseFloat(
          cols[index] instanceof HTMLElement ? cols[index].style.inlineSize : "",
        );
        return Number.isFinite(value) ? value : clamp(header.getBoundingClientRect().width);
      });
    }
    return headers.map((header, index) =>
      index === headers.length - 1 ? null : clamp(header.getBoundingClientRect().width),
    );
  };

  private apply = (widths: TableWidths) => {
    const headers = this.headers();
    let columns = this.columns();
    if (!columns) {
      columns = document.createElement("colgroup");
      columns.dataset.tableResizeColumns = "";
      const caption = this.element.querySelector(":scope > caption");
      if (caption) caption.after(columns);
      else this.element.prepend(columns);
    }
    while (columns.children.length < headers.length) columns.append(document.createElement("col"));
    while (columns.children.length > headers.length) columns.lastElementChild?.remove();
    let total = restColumnWidth;
    Array.from(columns.children).forEach((col, index) => {
      if (!(col instanceof HTMLElement)) return;
      const width = index === headers.length - 1 ? null : (widths[index] ?? null);
      col.style.inlineSize = width === null ? "" : `${width}px`;
      total += width ?? 0;
    });
    this.element.dataset.resized = "true";
    this.element.style.inlineSize = `max(100%, ${total}px)`;
    for (const handle of this.handles) {
      const width = widths[Number(handle.dataset.column)];
      if (width != null) handle.setAttribute("aria-valuenow", String(width));
    }
  };

  private setWidth = (index: number, width: number) => {
    const widths = this.widths();
    widths[index] = clamp(width);
    this.apply(widths);
  };

  private pointerDown = (event: PointerEvent) => {
    const handle = event.currentTarget;
    if (event.button !== 0 || !(handle instanceof HTMLElement)) return;
    event.preventDefault();
    const index = Number(handle.dataset.column);
    const startWidth = this.widths()[index] ?? tableWidthMin;
    this.drag = { index, startX: event.clientX, startWidth, handle };
    handle.setPointerCapture(event.pointerId);
    handle.addEventListener("pointermove", this.pointerMove);
    handle.addEventListener("pointerup", this.pointerUp);
    handle.addEventListener("pointercancel", this.pointerCancel);
    this.element.dataset.resizing = "true";
  };
  private pointerMove = (event: PointerEvent) => {
    if (!this.drag) return;
    const delta = (event.clientX - this.drag.startX) * (this.rtl() ? -1 : 1);
    this.setWidth(this.drag.index, this.drag.startWidth + delta);
  };
  private pointerUp = () => {
    const index = this.drag?.index;
    this.stopDrag();
    if (index !== undefined) this.save(index);
  };
  private pointerCancel = () => {
    if (this.drag) this.setWidth(this.drag.index, this.drag.startWidth);
    this.stopDrag();
  };
  private stopDrag = () => {
    const handle = this.drag?.handle;
    handle?.removeEventListener("pointermove", this.pointerMove);
    handle?.removeEventListener("pointerup", this.pointerUp);
    handle?.removeEventListener("pointercancel", this.pointerCancel);
    this.drag = null;
    delete this.element.dataset.resizing;
  };

  private keyDown = (event: KeyboardEvent) => {
    const handle = event.currentTarget;
    if (!(handle instanceof HTMLElement)) return;
    const index = Number(handle.dataset.column);
    const current = this.widths()[index] ?? tableWidthMin;
    const amount = event.shiftKey ? largeStep : step;
    const forward = this.rtl() ? "ArrowLeft" : "ArrowRight";
    const backward = this.rtl() ? "ArrowRight" : "ArrowLeft";
    let next: number;
    if (event.key === forward) next = current + amount;
    else if (event.key === backward) next = current - amount;
    else if (event.key === "Home") next = tableWidthMin;
    else if (event.key === "End") next = tableWidthMax;
    else return;
    event.preventDefault();
    this.setWidth(index, next);
    this.save(index);
  };

  /** 全ての列を元の幅（内容に合わせた自動の幅）に戻し、保存した幅を消す。 */
  reset = () => {
    this.columns()?.remove();
    delete this.element.dataset.resized;
    this.element.style.removeProperty("inline-size");
    const headers = this.headers();
    for (const handle of this.handles) {
      const header = headers[Number(handle.dataset.column)];
      if (header)
        handle.setAttribute(
          "aria-valuenow",
          String(Math.round(header.getBoundingClientRect().width)),
        );
    }
    if (this.hasStorageKeyValue && this.storageKeyValue)
      document.cookie = `${tableWidthsCookieName(this.storageKeyValue)}=; path=/; max-age=0; samesite=lax`;
    this.dispatch("change", { detail: { widths: [], column: null } });
  };

  private read = (): TableWidths => {
    if (!this.hasStorageKeyValue || !this.storageKeyValue) return [];
    const name = `${tableWidthsCookieName(this.storageKeyValue)}=`;
    const entry = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(name))
      ?.slice(name.length);
    return parseTableWidths(entry === undefined ? undefined : decodeURIComponent(entry));
  };
  private save = (column: number) => {
    const widths = this.widths();
    if (this.hasStorageKeyValue && this.storageKeyValue)
      document.cookie = `${tableWidthsCookieName(this.storageKeyValue)}=${encodeURIComponent(
        serializeTableWidths(widths),
      )}; path=/; max-age=31536000; samesite=lax`;
    this.dispatch("change", { detail: { widths, column } });
  };
}
