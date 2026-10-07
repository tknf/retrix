import type { ComponentDoc } from "../reference";

export default {
  id: "tree",
  name: "Tree",
  description: "作業面の中で、階層を開閉して項目を選択します。",
  api: ["Tree"],
  guidance: [
    "作業面の中で、資料やフォルダの階層を開閉しながら一件を選ぶ時に使います。",
    "アプリ全体の移動は`AppShell`のヘッダー、名前で探す移動は`CommandMenu`、表の行に階層がある時は`Treegrid`を使います。",
  ],
  usage: [
    "`label`と`items`を渡し、`TreeController`を`tree`、`TreePresentationController`を`tree-presentation`として登録します。子を持つ項目には開閉のボタンが付きます。初めに選ぶ項目は`value`、初めに開く親は`expanded`で渡します。",
    "項目を押すか、注目している項目でEnterを押すと、その項目を選び、`tree:change`を発火して`detail.value`を渡します。選んだ項目に応じて何を表示するかは利用側が担います。`href`を持つ項目は名前がリンクになり、名前を押すか、注目してEnterを押すと、選択と同時にリンク先へ移ります（リンクの`click`が起きるので、利用側はリンクの操作として受け取れます）。",
    "行は12pxの文字で高さ約27px、角丸2pxの面で、ホバーすると淡い灰色にします。選んだ項目は黄色のハイライト、キーボードで注目している項目は淡い青緑で塗り、どちらも名前を黒い太字にします。`href`を持つ項目の名前は青緑のリンクの文字です。階層はガイド線を引かず、字下げだけで示します。",
    "無効な項目は選べず、開閉のボタンも押せません。空白だけの`value`と、全階層を通じて二つ目以降に現れた`value`の項目は、子ごと出しません。残る項目がない時は「項目はありません。」の状態文を出します。",
    "JavaScriptなしでは、開閉のボタンを隠してすべての階層を開いた状態で表示し、`href`の項目はリンクとして働きます。",
  ],
  keyboard: [
    ["↓ / ↑", "次・前の見えている項目に注目します。無効な項目は飛ばします。"],
    ["Home / End", "先頭・末尾の見えている項目に注目します。"],
    [
      "→",
      "閉じた親を開きます。開いた親では最初の子に注目します。右から左に書く時は←がこの役割です。",
    ],
    [
      "←",
      "開いた親を閉じます。それ以外では親の項目に注目します。右から左に書く時は→がこの役割です。",
    ],
    ["Enter", "注目している項目を選びます。`href`を持つ項目はリンク先へ移ります。"],
    ["文字", "名前がその文字で始まる、次の項目に注目します。続けて入力すると語で探します。"],
  ],
  accessibility: [
    '一覧は`role="tree"`で`label`を読み上げ名に持ち、Tabでフォーカスできます。項目は`treeitem`、子の並びは`group`です。',
    'Tabで止まるのは一覧だけです。中のリンクと開閉のボタンは、controllerが`tabindex="-1"`にしてTabの巡回から外します。JavaScriptなしでは、リンクはTabで止まります。',
    'フォーカスは一覧に置いたまま、注目している項目を`aria-activedescendant`で伝えます。選んだ項目は`aria-selected="true"`、親の開閉は`aria-expanded`で伝えます。',
    '開閉のボタンは「（名前）を開閉」という読み上げ名を持ちます。無効な項目は`aria-disabled="true"`です。',
    '項目がない時は、一覧の代わりに`role="status"`の状態文を出します。',
  ],
  events: [
    [
      "tree:beforechange",
      "項目を選ぶ直前に発火します。`detail`は`value`・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと選択を変えません。選び済みの項目を選び直した時は発火しません。",
    ],
    ["tree:change", "項目を選んだ後に発火します。`detail`は`tree:beforechange`と同じです。"],
    [
      "tree:beforetoggle",
      "親を開閉する直前に発火します。`detail`は`value`・`expanded`（開く時は`true`）・`previousExpanded`・`reason`です。取り消すと開閉しません。",
    ],
    ["tree:toggle", "親を開閉した後に発火します。`detail`は`tree:beforetoggle`と同じです。"],
  ],
} satisfies ComponentDoc;
