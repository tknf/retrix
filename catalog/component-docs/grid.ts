import type { ComponentDoc } from "../reference";

export default {
  id: "grid",
  name: "Grid",
  description: "行と列の見出しを見ながら、縦横に並んだセルを確認・選択する表です。",
  api: ["Grid"],
  guidance: [
    "日と時間の空き枠のように、行と列の交わりで意味が決まる表を、矢印キーでセルごとに読ませる時に使います。",
    "列ごとに見比べる一覧で、並べ替えや行の選択が要る時は `Table`、行に親子の階層がある時は `Treegrid` を使います。",
    "月の日付から選ばせる時は `Calendar` を使います。",
  ],
  usage: [
    "`caption`・`rowHeader`・`columns`・`rows` を渡します。先頭の列は行の見出し（`rows[].label`）で、`rowHeader` はその列の見出しです。各行の `cells` は `columns` と同じ数、同じ順に渡します。`caption` か `rowHeader` が空の時、`columns` が0列の時、`pageSize` が1以上の整数でない時、`cells` の数が合わない時は、描く時にエラーにします。",
    "`columns` の `current` は今日の列として、見出しを蛍光ペンの黄のピルで囲みます。`cells` の `disabled` は埋まっている・使えない枠として斜線で示します。表が作業面より広い時は横にスクロールし、行の見出しは先頭側に留めます。",
    "`GridController` を `grid` として登録すると、見出しを含む全てのセルを矢印・Home・End・PageUp・PageDownで移動できます。表の中でTabが止まるのは一か所だけで、最後にいたセルに戻ります。`rows` が0件の時はcontrollerを付けず、表の下に `empty` を出します。",
    "Gridはセルの間の移動だけを持ち、値の選択・予約・更新とそのイベントは持ちません。選んだ枠を使う操作は表の外に置き、どの枠を選んだかの管理とデータの保存は利用側が持ちます。JavaScriptなしでは、見出し付きの通常の表として読めます。",
  ],
  keyboard: [
    ["↑ / ↓", "上下のセルへ移動します。"],
    ["← / →", "前後の列のセルへ移動します。右から左に読む時は向きが入れ替わります。"],
    ["Home / End", "行の最初・最後のセルへ移動します。"],
    ["Ctrl + Home / Ctrl + End", "表の最初・最後のセルへ移動します。"],
    ["PageUp / PageDown", "`pageSize` の行数だけ上下へ移動します。"],
  ],
  accessibility: [
    '行があるときは表に `role="grid"` を付け、`caption` を名前にします。列の見出しは `th scope="col"`、行の見出しは `th scope="row"` です。',
    '今日の列の見出しには `aria-current="date"`、使えないセルには `aria-disabled="true"` を付けます。使えないセルにもキーで移動でき、読み上げで使えないことが伝わります。',
    "セルがフォーカスを受けるので、セルの中にボタンやリンクを置くと、Tabで止まる位置がもう一つ増えます。操作は表の外に置いてください。",
    '0件の表示は `role="status"` で知らせます。',
  ],
} satisfies ComponentDoc;
