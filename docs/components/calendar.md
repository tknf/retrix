<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Calendar

月・週・年の表示を切り替えて、日付と予定を確認します。

## 使いどころ

- 予定を月・週・年・日付順の一覧で見渡し、期間を行き来する時に使います。
- フォームの欄で日付や期間を一つ選ぶ時は `DatePicker`、開始と終了の日時を並べて見せる時は `DateTimeRange` を使います。
- 出来事を時系列で読む記録は `Timeline` を使います。

## 使い方

`weeks` に一行一週の日付（`CalendarDay`）を渡します。月の計算・予定の取得・休日の判断は利用側で行い、Calendarは渡された日付と予定を描きます。`weekStart` で月曜・日曜始まりを選び、`weeks` の各行も同じ曜日から並べます。`weekNumbers` を渡すと、月の各行と週の見出しにISO週番号を出します。

`previous`・`today`・`next` は見出しの隣にリンクで、`views` は表示形式を切り替える `FilterBar` のセグメントで置きます。どれもリンクなので、期間や形式を変えた表示は利用側がリンク先で描き直します。`actions` は見出しの行の終わりに置く操作です。期間の見出しは `Section` の見出しと同じ15pxの赤の通常の太さの文字です。

月（`view="month"`）は表の各日に予定を一行ずつ並べます。外枠を持たずに日の間の暖かい灰色の細い線で区切り、日付は各日の末尾側の上に灰色の数字で書きます。今日はセル全体を黄色で塗り、日付を「今日 21」と濃い灰色の太字で書きます。月の初日には、日の先頭側の上に月の名前を赤の小さな太字で書きます。`outside` の日は面を塗らず、日付の数字を淡い灰色にします。画面の幅が40rem以下では、日付の下に予定の有無を示す青い点だけを置き、表の下に「この月の予定」の一覧を出します。

週（`view="week"`）は `weeks` の先頭の一行を、0〜24時の時間割で描きます。行の日数で列数が決まり、1日なら日、5日なら稼働日の表示です。時間割は `--rx-calendar-scroll-size`（既定は `min(40rem, 75dvh)`）の高さでスクロールし、見出しと終日の行を上に固定します。`hours` の外側はわずかに塗ります。今日の列は見出しを黄色で塗り、時間割にごく淡い黄色を敷きます。

`now` を渡すと、今日（`current` の日）の列に現在時刻を赤茶の破線で引いて時刻を同じ色の太字で書き、開いた時にその1時間前から表示します。今日を含まない週は、稼働時間の始まりの1時間前から表示します。開いた位置はCSSの `scroll-initial-target` で決まり、対応しないブラウザでは `CalendarScrollController` を `calendar-scroll` として登録すると同じ位置へスクロールします。

予定（`CalendarEvent`）は、`start` が無ければ終日、`end` が無いか開始以前なら開始から1時間です。Calendarが終日を先に、時刻のある予定を開始の早い順に並べ替え、時間の重なる予定は横に並べます。月の日と一覧の予定は、面を塗らずに `accent` の色（既定は青）の小さな点と題名を、淡い灰色の時刻と一緒に一行で書きます。ホバーすると題名に下線を引きます。終日の予定は `accent` の色で塗った高さ16pxのピルの形の帯に、白い太字で書きます。週の時間割の予定は、`accent` の淡い色の面に先頭側の縁を `accent` の色の線にし、題名を太字で先に、時刻を後に書きます。`tentative` の予定は塗らずに破線で囲みます。今日より前の日の予定と、今日のうち `now` までに終わった予定は文字と面を淡くします。

年（`view="year"`）は `months` の日付を月をまたいで一続きに並べ、月の始まりの日は先頭側の縁の線を濃くし、月の名前を赤の小さな太字で置きます。週末は淡い灰色、予定のある日は淡い青の面にして末尾側の下に青緑の点を付け、今日は黄色で塗ります。`CalendarMonth` の `href` を渡すと、月の名前が月表示へのリンクになります。

一覧（`view="agenda"`）は `weeks` のうち予定のある日だけを、日付ごとに月・週と同じ予定の行で並べ、日付を先頭側の列に置き、今日の日付は黄色のハイライトで塗ります。月が変わる所には赤の月の名前と罫線を置きます。表示する日付や予定が無い時は、どの形式でも `emptyLabel` を表示します。

予定に `details`（`id` と内容）を渡すと、予定は押すと詳細のパネルを開くボタンになります。パネルは `Popover` と同じで、題名・時刻・内容と、`href` があれば「詳しく見る」のリンクを置きます。`PopoverController` を `popover` として登録します。

`selection` を渡すと（月と週だけ）、日付がボタンになり、`CalendarController` を `calendar` として登録すると一日（`single`）か期間（`range`）を選べます。選んだ日（期間の両端）は青緑の塗りに白い数字、期間の間の日は淡い青緑の面にします。選んだ値は `calendar:change` で受け取り、送信や保存は利用側で行います。Calendarはフォームの入力欄を持たず、選択中は日の `href` を使いません。日付は重複させず、日付の順に並べます（そうでない時、controllerは動作しません）。

JavaScriptが無い時も、期間の移動と表示形式の切り替えはリンクとして動作し、時間割の初期表示位置はCSSで決めます。日付の選択には `CalendarController` が必要です。

## キーボード

| キー          | 動作                                                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab           | 選べる日付のうち、選んでいる日（無ければ最初の選べる日）にだけフォーカスが止まります。                                                                    |
| ← / →         | `selection` の時、前・後の選べる日へフォーカスを移します。選べない日は飛ばします。右から左に読む画面では向きが逆になります。                              |
| ↑ / ↓         | `selection` の時、7日前・後の同じ曜日へフォーカスを移します。並びの空き（`null`）をまたいでも日付で数えます。その日が表示の外か、選べない時は動きません。 |
| Enter / Space | フォーカスした日を選びます。                                                                                                                              |
| Escape        | 開いている予定の詳細のパネルを閉じます。                                                                                                                  |

## アクセシビリティ

- Calendar全体は `role="region"` で、`label` を名前と見出し（`h2`）にします。期間の移動は「表示期間」という名前の `nav` に置き、矢印だけのボタンは `label` を読み上げ名にします。
- 月は `caption` と曜日の列見出しを持つ表で、週番号は行の見出しです。表と時間割は `tabindex="0"` のスクロール領域に置きます。
- 今日には `aria-current="date"` を付けます。曜日と月のラベルは読み上げから外すので、日の `label` に「9月15日（火）」のように読む名前を渡します。
- 選べる日付は `aria-pressed` で選んでいるかを伝えます。
- 予定は日ごとに「（日の名前）の予定」という名前の一覧にします。年表示では、日付の読み上げに予定の件数と題名を含めます。現在時刻の線は「現在時刻 10:30」のように読みます。
- 詳細を持つ予定のボタンは `aria-haspopup="dialog"` でパネルを開くことを示し、パネルは `role="dialog"` で予定の題名を名前にし、開くと題名にフォーカスを移します。
- `accent` の色は区別の補助です。分類の意味は予定の題名などの文言で伝えます。

## イベント

| イベント                | 内容                                                                                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calendar:beforechange` | 取り消せます。日を選ぶ前に発火し、`preventDefault()` すると選択を変えません。`detail` は `calendar:change` と同じです。                                                                                                                   |
| `calendar:change`       | 日を選んだ時に発火します。`single` の `detail` は `{ value, previousValue, reason }`、`range` は `{ start, end, previousStart, previousEnd, reason }` です。日付は `YYYY-MM-DD`、未定は空文字、`reason` は `pointer` か `keyboard` です。 |

## API

### Calendar

| 名前                 | 型                                              | 既定値                         | 説明                                                                                                                                                |
| -------------------- | ----------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）      | `string`                                        |                                | 表示している期間の名前（「2026年9月」など）。上の見出しに書き、Calendar全体の読み上げ名にもする。                                                   |
| `hours`              | `{ start: number; end: number; }`               | `{ start: 8, end: 20 }`        | 時間割の稼働時間（時）。外側を淡く塗り、今日が含まれない時は開始時刻へスクロールする。                                                              |
| `now`                | `string`                                        |                                | currentの日に引く現在時刻（HH:MM）。時間割は開いた時にこの時刻を表示する。                                                                          |
| `weekStart`          | `WeekStart`                                     | `"monday"`                     | 週の開始曜日。weeksの各行もこの曜日から並べる。                                                                                                     |
| `weekNumbers`        | `boolean`                                       | `false`                        | 月の各行と週の見出しにISO週番号を表示する。                                                                                                         |
| `previous`           | `CalendarPeriodLink`                            |                                | 前の期間へのリンク。矢印だけのボタンにする。                                                                                                        |
| `next`               | `CalendarPeriodLink`                            |                                | 次の期間へのリンク。矢印だけのボタンにする。                                                                                                        |
| `today`              | `CalendarPeriodLink`                            |                                | 今日を含む期間へのリンク。前後の矢印の間に文字のボタンで置く。                                                                                      |
| `views`              | `readonly FilterBarItem[]`                      |                                | 表示形式（月・週・年・一覧など）の切り替え。FilterBarのセグメントで置く。今の形式の項目にはcurrentを渡す。                                          |
| `actions`            | `Child`                                         |                                | 見出しの行の終わりに置く操作（「予定を追加」など）。                                                                                                |
| `emptyLabel`         | `string`                                        | `"この期間に予定はありません"` | 表示する日付や予定が無い時に書く文。                                                                                                                |
| `view`（形による）   | `"month" \| "week" \| "year" \| "agenda"`       | `"month"`                      | weekは先頭の一行を時間割で表示する。1日なら日、5日なら稼働日の表示になる。                                                                          |
| `weeks`（形による）  | `readonly (readonly (CalendarDay \| null)[])[]` |                                | 表示する日付。一行が一週で、weekStartの曜日から並べる。月の前後の空きはnullか、outsideの日で埋める。 agendaでは予定のある日だけを日付の順に並べる。 |
| `selection`          | `CalendarSelection`                             |                                | 日付を押して選べるようにする。日付はボタンになり、CalendarControllerをcalendarとして登録する。選んだ値はcalendar:changeで受け取る。                 |
| `months`（形による） | `readonly CalendarMonth[]`                      |                                | 年表示の月。日付を月をまたいで一続きに並べ、月の始まりに月の名前を置く。                                                                            |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`calendar`（`CalendarController`）、`popover`（`PopoverController`）、`calendar-scroll`（`CalendarScrollController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/filter-bar.css`、`components/icon.css`、`components/calendar.css`

#### `hours`の項目

| 名前            | 型       | 既定値 | 説明                        |
| --------------- | -------- | ------ | --------------------------- |
| `start`（必須） | `number` |        | 稼働の始まりの時（0〜24）。 |
| `end`（必須）   | `number` |        | 稼働の終わりの時（0〜24）。 |

#### `WeekStart`

値：`"monday" | "sunday"`

#### `CalendarPeriodLink`

| 名前            | 型       | 既定値 | 説明                                                                                |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 操作の名前。今日への移動は文字で書き、前後への移動は矢印の読み上げ名とtitleにする。 |
| `href`（必須）  | `string` |        | 移動先のURL。期間を変えた表示は利用側がこのURLで返す。                              |

#### `FilterBarItem`

FilterBarの一件。Navigationの項目と同じ形で、currentは選んでいる条件を示す。

| 名前            | 型        | 既定値 | 説明                                                                |
| --------------- | --------- | ------ | ------------------------------------------------------------------- |
| `label`（必須） | `string`  |        | 項目の名前。                                                        |
| `href`（必須）  | `string`  |        | 移動先のURL。現在地の項目もリンクのまま出す。                       |
| `current`       | `boolean` |        | 今いる項目。aria-current="page"を付け、見た目でも現在地として示す。 |
| `count`         | `number`  |        | 名前の後に出す件数。0も表示し、省略すると出さない。                 |
| `icon`          | `Child`   |        | 名前の前のアイコン（Iconなど）。                                    |

#### `CalendarDay`

| 名前           | 型                         | 既定値 | 説明                                                                                                          |
| -------------- | -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `day`（必須）  | `number`                   |        | 表示する日の数字。                                                                                            |
| `date`（必須） | `string`                   |        | 日付（YYYY-MM-DD）。time要素のdatetime、選択の値、曜日と週番号の計算に使う。                                  |
| `label`        | `string`                   |        | 日付の読み上げ名（「9月15日（火）」など）。省略するとdateを読む。                                             |
| `href`         | `string`                   |        | 日のページ。selectionが無い時、日付の数字をこのリンクにする。                                                 |
| `current`      | `boolean`                  |        | 今日。黄色のハイライトで塗り、aria-current="date"を付ける。現在時刻の線と、過去の予定を淡くする基準にもなる。 |
| `disabled`     | `boolean`                  |        | 選べない日。リンクにせず、選択のボタンを無効にする。                                                          |
| `outside`      | `boolean`                  |        | 表示している月の外の日（前後の月の端）。淡く書き、一覧・年表示・狭い幅の月の下の予定一覧には出さない。        |
| `events`       | `readonly CalendarEvent[]` |        | その日の予定。並べ替えはCalendarが行う（終日を先に、時刻のある予定は開始の早い順）。                          |

#### `CalendarSelection`

mode: "single"

| 名前           | 型         | 既定値 | 説明                         |
| -------------- | ---------- | ------ | ---------------------------- |
| `mode`（必須） | `"single"` |        | 一日を選ぶ。                 |
| `value`        | `string`   |        | 選んでいる日（YYYY-MM-DD）。 |

mode: "range"

| 名前           | 型        | 既定値 | 説明                                                                                                                                                                 |
| -------------- | --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`（必須） | `"range"` |        | 開始と終了の二日で期間を選ぶ。開始の無い時に押した日が開始、開始以降の日を押すと終了になる。開始より前の日を押すか、終了まで決まった後に押すと、その日から選び直す。 |
| `start`        | `string`  |        | 期間の開始日（YYYY-MM-DD）。                                                                                                                                         |
| `end`          | `string`  |        | 期間の終了日（YYYY-MM-DD）。start以降の日にする。                                                                                                                    |

