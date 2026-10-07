import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export type { BreadcrumbItem } from "./breadcrumb";
export type ContextBarProps = PropsWithChildren<
  ElementProps<"div"> & {
    /** 現在地までの階層。Breadcrumbのitemsと同じで、最後の項目が現在地になる。 */
    items: readonly BreadcrumbItem[];
    /** 現在地を示すnavの読み上げ名。 */
    label?: string;
  }
>;
export const ContextBar = ({
  items,
  children,
  class: className,
  label = "現在の位置と関連する操作",
  ...attributes
}: ContextBarProps) => (
  <div {...attributes} class={classes("rx-context-bar", className)}>
    <Breadcrumb items={items} label={label} />
    {children && <div class="actions">{children}</div>}
  </div>
);
