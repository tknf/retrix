import type { ComponentDoc } from "../reference";

export default {
  id: "navigation",
  name: "Navigation",
  description: "同じ領域のページを切り替えます。",
  api: ["Navigation"],
  guidance: [
    "設定の項目や記事の分類など、同じ領域の中のページを縦に並べて切り替える時に使います。作業面の中に置き、画面の端に固定するサイドバーにはしません。",
    "アプリ全体の移動は`CommandMenu`、同じ場所でパネルを切り替える時は`Tabs`、一覧の絞り込みを切り替える時は`FilterBar`を使います。",
  ],
  usage: [
    "`label`と`items`を渡します。各項目は通常のリンクで、`current`の項目は太字と末尾側の青いチェックで示します。",
    "`count`は名前の後の小さなピルに出し、`0`も表示します。`icon`は名前の前の列に揃えて置きます。",
    "パネルは中身の高さに収め、隣の要素の高さまで引き伸ばしません。長い名前は折り返します。",
  ],
  accessibility: [
    "ルートは`label`を読み上げ名に持つ`nav`で、項目は通常のリンクです。アプリのメニューのrole（`menu`など）は付けません。",
    '`current`の項目に`aria-current="page"`を付けます。',
  ],
} satisfies ComponentDoc;
