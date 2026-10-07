import type { ComponentDoc } from "../reference";

export default {
  id: "file-item",
  name: "FileItem",
  description: "既存のファイルの名前と状態を示します。",
  api: ["FileItem"],
  guidance: [
    "添付済み・送信待ち・送信に失敗したファイルを、一件ずつ名前と状態で示す時に使います。",
    "ファイルを選ぶ・ドロップする欄は `FileInput` を使います。画像そのものを見せる時は `ImageFrame` を使います。",
  ],
  usage: [
    "`name` と `description`（形式・大きさ・日付など）を渡します。`href` を渡すと名前がリンクになります。長い名前も省略せずに折り返します。",
    "`preview` に画像やPDFの1ページ目の縮小を渡すと、ファイルのアイコンの代わりに中身を見せます。縮小は角丸なしの淡い縁で囲み、40pxの正方形に切り抜きます。",
    "`state` は `ready`・`pending`・`error` です。`pending` はアイコンを控えめな色にして縮小を薄くし、説明の前に「待機中 · 」を付けます。`error` はアイコンを危険の色にし、説明の前に「送信失敗 · 」を付けます。`error` の時は `description` に直し方を書きます。",
    "`actions` に確認や再送信の操作を渡します。置き場所の幅が26rem以上なら右端に、狭ければ名前の下に置きます。送信・再送・削除の処理は利用側が持ちます。",
    "JavaScriptは使いません。",
  ],
  accessibility: [
    "「待機中」「送信失敗」は説明の一部として読み上げるので、状態は色だけでなく文言でも伝わります。",
    "ファイルのアイコンは読み上げから外れます。`preview` に画像を渡す時は、`alt` や `aria-label` を利用側で付けます。",
  ],
} satisfies ComponentDoc;
