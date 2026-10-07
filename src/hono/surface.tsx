import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type SurfaceProps = PropsWithChildren<
  ElementProps<"div"> & {
    /** 上端のパンくずや補助操作（ContextBar）。 */
    context?: Child;
    /** documentは本文を読みやすい行長に収める。 */
    layout?: "standard" | "document";
  }
>;

/**
 * 作業面（sheet）。AppShellを使わない画面で、仕事の中身を一つの白い領域にまとめる。
 * 見た目の定義はAppShellの作業面と共通。一件ごとのカードはCard、役割の色の背景はNoticeを使う。
 */
export const Surface = ({
  children,
  context,
  layout = "standard",
  class: className,
  ...attributes
}: SurfaceProps) => (
  <div {...attributes} class={classes("rx-surface", className)} data-layout={layout}>
    {context}
    <div class="body">{children}</div>
  </div>
);
