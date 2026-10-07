import type { ComponentDoc } from "../reference";

export default {
  id: "data-list",
  name: "DataList",
  description: "主な情報・補足・状態を行ごとに並べて比較します。",
  api: ["DataList"],
  guidance: [
    "人・記事・資料などを一件ずつ、題名・補足・状態で見比べる時に使います。",
    "行の末尾に状態や操作を置けます。操作を持たない作業へのリンクを並べる時は `ActionList`、列ごとに値を比べる時は `Table` を使います。",
    "差出人・件名・時刻を並べる受信の一覧は `MessageList` を使います。",
  ],
  usage: [
    "`items` に一行ずつ `title` と、必要なら `description`・`meta` を渡します。`start` には `Avatar` や塗りつぶしの `Icon` を、`end` には `Badge`・`Button`・日付や件数を置きます。",
    "`href` を渡した行は題名がリンクになり、押せる範囲を行全体に広げます。ホバーすると行の背景が淡く色づき、押すと内側へへこみます。`end` の操作はリンクの上に重ねて押せます。`href` の無い行は押せない行として表示します。",
    "`current` の行は、今開いている行として淡い青の背景で示します。",
    "罫線を引かず、行間で区切ります。配置先の幅が28rem以上なら `end` を右の列に置き、狭ければ説明の下に並べます。長い題名やURLも省略せずに折り返します。",
    "JavaScriptは使いません。",
  ],
  accessibility: [
    "ルートは `ul`、各行は `li` です。一覧の名前は `aria-label` などで利用側が付けます。",
    '`current` の行のリンクには `aria-current="true"` を付けます。リンクの無い行では背景色だけで示すので、必要なら文言を添えます。',
    "行ごとのフォーカス先は題名のリンクです。`end` に置いた操作は、それぞれ別のフォーカス先になります。",
  ],
} satisfies ComponentDoc;
