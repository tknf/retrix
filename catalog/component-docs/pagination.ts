import type { ComponentDoc } from "../reference";

export default {
  id: "pagination",
  name: "Pagination",
  description: "分割された一覧のページを移動します。",
  api: ["Pagination"],
  guidance: [
    "検索結果や一覧を複数のページに分け、ページの間を移る時に使います。",
    "手順の段階を示す時は`Steps`、同じ領域のページを切り替える時は`Navigation`を使います。",
  ],
  usage: [
    "`items`に前後の送り・番号・省略記号を並べて渡します。どの番号を並べ、どこを「…」で省くか、各項目のURLは利用側が決めます。",
    "`href`を持つ項目は、Buttonと同じ枠と白い縦の塗りを持つ、角の小さな四角のリンクになります。ホバーすると塗りを少し濃くし、押すと内側へへこみます。`current`の項目はリンクにせず、オンのボタンと同じ青緑の塗りに白い太字で今のページを示します。`href`のない項目（最初のページの「前へ」など）は、押せない斜線の四角になります。`label`が「…」の項目は、省略記号として灰色の文字だけを出します。",
    "四角の高さと最小の幅は26px（`--rx-control-compact`）で、指で操作する画面では44pxにします。狭い場所では折り返します。",
  ],
  accessibility: [
    "ルートは`label`を読み上げ名に持つ`nav`です。",
    '今のページに`aria-current="page"`、押せない送りに`aria-disabled="true"`を付けます。',
  ],
} satisfies ComponentDoc;
