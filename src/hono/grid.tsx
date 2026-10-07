import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type GridColumn = {
  /** 列を識別する値。見出しとセルのdata-column-idに入れる。 */
  id: string;
  /** 列の見出しの文字。 */
  label: string;
  /** 今日の列。見出しを蛍光ペンの黄のピルで囲み、aria-current="date"を付ける。 */
  current?: boolean;
};
export type GridCell = {
  /** セルの中身。 */
  content: Child;
  /** 使えないセル。斜線で示し、aria-disabledを付ける。キーでの移動先には残る。 */
  disabled?: boolean;
};
export type GridRow = {
  /** 行を識別する値。行のdata-row-idに入れる。 */
  id: string;
  /** 行の見出し（th scope="row"）の文字。横にスクロールしても先頭側に留める。 */
  label: string;
  /** 行のセル。columnsと同じ数、同じ順に渡す。 */
  cells: readonly GridCell[];
};
export type GridProps = ElementProps<"div"> & {
  /** 表の名前。captionに出す。空にはできない。 */
  caption: string;
  /** 行の見出しの列の見出し（左上の角の文字）。空にはできない。 */
  rowHeader: string;
  /** 列。1列以上を渡す。 */
  columns: readonly GridColumn[];
  /** 行。0件の時はキー移動を付けず、emptyを出す。 */
  rows: readonly GridRow[];
  /** PageUp・PageDownで移動する行数。1以上の整数にする。 */
  pageSize?: number;
  /** 行が0件の時に表の下に出す内容。 */
  empty?: Child;
};

/** 等列数の native table に上流 GridController の二次元移動を付ける。 */
export const Grid = ({
  caption,
  rowHeader,
  columns,
  rows,
  pageSize = 10,
  empty = "表示できる項目はありません。",
  class: className,
  ...attributes
}: GridProps) => {
  if (!caption.trim() || !rowHeader.trim() || columns.length === 0) {
    throw new Error("Gridにはcaption・rowHeader・1列以上のcolumnsが必要です。");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error("GridのpageSizeには1以上の整数を指定してください。");
  }
  if (rows.some((row) => row.cells.length !== columns.length)) {
    throw new Error("Gridの各行のcellsはcolumnsと同じ数にしてください。");
  }

  return (
    <div {...attributes} class={classes("rx-grid", className)}>
      <table
        class="table"
        role={rows.length > 0 ? "grid" : undefined}
        data-controller={rows.length > 0 ? "grid" : undefined}
        data-grid-page-size-value={pageSize}
      >
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{rowHeader}</th>
            {columns.map((column) => (
              <th
                scope="col"
                data-column-id={column.id}
                data-current={column.current ? "true" : undefined}
                aria-current={column.current ? "date" : undefined}
              >
                <span class="label">{column.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr data-row-id={row.id}>
              <th scope="row">{row.label}</th>
              {row.cells.map((cell, index) => (
                <td
                  data-column-id={columns[index]?.id}
                  data-disabled={cell.disabled ? "true" : undefined}
                  aria-disabled={cell.disabled ? "true" : undefined}
                >
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p class="empty" role="status">
          {empty}
        </p>
      )}
    </div>
  );
};
