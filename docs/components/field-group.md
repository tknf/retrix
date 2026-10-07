<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# FieldGroup

見出し・説明・入力欄を、ひとまとまりのフォームとして配置します。

## 使いどころ

- 長いフォームを「連絡先」「配送先」のような意味のまとまりに分け、まとまりごとに見出しと説明を添える時に使います。
- 一つの入力のラベルと補足は `Field`、チェックボックスやラジオボタンのグループは `CheckboxGroup` か `fieldset.rx-choice-group` を使います。
- 公開範囲や通知のように、名前ごとに一つの操作が付く設定を並べる時は `SettingList` を使います。

## 使い方

`children` に `Field` などの入力を並べます。入力の間の余白と、見出し・説明・入力の配置は `FieldGroup` が持ちます。見出しは14pxの太字で、見出しから線は伸ばしません。説明は灰色の文字です。

置き場所の幅が40rem以上で `description` がある時は、説明を先頭側の列に、入力を末尾側の広い列に並べます。狭い時は説明の下に入力を縦に積みます。`description` が無い時は入力に全幅を使います。

ルートは標準の `fieldset` です。`disabled` を渡すと中の入力をまとめて使えなくし、その間は中の入力を送信しません。controllerの登録は要りません。

## アクセシビリティ

- `legend` をまとまりの名前として、中の入力に移った時に読み上げます。見出しの文言は短く、まとまりの内容を表す名前にします。

## API

### FieldGroup

見出しと説明を持つ入力のまとまり。disabledを渡すと中の入力をまとめて使えなくする。

| 名前             | 型       | 既定値 | 説明                                                                                           |
| ---------------- | -------- | ------ | ---------------------------------------------------------------------------------------------- |
| `legend`（必須） | `string` |        | まとまりの見出し。fieldsetのlegendになり、中の入力のまとまりの名前として読み上げる。           |
| `description`    | `string` |        | まとまりの説明。広い配置では左の列に、狭い配置では入力の上に出す。省略すると入力に全幅を使う。 |
| `children`       | `Child`  |        | まとまりに並べる入力。`Field` で包んだ入力などを渡します。                                     |

ほかに、`<fieldset>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

## コード

```tsx
import { FieldGroup, Field, Input } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-form">
    <FieldGroup legend="連絡先" description="予約に関するご連絡に使います。">
      <Field id="hono-group-name" label="名前">
        {(attributes) => <Input {...attributes} name="name" autocomplete="name" />}
      </Field>
      <Field id="hono-group-email" label="メールアドレス">
        {(attributes) => (
          <Input {...attributes} type="email" name="email" autocomplete="email" />
        )}
      </Field>
    </FieldGroup>
    <FieldGroup
      legend="配送先（受付停止中）"
      description="現在、配送先の変更は受け付けていません。"
      disabled
    >
      <Field id="hono-group-recipient" label="宛名">
        {(attributes) => <Input {...attributes} name="recipient" value="山田 太郎" />}
      </Field>
      <Field id="hono-group-address" label="住所">
        {(attributes) => (
          <Input {...attributes} name="address" value="東京都千代田区" />
        )}
      </Field>
    </FieldGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-form">
  <fieldset class="rx-field-group">
    <legend>連絡先</legend>
    <div class="layout">
      <p class="description">予約に関するご連絡に使います。</p>
      <div class="fields">
        <div class="rx-field">
          <div class="heading"><label for="hono-group-name">名前</label></div>
          <input
            id="hono-group-name"
            name="name"
            autocomplete="name"
            class="rx-input"
          />
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-group-email">メールアドレス</label>
          </div>
          <input
            id="hono-group-email"
            type="email"
            name="email"
            autocomplete="email"
            class="rx-input"
          />
        </div>
      </div>
    </div>
  </fieldset>
  <fieldset disabled="" class="rx-field-group">
    <legend>配送先（受付停止中）</legend>
    <div class="layout">
      <p class="description">現在、配送先の変更は受け付けていません。</p>
      <div class="fields">
        <div class="rx-field">
          <div class="heading"><label for="hono-group-recipient">宛名</label></div>
          <input
            id="hono-group-recipient"
            name="recipient"
            value="山田 太郎"
            class="rx-input"
          />
        </div>
        <div class="rx-field">
          <div class="heading"><label for="hono-group-address">住所</label></div>
          <input
            id="hono-group-address"
            name="address"
            value="東京都千代田区"
            class="rx-input"
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>
```

</details>
