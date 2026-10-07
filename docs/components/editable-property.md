<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# EditableProperty

値をその場で編集し、確定と取り消しの操作をそろえます。

## 使いどころ

- 担当者・件名・メモのように、属性の一つだけを画面を移らずに書き換えさせる時に使います。
- 複数の値をまとめて入力して送る時は `Field` で組んだフォーム、読むだけの属性は `ValueList` を使います。

## 使い方

`id`・`label`・`name` を渡し、`value` に今の値を渡します。項目名は小さな太字、表示の値は下線も枠もない文字です。値のすぐ後ろに灰色の鉛筆を置き、値と鉛筆を囲む領域にホバーすると、押すと書き換えられることを示す黄色のハイライト（#ffffcc）の面を出します。鉛筆はホバーすると赤になります。値が空の時は `emptyLabel` を灰色で出します。

鉛筆を押しても、値そのものを押しても書き始めます（文字を選んでいる時は書き始めません）。一行の値は全体を選び、そのまま打てば置き換わります。`multiline` の値は末尾から書き足せ、表示でも改行をそのまま出します。書いている間は同じ位置を、一行の入力欄と同じ白い欄（1px #dedede の枠）にし、フォーカスすると青い縁と外側の淡い青の輪を出します。表示と編集で文字の大きさ・一行目の高さ・書き始めは変わりません。

確定（小さい主操作）と取消（文字だけの操作）は、一行・複数行とも欄の下に並べます。確定は `Control + Enter`・`⌘ + Enter`、取消は `Escape` でもでき、Enterだけでは確定しません。確定すると新しい値を表示へ移し、鉛筆の位置に緑のチェックの完了のマークを1.6秒出します（アニメーションはしません）。確定・取消の後はフォーカスを鉛筆に戻します。

`required`・`maxLength` は欄の標準の検証として働き、確定の時に検証して、通らなければ書いたまま検証メッセージを出します。フォームの送信で検証に通らなかった時も、書いている状態に切り替えます。

保存は `editable:commit` で受け取り、保存しない時は `editable:beforecommit` を取り消します。確定した値は欄に残るので、`form` に結び付けてフォームの値として送ることもできます。フォームのリセットでは最初の値に戻して表示に戻ります。保存・保存失敗の通知・値の検証ルールは利用側が持ちます。

`EditableController` を `editable`、`EditablePropertyController` を `editable-property` として登録します。JavaScriptなしでは、確定・取消を隠した通常の入力欄として表示し、フォームで値を送れます。

## キーボード

| キー                        | 動作                                                 |
| --------------------------- | ---------------------------------------------------- |
| Enter / Space（鉛筆）       | 書き始めます。                                       |
| Control + Enter / ⌘ + Enter | 書いている値を確定します。                           |
| Escape                      | 書いている値を捨て、書き始める前の値に戻します。     |
| Enter                       | 一行の欄では何もしません。複数行の欄では改行します。 |

## アクセシビリティ

- 欄は `aria-labelledby` で `label` を名前にします。鉛筆の読み上げ名は「〇〇を編集」で、`aria-controls` で欄を指し、`aria-expanded` で書いているかを示します。
- 確定のボタンには `aria-keyshortcuts="Control+Enter Meta+Enter"` を付けます。
- 値そのものはフォーカスを受けません。キーボードでは鉛筆から書き始めます。
- 日本語入力の変換中のEnter・Escapeは、確定・取消に使いません。

## イベント

| イベント                | 内容                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `editable:beforeedit`   | 鉛筆か値そのものを押して書き始める前に発火します。取り消せます。detailは `{ value, previousValue, reason }` で、`reason` は `pointer`・`keyboard` です。      |
| `editable:edit`         | 書き始めた後に発火します。detailは `editable:beforeedit` と同じです。                                                                                         |
| `editable:beforecommit` | 確定の前に、検証を通った時だけ発火します。取り消せます（書いている状態のまま残ります）。detailの `value` は新しい値、`previousValue` は書き始める前の値です。 |
| `editable:commit`       | 確定した後に発火します。detailは `editable:beforecommit` と同じで、ここで保存します。                                                                         |
| `editable:beforecancel` | 取消の前に発火します。取り消せます。detailの `value` は戻す値、`previousValue` は書いていた値です。                                                           |
| `editable:cancel`       | 取り消して元の値に戻した後に発火します。detailは `editable:beforecancel` と同じです。                                                                         |

