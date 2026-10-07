import type { ComponentDoc } from "../reference";

export default {
  id: "treegrid",
  name: "Treegrid",
  description: "階層のある行を、列をそろえて表示します。",
  api: ["Treegrid"],
  guidance: [
    "フォルダと資料、章と節のように親子の階層を持つ行を、担当・状態などの列と並べて見比べる時に使います。",
    "列を持たない階層は `Tree`、階層のない行の一覧は `Table` を使います。",
  ],
  usage: [
    "`columns` の先頭は行の題名（`label`）の列で、2列目以降に各行の `cells` を順に入れます。`children` を渡した行には開閉ボタンを付け、子の行を一つ深い階層として12pxずつ字下げして続けます。見出しの灰色の帯・行・罫線は `Table` と同じ見た目で、行の題名はMediumの太さです。`value` は全ての階層で一意にします。空の `value` と、重複した `value` の行は、その子孫ごと描きません。",
    "`expanded` に最初に開いておく行、`selection` に選択の方式、`selected` に最初に選んでおく行を、それぞれ `value` で渡します。開閉と選択はその後controllerが持つので、保存したい時はイベントで受け取ります。開閉ボタンを押すと行を開閉し、`selection` が `none` 以外の時はセルを押すと行を選びます。選んだ行は `Table` と同じ黄色で塗ります。",
    "`href` は子を持たない行だけでリンクになります。`disabled` の行はリンクにせず、題名の文字だけを灰色にし、押してもShift + Spaceでも選べません。キーでの移動には残ります。",
    "`state` は `ready`・`loading`・`empty`・`error` です。`items` が0件なら `ready` でも `empty` として扱います。`ready` 以外では見出しの行だけを残して状態の文（または `stateContent`）を出し、controllerを付けません。",
    "`TreegridController` を `treegrid` として登録します。JavaScriptなしでは、全ての行を開いた状態で表示し、動かない開閉ボタンは隠します。選択もできません。行のデータ・開閉と選択の保存は利用側が持ちます。",
  ],
  keyboard: [
    ["↑ / ↓", "表示中の上下の行の、同じ列のセルへ移動します。"],
    ["← / →", "前後の列のセルへ移動します。右から左に読む時は向きが入れ替わります。"],
    ["Home / End", "行の最初・最後のセルへ移動します。"],
    ["Ctrl + Home / Ctrl + End", "表の最初・最後のセルへ移動します。"],
    ["PageUp / PageDown", "`pageSize` の行数だけ上下へ移動します。"],
    ["Enter", "子を持つ行の先頭のセルで、行を開閉します。"],
    [
      "Shift + Space",
      "`selection` が `single`・`multiple` の時に、行を選びます。`multiple` では選択を切り替えます。`disabled` の行は選べません。",
    ],
  ],
  accessibility: [
    'ready の時は表に `role="treegrid"` と `caption` と同じ `aria-label` を付けます。行には `aria-level`・`aria-posinset`・`aria-setsize`、子を持つ行には `aria-expanded` を付けます。',
    '`selection="multiple"` では表に `aria-multiselectable="true"` を付け、各行に `aria-selected` を付けます。`single` では選んだ行だけに `aria-selected="true"` を付けます。',
    "セルのTab停止点は表の中で一つだけで、最後にいたセルに戻ります。行の題名のリンクは別にTabで止まります。開閉ボタンはTabで止まらず、読み上げ名は「〇〇を開閉」です。",
    "セルの中のリンクやボタンを押しても行は選ばれません。",
    '状態の文は `role="status"` で、`loading` では表に `aria-busy="true"` を付けます。',
  ],
  events: [
    [
      "treegrid:beforetoggle",
      "行を開閉する前に発火します。取り消せます。detailは `{ value, expanded, reason }` で、`expanded` は開くなら `true`、`reason` は `pointer`・`keyboard` です。",
    ],
    [
      "treegrid:toggle",
      "行を開閉した後に発火します。detailは `treegrid:beforetoggle` と同じです。",
    ],
    [
      "treegrid:beforechange",
      "選択が変わる前に発火します。取り消せます。detailは `{ selected, previousSelected, reason }` で、`selected` は選ばれる行の `value` の配列です。`disabled` の行を押した時は発火しません。",
    ],
    [
      "treegrid:change",
      "選択が変わった後に発火します。detailは `treegrid:beforechange` と同じです。",
    ],
  ],
} satisfies ComponentDoc;
