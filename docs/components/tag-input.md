<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# TagInput

入力した文字をタグとして追加・解除します。

## 使いどころ

- キーワードや分類など、利用者が自由に書いた短い言葉を複数付ける時に使います。
- 決まった選択肢から複数選ぶ時は `CheckboxGroup`、多めの候補から打って探して選ぶ時は `FilterMenu`、一つの言葉に候補を添える時は `Suggestion` を使います。付いたタグを見せるだけなら `Tag` を並べます。

## 使い方

`label` と `name` を渡し、初めのタグを `values` に渡します。入力欄に言葉を打ってEnterを押すとタグになり、欄の下に解除ボタン付きの `Tag` として並びます。前後の空白は除きます。

空の言葉、カンマを含む言葉、既にあるタグは追加せず、欄の下に赤い小さな文字（11px）で理由を出します。

送信する値：タグを「, 」でつないだ一つの文字列（`案内, 公開` など）を `name` で送ります。JavaScriptが無い時も同じ形です。サーバー側でカンマで分け、前後の空白を除いて使います。

`required` はタグが一つも無い時に送信を止めます。`disabled` は追加と解除を止め、値を送りません。`help`・`error` は `Field` と同じく欄の下に出して入力欄に関連付けます。フォームのリセットでは `values` の並びへ戻します。

タグの追加・解除の時は、取り消せる `tag-input:beforeadd`・`tag-input:beforeremove` と、その後の `tag-input:add`・`tag-input:remove` を発火します。並びが変わると全てのタグを渡す `tag-field:change` を発火し、送信フィールドにも標準の `input`・`change` を発火します。保存は利用側で行います。

外からタグを置き換える時は、`tag-field` のcontrollerの `replaceValues(values)` を呼びます。

JavaScriptが無い時は、カンマ区切りの一行の入力欄として送信します。

## キーボード

| キー                                       | 動作                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Enter（入力欄）                            | 入力した文字をタグにします。日本語の変換中のEnterは横取りしません。                      |
| ←（入力欄の先頭）・Backspace（空の入力欄） | 最後のタグの解除ボタンへ移ります。                                                       |
| ←・→（タグ）                               | 隣のタグへ移ります。最後のタグから先へ進むと入力欄へ戻ります。右から左に読む時は逆です。 |
| Home・End（タグ）                          | 最初のタグ・入力欄へ移ります。                                                           |
| Delete・Backspace（タグ）                  | そのタグを解除し、隣のタグへ移ります。                                                   |

## アクセシビリティ

- 入力欄は `label` を名前にし、タグの一覧は「〜のタグ」の名前を持ちます。解除ボタンは「〜を解除」の名前を持ちます。
- 追加できなかった理由は `role="status"` で知らせます。
- `required` でタグが無い時は、入力欄の検証のメッセージ「タグを追加してください。」で送信を止めます。

## イベント

