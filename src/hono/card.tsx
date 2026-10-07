import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type CardProps = PropsWithChildren<
  ElementProps<"article"> & {
    /** 見出し（h3）の文字。カードでいちばん強い字にする。 */
    title: string;
    /** 見出しをリンクにする移動先。リンクは見出しだけに付け、カード全体や本文の操作には広げない。 */
    href?: string;
    /** 本文の下に添えるメタ情報（担当者・日付など）や操作。footerとして描き、並べた子は縦の罫線で区切る。`class="end"`の子は末尾側へ寄せる。 */
    footer?: Child;
    /** 見出しの上に置く画像や図。角を丸めて切り取り、imgとsvgは幅いっぱいに広げる。 */
    preview?: Child;
    /** 見出しのすぐ上に置く小さな補足（種類・分類など）。 */
    eyebrow?: Child;
  }
>;
/** リンクは見出しに限定し、本文や末尾のフォーム操作と競合させない。 */
export const Card = ({
  title,
  href,
  footer,
  preview,
  eyebrow,
  children,
  class: className,
  ...attributes
}: CardProps) => (
  <article {...attributes} class={classes("rx-card", className)}>
    {preview != null && preview !== false && <div class="preview">{preview}</div>}
    {eyebrow != null && eyebrow !== false && <div class="eyebrow">{eyebrow}</div>}
    <h3 class="title">{href ? <a href={href}>{title}</a> : title}</h3>
    <div class="body">{children}</div>
    {footer != null && footer !== false && <footer class="meta">{footer}</footer>}
  </article>
);
