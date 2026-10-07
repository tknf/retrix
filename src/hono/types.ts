import type { JSX } from "hono/jsx";

/** Honoの標準HTML属性を保持する。イベントの実行は利用側のcontrollerが担う。 */
export type ElementProps<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag];
export type Accent = "blue" | "green" | "amber" | "coral";
export type Tone = "neutral" | "info" | "success" | "warning" | "danger";
/**
 * 操作の見た目の役割。primaryは青の塗り、secondaryは白い面と枠、dangerは赤の塗り、
 * linkは面も枠も持たない青い文字。形はどれもピルで、違いは塗りの色で出す。
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "link";

/** 利用側の配置クラスは残し、コンポーネントのルートクラスを必ず付ける。 */
export const classes = (
  base: string,
  extra?: string | Promise<string>,
): string | Promise<string> => {
  if (extra instanceof Promise) return extra.then((value) => (value ? `${base} ${value}` : base));
  return extra ? `${base} ${extra}` : base;
};
