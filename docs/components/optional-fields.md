<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# OptionalFields

必要な時だけ追加する入力欄と、追加できる項目のチップです。

## 使いどころ

- 予定のリンク・場所・招待・メモ・繰り返しのように、多くの場合は空のままの欄を隠し、必要な時だけ追加してフォームを短く見せる時に使います。
- 検索の条件を一つずつ追加する列は、`layout="stack"` でチップを縦に並べます。
- いつも入力する欄は隠さず `Field` で並べます。見出しの下の詳しい内容をまとめて開閉する時は `Disclosure` を使います。

## 使い方

`items` の一件ごとに、押すと現れる欄（`field`）とチップを作ります。追加した欄は上に積み、チップは下に並べます。チップを押すとその欄が現れ、チップは消えて、欄の最初の入力へフォーカスが移ります。追加した欄の末尾の「（`label`）を削除」を押すと、欄を隠してチップへ戻し、チップへフォーカスを移します。削除した欄の入力の値は、もう一度追加すると残っています。

値が入っている項目は `open` で最初から欄を出し、チップを出しません。保存した値から `open` を決めるのは利用側です。

欄はそれぞれ `fieldset` で包み、隠れている間は `disabled` にします。隠れた欄の入力は送信せず、`required` でも送信を止めません。送信先は、届かなかった名前を「追加していない項目」として扱います。

`OptionalFieldsController` を `optional-fields` として登録します。欄を追加すると `optional-fields:add`、削除すると `optional-fields:remove` を出します。

JavaScriptが無い時は、全ての欄を最初から出し、チップと削除の操作は出しません。全ての欄の入力を送信します。controllerが接続すると、`open` でない欄をチップへ畳みます。

## アクセシビリティ

- チップの並びは `role="group"` で、`label` を読み上げ名にします。
- チップは `aria-controls` で現れる欄を指し、`aria-expanded` で欄を出したかを伝えます。押した後はチップが消えるので、欄の最初の入力へフォーカスを移します。
- 削除の操作はアイコンだけのボタンで、「（`label`）を削除」を読み上げ名とツールチップにします。押した後は操作が消えるので、戻ったチップへフォーカスを移します。

## イベント

| イベント                 | 内容                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `optional-fields:add`    | チップを押して欄を出した後に出します。detailは `id`（追加した項目の `id`）です。取り消せません。 |
| `optional-fields:remove` | 削除の操作で欄を隠した後に出します。detailは `id`（削除した項目の `id`）です。取り消せません。   |

## API

### OptionalFields

予定のリンク・場所・招待・メモ・繰り返しや検索の条件のように、必要な時だけ追加する欄。追加できる項目をチップで並べ、押すとその欄が現れてチップは消える。欄の削除操作で元のチップへ戻す。長いフォームを短く見せる。JavaScriptが無い時は全ての欄を出し、チップと削除操作は出さない。

| 名前            | 型                         | 既定値     | 説明                                                                                      |
| --------------- | -------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                   |            | チップの並びの読み上げ名（「予定に追加する項目」など）。                                  |
| `items`（必須） | `readonly OptionalField[]` |            | 追加できる項目。並べた順にチップと欄を置く。                                              |
| `layout`        | `"inline" \| "stack"`      | `"inline"` | inlineは予定の入力のようにチップを横に並べ（既定）、stackは検索の条件のように縦に並べる。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`optional-fields`（`OptionalFieldsController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/icon.css`、`components/optional-fields.css`

#### `OptionalField`

| 名前            | 型         | 既定値 | 説明                                                                                                |
| --------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------- |
| `id`（必須）    | `string`   |        | 項目のid。欄の置き場は`<id>-slot`になり、optional-fields:addのdetail.idで返る。画面内で一意にする。 |
| `label`（必須） | `string`   |        | チップに出す項目名。                                                                                |
| `icon`          | `IconName` |        | チップの名前の前に置くアイコン。省略するとplus。                                                    |
| `field`（必須） | `Child`    |        | 押した時に現れる欄。隠れている間は中の入力を使えなくし、送信しない。                                |
| `open`          | `boolean`  |        | 最初から出しておく（値が入っている時など）。                                                        |

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

## コード

