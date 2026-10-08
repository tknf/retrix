import type { ComponentDoc } from "../reference";

export default {
  id: "tag-input",
  name: "TagInput",
  description: "入力した文字をタグとして追加・解除します。",
  api: ["TagInput"],
  guidance: [
    "キーワードや分類など、利用者が自由に書いた短い言葉を複数付ける時に使います。",
    "決まった選択肢から複数選ぶ時は `CheckboxGroup`、多めの候補から打って探して選ぶ時は `FilterMenu`、一つの言葉に候補を添える時は `Suggestion` を使います。付いたタグを見せるだけなら `Tag` を並べます。",
  ],
  usage: [
    "`label` と `name` を渡し、初めのタグを `values` に渡します。入力欄に言葉を打ってEnterを押すとタグになり、欄の下に解除ボタン付きの `Tag` として並びます。前後の空白は除きます。",
    "空の言葉、カンマを含む言葉、既にあるタグは追加せず、欄の下に赤い小さな文字（11px）で理由を出します。",
    "送信する値：タグを「, 」でつないだ一つの文字列（`案内, 公開` など）を `name` で送ります。JavaScriptが無い時も同じ形です。サーバー側でカンマで分け、前後の空白を除いて使います。",
    "`required` はタグが一つも無い時に送信を止めます。`disabled` は追加と解除を止め、値を送りません。`help`・`error` は `Field` と同じく欄の下に出して入力欄に関連付けます。フォームのリセットでは `values` の並びへ戻します。",
    "タグの追加・解除の時は、取り消せる `tag-input:beforeadd`・`tag-input:beforeremove` と、その後の `tag-input:add`・`tag-input:remove` を発火します。並びが変わると全てのタグを渡す `tag-field:change` を発火し、送信フィールドにも標準の `input`・`change` を発火します。保存は利用側で行います。",
    "外からタグを置き換える時は、`tag-field` のcontrollerの `replaceValues(values)` を呼びます。",
    "JavaScriptが無い時は、カンマ区切りの一行の入力欄として送信します。",
  ],
  keyboard: [
    ["Enter（入力欄）", "入力した文字をタグにします。日本語の変換中のEnterは横取りしません。"],
    ["←（入力欄の先頭）・Backspace（空の入力欄）", "最後のタグの解除ボタンへ移ります。"],
    [
      "←・→（タグ）",
      "隣のタグへ移ります。最後のタグから先へ進むと入力欄へ戻ります。右から左に読む時は逆です。",
    ],
    ["Home・End（タグ）", "最初のタグ・入力欄へ移ります。"],
    ["Delete・Backspace（タグ）", "そのタグを解除し、隣のタグへ移ります。"],
  ],
  accessibility: [
    "入力欄は `label` を名前にし、タグの一覧は「〜のタグ」の名前を持ちます。解除ボタンは「〜を解除」の名前を持ちます。",
    '追加できなかった理由は `role="status"` で知らせます。',
    "`required` でタグが無い時は、入力欄の検証のメッセージ「タグを追加してください。」で送信を止めます。",
  ],
  events: [
    [
      "tag-input:beforeadd",
      "Enterでタグを追加する前に発火します。取り消せます。detailは `{ value, reason }` で、`value` は入力した文字です。",
    ],
    ["tag-input:add", "タグを追加した時に発火します。detailは `tag-input:beforeadd` と同じです。"],
    [
      "tag-input:beforeremove",
      "タグを解除する前に発火します。取り消せます。detailは `{ value, chip, reason }` で、`chip` はそのタグの `li`、`reason` は `pointer` か `keyboard` です。",
    ],
    [
      "tag-input:remove",
      "タグを解除した時に発火します。detailは `tag-input:beforeremove` と同じです。",
    ],
    [
      "tag-field:change",
      "タグの並びが変わった後に発火します。detailは `{ values }` で、今のタグの配列です。",
    ],
  ],
} satisfies ComponentDoc;
