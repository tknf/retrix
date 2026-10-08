import { Button, ActionLink, type ButtonProps } from "./button";
import { Keycap } from "./keycap";
import { Icon, type IconName } from "./icon";

type MenuItemLabel = {
  /** 項目名。文字を打って項目を探す時は、この名前の先頭で探す。 */
  label: string;
  /** 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。 */
  disabled?: boolean;
  /** 項目名の前に置くアイコン。 */
  icon?: IconName;
  /** 項目名の下に添える補足。読み上げでは`aria-description`になる。 */
  description?: string;
  /** 表示用の補助表記。ショートカットの登録は利用側で行う。 */
  shortcut?: string;
};
export type MenuItem =
  | (MenuItemLabel & {
      /** 通常の操作。省略してもよい。 */
      kind?: "action";
      /** 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。 */
      value: string;
      /** 削除など取り返しのつかない操作として、赤い文字で分ける。 */
      danger?: boolean;
      /** 選んだ後に閉じるか。通常の操作は既定で閉じる。falseで開いたままにする。 */
      closeOnSelect?: boolean;
    })
  | (MenuItemLabel & {
      /** ページの移動。選ぶと標準のページ移動を行い、選択のイベントは発火しない。 */
      kind: "link";
      /** 移動先。 */
      href: string;
      /** リンクを開く場所。_blankでは`rel="noopener noreferrer"`を付ける。 */
      target?: "_blank" | "_self";
    })
  | (MenuItemLabel & {
      /** オン・オフを切り替える複数選択の項目。 */
      kind: "checkbox";
      /** 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。 */
      value: string;
      /**
       * チェックマークの初期状態。mixedは一部だけ選んだ状態。選ぶたびにcontrollerが切り替え、
       * 切り替えた後の値を`detail.checked`で渡す（mixedから選ぶとtrue）。
       */
      checked?: boolean | "mixed";
      /** 選んだ後に閉じるか。チェックは既定で開いたまま更新する。trueで閉じる。 */
      closeOnSelect?: boolean;
    })
  | (MenuItemLabel & {
      /** 同じnameの中から一つを選ぶ単一選択の項目。 */
      kind: "radio";
      /** 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。 */
      value: string;
      /** 選択のまとまりの名前。同じ階層で同じnameを持つ項目から一つだけを選ぶ。 */
      name: string;
      /** 最初に選んでおく項目。 */
      checked?: boolean;
      /** 選んだ後に閉じるか。単一選択は既定で開いたまま更新する。trueで閉じる。 */
      closeOnSelect?: boolean;
    })
  | (MenuItemLabel & {
      /** 下の階層を開く項目。 */
      kind: "submenu";
      /** 下の階層の項目。入れ子にできる。 */
      items: readonly MenuItem[];
    })
  | {
      /** 区切り線。 */
      kind: "separator";
    }
  | {
      /** 見出し付きのまとまり。見出しは選べない。 */
      kind: "group";
      /** まとまりの見出し。中の項目の`role="group"`の名前にもなる。 */
      label: string;
      /** まとまりに入れる項目。 */
      items: readonly MenuItem[];
    };

export type DropdownMenuProps = Pick<ButtonProps, "variant" | "size" | "disabled" | "busy"> & {
  /** メニューのid。画面内で一意にする。開く操作は`<id>-trigger`、項目は`<id>-<番号>-item`になる。 */
  id: string;
  /** 開く操作の文言。iconOnlyの時は`aria-label`として読み上げる。 */
  label: string;
  /** メニューの項目。空ならメニューに「利用できる操作はありません」と出す。 */
  items: readonly MenuItem[];
  /**
   * ルートの`data-action`に渡すStimulusのaction。
   * `dropdown-menu:select->editor#apply`のように、選択のイベントを利用側のcontrollerへつなぐ。
   */
  action?: string;
  /** メニューを開く操作のどちらの端に揃えるか。endは行の末尾側に置いた操作に使う。 */
  align?: "start" | "end";
  /** 文字の向き。rtlでは左右の矢印キーとサブメニューの開く向きが反転する。 */
  dir?: "ltr" | "rtl";
  /** 開く操作の文言の前に置くアイコン。 */
  icon?: IconName;
  /** 開く操作をアイコンだけの正方形にする。iconが無ければ▾だけを出す。 */
  iconOnly?: boolean;
};

