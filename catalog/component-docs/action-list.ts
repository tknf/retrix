import type { ComponentDoc } from "../reference";

export default {
  id: "action-list",
  name: "ActionList",
  description: "作業へのリンクを、一覧や内容の見えるカードで示します。",
  api: ["ActionList"],
  guidance: [
    "別の画面へ移動して行う作業やツールへのリンクを、アイコンと名前で並べる時に使います。",
    "各行は一つのリンクです。行に状態やボタンなど別の操作が付く時は `DataList` を使います。",
    "アイコンと名前を縦に積んだ大きなショートカットや、その場で行う操作には `ActionTile` を使います。",
  ],
  usage: [
    "`items` にリンクごとの `title` と `href` を渡し、`description` と塗りつぶしの `Icon`（`icon`）を添えます。名前は、移動先で行う作業を動詞で書きます。",
    '`layout="list"` は淡い背景に行を積み、名前の書き始めから細い線で区切ります。`layout="grid"` は各リンクを角丸のタイルにし、13rem以上の幅で格子に並べます。',
    "`accent` はアイコンの丸の色で、`blue`・`green`・`amber`・`coral` で用途を見分けます。状態を示す色には使いません。未確認の連絡先のように対応が必要な行は `attention` にすると、`accent` より優先してアイコン・名前・説明を危険を示す色で表示します。",
    "`preview` に直近の数件などを渡すと、説明の下に中身の見本を置きます。行全体がリンクなので、見本の中にボタンやリンクを置きません。",
    "ホバーすると行が淡い面になり、押すと内側へへこみます。JavaScriptは使いません。",
  ],
  accessibility: [
    "ルートは `ul` で、各リンクは `li` の中の一つの `a` です。一覧の名前は `aria-label` などで利用側が付けます。",
    "`icon` に置く `Icon` は読み上げから外れます。名前だけで移動先が分かるように書きます。",
    "`attention` は色で示すので、対応が必要な理由を `description` に書きます。",
  ],
} satisfies ComponentDoc;
