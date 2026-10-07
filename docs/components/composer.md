<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Composer

本文・添付・送信の操作を、一つの入力エリアにまとめます。

## 使いどころ

- メッセージ・コメント・返信のように、本文を書いて送る入力エリアを置く時に使います。
- 書式ツールを並べる時は、`TextEditor` を `editor` に入れます。本文の欄を他の項目と並べて入力する通常のフォームでは、`Field` と `Textarea` を使います。

## 使い方

`id`・`label`・`name`・`submitLabel` を渡します。全体は標準の `form` で、`action`・`method` などの属性はそのまま `form` に付きます。題名の行に `label` を置き、その下に本文の欄、下の行に `actions` と送信ボタンを並べます。`Composer` 自体は面も影も持たず、本文の欄だけが `Input` と同じ枠（上の枠を少し濃くした沈んだ欄）とフォーカスの輪を持ちます。

`to` に宛先（人やチャンネル）、`status` に下書きの保存などの状態を渡すと、題名の行に並べます。`label` は本文と同じ大きさの太字、宛先は灰色の小さな文字、状態は末尾側に茶色の小さな文字で出します。`attachments` には `FileInput` や選んだファイルの一覧を渡し、本文の下に置きます。

本文の欄は本文と同じ文字サイズと行の高さで表示し、`field-sizing` に対応するブラウザでは4行から入力した分だけ伸びます（20行まで）。

`busy` は送信ボタンを「送信中…」にして押せなくし、二重の送信を防ぎます。`error` は本文の欄の下に出して欄に関連付けます。送信・下書きの保存・送信後に `busy` や `error` を切り替えることは利用側で行います。

`editor` にリッチテキストの編集コンポーネント（ProseMirror・Tiptapなど）や `contenteditable` の要素を渡すと、本文の欄と差し替えます。中の入力エリアがどの深さにあっても、本文と同じ文字と行の高さを適用し、囲みに `Input` と同じ枠とフォーカスの輪を付け、段落や箇条書きの間を一定の間隔にそろえます。空の `contenteditable` には `data-placeholder` の文を薄く出します。この時 `name`・`value`・`placeholder`・`rows`・`required` は使わず、送信する値の受け渡しは編集コンポーネントの側で行います。`error` は本文の欄と同じく編集コンポーネントの下に出し、囲みの枠を赤茶にします。

controllerは持ちません。JavaScriptが無い時も、標準のフォームとして本文と添付を送信できます。

## アクセシビリティ

- 本文の欄は `label` を名前にします。`editor` を渡した時は、`label` を名前にしたまとまり（`role="group"`）で編集コンポーネントを包みます。入力エリアそのものの名前（`aria-label` など）は編集コンポーネントの側で付けます。
- `busy` の間は `form` と送信ボタンに `aria-busy` を付けます。
- `error` を渡すと、本文の欄に `aria-invalid` を付け、誤りの文を `aria-describedby` に加えます。
- `editor` を渡した時は、誤りの文（IDは `<id>-body-error`）を編集コンポーネントを包むまとまりの `aria-describedby` にします。入力エリアそのものには、編集コンポーネントの側で `aria-invalid="true"` と、このIDを指す `aria-describedby` を付けます。

## API

### Composer

本文と添付、送信操作の配置。送信先と保存処理は利用側が指定する。

