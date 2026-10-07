import type { JSX } from "hono/jsx";

/** Honoの標準HTML属性を保持する。イベントの実行は利用側のcontrollerが担う。 */
export type ElementProps<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag];
export type Accent = "blue" | "green" | "amber" | "coral";
export type Tone = "neutral" | "info" | "success" | "warning" | "danger";
/**
 * 操作の見た目の役割。primaryは平らな緑の塗りに白い太字（角丸4px）、secondaryは平らな白い面と1pxの灰色の枠（角丸5px）、
 * dangerは平らな赤の塗りに白い文字（角丸4px）、linkは面も枠も持たない青緑の文字に下線。
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
