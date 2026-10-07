import type { ComponentDoc } from "../reference";

export default {
  id: "steps",
  name: "Steps",
  description: "手順と現在の段階を示します。",
  api: ["Steps"],
  guidance: [
    "申し込みや公開の準備など、いくつかの段階に分かれた作業で、全体の手順と今の段階を示す時に使います。",
    "時系列の出来事は`Timeline`、一覧のページ送りは`Pagination`を使います。",
  ],
  usage: [
    "`label`と`items`を渡します。各段階は`label`と`state`を持ちます。番号は、控えめな`Button`と同じ1pxの灰色の枠と角丸5pxを持つ、白い22pxの四角に灰色の数字で書きます。`complete`は四角の中に緑のチェック、`current`は青緑の塗りに白い数字と黒い太字の名前、`upcoming`は塗りのない破線の枠で示し、名前の下に「完了」「入力中」「未入力」を茶色の小さな文字で添えます。",
    "`href`を渡した段階は、名前がリンクになります。完了した段階へ戻れるようにする時などに渡します。未入力の段階へ移れるかは利用側で決めます。",
    "段階は幅に応じて横に並べ、一段階あたり10remに満たない時は折り返します。",
  ],
  accessibility: [
    '`label`を読み上げ名に持つ`ol`で、今の段階に`aria-current="step"`を付けます。',
    "番号の四角は`aria-hidden`で読み上げず、状態は名前の下の文言で伝えます。",
  ],
} satisfies ComponentDoc;
