export type WeekStart = "monday" | "sunday";

const DAY = 86_400_000;
/** getUTCDayの順（日曜が0）。 */
const labels = ["日", "月", "火", "水", "木", "金", "土"] as const;

const utc = (date: string) => new Date(`${date}T00:00:00Z`);
const offsetOf = (weekStart: WeekStart) => (weekStart === "sunday" ? 0 : 1);

export const weekdayLabel = (date: string) => labels[utc(date).getUTCDay()] ?? "";

export const isWeekend = (date: string) => [0, 6].includes(utc(date).getUTCDay());

/** 週の開始曜日から数えた列の位置（0〜6）。 */
export const columnOf = (date: string, weekStart: WeekStart) =>
  (utc(date).getUTCDay() - offsetOf(weekStart) + 7) % 7;

export const weekdayLabels = (weekStart: WeekStart) =>
  Array.from({ length: 7 }, (_, index) => labels[(index + offsetOf(weekStart)) % 7] ?? "");

/** ISO週番号。週はその木曜日が属する年で数える。 */
export const isoWeek = (date: string) => {
  const day = utc(date);
  const thursday = new Date(day.getTime() + (3 - ((day.getUTCDay() + 6) % 7)) * DAY);
  const firstDay = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return 1 + Math.floor((thursday.getTime() - firstDay) / DAY / 7);
};

/** 表示する一行の週番号。日曜始まりでも、その行の木曜日で決める。 */
export const rowWeekNumber = (dates: readonly string[], weekStart: WeekStart) => {
  const first = dates[0];
  if (!first) return null;
  const rowStart = utc(first).getTime() - columnOf(first, weekStart) * DAY;
  const thursday = new Date(rowStart + ((4 - offsetOf(weekStart) + 7) % 7) * DAY);
  return isoWeek(thursday.toISOString().slice(0, 10));
};
