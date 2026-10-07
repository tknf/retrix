import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type DangerZoneProps = PropsWithChildren<
  ElementProps<"section"> & {
    /** 操作の名前。`h2`で置く。 */
    title?: string;
    /** 操作の影響。何が消え、元に戻せるかを書く。 */
    description?: string;
    /** 説明の下に並べる操作。ButtonやActionLink、確認を挟む時はDialogを渡す。幅が足りなければ折り返す。 */
    actions?: Child;
  }
>;

/** 影響の説明と操作をまとめる。確認や実行には利用側のButton・Dialogを渡す。 */
export const DangerZone = ({
  children,
  title = "影響のある操作",
  description,
  actions,
  class: className,
  ...attributes
}: DangerZoneProps) => (
  <section {...attributes} class={classes("rx-danger-zone", className)}>
    <header class="heading">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
    <div class="body">{children}</div>
    <div class="actions">{actions}</div>
  </section>
);
