import type { ComponentDoc } from "../reference";

export default {
  id: "layer-card",
  name: "LayerCard",
  description: "上端の見出しの帯と、その下の中身を一つのカードにまとめます。",
  api: ["LayerCard"],
  guidance: [
    "一覧や属性のまとまりに見出しを付ける時に使います。見出しを帯に分けるので、題名と中身を見分けやすくなります。",
    "一件の物として題名・本文・補足を見せる時は `Card`、作業面の中を区切るだけの時は `Section` を使います。",
    "`DataList`・`ActionList`・`ValueList` を一つだけ載せる置き場所に向いています。コードを見せる時は、この形を内側で使う `CodeBlock` を使います。",
  ],
  usage: [
    "カードは1pxの輪郭と浅い影を持つ白いカードです。`title` はカードの上端の帯に、黒い小さな太字の `h3` で置きます。帯は白から淡い灰色へのごく淡い縦の塗りで、中身との間に罫線を一本引きます。`children` は帯の下の白い面に入れます。`actions` には `ActionLink` や `Button` を渡し、見出しの行の末尾側に置きます。",
    "題名が折り返しても操作は一行目に残り、題名の幅が8remを割る時（狭いカードや大きな文字）だけ操作を次の行へ送ります。操作の有無でカードの位置は変わりません。幅が24rem未満のカードでは、中身の左右の余白と題名の書き始めを一緒に詰めます。",
    'カードの端に接する行の `DataList`・`ActionList` は、始まりと終わりの罫線をカードの端に任せ、カードの上下の余白も狭めます。一覧だけを載せた時は行の題名を帯の見出しと同じ書き始めにそろえます。コードを載せる時は `CodeBlock` を使います（`CodeBlock` は内側でLayerCardを使い、カードの余白とスクロールをコードの面に任せます）。タイルに並べた `ActionList`（`layout="grid"`）は対象外です。',
    "controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。",
  ],
  accessibility: [
    "ルートは `section`、題名は `h3` です。`section` は名前を持たないので、ランドマークとして扱わせたい時は、利用側で `aria-label` を渡してください。",
    "中身に一覧を載せる時は、一覧自身にも名前（`aria-label` など）を付けてください。",
  ],
  propNotes: {
    LayerCard: {
      children: "カードに載せる中身。一覧・属性・段落など任意の内容を渡せる。",
    },
  },
} satisfies ComponentDoc;
