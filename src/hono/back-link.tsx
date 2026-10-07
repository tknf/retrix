import { Icon } from "./icon";
import { Keycap } from "./keycap";
import { classes, type ElementProps } from "./types";

export type BackLinkProps = Omit<ElementProps<"a">, "children"> & {
  /** 戻る先のURL。 */
  href: string;
  /** 戻る先の名前（「受信トレイ」「設定」など）。 */
  label: string;
  /** 表示用のショートカットキー（「Esc」など）。登録は利用側で行う。 */
  shortcut?: string;
  /** filledは淡い青のピル（既定）、plainは面を持たない太字の文字。 */
  tone?: "filled" | "plain";
};

/** 一つ上の場所へ戻るだけのピル。パンくずより軽く、画面の先頭側の角に置く。 */
export const BackLink = ({
  href,
  label,
  shortcut,
  tone = "filled",
  class: className,
  ...attributes
}: BackLinkProps) => (
  <a {...attributes} class={classes("rx-back-link", className)} href={href} data-tone={tone}>
    <Icon name="back" />
    <span class="label">{label}</span>
    {shortcut && <Keycap keys={[shortcut]} aria-hidden="true" />}
  </a>
);
