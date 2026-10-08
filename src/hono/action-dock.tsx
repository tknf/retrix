import { ActionTile, type ActionTileProps } from "./action-tile";
import { classes, type ElementProps } from "./types";

export type ActionDockProps = ElementProps<"nav"> & {
  /** 操作バーの名前。`nav`の`aria-label`として読み上げる。 */
  label: string;
  /** 並べる操作。ActionTileと同じ指定で、hrefがあればリンク、無ければボタンになる。 */
  items: readonly ActionTileProps[];
  /** fixedは画面の下の中央に浮かべ、stickyは置いた場所の下端に留める（既定）。 */
  placement?: "sticky" | "fixed";
};

/**
 * 内容の下に浮かぶ操作バー。白いパネルを画面の下の中央に浮かべ、アイコン・名前・ショートカットキーの表示を縦に積んだ操作を横に並べる。
 * 操作はActionTileで、操作バーの中では普段の面と枠を消して平らにする。
 */
export const ActionDock = ({
  label,
  items,
  placement = "sticky",
  class: className,
  ...attributes
}: ActionDockProps) => (
  <nav
    {...attributes}
    class={classes("rx-action-dock", className)}
    aria-label={label}
    data-placement={placement}
  >
    <ul>
      {items.map((item) => (
        <li>
          <ActionTile {...item} />
        </li>
      ))}
    </ul>
  </nav>
);
