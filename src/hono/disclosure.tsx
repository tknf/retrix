import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";
import { Icon } from "./icon";

/** 開閉する項目を狭い間隔で縦に並べ、一つのまとまりとして読ませる。 */
export const DisclosureGroup = ({
  children,
  label,
  class: className,
  ...attributes
}: PropsWithChildren<
  ElementProps<"div"> & {
    /** まとまりの名前。`role="group"`の`aria-label`として読み上げる。 */
    label: string;
  }
>) => (
  <div
    {...attributes}
    class={classes("rx-disclosure-group", className)}
    role="group"
    aria-label={label}
  >
    {children}
  </div>
);

/** 基本の開閉はdetails/summaryだけで動く。controller登録は不要。 */
export const Disclosure = ({
  children,
  summary,
  description,
  class: className,
  ...attributes
}: PropsWithChildren<
  ElementProps<"details"> & {
    /** 開閉の操作になる見出し。`summary`の中に置く。 */
    summary: string;
    /** 見出しの下に添える、閉じていても見える短い補足。 */
    description?: string;
  }
>) => (
  <details {...attributes} class={classes("rx-disclosure", className)}>
    <summary>
      <span class="marker" aria-hidden="true">
        <Icon name="caret" />
      </span>
      <span class="label">
        <span class="title">{summary}</span>
        {description && <span class="description">{description}</span>}
      </span>
    </summary>
    <div class="body">{children}</div>
  </details>
);
