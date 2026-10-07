import { Avatar, AvatarGroup, ValueList, type CalendarDay, type CalendarEvent } from "../src/hono";
import { members } from "./apps/data";

export const scheduleUrl = (
  year: number,
  month: number,
  view: "month" | "week" | "year" | "agenda",
  week: number,
) => `/apps/schedule?year=${year}&month=${month}&view=${view}&week=${week}`;

const baseEvents = (date: string): readonly CalendarEvent[] => {
  if (date === "2026-09-15")
    return [
      {
        start: "10:00",
        end: "11:00",
        label: "編集会議",
        href: "/apps/project",
        accent: "blue",
      },
      {
        start: "10:30",
        end: "12:00",
        label: "取材の準備",
        href: "/apps/project",
        accent: "green",
      },
      { start: "14:00", label: "利用案内を確認", href: "/apps/schedule" },
    ];
  if (date === "2026-09-16") return [{ label: "社内研修", href: "/apps/project", accent: "coral" }];
  if (date === "2026-09-24")
    return [
      {
        start: "13:00",
        end: "15:00",
        label: "デザインレビュー",
        href: "/apps/project",
        accent: "blue",
      },
      { start: "13:30", end: "14:00", label: "来客", href: "/apps/people", accent: "amber" },
    ];
  if (date === "2026-09-25")
    return [
      {
        start: "18:00",
        end: "21:00",
        label: "秋の読書会",
        href: "/apps/schedule",
        accent: "amber",
      },
    ];
  if (["2026-03-08", "2026-06-17", "2026-12-03"].includes(date))
    return [{ label: "制作の予定", href: "/apps/project" }];
  return [];
};

/** 予定ごとの場所・参加者・メモ。予定のボタンを押すと開く詳細パネルに表示する。 */
const notes: Record<string, { place: string; people: readonly number[]; memo?: string }> = {
  編集会議: { place: "3階 会議室A", people: [0, 1, 2], memo: "公開前の記事の進み具合を確かめる。" },
  取材の準備: { place: "オンライン", people: [2], memo: "質問の一覧を先に共有する。" },
  利用案内を確認: { place: "自席", people: [0] },
  社内研修: { place: "1階 ホール", people: [0, 1, 2] },
  デザインレビュー: {
    place: "3階 会議室B",
    people: [0, 1],
    memo: "スマートフォンの画面を中心に見る。",
  },
  来客: { place: "受付", people: [2] },
  秋の読書会: { place: "ラウンジ", people: [0, 1, 2], memo: "参加は自由。飲み物を用意する。" },
};

const details = (event: CalendarEvent, id: string): CalendarEvent["details"] => {
  const note = notes[event.label];
  if (!note) return undefined;
  const people = note.people.map((index) => members[index]);
  return {
    id,
    content: (
      <ValueList
        items={[
          { label: "場所", value: note.place },
          {
            label: "参加する人",
            value: (
              <AvatarGroup label={people.map((person) => person.name).join("、")} size="small">
                {people.map((person) => (
                  <Avatar
                    name={person.name}
                    initials={person.initials}
                    tone={person.tone}
                    size="small"
                  />
                ))}
              </AvatarGroup>
            ),
          },
          ...(note.memo ? [{ label: "メモ", value: note.memo }] : []),
        ]}
      />
    ),
  };
};

const sampleEvents = (date: string): readonly CalendarEvent[] =>
  baseEvents(date).map((event, index) => ({
    ...event,
    details: details(event, `event-${date}-${index}`),
  }));

export const makeCalendarWeeks = (year: number, month: number): CalendarDay[][] => {
  const first = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((first + count) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = new Date(Date.UTC(year, month - 1, week * 7 + weekday - first + 1));
      const iso = date.toISOString().slice(0, 10);
      const outside = date.getUTCMonth() + 1 !== month;
      return {
        day: date.getUTCDate(),
        date: iso,
        href: scheduleUrl(year, month, "week", week),
        label: new Intl.DateTimeFormat("ja-JP", {
          month: "long",
          day: "numeric",
          weekday: "long",
          timeZone: "UTC",
        }).format(date),
        outside,
        current: iso === "2026-09-24",
        events: outside ? [] : sampleEvents(iso),
      };
    }),
  );
};
