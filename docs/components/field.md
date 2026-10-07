<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Field

ラベル・入力欄・補足・エラーを関連付けます。

## 使いどころ

- ラベルの付いた一つの入力を置く時は、入力を `Field` で包みます。ラベル・補足・エラーの位置と読み上げの関連付けを `Field` が持ちます。
- 一行の文字は `Input`、改行を含む長い文は `Textarea`、上限のある文は `CountedTextarea`、パスワードは `PasswordField` を使います。
- 決まった少数の選択肢から一つを選ぶ時は、全て見せてよければ `Choice` の `type="radio"`、場所を取りたくなければ `Select` を使います。
- 選択肢が多く探して選ぶ時は `Picker`、自由入力に候補を添える時は `Suggestion` を使います。打った文字で絞り込まず、候補の一覧を開いて選ぶだけでよい時は `Combobox` を使います。
- 一つのオン・オフは `Choice`（同意などの確認）か `Switch`（設定のオン・オフ）、複数を選ぶ時は `CheckboxGroup` を使います。全て選択が要らない短いグループは `Choice` を `fieldset.rx-choice-group` に並べます。
- 数は `NumberField`、日付は `DateField`、時刻は `TimeField` を使います。単位や接頭辞を添える時は `InputGroup`、カレンダーから日付や期間を選ぶ時は `DatePicker`、開始と終了の日時は `DateTimeRange` を使います。
- 連続する数値をおおよそで決める時は `Range`、3〜8個の決まった値から選ぶ時は `Dial` を使います。

## 使い方

`Field` の `children` は関数です。受け取った属性（`id`・`aria-describedby`・`aria-invalid`・`data-invalid`）を入力の要素へ展開します。`PasswordField`・`CountedTextarea`・`Combobox`・`NumberField`・`DateField`・`TimeField` へ展開すると、中の入力に付きます。`id` は画面内で一意にします。

`help` は入力の下の淡い補足、`error` は直す所を書くエラー文です。`error` を渡すと入力を赤い縁にし、`aria-invalid` を付けます。現在値を淡い補足へ置かず、入力の値として見せます。`status` はラベルの行の終わりに保存の状態などを並べます。

`Input`・`Textarea`・`Select` は標準の要素に `rx-input` を付けたもので、属性をそのまま渡します。`readonly` は面を淡くして値を読めるままにし、`disabled` は斜線の面にします。`Choice` は `label` で包んだチェックボックスかラジオボタンで、`kind="option"` は説明を伴う選択肢を淡い面に載せます。`Choice` のグループは `fieldset.rx-choice-group` の `div.list` に並べ、`legend` で名前を付けます。

`PasswordField` は右端の目のアイコンで、入力を伏せ字と文字の表示で切り替えます。フォームを送信した時とリセットした時は伏せ字に戻します。`PasswordFieldController` を `password-field` として登録します。

`CountedTextarea` は入力の下に「12 / 40 文字」の形で文字数を出します。文字数はcontrollerが接続してから出します。`limit` を超えても入力は止めず、`overflowMessage` を出して入力を無効な状態にし、フォームの送信を止めます。数えるのはUTF-16の単位の長さです。`CharacterCountController` を `character-count` として登録します。

`Combobox` は自由に入力できる欄に、候補の一覧を添えます。欄か右の矢印を押すと一覧が開き、候補を選ぶと値が欄に入って一覧を閉じます。打った文字では絞り込みません。`readonly`・`disabled` の間は一覧を開きません。`ComboboxController` を `combobox` として登録します。候補を選ぶと `combobox:change` を出し、欄でも打って変えた時と同じく標準の `input`・`change` を発火します。開閉の矢印と `role="combobox"` はcontrollerが接続してから付けます。

`CheckboxGroup` は先頭に全て選択のチェックボックスを置き、全て選ぶとオン、一部だけの時は中間の状態にします。全て選択は `disabled` の選択肢を切り替えません。選んだ値は `name` で一つずつ送信し、全て選択のチェックボックスは送信しません。`value` が空白だけの選択肢と、重なった値の二つ目以降は出しません。`CheckboxGroupController` を `checkbox-group` として登録します。

`NumberField`・`DateField`・`TimeField` は標準の `number`・`date`・`time` の入力で、`min`・`max`・`step` をそのまま使います。値が `min`・`max` と等しいとルートの `data-state` を `min`・`max` にし、それ以外は `between` にします。`NumberField` は PageUp・PageDown で `pageStep` 倍のstepだけ動かします。この変更も、矢印キーや打って変えた時と同じく標準の `input`・`change` を発火し、`number-field:change` を出します。それぞれ `NumberFieldController` を `number-field`、`DateFieldController` を `date-field`、`TimeFieldController` を `time-field` として登録します。

入力のCSSは `components/field.css` にあります。`Field` の外で入力だけを使う場合も読み込みます。

