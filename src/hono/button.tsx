import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps, type ButtonVariant } from "./types";

/** 関連する操作を隙間なくつなげ、一つのまとまりとして読ませる。 */
export const ButtonGroup = ({
  children,
  label,
  class: className,
  ...attributes
}: PropsWithChildren<
  ElementProps<"div"> & {
    /** まとまりの名前。`aria-label`として読み上げる。 */
    label: string;
  }
>) => (
  <div
    {...attributes}
    class={classes("rx-button-group", className)}
    role="group"
    aria-label={label}
  >
    {children}
  </div>
);

export type ButtonProps = PropsWithChildren<
  ElementProps<"button"> & {
    /**
     * 見た目の役割。primaryは画面の主操作、secondaryは通常の操作、
     * dangerは取り返しのつかない操作、linkは文字だけの軽い操作。
     */
    variant?: ButtonVariant;
    /**
     * 大きさ。compactは同じ高さで左右の余白を狭め、largeはフォーム末尾などの大きな操作に使う。
     * tagはTagの中の解除操作用で、タッチ環境でも小さなタグの高さを保つ。
     */
    size?: "default" | "compact" | "large" | "tag";
    /**
     * 処理中にする。押せなくし、aria-busyを付け、ポインターを待ちの形にする（控えめな操作は面を淡い灰色にする）。
     * 内容はbusyLabelに置き換える。アイコンだけの操作（data-icon-only="true"）は形を保つためアイコンのまま残す。
     */
    busy?: boolean;
    /** 処理中に内容の代わりに出す文言。アイコンも含めて置き換える。アイコンだけの操作では使わない。 */
    busyLabel?: string;
  }
>;

/** 操作のボタン。文字・太さ・行高・上下の余白・縦配置はbutton.cssが持つ。外から上書きしない。 */
export const Button = ({
  children,
  class: className,
  type = "button",
  variant = "secondary",
  size = "default",
  disabled = false,
  busy = false,
  busyLabel = "処理中…",
  ...attributes
}: ButtonProps) => (
  <button
    {...attributes}
    class={classes("rx-button", className)}
    type={type}
    data-variant={variant}
    data-size={size}
    data-busy={busy ? "true" : undefined}
    disabled={disabled || busy}
    aria-busy={busy ? "true" : attributes["aria-busy"]}
  >
    {busy && attributes["data-icon-only"] !== "true" ? busyLabel : children}
  </button>
);

export type ActionLinkProps = PropsWithChildren<
  ElementProps<"a"> & {
    /** 移動先。ページの移動にはButtonではなくこのリンクを使う。 */
    href: string;
    /** 見た目の役割。値の意味はButtonと同じ。 */
    variant?: ButtonVariant;
    /** 大きさ。値の意味はButtonと同じ。 */
    size?: "default" | "compact" | "large";
  }
>;

/** Buttonと同じ見た目の移動リンク。 */
export const ActionLink = ({
  children,
  class: className,
  variant = "secondary",
  size = "default",
  ...attributes
}: ActionLinkProps) => (
  <a
    {...attributes}
    class={classes("rx-button", className)}
    data-variant={variant}
    data-size={size}
  >
    {children}
  </a>
);
