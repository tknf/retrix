import type { ComponentDoc } from "../reference";

export default {
  id: "keycap",
  name: "Keycap",
  description: "キーボードのキーの表記をそろえて表示します。",
  api: ["Keycap"],
  guidance: [
    "文中や操作の横で、キーボードの操作を示す時に使います。ショートカットキーの表示には、どのコンポーネントでもこれを使います。",
    "`DropdownMenu`・`FilterMenu` の `shortcut`、`ActionTile`・`ActionDock` の `shortcut` は、中でこの表示の小さい形を使います。",
  ],
  usage: [
    "表記だけのコンポーネントです。`keys` の各キーを `kbd` にして並べます。各キーは控えめな `Button` と同じ作りの小さな四角で、平らな白に1px `#cccccc` の枠（角丸3px）を付け、下にぼかしの無い1px `#dddddd` の影を付けてキーの厚みを見せます。文字は11pxです。ショートカットの登録と実行は利用側が行います。",
    '`size="small"` はタイルの角やメニューの行の終わりに添える表示で、文字は同じ11pxのまま、行高とキーの間・内側の余白を詰めます。`inverse` は色で塗った面の上に置く時に使い、地を塗らず影も付けず、文字と同じ色の淡い枠にします。',
    "文字の基準線に揃えて文中に置き、幅が足りなければキーの間で折り返します。",
  ],
  accessibility: [
    "キーは `kbd` として並べます。「⌘」のような記号だけの表記は読み上げで伝わりにくいため、文中に読める名前を添えるか、`label` を渡します。`label` を渡すと、キーの表記を読み上げから外し、見えない文として `label` を置きます。外側の `span` は名前を持てない要素なので、`aria-label` を渡した時も `label` と同じ扱いにします。",
    '操作の横に添えた表記が操作の名前と重なる時は、`aria-hidden="true"` で読み上げから外します。',
  ],
} satisfies ComponentDoc;
