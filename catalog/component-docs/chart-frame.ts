import type { ComponentDoc } from "../reference";

export default {
  id: "chart-frame",
  name: "ChartFrame",
  description: "グラフと数値の表を並べて表示します。",
  api: ["ChartFrame"],
  guidance: [
    "利用側で描いたグラフに、要点・凡例・同じ値の表・出典を添えて見せる時に使います。",
    "一つの集計値を大きく見せる時は `Statistic`、数値そのものを並べて比べる時は `Table` を使います。",
  ],
  usage: [
    "`title` と、図の要点を一文で書いた `description` を渡します。`graphic` に利用側で描いた図、`table` に同じ値の `table` 要素を渡します。描画ライブラリや集計の処理は含みません。",
    "図は淡い背景の上に置きます。SVGは幅に合わせて縮め、はみ出す図は背景の領域の中でスクロールします。",
    "`table` は `tableLabel` の見出しで開く `Disclosure` に畳み、`Table` と同じ見た目で書きます。",
    "`legend` に系列の名前と色（`blue`・`green`・`amber`・`coral`）を渡すと、図の下に凡例を並べます。図の系列の色は利用側で凡例に合わせます。`source` は図の最後に「出典：」を付けて書きます。",
    '幅は `size="measure"` で36remまで、`size="wide"` で置き場所いっぱいに広げます。表の開閉は `details` で動くので、JavaScriptは要りません。',
  ],
  accessibility: [
    "ルートは `figure` で、`title` と `description` は `figcaption` になります。",
    '`graphic` は `aria-hidden="true"` で読み上げから外します。図の中の文字も読まれないので、値は必ず `table` で渡します。',
    "表の見出しのセルと `scope` は、利用側で `table` に書きます。",
    "凡例は「凡例」を名前に持つ一覧で、色のマークは読み上げず系列の名前を読みます。",
  ],
} satisfies ComponentDoc;
