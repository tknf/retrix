import type { ComponentDoc } from "../reference";

export default {
  id: "statistic",
  name: "Statistic",
  description: "集計値と単位をまとめて表示します。",
  api: ["Statistic"],
  guidance: [
    "売上や件数などの集計値を、何の値か・単位・集計の条件と一緒に大きく見せる時に使います。",
    "期限までの日数や残りを丸いマークで目立たせる時は `Countdown` を使います。",
    "値の推移や内訳を見せる時は `ChartFrame`、項目と現在値を並べる時は `ValueList` を使います。",
  ],
  usage: [
    "`label` に何の値か、`value` に値、`unit` に単位、`note` に集計の条件（期間・税込かどうかなど）を渡します。値はページ見出しと同じ大きさ（24〜28px）の黒い太字で書き、名前は灰色の小さな太字、単位は灰色、条件は茶色の小さな文字で添えます。",
    "`value` は文字列で受け取ります。数値の算出・桁区切り・符号の付け方と、増減が良いか悪いかの意味は利用側で決めます。数字は桁のそろう字形で書き、長い値は折り返します。",
    "複数の値を並べる時は、置く側のレイアウト（`rx-split` など）で並べます。JavaScriptは使いません。",
  ],
  accessibility: [
    "`dl` の `dt` に名前、`dd` に値と条件を置くので、名前と値を組にして読み上げます。",
    "単位は値と同じ `dd` の中に置くので、「128,400円」と続けて読みます。",
  ],
} satisfies ComponentDoc;
