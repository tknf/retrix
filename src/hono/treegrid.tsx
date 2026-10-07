import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Icon } from "./icon";

export type TreegridColumn = {
  /** 列の見出しの文字。 */
  heading: string;
  /** 列の文字の扱い。Tableのdata-cellと同じで、textは長文を折り返し、shortは折り返さず、numericは末尾側へそろえて等幅の数字にする。 */
  cell?: "text" | "short" | "numeric";
};

export type TreegridItem = {
  /** 行を識別する値。全ての階層で一意にする。空の値と重複した値の行は、その子孫ごと描かない。 */
  value: string;
  /** 先頭の列に出す行の題名。空白だけの時はvalueを出す。 */
  label: string;
  /** 葉の行だけに設定する移動先。 */
  href?: string;
  /** 行を利用できない状態。リンクにせず、押してもShift+Spaceでも選べない。行とセルのキーボード移動は維持する。 */
  disabled?: boolean;
  /** 2列目以降のセル。columnsの2番目からの順に対応させ、足りないセルには「—」を出す。 */
  cells?: readonly Child[];
  /** 子の行。渡すと行に開閉ボタンを付け、一つ深い階層として続けて描く。 */
  children?: readonly TreegridItem[];
};

export type TreegridProps = {
  /** 表の名前。captionとaria-labelに入れる。空白だけの時は「階層表」にする。 */
  caption: string;
  /** 列。先頭の列は行の題名（label）の列になる。空の時は「項目」の一列にする。 */
  columns: readonly TreegridColumn[];
  /** 最上位の行。0件の時はstateがreadyでもemptyとして扱う。 */
  items: readonly TreegridItem[];
  /**
   * 最初に開いておく行のvalue。開閉はその後controllerが持ち、保存したい時はtreegrid:toggleで受け取る。
   * JavaScriptがない時は開閉できないので、全ての行を開いて見せ、開閉ボタンを隠す。
   */
  expanded?: readonly string[];
  /** 行の選択。singleは一行、multipleは複数行を選べ、noneは選択を持たない。 */
  selection?: "none" | "single" | "multiple";
  /** 最初に選んでおく行のvalue。singleでは表の並びで最初の一つだけを使う。 */
  selected?: readonly string[];
  /** PageUp・PageDownで移動する行数。1以上の整数でない時は10にする。 */
  pageSize?: number;
  /** 本文の行の密度。Tableのdensityと同じ。 */
  density?: "compact" | "comfortable";
  /** 表の状態。ready以外では見出しの行だけを残し、状態の文を出す。キー操作・開閉・選択も付けない。 */
  state?: "ready" | "loading" | "empty" | "error";
  /** ready以外の時に、既定の状態の文の代わりに出す内容。 */
  stateContent?: Child;
};

const uniqueItems = (items: readonly TreegridItem[], seen: Set<string>): TreegridItem[] =>
  items.flatMap((item) => {
    if (!item.value.trim() || seen.has(item.value)) return [];
    seen.add(item.value);
    return [{ ...item, children: uniqueItems(item.children ?? [], seen) }];
  });

const renderRows = (
  items: readonly TreegridItem[],
  columns: readonly TreegridColumn[],
  selected: ReadonlySet<string>,
  selection: TreegridProps["selection"],
  level = 1,
): Child[] =>
  items.flatMap((item, index) => {
    const children = item.children ?? [];
    const expandable = children.length > 0;
    const label = item.label.trim() || item.value;
    // 開閉の状態（aria-expanded・data-state・子の行のhidden）はcontrollerが接続した時に付ける。
    // JavaScriptがない時は全ての行を見せ、押しても働かない開閉ボタンはCSSで隠す。
    const row = (
      <tr
        data-treegrid-target="row"
        data-treegrid-value={item.value}
        data-treegrid-level={level}
        data-selected={selection !== "none" && selected.has(item.value) ? "true" : undefined}
        data-disabled={item.disabled ? "true" : undefined}
        aria-level={level}
        aria-posinset={index + 1}
        aria-setsize={items.length}
        aria-selected={
          selection === "multiple"
            ? selected.has(item.value)
              ? "true"
              : "false"
            : selection === "single" && selected.has(item.value)
              ? "true"
              : undefined
        }
        style={`--rx-treegrid-depth: ${level - 1}`}
      >
        <th scope="row" data-cell="text" tabindex={level === 1 && index === 0 ? 0 : -1}>
          <span class="node">
            {expandable ? (
              <Button
                class="toggle"
                variant="link"
                type="button"
                data-icon-only="true"
                data-treegrid-target="toggle"
                aria-label={`${label}を開閉`}
                tabindex={-1}
              >
                <Icon name="caret" />
              </Button>
            ) : (
              <span class="spacer" aria-hidden="true" />
            )}
            {item.href && !item.disabled && !expandable ? (
              <a href={item.href}>{label}</a>
            ) : (
              <span class="label">{label}</span>
            )}
          </span>
        </th>
        {columns.slice(1).map((column, cellIndex) => (
          <td data-cell={column.cell} tabindex={-1}>
            {item.cells?.[cellIndex] ?? "—"}
          </td>
        ))}
      </tr>
    );
    return [row, ...renderRows(children, columns, selected, selection, level + 1)];
  });

/** Tableの見た目・階層表示を共有し、開閉と二次元移動はTreegridController（上流を継承）に委ねる。 */
export const Treegrid = ({
  caption,
  columns,
  items,
  expanded = [],
  selection = "none",
  selected = [],
  pageSize = 10,
  density = "compact",
  state = "ready",
  stateContent,
}: TreegridProps) => {
  const renderedItems = uniqueItems(items, new Set());
  const renderedColumns = columns.length > 0 ? columns : [{ heading: "項目" }];
  const accessibleCaption = caption.trim() || "階層表";
  const navigationPageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const currentState = state === "ready" && renderedItems.length === 0 ? "empty" : state;
  const interactive = currentState === "ready";
  return (
    <div class="rx-table rx-treegrid" data-state={currentState}>
      <table
        class="table"
        role={interactive ? "treegrid" : undefined}
        aria-label={accessibleCaption}
        aria-multiselectable={interactive && selection === "multiple" ? "true" : undefined}
        aria-busy={currentState === "loading" ? "true" : undefined}
        data-density={density}
        data-controller={interactive ? "treegrid" : undefined}
        data-treegrid-expanded-value={interactive ? JSON.stringify(expanded) : undefined}
        data-treegrid-selection-value={interactive ? selection : undefined}
        data-treegrid-selected-value={interactive ? JSON.stringify(selected) : undefined}
        data-treegrid-page-size-value={interactive ? navigationPageSize : undefined}
      >
        <caption>{accessibleCaption}</caption>
        <thead>
          <tr>
            {renderedColumns.map((column) => (
              <th scope="col" data-cell={column.cell}>
                {column.heading}
              </th>
            ))}
          </tr>
        </thead>
        {interactive && (
          <tbody>{renderRows(renderedItems, renderedColumns, new Set(selected), selection)}</tbody>
        )}
      </table>
      {!interactive && (
        <div class="state" role="status">
          {stateContent ??
            (currentState === "loading"
              ? "読み込んでいます…"
              : currentState === "error"
                ? "一覧を読み込めませんでした。"
                : "表示する項目はありません。")}
        </div>
      )}
    </div>
  );
};