## API

### EditableProperty

値の位置で文字列を編集する。保存処理は利用側がeditable:commitで受け取る。一行・複数行とも、確定はControl+Enter / Meta+Enter、取消はEscapeにそろえる。

| 名前            | 型        | 既定値     | 説明                                                                                                           |
| --------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `id`（必須）    | `string`  |            | コンポーネント内の要素のidの元。`${id}-label`・`${id}-input`・`${id}-editor`を作るので、画面の中で一意にする。 |
| `label`（必須） | `string`  |            | 項目名。値の上に出し、欄の名前（aria-labelledby）と鉛筆ボタンの読み上げ名「〇〇を編集」にも使う。              |
| `name`（必須）  | `string`  |            | 欄のname。フォームで送る時の名前になる。                                                                       |
| `value`         | `string`  | `""`       | 最初の値。確定した値は欄に残り、フォームで送れる。                                                             |
| `emptyLabel`    | `string`  | `"未登録"` | 値が空の時に表示の位置へ出す灰色の文字。                                                                       |
| `required`      | `boolean` |            | 空のままでは確定できなくする。確定の時に欄の標準の検証を行う。                                                 |
| `disabled`      | `boolean` |            | 編集できなくする。鉛筆ボタンを押せず、値を押しても編集を始めない。欄も無効になるので、フォームでは送られない。 |
| `form`          | `string`  |            | 欄を結び付けるformのid。コンポーネントがformの外にある時に使う。                                               |
| `maxLength`     | `number`  |            | 入力できる文字数の上限。欄のmaxlengthに入れる。                                                                |
| `multiline`     | `boolean` | `false`    | 複数行の値。複数行の欄で入力し、改行はそのまま表示する。                                                       |

登録するcontroller：`editable`（`EditableController`）、`editable-property`（`EditablePropertyController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/editable-property.css`

## コード

