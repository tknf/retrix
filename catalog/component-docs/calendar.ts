import type { ComponentDoc } from "../reference";

export default {
  id: "calendar",
  name: "Calendar",
  description: "月・週・年の表示を切り替えて、日付と予定を確認します。",
  api: ["Calendar"],
  guidance: [
    "予定を月・週・年・日付順の一覧で見渡し、期間を行き来する時に使います。",
    "フォームの欄で日付や期間を一つ選ぶ時は `DatePicker`、開始と終了の日時を並べて見せる時は `DateTimeRange` を使います。",
    "出来事を時系列で読む記録は `Timeline` を使います。",
  ],
  usage: [
    "`weeks` に一行一週の日付（`CalendarDay`）を渡します。月の計算・予定の取得・休日の判断は利用側で行い、Calendarは渡された日付と予定を描きます。`weekStart` で月曜・日曜始まりを選び、`weeks` の各行も同じ曜日から並べます。`weekNumbers` を渡すと、月の各行と週の見出しにISO週番号を出します。",
    "`previous`・`today`・`next` は見出しの隣にリンクで、`views` は表示形式を切り替える `FilterBar` のセグメントで置きます。どれもリンクなので、期間や形式を変えた表示は利用側がリンク先で描き直します。`actions` は見出しの行の終わりに置く操作です。",
    '月（`view="month"`）は表の各日に予定を一行ずつ並べます。外枠を持たずに日の間の淡い線で区切り、今週を濃い色の角丸の枠で囲み、今日の日付を蛍光ペンの楕円で塗り、月の初日に月の旗を立てます。`outside` の日は淡く書きます。40rem以下の狭い幅では、日付の下に予定の点だけを置き、表の下に「この月の予定」の一覧を出します。',
    '週（`view="week"`）は `weeks` の先頭の一行を、0〜24時の時間割で描きます。行の日数で列数が決まり、1日なら日、5日なら稼働日の表示です。時間割は `--rx-calendar-scroll-size`（既定は `min(40rem, 75dvh)`）の高さでスクロールし、見出しと終日の行を上に固定します。`hours` の外側は淡く塗ります。',
    "`now` を渡すと、今日（`current` の日）の列に現在時刻の破線を引き、開いた時にその1時間前から表示します。今日を含まない週は、稼働時間の始まりの1時間前から表示します。開いた位置はCSSの `scroll-initial-target` で決まり、対応しないブラウザでは `CalendarScrollController` を `calendar-scroll` として登録すると同じ位置へスクロールします。",
    "予定（`CalendarEvent`）は、`start` が無ければ終日、`end` が無いか開始以前なら開始から1時間です。Calendarが終日を先に、時刻のある予定を開始の早い順に並べ替え、時間の重なる予定は横に並べます。予定は `accent` の色で淡く塗り、`tentative` の予定は塗らずに破線の枠線にします。今日より前の日の予定と、今日のうち `now` までに終わった予定は淡くします。",
    '年（`view="year"`）は `months` の日付を月をまたいで一続きに並べ、月の始まりに月の名前を置きます。予定のある日にはマークを付けます。`CalendarMonth` の `href` を渡すと、月の名前が月表示へのリンクになります。',
    '一覧（`view="agenda"`）は `weeks` のうち予定のある日だけを、日付ごとに月・週と同じ予定の行で並べ、月が変わる所に区切りを置きます。表示する日付や予定が無い時は、どの形式でも `emptyLabel` を表示します。',
    "予定に `details`（`id` と内容）を渡すと、予定は押すと詳細のパネルを開くボタンになります。パネルは `Popover` と同じで、題名・時刻・内容と、`href` があれば「詳しく見る」のリンクを置きます。`PopoverController` を `popover` として登録します。",
    "`selection` を渡すと（月と週だけ）、日付がボタンになり、`CalendarController` を `calendar` として登録すると一日（`single`）か期間（`range`）を選べます。選んだ値は `calendar:change` で受け取り、送信や保存は利用側で行います。Calendarはフォームの入力欄を持たず、選択中は日の `href` を使いません。日付は重複させず、日付の順に並べます（そうでない時、controllerは動作しません）。",
    "JavaScriptが無い時も、期間の移動と表示形式の切り替えはリンクとして動作し、時間割の初期表示位置はCSSで決めます。日付の選択には `CalendarController` が必要です。",
  ],
  keyboard: [
    [
      "Tab",
      "選べる日付のうち、選んでいる日（無ければ最初の選べる日）にだけフォーカスが止まります。",
    ],
    [
      "← / →",
      "`selection` の時、前・後の選べる日へフォーカスを移します。選べない日は飛ばします。右から左に読む画面では向きが逆になります。",
    ],
    [
      "↑ / ↓",
      "`selection` の時、7日前・後の同じ曜日へフォーカスを移します。並びの空き（`null`）をまたいでも日付で数えます。その日が表示の外か、選べない時は動きません。",
    ],
    ["Enter / Space", "フォーカスした日を選びます。"],
    ["Escape", "開いている予定の詳細のパネルを閉じます。"],
  ],
  accessibility: [
    'Calendar全体は `role="region"` で、`label` を名前と見出し（`h2`）にします。期間の移動は「表示期間」という名前の `nav` に置き、矢印だけのボタンは `label` を読み上げ名にします。',
    '月は `caption` と曜日の列見出しを持つ表で、週番号は行の見出しです。表と時間割は `tabindex="0"` のスクロール領域に置きます。',
    '今日には `aria-current="date"` を付けます。曜日と月のラベルは読み上げから外すので、日の `label` に「9月15日（火）」のように読む名前を渡します。',
    "選べる日付は `aria-pressed` で選んでいるかを伝えます。",
    "予定は日ごとに「（日の名前）の予定」という名前の一覧にします。年表示では、日付の読み上げに予定の件数と題名を含めます。現在時刻の線は「現在時刻 10:30」のように読みます。",
    '詳細を持つ予定のボタンは `aria-haspopup="dialog"` でパネルを開くことを示し、パネルは `role="dialog"` で予定の題名を名前にし、開くと題名にフォーカスを移します。',
    "`accent` の色は区別の補助です。分類の意味は予定の題名などの文言で伝えます。",
  ],
  events: [
    [
      "calendar:beforechange",
      "取り消せます。日を選ぶ前に発火し、`preventDefault()` すると選択を変えません。`detail` は `calendar:change` と同じです。",
    ],
    [
      "calendar:change",
      "日を選んだ時に発火します。`single` の `detail` は `{ value, previousValue, reason }`、`range` は `{ start, end, previousStart, previousEnd, reason }` です。日付は `YYYY-MM-DD`、未定は空文字、`reason` は `pointer` か `keyboard` です。",
    ],
  ],
} satisfies ComponentDoc;
