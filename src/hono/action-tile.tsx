import type { JSX } from "hono/jsx";
import { Badge } from "./badge";
import { Icon, type IconName } from "./icon";
import { Keycap } from "./keycap";
import { classes, type Accent } from "./types";

type TileContent = {
  /** 名前。アイコンの下に置き、長い時は文節の切れ目で折り返す。 */
  label: string;
  /** 塗りつぶしで上に置くアイコン。 */
  icon: IconName;
  /** アイコンの色。既定は青。 */
  accent?: Accent;
  /**
   * 使えない状態にする。リンクは`href`を外して移動しない状態（`aria-disabled`）にし、ボタンは押せなくする。
   * 移動しないリンクはTabで止まらず、リンクだけの属性（`target`・`rel`など）と`tabindex`を外し、ほかの属性は保つ。
   */
  disabled?: boolean;
  /** ルートに追加するクラス。`rx-action-tile`は常に付く。 */
  class?: string;
  /** 表示用のショートカットキー。Keycapの小さい形で、アイコンの末尾側の上に添える。登録は利用側で行う。 */
  shortcut?: string;
  /** 状態バッジ（「下書き」など）。Badgeの小さい形で、アイコンの上に重ねる。 */
  badge?: string;
};
export type ActionTileProps =
  | (TileContent & {
      /** 移動先。渡すとリンクになり、渡さなければ`type="button"`のボタンになる。 */
      href: string;
      /** 今いる場所へのリンクとして`aria-current="page"`を付ける。 */
      current?: boolean;
    } & Omit<JSX.IntrinsicElements["a"], "class" | "children">)
  | (TileContent & { href?: never } & Omit<JSX.IntrinsicElements["button"], "class" | "children">);

/**
 * 塗りつぶしのアイコンを上・名前を下に置いた、格子に並べるリンクや操作のタイル。
 * CommandMenuのリンクやTableの一括操作に使う。hrefを渡すと移動のリンク、渡さなければボタンになる。
 */
export const ActionTile = (props: ActionTileProps) => {
  const { label, icon, accent, disabled, class: className, shortcut, badge } = props;
  const content = (
    <>
      <span class="icon">
        <Icon name={icon} fill />
        {badge && (
          <Badge tone="info" size="small">
            {badge}
          </Badge>
        )}
      </span>
      <span class="name">{label}</span>
      {shortcut && <Keycap class="shortcut" keys={[shortcut]} size="small" aria-hidden="true" />}
    </>
  );
  if (props.href !== undefined) {
    const {
      href,
      current,
      label: _l,
      icon: _i,
      accent: _a,
      disabled: _d,
      class: _c,
      shortcut: _s,
      badge: _b,
      ...attributes
    } = props;
    // 移動しないリンクには、リンクだけの属性とTabの停止点を移さない。aria-descriptionやdata属性は残す。
    const {
      target: _target,
      rel: _rel,
      download: _download,
      hreflang: _hreflang,
      ping: _ping,
      referrerpolicy: _referrerpolicy,
      type: _type,
      tabindex: _tabindex,
      ...common
    } = attributes;
    return disabled ? (
      <span
        {...common}
        class={classes("rx-action-tile", className)}
        data-accent={accent}
        data-disabled="true"
        role="link"
        aria-disabled="true"
      >
        {content}
      </span>
    ) : (
      <a
        {...attributes}
        class={classes("rx-action-tile", className)}
        data-accent={accent}
        href={href}
        aria-current={current ? "page" : undefined}
      >
        {content}
      </a>
    );
  }
  const {
    label: _l,
    icon: _i,
    accent: _a,
    disabled: _d,
    class: _c,
    href: _h,
    shortcut: _s,
    badge: _b,
    ...attributes
  } = props;
  return (
    <button
      type="button"
      {...attributes}
      class={classes("rx-action-tile", className)}
      data-accent={accent}
      disabled={disabled}
    >
      {content}
    </button>
  );
};
