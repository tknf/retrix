import type { ComponentDoc } from "../reference";

export default {
  id: "field",
  name: "Field",
  description: "ラベル・入力欄・補足・エラーを関連付けます。",
  api: [
    "Field",
    "Input",
    "Textarea",
    "Select",
    "Choice",
    "PasswordField",
    "CountedTextarea",
    "Combobox",
    "CheckboxGroup",
    "NumberField",
    "DateField",
    "TimeField",
  ],
  guidance: [
    "ラベルの付いた一つの入力を置く時は、入力を `Field` で包みます。ラベル・補足・エラーの位置と読み上げの関連付けを `Field` が持ちます。",
    "一行の文字は `Input`、改行を含む長い文は `Textarea`、上限のある文は `CountedTextarea`、パスワードは `PasswordField` を使います。",
    '決まった少数の選択肢から一つを選ぶ時は、全て見せてよければ `Choice` の `type="radio"`、場所を取りたくなければ `Select` を使います。',
    "選択肢が多く探して選ぶ時は `Picker`、自由入力に候補を添える時は `Suggestion` を使います。打った文字で絞り込まず、候補の一覧を開いて選ぶだけでよい時は `Combobox` を使います。",
    "一つのオン・オフは `Choice`（同意などの確認）か `Switch`（設定のオン・オフ）、複数を選ぶ時は `CheckboxGroup` を使います。全て選択が要らない短いグループは `Choice` を `fieldset.rx-choice-group` に並べます。",
    "数は `NumberField`、日付は `DateField`、時刻は `TimeField` を使います。単位や接頭辞を添える時は `InputGroup`、カレンダーから日付や期間を選ぶ時は `DatePicker`、開始と終了の日時は `DateTimeRange` を使います。",
    "連続する数値をおおよそで決める時は `Range`、3〜8個の決まった値から選ぶ時は `Dial` を使います。",
  ],
  usage: [
    "`Field` の `children` は関数です。受け取った属性（`id`・`aria-describedby`・`aria-invalid`・`data-invalid`）を入力の要素へ展開します。`PasswordField`・`CountedTextarea`・`Combobox`・`NumberField`・`DateField`・`TimeField` へ展開すると、中の入力に付きます。`id` は画面内で一意にします。",
    "ラベルは12pxの太字で入力の上に置きます。`help` は入力の下の灰色の小さな補足（11px）、`error` は直す所を書くエラー文です。`error` を渡すと入力の枠を赤にし、欄のすぐ下にアイコンと赤い12pxの文でエラーを出して、`aria-invalid` を付けます。現在値を補足へ置かず、入力の値として見せます。`status` はラベルの行の終わりに保存の状態などを並べます。",
    '`Input`・`Textarea`・`Select` は標準の要素に `rx-input` を付けたもので、属性をそのまま渡します。一行の `Input` は白い面に1px #dedede の枠、角丸2px、内側の影なしで、高さ24px・12pxの黒い文字です（`data-size="large"` は14pxの文字で高さ32px）。`Textarea` は1px #c1c1c1 の枠と角丸5pxで、本文と同じ13pxの文字です。一つを選ぶ `Select` は、OSの標準のポップアップボタンのまま表示します。フォーカスすると枠を青にし、外側に淡い青の輪を広げます。`readonly` は面を淡い灰色にして値を読めるままにし、`disabled` は形と面をそのままにして文字だけを灰色にします。`Choice` は `label` で包んだチェックボックスかラジオボタンで、どちらもOSの標準の部品のまま13pxの大きさで置きます。`kind="option"` は説明を伴う選択肢を1px #ececec の枠で囲んだ白い面（角丸3px）に載せ、ホバーすると枠を濃くし、選ぶと面を淡い青緑、枠を青緑にします。`Choice` のグループは `fieldset.rx-choice-group` の `div.list` に並べ、`legend` で名前を付けます。',
    "`PasswordField` は右端の灰色の目のアイコン（ホバーすると淡い青の面に青緑）で、入力を伏せ字と文字の表示で切り替えます。フォームを送信した時とリセットした時は伏せ字に戻します。`PasswordFieldController` を `password-field` として登録します。",
    "`CountedTextarea` は入力の下の末尾側に、灰色の小さな文字で「12 / 40 文字」の形の文字数を出します。文字数はcontrollerが接続してから出します。`limit` を超えても入力は止めず、`overflowMessage` を出して入力を無効な状態にし、フォームの送信を止めます。数えるのはUTF-16の単位の長さです。`CharacterCountController` を `character-count` として登録します。",
    '`Combobox` は自由に入力できる欄に、候補の一覧を添えます。欄か右の矢印を押すと一覧が開き、候補を選ぶと値が欄に入って一覧を閉じます。一覧は白いパネル（1px #bbb の枠、角丸5px、外への柔らかい影）で、ホバーした候補とキーボードで移った候補を角の無い淡い青（#ddeefe）に黒い文字にし、選んだ候補は太字にします。打った文字では絞り込みません。`readonly`・`disabled` の間は一覧を開きません。`ComboboxController` を `combobox` として登録します。候補を選ぶと `combobox:change` を出し、欄でも打って変えた時と同じく標準の `input`・`change` を発火します。開閉の矢印と `role="combobox"` はcontrollerが接続してから付けます。',
    "`CheckboxGroup` は先頭に全て選択のチェックボックスを置き、全て選ぶとオン、一部だけの時は中間の状態にします。全て選択は `disabled` の選択肢を切り替えません。選んだ値は `name` で一つずつ送信し、全て選択のチェックボックスは送信しません。`value` が空白だけの選択肢と、重なった値の二つ目以降は出しません。`CheckboxGroupController` を `checkbox-group` として登録します。",
    "`NumberField`・`DateField`・`TimeField` は標準の `number`・`date`・`time` の入力で、`min`・`max`・`step` をそのまま使います。値が `min`・`max` と等しいとルートの `data-state` を `min`・`max` にし、それ以外は `between` にします。`NumberField` は PageUp・PageDown で `pageStep` 倍のstepだけ動かします。この変更も、矢印キーや打って変えた時と同じく標準の `input`・`change` を発火し、`number-field:change` を出します。それぞれ `NumberFieldController` を `number-field`、`DateFieldController` を `date-field`、`TimeFieldController` を `time-field` として登録します。",
    "入力のCSSは `components/field.css` にあります。`Field` の外で入力だけを使う場合も読み込みます。",
    "controllerを登録しない時、またはJavaScriptが無い時は、標準の入力として動きます。`PasswordField` は切り替えのボタンを出さず、`CountedTextarea` は文字数を出さず上限でも送信を止めません。`Combobox` は開閉の矢印の無い一行の入力、`CheckboxGroup` の全て選択は押しても他を切り替えません。入力の検証は送信先でも行います。",
  ],
  keyboard: [
    [
      "Space（`Choice`・`CheckboxGroup`）",
      "標準の操作でオン・オフを切り替えます。ラジオボタンのグループは矢印キーで選び直します。",
    ],
    ["Enter / Space（`PasswordField` の切り替えの操作）", "伏せ字と文字の表示を切り替えます。"],
    ["↓ / ↑（`Combobox`）", "一覧を開き、次・前の候補へ移ります。"],
    ["Home / End（`Combobox` の一覧が開いている時）", "最初・最後の候補へ移ります。"],
    ["Enter（`Combobox` の一覧が開いている時）", "移った候補を選びます。"],
    ["Escape（`Combobox` の一覧が開いている時）", "一覧を閉じます。"],
    [
      "PageUp / PageDown（`NumberField`）",
      "`pageStep` 倍のstepだけ増減します。`min`・`max` を超えません。",
    ],
    ["↑ / ↓（`NumberField`・`DateField`・`TimeField`）", "標準の操作で値を増減します。"],
  ],
  accessibility: [
    'ラベルは `for` で入力と結び、`help`・`error`・`describedBy` のidを `aria-describedby` に並べます。`error` がある時は `aria-invalid="true"` を付けます。',
    "エラーは色だけでなく、アイコンと文で示します。何をどう直すかを文で書きます。",
    "`PasswordField` の切り替えの操作は `aria-controls` で入力を指し、状態に合わせて `showLabel`・`hideLabel` を読み上げ名にします。マウスで切り替えた後は入力へフォーカスと選択範囲を戻します。",
    "`CountedTextarea` は文字数を入力の説明として関連付け、超えた時はエラー文も関連付けます。",
    '`Combobox` の欄はcontrollerが接続すると `role="combobox"` になり、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。JavaScriptが無い時は標準の一行の入力として読み上げます。`toggleLabel`・`listLabel` には何の候補かを含めます。',
    "`CheckboxGroup` は `fieldset` と `legend` でグループの名前を伝えます。一部だけ選んだ時の全て選択は中間の状態として読み上げます。",
  ],
  events: [
    [
      "password-field:beforetoggle",
      "表示を切り替える前に出します。取り消せます。detailは `visible`（切り替え後に見せるか）・`previousVisible`・`reason`（`pointer` か `keyboard`）です。",
    ],
    [
      "password-field:toggle",
      "表示を切り替えた後に出します。detailは `password-field:beforetoggle` と同じです。",
    ],
    [
      "combobox:beforechange",
      "`Combobox` で候補を選ぶ前に出します。取り消せます。detailは `value`・`previousValue`・`reason` です。",
    ],
    [
      "combobox:change",
      "`Combobox` で候補を選んだ後に出します。detailは `combobox:beforechange` と同じです。",
    ],
    [
      "combobox:open / combobox:close",
      "`Combobox` の一覧をキーボードで開いた・閉じた時に出します。detailは `reason`（`keyboard`）です。",
    ],
    [
      "checkbox-group:beforechange",
      "`CheckboxGroup` の選択を変える前に出します。取り消せます。detailは `selected`（変えた後の値）・`previousSelected`・`reason` です。",
    ],
    [
      "checkbox-group:change",
      "`CheckboxGroup` の選択を変えた後に出します。detailは `checkbox-group:beforechange` と同じです。",
    ],
    [
      "number-field:beforechange",
      "操作で値が変わり確定する前に出します。取り消すと値を戻します。detailは `value`（数）・`previousValue`・`reason` です。",
    ],
    [
      "number-field:change",
      "値の変更が確定した後に出します。detailは `number-field:beforechange` と同じです。",
    ],
    [
      "date-field:beforechange / date-field:change",
      "`DateField` の値の変更の確定前・後に出します。beforechangeは取り消すと値を戻します。detailは `value`（YYYY-MM-DD）・`previousValue`・`reason` です。",
    ],
    [
      "time-field:beforechange / time-field:change",
      "`TimeField` の値の変更の確定前・後に出します。beforechangeは取り消すと値を戻します。detailは `value`・`previousValue`・`reason` です。",
    ],
  ],
} satisfies ComponentDoc;
