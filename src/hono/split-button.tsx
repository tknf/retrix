import { Button, type ButtonProps } from "./button";
import { DropdownMenu, type MenuItem } from "./dropdown-menu";
import { classes } from "./types";

export type SplitButtonProps = Omit<ButtonProps, "children"> & {
  /** 主操作のボタンのid。▾のメニューは`<id>-menu`、▾の操作は`<id>-menu-trigger`になる。画面内で一意にする。 */
  id: string;
  /** 主操作の文言。 */
  label: string;
  /** ▾で開くほかのやり方（「送信の予約」「下書きとして保存」など）。 */
  items: readonly MenuItem[];
  /** ▾の操作の名前。記号だけの操作なので`aria-label`として読み上げる。 */
  menuLabel?: string;
};

/**
 * 「送信 ▾」のように、主操作と、ほかのやり方を選ぶ▾を一つのピルにつなげた操作。
 * 主操作は共通Button、▾は共通DropdownMenuで、見た目だけを一体にする。
 */
export const SplitButton = ({
  id,
  label,
  items,
  menuLabel = "ほかのやり方",
  variant = "primary",
  size,
  disabled,
  busy,
  class: className,
  ...attributes
}: SplitButtonProps) => (
  <div class={classes("rx-split-button", className)} data-variant={variant}>
    <Button
      {...attributes}
      id={id}
      class="main"
      variant={variant}
      size={size}
      disabled={disabled}
      busy={busy}
    >
      {label}
    </Button>
    <DropdownMenu
      id={`${id}-menu`}
      label={menuLabel}
      iconOnly
      items={items}
      variant={variant}
      size={size}
      disabled={disabled}
      busy={busy}
      align="end"
    />
  </div>
);
