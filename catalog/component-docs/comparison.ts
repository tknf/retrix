import type { ComponentDoc } from "../reference";

export default {
  id: "comparison",
  name: "Comparison",
  description: "変更前と変更後を並べて確認します。",
  api: ["Comparison"],
  guidance: [
    "設定や文面を変える前に、現在と変更後を並べて確かめさせる時に使います。",
    "今の値だけを見せる時は `ValueList`、変更の経緯を時系列で読ませる時は `Timeline` を使います。",
  ],
  usage: [
    "`label` と、`before`・`after` に変更前後の内容を渡します。中には `ValueList` や段落など任意の要素を置けます。`null` を渡した側は「未登録」と表示します。",
    "`changed` は値が変わるかどうかで、差分の判定は利用側が行います。`true` なら見出しに「変更あり」を添え、変更後を淡い青の背景にして間に矢印を置きます。`false` なら「変更なし」を添え、両方を灰色の背景にして間に等号を置きます。",
    "変わる時の現在の側は、中に置いたコンポーネントも含めて淡い文字色で表示します。",
    "配置先の幅が30rem以上なら左右に並べ、狭ければ現在→変更後の順に上下へ並べます。右から左に読むページでは矢印の向きを反転します。JavaScriptは使いません。",
  ],
  accessibility: [
    "ルートは `section` で `label` を名前にします。見出しは `h3`、前後の見出しは `h4` なので、ページの見出しの階層に合う場所に置きます。",
    "「変更あり」「変更なし」は見出しの一部として読み上げます。間の矢印と等号は装飾です。",
  ],
} satisfies ComponentDoc;