controllerを登録しない時、またはJavaScriptが無い時は、標準の入力として動きます。`PasswordField` は切り替えのボタンを出さず、`CountedTextarea` は文字数を出さず上限でも送信を止めません。`Combobox` は開閉の矢印の無い一行の入力、`CheckboxGroup` の全て選択は押しても他を切り替えません。入力の検証は送信先でも行います。

## キーボード

| キー                                              | 動作                                                                                   |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Space（`Choice`・`CheckboxGroup`）                | 標準の操作でオン・オフを切り替えます。ラジオボタンのグループは矢印キーで選び直します。 |
| Enter / Space（`PasswordField` の切り替えの操作） | 伏せ字と文字の表示を切り替えます。                                                     |
| ↓ / ↑（`Combobox`）                               | 一覧を開き、次・前の候補へ移ります。                                                   |
| Home / End（`Combobox` の一覧が開いている時）     | 最初・最後の候補へ移ります。                                                           |
| Enter（`Combobox` の一覧が開いている時）          | 移った候補を選びます。                                                                 |
| Escape（`Combobox` の一覧が開いている時）         | 一覧を閉じます。                                                                       |
| PageUp / PageDown（`NumberField`）                | `pageStep` 倍のstepだけ増減します。`min`・`max` を超えません。                         |
| ↑ / ↓（`NumberField`・`DateField`・`TimeField`）  | 標準の操作で値を増減します。                                                           |

## アクセシビリティ

- ラベルは `for` で入力と結び、`help`・`error`・`describedBy` のidを `aria-describedby` に並べます。`error` がある時は `aria-invalid="true"` を付けます。
- エラーは色だけでなく、アイコンと文で示します。何をどう直すかを文で書きます。
- `PasswordField` の切り替えの操作は `aria-controls` で入力を指し、状態に合わせて `showLabel`・`hideLabel` を読み上げ名にします。マウスで切り替えた後は入力へフォーカスと選択範囲を戻します。
- `CountedTextarea` は文字数を入力の説明として関連付け、超えた時はエラー文も関連付けます。
- `Combobox` の欄はcontrollerが接続すると `role="combobox"` になり、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。JavaScriptが無い時は標準の一行の入力として読み上げます。`toggleLabel`・`listLabel` には何の候補かを含めます。
- `CheckboxGroup` は `fieldset` と `legend` でグループの名前を伝えます。一部だけ選んだ時の全て選択は中間の状態として読み上げます。

## イベント

| イベント                                      | 内容                                                                                                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `password-field:beforetoggle`                 | 表示を切り替える前に出します。取り消せます。detailは `visible`（切り替え後に見せるか）・`previousVisible`・`reason`（`pointer` か `keyboard`）です。 |
| `password-field:toggle`                       | 表示を切り替えた後に出します。detailは `password-field:beforetoggle` と同じです。                                                                    |
| `combobox:beforechange`                       | `Combobox` で候補を選ぶ前に出します。取り消せます。detailは `value`・`previousValue`・`reason` です。                                                |
| `combobox:change`                             | `Combobox` で候補を選んだ後に出します。detailは `combobox:beforechange` と同じです。                                                                 |
| `combobox:open / combobox:close`              | `Combobox` の一覧をキーボードで開いた・閉じた時に出します。detailは `reason`（`keyboard`）です。                                                     |
| `checkbox-group:beforechange`                 | `CheckboxGroup` の選択を変える前に出します。取り消せます。detailは `selected`（変えた後の値）・`previousSelected`・`reason` です。                   |
| `checkbox-group:change`                       | `CheckboxGroup` の選択を変えた後に出します。detailは `checkbox-group:beforechange` と同じです。                                                      |
| `number-field:beforechange`                   | 操作で値が変わり確定する前に出します。取り消すと値を戻します。detailは `value`（数）・`previousValue`・`reason` です。                               |
| `number-field:change`                         | 値の変更が確定した後に出します。detailは `number-field:beforechange` と同じです。                                                                    |
| `date-field:beforechange / date-field:change` | `DateField` の値の変更の確定前・後に出します。beforechangeは取り消すと値を戻します。detailは `value`（YYYY-MM-DD）・`previousValue`・`reason` です。 |
| `time-field:beforechange / time-field:change` | `TimeField` の値の変更の確定前・後に出します。beforechangeは取り消すと値を戻します。detailは `value`・`previousValue`・`reason` です。               |

## API

### Field

ラベル・入力・補足・エラーを並べ、読み上げの関連付けを作る。入力そのものはchildrenで描画する。

