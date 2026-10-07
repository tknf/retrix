import { classes, type ElementProps, type Tone } from "./types";

export type CountdownProps = ElementProps<"span"> & {
  /** 大きく表示する数。 */
  value: string | number;
  /** 数の上に小さく表示する言葉（「あと」「閉じるまで」など）。 */
  before?: string;
  /** 数の下に小さく表示する単位（「日」など）。 */
  after?: string;
  /** 読み上げの全文（「自動で閉じるまであと70日」など）。 */
  label: string;
  /** 輪の役割の色。期限が迫る時はdanger、ただの残数はinfoなど、意味に合わせて選ぶ。 */
  tone?: Tone;
};

/**
 * 期限や残りを大きな数で示す丸いバッジ。
 * 役割の色の細い輪で縁取り、カードと同じ影で浮かせる。カードの縁にまたがせる時は、置く側で位置を決める。
 */
export const Countdown = ({
  value,
  before,
  after,
  label,
  tone = "warning",
  class: className,
  ...attributes
}: CountdownProps) => (
  <span
    {...attributes}
    class={classes("rx-countdown", className)}
    data-tone={tone}
    role="img"
    aria-label={label}
  >
    {before && <span class="before">{before}</span>}
    <strong class="value">{value}</strong>
    {after && <span class="after">{after}</span>}
  </span>
);
