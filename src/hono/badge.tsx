import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps, type Tone } from "./types";

export type BadgeProps = PropsWithChildren<
  ElementProps<"span"> & {
    /** 状態の役割。地と文字をその色にする。業務の状態（審査中・予約済みなど）は利用側でこの役割へ変換する。 */
    tone?: Tone;
    /** 下書きなど、まだ確定していない状態。役割の色を持たせず、中立の見た目で示す。 */
    draft?: boolean;
    /** smallはタイルのアイコンの上などに重ねる小さなバッジ。 */
    size?: "default" | "small";
  }
>;
/** 短い状態を文言と色の役割で示す。役割の無いspanなので、意味はaria-labelではなく文言か隣の文で伝える。 */
export const Badge = ({
  children,
  tone = "neutral",
  draft = false,
  size = "default",
  class: className,
  ...attributes
}: BadgeProps) => (
  <span
    {...attributes}
    class={classes("rx-badge", className)}
    data-tone={tone}
    data-draft={draft ? "true" : undefined}
    data-size={size === "default" ? undefined : size}
  >
    {children}
  </span>
);