| 名前               | 型                                         | 既定値 | 説明                                                                            |
| ------------------ | ------------------------------------------ | ------ | ------------------------------------------------------------------------------- |
| `id`（必須）       | `string`                                   |        | 入力のid。ラベルのforと補足・エラーのidの元になる。画面内で一意にする。         |
| `label`（必須）    | `string`                                   |        | 入力の上に出すラベル。読み上げの名前になる。                                    |
| `help`             | `string`                                   |        | 入力の下に出す淡い補足。入力の説明として読み上げる。現在値は置かない。          |
| `error`            | `string`                                   |        | 直す所を書くエラー文。渡すと入力をaria-invalidにし、説明として読み上げる。      |
| `describedBy`      | `string`                                   |        | 補足・エラーより前に説明として関連付ける、ほかの要素のid。                      |
| `status`           | `Child`                                    |        | ラベルの行の末尾に並べる状態（保存の状態やBadgeなど）。                         |
| `children`（必須） | `(attributes: ControlAttributes) => Child` |        | 入力を描画する関数。受け取った属性（ControlAttributes）を入力の要素へ展開する。 |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`、`components/icon.css`

#### `ControlAttributes`

Fieldが入力へ渡す属性。入力の要素へそのまま展開する。

| 名前               | 型       | 既定値 | 説明                                                                      |
| ------------------ | -------- | ------ | ------------------------------------------------------------------------- |
| `id`（必須）       | `string` |        | Fieldのid。ラベルのforが指す。                                            |
| `aria-describedby` | `string` |        | describedBy・補足・エラーのidを空白で並べたもの。どれも無ければ付かない。 |
| `aria-invalid`     | `"true"` |        | errorがある時だけ"true"。                                                 |
| `data-invalid`     | `"true"` |        | errorがある時だけ"true"。赤い枠線の表示に使う。                           |

### Input

一行の入力。標準のinputの属性をそのまま渡す。

ほかに、`<input>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### Textarea

複数行の入力。標準のtextareaの属性をそのまま渡し、初期値はchildrenに書く。

ほかに、`<textarea>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### Select

決まった選択肢から選ぶ入力。標準のselectの属性とoptionをそのまま渡す。

ほかに、`<select>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### Choice

チェックボックスかラジオボタンと、その名前。残りの属性はinputへ渡す。

| 名前            | 型                       | 既定値       | 説明                                                                                    |
| --------------- | ------------------------ | ------------ | --------------------------------------------------------------------------------------- |
| `type`          | `HTMLInputTypeAttribute` | `"checkbox"` | checkboxは個別のオン・オフ、radioは同じnameの中から一つを選ぶ。                         |
| `label`（必須） | `string`                 |              | 選択肢の名前。マークの横に出し、labelで包んで押せる範囲にする。                         |
| `description`   | `Child`                  |              | 名前の下に添える淡い説明。渡すと名前を太字にする。                                      |
| `kind`          | `"plain" \| "option"`    | `"plain"`    | plainはマークと名前だけ、optionは説明を伴う選択肢を淡い背景に載せ、選ぶと淡い青にする。 |

ほかに、`<input>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### PasswordField

表示と非表示を切り替えられるパスワードの入力。残りの属性はinputへ渡す。

| 名前         | 型       | 既定値               | 説明                                                  |
| ------------ | -------- | -------------------- | ----------------------------------------------------- |
| `id`（必須） | `string` |                      | 入力のid。表示を切り替える操作のaria-controlsが指す。 |
| `showLabel`  | `string` | `"パスワードを表示"` | 隠している間の切り替え操作の読み上げ名。              |
| `hideLabel`  | `string` | `"パスワードを隠す"` | 見せている間の切り替え操作の読み上げ名。              |

ほかのpropsは`Input`へそのまま渡します。

登録するcontroller：`password-field`（`PasswordFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`、`components/icon.css`

### CountedTextarea

文字数と上限を添えた複数行の入力。残りの属性はtextareaへ渡す。

| 名前              | 型       | 既定値                           | 説明                                                                                                  |
| ----------------- | -------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `id`（必須）      | `string` |                                  | 入力のid。文字数（`<id>-count`）と超過のエラー（`<id>-over-error`）のidの元になる。                   |
| `limit`（必須）   | `number` |                                  | 文字数の上限。超えても入力は止めず、エラーを出して送信を止める。maxlengthを渡すとそちらを上限にする。 |
| `unit`            | `string` | `"文字"`                         | 「12 / 40」の後に添える単位。                                                                         |
| `overflowMessage` | `string` | `"文字数の上限を超えています。"` | 上限を超えた時に出すエラー文。送信を止める時の検証メッセージにも使う。                                |

ほかのpropsは`Textarea`へそのまま渡します。

登録するcontroller：`character-count`（`CharacterCountController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`、`components/icon.css`

### Combobox

自由に入力でき、候補の一覧からも選べる一行の入力。残りの属性はinputへ渡す。 `role="combobox"`と開閉の矢印はcontrollerが接続してから付けて出す。

| 名前              | 型                          | 既定値         | 説明                                                           |
| ----------------- | --------------------------- | -------------- | -------------------------------------------------------------- |
| `id`（必須）      | `string`                    |                | 入力のid。候補の一覧（`<id>-options`）と各候補のidの元になる。 |
| `options`（必須） | `readonly ComboboxOption[]` |                | 一覧に出す候補。入力した文字では絞り込まない。                 |
| `toggleLabel`     | `string`                    | `"候補を開閉"` | 一覧を開閉する矢印ボタンの読み上げ名。何の候補かを含める。     |
| `listLabel`       | `string`                    | `"候補"`       | 候補の一覧の読み上げ名。                                       |

ほかのpropsは`Input`へそのまま渡します。

登録するcontroller：`combobox`（`ComboboxController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`、`components/icon.css`

#### `ComboboxOption`

| 名前            | 型        | 既定値 | 説明                                             |
| --------------- | --------- | ------ | ------------------------------------------------ |
| `value`（必須） | `string`  |        | 選んだ時に入力欄へ入る値。候補の中で一意にする。 |
| `label`（必須） | `string`  |        | 候補の一覧に出す文言。                           |
| `disabled`      | `boolean` |        | 一覧に出すが選べなくする。                       |

### CheckboxGroup

複数を選べるチェックボックスのグループと、全て選択のチェックボックス。

| 名前              | 型                               | 既定値         | 説明                                                                       |
| ----------------- | -------------------------------- | -------------- | -------------------------------------------------------------------------- |
| `name`（必須）    | `string`                         |                | 各選択肢のname。選んだ値を同じnameで一つずつ送信する。                     |
| `legend`（必須）  | `string`                         |                | まとまりの名前。fieldsetのlegendになる。                                   |
| `options`（必須） | `readonly CheckboxGroupOption[]` |                | 選択肢。一つも無い時は「選択肢はありません。」と出し、全て選択も出さない。 |
| `selected`        | `readonly string[]`              | `[]`           | 最初に選んでおく値。                                                       |
| `allLabel`        | `string`                         | `"すべて選択"` | 先頭に置く全て選択の名前。このチェックボックスは送信しない。               |

ほかに、`<fieldset>`へ標準のHTML属性を渡せます。

登録するcontroller：`checkbox-group`（`CheckboxGroupController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