| 名前                  | 型        | 既定値  | 説明                                                                                                                                                                                                                                     |
| --------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）          | `string`  |         | formのID。本文の欄のIDの接頭辞にも使う。                                                                                                                                                                                                 |
| `label`（必須）       | `string`  |         | 本文の欄の名前。題名の行の先頭に出す。                                                                                                                                                                                                   |
| `name`（必須）        | `string`  |         | 本文を送るフィールドの名前。editorを渡した時は使わない。                                                                                                                                                                                 |
| `value`               | `string`  |         | 本文の初期値。editorを渡した時は使わない。                                                                                                                                                                                               |
| `placeholder`         | `string`  |         | 本文の欄のプレースホルダー。editorを渡した時は使わない。                                                                                                                                                                                 |
| `rows`                | `number`  | `4`     | 本文の欄の行数。field-sizingに対応しないブラウザでの高さになる。対応するブラウザでは4行から書いた分だけ伸び（20行まで）、この値は使わない。                                                                                              |
| `required`            | `boolean` |         | 本文が空の時に送信を止める。editorを渡した時は使わない。                                                                                                                                                                                 |
| `submitLabel`（必須） | `string`  |         | 送信ボタンの文言（「送信する」「投稿する」など）。                                                                                                                                                                                       |
| `busy`                | `boolean` | `false` | 送信中にする。送信ボタンを「送信中…」にして押せなくし、formにaria-busyを付ける。                                                                                                                                                         |
| `error`               | `string`  |         | 本文の欄の下に出すエラー文。本文の欄をaria-invalidにする。 editorを渡した時もエディターの下に出し、`<id>-body-error`のIDでエディターを包む要素の説明にする。入力エリアそのもののaria-invalidとaria-describedbyはエディターの側で付ける。 |
| `attachments`         | `Child`   |         | 本文の下に置く添付（FileInputや選んだファイルの一覧など）。                                                                                                                                                                              |
| `actions`             | `Child`   |         | 下の行の先頭側に並べる操作（添付・書式・下書きの保存など）。送信ボタンは末尾側に置く。                                                                                                                                                   |
| `to`                  | `Child`   |         | 見出しで、名前の隣へ置く宛先（人やチャンネル）。                                                                                                                                                                                         |
| `status`              | `Child`   |         | 見出しの右端に置く状態（下書きの保存など）。                                                                                                                                                                                             |
| `editor`              | `Child`   |         | 本文の欄の代わりに置くエディター（リッチテキストエディターやcontenteditableなど）。渡すと本文の文字と入力エリア全体のフォーカスリングはこのエディターに適用し、送信する値の受け渡しもエディターの側で行う。                              |

ほかに、`<form>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/composer.css`

## コード

