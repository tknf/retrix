import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type Accent, type ElementProps } from "./types";
export const TagGroup = ({
  children,
  label,
  class: className,
  ...attributes
}: PropsWithChildren<
  ElementProps<"div"> & {
    /** まとまりの名前。role="group"のaria-labelにする。 */
    label: string;
  }
>) => (
  <div {...attributes} class={classes("rx-tag-group", className)} role="group" aria-label={label}>
    {children}
  </div>
);
export type TagProps = ElementProps<"span"> & {
  /** タグの文言。長い文言は省略せずに折り返す。 */
  label: string;
  /** 塗りの色。分類を見分けるために使い、その色の塗りに白い文字にする。渡さなければ淡い灰色の枠と灰色の文字のタグにする。 */
  accent?: Accent;
} & (
    | {
        /** 渡すとタグを分類へ移るリンクにする。removeButtonとは同時に使えない。 */
        href?: string;
        removeButton?: never;
      }
    | {
        href?: never;
        /**
         * タグの末尾に置く解除操作。空のButton（variant="link"・size="tag"・class="remove"・
         * data-icon-only="true"）に「〇〇を解除」のaria-labelを付けて渡すと、×のアイコンを描く。
         * 解除した後の処理は利用側が持つ。
         */
        removeButton: Child;
      }
  );
/** HTML属性はルート（リンクの時はa、それ以外はspan）に渡す。 */
export const Tag = ({
  label,
  href,
  accent,
  removeButton,
  class: className,
  ...attributes
}: TagProps) =>
  href ? (
    <a {...attributes} class={classes("rx-tag", className)} data-accent={accent} href={href}>
      {label}
    </a>
  ) : removeButton ? (
    <span {...attributes} class={classes("rx-tag removable", className)} data-accent={accent}>
      <span class="label">{label}</span>
      {removeButton}
    </span>
  ) : (
    <span {...attributes} class={classes("rx-tag", className)} data-accent={accent}>
      {label}
    </span>
  );