#### `CheckboxGroupOption`

| 名前            | 型        | 既定値 | 説明                                                           |
| --------------- | --------- | ------ | -------------------------------------------------------------- |
| `value`（必須） | `string`  |        | 送信する値。空白だけの値と、重なった値の二つ目以降は出さない。 |
| `label`（必須） | `string`  |        | 選択肢の名前。                                                 |
| `description`   | `string`  |        | 名前の下に添える淡い説明。                                     |
| `disabled`      | `boolean` |        | 使えなくする。全て選択でも切り替えない。                       |

### NumberField

数の入力。min・max・stepは標準のまま使い、PageUp・PageDownで大きく動かせる。

| 名前       | 型       | 既定値 | 説明                                                                        |
| ---------- | -------- | ------ | --------------------------------------------------------------------------- |
| `pageStep` | `number` | `10`   | PageUp・PageDownで動かすstepの数。正の整数にする（stepが1なら10ずつ動く）。 |

ほかのpropsは`Input`へそのまま渡します。

登録するcontroller：`number-field`（`NumberFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### DateField

日付の入力。標準のdate入力で、値はYYYY-MM-DD。変更を取り消せるイベントを追加する。

登録するcontroller：`date-field`（`DateFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

### TimeField

時刻の入力。標準のtime入力で、値はHH:MM（stepによっては秒も）。変更を取り消せるイベントを追加する。

