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
    "`label`と`items`を渡します。各段階は`label`と`state`を持ちます。Highriseのインポートの手順と同じく、段階ごとに同じ幅の平らな面を2pxずつ空けて並べます。面に枠と角丸はありません。他の段階は灰色の面（#e9e8e8）に灰色の13pxの文字、`current`は淡い青灰色の面（#dfe7eb）に黒い太字の文字です。番号は名前と同じ色の数字で前に置き、`complete`は番号の代わりに緑のチェックにします。名前の下に「完了」「入力中」「未入力」を灰色の小さな文字（11px）で添えます。",
    "`href`を渡した段階は、名前がリンクになります。完了した段階へ戻れるようにする時などに渡します。未入力の段階へ移れるかは利用側で決めます。",
    "段階は幅に応じて横に並べ、一段階あたり10remに満たない時は折り返します。",
  ],
  accessibility: [
    '`label`を読み上げ名に持つ`ol`で、今の段階に`aria-current="step"`を付けます。',
    "番号とチェックは`aria-hidden`で読み上げず、状態は名前の下の文言で伝えます。",
  ],
} satisfies ComponentDoc;
