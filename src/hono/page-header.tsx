import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type PageHeaderProps = ElementProps<"header"> & {
  /** 画面の見出し。h1で出すので、一つの画面に一つだけ置く。 */
  title: string;
  /** 見出しの下の補足の一文。 */
  description?: string;
  /** 見出しの先頭側に置く大きなアイコン（Iconなど）。淡い灰色の面に白い縁と浅い影を付けた48pxの四角に収める。 */
  icon?: Child;
  /** 見出しの末尾側に並べる操作。狭い場所では見出しの下の行へ回す。 */
  actions?: Child;
  /** startは先頭側に揃える。centerは見出しを中央に置き、左右から線を伸ばして作業面の主題として示す。 */
  align?: "center" | "start";
};
export const PageHeader = ({
  title,
  description,
  align = "start",
  icon,
  actions,
  class: className,
  ...attributes
}: PageHeaderProps) => (
  <header {...attributes} class={classes("rx-page-header", className)} data-align={align}>
    {icon && <span class="icon">{icon}</span>}
    <hgroup class="heading">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </hgroup>
    {actions && <div class="actions">{actions}</div>}
  </header>
);