#### `CalendarMonth`

| 名前            | 型                                              | 既定値 | 説明                                                                                                 |
| --------------- | ----------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                                        |        | 月の名前（「9月」など）。年表示の月の始まりに置く。                                                  |
| `href`          | `string`                                        |        | 月表示へのリンク。渡すと月の名前をリンクにする。月の初日は、日付のリンクの代わりにこのリンクを置く。 |
| `weeks`（必須） | `readonly (readonly (CalendarDay \| null)[])[]` |        | その月の日付。Calendarのweeksと同じ形で、outsideの日は年表示に出さない。                             |

#### `CalendarEvent`

| 名前            | 型                                | 既定値 | 説明                                                                                                                                                                                             |
| --------------- | --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                          |        | 予定の題名。太字で書き、長い時は一行で省略する。                                                                                                                                                 |
| `href`          | `string`                          |        | 予定のページ。detailsを渡す時は省略でき、予定は詳細のパネルを開くボタンになる。                                                                                                                  |
| `details`       | `{ id: string; content: Child; }` |        | 予定を押すとPopoverと同じパネルで開く、予定の詳細（場所・参加者・メモなど）。idはパネルのidで、画面の中で一意にする。開閉と位置決めはPopoverと同じ（PopoverControllerをpopoverとして登録する）。 |
| `start`         | `string`                          |        | 開始時刻（HH:MM）。省略すると終日の予定。                                                                                                                                                        |
| `end`           | `string`                          |        | 終了時刻（HH:MM）。省略すると開始から1時間。                                                                                                                                                     |
| `accent`        | `Accent`                          |        | 分類の色。月の日と一覧では点と題名の色、終日は帯の塗り、時間割では淡い面と先頭側の線の色にする。省略すると青。                                                                                   |
| `tentative`     | `boolean`                         |        | 仮の予定。塗らずに破線の縁で囲み、まだ確定していないことを示す。                                                                                                                                 |

#### `CalendarEvent.details`の項目

| 名前              | 型       | 既定値 | 説明                                                                              |
| ----------------- | -------- | ------ | --------------------------------------------------------------------------------- |
| `id`（必須）      | `string` |        | 詳細のパネルのid。予定のボタンの`popovertarget`が指すので、画面の中で一意にする。 |
| `content`（必須） | `Child`  |        | パネルに書く中身（場所・参加者・メモなど）。                                      |

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

## コード

