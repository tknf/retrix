/** 単日と同日の期間も、呼び出し側が指定した種別のまま扱う。 */
export type DatePickerSelection =
  | {
      /** 単日。 */
      kind: "single";
      /** 日付（YYYY-MM-DD）。未入力は空文字。 */
      start: string;
    }
  | {
      /** 期間。開始日と終了日が同じ日でも期間として扱う。 */
      kind: "range";
      /** 開始日（YYYY-MM-DD）。未入力は空文字。 */
      start: string;
      /** 終了日（YYYY-MM-DD）。未入力は空文字。 */
      end: string;
    };

export const isoDate = (date: Date) =>
  `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
export const parseDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year = 0, month = 0, day = 0] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return year >= 1 && isoDate(date) === value ? date : null;
};
export const formatSelection = (selection: DatePickerSelection) => {
  const start = selection.start.replaceAll("-", "/");
  if (selection.kind === "single") return start;
  if (!start && !selection.end) return "";
  return `${start} – ${selection.end.replaceAll("-", "/")}`;
};

/** idはDatePickerのルート、または通常の日付inputを参照する。 */
export type DatePickerBoundReference = {
  /** 参照するDatePickerのルートID、またはYYYY-MM-DDを値に持つinputのID。 */
  id: string;
  /** 参照先が期間の時に、開始日と終了日のどちらを使うか。通常のinputでは使わない。 */
  bound?: "start" | "end";
  /** 参照先の日に足す日数。1で翌日から、-1で前日まで、のように差を付ける。 */
  offsetDays?: number;
};
export type DatePickerBounds = { min: string; max: string; empty: boolean };

/** 固定境界と参照日を重ね、空の参照は固定境界へ戻す。 */
export const resolveDateBounds = ({
  min = "",
  max = "",
  minReference = "",
  maxReference = "",
  minOffset = 0,
  maxOffset = 0,
}: {
  min?: string;
  max?: string;
  minReference?: string;
  maxReference?: string;
  minOffset?: number;
  maxOffset?: number;
}): DatePickerBounds => {
  let empty = false;
  const offset = (value: string, days: number) => {
    const date = parseDate(value);
    if (!date) return "";
    if (!Number.isSafeInteger(days)) {
      empty = true;
      return "";
    }
    date.setUTCDate(date.getUTCDate() + days);
    if (
      !Number.isFinite(date.getTime()) ||
      date.getUTCFullYear() < 1 ||
      date.getUTCFullYear() > 9999
    ) {
      empty = true;
      return "";
    }
    return isoDate(date);
  };
  const minimums = [parseDate(min) ? min : "", offset(minReference, minOffset)]
    .filter(Boolean)
    .sort();
  const maximums = [parseDate(max) ? max : "", offset(maxReference, maxOffset)]
    .filter(Boolean)
    .sort();
  const lower = minimums.at(-1) ?? "";
  const upper = maximums[0] ?? "";
  return { min: lower, max: upper, empty: empty || Boolean(lower && upper && lower > upper) };
};

export const selectionWithEndDate = (
  selection: DatePickerSelection,
  enabled: boolean,
  fallback: string,
): DatePickerSelection => {
  const start = selection.start || fallback;
  return enabled
    ? { kind: "range", start, end: selection.kind === "range" ? selection.end || start : start }
    : { kind: "single", start: selection.start };
};

/** 期間内の端点を編集する。独立した別のDatePickerの値は変更しない。 */
export const selectCalendarDate = (
  selection: DatePickerSelection,
  value: string,
  { bound = "start", extend = false }: { bound?: "start" | "end"; extend?: boolean } = {},
): DatePickerSelection => {
  if (extend && selection.start)
    return {
      kind: "range",
      start: value < selection.start ? value : selection.start,
      end: value > selection.start ? value : selection.start,
    };
  if (selection.kind === "single") return { kind: "single", start: value };
  if (bound === "end")
    return {
      kind: "range",
      start: selection.start && selection.start <= value ? selection.start : value,
      end: value,
    };
  return {
    kind: "range",
    start: value,
    end: selection.end && selection.end >= value ? selection.end : value,
  };
};

/** カレンダー内ではゼロ埋めされていない日付入力も受け付ける。 */
export const parseDateInput = (value: string): string | null => {
  const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(value.trim());
  if (!match?.[1] || !match[2] || !match[3]) return null;
  const normalized = `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  return parseDate(normalized) ? normalized : null;
};
