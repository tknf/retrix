import type { Child } from "hono/jsx";
import { NavigationItems, type NavigationItem } from "./navigation-items";
import { classes, type ElementProps } from "./types";

/** FilterBarの一件。Navigationの項目と同じ形で、currentは選んでいる条件を示す。 */
export type FilterBarItem = NavigationItem;
export type FilterBarProps = Omit<ElementProps<"nav">, "children" | "aria-label"> & {
  /** navの読み上げ名。何を絞り込むか・切り替えるかを短く書く（「記事の状態」など）。 */
  label: string;
  /** chipsは折り返す絞り込み、segmentedは表示の切り替えとしてつながった一組で並べる。 */
  appearance?: "chips" | "segmented";
} & (
    | {
        /** 並べる条件。並べた順にActionLinkのリンクにする。 */
        items: readonly FilterBarItem[];
        children?: never;
      }
    | {
        items?: never;
        /** itemsの代わりに直接並べるリンク。現在地のaria-currentなどは利用側で付ける。 */
        children: Child;
      }
  );

export const FilterBar = ({
  children,
  items,
  label,
  appearance = "chips",
  class: className,
  ...attributes
}: FilterBarProps) => (
  <nav
    {...attributes}
    class={classes("rx-filter-bar", className)}
    aria-label={label}
    data-appearance={appearance === "segmented" ? "segmented" : undefined}
  >
    {items ? <NavigationItems items={items} appearance="button" /> : children}
  </nav>
);
