import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps, type Tone } from "./types";

export type SectionProps = PropsWithChildren<
  ElementProps<"section"> & {
    /** 見出しの文言。h2で出す。 */
    title: string;
    /** 見出しの横に出す件数。0も表示し、省略すると出さない。 */
    count?: number;
    /** 見出しの前の丸いマークの色。色だけでは意味が伝わらないので、状態は見出しの文言でも示す。 */
    tone?: Tone;
    /** 見出しの行の末尾側に置く操作（ActionLinkやButtonなど）。 */
    actions?: Child;
  }
>;
export const Section = ({
  title,
  count,
  tone = "neutral",
  actions,
  children,
  class: className,
  ...attributes
}: SectionProps) => (
  <section {...attributes} class={classes("rx-section", className)} data-tone={tone}>
    <header class="heading">
      <h2>{title}</h2>
      {count !== undefined && <span class="count">{count}</span>}
      {actions != null && actions !== false && <div class="actions">{actions}</div>}
    </header>
    {children}
  </section>
);
