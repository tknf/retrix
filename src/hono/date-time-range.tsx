import { DateField } from "./date-field";
import { Icon } from "./icon";
import { Switch } from "./switch";
import { TimeField } from "./time-field";
import { classes, type ElementProps } from "./types";

type Point = {
  /** 日付（YYYY-MM-DD）。 */
  date?: string;
  /** 時刻（HH:MM）。 */
  time?: string;
};
export type DateTimeRangeProps = ElementProps<"fieldset"> & {
  /** 枠全体の名前。legendに出す。 */
  legend: string;
  /** 送信する名前の接頭辞。`${name}[start_date]`・`[start_time]`・`[end_date]`・`[end_time]`・`[all_day]`で送信する。 */
  name: string;
  /** 開始の初期の日付と時刻。 */
  start?: Point;
  /** 終了の初期の日付と時刻。 */
  end?: Point;
  /** 終日のSwitchをオンにしておく。オンの間は時刻の欄を隠す。 */
  allDay?: boolean;
  /** 渡すと、末尾側に地球のアイコンとタイムゾーンを添える。 */
  timezone?: string;
  /** 開始側の小さなラベル。日付と時刻の欄の読み上げ名（「開始の日付」など）の接頭辞にも使う。 */
  startLabel?: string;
  /** 終了側の小さなラベル。日付と時刻の欄の読み上げ名の接頭辞にも使う。 */
  endLabel?: string;
  /** 終日のSwitchの名前。 */
  allDayLabel?: string;
};

/**
 * 開始と終了を縦に積み、それぞれ名前の後ろに日付と時刻の欄を一行に並べる。
 * 終日にすると時刻の欄を隠す。日付と時刻の欄は共通のDateField・TimeField。
 */
export const DateTimeRange = ({
  legend,
  name,
  start = {},
  end = {},
  allDay = false,
  timezone,
  startLabel = "開始",
  endLabel = "終了",
  allDayLabel = "終日",
  id,
  class: className,
  ...attributes
}: DateTimeRangeProps) => {
  return (
    <fieldset {...attributes} id={id} class={classes("rx-date-time-range", className)}>
      <legend>{legend}</legend>
      <div class="range">
        <div class="point">
          <span class="caption">{startLabel}</span>
          <DateField
            name={`${name}[start_date]`}
            value={start.date}
            aria-label={`${startLabel}の日付`}
          />
          <span class="time">
            <TimeField
              name={`${name}[start_time]`}
              value={start.time}
              aria-label={`${startLabel}の時刻`}
            />
          </span>
        </div>
        <span class="arrow" aria-hidden="true">
          <Icon name="arrow" />
        </span>
        <div class="point">
          <span class="caption">{endLabel}</span>
          <DateField name={`${name}[end_date]`} value={end.date} aria-label={`${endLabel}の日付`} />
          <span class="time">
            <TimeField
              name={`${name}[end_time]`}
              value={end.time}
              aria-label={`${endLabel}の時刻`}
            />
          </span>
        </div>
      </div>
      <div class="options">
        <span class="all-day">
          <Switch label={allDayLabel} name={`${name}[all_day]`} value="1" checked={allDay} />
        </span>
        {timezone && (
          <span class="timezone">
            <Icon name="globe" />
            {timezone}
          </span>
        )}
      </div>
    </fieldset>
  );
};