```tsx
import {
  OptionalFields,
  Field,
  Input,
  Textarea,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const field = (id: string, label: string, textarea = false) => (
  <Field id={id} label={label}>
    {(control) =>
      textarea ? (
        <Textarea {...control} name={id} rows={3} />
      ) : (
        <Input {...control} name={id} />
      )
    }
  </Field>
);

export default () => (
  <div class="rx-stack">
    <OptionalFields
      label="予定に追加する項目"
      items={[
        {
          id: "event-link",
          label: "リンク",
          icon: "link",
          field: field("event-link", "リンク"),
        },
        {
          id: "event-place",
          label: "場所",
          icon: "file",
          field: field("event-place", "場所"),
        },
        {
          id: "event-people",
          label: "招待",
          icon: "user",
          field: field("event-people", "招待する人"),
        },
        {
          id: "event-note",
          label: "メモ",
          icon: "pencil",
          field: field("event-note", "メモ", true),
        },
        {
          id: "event-repeat",
          label: "繰り返し",
          icon: "redo",
          field: field("event-repeat", "繰り返し"),
        },
      ]}
    />
    <DisclosureGroup label="並べ方と状態の違い">
      <Disclosure summary="縦に並べる（検索の条件）" open>
        <OptionalFields
          label="検索の条件"
          layout="stack"
          items={[
            {
              id: "q-has",
              label: "添付がある",
              icon: "attach",
              field: field("q-has", "添付の種類"),
            },
            {
              id: "q-words",
              label: "含む語",
              icon: "plus",
              field: field("q-words", "含む語"),
            },
            {
              id: "q-from",
              label: "差出人",
              icon: "user",
              field: field("q-from", "差出人"),
            },
            {
              id: "q-date",
              label: "期間",
              icon: "calendar",
              field: field("q-date", "期間"),
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="値が入っている項目は最初から出す">
        <OptionalFields
          label="予定に追加する項目"
          items={[
            {
              id: "open-place",
              label: "場所",
              open: true,
              field: field("open-place", "場所"),
            },
            { id: "open-note", label: "メモ", field: field("open-note", "メモ", true) },
          ]}
        />
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <OptionalFields
            label="إضافة"
            items={[
              {
                id: "rtl-place",
                label: "المكان",
                icon: "file",
                field: field("rtl-place", "المكان"),
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div
    class="rx-optional-fields"
    data-controller="optional-fields"
    data-layout="inline"
  >
    <div class="fields">
      <fieldset
        class="field"
        id="event-link-slot"
        data-open="false"
        data-optional-fields-target="field"
      >
        <div class="rx-field">
          <div class="heading"><label for="event-link">リンク</label></div>
          <input id="event-link" name="event-link" class="rx-input" />
        </div>
        <button
          data-icon-only="true"
          aria-label="リンクを削除"
          title="リンクを削除"
          data-action="optional-fields#remove"
          hidden=""
          class="rx-button remove"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use>
          </svg>
        </button>
      </fieldset>
      <fieldset
        class="field"
        id="event-place-slot"
        data-open="false"
        data-optional-fields-target="field"
      >
        <div class="rx-field">
          <div class="heading"><label for="event-place">場所</label></div>
          <input id="event-place" name="event-place" class="rx-input" />
        </div>
        <button
          data-icon-only="true"
          aria-label="場所を削除"
          title="場所を削除"
          data-action="optional-fields#remove"
          hidden=""
          class="rx-button remove"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use>
          </svg>
        </button>
      </fieldset>
      <fieldset
        class="field"
        id="event-people-slot"
        data-open="false"
        data-optional-fields-target="field"
      >
        <div class="rx-field">
          <div class="heading"><label for="event-people">招待する人</label></div>
          <input id="event-people" name="event-people" class="rx-input" />
        </div>
        <button
          data-icon-only="true"
          aria-label="招待を削除"
          title="招待を削除"
          data-action="optional-fields#remove"
          hidden=""
          class="rx-button remove"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use>
          </svg>
        </button>
      </fieldset>
      <fieldset
        class="field"
        id="event-note-slot"
        data-open="false"
        data-optional-fields-target="field"
      >
        <div class="rx-field">
          <div class="heading"><label for="event-note">メモ</label></div>
          <textarea
            id="event-note"
            name="event-note"
            rows="3"
            class="rx-input"
          ></textarea>
        </div>
        <button
          data-icon-only="true"
          aria-label="メモを削除"
          title="メモを削除"
          data-action="optional-fields#remove"
          hidden=""
          class="rx-button remove"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use>
          </svg>
        </button>
      </fieldset>
      <fieldset
        class="field"
        id="event-repeat-slot"
        data-open="false"
        data-optional-fields-target="field"
      >
        <div class="rx-field">
          <div class="heading"><label for="event-repeat">繰り返し</label></div>
          <input id="event-repeat" name="event-repeat" class="rx-input" />
        </div>
        <button
          data-icon-only="true"
          aria-label="繰り返しを削除"
          title="繰り返しを削除"
          data-action="optional-fields#remove"
          hidden=""
          class="rx-button remove"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use>
          </svg>
        </button>
      </fieldset>
    </div>
    <div class="chips" role="group" aria-label="予定に追加する項目">
      <button
        aria-controls="event-link-slot"
        aria-expanded="false"
        hidden=""
        data-action="optional-fields#add"
        class="rx-button chip"
        type="button"
        data-variant="secondary"
        data-size="compact"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-link"></use></svg
        >リンク</button
      ><button
        aria-controls="event-place-slot"
        aria-expanded="false"
        hidden=""
        data-action="optional-fields#add"
        class="rx-button chip"
        type="button"
        data-variant="secondary"
        data-size="compact"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-file"></use></svg
        >場所</button
      ><button
        aria-controls="event-people-slot"
        aria-expanded="false"
        hidden=""
        data-action="optional-fields#add"
        class="rx-button chip"
        type="button"
        data-variant="secondary"
        data-size="compact"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-user"></use></svg
        >招待</button
      ><button
        aria-controls="event-note-slot"
        aria-expanded="false"
        hidden=""
        data-action="optional-fields#add"
        class="rx-button chip"
        type="button"
        data-variant="secondary"
        data-size="compact"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
        >メモ</button
      ><button
        aria-controls="event-repeat-slot"
        aria-expanded="false"
        hidden=""
        data-action="optional-fields#add"
        class="rx-button chip"
        type="button"
        data-variant="secondary"
        data-size="compact"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-redo"></use></svg
        >繰り返し
      </button>
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="並べ方と状態の違い">
    <details open="" class="rx-disclosure">
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
        ><span class="label"><span class="title">縦に並べる（検索の条件）</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-optional-fields"
          data-controller="optional-fields"
          data-layout="stack"
        >
          <div class="fields">
            <fieldset
              class="field"
              id="q-has-slot"
              data-open="false"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="q-has">添付の種類</label></div>
                <input id="q-has" name="q-has" class="rx-input" />
              </div>
              <button
                data-icon-only="true"
                aria-label="添付があるを削除"
                title="添付があるを削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
            <fieldset
              class="field"
              id="q-words-slot"
              data-open="false"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="q-words">含む語</label></div>
                <input id="q-words" name="q-words" class="rx-input" />
              </div>
              <button
                data-icon-only="true"
                aria-label="含む語を削除"
                title="含む語を削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
            <fieldset
              class="field"
              id="q-from-slot"
              data-open="false"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="q-from">差出人</label></div>
                <input id="q-from" name="q-from" class="rx-input" />
              </div>
              <button
                data-icon-only="true"
                aria-label="差出人を削除"
                title="差出人を削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
            <fieldset
              class="field"
              id="q-date-slot"
              data-open="false"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="q-date">期間</label></div>
                <input id="q-date" name="q-date" class="rx-input" />
              </div>
              <button
                data-icon-only="true"
                aria-label="期間を削除"
                title="期間を削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
          </div>
          <div class="chips" role="group" aria-label="検索の条件">
            <button
              aria-controls="q-has-slot"
              aria-expanded="false"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-attach"></use></svg
              >添付がある</button
            ><button
              aria-controls="q-words-slot"
              aria-expanded="false"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-plus"></use></svg
              >含む語</button
            ><button
              aria-controls="q-from-slot"
              aria-expanded="false"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-user"></use></svg
              >差出人</button
            ><button
              aria-controls="q-date-slot"
              aria-expanded="false"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use></svg
              >期間
            </button>
          </div>
        </div>
      </div>
    </details>
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
          ><span class="title">値が入っている項目は最初から出す</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-optional-fields"
          data-controller="optional-fields"
          data-layout="inline"
        >
          <div class="fields">
            <fieldset
              class="field"
              id="open-place-slot"
              data-open="true"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="open-place">場所</label></div>
                <input id="open-place" name="open-place" class="rx-input" />
              </div>
              <button
                data-icon-only="true"
                aria-label="場所を削除"
                title="場所を削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
            <fieldset
              class="field"
              id="open-note-slot"
              data-open="false"
              data-optional-fields-target="field"
            >
              <div class="rx-field">
                <div class="heading"><label for="open-note">メモ</label></div>
                <textarea
                  id="open-note"
                  name="open-note"
                  rows="3"
                  class="rx-input"
                ></textarea>
              </div>
              <button
                data-icon-only="true"
                aria-label="メモを削除"
                title="メモを削除"
                data-action="optional-fields#remove"
                hidden=""
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use>
                </svg>
              </button>
            </fieldset>
          </div>
          <div class="chips" role="group" aria-label="予定に追加する項目">
            <button
              aria-controls="open-place-slot"
              aria-expanded="true"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-plus"></use></svg
              >場所</button
            ><button
              aria-controls="open-note-slot"
              aria-expanded="false"
              hidden=""
              data-action="optional-fields#add"
              class="rx-button chip"
              type="button"
              data-variant="secondary"
              data-size="compact"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-plus"></use></svg
              >メモ
            </button>
          </div>
        </div>
      </div>
    </details>
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <div
            class="rx-optional-fields"
            data-controller="optional-fields"
            data-layout="inline"
          >
            <div class="fields">
              <fieldset
                class="field"
                id="rtl-place-slot"
                data-open="false"
                data-optional-fields-target="field"
              >
                <div class="rx-field">
                  <div class="heading"><label for="rtl-place">المكان</label></div>
                  <input id="rtl-place" name="rtl-place" class="rx-input" />
                </div>
                <button
                  data-icon-only="true"
                  aria-label="المكانを削除"
                  title="المكانを削除"
                  data-action="optional-fields#remove"
                  hidden=""
                  class="rx-button remove"
                  type="button"
                  data-variant="link"
                  data-size="default"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x"></use>
                  </svg>
                </button>
              </fieldset>
            </div>
            <div class="chips" role="group" aria-label="إضافة">
              <button
                aria-controls="rtl-place-slot"
                aria-expanded="false"
                hidden=""
                data-action="optional-fields#add"
                class="rx-button chip"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-file"></use></svg
                >المكان
              </button>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