```tsx
import {
  ActionLink,
  Calendar,
  ValueList,
  type CalendarDay,
  type CalendarEvent,
} from "@tknf/retrix/hono";

const sampleEvents = (date: string): readonly CalendarEvent[] => {
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
  if (date === "2026-09-16")
    return [
      { label: "社内研修", href: "/apps/project", accent: "coral" },
      { start: "9:00", end: "9:15", label: "朝会", href: "/apps/project" },
    ];
  if (date === "2026-09-17")
    return [
      {
        start: "11:00",
        end: "12:30",
        label: "初めて利用する方に向けた予約方法と当日の受付の説明会",
        href: "/apps/schedule",
      },
    ];
  if (date === "2026-09-24")
    return [
      { start: "7:00", end: "7:30", label: "早朝の搬入", href: "/apps/project" },
      {
        start: "13:00",
        end: "15:00",
        label: "デザインレビュー",
        href: "/apps/project",
        accent: "blue",
      },
      {
        start: "13:30",
        end: "14:00",
        label: "来客",
        href: "/apps/people",
        accent: "amber",
      },
      {
        start: "14:00",
        end: "16:00",
        label: "資料作成",
        href: "/apps/project",
        accent: "green",
      },
    ];
  if (date === "2026-09-25")
    return [
      {
        start: "14:00",
        end: "15:00",
        label: "打ち合わせ（仮）",
        href: "/apps/people",
        tentative: true,
      },
      {
        start: "18:00",
        end: "21:00",
        label: "秋の読書会",
        href: "/apps/schedule",
        accent: "amber",
      },
    ];
  if (date === "2026-09-26") return [{ label: "休館日", href: "/apps/schedule" }];
  if (date === "2026-09-30")
    return [
      {
        start: "10:00",
        end: "11:00",
        label: "取材（仮）",
        href: "/apps/project",
        tentative: true,
      },
    ];
  if (date === "2026-10-02")
    return [
      { start: "15:00", end: "16:00", label: "10月の定例", href: "/apps/project" },
    ];
  if (["2026-03-08", "2026-06-17", "2026-12-03"].includes(date))
    return [{ label: "制作の予定", href: "/apps/project" }];
  return [];
};

type WeekStart = "monday" | "sunday";

const makeCalendarWeeks = (
  year: number,
  month: number,
  {
    withEvents = true,
    weekStart = "monday",
  }: { withEvents?: boolean; weekStart?: WeekStart } = {},
): CalendarDay[][] => {
  const offset = weekStart === "sunday" ? 0 : 1;
  const first = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() - offset + 7) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((first + count) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = new Date(Date.UTC(year, month - 1, week * 7 + weekday - first + 1));
      const iso = date.toISOString().slice(0, 10);
      const outside = date.getUTCMonth() + 1 !== month;
      return {
        day: date.getUTCDate(),
        date: iso,
        href: `/apps/schedule?year=${year}&month=${month}&view=week&week=${week}`,
        label: new Intl.DateTimeFormat("ja-JP", {
          month: "long",
          day: "numeric",
          weekday: "long",
          timeZone: "UTC",
        }).format(date),
        outside,
        current: iso === "2026-09-24",
        disabled: iso === "2026-09-23",
        events: outside || !withEvents ? [] : sampleEvents(iso),
      };
    }),
  );
};

const weeks = makeCalendarWeeks(2026, 9);
const sundayWeeks = makeCalendarWeeks(2026, 9, { weekStart: "sunday" });
const emptyWeeks = makeCalendarWeeks(2026, 9, { withEvents: false });
const thisWeek = weeks[3] ?? [];
const months = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  href: `/apps/schedule?year=2026&month=${index + 1}&view=month`,
  weeks: makeCalendarWeeks(2026, index + 1),
}));

export default () => (
  <div class="rx-stack">
    <h2>月の予定と週番号</h2>
    <Calendar
      label="2026年9月の予定"
      weeks={weeks}
      weekNumbers
      now="10:30"
      previous={{ label: "前月", href: "/apps/schedule?month=8" }}
      today={{ label: "今月", href: "/apps/schedule" }}
      next={{ label: "翌月", href: "/apps/schedule?month=10" }}
      views={[
        { label: "月", href: "/apps/schedule", current: true },
        { label: "週", href: "/apps/schedule?view=week" },
        { label: "年", href: "/apps/schedule?view=year" },
        { label: "一覧", href: "/apps/schedule?view=agenda" },
      ]}
      actions={<ActionLink href="/apps/schedule">予定を追加</ActionLink>}
    />
    <h2>日曜始まりの月</h2>
    <Calendar
      label="2026年9月（日曜始まり）"
      weeks={sundayWeeks}
      weekStart="sunday"
      weekNumbers
    />
    <h2>週の時間割</h2>
    <p>
      0〜24時をスクロールでき、開くと現在時刻を表示します。重なる予定・終日・早朝と夜の予定を含みます。
    </p>
    <Calendar
      label="9月21日〜27日"
      weeks={[thisWeek]}
      view="week"
      now="10:30"
      weekNumbers
    />
    <h2>日</h2>
    <Calendar label="9月24日" weeks={[thisWeek.slice(3, 4)]} view="week" now="10:30" />
    <h2>稼働日</h2>
    <Calendar
      label="9月21日〜25日"
      weeks={[thisWeek.slice(0, 5)]}
      view="week"
      now="10:30"
    />
    <h2>3日</h2>
    <Calendar
      label="9月24日〜26日"
      weeks={[thisWeek.slice(3, 6)]}
      view="week"
      now="10:30"
    />
    <h2>日曜始まりの週</h2>
    <Calendar
      label="9月20日〜26日"
      weeks={[sundayWeeks[3] ?? []]}
      view="week"
      weekStart="sunday"
      now="10:30"
      weekNumbers
    />
    <h2>短い予定と長い題名</h2>
    <Calendar label="9月14日〜20日" weeks={weeks.slice(2, 3)} view="week" now="10:30" />
    <h2>稼働時間を指定した週</h2>
    <p>9〜18時の外を淡く塗り、今日を含まない週は稼働時間の始まりを表示します。</p>
    <Calendar
      label="9月14日〜20日の営業時間"
      weeks={weeks.slice(2, 3)}
      view="week"
      hours={{ start: 9, end: 18 }}
    />
    <h2>予定のない週</h2>
    <Calendar label="9月7日〜13日" weeks={emptyWeeks.slice(1, 2)} view="week" />
    <h2>週の選択</h2>
    <Calendar
      label="9月14日〜20日から選ぶ"
      weeks={weeks.slice(2, 3)}
      view="week"
      selection={{ mode: "single", value: "2026-09-15" }}
    />
    <h2>期間の選択</h2>
    <Calendar
      label="9月21日〜27日から期間を選ぶ"
      weeks={weeks.slice(3, 4)}
      view="week"
      selection={{ mode: "range", start: "2026-09-22", end: "2026-09-25" }}
    />
    <h2>平日から選ぶ</h2>
    <p>
      週末と前後の月を空き（null）にした月です。↑↓は空きをまたいでも同じ曜日の前後の週へ移ります。
    </p>
    <Calendar
      label="2026年9月の平日から選ぶ"
      weeks={emptyWeeks.map((week) =>
        week.map((day, index) => (day.outside || index >= 5 ? null : day)),
      )}
      selection={{ mode: "single", value: "2026-09-15" }}
    />
    <h2>年の俯瞰</h2>
    <Calendar label="2026年" view="year" months={months} />
    <h2>時刻順の予定</h2>
    <Calendar label="2026年9月の予定一覧" weeks={weeks} view="agenda" now="10:30" />
    <h2>月をまたぐ一覧</h2>
    <Calendar
      label="9月21日〜10月4日の予定一覧"
      weeks={[...weeks.slice(3), ...makeCalendarWeeks(2026, 10).slice(0, 1)]}
      view="agenda"
      now="10:30"
    />
    <h2>予定がない期間</h2>
    <Calendar label="予定のない週" weeks={[weeks[0] ?? []]} view="agenda" />
    <h2>予定を押して詳細を開く</h2>
    <Calendar
      label="詳細を持つ予定"
      view="week"
      now="10:30"
      weeks={[
        (weeks[3] ?? []).map((day) =>
          day?.date === "2026-09-24"
            ? {
                ...day,
                events: [
                  {
                    start: "13:00",
                    end: "15:00",
                    label: "デザインレビュー",
                    accent: "blue",
                    href: "/apps/schedule",
                    details: {
                      id: "calendar-details-review",
                      content: (
                        <ValueList
                          items={[
                            { label: "場所", value: "3階 会議室B" },
                            {
                              label: "メモ",
                              value: "スマートフォンの画面を中心に見る。",
                            },
                          ]}
                        />
                      ),
                    },
                  },
                ],
              }
            : day === null
              ? null
              : { ...day, events: [] },
        ),
      ]}
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <h2>月の予定と週番号</h2>
  <div class="rx-calendar" data-view="month" role="region" aria-label="2026年9月の予定">
    <div class="controls">
      <h2>2026年9月の予定</h2>
      <nav class="period" aria-label="表示期間">
        <a
          href="/apps/schedule?month=8"
          data-icon-only="true"
          aria-label="前月"
          title="前月"
          class="rx-button"
          data-variant="secondary"
          data-size="compact"
          ><span class="previous-icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span></a
        ><a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="compact"
          >今月</a
        ><a
          href="/apps/schedule?month=10"
          data-icon-only="true"
          aria-label="翌月"
          title="翌月"
          class="rx-button"
          data-variant="secondary"
          data-size="compact"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
        ></a>
      </nav>
      <nav
        class="rx-filter-bar"
        aria-label="予定の表示形式"
        data-appearance="segmented"
      >
        <a
          href="/apps/schedule"
          aria-current="page"
          data-current="true"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          ><span>月</span></a
        ><a
          href="/apps/schedule?view=week"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          ><span>週</span></a
        ><a
          href="/apps/schedule?view=year"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          ><span>年</span></a
        ><a
          href="/apps/schedule?view=agenda"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          ><span>一覧</span></a
        >
      </nav>
      <div class="actions">
        <a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >予定を追加</a
        >
      </div>
    </div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="2026年9月の予定の日付グリッド"
    >
      <table data-week-numbers="true">
        <caption>
          2026年9月の予定
        </caption>
        <thead>
          <tr>
            <th scope="col" class="week-number">週</th>
            <th scope="col">月</th>
            <th scope="col">火</th>
            <th scope="col">水</th>
            <th scope="col">木</th>
            <th scope="col">金</th>
            <th scope="col">土</th>
            <th scope="col">日</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" class="week-number">36</th>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="8月31日月曜日"
                >31</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><span class="month-start" aria-hidden="true">9月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月1日火曜日"
                >1</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月2日水曜日"
                >2</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月3日木曜日"
                >3</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月4日金曜日"
                >4</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月5日土曜日"
                >5</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月6日日曜日"
                >6</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">37</th>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月7日月曜日"
                >7</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月8日火曜日"
                >8</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月9日水曜日"
                >9</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月10日木曜日"
                >10</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月11日金曜日"
                >11</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月12日土曜日"
                >12</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月13日日曜日"
                >13</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">38</th>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月14日月曜日"
                >14</a
              >
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月15日火曜日"
                >15</a
              >
              <ul class="events" aria-label="9月15日火曜日の予定">
                <li>
                  <a
                    data-accent="blue"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:00">10:00</time></span
                    ><span class="label">編集会議</span></a
                  >
                </li>
                <li>
                  <a
                    data-accent="green"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:30">10:30</time></span
                    ><span class="label">取材の準備</span></a
                  >
                </li>
                <li>
                  <a data-past="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">利用案内を確認</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月16日水曜日"
                >16</a
              >
              <ul class="events" aria-label="9月16日水曜日の予定">
                <li>
                  <a
                    data-accent="coral"
                    data-all-day="true"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="label">社内研修</span></a
                  >
                </li>
                <li>
                  <a data-past="true" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="9:00">9:00</time></span
                    ><span class="label">朝会</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月17日木曜日"
                >17</a
              >
              <ul class="events" aria-label="9月17日木曜日の予定">
                <li>
                  <a data-past="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="11:00">11:00</time></span
                    ><span class="label"
                      >初めて利用する方に向けた予約方法と当日の受付の説明会</span
                    ></a
                  >
                </li>
              </ul>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月18日金曜日"
                >18</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月19日土曜日"
                >19</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月20日日曜日"
                >20</a
              >
            </td>
          </tr>
          <tr data-current="true">
            <th scope="row" class="week-number">39</th>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              >
            </td>
            <td data-disabled="true">
              <span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time>
            </td>
            <td data-current="true" data-events="true">
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              >
              <ul class="events" aria-label="9月24日木曜日の予定">
                <li>
                  <a data-past="true" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="7:00">7:00</time></span
                    ><span class="label">早朝の搬入</span></a
                  >
                </li>
                <li>
                  <a data-accent="blue" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="13:00">13:00</time></span
                    ><span class="label">デザインレビュー</span></a
                  >
                </li>
                <li>
                  <a data-accent="amber" class="event" href="/apps/people"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="13:30">13:30</time></span
                    ><span class="label">来客</span></a
                  >
                </li>
                <li>
                  <a data-accent="green" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">資料作成</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              >
              <ul class="events" aria-label="9月25日金曜日の予定">
                <li>
                  <a data-tentative="true" class="event" href="/apps/people"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">打ち合わせ（仮）</span></a
                  >
                </li>
                <li>
                  <a data-accent="amber" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="18:00">18:00</time></span
                    ><span class="label">秋の読書会</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              >
              <ul class="events" aria-label="9月26日土曜日の予定">
                <li>
                  <a data-all-day="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="label">休館日</span></a
                  >
                </li>
              </ul>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月27日日曜日"
                >27</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">40</th>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月28日月曜日"
                >28</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月29日火曜日"
                >29</a
              >
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月30日水曜日"
                >30</a
              >
              <ul class="events" aria-label="9月30日水曜日の予定">
                <li>
                  <a data-tentative="true" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:00">10:00</time></span
                    ><span class="label">取材（仮）</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">木</span
              ><span class="month-start" aria-hidden="true">10月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月1日木曜日"
                >1</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月2日金曜日"
                >2</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月3日土曜日"
                >3</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月4日日曜日"
                >4</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="agenda period-agenda">
      <p class="agenda-heading">この月の予定</p>
      <section class="agenda-group" aria-label="9月15日火曜日">
        <h3>
          <time datetime="2026-09-15"
            ><span class="number">15</span><span class="weekday">火</span></time
          >
        </h3>
        <ul class="events" aria-label="9月15日火曜日の予定">
          <li>
            <a data-accent="blue" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">編集会議</span></a
            >
          </li>
          <li>
            <a data-accent="green" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                  >12:00</time
                ></span
              ><span class="label">取材の準備</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time>15:00</time></span
              ><span class="label">利用案内を確認</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月16日水曜日">
        <h3>
          <time datetime="2026-09-16"
            ><span class="number">16</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月16日水曜日の予定">
          <li>
            <a
              data-accent="coral"
              data-all-day="true"
              data-past="true"
              class="event"
              href="/apps/project"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">社内研修</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                  >9:15</time
                ></span
              ><span class="label">朝会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月17日木曜日">
        <h3>
          <time datetime="2026-09-17"
            ><span class="number">17</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月17日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                  >12:30</time
                ></span
              ><span class="label"
                >初めて利用する方に向けた予約方法と当日の受付の説明会</span
              ></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月24日木曜日" data-current="true">
        <h3>
          <time datetime="2026-09-24"
            ><span class="number">24</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月24日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                  >7:30</time
                ></span
              ><span class="label">早朝の搬入</span></a
            >
          </li>
          <li>
            <a data-accent="blue" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">デザインレビュー</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                  >14:00</time
                ></span
              ><span class="label">来客</span></a
            >
          </li>
          <li>
            <a data-accent="green" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                  >16:00</time
                ></span
              ><span class="label">資料作成</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月25日金曜日">
        <h3>
          <time datetime="2026-09-25"
            ><span class="number">25</span><span class="weekday">金</span></time
          >
        </h3>
        <ul class="events" aria-label="9月25日金曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">打ち合わせ（仮）</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                  >21:00</time
                ></span
              ><span class="label">秋の読書会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月26日土曜日">
        <h3>
          <time datetime="2026-09-26"
            ><span class="number">26</span><span class="weekday">土</span></time
          >
        </h3>
        <ul class="events" aria-label="9月26日土曜日の予定">
          <li>
            <a data-all-day="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">休館日</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月30日水曜日">
        <h3>
          <time datetime="2026-09-30"
            ><span class="number">30</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月30日水曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">取材（仮）</span></a
            >
          </li>
        </ul>
      </section>
    </div>
  </div>
  <h2>日曜始まりの月</h2>
  <div
    class="rx-calendar"
    data-view="month"
    role="region"
    aria-label="2026年9月（日曜始まり）"
  >
    <div class="controls"><h2>2026年9月（日曜始まり）</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="2026年9月（日曜始まり）の日付グリッド"
    >
      <table data-week-numbers="true">
        <caption>
          2026年9月（日曜始まり）
        </caption>
        <thead>
          <tr>
            <th scope="col" class="week-number">週</th>
            <th scope="col">日</th>
            <th scope="col">月</th>
            <th scope="col">火</th>
            <th scope="col">水</th>
            <th scope="col">木</th>
            <th scope="col">金</th>
            <th scope="col">土</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" class="week-number">36</th>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="8月30日日曜日"
                >30</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="8月31日月曜日"
                >31</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><span class="month-start" aria-hidden="true">9月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月1日火曜日"
                >1</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月2日水曜日"
                >2</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月3日木曜日"
                >3</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月4日金曜日"
                >4</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
                aria-label="9月5日土曜日"
                >5</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">37</th>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月6日日曜日"
                >6</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月7日月曜日"
                >7</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月8日火曜日"
                >8</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月9日水曜日"
                >9</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月10日木曜日"
                >10</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月11日金曜日"
                >11</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月12日土曜日"
                >12</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">38</th>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月13日日曜日"
                >13</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月14日月曜日"
                >14</a
              >
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月15日火曜日"
                >15</a
              >
              <ul class="events" aria-label="9月15日火曜日の予定">
                <li>
                  <a
                    data-accent="blue"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:00">10:00</time></span
                    ><span class="label">編集会議</span></a
                  >
                </li>
                <li>
                  <a
                    data-accent="green"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:30">10:30</time></span
                    ><span class="label">取材の準備</span></a
                  >
                </li>
                <li>
                  <a data-past="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">利用案内を確認</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月16日水曜日"
                >16</a
              >
              <ul class="events" aria-label="9月16日水曜日の予定">
                <li>
                  <a
                    data-accent="coral"
                    data-all-day="true"
                    data-past="true"
                    class="event"
                    href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="label">社内研修</span></a
                  >
                </li>
                <li>
                  <a data-past="true" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="9:00">9:00</time></span
                    ><span class="label">朝会</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月17日木曜日"
                >17</a
              >
              <ul class="events" aria-label="9月17日木曜日の予定">
                <li>
                  <a data-past="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="11:00">11:00</time></span
                    ><span class="label"
                      >初めて利用する方に向けた予約方法と当日の受付の説明会</span
                    ></a
                  >
                </li>
              </ul>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月18日金曜日"
                >18</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月19日土曜日"
                >19</a
              >
            </td>
          </tr>
          <tr data-current="true">
            <th scope="row" class="week-number">39</th>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月20日日曜日"
                >20</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              >
            </td>
            <td data-disabled="true">
              <span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time>
            </td>
            <td data-current="true" data-events="true">
              <span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              >
              <ul class="events" aria-label="9月24日木曜日の予定">
                <li>
                  <a class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="7:00">7:00</time></span
                    ><span class="label">早朝の搬入</span></a
                  >
                </li>
                <li>
                  <a data-accent="blue" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="13:00">13:00</time></span
                    ><span class="label">デザインレビュー</span></a
                  >
                </li>
                <li>
                  <a data-accent="amber" class="event" href="/apps/people"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="13:30">13:30</time></span
                    ><span class="label">来客</span></a
                  >
                </li>
                <li>
                  <a data-accent="green" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">資料作成</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              >
              <ul class="events" aria-label="9月25日金曜日の予定">
                <li>
                  <a data-tentative="true" class="event" href="/apps/people"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="14:00">14:00</time></span
                    ><span class="label">打ち合わせ（仮）</span></a
                  >
                </li>
                <li>
                  <a data-accent="amber" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="18:00">18:00</time></span
                    ><span class="label">秋の読書会</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              >
              <ul class="events" aria-label="9月26日土曜日の予定">
                <li>
                  <a data-all-day="true" class="event" href="/apps/schedule"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="label">休館日</span></a
                  >
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th scope="row" class="week-number">40</th>
            <td>
              <span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月27日日曜日"
                >27</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月28日月曜日"
                >28</a
              >
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月29日火曜日"
                >29</a
              >
            </td>
            <td data-events="true">
              <span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="9月30日水曜日"
                >30</a
              >
              <ul class="events" aria-label="9月30日水曜日の予定">
                <li>
                  <a data-tentative="true" class="event" href="/apps/project"
                    ><span class="bar" aria-hidden="true"></span
                    ><span class="time"><time datetime="10:00">10:00</time></span
                    ><span class="label">取材（仮）</span></a
                  >
                </li>
              </ul>
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">木</span
              ><span class="month-start" aria-hidden="true">10月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月1日木曜日"
                >1</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月2日金曜日"
                >2</a
              >
            </td>
            <td data-outside="true">
              <span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
                aria-label="10月3日土曜日"
                >3</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="agenda period-agenda">
      <p class="agenda-heading">この月の予定</p>
      <section class="agenda-group" aria-label="9月15日火曜日">
        <h3>
          <time datetime="2026-09-15"
            ><span class="number">15</span><span class="weekday">火</span></time
          >
        </h3>
        <ul class="events" aria-label="9月15日火曜日の予定">
          <li>
            <a data-accent="blue" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">編集会議</span></a
            >
          </li>
          <li>
            <a data-accent="green" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                  >12:00</time
                ></span
              ><span class="label">取材の準備</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time>15:00</time></span
              ><span class="label">利用案内を確認</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月16日水曜日">
        <h3>
          <time datetime="2026-09-16"
            ><span class="number">16</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月16日水曜日の予定">
          <li>
            <a
              data-accent="coral"
              data-all-day="true"
              data-past="true"
              class="event"
              href="/apps/project"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">社内研修</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                  >9:15</time
                ></span
              ><span class="label">朝会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月17日木曜日">
        <h3>
          <time datetime="2026-09-17"
            ><span class="number">17</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月17日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                  >12:30</time
                ></span
              ><span class="label"
                >初めて利用する方に向けた予約方法と当日の受付の説明会</span
              ></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月24日木曜日" data-current="true">
        <h3>
          <time datetime="2026-09-24"
            ><span class="number">24</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月24日木曜日の予定">
          <li>
            <a class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                  >7:30</time
                ></span
              ><span class="label">早朝の搬入</span></a
            >
          </li>
          <li>
            <a data-accent="blue" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">デザインレビュー</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                  >14:00</time
                ></span
              ><span class="label">来客</span></a
            >
          </li>
          <li>
            <a data-accent="green" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                  >16:00</time
                ></span
              ><span class="label">資料作成</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月25日金曜日">
        <h3>
          <time datetime="2026-09-25"
            ><span class="number">25</span><span class="weekday">金</span></time
          >
        </h3>
        <ul class="events" aria-label="9月25日金曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">打ち合わせ（仮）</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                  >21:00</time
                ></span
              ><span class="label">秋の読書会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月26日土曜日">
        <h3>
          <time datetime="2026-09-26"
            ><span class="number">26</span><span class="weekday">土</span></time
          >
        </h3>
        <ul class="events" aria-label="9月26日土曜日の予定">
          <li>
            <a data-all-day="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">休館日</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月30日水曜日">
        <h3>
          <time datetime="2026-09-30"
            ><span class="number">30</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月30日水曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">取材（仮）</span></a
            >
          </li>
        </ul>
      </section>
    </div>
  </div>
  <h2>週の時間割</h2>
  <p>
    0〜24時をスクロールでき、開くと現在時刻を表示します。重なる予定・終日・早朝と夜の予定を含みます。
  </p>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月21日〜27日">
    <div class="controls">
      <h2>9月21日〜27日<span class="week-number">第39週</span></h2>
    </div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月21日〜27日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月21日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月22日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月23日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜27日・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a data-past="true" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜27日・9月25日金曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-tentative="true" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">打ち合わせ（仮）</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 1080;
                  --rx-calendar-end: 1260;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-accent="amber" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                      >21:00</time
                    ></span
                  ><span class="label">秋の読書会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月26日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              ></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a data-all-day="true" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">休館日</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月27日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月27日日曜日"
                >27</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>日</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月24日">
    <div class="controls"><h2>9月24日</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月24日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 1;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月24日・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a data-past="true" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2>稼働日</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月21日〜25日">
    <div class="controls"><h2>9月21日〜25日</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月21日〜25日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 5;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月21日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月22日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月23日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜25日・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a data-past="true" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜25日・9月25日金曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-tentative="true" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">打ち合わせ（仮）</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 1080;
                  --rx-calendar-end: 1260;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-accent="amber" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                      >21:00</time
                    ></span
                  ><span class="label">秋の読書会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2>3日</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月24日〜26日">
    <div class="controls"><h2>9月24日〜26日</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月24日〜26日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 3;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月24日〜26日・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a data-past="true" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月24日〜26日・9月25日金曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-tentative="true" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">打ち合わせ（仮）</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 1080;
                  --rx-calendar-end: 1260;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-accent="amber" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                      >21:00</time
                    ></span
                  ><span class="label">秋の読書会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月26日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              ></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a data-all-day="true" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">休館日</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>日曜始まりの週</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月20日〜26日">
    <div class="controls">
      <h2>9月20日〜26日<span class="week-number">第39週</span></h2>
    </div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月20日〜26日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月20日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月20日日曜日"
                >20</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月21日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月22日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月23日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月20日〜26日・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a data-past="true" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月20日〜26日・9月25日金曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-tentative="true" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">打ち合わせ（仮）</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 1080;
                  --rx-calendar-end: 1260;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-accent="amber" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                      >21:00</time
                    ></span
                  ><span class="label">秋の読書会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月26日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              ></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a data-all-day="true" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">休館日</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>短い予定と長い題名</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月14日〜20日">
    <div class="controls"><h2>9月14日〜20日</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月14日〜20日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 420"></span>
        <div class="column" role="group" aria-label="9月14日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月14日月曜日"
                >14</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月15日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月15日火曜日"
                >15</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日・9月15日火曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 600;
                  --rx-calendar-end: 660;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                      >11:00</time
                    ></span
                  ><span class="label">編集会議</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 630;
                  --rx-calendar-end: 720;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                      >12:00</time
                    ></span
                  ><span class="label">取材の準備</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time>15:00</time></span
                  ><span class="label">利用案内を確認</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月16日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月16日水曜日"
                >16</a
              ></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a
                  data-accent="coral"
                  data-all-day="true"
                  class="event"
                  href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">社内研修</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed">
            <ol aria-label="9月14日〜20日・9月16日水曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 540;
                  --rx-calendar-end: 555;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                      >9:15</time
                    ></span
                  ><span class="label">朝会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月17日木曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月17日木曜日"
                >17</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日・9月17日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 660;
                  --rx-calendar-end: 750;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                      >12:30</time
                    ></span
                  ><span class="label"
                    >初めて利用する方に向けた予約方法と当日の受付の説明会</span
                  ></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月18日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月18日金曜日"
                >18</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月19日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月19日土曜日"
                >19</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月20日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月20日日曜日"
                >20</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>稼働時間を指定した週</h2>
  <p>9〜18時の外を淡く塗り、今日を含まない週は稼働時間の始まりを表示します。</p>
  <div
    class="rx-calendar"
    data-view="week"
    role="region"
    aria-label="9月14日〜20日の営業時間"
  >
    <div class="controls"><h2>9月14日〜20日の営業時間</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月14日〜20日の営業時間の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 9;
          --rx-calendar-core-end: 18;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 480"></span>
        <div class="column" role="group" aria-label="9月14日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月14日月曜日"
                >14</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月15日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月15日火曜日"
                >15</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日の営業時間・9月15日火曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 600;
                  --rx-calendar-end: 660;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                      >11:00</time
                    ></span
                  ><span class="label">編集会議</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 630;
                  --rx-calendar-end: 720;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                      >12:00</time
                    ></span
                  ><span class="label">取材の準備</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time>15:00</time></span
                  ><span class="label">利用案内を確認</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月16日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月16日水曜日"
                >16</a
              ></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a
                  data-accent="coral"
                  data-all-day="true"
                  class="event"
                  href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">社内研修</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed">
            <ol aria-label="9月14日〜20日の営業時間・9月16日水曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 540;
                  --rx-calendar-end: 555;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                      >9:15</time
                    ></span
                  ><span class="label">朝会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月17日木曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月17日木曜日"
                >17</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日の営業時間・9月17日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 660;
                  --rx-calendar-end: 750;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                      >12:30</time
                    ></span
                  ><span class="label"
                    >初めて利用する方に向けた予約方法と当日の受付の説明会</span
                  ></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月18日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月18日金曜日"
                >18</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月19日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月19日土曜日"
                >19</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月20日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
                aria-label="9月20日日曜日"
                >20</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>予定のない週</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="9月7日〜13日">
    <div class="controls"><h2>9月7日〜13日</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月7日〜13日の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 420"></span>
        <div class="column" role="group" aria-label="9月7日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月7日月曜日"
                >7</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月8日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月8日火曜日"
                >8</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月9日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月9日水曜日"
                >9</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月10日木曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月10日木曜日"
                >10</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月11日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月11日金曜日"
                >11</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月12日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月12日土曜日"
                >12</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月13日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
                aria-label="9月13日日曜日"
                >13</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>週の選択</h2>
  <div
    class="rx-calendar"
    data-view="week"
    data-controller="calendar"
    data-calendar-mode-value="single"
    data-calendar-value-value="2026-09-15"
    role="region"
    aria-label="9月14日〜20日から選ぶ"
  >
    <div class="controls"><h2>9月14日〜20日から選ぶ</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月14日〜20日から選ぶの時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 420"></span>
        <div class="column" role="group" aria-label="9月14日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-14"
                aria-pressed="false"
                aria-label="9月14日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                14
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月15日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-15"
                data-state="selected"
                aria-pressed="true"
                aria-label="9月15日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                15
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日から選ぶ・9月15日火曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 600;
                  --rx-calendar-end: 660;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                      >11:00</time
                    ></span
                  ><span class="label">編集会議</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 630;
                  --rx-calendar-end: 720;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                      >12:00</time
                    ></span
                  ><span class="label">取材の準備</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time>15:00</time></span
                  ><span class="label">利用案内を確認</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月16日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-16"
                aria-pressed="false"
                aria-label="9月16日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                16
              </button></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a
                  data-accent="coral"
                  data-all-day="true"
                  class="event"
                  href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">社内研修</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed">
            <ol aria-label="9月14日〜20日から選ぶ・9月16日水曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 540;
                  --rx-calendar-end: 555;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                      >9:15</time
                    ></span
                  ><span class="label">朝会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月17日木曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-17"
                aria-pressed="false"
                aria-label="9月17日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                17
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月14日〜20日から選ぶ・9月17日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 660;
                  --rx-calendar-end: 750;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                      >12:30</time
                    ></span
                  ><span class="label"
                    >初めて利用する方に向けた予約方法と当日の受付の説明会</span
                  ></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月18日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-18"
                aria-pressed="false"
                aria-label="9月18日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                18
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月19日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-19"
                aria-pressed="false"
                aria-label="9月19日土曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                19
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月20日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-20"
                aria-pressed="false"
                aria-label="9月20日日曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                20
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>期間の選択</h2>
  <div
    class="rx-calendar"
    data-view="week"
    data-controller="calendar"
    data-calendar-mode-value="range"
    data-calendar-start-value="2026-09-22"
    data-calendar-end-value="2026-09-25"
    role="region"
    aria-label="9月21日〜27日から期間を選ぶ"
  >
    <div class="controls"><h2>9月21日〜27日から期間を選ぶ</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="9月21日〜27日から期間を選ぶの時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 420"></span>
        <div class="column" role="group" aria-label="9月21日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-21"
                aria-pressed="false"
                aria-label="9月21日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                21
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月22日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-22"
                data-state="range-start"
                aria-pressed="true"
                aria-label="9月22日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                22
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月23日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-23"
                data-state="in-range"
                aria-pressed="false"
                aria-label="9月23日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
                disabled=""
              >
                23
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-24"
                data-state="in-range"
                aria-pressed="false"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                24
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜27日から期間を選ぶ・9月24日木曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 420;
                  --rx-calendar-end: 450;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
                data-length="short"
              >
                <a class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                      >7:30</time
                    ></span
                  ><span class="label">早朝の搬入</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="blue" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 810;
                  --rx-calendar-end: 840;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
                data-length="short"
              >
                <a data-accent="amber" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                      >14:00</time
                    ></span
                  ><span class="label">来客</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 960;
                  --rx-calendar-lane: 1;
                  --rx-calendar-lanes: 2;
                "
              >
                <a data-accent="green" class="event" href="/apps/project"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                      >16:00</time
                    ></span
                  ><span class="label">資料作成</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-25"
                data-state="range-end"
                aria-pressed="true"
                aria-label="9月25日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                25
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="9月21日〜27日から期間を選ぶ・9月25日金曜日の時間の予定">
              <li
                style="
                  --rx-calendar-start: 840;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-tentative="true" class="event" href="/apps/people"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">打ち合わせ（仮）</span></a
                >
              </li>
              <li
                style="
                  --rx-calendar-start: 1080;
                  --rx-calendar-end: 1260;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <a data-accent="amber" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                      >21:00</time
                    ></span
                  ><span class="label">秋の読書会</span></a
                >
              </li>
            </ol>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月26日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-26"
                aria-pressed="false"
                aria-label="9月26日土曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                26
              </button></span
            >
          </div>
          <div class="all-day">
            <ul aria-label="終日の予定">
              <li>
                <a data-all-day="true" class="event" href="/apps/schedule"
                  ><span class="bar" aria-hidden="true"></span
                  ><span class="label">休館日</span></a
                >
              </li>
            </ul>
          </div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月27日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-27"
                aria-pressed="false"
                aria-label="9月27日日曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                27
              </button></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
  <h2>平日から選ぶ</h2>
  <p>
    週末と前後の月を空き（null）にした月です。↑↓は空きをまたいでも同じ曜日の前後の週へ移ります。
  </p>
  <div
    class="rx-calendar"
    data-view="month"
    data-controller="calendar"
    data-calendar-mode-value="single"
    data-calendar-value-value="2026-09-15"
    role="region"
    aria-label="2026年9月の平日から選ぶ"
  >
    <div class="controls"><h2>2026年9月の平日から選ぶ</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="2026年9月の平日から選ぶの日付グリッド"
    >
      <table>
        <caption>
          2026年9月の平日から選ぶ
        </caption>
        <thead>
          <tr>
            <th scope="col">月</th>
            <th scope="col">火</th>
            <th scope="col">水</th>
            <th scope="col">木</th>
            <th scope="col">金</th>
            <th scope="col">土</th>
            <th scope="col">日</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><span class="month-start" aria-hidden="true">9月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-01"
                aria-pressed="false"
                aria-label="9月1日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                1
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-02"
                aria-pressed="false"
                aria-label="9月2日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                2
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-03"
                aria-pressed="false"
                aria-label="9月3日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                3
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-04"
                aria-pressed="false"
                aria-label="9月4日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                4
              </button>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-07"
                aria-pressed="false"
                aria-label="9月7日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                7
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-08"
                aria-pressed="false"
                aria-label="9月8日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                8
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-09"
                aria-pressed="false"
                aria-label="9月9日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                9
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-10"
                aria-pressed="false"
                aria-label="9月10日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                10
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-11"
                aria-pressed="false"
                aria-label="9月11日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                11
              </button>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-14"
                aria-pressed="false"
                aria-label="9月14日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                14
              </button>
            </td>
            <td data-selected="true">
              <span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-15"
                data-state="selected"
                aria-pressed="true"
                aria-label="9月15日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                15
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-16"
                aria-pressed="false"
                aria-label="9月16日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                16
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-17"
                aria-pressed="false"
                aria-label="9月17日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                17
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-18"
                aria-pressed="false"
                aria-label="9月18日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                18
              </button>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr data-current="true">
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-21"
                aria-pressed="false"
                aria-label="9月21日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                21
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-22"
                aria-pressed="false"
                aria-label="9月22日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                22
              </button>
            </td>
            <td data-disabled="true">
              <span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-23"
                aria-pressed="false"
                aria-label="9月23日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
                disabled=""
              >
                23
              </button>
            </td>
            <td data-current="true">
              <span class="weekday" aria-hidden="true">木</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-24"
                aria-pressed="false"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                24
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">金</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-25"
                aria-pressed="false"
                aria-label="9月25日金曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                25
              </button>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <span class="weekday" aria-hidden="true">月</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-28"
                aria-pressed="false"
                aria-label="9月28日月曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                28
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">火</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-29"
                aria-pressed="false"
                aria-label="9月29日火曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                29
              </button>
            </td>
            <td>
              <span class="weekday" aria-hidden="true">水</span
              ><button
                data-calendar-target="day"
                data-calendar-value="2026-09-30"
                aria-pressed="false"
                aria-label="9月30日水曜日"
                class="rx-button day"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                30
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <h2>年の俯瞰</h2>
  <div class="rx-calendar" data-view="year" role="region" aria-label="2026年">
    <div class="controls"><h2>2026年</h2></div>
    <div class="year-overview" role="group" aria-label="2026年の日付一覧">
      <div class="year-grid">
        <span class="lead" aria-hidden="true"></span
        ><span class="lead" aria-hidden="true"></span
        ><span class="lead" aria-hidden="true"></span>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=month"
            aria-label="1月を表示"
            ><span class="month-label" aria-hidden="true">1月</span></a
          ><time datetime="2026-01-01" aria-label="1月1日木曜日"
            ><span class="weekday" aria-hidden="true">木</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=0"
            aria-label="1月2日金曜日"
            ><time datetime="2026-01-02" aria-label="1月2日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=0"
            aria-label="1月3日土曜日"
            ><time datetime="2026-01-03" aria-label="1月3日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=0"
            aria-label="1月4日日曜日"
            ><time datetime="2026-01-04" aria-label="1月4日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月5日月曜日"
            ><time datetime="2026-01-05" aria-label="1月5日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月6日火曜日"
            ><time datetime="2026-01-06" aria-label="1月6日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月7日水曜日"
            ><time datetime="2026-01-07" aria-label="1月7日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月8日木曜日"
            ><time datetime="2026-01-08" aria-label="1月8日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月9日金曜日"
            ><time datetime="2026-01-09" aria-label="1月9日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月10日土曜日"
            ><time datetime="2026-01-10" aria-label="1月10日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=1"
            aria-label="1月11日日曜日"
            ><time datetime="2026-01-11" aria-label="1月11日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月12日月曜日"
            ><time datetime="2026-01-12" aria-label="1月12日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月13日火曜日"
            ><time datetime="2026-01-13" aria-label="1月13日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月14日水曜日"
            ><time datetime="2026-01-14" aria-label="1月14日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月15日木曜日"
            ><time datetime="2026-01-15" aria-label="1月15日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月16日金曜日"
            ><time datetime="2026-01-16" aria-label="1月16日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月17日土曜日"
            ><time datetime="2026-01-17" aria-label="1月17日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=2"
            aria-label="1月18日日曜日"
            ><time datetime="2026-01-18" aria-label="1月18日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月19日月曜日"
            ><time datetime="2026-01-19" aria-label="1月19日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月20日火曜日"
            ><time datetime="2026-01-20" aria-label="1月20日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月21日水曜日"
            ><time datetime="2026-01-21" aria-label="1月21日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月22日木曜日"
            ><time datetime="2026-01-22" aria-label="1月22日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月23日金曜日"
            ><time datetime="2026-01-23" aria-label="1月23日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月24日土曜日"
            ><time datetime="2026-01-24" aria-label="1月24日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=3"
            aria-label="1月25日日曜日"
            ><time datetime="2026-01-25" aria-label="1月25日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月26日月曜日"
            ><time datetime="2026-01-26" aria-label="1月26日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月27日火曜日"
            ><time datetime="2026-01-27" aria-label="1月27日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月28日水曜日"
            ><time datetime="2026-01-28" aria-label="1月28日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月29日木曜日"
            ><time datetime="2026-01-29" aria-label="1月29日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月30日金曜日"
            ><time datetime="2026-01-30" aria-label="1月30日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=1&amp;view=week&amp;week=4"
            aria-label="1月31日土曜日"
            ><time datetime="2026-01-31" aria-label="1月31日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div
          class="year-day"
          data-weekend="true"
          data-month-start="true"
          data-last-column="true"
        >
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=month"
            aria-label="2月を表示"
            ><span class="month-label" aria-hidden="true">2月</span></a
          ><time datetime="2026-02-01" aria-label="2月1日日曜日"
            ><span class="weekday" aria-hidden="true">日</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月2日月曜日"
            ><time datetime="2026-02-02" aria-label="2月2日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月3日火曜日"
            ><time datetime="2026-02-03" aria-label="2月3日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月4日水曜日"
            ><time datetime="2026-02-04" aria-label="2月4日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月5日木曜日"
            ><time datetime="2026-02-05" aria-label="2月5日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月6日金曜日"
            ><time datetime="2026-02-06" aria-label="2月6日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月7日土曜日"
            ><time datetime="2026-02-07" aria-label="2月7日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=1"
            aria-label="2月8日日曜日"
            ><time datetime="2026-02-08" aria-label="2月8日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月9日月曜日"
            ><time datetime="2026-02-09" aria-label="2月9日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月10日火曜日"
            ><time datetime="2026-02-10" aria-label="2月10日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月11日水曜日"
            ><time datetime="2026-02-11" aria-label="2月11日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月12日木曜日"
            ><time datetime="2026-02-12" aria-label="2月12日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月13日金曜日"
            ><time datetime="2026-02-13" aria-label="2月13日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月14日土曜日"
            ><time datetime="2026-02-14" aria-label="2月14日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=2"
            aria-label="2月15日日曜日"
            ><time datetime="2026-02-15" aria-label="2月15日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月16日月曜日"
            ><time datetime="2026-02-16" aria-label="2月16日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月17日火曜日"
            ><time datetime="2026-02-17" aria-label="2月17日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月18日水曜日"
            ><time datetime="2026-02-18" aria-label="2月18日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月19日木曜日"
            ><time datetime="2026-02-19" aria-label="2月19日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月20日金曜日"
            ><time datetime="2026-02-20" aria-label="2月20日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月21日土曜日"
            ><time datetime="2026-02-21" aria-label="2月21日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=3"
            aria-label="2月22日日曜日"
            ><time datetime="2026-02-22" aria-label="2月22日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月23日月曜日"
            ><time datetime="2026-02-23" aria-label="2月23日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月24日火曜日"
            ><time datetime="2026-02-24" aria-label="2月24日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月25日水曜日"
            ><time datetime="2026-02-25" aria-label="2月25日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月26日木曜日"
            ><time datetime="2026-02-26" aria-label="2月26日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月27日金曜日"
            ><time datetime="2026-02-27" aria-label="2月27日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=2&amp;view=week&amp;week=4"
            aria-label="2月28日土曜日"
            ><time datetime="2026-02-28" aria-label="2月28日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div
          class="year-day"
          data-weekend="true"
          data-month-start="true"
          data-last-column="true"
        >
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=month"
            aria-label="3月を表示"
            ><span class="month-label" aria-hidden="true">3月</span></a
          ><time datetime="2026-03-01" aria-label="3月1日日曜日"
            ><span class="weekday" aria-hidden="true">日</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月2日月曜日"
            ><time datetime="2026-03-02" aria-label="3月2日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月3日火曜日"
            ><time datetime="2026-03-03" aria-label="3月3日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月4日水曜日"
            ><time datetime="2026-03-04" aria-label="3月4日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月5日木曜日"
            ><time datetime="2026-03-05" aria-label="3月5日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月6日金曜日"
            ><time datetime="2026-03-06" aria-label="3月6日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月7日土曜日"
            ><time datetime="2026-03-07" aria-label="3月7日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div
          class="year-day"
          data-weekend="true"
          data-last-column="true"
          data-events="true"
        >
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=1"
            aria-label="3月8日日曜日、1件の予定：制作の予定"
            ><time
              datetime="2026-03-08"
              aria-label="3月8日日曜日、1件の予定：制作の予定"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月9日月曜日"
            ><time datetime="2026-03-09" aria-label="3月9日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月10日火曜日"
            ><time datetime="2026-03-10" aria-label="3月10日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月11日水曜日"
            ><time datetime="2026-03-11" aria-label="3月11日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月12日木曜日"
            ><time datetime="2026-03-12" aria-label="3月12日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月13日金曜日"
            ><time datetime="2026-03-13" aria-label="3月13日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月14日土曜日"
            ><time datetime="2026-03-14" aria-label="3月14日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=2"
            aria-label="3月15日日曜日"
            ><time datetime="2026-03-15" aria-label="3月15日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月16日月曜日"
            ><time datetime="2026-03-16" aria-label="3月16日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月17日火曜日"
            ><time datetime="2026-03-17" aria-label="3月17日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月18日水曜日"
            ><time datetime="2026-03-18" aria-label="3月18日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月19日木曜日"
            ><time datetime="2026-03-19" aria-label="3月19日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月20日金曜日"
            ><time datetime="2026-03-20" aria-label="3月20日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月21日土曜日"
            ><time datetime="2026-03-21" aria-label="3月21日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=3"
            aria-label="3月22日日曜日"
            ><time datetime="2026-03-22" aria-label="3月22日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月23日月曜日"
            ><time datetime="2026-03-23" aria-label="3月23日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月24日火曜日"
            ><time datetime="2026-03-24" aria-label="3月24日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月25日水曜日"
            ><time datetime="2026-03-25" aria-label="3月25日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月26日木曜日"
            ><time datetime="2026-03-26" aria-label="3月26日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月27日金曜日"
            ><time datetime="2026-03-27" aria-label="3月27日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月28日土曜日"
            ><time datetime="2026-03-28" aria-label="3月28日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=4"
            aria-label="3月29日日曜日"
            ><time datetime="2026-03-29" aria-label="3月29日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=5"
            aria-label="3月30日月曜日"
            ><time datetime="2026-03-30" aria-label="3月30日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=3&amp;view=week&amp;week=5"
            aria-label="3月31日火曜日"
            ><time datetime="2026-03-31" aria-label="3月31日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=month"
            aria-label="4月を表示"
            ><span class="month-label" aria-hidden="true">4月</span></a
          ><time datetime="2026-04-01" aria-label="4月1日水曜日"
            ><span class="weekday" aria-hidden="true">水</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=0"
            aria-label="4月2日木曜日"
            ><time datetime="2026-04-02" aria-label="4月2日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=0"
            aria-label="4月3日金曜日"
            ><time datetime="2026-04-03" aria-label="4月3日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=0"
            aria-label="4月4日土曜日"
            ><time datetime="2026-04-04" aria-label="4月4日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=0"
            aria-label="4月5日日曜日"
            ><time datetime="2026-04-05" aria-label="4月5日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月6日月曜日"
            ><time datetime="2026-04-06" aria-label="4月6日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月7日火曜日"
            ><time datetime="2026-04-07" aria-label="4月7日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月8日水曜日"
            ><time datetime="2026-04-08" aria-label="4月8日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月9日木曜日"
            ><time datetime="2026-04-09" aria-label="4月9日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月10日金曜日"
            ><time datetime="2026-04-10" aria-label="4月10日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月11日土曜日"
            ><time datetime="2026-04-11" aria-label="4月11日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=1"
            aria-label="4月12日日曜日"
            ><time datetime="2026-04-12" aria-label="4月12日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月13日月曜日"
            ><time datetime="2026-04-13" aria-label="4月13日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月14日火曜日"
            ><time datetime="2026-04-14" aria-label="4月14日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月15日水曜日"
            ><time datetime="2026-04-15" aria-label="4月15日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月16日木曜日"
            ><time datetime="2026-04-16" aria-label="4月16日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月17日金曜日"
            ><time datetime="2026-04-17" aria-label="4月17日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月18日土曜日"
            ><time datetime="2026-04-18" aria-label="4月18日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=2"
            aria-label="4月19日日曜日"
            ><time datetime="2026-04-19" aria-label="4月19日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月20日月曜日"
            ><time datetime="2026-04-20" aria-label="4月20日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月21日火曜日"
            ><time datetime="2026-04-21" aria-label="4月21日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月22日水曜日"
            ><time datetime="2026-04-22" aria-label="4月22日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月23日木曜日"
            ><time datetime="2026-04-23" aria-label="4月23日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月24日金曜日"
            ><time datetime="2026-04-24" aria-label="4月24日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月25日土曜日"
            ><time datetime="2026-04-25" aria-label="4月25日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=3"
            aria-label="4月26日日曜日"
            ><time datetime="2026-04-26" aria-label="4月26日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=4"
            aria-label="4月27日月曜日"
            ><time datetime="2026-04-27" aria-label="4月27日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=4"
            aria-label="4月28日火曜日"
            ><time datetime="2026-04-28" aria-label="4月28日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=4"
            aria-label="4月29日水曜日"
            ><time datetime="2026-04-29" aria-label="4月29日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=4&amp;view=week&amp;week=4"
            aria-label="4月30日木曜日"
            ><time datetime="2026-04-30" aria-label="4月30日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=month"
            aria-label="5月を表示"
            ><span class="month-label" aria-hidden="true">5月</span></a
          ><time datetime="2026-05-01" aria-label="5月1日金曜日"
            ><span class="weekday" aria-hidden="true">金</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=0"
            aria-label="5月2日土曜日"
            ><time datetime="2026-05-02" aria-label="5月2日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=0"
            aria-label="5月3日日曜日"
            ><time datetime="2026-05-03" aria-label="5月3日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月4日月曜日"
            ><time datetime="2026-05-04" aria-label="5月4日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月5日火曜日"
            ><time datetime="2026-05-05" aria-label="5月5日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月6日水曜日"
            ><time datetime="2026-05-06" aria-label="5月6日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月7日木曜日"
            ><time datetime="2026-05-07" aria-label="5月7日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月8日金曜日"
            ><time datetime="2026-05-08" aria-label="5月8日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月9日土曜日"
            ><time datetime="2026-05-09" aria-label="5月9日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=1"
            aria-label="5月10日日曜日"
            ><time datetime="2026-05-10" aria-label="5月10日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月11日月曜日"
            ><time datetime="2026-05-11" aria-label="5月11日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月12日火曜日"
            ><time datetime="2026-05-12" aria-label="5月12日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月13日水曜日"
            ><time datetime="2026-05-13" aria-label="5月13日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月14日木曜日"
            ><time datetime="2026-05-14" aria-label="5月14日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月15日金曜日"
            ><time datetime="2026-05-15" aria-label="5月15日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月16日土曜日"
            ><time datetime="2026-05-16" aria-label="5月16日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=2"
            aria-label="5月17日日曜日"
            ><time datetime="2026-05-17" aria-label="5月17日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月18日月曜日"
            ><time datetime="2026-05-18" aria-label="5月18日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月19日火曜日"
            ><time datetime="2026-05-19" aria-label="5月19日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月20日水曜日"
            ><time datetime="2026-05-20" aria-label="5月20日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月21日木曜日"
            ><time datetime="2026-05-21" aria-label="5月21日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月22日金曜日"
            ><time datetime="2026-05-22" aria-label="5月22日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月23日土曜日"
            ><time datetime="2026-05-23" aria-label="5月23日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=3"
            aria-label="5月24日日曜日"
            ><time datetime="2026-05-24" aria-label="5月24日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月25日月曜日"
            ><time datetime="2026-05-25" aria-label="5月25日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月26日火曜日"
            ><time datetime="2026-05-26" aria-label="5月26日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月27日水曜日"
            ><time datetime="2026-05-27" aria-label="5月27日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月28日木曜日"
            ><time datetime="2026-05-28" aria-label="5月28日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月29日金曜日"
            ><time datetime="2026-05-29" aria-label="5月29日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月30日土曜日"
            ><time datetime="2026-05-30" aria-label="5月30日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=5&amp;view=week&amp;week=4"
            aria-label="5月31日日曜日"
            ><time datetime="2026-05-31" aria-label="5月31日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=month"
            aria-label="6月を表示"
            ><span class="month-label" aria-hidden="true">6月</span></a
          ><time datetime="2026-06-01" aria-label="6月1日月曜日"
            ><span class="weekday" aria-hidden="true">月</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月2日火曜日"
            ><time datetime="2026-06-02" aria-label="6月2日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月3日水曜日"
            ><time datetime="2026-06-03" aria-label="6月3日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月4日木曜日"
            ><time datetime="2026-06-04" aria-label="6月4日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月5日金曜日"
            ><time datetime="2026-06-05" aria-label="6月5日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月6日土曜日"
            ><time datetime="2026-06-06" aria-label="6月6日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=0"
            aria-label="6月7日日曜日"
            ><time datetime="2026-06-07" aria-label="6月7日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月8日月曜日"
            ><time datetime="2026-06-08" aria-label="6月8日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月9日火曜日"
            ><time datetime="2026-06-09" aria-label="6月9日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月10日水曜日"
            ><time datetime="2026-06-10" aria-label="6月10日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月11日木曜日"
            ><time datetime="2026-06-11" aria-label="6月11日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月12日金曜日"
            ><time datetime="2026-06-12" aria-label="6月12日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月13日土曜日"
            ><time datetime="2026-06-13" aria-label="6月13日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=1"
            aria-label="6月14日日曜日"
            ><time datetime="2026-06-14" aria-label="6月14日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月15日月曜日"
            ><time datetime="2026-06-15" aria-label="6月15日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月16日火曜日"
            ><time datetime="2026-06-16" aria-label="6月16日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月17日水曜日、1件の予定：制作の予定"
            ><time
              datetime="2026-06-17"
              aria-label="6月17日水曜日、1件の予定：制作の予定"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月18日木曜日"
            ><time datetime="2026-06-18" aria-label="6月18日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月19日金曜日"
            ><time datetime="2026-06-19" aria-label="6月19日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月20日土曜日"
            ><time datetime="2026-06-20" aria-label="6月20日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=2"
            aria-label="6月21日日曜日"
            ><time datetime="2026-06-21" aria-label="6月21日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月22日月曜日"
            ><time datetime="2026-06-22" aria-label="6月22日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月23日火曜日"
            ><time datetime="2026-06-23" aria-label="6月23日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月24日水曜日"
            ><time datetime="2026-06-24" aria-label="6月24日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月25日木曜日"
            ><time datetime="2026-06-25" aria-label="6月25日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月26日金曜日"
            ><time datetime="2026-06-26" aria-label="6月26日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月27日土曜日"
            ><time datetime="2026-06-27" aria-label="6月27日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=3"
            aria-label="6月28日日曜日"
            ><time datetime="2026-06-28" aria-label="6月28日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=4"
            aria-label="6月29日月曜日"
            ><time datetime="2026-06-29" aria-label="6月29日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=6&amp;view=week&amp;week=4"
            aria-label="6月30日火曜日"
            ><time datetime="2026-06-30" aria-label="6月30日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=month"
            aria-label="7月を表示"
            ><span class="month-label" aria-hidden="true">7月</span></a
          ><time datetime="2026-07-01" aria-label="7月1日水曜日"
            ><span class="weekday" aria-hidden="true">水</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=0"
            aria-label="7月2日木曜日"
            ><time datetime="2026-07-02" aria-label="7月2日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=0"
            aria-label="7月3日金曜日"
            ><time datetime="2026-07-03" aria-label="7月3日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=0"
            aria-label="7月4日土曜日"
            ><time datetime="2026-07-04" aria-label="7月4日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=0"
            aria-label="7月5日日曜日"
            ><time datetime="2026-07-05" aria-label="7月5日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月6日月曜日"
            ><time datetime="2026-07-06" aria-label="7月6日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月7日火曜日"
            ><time datetime="2026-07-07" aria-label="7月7日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月8日水曜日"
            ><time datetime="2026-07-08" aria-label="7月8日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月9日木曜日"
            ><time datetime="2026-07-09" aria-label="7月9日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月10日金曜日"
            ><time datetime="2026-07-10" aria-label="7月10日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月11日土曜日"
            ><time datetime="2026-07-11" aria-label="7月11日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=1"
            aria-label="7月12日日曜日"
            ><time datetime="2026-07-12" aria-label="7月12日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月13日月曜日"
            ><time datetime="2026-07-13" aria-label="7月13日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月14日火曜日"
            ><time datetime="2026-07-14" aria-label="7月14日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月15日水曜日"
            ><time datetime="2026-07-15" aria-label="7月15日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月16日木曜日"
            ><time datetime="2026-07-16" aria-label="7月16日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月17日金曜日"
            ><time datetime="2026-07-17" aria-label="7月17日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月18日土曜日"
            ><time datetime="2026-07-18" aria-label="7月18日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=2"
            aria-label="7月19日日曜日"
            ><time datetime="2026-07-19" aria-label="7月19日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月20日月曜日"
            ><time datetime="2026-07-20" aria-label="7月20日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月21日火曜日"
            ><time datetime="2026-07-21" aria-label="7月21日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月22日水曜日"
            ><time datetime="2026-07-22" aria-label="7月22日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月23日木曜日"
            ><time datetime="2026-07-23" aria-label="7月23日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月24日金曜日"
            ><time datetime="2026-07-24" aria-label="7月24日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月25日土曜日"
            ><time datetime="2026-07-25" aria-label="7月25日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=3"
            aria-label="7月26日日曜日"
            ><time datetime="2026-07-26" aria-label="7月26日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=4"
            aria-label="7月27日月曜日"
            ><time datetime="2026-07-27" aria-label="7月27日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=4"
            aria-label="7月28日火曜日"
            ><time datetime="2026-07-28" aria-label="7月28日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=4"
            aria-label="7月29日水曜日"
            ><time datetime="2026-07-29" aria-label="7月29日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=4"
            aria-label="7月30日木曜日"
            ><time datetime="2026-07-30" aria-label="7月30日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=7&amp;view=week&amp;week=4"
            aria-label="7月31日金曜日"
            ><time datetime="2026-07-31" aria-label="7月31日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=month"
            aria-label="8月を表示"
            ><span class="month-label" aria-hidden="true">8月</span></a
          ><time datetime="2026-08-01" aria-label="8月1日土曜日"
            ><span class="weekday" aria-hidden="true">土</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=0"
            aria-label="8月2日日曜日"
            ><time datetime="2026-08-02" aria-label="8月2日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月3日月曜日"
            ><time datetime="2026-08-03" aria-label="8月3日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月4日火曜日"
            ><time datetime="2026-08-04" aria-label="8月4日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月5日水曜日"
            ><time datetime="2026-08-05" aria-label="8月5日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月6日木曜日"
            ><time datetime="2026-08-06" aria-label="8月6日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月7日金曜日"
            ><time datetime="2026-08-07" aria-label="8月7日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月8日土曜日"
            ><time datetime="2026-08-08" aria-label="8月8日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=1"
            aria-label="8月9日日曜日"
            ><time datetime="2026-08-09" aria-label="8月9日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月10日月曜日"
            ><time datetime="2026-08-10" aria-label="8月10日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月11日火曜日"
            ><time datetime="2026-08-11" aria-label="8月11日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月12日水曜日"
            ><time datetime="2026-08-12" aria-label="8月12日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月13日木曜日"
            ><time datetime="2026-08-13" aria-label="8月13日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月14日金曜日"
            ><time datetime="2026-08-14" aria-label="8月14日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月15日土曜日"
            ><time datetime="2026-08-15" aria-label="8月15日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=2"
            aria-label="8月16日日曜日"
            ><time datetime="2026-08-16" aria-label="8月16日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月17日月曜日"
            ><time datetime="2026-08-17" aria-label="8月17日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月18日火曜日"
            ><time datetime="2026-08-18" aria-label="8月18日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月19日水曜日"
            ><time datetime="2026-08-19" aria-label="8月19日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月20日木曜日"
            ><time datetime="2026-08-20" aria-label="8月20日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月21日金曜日"
            ><time datetime="2026-08-21" aria-label="8月21日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月22日土曜日"
            ><time datetime="2026-08-22" aria-label="8月22日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=3"
            aria-label="8月23日日曜日"
            ><time datetime="2026-08-23" aria-label="8月23日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月24日月曜日"
            ><time datetime="2026-08-24" aria-label="8月24日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月25日火曜日"
            ><time datetime="2026-08-25" aria-label="8月25日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月26日水曜日"
            ><time datetime="2026-08-26" aria-label="8月26日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月27日木曜日"
            ><time datetime="2026-08-27" aria-label="8月27日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月28日金曜日"
            ><time datetime="2026-08-28" aria-label="8月28日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月29日土曜日"
            ><time datetime="2026-08-29" aria-label="8月29日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=4"
            aria-label="8月30日日曜日"
            ><time datetime="2026-08-30" aria-label="8月30日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=8&amp;view=week&amp;week=5"
            aria-label="8月31日月曜日"
            ><time datetime="2026-08-31" aria-label="8月31日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=month"
            aria-label="9月を表示"
            ><span class="month-label" aria-hidden="true">9月</span></a
          ><time datetime="2026-09-01" aria-label="9月1日火曜日"
            ><span class="weekday" aria-hidden="true">火</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
            aria-label="9月2日水曜日"
            ><time datetime="2026-09-02" aria-label="9月2日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
            aria-label="9月3日木曜日"
            ><time datetime="2026-09-03" aria-label="9月3日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
            aria-label="9月4日金曜日"
            ><time datetime="2026-09-04" aria-label="9月4日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
            aria-label="9月5日土曜日"
            ><time datetime="2026-09-05" aria-label="9月5日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=0"
            aria-label="9月6日日曜日"
            ><time datetime="2026-09-06" aria-label="9月6日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月7日月曜日"
            ><time datetime="2026-09-07" aria-label="9月7日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月8日火曜日"
            ><time datetime="2026-09-08" aria-label="9月8日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月9日水曜日"
            ><time datetime="2026-09-09" aria-label="9月9日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月10日木曜日"
            ><time datetime="2026-09-10" aria-label="9月10日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月11日金曜日"
            ><time datetime="2026-09-11" aria-label="9月11日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月12日土曜日"
            ><time datetime="2026-09-12" aria-label="9月12日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=1"
            aria-label="9月13日日曜日"
            ><time datetime="2026-09-13" aria-label="9月13日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月14日月曜日"
            ><time datetime="2026-09-14" aria-label="9月14日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月15日火曜日、3件の予定：編集会議、取材の準備、利用案内を確認"
            ><time
              datetime="2026-09-15"
              aria-label="9月15日火曜日、3件の予定：編集会議、取材の準備、利用案内を確認"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月16日水曜日、2件の予定：社内研修、朝会"
            ><time
              datetime="2026-09-16"
              aria-label="9月16日水曜日、2件の予定：社内研修、朝会"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月17日木曜日、1件の予定：初めて利用する方に向けた予約方法と当日の受付の説明会"
            ><time
              datetime="2026-09-17"
              aria-label="9月17日木曜日、1件の予定：初めて利用する方に向けた予約方法と当日の受付の説明会"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月18日金曜日"
            ><time datetime="2026-09-18" aria-label="9月18日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月19日土曜日"
            ><time datetime="2026-09-19" aria-label="9月19日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=2"
            aria-label="9月20日日曜日"
            ><time datetime="2026-09-20" aria-label="9月20日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月21日月曜日"
            ><time datetime="2026-09-21" aria-label="9月21日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月22日火曜日"
            ><time datetime="2026-09-22" aria-label="9月22日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <time datetime="2026-09-23" aria-label="9月23日水曜日"
            ><span class="weekday" aria-hidden="true">水</span
            ><span class="number" aria-hidden="true">23</span></time
          >
        </div>
        <div class="year-day" data-current="true" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月24日木曜日、4件の予定：早朝の搬入、デザインレビュー、来客、資料作成"
            aria-current="date"
            ><time
              datetime="2026-09-24"
              aria-label="9月24日木曜日、4件の予定：早朝の搬入、デザインレビュー、来客、資料作成"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月25日金曜日、2件の予定：打ち合わせ（仮）、秋の読書会"
            ><time
              datetime="2026-09-25"
              aria-label="9月25日金曜日、2件の予定：打ち合わせ（仮）、秋の読書会"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-weekend="true" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月26日土曜日、1件の予定：休館日"
            ><time datetime="2026-09-26" aria-label="9月26日土曜日、1件の予定：休館日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
            aria-label="9月27日日曜日"
            ><time datetime="2026-09-27" aria-label="9月27日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
            aria-label="9月28日月曜日"
            ><time datetime="2026-09-28" aria-label="9月28日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
            aria-label="9月29日火曜日"
            ><time datetime="2026-09-29" aria-label="9月29日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=4"
            aria-label="9月30日水曜日、1件の予定：取材（仮）"
            ><time
              datetime="2026-09-30"
              aria-label="9月30日水曜日、1件の予定：取材（仮）"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=month"
            aria-label="10月を表示"
            ><span class="month-label" aria-hidden="true">10月</span></a
          ><time datetime="2026-10-01" aria-label="10月1日木曜日"
            ><span class="weekday" aria-hidden="true">木</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=0"
            aria-label="10月2日金曜日、1件の予定：10月の定例"
            ><time
              datetime="2026-10-02"
              aria-label="10月2日金曜日、1件の予定：10月の定例"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=0"
            aria-label="10月3日土曜日"
            ><time datetime="2026-10-03" aria-label="10月3日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=0"
            aria-label="10月4日日曜日"
            ><time datetime="2026-10-04" aria-label="10月4日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月5日月曜日"
            ><time datetime="2026-10-05" aria-label="10月5日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月6日火曜日"
            ><time datetime="2026-10-06" aria-label="10月6日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月7日水曜日"
            ><time datetime="2026-10-07" aria-label="10月7日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月8日木曜日"
            ><time datetime="2026-10-08" aria-label="10月8日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月9日金曜日"
            ><time datetime="2026-10-09" aria-label="10月9日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月10日土曜日"
            ><time datetime="2026-10-10" aria-label="10月10日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=1"
            aria-label="10月11日日曜日"
            ><time datetime="2026-10-11" aria-label="10月11日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月12日月曜日"
            ><time datetime="2026-10-12" aria-label="10月12日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月13日火曜日"
            ><time datetime="2026-10-13" aria-label="10月13日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月14日水曜日"
            ><time datetime="2026-10-14" aria-label="10月14日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月15日木曜日"
            ><time datetime="2026-10-15" aria-label="10月15日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月16日金曜日"
            ><time datetime="2026-10-16" aria-label="10月16日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月17日土曜日"
            ><time datetime="2026-10-17" aria-label="10月17日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=2"
            aria-label="10月18日日曜日"
            ><time datetime="2026-10-18" aria-label="10月18日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月19日月曜日"
            ><time datetime="2026-10-19" aria-label="10月19日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月20日火曜日"
            ><time datetime="2026-10-20" aria-label="10月20日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月21日水曜日"
            ><time datetime="2026-10-21" aria-label="10月21日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月22日木曜日"
            ><time datetime="2026-10-22" aria-label="10月22日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月23日金曜日"
            ><time datetime="2026-10-23" aria-label="10月23日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月24日土曜日"
            ><time datetime="2026-10-24" aria-label="10月24日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=3"
            aria-label="10月25日日曜日"
            ><time datetime="2026-10-25" aria-label="10月25日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月26日月曜日"
            ><time datetime="2026-10-26" aria-label="10月26日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月27日火曜日"
            ><time datetime="2026-10-27" aria-label="10月27日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月28日水曜日"
            ><time datetime="2026-10-28" aria-label="10月28日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月29日木曜日"
            ><time datetime="2026-10-29" aria-label="10月29日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月30日金曜日"
            ><time datetime="2026-10-30" aria-label="10月30日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=10&amp;view=week&amp;week=4"
            aria-label="10月31日土曜日"
            ><time datetime="2026-10-31" aria-label="10月31日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
        <div
          class="year-day"
          data-weekend="true"
          data-month-start="true"
          data-last-column="true"
        >
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=month"
            aria-label="11月を表示"
            ><span class="month-label" aria-hidden="true">11月</span></a
          ><time datetime="2026-11-01" aria-label="11月1日日曜日"
            ><span class="weekday" aria-hidden="true">日</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月2日月曜日"
            ><time datetime="2026-11-02" aria-label="11月2日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月3日火曜日"
            ><time datetime="2026-11-03" aria-label="11月3日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月4日水曜日"
            ><time datetime="2026-11-04" aria-label="11月4日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月5日木曜日"
            ><time datetime="2026-11-05" aria-label="11月5日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月6日金曜日"
            ><time datetime="2026-11-06" aria-label="11月6日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月7日土曜日"
            ><time datetime="2026-11-07" aria-label="11月7日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=1"
            aria-label="11月8日日曜日"
            ><time datetime="2026-11-08" aria-label="11月8日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月9日月曜日"
            ><time datetime="2026-11-09" aria-label="11月9日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月10日火曜日"
            ><time datetime="2026-11-10" aria-label="11月10日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月11日水曜日"
            ><time datetime="2026-11-11" aria-label="11月11日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月12日木曜日"
            ><time datetime="2026-11-12" aria-label="11月12日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月13日金曜日"
            ><time datetime="2026-11-13" aria-label="11月13日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月14日土曜日"
            ><time datetime="2026-11-14" aria-label="11月14日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=2"
            aria-label="11月15日日曜日"
            ><time datetime="2026-11-15" aria-label="11月15日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月16日月曜日"
            ><time datetime="2026-11-16" aria-label="11月16日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月17日火曜日"
            ><time datetime="2026-11-17" aria-label="11月17日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月18日水曜日"
            ><time datetime="2026-11-18" aria-label="11月18日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月19日木曜日"
            ><time datetime="2026-11-19" aria-label="11月19日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月20日金曜日"
            ><time datetime="2026-11-20" aria-label="11月20日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月21日土曜日"
            ><time datetime="2026-11-21" aria-label="11月21日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=3"
            aria-label="11月22日日曜日"
            ><time datetime="2026-11-22" aria-label="11月22日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月23日月曜日"
            ><time datetime="2026-11-23" aria-label="11月23日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月24日火曜日"
            ><time datetime="2026-11-24" aria-label="11月24日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月25日水曜日"
            ><time datetime="2026-11-25" aria-label="11月25日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月26日木曜日"
            ><time datetime="2026-11-26" aria-label="11月26日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月27日金曜日"
            ><time datetime="2026-11-27" aria-label="11月27日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月28日土曜日"
            ><time datetime="2026-11-28" aria-label="11月28日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=4"
            aria-label="11月29日日曜日"
            ><time datetime="2026-11-29" aria-label="11月29日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=11&amp;view=week&amp;week=5"
            aria-label="11月30日月曜日"
            ><time datetime="2026-11-30" aria-label="11月30日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day" data-month-start="true">
          <a
            class="month-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=month"
            aria-label="12月を表示"
            ><span class="month-label" aria-hidden="true">12月</span></a
          ><time datetime="2026-12-01" aria-label="12月1日火曜日"
            ><span class="weekday" aria-hidden="true">火</span
            ><span class="number" aria-hidden="true">1</span></time
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=0"
            aria-label="12月2日水曜日"
            ><time datetime="2026-12-02" aria-label="12月2日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">2</span></time
            ></a
          >
        </div>
        <div class="year-day" data-events="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=0"
            aria-label="12月3日木曜日、1件の予定：制作の予定"
            ><time
              datetime="2026-12-03"
              aria-label="12月3日木曜日、1件の予定：制作の予定"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">3</span></time
            ></a
          ><span class="event-mark" aria-hidden="true"></span>
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=0"
            aria-label="12月4日金曜日"
            ><time datetime="2026-12-04" aria-label="12月4日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">4</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=0"
            aria-label="12月5日土曜日"
            ><time datetime="2026-12-05" aria-label="12月5日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">5</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=0"
            aria-label="12月6日日曜日"
            ><time datetime="2026-12-06" aria-label="12月6日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">6</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月7日月曜日"
            ><time datetime="2026-12-07" aria-label="12月7日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">7</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月8日火曜日"
            ><time datetime="2026-12-08" aria-label="12月8日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">8</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月9日水曜日"
            ><time datetime="2026-12-09" aria-label="12月9日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">9</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月10日木曜日"
            ><time datetime="2026-12-10" aria-label="12月10日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">10</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月11日金曜日"
            ><time datetime="2026-12-11" aria-label="12月11日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">11</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月12日土曜日"
            ><time datetime="2026-12-12" aria-label="12月12日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">12</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=1"
            aria-label="12月13日日曜日"
            ><time datetime="2026-12-13" aria-label="12月13日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">13</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月14日月曜日"
            ><time datetime="2026-12-14" aria-label="12月14日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">14</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月15日火曜日"
            ><time datetime="2026-12-15" aria-label="12月15日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">15</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月16日水曜日"
            ><time datetime="2026-12-16" aria-label="12月16日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">16</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月17日木曜日"
            ><time datetime="2026-12-17" aria-label="12月17日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">17</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月18日金曜日"
            ><time datetime="2026-12-18" aria-label="12月18日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">18</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月19日土曜日"
            ><time datetime="2026-12-19" aria-label="12月19日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">19</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=2"
            aria-label="12月20日日曜日"
            ><time datetime="2026-12-20" aria-label="12月20日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">20</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月21日月曜日"
            ><time datetime="2026-12-21" aria-label="12月21日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">21</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月22日火曜日"
            ><time datetime="2026-12-22" aria-label="12月22日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">22</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月23日水曜日"
            ><time datetime="2026-12-23" aria-label="12月23日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">23</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月24日木曜日"
            ><time datetime="2026-12-24" aria-label="12月24日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">24</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月25日金曜日"
            ><time datetime="2026-12-25" aria-label="12月25日金曜日"
              ><span class="weekday" aria-hidden="true">金</span
              ><span class="number" aria-hidden="true">25</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月26日土曜日"
            ><time datetime="2026-12-26" aria-label="12月26日土曜日"
              ><span class="weekday" aria-hidden="true">土</span
              ><span class="number" aria-hidden="true">26</span></time
            ></a
          >
        </div>
        <div class="year-day" data-weekend="true" data-last-column="true">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=3"
            aria-label="12月27日日曜日"
            ><time datetime="2026-12-27" aria-label="12月27日日曜日"
              ><span class="weekday" aria-hidden="true">日</span
              ><span class="number" aria-hidden="true">27</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=4"
            aria-label="12月28日月曜日"
            ><time datetime="2026-12-28" aria-label="12月28日月曜日"
              ><span class="weekday" aria-hidden="true">月</span
              ><span class="number" aria-hidden="true">28</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=4"
            aria-label="12月29日火曜日"
            ><time datetime="2026-12-29" aria-label="12月29日火曜日"
              ><span class="weekday" aria-hidden="true">火</span
              ><span class="number" aria-hidden="true">29</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=4"
            aria-label="12月30日水曜日"
            ><time datetime="2026-12-30" aria-label="12月30日水曜日"
              ><span class="weekday" aria-hidden="true">水</span
              ><span class="number" aria-hidden="true">30</span></time
            ></a
          >
        </div>
        <div class="year-day">
          <a
            class="date-link"
            href="/apps/schedule?year=2026&amp;month=12&amp;view=week&amp;week=4"
            aria-label="12月31日木曜日"
            ><time datetime="2026-12-31" aria-label="12月31日木曜日"
              ><span class="weekday" aria-hidden="true">木</span
              ><span class="number" aria-hidden="true">31</span></time
            ></a
          >
        </div>
      </div>
    </div>
  </div>
  <h2>時刻順の予定</h2>
  <div
    class="rx-calendar"
    data-view="agenda"
    role="region"
    aria-label="2026年9月の予定一覧"
  >
    <div class="controls"><h2>2026年9月の予定一覧</h2></div>
    <div class="agenda">
      <section class="agenda-group" aria-label="9月15日火曜日">
        <h3>
          <time datetime="2026-09-15"
            ><span class="number">15</span><span class="weekday">火</span></time
          >
        </h3>
        <ul class="events" aria-label="9月15日火曜日の予定">
          <li>
            <a data-accent="blue" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">編集会議</span></a
            >
          </li>
          <li>
            <a data-accent="green" data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:30">10:30</time>–<time datetime="12:00"
                  >12:00</time
                ></span
              ><span class="label">取材の準備</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time>15:00</time></span
              ><span class="label">利用案内を確認</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月16日水曜日">
        <h3>
          <time datetime="2026-09-16"
            ><span class="number">16</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月16日水曜日の予定">
          <li>
            <a
              data-accent="coral"
              data-all-day="true"
              data-past="true"
              class="event"
              href="/apps/project"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">社内研修</span></a
            >
          </li>
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="9:00">9:00</time>–<time datetime="9:15"
                  >9:15</time
                ></span
              ><span class="label">朝会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月17日木曜日">
        <h3>
          <time datetime="2026-09-17"
            ><span class="number">17</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月17日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="11:00">11:00</time>–<time datetime="12:30"
                  >12:30</time
                ></span
              ><span class="label"
                >初めて利用する方に向けた予約方法と当日の受付の説明会</span
              ></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月24日木曜日" data-current="true">
        <h3>
          <time datetime="2026-09-24"
            ><span class="number">24</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月24日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                  >7:30</time
                ></span
              ><span class="label">早朝の搬入</span></a
            >
          </li>
          <li>
            <a data-accent="blue" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">デザインレビュー</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                  >14:00</time
                ></span
              ><span class="label">来客</span></a
            >
          </li>
          <li>
            <a data-accent="green" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                  >16:00</time
                ></span
              ><span class="label">資料作成</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月25日金曜日">
        <h3>
          <time datetime="2026-09-25"
            ><span class="number">25</span><span class="weekday">金</span></time
          >
        </h3>
        <ul class="events" aria-label="9月25日金曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">打ち合わせ（仮）</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                  >21:00</time
                ></span
              ><span class="label">秋の読書会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月26日土曜日">
        <h3>
          <time datetime="2026-09-26"
            ><span class="number">26</span><span class="weekday">土</span></time
          >
        </h3>
        <ul class="events" aria-label="9月26日土曜日の予定">
          <li>
            <a data-all-day="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">休館日</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月30日水曜日">
        <h3>
          <time datetime="2026-09-30"
            ><span class="number">30</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月30日水曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">取材（仮）</span></a
            >
          </li>
        </ul>
      </section>
    </div>
  </div>
  <h2>月をまたぐ一覧</h2>
  <div
    class="rx-calendar"
    data-view="agenda"
    role="region"
    aria-label="9月21日〜10月4日の予定一覧"
  >
    <div class="controls"><h2>9月21日〜10月4日の予定一覧</h2></div>
    <div class="agenda">
      <section class="agenda-group" aria-label="9月24日木曜日" data-current="true">
        <h3>
          <time datetime="2026-09-24"
            ><span class="number">24</span><span class="weekday">木</span></time
          >
        </h3>
        <ul class="events" aria-label="9月24日木曜日の予定">
          <li>
            <a data-past="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="7:00">7:00</time>–<time datetime="7:30"
                  >7:30</time
                ></span
              ><span class="label">早朝の搬入</span></a
            >
          </li>
          <li>
            <a data-accent="blue" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">デザインレビュー</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="13:30">13:30</time>–<time datetime="14:00"
                  >14:00</time
                ></span
              ><span class="label">来客</span></a
            >
          </li>
          <li>
            <a data-accent="green" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="16:00"
                  >16:00</time
                ></span
              ><span class="label">資料作成</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月25日金曜日">
        <h3>
          <time datetime="2026-09-25"
            ><span class="number">25</span><span class="weekday">金</span></time
          >
        </h3>
        <ul class="events" aria-label="9月25日金曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/people"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="14:00">14:00</time>–<time datetime="15:00"
                  >15:00</time
                ></span
              ><span class="label">打ち合わせ（仮）</span></a
            >
          </li>
          <li>
            <a data-accent="amber" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="18:00">18:00</time>–<time datetime="21:00"
                  >21:00</time
                ></span
              ><span class="label">秋の読書会</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月26日土曜日">
        <h3>
          <time datetime="2026-09-26"
            ><span class="number">26</span><span class="weekday">土</span></time
          >
        </h3>
        <ul class="events" aria-label="9月26日土曜日の予定">
          <li>
            <a data-all-day="true" class="event" href="/apps/schedule"
              ><span class="bar" aria-hidden="true"></span><span class="time">終日</span
              ><span class="label">休館日</span></a
            >
          </li>
        </ul>
      </section>
      <section class="agenda-group" aria-label="9月30日水曜日">
        <h3>
          <time datetime="2026-09-30"
            ><span class="number">30</span><span class="weekday">水</span></time
          >
        </h3>
        <ul class="events" aria-label="9月30日水曜日の予定">
          <li>
            <a data-tentative="true" class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="10:00">10:00</time>–<time datetime="11:00"
                  >11:00</time
                ></span
              ><span class="label">取材（仮）</span></a
            >
          </li>
        </ul>
      </section>
      <p class="agenda-month" aria-hidden="true">10月</p>
      <section class="agenda-group" aria-label="10月2日金曜日">
        <h3>
          <time datetime="2026-10-02"
            ><span class="number">2</span><span class="weekday">金</span></time
          >
        </h3>
        <ul class="events" aria-label="10月2日金曜日の予定">
          <li>
            <a class="event" href="/apps/project"
              ><span class="bar" aria-hidden="true"></span
              ><span class="time"
                ><time datetime="15:00">15:00</time>–<time datetime="16:00"
                  >16:00</time
                ></span
              ><span class="label">10月の定例</span></a
            >
          </li>
        </ul>
      </section>
    </div>
  </div>
  <h2>予定がない期間</h2>
  <div class="rx-calendar" data-view="agenda" role="region" aria-label="予定のない週">
    <div class="controls"><h2>予定のない週</h2></div>
    <p class="empty">この期間に予定はありません</p>
  </div>
  <h2>予定を押して詳細を開く</h2>
  <div class="rx-calendar" data-view="week" role="region" aria-label="詳細を持つ予定">
    <div class="controls"><h2>詳細を持つ予定</h2></div>
    <div
      class="viewport"
      tabindex="0"
      role="group"
      aria-label="詳細を持つ予定の時間割"
      data-controller="calendar-scroll"
    >
      <div
        class="week"
        style="
          --rx-calendar-days: 7;
          --rx-calendar-core-start: 8;
          --rx-calendar-core-end: 20;
        "
      >
        <span class="corner" aria-hidden="true"></span
        ><span class="all-day-label" aria-hidden="true">終日</span>
        <div class="hours" aria-hidden="true">
          <span style="--rx-calendar-hour-index: 0">00:00</span
          ><span style="--rx-calendar-hour-index: 1">01:00</span
          ><span style="--rx-calendar-hour-index: 2">02:00</span
          ><span style="--rx-calendar-hour-index: 3">03:00</span
          ><span style="--rx-calendar-hour-index: 4">04:00</span
          ><span style="--rx-calendar-hour-index: 5">05:00</span
          ><span style="--rx-calendar-hour-index: 6">06:00</span
          ><span style="--rx-calendar-hour-index: 7">07:00</span
          ><span style="--rx-calendar-hour-index: 8">08:00</span
          ><span style="--rx-calendar-hour-index: 9">09:00</span
          ><span style="--rx-calendar-hour-index: 10">10:00</span
          ><span style="--rx-calendar-hour-index: 11">11:00</span
          ><span style="--rx-calendar-hour-index: 12">12:00</span
          ><span style="--rx-calendar-hour-index: 13">13:00</span
          ><span style="--rx-calendar-hour-index: 14">14:00</span
          ><span style="--rx-calendar-hour-index: 15">15:00</span
          ><span style="--rx-calendar-hour-index: 16">16:00</span
          ><span style="--rx-calendar-hour-index: 17">17:00</span
          ><span style="--rx-calendar-hour-index: 18">18:00</span
          ><span style="--rx-calendar-hour-index: 19">19:00</span
          ><span style="--rx-calendar-hour-index: 20">20:00</span
          ><span style="--rx-calendar-hour-index: 21">21:00</span
          ><span style="--rx-calendar-hour-index: 22">22:00</span
          ><span style="--rx-calendar-hour-index: 23">23:00</span
          ><span class="now-label" style="--rx-calendar-now: 630">10:30</span>
        </div>
        <span class="scroll-target" style="--rx-calendar-target: 570"></span>
        <div class="column" role="group" aria-label="9月21日月曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">月</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月21日月曜日"
                >21</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月22日火曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">火</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月22日火曜日"
                >22</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月23日水曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">水</span
              ><time class="day" datetime="2026-09-23">23</time></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月24日木曜日" data-current="true">
          <div class="heading">
            <span class="date" data-current="true"
              ><span class="weekday" aria-hidden="true">木</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-current="date"
                data-current="true"
                aria-label="9月24日木曜日"
                >24</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed">
            <ol aria-label="詳細を持つ予定・9月24日木曜日の時間の予定">
              <li
                data-controller="popover"
                style="
                  --rx-calendar-start: 780;
                  --rx-calendar-end: 900;
                  --rx-calendar-lane: 0;
                  --rx-calendar-lanes: 1;
                "
              >
                <button
                  data-accent="blue"
                  type="button"
                  class="event"
                  popovertarget="calendar-details-review"
                  style="
                    anchor-name: --rx-popover-63-61-6c-65-6e-64-61-72-2d-64-65-74-61-69-6c-73-2d-72-65-76-69-65-77;
                  "
                  aria-haspopup="dialog"
                  aria-controls="calendar-details-review"
                  data-popover-target="trigger"
                >
                  <span class="bar" aria-hidden="true"></span
                  ><span class="time"
                    ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                      >15:00</time
                    ></span
                  ><span class="label">デザインレビュー</span>
                </button>
                <div
                  id="calendar-details-review"
                  popover="auto"
                  class="event-details rx-overlay"
                  data-placement="anchor"
                  data-size="compact"
                  style="
                    --rx-overlay-anchor: --rx-popover-63-61-6c-65-6e-64-61-72-2d-64-65-74-61-69-6c-73-2d-72-65-76-69-65-77;
                  "
                  role="dialog"
                  aria-labelledby="calendar-details-review-title"
                  data-popover-target="panel"
                >
                  <header class="heading">
                    <div class="heading-row">
                      <h3 id="calendar-details-review-title" tabindex="-1" autofocus="">
                        デザインレビュー
                      </h3>
                      <span class="close"
                        ><button
                          popovertarget="calendar-details-review"
                          popovertargetaction="hide"
                          data-icon-only="true"
                          aria-label="閉じる"
                          class="rx-button"
                          type="button"
                          data-variant="primary"
                          data-size="default"
                        >
                          <svg
                            class="rx-icon"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <use href="/assets/rx-icons.svg#rx-x"></use>
                          </svg></button
                      ></span>
                    </div>
                    <p>
                      <span class="time"
                        ><time datetime="13:00">13:00</time>–<time datetime="15:00"
                          >15:00</time
                        ></span
                      >
                    </p>
                  </header>
                  <div class="body">
                    <dl class="rx-value-list">
                      <div>
                        <dt>場所</dt>
                        <dd>3階 会議室B</dd>
                      </div>
                      <div>
                        <dt>メモ</dt>
                        <dd>スマートフォンの画面を中心に見る。</dd>
                      </div>
                    </dl>
                    <p>
                      <a
                        href="/apps/schedule"
                        class="rx-button"
                        data-variant="link"
                        data-size="default"
                        >詳しく見る</a
                      >
                    </p>
                  </div>
                </div>
              </li>
            </ol>
            <span
              class="now"
              style="--rx-calendar-now: 630"
              role="img"
              aria-label="現在時刻 10:30"
            ></span>
          </div>
        </div>
        <div class="column" role="group" aria-label="9月25日金曜日">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">金</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月25日金曜日"
                >25</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月26日土曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">土</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月26日土曜日"
                >26</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
        <div class="column" role="group" aria-label="9月27日日曜日" data-weekend="true">
          <div class="heading">
            <span class="date"
              ><span class="weekday" aria-hidden="true">日</span
              ><a
                class="day"
                href="/apps/schedule?year=2026&amp;month=9&amp;view=week&amp;week=3"
                aria-label="9月27日日曜日"
                >27</a
              ></span
            >
          </div>
          <div class="all-day"></div>
          <div class="timed"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

</details>
