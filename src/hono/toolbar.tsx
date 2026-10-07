import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type ToolbarProps = PropsWithChildren<
  Omit<ElementProps<"div">, "role" | "aria-label"> & {
    /** 操作のまとまりの名前。`role="toolbar"`の`aria-label`として読み上げる。 */
    label: string;
  }
>;

/** 関連する操作を一つのTab停止点にまとめる。操作にはdata-toolbar-target="control"を付ける。 */
export const Toolbar = ({ label, children, class: className, ...attributes }: ToolbarProps) => (
  <div
    {...attributes}
    class={classes("rx-toolbar", className)}
    role="toolbar"
    aria-label={label}
    data-controller={classes("toolbar", attributes["data-controller"])}
  >
    {children}
  </div>
);
