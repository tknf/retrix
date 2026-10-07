import type { Child } from "hono/jsx";
import { classes, type Accent, type ElementProps } from "./types";

export type ValueItem = {
  /** 項目名。dtに入れる。 */
  label: string;
  /** 現在の値。ddに入れる。nullかundefinedの時は淡い「未登録」を出し、0や空文字はそのまま出す。書式は利用側で決める。 */
  value: Child;
  /** 値の下に添える淡い補足。 */
  description?: string;
  /** 項目名の前に置くアイコン。塗りつぶしのアイコンを淡い色の丸に入れる。 */
  icon?: Child;
  /** アイコンの丸の色。iconを渡した時だけ効き、省略時はblueにする。 */
  accent?: Accent;
};
export type ValueListProps = ElementProps<"dl"> & {
  /** 並べる項目。一項目を項目名と値の一行にする。 */
  items: readonly ValueItem[];
};
export const ValueList = ({ items, class: className, ...attributes }: ValueListProps) => (
  <dl {...attributes} class={classes("rx-value-list", className)}>
    {items.map(({ label, value, description, icon, accent = "blue" }) => (
      <div data-accent={icon ? accent : undefined}>
        <dt>
          {icon != null && icon !== false && (
            <span class="icon" aria-hidden="true">
              {icon}
            </span>
          )}
          {label}
        </dt>
        <dd data-empty={value == null ? "true" : undefined}>
          {value ?? "未登録"}
          {description && <p class="description">{description}</p>}
        </dd>
      </div>
    ))}
  </dl>
);
