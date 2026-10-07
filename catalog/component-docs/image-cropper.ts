import type { ComponentDoc } from "../reference";

export default {
  id: "image-cropper",
  name: "ImageCropper",
  description: "画像の切り抜く範囲を、画像の上の操作と数値の両方で調整します。",
  api: ["ImageCropper"],
  guidance: [
    "表紙やアイコンなど、画像のどこを使うかを利用者に決めてもらう時に使います。",
    "画像を決まった比率で見せるだけなら `ImageFrame`、画像ファイルを選んで送るだけなら `FileInput` を使います。",
  ],
  usage: [
    "`label`・`alt`・`src` と、元画像の実寸 `imageWidth`・`imageHeight` を渡します。表示面を元画像と同じ縦横比にし、その上に切り抜く枠を重ねます。枠はドラッグで移動し、下端のハンドルで大きさを変えます。拡大率のスライダーと、「位置と大きさを細かく調整」の中の横・縦の位置、幅・高さのスライダーも同じ値に合わせて動きます。",
    "`value` の位置と大きさは表示面に対するパーセント（`x`・`y`・`width`・`height`）、`zoom` は1〜5の拡大率、`offsetX`・`offsetY` は拡大した画像のずれです。範囲外の値は端に丸めます。有限でない数、正の整数でない実寸を渡すと `RangeError` を投げます。",
    "`src` を渡さなければ画像なしの枠と `emptyLabel` を出し、controllerは付けません。`disabled` は枠とスライダーを全て止めます。",
    "送信する値は持ちません。枠を動かすと `image-cropper:change` を発火して新しい範囲を渡すので、利用側がこれを受けて隠し欄に入れるか、保存の処理へ渡します。detailの `sourceRect` は元画像の幅と高さを1とした範囲（左上が原点、書く向きによらない）で、そのまま切り抜きに使えます。切り抜いた画像の生成・保存は利用側で行います。",
    "`ImageCropperController` が接続するまで、ハンドルと調整の欄は出さず、初めの範囲で切り抜いた画像だけを見せます。JavaScriptが無い時は、この見本のままで範囲は変えられません。",
  ],
  keyboard: [
    ["←・→・↑・↓（枠）", "枠を1%ずつ動かします。右から左に読む時は左右が逆です。"],
    ["Shift＋矢印（枠）", "枠の幅・高さを1%ずつ変えます。"],
    ["矢印（ハンドル）", "枠の幅・高さを1%ずつ変えます。"],
    ["+・=・-（枠・ハンドル）", "拡大率を0.1ずつ上げ・下げます。"],
    ["Esc", "ドラッグ中の変更を取り消し、元の範囲に戻します。"],
    [
      "矢印・Home・End・PageUp・PageDown（スライダー）",
      "ブラウザの標準のスライダーの動きで、その値を変えます。",
    ],
  ],
  accessibility: [
    '全体は `role="group"` で、`label` の見出し（`h3`）を名前にします。',
    "枠は「選択範囲を移動」、ハンドルは「選択範囲の大きさを変更」の名前を持つボタンで、操作の仕方の文を `aria-describedby` に関連付け、`aria-controls` で対応するスライダーを指します。",
    "画像には `alt` を付けます。切り抜いた結果を画像だけで伝えないよう、スライダーの名前と値でも伝えます。",
  ],
  events: [
    [
      "image-cropper:beforechange",
      "範囲を変える前に出します。取り消せます（取り消すと元の範囲に戻します）。detailは `image-cropper:change` と同じです。",
    ],
    [
      "image-cropper:change",
      "範囲を変えた後に出します。detailは `{ value, previousValue, sourceRect, previousSourceRect, reason }` で、`value` は `ImageCropperValue`、`sourceRect` は元画像に対する `{ x, y, width, height }`（0〜1）、`reason` は `pointer` か `keyboard` です。",
    ],
  ],
  propNotes: {
    ImageCropper: {
      id: "ルートのID。中のスライダーと見出しのIDの頭にも使う。渡さなければ自動で作る。",
    },
  },
} satisfies ComponentDoc;
