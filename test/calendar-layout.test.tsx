import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Calendar, type CalendarDay } from "../src/hono";
import { columnOf, isoWeek, rowWeekNumber, weekdayLabels } from "../src/internal/calendar-date";
import { eventRange, isAllDay, layoutDay, minutesOf } from "../src/internal/calendar-layout";

const render = async (node: unknown) => String(await html`${node}`);

test("時刻を分へ変換し、形式違いと範囲外を終日として扱う", () => {
  expect(minutesOf("9:05")).toBe(545);
  expect(minutesOf("24:00")).toBe(1440);
  expect(minutesOf("25:00")).toBeNull();
  expect(minutesOf("9:60")).toBeNull();
  expect(isAllDay({ start: "朝" })).toBe(true);
  expect(eventRange({ start: "14:00" })).toEqual({ start: 840, end: 900 });
  expect(eventRange({ start: "14:00", end: "13:00" })).toEqual({ start: 840, end: 900 });
  expect(eventRange({ start: "23:50" })).toEqual({ start: 1410, end: 1440 });
});

test("重なる予定だけを横に並べ、重なりのまとまりごとに列数をそろえる", () => {
  const placed = layoutDay([
    { label: "c", start: "14:00", end: "16:00" },
    { label: "a", start: "13:00", end: "15:00" },
    { label: "b", start: "13:30", end: "14:00" },
    { label: "d", start: "17:00", end: "18:00" },
    { label: "終日" },
  ]);
  expect(placed.map(({ event, lane, lanes }) => [event.label, lane, lanes])).toEqual([
    ["a", 0, 2],
    ["b", 1, 2],
    ["c", 1, 2],
    ["d", 0, 1],
  ]);
});

test("短い予定も表示上の長さで重なりを判定する", () => {
  const placed = layoutDay([
    { label: "朝会", start: "9:00", end: "9:05" },
    { label: "次", start: "9:10", end: "10:00" },
  ]);
  expect(placed.map(({ lane, lanes }) => [lane, lanes])).toEqual([
    [0, 2],
    [1, 2],
  ]);
});

test("週は時間割として描画し、終日と時刻のある予定・現在時刻を分けて伝える", async () => {
  const week: CalendarDay[] = Array.from({ length: 7 }, (_, index) => ({
    day: 21 + index,
    date: `2026-09-${21 + index}`,
    label: `9月${21 + index}日`,
    current: index === 3,
    events:
      index === 3
        ? [
            { label: "研修", href: "/a" },
            { label: "<会議>", href: "/b", start: "10:00", end: "11:30" },
          ]
        : [],
  }));
  const markup = await render(<Calendar label="週" view="week" weeks={[week]} now="10:15" />);
  expect(markup).toContain('aria-label="週の時間割"');
  expect(markup).toContain(
    "--rx-calendar-days: 7; --rx-calendar-core-start: 8; --rx-calendar-core-end: 20",
  );
  expect(markup).toContain('data-controller="calendar-scroll"');
  expect(markup).toContain("--rx-calendar-target: 555");
  expect(markup.match(/--rx-calendar-hour-index:/g)).toHaveLength(24);
  expect(markup).toContain('aria-label="終日の予定"');
  expect(markup).toContain('data-all-day="true"');
  expect(markup).toContain("--rx-calendar-start: 600; --rx-calendar-end: 690");
  expect(markup).toContain("&lt;会議&gt;");
  expect(markup).toContain(
    '<time datetime="10:00">10:00</time>–<time datetime="11:30">11:30</time>',
  );
  expect(markup).toContain('aria-label="現在時刻 10:15"');
  expect(markup).not.toContain("<table");
});

test("週の開始曜日に合わせて曜日の並びと列を決める", () => {
  expect(weekdayLabels("monday")).toEqual(["月", "火", "水", "木", "金", "土", "日"]);
  expect(weekdayLabels("sunday")).toEqual(["日", "月", "火", "水", "木", "金", "土"]);
  expect(columnOf("2026-09-20", "monday")).toBe(6);
  expect(columnOf("2026-09-20", "sunday")).toBe(0);
});

test("週番号は行の木曜日で決め、年をまたぐ週も正しく数える", () => {
  expect(isoWeek("2026-09-24")).toBe(39);
  expect(rowWeekNumber(["2026-09-21", "2026-09-27"], "monday")).toBe(39);
  expect(rowWeekNumber(["2026-09-20", "2026-09-26"], "sunday")).toBe(39);
  expect(isoWeek("2027-01-01")).toBe(53);
  expect(isoWeek("2026-12-31")).toBe(53);
  expect(isoWeek("2025-12-29")).toBe(1);
});

test("日数に合わせて列を作り、週番号と日曜始まりの曜日を描画する", async () => {
  const day = (date: string, current = false): CalendarDay => ({
    day: Number(date.slice(8)),
    date,
    current,
  });
  const one = await render(
    <Calendar label="日" view="week" weeks={[[day("2026-09-24", true)]]} weekNumbers />,
  );
  expect(one).toContain("--rx-calendar-days: 1;");
  expect(one).toContain("第39週");
  const month = await render(
    <Calendar
      label="月"
      weekStart="sunday"
      weekNumbers
      weeks={[
        [
          "2026-09-20",
          "2026-09-21",
          "2026-09-22",
          "2026-09-23",
          "2026-09-24",
          "2026-09-25",
          "2026-09-26",
        ].map((date) => day(date)),
      ]}
    />,
  );
  expect(month).toMatch(/<th scope="col">日<\/th><th scope="col">月<\/th>/);
  expect(month).toContain('<th scope="row" class="week-number">39</th>');
});

test("一覧は日付に月を添えず、月が変わる所だけに区切りを置く", async () => {
  const day = (date: string): CalendarDay => ({
    day: Number(date.slice(8)),
    date,
    events: [{ label: "予定", href: "/a", start: "10:00" }],
  });
  const markup = await render(
    <Calendar
      label="一覧"
      view="agenda"
      weeks={[[day("2026-09-29"), day("2026-09-30"), day("2026-10-01")]]}
    />,
  );
  expect(markup.match(/class="agenda-month"/g)).toHaveLength(1);
  expect(markup).toContain('<p class="agenda-month" aria-hidden="true">10月</p>');
  expect(markup.indexOf("agenda-month")).toBeGreaterThan(markup.indexOf('datetime="2026-09-30"'));
});
