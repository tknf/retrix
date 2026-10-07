import type { ElementProps } from "./types";
import { classes } from "./types";

export type KeycapProps = ElementProps<"span"> & {
  /** 同時に押すキーの表記。一つずつ`kbd`にして並べる。記号だけで読み上げにくい時は`label`を添える。 */
  keys: readonly string[];
  /**
   * 読み上げ用の名前（「CommandとS」など）。渡すと、キーの表記を読み上げから外し、見えない文としてこの名前を置く。
   * 外側の`span`は名前を持てない要素なので、`aria-label`を渡した時も同じ扱いにする。
   */
  label?: string;
  /** smallはタイルの角やメニューの行の末尾に添える小さな表示。 */
  size?: "default" | "small";
  /** 青のメニューや塗った背景の上に置く時。背景を塗らず、文字と同じ色の淡い縁にする。 */
  inverse?: boolean;
};
export const Keycap = ({
  keys,
  label,
  size = "default",
  inverse = false,
  class: className,
  "aria-label": ariaLabel,
  ...attributes
}: KeycapProps) => {
  const name = label ?? (typeof ariaLabel === "string" ? ariaLabel : undefined);
  return (
    <span
      {...attributes}
      class={classes("rx-keycap", className)}
      data-size={size === "default" ? undefined : size}
      data-inverse={inverse ? "true" : undefined}
    >
      {keys.map((key) => (
        <kbd aria-hidden={name ? "true" : undefined}>{key}</kbd>
      ))}
      {name && <span class="rx-visually-hidden">{name}</span>}
    </span>
  );
};
