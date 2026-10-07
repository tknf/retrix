import type { ComponentDoc } from "../reference";

export default {
  id: "color-picker",
  name: "ColorPicker",
  description: "色相・彩度・明度・不透明度を、見本を確認しながら選びます。",
  api: ["ColorPicker"],
  guidance: [
    "分類のラベルやマーカーなど、利用者が自由に色を決める時に使います。",
    "決まった数色から選ぶだけなら、色の名前を並べた `Choice` や `Select` を使います。",
  ],
  usage: [
    "`label` と送信する名前の接頭辞 `name`、初めの色 `value`（`colorSpace`・`hue`・`saturation`・`brightness`・`alpha`）を渡します。彩度と明度を決める色の面と選んでいる色の見本、色相・彩度・明度・不透明度の四本のスライダーを縦に並べます。欄の幅が38rem以上では色の面とスライダーを左右に並べます。色の面とスライダーは同じ値に合わせて動きます。",
    '送信する値：`name="brandColor"` なら、`brandColor[hue]`（0〜360）・`brandColor[saturation]`（0〜100）・`brandColor[brightness]`（0〜100）・`brandColor[alpha]`（0〜1）と、`brandColor[colorSpace]`（`srgb` か `display-p3`）を送ります。色空間は画面からは変えられず、`value` のまま送ります。',
    "`help` と `error` は欄の下に出し、まとまりに関連付けます。`error` は表示するだけで、色の検証（背景とのコントラストなど）は利用側で行います。`disabled` は全ての操作を止め、値を送りません。",
    "値を変更すると、取り消せる `color-picker:beforechange` と、確定した後の `color-picker:change` を発火します。detailの `color` は `color(srgb r g b / a)`（広色域では `color(display-p3 …)`）の形のCSSの色で、そのまま表示に使えます。",
    "JavaScriptが無い時は色の面を隠し、四本の標準のスライダーで値を決めて送れます。見本は初めの色のまま動きません。",
  ],
  keyboard: [
    ["←・→（色の面）", "彩度を `step` ずつ下げ・上げます。右から左に読む時は逆です。"],
    ["↑・↓（色の面）", "明度を `step` ずつ上げ・下げます。"],
    ["Shift＋矢印（色の面）", "`step` の10倍ずつ動かします。"],
    [
      "矢印・Home・End・PageUp・PageDown（スライダー）",
      "ブラウザの標準のスライダーの動きで、その値を変えます。",
    ],
    ["Esc", "操作中の変更を取り消し、操作を始める前の色に戻します。"],
  ],
  accessibility: [
    "まとまりは `fieldset` で、`label` を名前にします。色の面は「〜の彩度と明度」の名前を持ち、操作の仕方の説明を読み上げ用に関連付け、`aria-controls` で彩度と明度のスライダーを指します。",
    "色は見本の色だけに頼らず、四本のスライダーの名前と値でも伝えます。",
    "`error` を渡すと、まとまりに `aria-invalid` を付け、誤りの文を `aria-describedby` に加えます。",
  ],
  events: [
    [
      "color-picker:beforechange",
      "色を変える前に発火します。取り消せます。detailは `{ value, previousValue, color, reason, source }` で、`reason` は `pointer` か `keyboard`、`source` は操作した箇所（`area`・`hue`・`saturation`・`brightness`・`alpha`）です。",
    ],
    [
      "color-picker:change",
      "色を変えた後に発火します。detailは `color-picker:beforechange` と同じです。",
    ],
  ],
} satisfies ComponentDoc;
