import { useId } from "hono/jsx";
import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Icon } from "./icon";
import { classes, type ElementProps, type Tone } from "./types";

export type BoardEntry = {
  /** 項目のid。board:beforemoveとboard:moveのdetail.idで返る。Boardの中で一意にする。 */
  id: string;
  /** 項目の名前。ハンドルの読み上げ名（「〜を移動」）と、ドラッグ中の読み上げに使う。 */
  label: string;
  /** カードに載せる中身。見出し・本文・TagGroup・Progressなど任意の要素を置ける。 */
  content: Child;
  /** 動かせない項目。ハンドルを無効にする。 */
  disabled?: boolean;
  /** 項目の番号など。カードの上の先頭側に、列の色の小さな太字で置く。 */
  code?: string;
};
type Column = {
  /** 列のid。移動と開閉のイベントで列を指す値になる。省略すると並び順の番号（"0"から）。 */
  id?: string;
  /** 列の名前。見出しに書き、項目の一覧の読み上げ名にもする。 */
  title: string;
  /** 列の役割の色。列の上端の線と、項目のcodeの文字に出す。カードは染めない。neutralは上端の線を引かない。 */
  tone?: Tone;
  /** 今の列（今日の担当など）。toneに関わらず上端の線を青緑にする。 */
  current?: boolean;
  /**
   * 項目が無い時に置く文。省略すると、movableなら「ここへ移動できます」（受け付けない列は「この列には移動できません」）、
   * movableでなければ「項目はありません」を置く。
   */
  empty?: Child;
  /** 項目を受け付けない列。列の名前を灰色にし、移動先にしない。 */
  disabled?: boolean;
  /** たたんだ列。件数と縦書きの名前を載せた細い縦長の帯になり、中の項目は隠す。移動先にはならない。 */
  collapsed?: boolean;
  /**
   * 列を押して開閉できるようにする。たたんだ帯に「開く」、開いた列の見出しに「たたむ」を置き、
   * 押すとBoardControllerが表示を切り替えて、取り消せるboard:toggleイベントを発火する。開閉の保存は利用側が持つ。
   * 開閉のボタンは、BoardControllerが接続するまで隠す。
   */
  collapsible?: boolean;
} & (
  | {
      /** 列の項目。渡した順に上から並べる。件数は項目の数から数える。 */
      items: readonly BoardEntry[];
      content?: never;
      count?: never;
    }
  | {
      /** 項目の代わりに置く任意の中身。移動先にはならない。 */
      content: Child;
      /** contentの時に見出しへ添える件数。 */
      count: number;
      items?: never;
    }
);
export type BoardProps = ElementProps<"div"> & {
  /** Board全体（role="region"）の読み上げ名。 */
  label: string;
  /** 列。渡した順に先頭側から並べる。 */
  columns: readonly Column[];
  /**
   * 項目にハンドルを置き、列の間の移動と並べ替えを有効にする。BoardControllerをboardとして登録する。
   * ハンドルはcontrollerが接続するまで無効のまま。
   */
  movable?: boolean;
};
export const Board = ({
  label,
  columns,
  movable = false,
  id,
  class: className,
  style,
  ...attributes
}: BoardProps) => {
  const generated = useId();
  const boardId = id ?? `board-${generated}`;
  // たたんだ列だけ帯の幅にするため、列ごとの幅の決め方を並び順どおりに渡す。
  const tracks = columns
    .map((column) => (column.collapsed ? "auto" : "minmax(auto, 1fr)"))
    .join(" ");
  return (
    <div
      {...attributes}
      id={boardId}
      class={classes("rx-board", className)}
      style={
        typeof style === "object"
          ? { ...style, "--rx-board-tracks": tracks }
          : `--rx-board-tracks: ${tracks}${style ? `; ${style}` : ""}`
      }
      role="region"
      aria-label={label}
      tabindex={0}
      data-controller={
        movable || columns.some((column) => column.collapsible) ? "board" : undefined
      }
      data-movable={movable ? "true" : undefined}
    >
      {columns.map((column, index) => (
        <section
          data-column-id={column.id ?? String(index)}
          data-drop-disabled={
            column.disabled || column.collapsed || !column.items ? "true" : undefined
          }
          data-disabled={column.disabled ? "true" : undefined}
          data-current={column.current ? "true" : undefined}
          data-collapsed={column.collapsed ? "true" : undefined}
          data-tone={column.tone ?? "neutral"}
        >
          <h3 class="title">
            <span class="label">{column.title}</span>
            <small>{column.items?.length ?? column.count}</small>
            {column.collapsible && (
              <Button
                class="toggle"
                variant="link"
                data-icon-only="true"
                data-action="board#toggle"
                data-board-toggle
                hidden
                aria-expanded={column.collapsed ? "false" : "true"}
                aria-label={`「${column.title}」の列を開閉`}
              >
                <Icon name="expand" class="expand" />
                <Icon name="collapse" class="collapse" />
              </Button>
            )}
          </h3>
          <div
            class="items"
            role={column.items ? "list" : undefined}
            aria-label={column.items ? column.title : undefined}
          >
            {column.items
              ? column.items.map((item) => (
                  <article
                    class="rx-board-item"
                    role="listitem"
                    data-board-id={item.id}
                    data-board-label={item.label}
                    data-disabled={item.disabled ? "true" : undefined}
                  >
                    {item.code && <span class="code">{item.code}</span>}
                    <div class="body">{item.content}</div>
                    {movable && (
                      <Button
                        class="handle"
                        variant="link"
                        data-icon-only="true"
                        data-board-handle
                        aria-label={`「${item.label}」を移動`}
                        aria-describedby={`${boardId}-help`}
                        disabled
                      >
                        <Icon name="grip" />
                      </Button>
                    )}
                  </article>
                ))
              : column.content}
          </div>
          <div class="empty">
            {column.empty ??
              (movable
                ? column.disabled || !column.items
                  ? "この列には移動できません"
                  : "ここへ移動できます"
                : "項目はありません")}
          </div>
        </section>
      ))}
      {movable && (
        <>
          <p id={`${boardId}-help`} class="rx-visually-hidden">
            移動ボタンをドラッグします。キーボードではSpaceで持ち上げ、左右矢印で列、上下矢印で位置を選び、Enterで確定、Escapeで取り消します。
          </p>
          <p class="rx-visually-hidden" role="status" data-board-announcement aria-live="polite" />
        </>
      )}
    </div>
  );
};
