<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Suggestion

自由に入力できる欄に、候補を表示します。

## 使いどころ

- 記事の分類のように、よく使う値を候補で示しつつ、候補に無い値もそのまま入力させる時に使います。
- 候補の中からだけ選ばせる時は、少なければ `Select`、多くて探す時は `Picker` を使います。
- 打った文字で絞り込まず、候補の一覧を開いて選ぶだけでよい時は `Combobox` を使います。値を複数付ける時は `TagInput` を使います。

## 使い方

`Field` と同じラベル・補足・エラーの付いた一行の入力に、候補の一覧を添えます。`id` を省略すると生成します。`name`・`value`・`required`・`placeholder` などの残りの属性は入力へ渡します。

打つたびに、候補の文字列の中に入力を含むものへ絞り込みます。全角と半角、大文字と小文字は区別しません。一致する候補がある時だけ一覧を開き、一つも無い時は「一致する候補はありません。入力した内容をそのまま使えます。」と伝えます。日本語の変換中は絞り込まず、確定してから絞り込みます。

欄を押すと今の入力で絞り込んだ一覧を開き、右の矢印を押すと絞り込まずに全ての候補を開閉します。候補を選ぶと、その文字列を欄の値にして一覧を閉じ、欄へフォーカスを戻します。候補に無い値も、打ったまま送信します。

`readonly`・`disabled` の間は一覧を開きません。フォームをリセットすると、絞り込みを解いて一覧を閉じます。

`SuggestionController` を `suggestion` として登録します。候補を選ぶと `combobox:change` に加えて、欄で標準の `input`・`change` を発火するので、打った時と同じ受け取り方で値の変化を受け取れます。

JavaScriptが無い時は、標準の `datalist` で候補を出し、右の矢印は出しません。

## キーボード

| キー                             | 動作                                 |
| -------------------------------- | ------------------------------------ |
| ↓ / ↑                            | 一覧を開き、次・前の候補へ移ります。 |
| Home / End（一覧が開いている時） | 最初・最後の候補へ移ります。         |
| Enter（一覧が開いている時）      | 移った候補を選びます。               |
| Escape（一覧が開いている時）     | 一覧を閉じます。                     |

## アクセシビリティ

- 欄は `role="combobox"` と `aria-autocomplete="list"` で、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。
- 候補の一覧は「（`label`）の候補」、右の矢印は「（`label`）の候補を開閉」という読み上げ名にします。
- 一致する候補が無い時の知らせは `role="status"` の領域で読み上げます。
- `help`・`error` は `Field` と同じく説明として関連付け、`error` がある時は欄を `aria-invalid` にします。

## イベント

| イベント                         | 内容                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `combobox:beforechange`          | 候補を選ぶ前に出します。取り消せます。detailは `value`（選ぶ候補）・`previousValue`・`reason`（`pointer` か `keyboard`）です。 |
| `combobox:change`                | 候補を選んだ後に出します。detailは `combobox:beforechange` と同じです。続けて欄で標準の `input`・`change` を発火します。       |
| `combobox:open / combobox:close` | 矢印キーで一覧を開いた時、Escapeで閉じた時に出します。detailは `reason`（`keyboard`）です。                                    |

## API

### Suggestion

自由に入力でき、打った文字で絞り込んだ候補からも選べる欄。残りの属性はinputへ渡す。

| 名前              | 型                  | 既定値 | 説明                                                                             |
| ----------------- | ------------------- | ------ | -------------------------------------------------------------------------------- |
| `label`（必須）   | `string`            |        | 欄のラベル。候補の一覧と開閉の操作の読み上げ名にも使う。                         |
| `options`（必須） | `readonly string[]` |        | 候補の文字列。空白だけの値と重なった値は除く。選ぶと、その文字列が欄の値になる。 |
| `help`            | `string`            |        | 欄の下に出す淡い補足。Fieldと同じく説明として読み上げる。                        |
| `error`           | `string`            |        | 直す所を書くエラー文。Fieldと同じく欄をaria-invalidにし、説明として読み上げる。  |

ほかのpropsは`Input`へそのまま渡します。

登録するcontroller：`suggestion`（`SuggestionController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/overlay.css`、`components/field.css`、`components/icon.css`、`components/suggestion.css`

## コード

