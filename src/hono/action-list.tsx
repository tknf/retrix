import type { Child } from "hono/jsx";
import { classes, type ElementProps, type Accent } from "./types";

/** 一件の項目。行（またはタイル）全体が一つのリンクになる。 */
export type ActionListItem = {
  /** 項目の名前。移動先で行う作業を動詞で書く。 */
  title: string;
  /** 移動先。行全体をこのリンクにする。 */
  href: string;
  /** 名前の下に淡い文字で添える一文。 */
  description?: string;
  /** 名前の前に置くアイコン。面に入れず、accentの色で名前の一行目の前に小さく添える。塗りつぶしのIconを想定する。 */
  icon?: Child;
  /** 説明の下に置く中身の見本（直近の数件など）。リンクの中に入るので、ボタンやリンクを入れない。 */
  preview?: Child;
  /** アイコンの色。用途を見分けるためだけに使い、状態の色には使わない。 */
  accent?: Accent;
  /** 対応が必要な行（未確認の予備の連絡先など）。名前と説明を危険の色で書く。 */
  attention?: boolean;
};
export type ActionListProps = ElementProps<"ul"> & {
  /** 並べる項目。 */
  items: readonly ActionListItem[];
  /** listは背景を持たずに行を積み、行の間を細い線で区切る。gridは各項目を白いセルにして1pxの格子で区切って並べる。 */
  layout?: "list" | "grid";
};
export const ActionList = ({
  items,
  layout = "list",
  class: className,
  ...attributes
}: ActionListProps) => (
  <ul {...attributes} class={classes("rx-action-list", className)} data-layout={layout}>
    {items.map(({ title, href, description, icon, preview, accent = "blue", attention }) => (
      <li>
        <a
          href={href}
          data-accent={attention ? "coral" : accent}
          data-attention={attention ? "true" : undefined}
        >
          {icon && <span class="icon">{icon}</span>}
          <span class="title">{title}</span>
          {description && <small class="description">{description}</small>}
          {preview != null && preview !== false && <div class="preview">{preview}</div>}
        </a>
      </li>
    ))}
  </ul>
);
