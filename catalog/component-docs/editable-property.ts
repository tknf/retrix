import type { ComponentDoc } from "../reference";

export default {
  id: "editable-property",
  name: "EditableProperty",
  description: "値をその場で編集し、確定と取り消しの操作をそろえます。",
  api: ["EditableProperty"],
  guidance: [
    "担当者・件名・メモのように、属性の一つだけを画面を移らずに書き換えさせる時に使います。",
    "複数の値をまとめて入力して送る時は `Field` で組んだフォーム、読むだけの属性は `ValueList` を使います。",
  ],
  usage: [
    "`id`・`label`・`name` を渡し、`value` に今の値を渡します。項目名は小さな太字、表示の値は下線も枠もない文字です。値のすぐ後ろに灰色の鉛筆を置き、値と鉛筆を囲む領域にホバーすると、押すと書き換えられることを示す黄色のハイライト（#ffffcc）の面を出します。鉛筆はホバーすると赤になります。値が空の時は `emptyLabel` を灰色で出します。",
    "鉛筆を押しても、値そのものを押しても書き始めます（文字を選んでいる時は書き始めません）。一行の値は全体を選び、そのまま打てば置き換わります。`multiline` の値は末尾から書き足せ、表示でも改行をそのまま出します。書いている間は同じ位置を、一行の入力欄と同じ白い欄（1px #dedede の枠）にし、フォーカスすると青い縁と外側の淡い青の輪を出します。表示と編集で文字の大きさ・一行目の高さ・書き始めは変わりません。",
    "確定（小さい主操作）と取消（文字だけの操作）は、一行・複数行とも欄の下に並べます。確定は `Control + Enter`・`⌘ + Enter`、取消は `Escape` でもでき、Enterだけでは確定しません。確定すると新しい値を表示へ移し、鉛筆の位置に緑のチェックの完了のマークを1.6秒出します（アニメーションはしません）。確定・取消の後はフォーカスを鉛筆に戻します。",
    "`required`・`maxLength` は欄の標準の検証として働き、確定の時に検証して、通らなければ書いたまま検証メッセージを出します。フォームの送信で検証に通らなかった時も、書いている状態に切り替えます。",
    "保存は `editable:commit` で受け取り、保存しない時は `editable:beforecommit` を取り消します。確定した値は欄に残るので、`form` に結び付けてフォームの値として送ることもできます。フォームのリセットでは最初の値に戻して表示に戻ります。保存・保存失敗の通知・値の検証ルールは利用側が持ちます。",
    "`EditableController` を `editable`、`EditablePropertyController` を `editable-property` として登録します。JavaScriptなしでは、確定・取消を隠した通常の入力欄として表示し、フォームで値を送れます。",
  ],
  keyboard: [
    ["Enter / Space（鉛筆）", "書き始めます。"],
    ["Control + Enter / ⌘ + Enter", "書いている値を確定します。"],
    ["Escape", "書いている値を捨て、書き始める前の値に戻します。"],
    ["Enter", "一行の欄では何もしません。複数行の欄では改行します。"],
  ],
  accessibility: [
    "欄は `aria-labelledby` で `label` を名前にします。鉛筆の読み上げ名は「〇〇を編集」で、`aria-controls` で欄を指し、`aria-expanded` で書いているかを示します。",
    '確定のボタンには `aria-keyshortcuts="Control+Enter Meta+Enter"` を付けます。',
    "値そのものはフォーカスを受けません。キーボードでは鉛筆から書き始めます。",
    "日本語入力の変換中のEnter・Escapeは、確定・取消に使いません。",
  ],
  events: [
    [
      "editable:beforeedit",
      "鉛筆か値そのものを押して書き始める前に発火します。取り消せます。detailは `{ value, previousValue, reason }` で、`reason` は `pointer`・`keyboard` です。",
    ],
    ["editable:edit", "書き始めた後に発火します。detailは `editable:beforeedit` と同じです。"],
    [
      "editable:beforecommit",
      "確定の前に、検証を通った時だけ発火します。取り消せます（書いている状態のまま残ります）。detailの `value` は新しい値、`previousValue` は書き始める前の値です。",
    ],
    [
      "editable:commit",
      "確定した後に発火します。detailは `editable:beforecommit` と同じで、ここで保存します。",
    ],
    [
      "editable:beforecancel",
      "取消の前に発火します。取り消せます。detailの `value` は戻す値、`previousValue` は書いていた値です。",
    ],
    [
      "editable:cancel",
      "取り消して元の値に戻した後に発火します。detailは `editable:beforecancel` と同じです。",
    ],
  ],
} satisfies ComponentDoc;
