import { classes, type ElementProps } from "./types";

export type StatisticProps = ElementProps<"dl"> & {
  /** 何の値か（「今月の売上」など）。値の上に淡く小さく書く。 */
  label: string;
  /** 表示する値。桁区切りや符号は利用側で整えた文字列で渡す。 */
  value: string;
  /** 値の後に小さく添える単位（「円」「件」など）。 */
  unit?: string;
  /** 値の下に添える集計の条件（期間・税込かどうかなど）。 */
  note?: string;
};
export const Statistic = ({
  label,
  value,
  unit,
  note,
  class: className,
  ...attributes
}: StatisticProps) => (
  <dl {...attributes} class={classes("rx-statistic", className)}>
    <dt>{label}</dt>
    <dd class="value">
      {value}
      {unit && <small>{unit}</small>}
    </dd>
    {note && <dd class="note">{note}</dd>}
  </dl>
);
