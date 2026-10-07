import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

/** 一覧の一行。 */
export type DataListItem = {
  /** 行の題名。太字で書く。 */
  title: string;
  /** 題名の下に淡い文字で添える一文。 */
  description?: string;
  /** 渡すと題名をリンクにし、行全体を押せる範囲にする。渡さなければ押せない行になる。 */
  href?: string;
  /** 行の先頭に置くアイコンやAvatar。題名と説明の二行分の高さの中央にそろえる。 */
  start?: Child;
  /** 説明の下に淡い文字で添える補足（担当者や更新日など）。 */
  meta?: Child;
  /**
   * 行の末尾に置く状態や操作（Badge・Button・数など）。リンクの行でも上に重ねて押せる。
   * 広い幅では右の列、狭い幅では説明の下に積む。0も表示する。
   */
  end?: Child;
  /** 今開いている行。淡い青の背景で示し、リンクにaria-current="true"を付ける。 */
  current?: boolean;
};
export type DataListProps = ElementProps<"ul"> & {
  /** 並べる行。順序はそのまま表示する。 */
  items: readonly DataListItem[];
};
export const DataList = ({ items, class: className, ...attributes }: DataListProps) => (
  <ul {...attributes} class={classes("rx-data-list", className)}>
    {items.map(({ title, description, href, start, meta, end, current }) => (
      <li data-current={current ? "true" : undefined}>
        {start != null && start !== false && <div class="start">{start}</div>}
        <div class="body">
          {href ? (
            <a class="title" href={href} aria-current={current ? "true" : undefined}>
              {title}
            </a>
          ) : (
            <strong class="title">{title}</strong>
          )}
          {description && <p class="description">{description}</p>}
          {meta != null && meta !== false && <div class="meta">{meta}</div>}
        </div>
        {(end || end === 0) && <div class="end">{end}</div>}
      </li>
    ))}
  </ul>
);