登録するcontroller：`time-field`（`TimeFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

## コード

```tsx
import {
  Disclosure,
  Field,
  Input,
  Textarea,
  Select,
  Choice,
  Button,
  CountedTextarea,
  PasswordField,
  NumberField,
  DateField,
  TimeField,
  Combobox,
  CheckboxGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-split">
    <Field
      id="hono-error"
      label="名前"
      help="一覧に表示します。"
      error="名前を入力してください。"
    >
      {(attributes) => <Input {...attributes} required name="name" />}
    </Field>
    <Field id="hono-readonly" label="現在の名前">
      {(attributes) => <Input {...attributes} readonly value="現在の値" />}
    </Field>
    <Field id="hono-disabled" label="利用できない入力">
      {(attributes) => <Input {...attributes} disabled value="受付停止中" />}
    </Field>
    <Field id="hono-description" label="説明">
      {(attributes) => (
        <Textarea {...attributes} rows={3}>
          長い説明を入力できます。
        </Textarea>
      )}
    </Field>
    <Field id="hono-select" label="表示状態">
      {(attributes) => (
        <Select {...attributes}>
          <option>表示する</option>
          <option>非表示</option>
        </Select>
      )}
    </Field>
    <Disclosure summary="入力・選択のほかの状態">
      <div class="rx-stack">
        <Field
          id="hono-description-error"
          label="説明（エラー）"
          error="説明を入力してください。"
        >
          {(attributes) => <Textarea {...attributes} rows={3} required />}
        </Field>
        <Field id="hono-description-readonly" label="説明（閲覧専用）">
          {(attributes) => (
            <Textarea {...attributes} rows={3} readonly>
              公開済みの説明です。
            </Textarea>
          )}
        </Field>
        <Field id="hono-description-disabled" label="説明（利用不可）">
          {(attributes) => (
            <Textarea {...attributes} rows={3} disabled>
              受付停止中です。
            </Textarea>
          )}
        </Field>
        <Field
          id="hono-select-error"
          label="表示状態（エラー）"
          error="表示状態を選んでください。"
        >
          {(attributes) => (
            <Select {...attributes} required>
              <option value="">選んでください</option>
              <option value="visible">表示する</option>
              <option value="hidden">非表示</option>
            </Select>
          )}
        </Field>
        <Field id="hono-select-disabled" label="表示状態（利用不可）">
          {(attributes) => (
            <Select {...attributes} disabled>
              <option>非表示</option>
            </Select>
          )}
        </Field>
      </div>
    </Disclosure>
    <Field id="hono-counted-description" label="紹介文（文字数表示）">
      {(attributes) => <CountedTextarea {...attributes} rows={3} limit={40} />}
    </Field>
    <Field id="hono-password" label="パスワード（表示切替）">
      {(attributes) => (
        <PasswordField
          {...attributes}
          autocomplete="new-password"
          value="Retrix-demo-123"
        />
      )}
    </Field>
    <form
      class="rx-stack"
      data-controller="field-demo"
      data-action="number-field:change->field-demo#record date-field:change->field-demo#record time-field:change->field-demo#record reset->field-demo#reset"
    >
      <Field
        id="hono-number"
        label="部数"
        help="1〜100部。PageUp・PageDownで10部ずつ変更できます。"
      >
        {(attributes) => (
          <NumberField
            {...attributes}
            name="copies"
            min={1}
            max={100}
            step={1}
            value={10}
            pageStep={10}
          />
        )}
      </Field>
      <Field id="hono-date" label="利用日" help="2026年の日付を選べます。">
        {(attributes) => (
          <DateField
            {...attributes}
            name="date"
            min="2026-01-01"
            max="2026-12-31"
            value="2026-09-11"
          />
        )}
      </Field>
      <Field id="hono-time" label="開始時刻" help="9:00〜18:00、30分単位です。">
        {(attributes) => (
          <TimeField
            {...attributes}
            name="time"
            min="09:00"
            max="18:00"
            step={1800}
            value="10:00"
          />
        )}
      </Field>
      <output class="rx-save-status" aria-live="polite">
        値を変更すると、確定した値をここに表示します。
      </output>
      <Button type="reset">日時と部数を戻す</Button>
    </form>
    <Field
      id="hono-combobox"
      label="担当部署（候補選択）"
      help="入力欄か右の矢印を押すと候補が開きます。候補を押して選べます。"
    >
      {(attributes) => (
        <Combobox
          {...attributes}
          toggleLabel="担当部署の候補を開閉"
          listLabel="担当部署の候補"
          options={[
            { value: "編集部", label: "編集部" },
            { value: "営業部", label: "営業部" },
            { value: "制作部", label: "制作部" },
          ]}
        />
      )}
    </Field>
    <Field id="hono-combobox-readonly" label="確定済みの担当部署">
      {(attributes) => (
        <Combobox
          {...attributes}
          readonly
          value="編集部"
          options={[
            { value: "編集部", label: "編集部" },
            { value: "営業部", label: "営業部" },
          ]}
        />
      )}
    </Field>
    <fieldset class="rx-choice-group">
      <legend>チェックの状態</legend>
      <div class="list">
        <Choice label="条件を確認しました" />
        <Choice label="メールで知らせる" checked />
        <Choice label="利用できない項目" disabled />
        <Choice label="選択済みの停止項目" disabled checked />
      </div>
    </fieldset>
    <form class="rx-stack">
      <CheckboxGroup
        legend="複数選択・全選択"
        name="notifications"
        selected={["articles", "required"]}
        options={[
          { value: "articles", label: "新しい記事" },
          { value: "comments", label: "コメント" },
          { value: "updates", label: "更新のお知らせ" },
          { value: "unavailable", label: "利用できない通知", disabled: true },
          { value: "required", label: "常に受け取る通知", disabled: true },
        ]}
      />
      <Button type="reset">選択を戻す</Button>
    </form>
    <CheckboxGroup legend="項目がない設定" name="empty-options" options={[]} />
    <CheckboxGroup
      legend="重複した候補の整理"
      name="unique-options"
      options={[
        { value: "notice", label: "お知らせ" },
        { value: "notice", label: "重複したお知らせ" },
        { value: "", label: "空の値" },
        { value: "digest", label: "週次まとめ" },
      ]}
    />
    <fieldset class="rx-choice-group">
      <legend>連絡方法</legend>
      <div class="list">
        <Choice type="radio" name="contact" label="メール" value="email" checked />
        <Choice type="radio" name="contact" label="電話" value="phone" />
        <Choice
          type="radio"
          name="contact"
          label="郵送（利用不可）"
          value="post"
          disabled
        />
      </div>
    </fieldset>
    <fieldset class="rx-choice-group" disabled>
      <legend>変更できない連絡方法</legend>
      <div class="list">
        <Choice type="radio" name="locked-contact" label="メール（固定）" checked />
        <Choice type="radio" name="locked-contact" label="電話（利用不可）" />
      </div>
    </fieldset>
    <fieldset class="rx-choice-group">
      <legend>利用場所</legend>
      <div class="list">
        <Choice
          type="radio"
          name="hono-choice"
          label="標準"
          description="打ち合わせと共同作業に使えます。"
          kind="option"
          checked
        />
        <Choice
          type="radio"
          name="hono-choice"
          label="静かな部屋"
          description="会話を伴わない作業向けです。"
          kind="option"
        />
      </div>
    </fieldset>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-split">
  <div class="rx-field">
    <div class="heading"><label for="hono-error">名前</label></div>
    <input
      id="hono-error"
      aria-describedby="hono-error-help hono-error-error"
      aria-invalid="true"
      data-invalid="true"
      required=""
      name="name"
      class="rx-input"
    />
    <div class="messages">
      <p class="help" id="hono-error-help"><span>一覧に表示します。</span></p>
      <p class="error" id="hono-error-error">
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span>名前を入力してください。</span>
      </p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-readonly">現在の名前</label></div>
    <input id="hono-readonly" readonly="" value="現在の値" class="rx-input" />
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-disabled">利用できない入力</label></div>
    <input id="hono-disabled" disabled="" value="受付停止中" class="rx-input" />
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-description">説明</label></div>
    <textarea id="hono-description" rows="3" class="rx-input">
長い説明を入力できます。</textarea>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-select">表示状態</label></div>
    <select id="hono-select" class="rx-input">
      <option>表示する</option>
      <option>非表示</option>
    </select>
  </div>
  <details class="rx-disclosure">
    <summary>
      <span class="marker" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
      ><span class="label"><span class="title">入力・選択のほかの状態</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div class="rx-field">
          <div class="heading">
            <label for="hono-description-error">説明（エラー）</label>
          </div>
          <textarea
            id="hono-description-error"
            aria-describedby="hono-description-error-error"
            aria-invalid="true"
            data-invalid="true"
            rows="3"
            required=""
            class="rx-input"
          ></textarea>
          <div class="messages">
            <p class="error" id="hono-description-error-error">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>説明を入力してください。</span>
            </p>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-description-readonly">説明（閲覧専用）</label>
          </div>
          <textarea
            id="hono-description-readonly"
            rows="3"
            readonly=""
            class="rx-input"
          >
公開済みの説明です。</textarea>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-description-disabled">説明（利用不可）</label>
          </div>
          <textarea
            id="hono-description-disabled"
            rows="3"
            disabled=""
            class="rx-input"
          >
受付停止中です。</textarea>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-select-error">表示状態（エラー）</label>
          </div>
          <select
            id="hono-select-error"
            aria-describedby="hono-select-error-error"
            aria-invalid="true"
            data-invalid="true"
            required=""
            class="rx-input"
          >
            <option value="">選んでください</option>
            <option value="visible">表示する</option>
            <option value="hidden">非表示</option>
          </select>
          <div class="messages">
            <p class="error" id="hono-select-error-error">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>表示状態を選んでください。</span>
            </p>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-select-disabled">表示状態（利用不可）</label>
          </div>
          <select id="hono-select-disabled" disabled="" class="rx-input">
            <option>非表示</option>
          </select>
        </div>
      </div>
    </div>
  </details>
  <div class="rx-field">
    <div class="heading">
      <label for="hono-counted-description">紹介文（文字数表示）</label>
    </div>
    <div
      class="rx-character-count"
      data-controller="character-count"
      data-character-count-max-value="40"
    >
      <textarea
        rows="3"
        id="hono-counted-description"
        data-character-count-target="field"
        class="rx-input"
      ></textarea>
      <div class="messages">
        <p
          class="count"
          id="hono-counted-description-count"
          data-character-count-target="counter"
          hidden=""
        >
          文字
        </p>
        <p class="error over-error" id="hono-counted-description-over-error">
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
          ><span>文字数の上限を超えています。</span>
        </p>
      </div>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-password">パスワード（表示切替）</label></div>
    <div
      class="rx-password"
      data-controller="password-field"
      data-password-field-show-label-value="パスワードを表示"
      data-password-field-hide-label-value="パスワードを隠す"
    >
      <input
        autocomplete="new-password"
        value="Retrix-demo-123"
        id="hono-password"
        type="password"
        data-password-field-target="input"
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        data-password-field-target="toggle"
        data-state="hidden"
        aria-controls="hono-password"
      >
        <span class="show"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use></svg></span
        ><span class="hide"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye-slash"></use></svg
        ></span>
      </button>
    </div>
  </div>
  <form
    class="rx-stack"
    data-controller="field-demo"
    data-action="number-field:change-&gt;field-demo#record date-field:change-&gt;field-demo#record time-field:change-&gt;field-demo#record reset-&gt;field-demo#reset"
  >
    <div class="rx-field">
      <div class="heading"><label for="hono-number">部数</label></div>
      <input
        id="hono-number"
        aria-describedby="hono-number-help"
        name="copies"
        min="1"
        max="100"
        step="1"
        value="10"
        type="number"
        data-controller="number-field"
        data-number-field-page-step-value="10"
        class="rx-input"
      />
      <div class="messages">
        <p class="help" id="hono-number-help">
          <span>1〜100部。PageUp・PageDownで10部ずつ変更できます。</span>
        </p>
      </div>
    </div>
    <div class="rx-field">
      <div class="heading"><label for="hono-date">利用日</label></div>
      <input
        id="hono-date"
        aria-describedby="hono-date-help"
        name="date"
        min="2026-01-01"
        max="2026-12-31"
        value="2026-09-11"
        type="date"
        data-controller="date-field"
        class="rx-input"
      />
      <div class="messages">
        <p class="help" id="hono-date-help"><span>2026年の日付を選べます。</span></p>
      </div>
    </div>
    <div class="rx-field">
      <div class="heading"><label for="hono-time">開始時刻</label></div>
      <input
        id="hono-time"
        aria-describedby="hono-time-help"
        name="time"
        min="09:00"
        max="18:00"
        step="1800"
        value="10:00"
        type="time"
        data-controller="time-field"
        class="rx-input"
      />
      <div class="messages">
        <p class="help" id="hono-time-help"><span>9:00〜18:00、30分単位です。</span></p>
      </div>
    </div>
    <output class="rx-save-status" aria-live="polite"
      >値を変更すると、確定した値をここに表示します。</output
    ><button
      class="rx-button"
      type="reset"
      data-variant="secondary"
      data-size="default"
    >
      日時と部数を戻す
    </button>
  </form>
  <div class="rx-field">
    <div class="heading"><label for="hono-combobox">担当部署（候補選択）</label></div>
    <div
      class="rx-combobox"
      data-controller="combobox"
      data-combobox-autocomplete-value="none"
      data-action="combobox:change-&gt;combobox#hide"
    >
      <input
        aria-describedby="hono-combobox-help"
        id="hono-combobox"
        type="text"
        autocomplete="off"
        data-combobox-target="input"
        data-action="click-&gt;combobox#show"
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        aria-label="担当部署の候補を開閉"
        aria-haspopup="listbox"
        aria-controls="hono-combobox-options"
        data-action="click-&gt;combobox#toggle"
        hidden=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-caret"></use>
        </svg>
      </button>
      <ul
        class="options"
        id="hono-combobox-options"
        role="listbox"
        aria-label="担当部署の候補"
        hidden=""
        data-combobox-target="listbox"
      >
        <li
          id="hono-combobox-option-0"
          role="option"
          aria-selected="false"
          data-combobox-target="option"
          data-combobox-value="編集部"
        >
          編集部
        </li>
        <li
          id="hono-combobox-option-1"
          role="option"
          aria-selected="false"
          data-combobox-target="option"
          data-combobox-value="営業部"
        >
          営業部
        </li>
        <li
          id="hono-combobox-option-2"
          role="option"
          aria-selected="false"
          data-combobox-target="option"
          data-combobox-value="制作部"
        >
          制作部
        </li>
      </ul>
    </div>
    <div class="messages">
      <p class="help" id="hono-combobox-help">
        <span>入力欄か右の矢印を押すと候補が開きます。候補を押して選べます。</span>
      </p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading">
      <label for="hono-combobox-readonly">確定済みの担当部署</label>
    </div>
    <div
      class="rx-combobox"
      data-controller="combobox"
      data-combobox-autocomplete-value="none"
      data-action="combobox:change-&gt;combobox#hide"
    >
      <input
        readonly=""
        value="編集部"
        id="hono-combobox-readonly"
        type="text"
        autocomplete="off"
        data-combobox-target="input"
        data-action="click-&gt;combobox#show"
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        aria-label="候補を開閉"
        aria-haspopup="listbox"
        aria-controls="hono-combobox-readonly-options"
        data-action="click-&gt;combobox#toggle"
        disabled=""
        hidden=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-caret"></use>
        </svg>
      </button>
      <ul
        class="options"
        id="hono-combobox-readonly-options"
        role="listbox"
        aria-label="候補"
        hidden=""
        data-combobox-target="listbox"
      >
        <li
          id="hono-combobox-readonly-option-0"
          role="option"
          aria-selected="false"
          data-combobox-target="option"
          data-combobox-value="編集部"
        >
          編集部
        </li>
        <li
          id="hono-combobox-readonly-option-1"
          role="option"
          aria-selected="false"
          data-combobox-target="option"
          data-combobox-value="営業部"
        >
          営業部
        </li>
      </ul>
    </div>
  </div>
  <fieldset class="rx-choice-group">
    <legend>チェックの状態</legend>
    <div class="list">
      <label class="rx-choice" data-kind="plain"
        ><input type="checkbox" /><span
          ><strong>条件を確認しました</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input checked="" type="checkbox" /><span
          ><strong>メールで知らせる</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input disabled="" type="checkbox" /><span
          ><strong>利用できない項目</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input disabled="" checked="" type="checkbox" /><span
          ><strong>選択済みの停止項目</strong></span
        ></label
      >
    </div>
  </fieldset>
  <form class="rx-stack">
    <fieldset class="rx-choice-group" data-controller="checkbox-group">
      <legend>複数選択・全選択</legend>
      <div class="list">
        <label class="rx-choice" data-kind="plain"
          ><input data-checkbox-group-target="all" type="checkbox" /><span
            ><strong>すべて選択</strong></span
          ></label
        ><label class="rx-choice" data-kind="plain"
          ><input
            name="notifications"
            value="articles"
            checked=""
            data-checkbox-group-target="item"
            data-checkbox-group-value="articles"
            type="checkbox"
          /><span><strong>新しい記事</strong></span></label
        ><label class="rx-choice" data-kind="plain"
          ><input
            name="notifications"
            value="comments"
            data-checkbox-group-target="item"
            data-checkbox-group-value="comments"
            type="checkbox"
          /><span><strong>コメント</strong></span></label
        ><label class="rx-choice" data-kind="plain"
          ><input
            name="notifications"
            value="updates"
            data-checkbox-group-target="item"
            data-checkbox-group-value="updates"
            type="checkbox"
          /><span><strong>更新のお知らせ</strong></span></label
        ><label class="rx-choice" data-kind="plain"
          ><input
            name="notifications"
            value="unavailable"
            disabled=""
            data-checkbox-group-target="item"
            data-checkbox-group-value="unavailable"
            type="checkbox"
          /><span><strong>利用できない通知</strong></span></label
        ><label class="rx-choice" data-kind="plain"
          ><input
            name="notifications"
            value="required"
            disabled=""
            checked=""
            data-checkbox-group-target="item"
            data-checkbox-group-value="required"
            type="checkbox"
          /><span><strong>常に受け取る通知</strong></span></label
        >
      </div>
    </fieldset>
    <button class="rx-button" type="reset" data-variant="secondary" data-size="default">
      選択を戻す
    </button>
  </form>
  <fieldset class="rx-choice-group">
    <legend>項目がない設定</legend>
    <p>選択肢はありません。</p>
  </fieldset>
  <fieldset class="rx-choice-group" data-controller="checkbox-group">
    <legend>重複した候補の整理</legend>
    <div class="list">
      <label class="rx-choice" data-kind="plain"
        ><input data-checkbox-group-target="all" type="checkbox" /><span
          ><strong>すべて選択</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input
          name="unique-options"
          value="notice"
          data-checkbox-group-target="item"
          data-checkbox-group-value="notice"
          type="checkbox"
        /><span><strong>お知らせ</strong></span></label
      ><label class="rx-choice" data-kind="plain"
        ><input
          name="unique-options"
          value="digest"
          data-checkbox-group-target="item"
          data-checkbox-group-value="digest"
          type="checkbox"
        /><span><strong>週次まとめ</strong></span></label
      >
    </div>
  </fieldset>
  <fieldset class="rx-choice-group">
    <legend>連絡方法</legend>
    <div class="list">
      <label class="rx-choice" data-kind="plain"
        ><input name="contact" value="email" checked="" type="radio" /><span
          ><strong>メール</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input name="contact" value="phone" type="radio" /><span
          ><strong>電話</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input name="contact" value="post" disabled="" type="radio" /><span
          ><strong>郵送（利用不可）</strong></span
        ></label
      >
    </div>
  </fieldset>
  <fieldset class="rx-choice-group" disabled="">
    <legend>変更できない連絡方法</legend>
    <div class="list">
      <label class="rx-choice" data-kind="plain"
        ><input name="locked-contact" checked="" type="radio" /><span
          ><strong>メール（固定）</strong></span
        ></label
      ><label class="rx-choice" data-kind="plain"
        ><input name="locked-contact" type="radio" /><span
          ><strong>電話（利用不可）</strong></span
        ></label
      >
    </div>
  </fieldset>
  <fieldset class="rx-choice-group">
    <legend>利用場所</legend>
    <div class="list">
      <label class="rx-choice" data-kind="option"
        ><input name="hono-choice" checked="" type="radio" /><span
          ><strong>標準</strong><small>打ち合わせと共同作業に使えます。</small></span
        ></label
      ><label class="rx-choice" data-kind="option"
        ><input name="hono-choice" type="radio" /><span
          ><strong>静かな部屋</strong><small>会話を伴わない作業向けです。</small></span
        ></label
      >
    </div>
  </fieldset>
</div>
```

</details>
