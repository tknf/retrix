import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";
import { Icon } from "./icon";

export type EmptyStateProps = PropsWithChildren<
  ElementProps<"section"> & {
    /** 枠内に太字で書く題名。何が無いのか、何が終わったのかを書く。 */
    title: string;
    /** 場面。emptyは0件（灰）、startは初めて使う時（青緑）、completeは作業を終えた時（緑）。 */
    kind?: "empty" | "start" | "complete";
    /** 枠の下に置く次の操作（ActionLinkやButton）。 */
    actions?: Child;
    /** 題名の上に置くアイコン。渡した時だけ置く。completeは渡さなくてもチェックのアイコンを置く。 */
    icon?: Child;
  }
>;
/** 検索0件・初回利用・作業完了を、実際の文脈と次の操作に合わせて使い分ける。 */
export const EmptyState = ({
  children,
  title,
  kind = "empty",
  actions,
  icon,
  class: className,
  ...attributes
}: EmptyStateProps) => {
  // 終わった時だけ、チェックを既定のアイコンにする。他の場面は渡された時だけアイコンを置く。
  const symbol =
    icon != null && icon !== false ? icon : kind === "complete" ? <Icon name="check" /> : null;
  return (
    <section {...attributes} class={classes("rx-empty-state", className)} data-kind={kind}>
      <div class="slip">
        {symbol && (
          <div class="symbol" aria-hidden="true">
            {symbol}
          </div>
        )}
        <h3 class="title">{title}</h3>
        <div class="body">{children}</div>
      </div>
      {actions != null && actions !== false && <div class="actions">{actions}</div>}
    </section>
  );
};
