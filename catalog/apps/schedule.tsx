import {
  Button,
  Calendar,
  DateTimeRange,
  Dialog,
  Field,
  Icon,
  Input,
  PageHeader,
} from "../../src/hono";
import { makeCalendarWeeks, scheduleUrl } from "../calendar-data";
import { AppFrame } from "./frame";

const monthOffset = (year: number, month: number, offset: number) => {
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
};

const integerIn = (raw: string | undefined, fallback: number, min: number, max: number) => {
  const value = Number(raw);
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
};

export const ScheduleScreen = ({
  year: rawYear,
  month: rawMonth,
  view: rawView,
  week: rawWeek,
}: {
  year?: string;
  month?: string;
  view?: string;
  week?: string;
}) => {
  const year = integerIn(rawYear, 2026, 1900, 2100);
  const month = integerIn(rawMonth, 9, 1, 12);
  const view = rawView === "week" || rawView === "year" || rawView === "agenda" ? rawView : "month";
  const weeks = makeCalendarWeeks(year, month);
  const week = integerIn(rawWeek, 3, 0, weeks.length - 1);
  const previousMonth = monthOffset(year, month, -1);
  const nextMonth = monthOffset(year, month, 1);
  const offsetWeek = (offset: number) => {
    const start = weeks[week]?.[0];
    if (!start) return { year, month, week };
    const date = new Date(`${start.date}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset * 7);
    const target = date.toISOString().slice(0, 10);
    const targetYear = date.getUTCFullYear();
    const targetMonth = date.getUTCMonth() + 1;
    const targetWeek = makeCalendarWeeks(targetYear, targetMonth).findIndex(
      (candidate) => candidate[0]?.date === target,
    );
    return { year: targetYear, month: targetMonth, week: Math.max(0, targetWeek) };
  };
  const previousWeek = offsetWeek(-1);
  const nextWeek = offsetWeek(1);
  const previous =
    view === "week"
      ? previousWeek
      : view === "year"
        ? { year: year - 1, month, week }
        : { ...previousMonth, week: 0 };
  const next =
    view === "week"
      ? nextWeek
      : view === "year"
        ? { year: year + 1, month, week }
        : { ...nextMonth, week: 0 };
  const shownWeeks = view === "week" ? weeks.slice(week, week + 1) : weeks;
  const weekStart = shownWeeks[0]?.[0]?.date;
  const weekEnd = shownWeeks[0]?.[6]?.date;
  const formatWeekDate = (date: string, includeYear: boolean) => {
    const value = new Date(`${date}T00:00:00Z`);
    return `${includeYear ? `${value.getUTCFullYear()}年` : ""}${value.getUTCMonth() + 1}月${value.getUTCDate()}日`;
  };
  const label =
    view === "year"
      ? `${year}年`
      : view === "week"
        ? weekStart && weekEnd
          ? `${formatWeekDate(weekStart, true)}〜${formatWeekDate(weekEnd, weekStart.slice(0, 4) !== weekEnd.slice(0, 4))}`
          : `${year}年${month}月`
        : `${year}年${month}月`;
  const calendarProps = {
    label,
    previous: {
      label: view === "week" ? "前週" : view === "year" ? "前年" : "前月",
      href: scheduleUrl(previous.year, previous.month, view, previous.week),
    },
    today: {
      label: "今日",
      href: scheduleUrl(2026, 9, view, view === "week" ? 3 : 0),
    },
    next: {
      label: view === "week" ? "翌週" : view === "year" ? "翌年" : "翌月",
      href: scheduleUrl(next.year, next.month, view, next.week),
    },
    views: [
      { label: "月", href: scheduleUrl(year, month, "month", week), current: view === "month" },
      { label: "週", href: scheduleUrl(year, month, "week", week), current: view === "week" },
      { label: "年", href: scheduleUrl(year, month, "year", week), current: view === "year" },
      { label: "一覧", href: scheduleUrl(year, month, "agenda", week), current: view === "agenda" },
    ],
    actions: (
      <Dialog
        id="schedule-add"
        title="予定を追加"
        trigger="＋ 予定を追加"
        triggerVariant="primary"
        initialFocus="content"
        closeLabel="やめる"
        actions={
          <Button type="submit" form="schedule-add-form" variant="primary">
            追加する
          </Button>
        }
      >
        <form id="schedule-add-form" class="rx-stack" method="dialog">
          <Field id="schedule-add-title" label="予定の名前">
            {(attributes) => (
              <Input
                {...attributes}
                name="title"
                required
                autofocus
                placeholder="例：公開前の読み合わせ"
              />
            )}
          </Field>
          <DateTimeRange
            legend="日時"
            name="schedule-add"
            start={{ date: "2026-09-18", time: "14:00" }}
            end={{ date: "2026-09-18", time: "15:00" }}
            timezone="東京（UTC+9）"
          />
          <Field id="schedule-add-place" label="場所" help="会議室か、オンラインのURLを書きます。">
            {(attributes) => <Input {...attributes} name="place" placeholder="例：3階 会議室A" />}
          </Field>
        </form>
      </Dialog>
    ),
  };
  const months = Array.from({ length: 12 }, (_, index) => ({
    label: `${index + 1}月`,
    href: scheduleUrl(year, index + 1, "month", 0),
    weeks: makeCalendarWeeks(year, index + 1),
  }));
  return (
    <AppFrame current="schedule" size={view === "year" ? "wide" : "default"}>
      <PageHeader
        title="予定"
        icon={<Icon name="calendar" />}
        description="打ち合わせと締め切り。9月30日の公開に向けた予定です。"
      />
      {view === "year" ? (
        <Calendar {...calendarProps} view="year" months={months} />
      ) : (
        <Calendar {...calendarProps} view={view} weeks={shownWeeks} now="10:30" />
      )}
    </AppFrame>
  );
};
