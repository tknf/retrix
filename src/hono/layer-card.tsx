import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type LayerCardProps = PropsWithChildren<
  ElementProps<"section"> & {
    /** 上端の帯に置く見出し（h3）の文字。12pxの黒い太字にする。 */
    title: string;
    /** 見出しの行の末尾側に置く操作（ActionLinkやButton）。題名が折り返しても一行目に残し、題名の幅が8remを割る時だけ次の行へ送る。 */
    actions?: Child;
  }
>;

/**
 * 一枚の白いカードの上端に淡い灰色の見出しの帯を置き、その下の白い面に中身を載せる。
 * 見出しを帯に分けるので、題名が中身と競わない。
 */
export const LayerCard = ({
  title,
  actions,
  children,
  class: className,
  ...attributes
}: LayerCardProps) => (
  <section {...attributes} class={classes("rx-layer-card", className)}>
    <header class="heading">
      <h3 class="title">{title}</h3>
      {actions != null && actions !== false && <div class="actions">{actions}</div>}
    </header>
    <div class="body">{children}</div>
  </section>
);
