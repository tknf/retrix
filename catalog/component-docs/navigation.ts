import type { ComponentDoc } from "../reference";

export default {
  id: "navigation",
  name: "Navigation",
  description: "同じ領域のページを切り替えます。",
  api: ["Navigation"],
  guidance: [
    "設定の項目や記事の分類など、同じ領域の中のページを縦に並べて切り替える時に使います。画面の端に固定するサイドバーにはしません。`AppShell`の`aside`の列か、作業面の中に置きます。",
    "アプリ全体の移動は`AppShell`のヘッダーの`navigation`、名前で探す移動は`CommandMenu`、同じ場所でパネルを切り替える時は`Tabs`、一覧の絞り込みを切り替える時は`FilterBar`を使います。",
  ],
  usage: [
    "`label`と`items`を渡します。各項目は通常のリンクで、背景のパネルを持たず、置いた場所の地（机の地やシート）の上に行を直接並べます。行の間に線は引きません。名前は12pxの濃い灰色（`#51504c`）、行の高さは28pxです。ホバーすると名前を黒くし、下線を引きます。",
    "`current`の項目は、行を角の無い淡い灰色の面（`#e6e3de`）で塗り、名前を黒い太字にして示します。",
    "`count`は名前のすぐ後ろに11pxの灰色の数字で出し（「連絡先 60」）、`0`も表示します。ピルにはしません。`icon`は名前の前の18pxの列に揃え、名前より淡い灰色（`#c5c5c5`）で置きます。",
    "一覧は中身の高さに収め、隣の要素の高さまで引き伸ばしません。長い名前は折り返します。",
  ],
  accessibility: [
    "ルートは`label`を読み上げ名に持つ`nav`で、項目は通常のリンクです。アプリのメニューのrole（`menu`など）は付けません。",
    '`current`の項目に`aria-current="page"`を付けます。',
  ],
} satisfies ComponentDoc;
