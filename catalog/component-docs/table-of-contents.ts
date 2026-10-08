import type { ComponentDoc } from "../reference";

export default {
  id: "table-of-contents",
  name: "TableOfContents",
  description: "長い資料の見出しへ移動し、現在の位置を示します。",
  api: ["TableOfContents"],
  guidance: [
    "規約や手順書などの長い資料で、本文の冒頭に番号付きの目次を置き、見出しへ移れるようにする時に使います。",
    "同じ領域のページを切り替える時は`Navigation`、同じ場所でパネルを切り替える時は`Tabs`を使います。",
  ],
  usage: [
    "`label`と`sections`を渡すと、番号付きの目次と、見出し・本文を続けて描画します。各節は`id`・`title`・`content`を持ち、`level: 3`で小見出しにして「1.1」のように一段下げます。前に章がない`level: 3`は、章として扱います。",
    "目次の見出しは、字間を空けた11pxの灰色の大文字（通常の太さ）です。項目は`Navigation`と同じ13pxの濃い灰色（二段目は12px）で、行の間隔は28px、番号は茶色の11pxの数字です。項目は`Navigation`と同じく背景のパネルを持たず、ホバーすると名前を黒くして下線を引き、今読んでいる項目は角の無い暖かい灰色の面（#e6e3de）と黒い太字で示します。本文の節の見出し（`h2`）は`Section`と同じ15pxの赤の通常の太さ、小見出し（`h3`）は本文の大きさ（13px）の黒い太字です。",
    "目次の項目は通常のページ内リンクなので、JavaScriptなしでも見出しへ移れます。",
    "`TableOfContentsController`を`table-of-contents`として登録すると、スクロールに合わせて今読んでいる節の項目を示します。画面の上端から`offset`（px）の位置を越えた最後の見出しを現在地にし、ページの末尾まで読むと最後の見出しを現在地にします。",
    "各`id`はページ内で一意にし、空白を含めません。controllerはidの重複や空白を見つけると、現在地を示しません。",
  ],
  accessibility: [
    "目次は`label`を読み上げ名に持つ`nav`で、番号は`aria-hidden`で読み上げません。",
    '現在地の項目に`aria-current="location"`を付けます。',
    "見出しは`level`に応じて`h2`・`h3`で出します。画面の見出し（`h1`）の下に置きます。",
  ],
} satisfies ComponentDoc;