| イベント                 | 内容                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tag-input:beforeadd`    | Enterでタグを追加する前に発火します。取り消せます。detailは `{ value, reason }` で、`value` は入力した文字です。                                        |
| `tag-input:add`          | タグを追加した時に発火します。detailは `tag-input:beforeadd` と同じです。                                                                               |
| `tag-input:beforeremove` | タグを解除する前に発火します。取り消せます。detailは `{ value, chip, reason }` で、`chip` はそのタグの `li`、`reason` は `pointer` か `keyboard` です。 |
| `tag-input:remove`       | タグを解除した時に発火します。detailは `tag-input:beforeremove` と同じです。                                                                            |
| `tag-field:change`       | タグの並びが変わった後に発火します。detailは `{ values }` で、今のタグの配列です。                                                                      |

## API

### TagInput

自由入力のタグ。送信値はJavaScriptの有無にかかわらずカンマ区切り。

| 名前            | 型                  | 既定値                  | 説明                                                                                                   |
| --------------- | ------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `id`            | `string`            |                         | 入力欄のID。ラベル・補足・エラー文のIDの接頭辞にも使う。渡さなければ自動で生成する。                   |
| `label`（必須） | `string`            |                         | 欄の名前。タグの一覧の読み上げ名（「〜のタグ」）にも使う。                                             |
| `name`（必須）  | `string`            |                         | タグを「, 」でつないだ一つの値を送るフィールドの名前。                                                 |
| `values`        | `readonly string[]` | `[]`                    | 初期のタグ。前後の空白を除き、空・カンマを含むもの・重複は捨てる。フォームのリセットでこの並びへ戻る。 |
| `placeholder`   | `string`            | `"入力してEnterで追加"` | 入力欄のプレースホルダー。                                                                             |
| `help`          | `string`            |                         | 欄の下に出す補足。入力欄のaria-describedbyに関連付ける。                                               |
| `error`         | `string`            |                         | 欄の下に出すエラー文。入力欄をaria-invalidにする。検証は利用側で行う。                                 |
| `required`      | `boolean`           |                         | タグが一つも無い時に送信を止める。                                                                     |
| `disabled`      | `boolean`           |                         | 追加・解除を止め、値を送信しない。                                                                     |
| `form`          | `string`            |                         | 別の場所にあるformのID。                                                                               |

登録するcontroller：`tag-input`（`TagInputController`）、`tag-field`（`TagFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/tag.css`、`components/tag-input.css`

## コード

```tsx
import { TagInput } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <TagInput
      id="tag-input-keywords"
      label="キーワード"
      name="keywords"
      values={["案内", "公開"]}
      help="入力してEnterで追加できます。"
    />
    <TagInput id="tag-input-empty" label="分類タグ" name="tags" required />
    <TagInput
      id="tag-input-invalid"
      label="確認が必要なタグ"
      name="invalid-tags"
      error="タグを追加してください。"
      required
    />
    <TagInput
      id="tag-input-disabled"
      label="変更できないタグ"
      name="locked-tags"
      values={["公開済み", "固定"]}
      disabled
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-field">
    <div class="heading"><label for="tag-input-keywords">キーワード</label></div>
    <div
      class="rx-tag-input"
      data-controller="tag-input tag-field"
      data-action="tag-input:beforeadd-&gt;tag-field#beforeAdd tag-input:add-&gt;tag-field#add tag-input:remove-&gt;tag-field#remove"
      data-tag-field-name-value="keywords"
      data-tag-field-required-value="false"
    >
      <input
        id="tag-input-keywords"
        aria-describedby="tag-input-keywords-help"
        name="keywords"
        type="text"
        value="案内, 公開"
        placeholder="入力してEnterで追加"
        data-tag-input-target="input"
        data-tag-field-target="entry"
        class="rx-input"
      />
      <ul
        class="chips"
        data-tag-field-target="list"
        aria-label="キーワードのタグ"
        hidden=""
      >
        <li data-tag-input-target="chip" data-tag-input-value="案内">
          <span class="rx-tag removable"
            ><span class="label">案内</span
            ><button
              data-icon-only="true"
              aria-label="案内を解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span>
        </li>
        <li data-tag-input-target="chip" data-tag-input-value="公開">
          <span class="rx-tag removable"
            ><span class="label">公開</span
            ><button
              data-icon-only="true"
              aria-label="公開を解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span>
        </li>
      </ul>
      <template data-tag-field-target="template"
        ><li data-tag-input-target="chip">
          <span class="rx-tag removable"
            ><span class="label"></span
            ><button
              data-icon-only="true"
              aria-label="タグを解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span></li></template
      ><input
        type="hidden"
        name="keywords"
        value="案内, 公開"
        disabled=""
        data-tag-field-target="serialized"
      />
      <p class="note" role="status" data-tag-field-target="note" hidden=""></p>
    </div>
    <div class="messages">
      <p class="help" id="tag-input-keywords-help">
        <span>入力してEnterで追加できます。</span>
      </p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="tag-input-empty">分類タグ</label></div>
    <div
      class="rx-tag-input"
      data-controller="tag-input tag-field"
      data-action="tag-input:beforeadd-&gt;tag-field#beforeAdd tag-input:add-&gt;tag-field#add tag-input:remove-&gt;tag-field#remove"
      data-tag-field-name-value="tags"
      data-tag-field-required-value="true"
    >
      <input
        id="tag-input-empty"
        name="tags"
        type="text"
        value=""
        required=""
        placeholder="入力してEnterで追加"
        data-tag-input-target="input"
        data-tag-field-target="entry"
        class="rx-input"
      />
      <ul
        class="chips"
        data-tag-field-target="list"
        aria-label="分類タグのタグ"
        hidden=""
      ></ul>
      <template data-tag-field-target="template"
        ><li data-tag-input-target="chip">
          <span class="rx-tag removable"
            ><span class="label"></span
            ><button
              data-icon-only="true"
              aria-label="タグを解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span></li></template
      ><input
        type="hidden"
        name="tags"
        value=""
        disabled=""
        data-tag-field-target="serialized"
      />
      <p class="note" role="status" data-tag-field-target="note" hidden=""></p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="tag-input-invalid">確認が必要なタグ</label></div>
    <div
      class="rx-tag-input"
      data-controller="tag-input tag-field"
      data-action="tag-input:beforeadd-&gt;tag-field#beforeAdd tag-input:add-&gt;tag-field#add tag-input:remove-&gt;tag-field#remove"
      data-tag-field-name-value="invalid-tags"
      data-tag-field-required-value="true"
    >
      <input
        id="tag-input-invalid"
        aria-describedby="tag-input-invalid-error"
        aria-invalid="true"
        data-invalid="true"
        name="invalid-tags"
        type="text"
        value=""
        required=""
        placeholder="入力してEnterで追加"
        data-tag-input-target="input"
        data-tag-field-target="entry"
        class="rx-input"
      />
      <ul
        class="chips"
        data-tag-field-target="list"
        aria-label="確認が必要なタグのタグ"
        hidden=""
      ></ul>
      <template data-tag-field-target="template"
        ><li data-tag-input-target="chip">
          <span class="rx-tag removable"
            ><span class="label"></span
            ><button
              data-icon-only="true"
              aria-label="タグを解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span></li></template
      ><input
        type="hidden"
        name="invalid-tags"
        value=""
        disabled=""
        data-tag-field-target="serialized"
      />
      <p class="note" role="status" data-tag-field-target="note" hidden=""></p>
    </div>
    <div class="messages">
      <p class="error" id="tag-input-invalid-error">
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span>タグを追加してください。</span>
      </p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="tag-input-disabled">変更できないタグ</label></div>
    <div
      class="rx-tag-input"
      data-controller="tag-input tag-field"
      data-action="tag-input:beforeadd-&gt;tag-field#beforeAdd tag-input:add-&gt;tag-field#add tag-input:remove-&gt;tag-field#remove"
      data-tag-field-name-value="locked-tags"
      data-tag-field-required-value="false"
    >
      <input
        id="tag-input-disabled"
        name="locked-tags"
        type="text"
        value="公開済み, 固定"
        disabled=""
        placeholder="入力してEnterで追加"
        data-tag-input-target="input"
        data-tag-field-target="entry"
        class="rx-input"
      />
      <ul
        class="chips"
        data-tag-field-target="list"
        aria-label="変更できないタグのタグ"
        hidden=""
      >
        <li data-tag-input-target="chip" data-tag-input-value="公開済み">
          <span class="rx-tag removable"
            ><span class="label">公開済み</span
            ><button
              data-icon-only="true"
              aria-label="公開済みを解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
              disabled=""
            ></button
          ></span>
        </li>
        <li data-tag-input-target="chip" data-tag-input-value="固定">
          <span class="rx-tag removable"
            ><span class="label">固定</span
            ><button
              data-icon-only="true"
              aria-label="固定を解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
              disabled=""
            ></button
          ></span>
        </li>
      </ul>
      <template data-tag-field-target="template"
        ><li data-tag-input-target="chip">
          <span class="rx-tag removable"
            ><span class="label"></span
            ><button
              data-icon-only="true"
              aria-label="タグを解除"
              data-tag-input-target="remove"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span></li></template
      ><input
        type="hidden"
        name="locked-tags"
        value="公開済み, 固定"
        disabled=""
        data-tag-field-target="serialized"
      />
      <p class="note" role="status" data-tag-field-target="note" hidden=""></p>
    </div>
  </div>
</div>
```

</details>