```tsx
import {
  EditableProperty,
  Button,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <EditableProperty
      id="property-owner"
      label="担当者"
      name="owner"
      value="田中 遥"
      required
    />
    <EditableProperty id="property-note" label="メモ" name="note" emptyLabel="未登録" />
    <EditableProperty
      id="property-summary"
      label="打ち合わせの要点"
      name="summary"
      value={"カテゴリは5つにまとめる。\n公開は9月30日。\n次回は10月7日の14時から。"}
      multiline
    />
    <p class="catalog-footnote">
      値か鉛筆のアイコンを押して編集を始め、⌘＋Enter（WindowsなどではCtrl＋Enter）か「確定」で編集を終えます。Escapeか「取消」で元の値に戻します。一行でも複数行でも同じで、Enterだけでは確定しません。
    </p>
    <DisclosureGroup label="値と置き場所の違い">
      <Disclosure summary="項目を並べる" open>
        <div class="rx-split">
          <EditableProperty
            id="sheet-title"
            label="件名"
            name="title"
            value="秋の読書会のお知らせ"
            required
          />
          <EditableProperty
            id="sheet-owner"
            label="担当者"
            name="sheet-owner"
            value="森 美咲"
          />
          <EditableProperty
            id="sheet-date"
            label="公開日"
            name="date"
            value="9月30日"
          />
          <EditableProperty
            id="sheet-code"
            label="管理番号（8文字まで）"
            name="code"
            value="AUT-0930"
            maxLength={8}
          />
        </div>
      </Disclosure>
      <Disclosure summary="複数行：空のメモと長い文">
        <div class="rx-split">
          <EditableProperty
            id="property-memo-empty"
            label="引き継ぎのメモ"
            name="handover"
            emptyLabel="未登録"
            multiline
          />
          <EditableProperty
            id="property-memo-long"
            label="会場の案内"
            name="guide"
            value={
              "入口右手の窓口で名前をお伝えください。会議室の鍵は、予約した時間の5分前からお渡しします。\n長期利用の方は、月初めに利用票を提出してください。"
            }
            multiline
          />
        </div>
      </Disclosure>
      <Disclosure summary="空のままでは確定できない値">
        <EditableProperty
          id="property-required"
          label="連絡先"
          name="contact"
          emptyLabel="未登録（必須）"
          required
        />
      </Disclosure>
      <Disclosure summary="編集できない値">
        <EditableProperty
          id="property-disabled"
          label="作成者"
          name="author"
          value="佐藤 健"
          disabled
        />
      </Disclosure>
      <Disclosure summary="長い値">
        <EditableProperty
          id="property-long"
          label="共有リンク"
          name="link"
          value="https://example.com/articles/autumn-reading-club-2026-abcdefghijklmnopqrstuvwxyz0123456789"
        />
      </Disclosure>
      <Disclosure summary="フォームで送る値と取り消し">
        <form id="property-form" class="rx-stack" action="/apps/people" method="get">
          <EditableProperty
            id="property-form-place"
            label="会場"
            name="place"
            value="3階の会議室"
            form="property-form"
          />
          <div class="rx-cluster">
            <Button type="submit" variant="primary">
              送信する
            </Button>
            <Button type="reset">最初の値に戻す</Button>
          </div>
        </form>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EditableProperty
            id="property-rtl"
            label="المسؤول"
            name="owner-rtl"
            value="سارة"
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
    class="rx-editable-property"
    data-controller="editable editable-property"
    data-editable-commit-key-value="modifier-enter"
    data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
    data-editable-property-empty-value="未登録"
  >
    <span class="label" id="property-owner-label">担当者</span>
    <div class="preview" data-editable-target="preview" hidden="">
      <span
        class="value"
        data-editable-property-target="value"
        data-action="click-&gt;editable-property#start"
        >田中 遥</span
      ><button
        data-icon-only="true"
        aria-label="担当者を編集"
        data-editable-target="edit"
        aria-controls="property-owner-editor"
        aria-expanded="false"
        class="rx-button edit"
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
          <use href="/assets/rx-icons.svg#rx-pencil"></use>
        </svg>
      </button>
    </div>
    <div class="editor" id="property-owner-editor" data-editable-target="editor">
      <input
        id="property-owner-input"
        aria-labelledby="property-owner-label"
        name="owner"
        required=""
        data-editable-target="input"
        data-editable-property-target="input"
        value="田中 遥"
        class="rx-input"
      />
      <div class="actions">
        <button
          data-editable-target="save"
          aria-keyshortcuts="Control+Enter Meta+Enter"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="compact"
        >
          確定</button
        ><button
          data-editable-target="cancel"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          取消
        </button>
      </div>
    </div>
  </div>
  <div
    class="rx-editable-property"
    data-controller="editable editable-property"
    data-editable-commit-key-value="modifier-enter"
    data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
    data-editable-property-empty-value="未登録"
  >
    <span class="label" id="property-note-label">メモ</span>
    <div class="preview" data-editable-target="preview" hidden="">
      <span
        class="value"
        data-editable-property-target="value"
        data-action="click-&gt;editable-property#start"
        data-empty="true"
        >未登録</span
      ><button
        data-icon-only="true"
        aria-label="メモを編集"
        data-editable-target="edit"
        aria-controls="property-note-editor"
        aria-expanded="false"
        class="rx-button edit"
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
          <use href="/assets/rx-icons.svg#rx-pencil"></use>
        </svg>
      </button>
    </div>
    <div class="editor" id="property-note-editor" data-editable-target="editor">
      <input
        id="property-note-input"
        aria-labelledby="property-note-label"
        name="note"
        data-editable-target="input"
        data-editable-property-target="input"
        value=""
        class="rx-input"
      />
      <div class="actions">
        <button
          data-editable-target="save"
          aria-keyshortcuts="Control+Enter Meta+Enter"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="compact"
        >
          確定</button
        ><button
          data-editable-target="cancel"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          取消
        </button>
      </div>
    </div>
  </div>
  <div
    class="rx-editable-property"
    data-multiline="true"
    data-controller="editable editable-property"
    data-editable-commit-key-value="modifier-enter"
    data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
    data-editable-property-empty-value="未登録"
  >
    <span class="label" id="property-summary-label">打ち合わせの要点</span>
    <div class="preview" data-editable-target="preview" hidden="">
      <span
        class="value"
        data-editable-property-target="value"
        data-action="click-&gt;editable-property#start"
        >カテゴリは5つにまとめる。 公開は9月30日。 次回は10月7日の14時から。</span
      ><button
        data-icon-only="true"
        aria-label="打ち合わせの要点を編集"
        data-editable-target="edit"
        aria-controls="property-summary-editor"
        aria-expanded="false"
        class="rx-button edit"
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
          <use href="/assets/rx-icons.svg#rx-pencil"></use>
        </svg>
      </button>
    </div>
    <div class="editor" id="property-summary-editor" data-editable-target="editor">
      <textarea
        id="property-summary-input"
        aria-labelledby="property-summary-label"
        name="summary"
        data-editable-target="input"
        data-editable-property-target="input"
        class="rx-input"
      >
カテゴリは5つにまとめる。
公開は9月30日。
次回は10月7日の14時から。</textarea>
      <div class="actions">
        <button
          data-editable-target="save"
          aria-keyshortcuts="Control+Enter Meta+Enter"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="compact"
        >
          確定</button
        ><button
          data-editable-target="cancel"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          取消
        </button>
      </div>
    </div>
  </div>
  <p class="catalog-footnote">
    値か鉛筆のアイコンを押して編集を始め、⌘＋Enter（WindowsなどではCtrl＋Enter）か「確定」で編集を終えます。Escapeか「取消」で元の値に戻します。一行でも複数行でも同じで、Enterだけでは確定しません。
  </p>
  <div class="rx-disclosure-group" role="group" aria-label="値と置き場所の違い">
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
        ><span class="label"><span class="title">項目を並べる</span></span>
      </summary>
      <div class="body">
        <div class="rx-split">
          <div
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="sheet-title-label">件名</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >秋の読書会のお知らせ</span
              ><button
                data-icon-only="true"
                aria-label="件名を編集"
                data-editable-target="edit"
                aria-controls="sheet-title-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div class="editor" id="sheet-title-editor" data-editable-target="editor">
              <input
                id="sheet-title-input"
                aria-labelledby="sheet-title-label"
                name="title"
                required=""
                data-editable-target="input"
                data-editable-property-target="input"
                value="秋の読書会のお知らせ"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          <div
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="sheet-owner-label">担当者</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >森 美咲</span
              ><button
                data-icon-only="true"
                aria-label="担当者を編集"
                data-editable-target="edit"
                aria-controls="sheet-owner-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div class="editor" id="sheet-owner-editor" data-editable-target="editor">
              <input
                id="sheet-owner-input"
                aria-labelledby="sheet-owner-label"
                name="sheet-owner"
                data-editable-target="input"
                data-editable-property-target="input"
                value="森 美咲"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          <div
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="sheet-date-label">公開日</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >9月30日</span
              ><button
                data-icon-only="true"
                aria-label="公開日を編集"
                data-editable-target="edit"
                aria-controls="sheet-date-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div class="editor" id="sheet-date-editor" data-editable-target="editor">
              <input
                id="sheet-date-input"
                aria-labelledby="sheet-date-label"
                name="date"
                data-editable-target="input"
                data-editable-property-target="input"
                value="9月30日"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          <div
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="sheet-code-label">管理番号（8文字まで）</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >AUT-0930</span
              ><button
                data-icon-only="true"
                aria-label="管理番号（8文字まで）を編集"
                data-editable-target="edit"
                aria-controls="sheet-code-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div class="editor" id="sheet-code-editor" data-editable-target="editor">
              <input
                id="sheet-code-input"
                aria-labelledby="sheet-code-label"
                name="code"
                maxlength="8"
                data-editable-target="input"
                data-editable-property-target="input"
                value="AUT-0930"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
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
        ><span class="label"><span class="title">複数行：空のメモと長い文</span></span>
      </summary>
      <div class="body">
        <div class="rx-split">
          <div
            class="rx-editable-property"
            data-multiline="true"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="property-memo-empty-label">引き継ぎのメモ</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                data-empty="true"
                >未登録</span
              ><button
                data-icon-only="true"
                aria-label="引き継ぎのメモを編集"
                data-editable-target="edit"
                aria-controls="property-memo-empty-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div
              class="editor"
              id="property-memo-empty-editor"
              data-editable-target="editor"
            >
              <textarea
                id="property-memo-empty-input"
                aria-labelledby="property-memo-empty-label"
                name="handover"
                data-editable-target="input"
                data-editable-property-target="input"
                class="rx-input"
              ></textarea>
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          <div
            class="rx-editable-property"
            data-multiline="true"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="property-memo-long-label">会場の案内</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >入口右手の窓口で名前をお伝えください。会議室の鍵は、予約した時間の5分前からお渡しします。
                長期利用の方は、月初めに利用票を提出してください。</span
              ><button
                data-icon-only="true"
                aria-label="会場の案内を編集"
                data-editable-target="edit"
                aria-controls="property-memo-long-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div
              class="editor"
              id="property-memo-long-editor"
              data-editable-target="editor"
            >
              <textarea
                id="property-memo-long-input"
                aria-labelledby="property-memo-long-label"
                name="guide"
                data-editable-target="input"
                data-editable-property-target="input"
                class="rx-input"
              >
入口右手の窓口で名前をお伝えください。会議室の鍵は、予約した時間の5分前からお渡しします。
長期利用の方は、月初めに利用票を提出してください。</textarea>
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
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
          ><span class="title">空のままでは確定できない値</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-editable-property"
          data-controller="editable editable-property"
          data-editable-commit-key-value="modifier-enter"
          data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
          data-editable-property-empty-value="未登録（必須）"
        >
          <span class="label" id="property-required-label">連絡先</span>
          <div class="preview" data-editable-target="preview" hidden="">
            <span
              class="value"
              data-editable-property-target="value"
              data-action="click-&gt;editable-property#start"
              data-empty="true"
              >未登録（必須）</span
            ><button
              data-icon-only="true"
              aria-label="連絡先を編集"
              data-editable-target="edit"
              aria-controls="property-required-editor"
              aria-expanded="false"
              class="rx-button edit"
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
                <use href="/assets/rx-icons.svg#rx-pencil"></use>
              </svg>
            </button>
          </div>
          <div
            class="editor"
            id="property-required-editor"
            data-editable-target="editor"
          >
            <input
              id="property-required-input"
              aria-labelledby="property-required-label"
              name="contact"
              required=""
              data-editable-target="input"
              data-editable-property-target="input"
              value=""
              class="rx-input"
            />
            <div class="actions">
              <button
                data-editable-target="save"
                aria-keyshortcuts="Control+Enter Meta+Enter"
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="compact"
              >
                確定</button
              ><button
                data-editable-target="cancel"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                取消
              </button>
            </div>
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
        ><span class="label"><span class="title">編集できない値</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-editable-property"
          data-controller="editable editable-property"
          data-editable-commit-key-value="modifier-enter"
          data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
          data-editable-property-empty-value="未登録"
        >
          <span class="label" id="property-disabled-label">作成者</span>
          <div class="preview" data-editable-target="preview" hidden="">
            <span
              class="value"
              data-editable-property-target="value"
              data-action="click-&gt;editable-property#start"
              >佐藤 健</span
            ><button
              data-icon-only="true"
              aria-label="作成者を編集"
              data-editable-target="edit"
              aria-controls="property-disabled-editor"
              aria-expanded="false"
              class="rx-button edit"
              type="button"
              data-variant="link"
              data-size="default"
              disabled=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil"></use>
              </svg>
            </button>
          </div>
          <div
            class="editor"
            id="property-disabled-editor"
            data-editable-target="editor"
          >
            <input
              id="property-disabled-input"
              aria-labelledby="property-disabled-label"
              name="author"
              disabled=""
              data-editable-target="input"
              data-editable-property-target="input"
              value="佐藤 健"
              class="rx-input"
            />
            <div class="actions">
              <button
                data-editable-target="save"
                aria-keyshortcuts="Control+Enter Meta+Enter"
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="compact"
              >
                確定</button
              ><button
                data-editable-target="cancel"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                取消
              </button>
            </div>
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
        ><span class="label"><span class="title">長い値</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-editable-property"
          data-controller="editable editable-property"
          data-editable-commit-key-value="modifier-enter"
          data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
          data-editable-property-empty-value="未登録"
        >
          <span class="label" id="property-long-label">共有リンク</span>
          <div class="preview" data-editable-target="preview" hidden="">
            <span
              class="value"
              data-editable-property-target="value"
              data-action="click-&gt;editable-property#start"
              >https://example.com/articles/autumn-reading-club-2026-abcdefghijklmnopqrstuvwxyz0123456789</span
            ><button
              data-icon-only="true"
              aria-label="共有リンクを編集"
              data-editable-target="edit"
              aria-controls="property-long-editor"
              aria-expanded="false"
              class="rx-button edit"
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
                <use href="/assets/rx-icons.svg#rx-pencil"></use>
              </svg>
            </button>
          </div>
          <div class="editor" id="property-long-editor" data-editable-target="editor">
            <input
              id="property-long-input"
              aria-labelledby="property-long-label"
              name="link"
              data-editable-target="input"
              data-editable-property-target="input"
              value="https://example.com/articles/autumn-reading-club-2026-abcdefghijklmnopqrstuvwxyz0123456789"
              class="rx-input"
            />
            <div class="actions">
              <button
                data-editable-target="save"
                aria-keyshortcuts="Control+Enter Meta+Enter"
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="compact"
              >
                確定</button
              ><button
                data-editable-target="cancel"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                取消
              </button>
            </div>
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
          ><span class="title">フォームで送る値と取り消し</span></span
        >
      </summary>
      <div class="body">
        <form id="property-form" class="rx-stack" action="/apps/people" method="get">
          <div
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="property-form-place-label">会場</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >3階の会議室</span
              ><button
                data-icon-only="true"
                aria-label="会場を編集"
                data-editable-target="edit"
                aria-controls="property-form-place-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div
              class="editor"
              id="property-form-place-editor"
              data-editable-target="editor"
            >
              <input
                id="property-form-place-input"
                aria-labelledby="property-form-place-label"
                name="place"
                form="property-form"
                data-editable-target="input"
                data-editable-property-target="input"
                value="3階の会議室"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
          <div class="rx-cluster">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              送信する</button
            ><button
              class="rx-button"
              type="reset"
              data-variant="secondary"
              data-size="default"
            >
              最初の値に戻す
            </button>
          </div>
        </form>
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
            class="rx-editable-property"
            data-controller="editable editable-property"
            data-editable-commit-key-value="modifier-enter"
            data-action="editable:commit-&gt;editable-property#commit editable:edit-&gt;editable-property#select"
            data-editable-property-empty-value="未登録"
          >
            <span class="label" id="property-rtl-label">المسؤول</span>
            <div class="preview" data-editable-target="preview" hidden="">
              <span
                class="value"
                data-editable-property-target="value"
                data-action="click-&gt;editable-property#start"
                >سارة</span
              ><button
                data-icon-only="true"
                aria-label="المسؤولを編集"
                data-editable-target="edit"
                aria-controls="property-rtl-editor"
                aria-expanded="false"
                class="rx-button edit"
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
                  <use href="/assets/rx-icons.svg#rx-pencil"></use>
                </svg>
              </button>
            </div>
            <div class="editor" id="property-rtl-editor" data-editable-target="editor">
              <input
                id="property-rtl-input"
                aria-labelledby="property-rtl-label"
                name="owner-rtl"
                data-editable-target="input"
                data-editable-property-target="input"
                value="سارة"
                class="rx-input"
              />
              <div class="actions">
                <button
                  data-editable-target="save"
                  aria-keyshortcuts="Control+Enter Meta+Enter"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="compact"
                >
                  確定</button
                ><button
                  data-editable-target="cancel"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
