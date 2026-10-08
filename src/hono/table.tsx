import type { Child, PropsWithChildren } from "hono/jsx";
import { Button } from "./button";
import { OverlayClose } from "./overlay-content";
import { classes, type ElementProps } from "./types";
import { parseTableWidths, tableWidthsCookieName } from "../internal/table-widths";

export { tableWidthsCookieName };

/** 幅を決めていない最後の列に残す幅（px）。列の幅の合計が表の囲みより広い時も、最後の列が潰れないようにする。 */
const restColumnWidth = 128;

export type TableProps = PropsWithChildren<
  ElementProps<"table"> & {
    /** 表の名前。captionに出し、スクロールする囲み（role="region"）のaria-labelにも使う。 */
    caption: string;
    /** 本文の行の密度。comfortableは本文の行の上下の余白を広げる。 */
    density?: "compact" | "comfortable";
    /** 本文の偶数行に淡い面を敷く。行が多く横に長い表で、行をたどりやすくする。 */
    striped?: boolean;
    /**
     * 並べ替えの方式。TableSortの見出しを押すと、昇順・降順・元の順を順に切り替える。
     * localは表示中の行をその場で並べ替え、manualは行を動かさずtable:sortイベントだけを発火する（サーバー側で並べ替える時に使う）。
     */
    sort?: "local" | "manual";
    /** 行の選択を有効にする。TableSelectionのチェックで選び、選んでいる間は画面の下の中央に選択バーを出す。 */
    selectable?: boolean;
    /**
     * 選択バーに件数に続けて並べる一括操作（ActionTileやButton）。selectableの時だけ出す。
     * JavaScriptがない時は表の下に置くので、行のチェックと同じformの送信ボタンにすると選んだ行を送れる。
     */
    selectionActions?: Child;
    /** 見出しの行をスクロールしても上に留める。表の囲みの高さを28remまでにし、囲みの中で縦にスクロールする。 */
    stickyHeader?: boolean;
    /**
     * 列の幅を変えられるようにする。TableResizeControllerが列の見出しの末尾側の縁にハンドルを置き、
     * ドラッグか矢印キーで幅を変える。最後の列は残りの幅を使う。
     */
    resizable?: boolean;
    /** 列の幅を保存するcookieのキー。resizableの時に使い、cookie名はtableWidthsCookieName(storageKey)。省略すると保存しない。 */
    storageKey?: string;
    /** サーバーで読んだcookieの値（tableWidthsCookieName(storageKey)の値）。渡すと初回の描画から保存した幅で表示する。 */
    savedColumnWidths?: string;
    /** 表の状態。ready以外ではtheadを残して本文の行を隠し、状態の文を出す。並べ替えと選択も止める。loadingではaria-busyを付ける。 */
    state?: "ready" | "loading" | "empty" | "error";
    /** ready以外の時に、既定の状態の文の代わりに出す内容。 */
    stateContent?: Child;
  }
