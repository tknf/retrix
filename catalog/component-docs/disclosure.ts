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
    "見出しは、HighriseやBasecamp 2の「続きを開くリンク」と同じく、青緑の12pxの通常の太さの文字に1pxの下線を引きます。前に見出しと同じ色の小さな開閉の矢印（0.875remの列）を0.25rem空けて置き、開くと矢印を下に向けます。ホバーすると矢印と見出しを赤にします。補足は灰色の小さな文字（11px）です。見出し・補足・本文の書き始めを揃え、枠や縦線は引きません。入れ子は字下げで示します。",
    "開閉はその場で切り替え、アニメーションはしません。閉じても中の入力の値は保たれます。",
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
