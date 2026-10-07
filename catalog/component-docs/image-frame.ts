import type { ComponentDoc } from "../reference";

export default {
  id: "image-frame",
  name: "ImageFrame",
  description: "縦横比を保って画像を表示します。",
  api: ["ImageFrame"],
  guidance: [
    "ファイルの縮小や表紙など、比率をそろえて画像を並べる時に使います。",
    "画像を名前と状態のある一件として示す時は `FileItem`、切り抜く範囲を調整させる時は `ImageCropper`、人の写真は `Avatar` を使います。",
  ],
  usage: [
    "`src` と `alt` を渡します。`caption` に名前、`meta` に大きさや日付を渡すと、画像の下に中央そろえで書きます。名前はMediumの文字、`meta` は茶色の小さな文字です。",
    "`shape` で枠の比率を決めます。`portrait` は5:7、`square` は1:1で、どちらも幅8remまで、`landscape` は16:9で幅16remまで広がります。比率の枠は並べた時の位置をそろえるためだけに使い、色を持ちません。",
    '画像は写真の台紙のように、3pxの白い縁と灰色の輪郭で囲み、浅い影を付けます。`fit="contain"` は画像全体を枠の中央に置き、縁を画像そのものに沿わせます。`fit="cover"` は枠いっぱいに切り抜き、縁も枠に沿わせます。角丸は付けません。',
    "`src` が無い時は、罫線の輪郭を付けた淡い灰色の面に `missingLabel` を灰色の小さな文字で書いて、画像の場所を示します。",
    '画像は `loading="lazy"` で読み込みます。JavaScriptは使いません。',
  ],
  accessibility: [
    "ルートは `figure` で、`caption` と `meta` は `figcaption` になります。",
    '`alt` は画像の代替テキストです。画像が無い時は「`alt`：`missingLabel`」を `role="img"` の名前として読み上げます。',
  ],
} satisfies ComponentDoc;
