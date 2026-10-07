import type { ComponentDoc } from "../reference";

export default {
  id: "disclosure",
  name: "Disclosure",
  description: "補足の内容を、HTMLの標準の要素で開閉します。",
  api: ["Disclosure", "DisclosureGroup"],
  guidance: [
    "よくある質問、条件ごとの補足、普段は使わない設定のように、読む人が必要な時だけ開く内容に使います。",
    "同じ場所で表示を切り替える見出しの並びは `Tabs`、階層のある項目の一覧は `Tree` を使います。",
    "必ず読んでほしい注意や、送信に欠かせない入力は、閉じた中にしまわず画面に出します。",
  ],
  usage: [
    "標準の `details` と `summary` で開閉し、controllerの登録は要りません。`summary` が開閉の操作になる見出し、`description` がその下の補足、`children` が開いた時の本文です。`open` を渡すと開いた状態で出力します。",
    "見出しは本文より一段大きな太字で、灰色の開閉の矢印（1.5remの列）から0.5rem空けて置きます。補足は灰色の小さな文字です。見出し・補足・本文の書き始めを揃え、枠や縦線は引きません。入れ子は字下げで示します。見出しにホバーすると、矢印と見出しを青緑にし、見出しに下線を引きます。",
    "開く時は高さが伸びながら中身が現れ、閉じる時は縮みながら薄れます。矢印も同じ時間で回ります。動きを減らす設定では動きません。閉じても中の入力の値は保たれます。",
    "`DisclosureGroup` は項目を0.25remの間隔で縦に並べます。一つずつ開く時は、各 `Disclosure` に同じ `name` を渡します（標準の `details` の `name`）。",
  ],
  keyboard: [["Enter / Space（見出し）", "開閉を切り替えます。"]],
  accessibility: [
    "開閉の状態は、標準の `details` と `summary` のとおり読み上げます。矢印のアイコンは読み上げから外します。",
    '`DisclosureGroup` は `role="group"` で、`label` をまとまりの名前として読み上げます。',
  ],
  propNotes: {
    Disclosure: {
      children: "開いた時の本文。見出しの書き始めに揃えて置く。",
    },
    DisclosureGroup: {
      children: "並べる `Disclosure`。",
    },
  },
} satisfies ComponentDoc;
