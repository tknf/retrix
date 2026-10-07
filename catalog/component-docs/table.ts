import type { ComponentDoc } from "../reference";

export default {
  id: "table",
  name: "Table",
  description: "数値・短い状態・長い文章を、列の役割に合わせて表示します。",
  api: ["Table", "TableSort", "TableSelection"],
  guidance: [
    "複数の項目を同じ列で見比べる時に使います。列の並べ替え、行の選択と一括操作、見出しの固定を足せます。",
    "一件ずつを題名と補足で読ませる一覧は `DataList`、一つの対象の属性は `ValueList` を使います。",
    "セルの間を矢印キーで移動させたい時は `Grid`、行に親子の階層がある時は `Treegrid` を使います。",
  ],
  usage: [
    '`children` に標準の `thead`・`tbody`・`tfoot` を書きます。`caption` は表の名前として自動で置きます。セルに `data-cell="numeric"` を付けると末尾側へそろえて等幅の数字にし、`data-cell="short"` は折り返さず、`data-cell="text"` は14em以上の幅で長文を折り返します。表が作業面より広い時は、囲みの中で横にスクロールします。',
    "`density` は既定の `compact` と、本文の行の上下を広げる `comfortable` から選びます。`stickyHeader` は囲みの高さを28remまでにし、縦にスクロールしても見出しの行を上に留めます。",
    '並べ替えは `sort="local" | "manual"` です。並べ替えられる列の見出しは `TableSort` で書きます。`TableSort` 自身が `th` を出力するので、別の `th` で囲まず `thead` の行に直接置きます。見出しを押すたびに昇順・降順・元の順を切り替え、並べている列の見出しを青くして矢印を出します。',
    "`local` は表示中の行をその場で並べ替えます。比べる値はセルの `data-sort-value`、無ければセルの文字です。数値や日付は `data-sort-value` で表示と分けて渡します（例：表示は「1,280」、値は `1280`）。空の値と `type` で読めない値は、昇順でも降順でも末尾に置きます。同じ値の行は元の順を保ちます。`manual` は行を動かさず、見出しの状態だけを切り替えて `table:sort` を発火するので、サーバー側で並べ替えた行に差し替えます。",
    "選択は `selectable` で有効にします。`TableSelection` はチェックボックスを出力し、`rowId` を渡すと行の選択、省略すると表の全ての行の選択になります。全選択は一部だけ選ばれている時に中間の状態を示し、使えない（`disabled`）行は全選択と範囲選択から外します。フォームで送る行の `TableSelection` には `name`・`value`（必要なら `form`）を渡します。フォームのリセットでは選択の表示も戻します。",
    "行を選ぶと、`ActionDock` と同じ操作バーが画面の下の中央に浮かんで現れます。先頭に「N件選択」、続けて `selectionActions` の一括操作を横一列に並べ（`ActionTile` は面を持たない平らなタイル、`Button` もそのまま同じ列に置きます）、入らない時は操作の列だけを横にスクロールします。操作バーの角の×（「選択を解除」）は全ての選択を外し、フォーカスを全選択のチェックボックスへ戻します。操作バーは画面の上に浮かぶだけで、表は動きません。閉じる間も件数と並びは変わりません。",
    "`state` は `ready`・`loading`・`empty`・`error` です。`ready` 以外では `thead` を保ったまま本文の行を隠し、状態の文（または `stateContent`）を出します。この間は並べ替えのボタンを押せず、選択も付けません。",
    "`sort` か `selectable` を使う時は、`TableController` を `table`、`TableSortController` を `table-sort`、`TableSelectController` を `table-select` として三つとも登録します。JavaScriptなしでは、並べ替えのボタンは押せないまま表示し、チェックボックスは通常のフォームの値として送れます。選択バーは浮かべずに表の下へ置き、件数と×を除いた `selectionActions` を常に出すので、行のチェックと同じformの送信ボタンを渡すと選んだ行を送れます。行のデータ・並べ替えの保存・一括操作の実行は利用側が持ちます。",
  ],
  keyboard: [
    [
      "Tab",
      "表の囲みへ移り、見出しのボタン・リンク・チェックボックスを順に移動します。行を選んでいる時は、表の後に選択バーの操作へ進みます。囲みにフォーカスがある時は矢印キーで表をスクロールできます。",
    ],
    [
      "Enter / Space（見出し）",
      "その列で並べ替えます。押すたびに昇順・降順・元の順を切り替えます。",
    ],
    ["Space（チェックボックス）", "行、または全ての行の選択を切り替えます。"],
    [
      "Shift + Space / Shift + クリック",
      "前に操作した行から、この行までをまとめて同じ選択の状態にします。",
    ],
  ],
  accessibility: [
    '表の囲みは `role="region"` で、`caption` を名前に持ち、Tabで止まってキーボードでスクロールできます。',
    '並べ替えている列の `th` には `aria-sort`（`ascending`・`descending`・`none`）を付けます。`local` で並べ替えると、「記事名を昇順に並べました。」のような文を読み上げ用の `role="status"` で知らせます。',
    "`TableSelection` の `label` はチェックボックスの `aria-label` になります。どの行か分かる名前（「〇〇を選択」）を付けてください。",
    '選択バーは `role="group"`（「選択した行の操作」）で、件数は `aria-live="polite"` で知らせます。選択バーはDOMでは表の後にあるので、行を選んだ後はTabで表の後の一括操作へ進めます。',
    '状態の文は `role="status"` で、`loading` では表に `aria-busy="true"` を付けます。',
  ],
  events: [
    [
      "table:beforesort",
      "並べ替える前に発火します。取り消せます（取り消すと見出しの状態も行も変えません）。detailは `{ column, direction, previousColumn, previousDirection, reason }` で、`direction` は `ascending`・`descending`・`none`、`reason` は `pointer`・`keyboard` です。",
    ],
    [
      "table:sort",
      "並べ替えた後に発火します。detailは `table:beforesort` と同じです。`manual` ではこのイベントを受けて行を差し替えます。",
    ],
    [
      "table-select:beforechange",
      "利用者の操作で選択が変わる前に、`table` 要素で発火します。取り消せます。detailは `{ selected, previousSelected, reason }` で、`selected` は選ばれる行の `rowId` の配列です。",
    ],
    [
      "table:selectionchange",
      '利用者の操作（チェックボックスと×）で選択が変わった後に発火します。detailは `{ ids, count, scope }` で、`ids` は選んでいる行の `rowId` を表の並びで、`count` はその数、`scope` は表示中の行だけを数えたことを示す `"rendered"` です。フォームのリセットでは発火しません。',
    ],
  ],
  propNotes: {
    Table: {
      children: "表の中身。`thead`・`tbody`・`tfoot` を書く。`caption` は自動で置くので書かない。",
    },
    TableSort: {
      children: "列の見出しの文字。並べ替えのボタンの中に置き、並べ替えを知らせる文にも使う。",
    },
  },
} satisfies ComponentDoc;