const MenuItems = ({ items, id }: { items: readonly MenuItem[]; id: string }) => (
  <>
    {items.length === 0 && (
      <li class="empty" role="none">
        利用できる操作はありません
      </li>
    )}
    {items.map((item, index) => {
      const itemId = `${id}-${index}`;
      if (item.kind === "separator") return <li class="separator" role="separator" />;
      if (item.kind === "group")
        return (
          <li role="none">
            <span class="label" id={`${itemId}-label`}>
              {item.label}
            </span>
            <ul
              class="rx-menu"
              data-variant="group"
              role="group"
              aria-labelledby={`${itemId}-label`}
            >
              <MenuItems items={item.items} id={itemId} />
            </ul>
          </li>
        );
      const checkable = item.kind === "checkbox" || item.kind === "radio";
      const checked = checkable ? (item.checked ?? false) : undefined;
      const content = (
        <span class="content" data-leading={checkable || item.icon ? "true" : undefined}>
          <span class="heading">
            {checkable ? (
              <span class="mark" aria-hidden="true">
                {item.kind === "radio" ? <span class="dot" /> : <Icon name="check" />}
                {item.kind === "checkbox" && <span class="mixed">−</span>}
              </span>
            ) : item.icon ? (
              <Icon name={item.icon} />
            ) : null}
            <span class="text">
              <span>{item.label}</span>
            </span>
            {item.shortcut && (
              <Keycap
                class="shortcut"
                keys={[item.shortcut]}
                size="small"
                inverse
                aria-hidden="true"
              />
            )}
            {item.kind === "submenu" && (
              <span class="caret">
                <Icon name="caret" />
              </span>
            )}
          </span>
          {item.description && <small class="description">{item.description}</small>}
        </span>
      );
      const attributes = {
        id: `${itemId}-item`,
        class: "item",
        role: checkable ? `menuitem${item.kind}` : "menuitem",
        "aria-label": item.label,
        "aria-description": item.description,
        "aria-disabled": item.disabled ? "true" : undefined,
        "data-disabled": item.disabled ? "true" : undefined,
        "data-menu-kind": item.kind ?? "action",
        "data-menu-label": item.label,
        tabindex: -1,
      } as const;
      return (
        <li role="none">
          {item.kind === "link" ? (
            item.disabled ? (
              <Button {...attributes} disabled>
                {content}
              </Button>
            ) : (
              <ActionLink
                {...attributes}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {content}
              </ActionLink>
            )
          ) : (
            <Button
              {...attributes}
              disabled={item.disabled}
              data-dropdown-menu-target="item"
              data-dropdown-menu-value={"value" in item ? item.value : undefined}
              data-menu-group={item.kind === "radio" ? item.name : undefined}
              data-close-on-select={"closeOnSelect" in item ? item.closeOnSelect : undefined}
              data-tone={
                (!item.kind || item.kind === "action") && item.danger ? "danger" : undefined
              }
              aria-checked={checked}
              data-checked={checked === undefined ? undefined : String(checked)}
              aria-haspopup={item.kind === "submenu" ? "menu" : undefined}
              aria-expanded={item.kind === "submenu" ? "false" : undefined}
              aria-controls={item.kind === "submenu" ? `${itemId}-menu` : undefined}
            >
              {content}
            </Button>
          )}
          {item.kind === "submenu" && (
            <menu
              id={`${itemId}-menu`}
              class="rx-menu"
              role="menu"
              popover="manual"
              data-menu-panel="submenu"
              aria-labelledby={`${itemId}-item`}
              tabindex={-1}
              hidden
            >
              <MenuItems items={item.items} id={`${itemId}-menu`} />
            </menu>
          )}
        </li>
      );
    })}
  </>
);

/** 選択結果はdropdown-menu:select。チェック項目はcheckedも通知する。 */
export const DropdownMenu = ({
  id,
  label,
  items,
  action,
  align = "start",
  dir,
  icon,
  iconOnly = false,
  variant,
  size,
  disabled,
  busy,
}: DropdownMenuProps) => (
  <div
    class="rx-dropdown-menu"
    data-controller="dropdown-menu"
    data-state="closed"
    data-action={action}
    data-align={align}
    dir={dir}
  >
    <Button
      id={`${id}-trigger`}
      data-dropdown-menu-target="trigger"
      aria-controls={id}
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label={iconOnly ? label : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      variant={variant}
      size={size}
      disabled={disabled}
      busy={busy}
    >
      {icon && <Icon name={icon} />}
      {!iconOnly && label}
      {(!iconOnly || !icon) && <Icon name="caret" />}
    </Button>
    <div class="shield" data-dropdown-menu-target="shield" popover="manual" tabindex={-1} hidden />
    <menu
      id={id}
      class="rx-menu"
      data-dropdown-menu-target="menu"
      data-menu-panel="root"
      role="menu"
      popover="manual"
      aria-labelledby={`${id}-trigger`}
      tabindex={-1}
      hidden
    >
      <MenuItems items={items} id={id} />
    </menu>
  </div>
);