```tsx
import { Disclosure, Button, Field, Input, Suggestion } from "@tknf/retrix/hono";

export default () => (
  <form class="rx-stack" aria-label="記事の分類設定">
    <Field id="hono-suggestion-title" label="記事名">
      {(attributes) => <Input {...attributes} value="仕事場だより" />}
    </Field>
    <Suggestion
      id="hono-category"
      name="category"
      label="分類（自由入力可）"
      options={["お知らせ", "暮らし", "仕事場", "仕事の道具", "イベント", "制作ノート"]}
      placeholder="入力または候補から選択"
      help="入力すると候補を絞り込みます。候補にない分類もそのまま使えます。"
    />
    <Disclosure summary="初期値・候補なし・エラー・利用不可">
      <div class="rx-stack">
        <Suggestion
          label="初期値のある分類"
          options={["制作", "編集", "運営"]}
          value="編集"
        />
        <Suggestion label="新しい分類" options={[]} placeholder="分類を入力" />
        <Suggestion
          label="分類（必須）"
          options={["お知らせ", "暮らし", "仕事場"]}
          error="分類を入力してください。"
          required
        />
        <Suggestion
          label="分類（利用不可）"
          options={["お知らせ", "暮らし"]}
          value="暮らし"
          disabled
        />
        <Suggestion
          label="分類（読み取り専用）"
          options={["お知らせ", "暮らし"]}
          value="お知らせ"
          readonly
        />
        <Suggestion
          label="長い分類名"
          options={[
            "仕事場で使い続けたい道具と日々の小さな工夫について",
            "地域の暮らしと人のつながりを紹介する読みもの",
          ]}
        />
      </div>
    </Disclosure>
    <Button type="reset">初期値に戻す</Button>
  </form>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<form class="rx-stack" aria-label="記事の分類設定">
  <div class="rx-field">
    <div class="heading"><label for="hono-suggestion-title">記事名</label></div>
    <input id="hono-suggestion-title" value="仕事場だより" class="rx-input" />
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-category">分類（自由入力可）</label></div>
    <div class="rx-combobox rx-suggestion" data-controller="suggestion">
      <input
        name="category"
        placeholder="入力または候補から選択"
        id="hono-category"
        aria-describedby="hono-category-help"
        type="text"
        autocomplete="off"
        list="hono-category-options"
        data-suggestion-target="input"
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        aria-label="分類（自由入力可）の候補を開閉"
        aria-haspopup="listbox"
        aria-controls="hono-category-listbox"
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
        id="hono-category-listbox"
        role="listbox"
        aria-label="分類（自由入力可）の候補"
        data-suggestion-target="listbox"
        hidden=""
      >
        <li
          id="hono-category-option-0"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="お知らせ"
        >
          お知らせ
        </li>
        <li
          id="hono-category-option-1"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="暮らし"
        >
          暮らし
        </li>
        <li
          id="hono-category-option-2"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="仕事場"
        >
          仕事場
        </li>
        <li
          id="hono-category-option-3"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="仕事の道具"
        >
          仕事の道具
        </li>
        <li
          id="hono-category-option-4"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="イベント"
        >
          イベント
        </li>
        <li
          id="hono-category-option-5"
          role="option"
          aria-selected="false"
          data-suggestion-target="option"
          data-combobox-value="制作ノート"
        >
          制作ノート
        </li>
      </ul>
      <p class="note" role="status"></p>
      <datalist id="hono-category-options">
        <option value="お知らせ"></option>
        <option value="暮らし"></option>
        <option value="仕事場"></option>
        <option value="仕事の道具"></option>
        <option value="イベント"></option>
        <option value="制作ノート"></option>
      </datalist>
    </div>
    <div class="messages">
      <p class="help" id="hono-category-help">
        <span>入力すると候補を絞り込みます。候補にない分類もそのまま使えます。</span>
      </p>
    </div>
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
      ><span class="label"
        ><span class="title">初期値・候補なし・エラー・利用不可</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div class="rx-field">
          <div class="heading">
            <label for="rx-suggestion-:rq:">初期値のある分類</label>
          </div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              value="編集"
              id="rx-suggestion-:rq:"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:rq:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="初期値のある分類の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:rq:-listbox"
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
              id="rx-suggestion-:rq:-listbox"
              role="listbox"
              aria-label="初期値のある分類の候補"
              data-suggestion-target="listbox"
              hidden=""
            >
              <li
                id="rx-suggestion-:rq:-option-0"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="制作"
              >
                制作
              </li>
              <li
                id="rx-suggestion-:rq:-option-1"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="編集"
              >
                編集
              </li>
              <li
                id="rx-suggestion-:rq:-option-2"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="運営"
              >
                運営
              </li>
            </ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:rq:-options">
              <option value="制作"></option>
              <option value="編集"></option>
              <option value="運営"></option>
            </datalist>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading"><label for="rx-suggestion-:rr:">新しい分類</label></div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              placeholder="分類を入力"
              id="rx-suggestion-:rr:"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:rr:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="新しい分類の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:rr:-listbox"
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
              id="rx-suggestion-:rr:-listbox"
              role="listbox"
              aria-label="新しい分類の候補"
              data-suggestion-target="listbox"
              hidden=""
            ></ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:rr:-options"></datalist>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="rx-suggestion-:rs:">分類（必須）</label>
          </div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              required=""
              id="rx-suggestion-:rs:"
              aria-describedby="rx-suggestion-:rs:-error"
              aria-invalid="true"
              data-invalid="true"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:rs:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="分類（必須）の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:rs:-listbox"
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
              id="rx-suggestion-:rs:-listbox"
              role="listbox"
              aria-label="分類（必須）の候補"
              data-suggestion-target="listbox"
              hidden=""
            >
              <li
                id="rx-suggestion-:rs:-option-0"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="お知らせ"
              >
                お知らせ
              </li>
              <li
                id="rx-suggestion-:rs:-option-1"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="暮らし"
              >
                暮らし
              </li>
              <li
                id="rx-suggestion-:rs:-option-2"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="仕事場"
              >
                仕事場
              </li>
            </ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:rs:-options">
              <option value="お知らせ"></option>
              <option value="暮らし"></option>
              <option value="仕事場"></option>
            </datalist>
          </div>
          <div class="messages">
            <p class="error" id="rx-suggestion-:rs:-error">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>分類を入力してください。</span>
            </p>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="rx-suggestion-:rt:">分類（利用不可）</label>
          </div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              value="暮らし"
              disabled=""
              id="rx-suggestion-:rt:"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:rt:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="分類（利用不可）の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:rt:-listbox"
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
              id="rx-suggestion-:rt:-listbox"
              role="listbox"
              aria-label="分類（利用不可）の候補"
              data-suggestion-target="listbox"
              hidden=""
            >
              <li
                id="rx-suggestion-:rt:-option-0"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="お知らせ"
              >
                お知らせ
              </li>
              <li
                id="rx-suggestion-:rt:-option-1"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="暮らし"
              >
                暮らし
              </li>
            </ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:rt:-options">
              <option value="お知らせ"></option>
              <option value="暮らし"></option>
            </datalist>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="rx-suggestion-:ru:">分類（読み取り専用）</label>
          </div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              value="お知らせ"
              readonly=""
              id="rx-suggestion-:ru:"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:ru:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="分類（読み取り専用）の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:ru:-listbox"
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
              id="rx-suggestion-:ru:-listbox"
              role="listbox"
              aria-label="分類（読み取り専用）の候補"
              data-suggestion-target="listbox"
              hidden=""
            >
              <li
                id="rx-suggestion-:ru:-option-0"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="お知らせ"
              >
                お知らせ
              </li>
              <li
                id="rx-suggestion-:ru:-option-1"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="暮らし"
              >
                暮らし
              </li>
            </ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:ru:-options">
              <option value="お知らせ"></option>
              <option value="暮らし"></option>
            </datalist>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading"><label for="rx-suggestion-:rv:">長い分類名</label></div>
          <div class="rx-combobox rx-suggestion" data-controller="suggestion">
            <input
              id="rx-suggestion-:rv:"
              type="text"
              autocomplete="off"
              list="rx-suggestion-:rv:-options"
              data-suggestion-target="input"
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              aria-label="長い分類名の候補を開閉"
              aria-haspopup="listbox"
              aria-controls="rx-suggestion-:rv:-listbox"
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
              id="rx-suggestion-:rv:-listbox"
              role="listbox"
              aria-label="長い分類名の候補"
              data-suggestion-target="listbox"
              hidden=""
            >
              <li
                id="rx-suggestion-:rv:-option-0"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="仕事場で使い続けたい道具と日々の小さな工夫について"
              >
                仕事場で使い続けたい道具と日々の小さな工夫について
              </li>
              <li
                id="rx-suggestion-:rv:-option-1"
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value="地域の暮らしと人のつながりを紹介する読みもの"
              >
                地域の暮らしと人のつながりを紹介する読みもの
              </li>
            </ul>
            <p class="note" role="status"></p>
            <datalist id="rx-suggestion-:rv:-options">
              <option
                value="仕事場で使い続けたい道具と日々の小さな工夫について"
              ></option>
              <option value="地域の暮らしと人のつながりを紹介する読みもの"></option>
            </datalist>
          </div>
        </div>
      </div>
    </div>
  </details>
  <button class="rx-button" type="reset" data-variant="secondary" data-size="default">
    初期値に戻す
  </button>
</form>
```

</details>