>;
export const Table = ({
  children,
  caption,
  density = "compact",
  striped = false,
  sort,
  selectable = false,
  selectionActions,
  stickyHeader = false,
  resizable = false,
  storageKey,
  savedColumnWidths,
  state = "ready",
  stateContent,
  class: className,
  ...attributes
}: TableProps) => {
  const widths = resizable && storageKey ? parseTableWidths(savedColumnWidths) : [];
  const resized = widths.some((width) => width !== null);
  const total = widths.reduce<number>((sum, width) => sum + (width ?? 0), 0) + restColumnWidth;
  return (
    <div
      class="rx-table"
      role="region"
      aria-label={caption}
      tabindex={0}
      data-controller={sort || selectable ? "table" : undefined}
      data-sort-mode={sort}
      data-state={state}
      data-sticky={stickyHeader ? "true" : undefined}
    >
      <table
        {...attributes}
        data-controller={classes(
          [
            state === "ready" && sort ? "table-sort" : "",
            state === "ready" && selectable ? "table-select" : "",
            resizable ? "table-resize" : "",
          ]
            .filter(Boolean)
            .join(" "),
          attributes["data-controller"],
        )}
        data-table-resize-storage-key-value={resizable ? storageKey : undefined}
        data-resized={resized ? "true" : undefined}
        style={resized ? `inline-size: max(100%, ${total}px)` : attributes.style}
        data-density={density}
        data-striped={striped ? "true" : undefined}
        class={classes("table", className)}
        aria-busy={state === "loading" ? "true" : undefined}
      >
        <caption>{caption}</caption>
        {resized && (
          <colgroup data-table-resize-columns>
            {widths.map((width, index) => (
              <col
                style={
                  width !== null && index < widths.length - 1
                    ? `inline-size: ${width}px`
                    : undefined
                }
              />
            ))}
          </colgroup>
        )}
        {children}
      </table>
      {state !== "ready" && (
        <div class="state" role="status">
          {stateContent ??
            (state === "loading"
              ? "読み込んでいます…"
              : state === "error"
                ? "一覧を読み込めませんでした。"
                : "表示する項目はありません。")}
        </div>
      )}
      {selectable && (
        // 選択バーはActionDockと同じ操作バーにし、画面の下の中央に浮かべて表を動かさない。件数と一括操作を横一列に並べ、解除の×はDialogと同じくパネルの角に置く。
        // 行のチェックの後にTabで届くよう、DOMでは表の後に置く。popoverにして開閉するのはTableControllerで、JavaScriptがない時は表の下に一括操作を置く。
        <div class="selection-bar" role="group" aria-label="選択した行の操作">
          <header class="heading">
            <span class="count" role="status" aria-live="polite" />
            <OverlayClose label="選択を解除" data-table-clear />
          </header>
          {selectionActions != null && selectionActions !== false && (
            <div class="actions">{selectionActions}</div>
          )}
        </div>
      )}
      {(sort || selectable) && (
        <p class="rx-visually-hidden" data-table-announcement role="status" />
      )}
    </div>
  );
};

export type TableSortProps = PropsWithChildren<
  ElementProps<"th"> & {
    /** 列を識別する値。表の中で一意にし、table:sortのdetail.columnで渡す。 */
    column: string;
    /**
     * sort="local"で値を比べる方法。textは文字の自然順、numberは桁区切りのカンマを除いた数、dateはDate.parseで読める日時で比べる。
     * 比べる値はセルのdata-sort-value、無ければセルの文字から読む。読めない値と空の値は、昇順でも降順でも末尾に置く。
     */
    type?: "text" | "number" | "date";
    /** この列の並べ替えを止める。見出しのボタンを押せなくする。 */
    disabled?: boolean;
  }
>;
/** 並べ替え可能な見出しセル。上流controllerの契約に沿ったthを出力する。 */
export const TableSort = ({
  children,
  column,
  type = "text",
  disabled = false,
  ...attributes
}: TableSortProps) => (
  <th
    {...attributes}
    scope="col"
    aria-sort="none"
    data-state="none"
    data-table-sort-target="sortable"
    data-table-sort-column={column}
  >
    <Button
      class="sort"
      data-table-sort={column}
      data-sort-type={type}
      data-sort-disabled={disabled ? "true" : undefined}
      disabled
    >
      {children}
      <span class="indicator" aria-hidden="true">
        ↕
      </span>
    </Button>
  </th>
);

export type TableSelectionProps = Omit<ElementProps<"input">, "type"> & {
  /** チェックボックスの読み上げ名。aria-labelに入れる（例：「〇〇を選択」「すべての行を選択」）。 */
  label: string;
  /** 行を識別する値。表の中で一意にし、table:selectionchangeのdetail.idsで渡す。省略すると表の全ての行を選ぶチェックボックスになる。 */
  rowId?: string;
};
/** rowIdなしは現在の表の全選択。行のcheckboxは送信用name/value/formも指定できる。 */
export const TableSelection = ({ label, rowId, ...attributes }: TableSelectionProps) => (
  <label class="rx-choice">
    <input
      {...attributes}
      type="checkbox"
      aria-label={label}
      data-table-select={rowId === undefined ? "all" : "row"}
      data-row-id={rowId}
      data-table-select-target={rowId === undefined ? "all" : "item"}
      data-table-select-value={rowId}
    />
  </label>
);
