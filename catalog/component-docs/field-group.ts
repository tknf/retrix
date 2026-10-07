import type { ComponentDoc } from "../reference";

export default {
  id: "field-group",
  name: "FieldGroup",
  description: "見出し・説明・入力欄を、ひとまとまりのフォームとして配置します。",
  api: ["FieldGroup"],
  guidance: [
    "長いフォームを「連絡先」「配送先」のような意味のまとまりに分け、まとまりごとに見出しと説明を添える時に使います。",
    "一つの入力のラベルと補足は `Field`、チェックボックスやラジオボタンのグループは `CheckboxGroup` か `fieldset.rx-choice-group` を使います。",
    "公開範囲や通知のように、名前ごとに一つの操作が付く設定を並べる時は `SettingList` を使います。",
  ],
  usage: [
    "`children` に `Field` などの入力を並べます。入力の間の余白と、見出し・説明・入力の配置は `FieldGroup` が持ちます。見出しは本文の大きさ（13px）の黒い太字で、見出しから線は伸ばしません。説明は灰色の12pxの文字です。",
    "置き場所の幅が40rem以上で `description` がある時は、説明を先頭側の列に、入力を末尾側の広い列に並べます。狭い時は説明の下に入力を縦に積みます。`description` が無い時は入力に全幅を使います。",
    "ルートは標準の `fieldset` です。`disabled` を渡すと中の入力をまとめて使えなくし、その間は中の入力を送信しません。controllerの登録は要りません。",
  ],
  accessibility: [
    "`legend` をまとまりの名前として、中の入力に移った時に読み上げます。見出しの文言は短く、まとまりの内容を表す名前にします。",
  ],
  propNotes: {
    FieldGroup: {
      children: "まとまりに並べる入力。`Field` で包んだ入力などを渡します。",
    },
  },
} satisfies ComponentDoc;
