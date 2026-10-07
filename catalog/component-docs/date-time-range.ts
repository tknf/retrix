import type { ComponentDoc } from "../reference";

export default {
  id: "date-time-range",
  name: "DateTimeRange",
  description: "開始と終了の日時を並べて入力します。",
  api: ["DateTimeRange"],
  guidance: [
    "予定や予約のように、開始と終了の日付と時刻をまとめて決める時に使います。",
    "時刻の要らない単日・期間は `DatePicker`、日付か時刻の一つだけなら `Field` で包んだ `DateField`・`TimeField` を使います。",
  ],
  usage: [
    "`legend` と、送信する名前の接頭辞 `name` を渡します。`start`・`end` には初めの `date`（`YYYY-MM-DD`）と `time`（`HH:MM`）を渡します。開始と終了を淡い灰色の面の一つの枠に並べて灰色の矢印でつなぎ、それぞれ小さな名前の下に日付と時刻の欄を縦に並べます。欄は標準の日付・時刻入力（`DateField`・`TimeField`）です。",
    '送信する値：`name="event"` なら、各欄の値を `event[start_date]`・`event[start_time]`・`event[end_date]`・`event[end_time]` で送ります。終日のSwitchはオンの時だけ `event[all_day]` に `1` を送り、オフの時は送りません。',
    "`allDay` で終日のSwitchをオンにしておきます。終日の間は時刻の欄を隠しますが、欄に残っている値は送信されます。終日の時に時刻をどう扱うかはサーバー側で決めます。",
    "`timezone` を渡すと、枠の下に地球のアイコンとタイムゾーンを添えます。表示だけで、送信はしません。",
    "枠の幅が26rem未満の狭い場所では、開始と終了を縦に並べ、矢印を下に向けます。",
    "開始と終了の前後関係や、未入力の検証は行いません。利用側とサーバー側で検証します。各欄の変更は `DateField`・`TimeField` のcontrollerが発火する `date-field:change`・`time-field:change` で受け取れます。",
    "JavaScriptが無い時も、標準の日付・時刻入力とチェックボックスとして同じ名前で送信できます。",
  ],
  accessibility: [
    "枠は `fieldset` で、`legend` がまとまりの名前です。日付と時刻の欄は「開始の日付」「終了の時刻」のように、`startLabel`・`endLabel` を先頭に付けた名前を持ちます。",
    'つなぎの矢印は読み上げません。終日のSwitchは `role="switch"` のcheckboxです。',
  ],
  events: [
    [
      "date-field:beforechange",
      "日付の欄を利用者が変えた時、確定の前に発火します。取り消せます（取り消すと元の値に戻します）。detailは `{ value, previousValue, reason }` で、`reason` は `pointer` か `keyboard` です。",
    ],
    [
      "date-field:change",
      "日付の欄の変更を確定した後に発火します。detailは `date-field:beforechange` と同じです。",
    ],
    [
      "time-field:beforechange",
      "時刻の欄を利用者が変えた時、確定の前に発火します。取り消せます。detailは `{ value, previousValue, reason }` です。",
    ],
    [
      "time-field:change",
      "時刻の欄の変更を確定した後に発火します。detailは `time-field:beforechange` と同じです。",
    ],
  ],
  propNotes: {
    DateTimeRange: {
      id: "ルートの `fieldset` に付けるID。",
    },
  },
} satisfies ComponentDoc;