```tsx
import {
  Composer,
  FileInput,
  Avatar,
  Button,
  Icon,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Composer
      id="message-composer"
      label="メッセージ"
      name="body"
      action="/apps/people"
      method="get"
      placeholder="メッセージを書く"
      submitLabel="送信する"
      to={
        <>
          <span>宛先</span>
          <Avatar name="森 美咲" initials="美" tone="green" />
          <span>森 美咲</span>
        </>
      }
      status="下書きを保存しました"
      attachments={
        <FileInput id="message-file" name="files" label="添付ファイル" multiple />
      }
      required
    />
    <DisclosureGroup label="書き方と状態の違い">
      <Disclosure summary="書式の操作と下書きの保存" open>
        <Composer
          id="composer-actions"
          label="コメント"
          name="comment"
          placeholder="コメントを書く"
          submitLabel="投稿する"
          actions={
            <>
              <Button size="compact" data-icon-only="true" aria-label="ファイルを添付">
                <Icon name="file" />
              </Button>
              <Button size="compact">下書きに保存</Button>
            </>
          }
        />
      </Disclosure>
      <Disclosure summary="リッチテキストエディター（ProseMirror・Tiptapの構造）">
        <Composer
          id="composer-editor"
          label="議事録"
          name="minutes"
          submitLabel="保存する"
          status="エディターが送信用の値を持ちます"
          editor={
            <div class="tiptap">
              <div
                class="ProseMirror"
                contenteditable
                role="textbox"
                aria-multiline="true"
              >
                <p>9月の打ち合わせで決まったこと</p>
                <ul>
                  <li>カテゴリは5つにまとめる</li>
                  <li>公開は9月30日</li>
                </ul>
                <p>次回は10月7日の14時からです。</p>
              </div>
            </div>
          }
        />
      </Disclosure>
      <Disclosure summary="何も書いていないエディター">
        <Composer
          id="composer-empty-editor"
          label="メモ"
          name="memo"
          submitLabel="保存する"
          editor={
            <div
              contenteditable
              role="textbox"
              aria-multiline="true"
              aria-label="メモの本文"
              data-placeholder="思いついたことを書き留める"
            />
          }
        />
      </Disclosure>
      <Disclosure summary="送信中">
        <Composer
          id="composer-busy"
          label="返信"
          name="busy-reply"
          value="資料を確認しました。明日までに戻します。"
          submitLabel="送信する"
          busy
        />
      </Disclosure>
      <Disclosure summary="送信できなかったとき">
        <Composer
          id="composer-error"
          label="返信"
          name="reply"
          submitLabel="再送する"
          error="送信できませんでした。内容を確認して、もう一度送信してください。"
        />
      </Disclosure>
      <Disclosure summary="狭い場所：操作が折り返す">
        <div style="max-inline-size: 22rem">
          <Composer
            id="composer-narrow"
            label="返信"
            name="narrow-reply"
            placeholder="返信を書く"
            submitLabel="送信する"
            to={
              <>
                <span>宛先</span>
                <span>
                  海外拠点の予約窓口チーム（review-abcdefghijklmnopqrstuvwxyz）
                </span>
              </>
            }
            status="下書きを保存しました"
            actions={<Button size="compact">下書きに保存</Button>}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <Composer
            id="composer-rtl"
            label="رسالة"
            name="rtl-body"
            placeholder="اكتب رسالة"
            submitLabel="إرسال"
            status="تم حفظ المسودة"
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
  <form
    action="/apps/people"
    method="get"
    id="message-composer"
    class="rx-composer"
    aria-busy="false"
  >
    <div class="rx-field">
      <div class="heading">
        <label for="message-composer-body">メッセージ</label
        ><span class="to"
          ><span>宛先</span
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="green"
            role="img"
            aria-label="森 美咲"
            ><span class="initials">美</span></span
          ><span>森 美咲</span></span
        ><span class="status">下書きを保存しました</span>
      </div>
      <textarea
        id="message-composer-body"
        name="body"
        rows="4"
        required=""
        placeholder="メッセージを書く"
        class="rx-input"
      ></textarea>
    </div>
    <div class="attachments">
      <div class="rx-field">
        <div class="heading"><label for="message-file">添付ファイル</label></div>
        <div class="rx-file-input" data-controller="file-input">
          <input
            name="files"
            multiple=""
            id="message-file"
            type="file"
            data-file-input-target="input"
            class="rx-input"
          /><span class="symbol" aria-hidden="true"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-attach"></use></svg
          ></span>
          <p class="hint" data-file-input-target="hint" hidden="">
            ここにファイルをドロップ
          </p>
          <label
            class="rx-button choose"
            for="message-file"
            data-variant="link"
            data-size="default"
            aria-hidden="true"
            >ファイルを選択</label
          >
          <ul
            class="files"
            aria-label="添付ファイルで選択したファイル"
            role="list"
            data-file-input-target="files"
            hidden=""
          ></ul>
          <template data-file-input-target="template"
            ><li>
              <div class="rx-file-item" data-state="ready">
                <span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-file"></use></svg
                ></span>
                <div class="body">
                  <p class="title"><strong></strong></p>
                  <p class="description"></p>
                </div>
              </div></li></template
          ><button
            data-file-input-target="clear"
            data-action="file-input#clear"
            hidden=""
            class="rx-button clear"
            type="button"
            data-variant="link"
            data-size="compact"
          >
            選択を解除
          </button>
          <p class="status" role="status" data-file-input-target="status"></p>
        </div>
      </div>
    </div>
    <div class="footer">
      <button
        class="rx-button"
        type="submit"
        data-variant="primary"
        data-size="default"
      >
        送信する
      </button>
    </div>
  </form>
  <div class="rx-disclosure-group" role="group" aria-label="書き方と状態の違い">
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
        ><span class="label"><span class="title">書式の操作と下書きの保存</span></span>
      </summary>
      <div class="body">
        <form id="composer-actions" class="rx-composer" aria-busy="false">
          <div class="rx-field">
            <div class="heading">
              <label for="composer-actions-body">コメント</label>
            </div>
            <textarea
              id="composer-actions-body"
              name="comment"
              rows="4"
              placeholder="コメントを書く"
              class="rx-input"
            ></textarea>
          </div>
          <div class="footer">
            <div class="actions">
              <button
                data-icon-only="true"
                aria-label="ファイルを添付"
                class="rx-button"
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
                  <use href="/assets/rx-icons.svg#rx-file"></use>
                </svg></button
              ><button
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                下書きに保存
              </button>
            </div>
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              投稿する
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
        ><span class="label"
          ><span class="title"
            >リッチテキストエディター（ProseMirror・Tiptapの構造）</span
          ></span
        >
      </summary>
      <div class="body">
        <form id="composer-editor" class="rx-composer" aria-busy="false">
          <div class="rx-field">
            <div class="heading">
              <span class="label" id="composer-editor-body-label">議事録</span
              ><span class="status">エディターが送信用の値を持ちます</span>
            </div>
            <div
              class="editor"
              role="group"
              aria-labelledby="composer-editor-body-label"
            >
              <div class="tiptap">
                <div
                  class="ProseMirror"
                  contenteditable="true"
                  role="textbox"
                  aria-multiline="true"
                >
                  <p>9月の打ち合わせで決まったこと</p>
                  <ul>
                    <li>カテゴリは5つにまとめる</li>
                    <li>公開は9月30日</li>
                  </ul>
                  <p>次回は10月7日の14時からです。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              保存する
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
        ><span class="label"
          ><span class="title">何も書いていないエディター</span></span
        >
      </summary>
      <div class="body">
        <form id="composer-empty-editor" class="rx-composer" aria-busy="false">
          <div class="rx-field">
            <div class="heading">
              <span class="label" id="composer-empty-editor-body-label">メモ</span>
            </div>
            <div
              class="editor"
              role="group"
              aria-labelledby="composer-empty-editor-body-label"
            >
              <div
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                aria-label="メモの本文"
                data-placeholder="思いついたことを書き留める"
              ></div>
            </div>
          </div>
          <div class="footer">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              保存する
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
        ><span class="label"><span class="title">送信中</span></span>
      </summary>
      <div class="body">
        <form id="composer-busy" class="rx-composer" aria-busy="true">
          <div class="rx-field">
            <div class="heading"><label for="composer-busy-body">返信</label></div>
            <textarea
              id="composer-busy-body"
              name="busy-reply"
              rows="4"
              class="rx-input"
            >
資料を確認しました。明日までに戻します。</textarea>
          </div>
          <div class="footer">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
              data-busy="true"
              disabled=""
              aria-busy="true"
            >
              送信中…
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
        ><span class="label"><span class="title">送信できなかったとき</span></span>
      </summary>
      <div class="body">
        <form id="composer-error" class="rx-composer" aria-busy="false">
          <div class="rx-field">
            <div class="heading"><label for="composer-error-body">返信</label></div>
            <textarea
              id="composer-error-body"
              aria-describedby="composer-error-body-error"
              aria-invalid="true"
              data-invalid="true"
              name="reply"
              rows="4"
              class="rx-input"
            ></textarea>
            <div class="messages">
              <p class="error" id="composer-error-body-error">
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
                ><span
                  >送信できませんでした。内容を確認して、もう一度送信してください。</span
                >
              </p>
            </div>
          </div>
          <div class="footer">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              再送する
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
        ><span class="label"><span class="title">狭い場所：操作が折り返す</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 22rem">
          <form id="composer-narrow" class="rx-composer" aria-busy="false">
            <div class="rx-field">
              <div class="heading">
                <label for="composer-narrow-body">返信</label
                ><span class="to"
                  ><span>宛先</span
                  ><span
                    >海外拠点の予約窓口チーム（review-abcdefghijklmnopqrstuvwxyz）</span
                  ></span
                ><span class="status">下書きを保存しました</span>
              </div>
              <textarea
                id="composer-narrow-body"
                name="narrow-reply"
                rows="4"
                placeholder="返信を書く"
                class="rx-input"
              ></textarea>
            </div>
            <div class="footer">
              <div class="actions">
                <button
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  下書きに保存
                </button>
              </div>
              <button
                class="rx-button"
                type="submit"
                data-variant="primary"
                data-size="default"
              >
                送信する
              </button>
            </div>
          </form>
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
        ><span class="label"><span class="title">右から左へ書く言語</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <form id="composer-rtl" class="rx-composer" aria-busy="false">
            <div class="rx-field">
              <div class="heading">
                <label for="composer-rtl-body">رسالة</label
                ><span class="status">تم حفظ المسودة</span>
              </div>
              <textarea
                id="composer-rtl-body"
                name="rtl-body"
                rows="4"
                placeholder="اكتب رسالة"
                class="rx-input"
              ></textarea>
            </div>
            <div class="footer">
              <button
                class="rx-button"
                type="submit"
                data-variant="primary"
                data-size="default"
              >
                إرسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
