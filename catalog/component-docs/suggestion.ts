import type { ComponentDoc } from "../reference";

export default {
  id: "suggestion",
  name: "Suggestion",
  description: "自由に入力できる欄に、候補を表示します。",
  api: ["Suggestion"],
  guidance: [
    "記事の分類のように、よく使う値を候補で示しつつ、候補に無い値もそのまま入力させる時に使います。",
    "候補の中からだけ選ばせる時は、少なければ `Select`、多くて探す時は `Picker` を使います。",
    "打った文字で絞り込まず、候補の一覧を開いて選ぶだけでよい時は `Combobox` を使います。値を複数付ける時は `TagInput` を使います。",
  ],
  usage: [
    "`Field` と同じラベル・補足・エラーの付いた一行の入力に、候補の一覧を添えます。`id` を省略すると生成します。`name`・`value`・`required`・`placeholder` などの残りの属性は入力へ渡します。",
    "打つたびに、候補の文字列の中に入力を含むものへ絞り込みます。全角と半角、大文字と小文字は区別しません。一致する候補がある時だけ一覧を開き、一つも無い時は「一致する候補はありません。入力した内容をそのまま使えます。」と伝えます。日本語の変換中は絞り込まず、確定してから絞り込みます。",
    "欄を押すと今の入力で絞り込んだ一覧を開き、右の矢印を押すと絞り込まずに全ての候補を開閉します。候補を選ぶと、その文字列を欄の値にして一覧を閉じ、欄へフォーカスを戻します。候補に無い値も、打ったまま送信します。",
    "候補の一覧は欄の下に開く白いパネル（1px #bbbの枠・角丸5px・柔らかい影）で、`Picker`と同じ見た目です。候補の行は隙間なく並べ、ホバーした候補とキーボードで移った候補を、角の無い淡い青（`--rx-option-active`）の面に黒い文字で示します。",
    "`readonly`・`disabled` の間は一覧を開きません。フォームをリセットすると、絞り込みを解いて一覧を閉じます。",
    "`SuggestionController` を `suggestion` として登録します。候補を選ぶと `combobox:change` に加えて、欄で標準の `input`・`change` を発火するので、打った時と同じ受け取り方で値の変化を受け取れます。",
    "JavaScriptが無い時は、標準の `datalist` で候補を出し、右の矢印は出しません。",
  ],
  keyboard: [
    ["↓ / ↑", "一覧を開き、次・前の候補へ移ります。"],
    ["Home / End（一覧が開いている時）", "最初・最後の候補へ移ります。"],
    ["Enter（一覧が開いている時）", "移った候補を選びます。"],
    ["Escape（一覧が開いている時）", "一覧を閉じます。"],
  ],
  accessibility: [
    '欄は `role="combobox"` と `aria-autocomplete="list"` で、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。',
    "候補の一覧は「（`label`）の候補」、右の矢印は「（`label`）の候補を開閉」という読み上げ名にします。",
    '一致する候補が無い時の知らせは `role="status"` の領域で読み上げます。',
    "`help`・`error` は `Field` と同じく説明として関連付け、`error` がある時は欄を `aria-invalid` にします。",
  ],
  events: [
    [
      "combobox:beforechange",
      "候補を選ぶ前に出します。取り消せます。detailは `value`（選ぶ候補）・`previousValue`・`reason`（`pointer` か `keyboard`）です。",
    ],
    [
      "combobox:change",
      "候補を選んだ後に出します。detailは `combobox:beforechange` と同じです。続けて欄で標準の `input`・`change` を発火します。",
    ],
    [
      "combobox:open / combobox:close",
      "矢印キーで一覧を開いた時、Escapeで閉じた時に出します。detailは `reason`（`keyboard`）です。",
    ],
  ],
} satisfies ComponentDoc;
