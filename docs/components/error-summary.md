<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ErrorSummary

送信時のエラーと、修正する欄へのリンクをまとめます。

## 使いどころ

- フォームの送信に失敗した時、直すところをフォームの上にまとめ、各欄へ移れるようにする時に使います。
- 一つの欄のエラーは、その欄の `Field` の `error` で示します。ErrorSummaryはその一覧で、欄のエラーの代わりにはしません。
- 送信以外の注意や失敗を知らせる時は `Notice` や `Toast` を使います。

## 使い方

送信に失敗した時だけ描き、`errors` に直すところを並べます。`label` は直し方の文、`href` は直す欄のidを指す `#id` です。`errors` が空の時は何も描きません。

形は `Notice` と同じ（一行目にアイコンと太字の見出し、角丸4px）で、色はBasecamp 2のログインの画面のエラーの箱と同じ、淡い黄色（`#fffae6`）の面に1px `#ffea9e` の枠、赤いアイコンと赤い太字の見出しにします。ErrorSummaryは直す欄へのリンクの一覧を持ちます。リンクは本文のリンクと同じ青緑の文字に下線を引き（ホバーで赤）、先頭に見出しと同じ赤の小さな点を置きます。

表示した時にErrorSummaryへフォーカスを移します。`tabindex="-1"` を持つので、送信の後にサーバーで描き直すページでは `autofocus` を渡すと、JavaScriptなしでも読み込んだ時に移ります。読み込んだ後にスクリプトで出す時は、`autofocus` は働かないので `focus()` で移します。各入力にも `Field` の `error` でエラーを関連付けます。

入力の検証と、サーバーから返ったエラーを欄へ対応させるのは利用側です。JavaScriptは使いません。

## アクセシビリティ

- `aside` で、`title` を読み上げ名と見出し（`h2`）にします。アイコンは読み上げから外します。
- 表示した時にフォーカスを移すと、題名と一覧を読み上げます。移さないと気付かれにくいので、`autofocus` か `focus()` で必ず移します。
- リンクの文は欄の名前が分かる直し方にします（「記事名を入力してください」など）。

## API

### ErrorSummary

直すところを、各欄へ移るリンクの一覧にまとめる。形はNoticeの危険の役割（アイコンと太字の見出し）で、色はBC2のログインの画面のエラーの箱（淡い黄色の面、1pxの黄色の枠、赤い見出し）。ErrorSummaryが持つのは色と直す欄への一覧。 tabindex="-1"を持つので、送信後に再描画したページではautofocusを渡すと、読み込んだ時にフォーカスが移る。

| 名前             | 型                                            | 既定値                         | 説明                                                                                                             |
| ---------------- | --------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `title`          | `string`                                      | `"入力内容を確認してください"` | 見出しに太字で書く題名。読み上げ名（aria-label）にもする。                                                       |
| `errors`（必須） | `readonly { label: string; href: string; }[]` |                                | 直すところの一覧。labelは直し方の文、hrefは直す欄へのリンク（欄のidを指す`#id`）。空の配列を渡すと何も描かない。 |

ほかに、`<aside>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/notice.css`、`components/error-summary.css`

#### `errors`の項目

| 名前            | 型       | 既定値 | 説明                                        |
| --------------- | -------- | ------ | ------------------------------------------- |
| `label`（必須） | `string` |        | 直し方の文。リンクの文字になる。            |
| `href`（必須）  | `string` |        | 直す欄へのリンク。欄のidを指す`#id`にする。 |

## コード

```tsx
import {
  ErrorSummary,
  Field,
  Input,
  Button,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const manyErrors = [
  "記事名を入力してください",
  "カテゴリを選んでください",
  "公開日を入力してください",
  "公開日は今日以降の日付にしてください",
  "概要を120文字以内にしてください",
  "見出し画像を選んでください",
  "見出し画像の代替テキストを入力してください",
  "担当者を選んでください",
  "連絡先のメールアドレスを確認してください",
  "電話番号の形式を確認してください",
  "タグは5つまでにしてください",
  "利用規約への同意が必要です",
].map((label) => ({ label, href: "#hono-error-title" }));

export default () => (
  <div class="rx-stack">
    <form action="/apps/search" method="get" class="rx-stack">
      <ErrorSummary
        id="hono-errors"
        errors={[
          { label: "記事名を入力してください", href: "#hono-error-title" },
          {
            label: "連絡先のメールアドレスを確認してください",
            href: "#hono-error-email",
          },
        ]}
      />
      <Field id="hono-error-title" label="記事名" error="記事名を入力してください">
        {(attributes) => <Input {...attributes} name="q" required />}
      </Field>
      <Field
        id="hono-error-email"
        label="メールアドレス"
        error="メールアドレスの形式を確認してください"
      >
        {(attributes) => (
          <Input {...attributes} type="email" name="email" value="example" required />
        )}
      </Field>
      <Button type="submit">入力を確認する</Button>
    </form>
    <DisclosureGroup label="件数と置き場所の違い">
      <Disclosure summary="一件だけ" open>
        <ErrorSummary
          id="hono-errors-one"
          title="送信できませんでした"
          errors={[{ label: "記事名を入力してください", href: "#hono-error-title" }]}
        />
      </Disclosure>
      <Disclosure summary="項目が多い">
        <ErrorSummary id="hono-errors-many" errors={manyErrors} />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ErrorSummary
            id="hono-errors-narrow"
            title="公開前に確認が必要な項目があります"
            errors={[
              {
                label:
                  "見出し画像の代替テキストを、画像の内容が分かる文で入力してください",
                href: "#hono-error-title",
              },
              {
                label:
                  "https://example.com/articles/autumn-reading-club-2026 は既に使われています",
                href: "#hono-error-title",
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ErrorSummary
            id="hono-errors-rtl"
            title="تحقق من البيانات المدخلة"
            errors={[
              { label: "أدخل عنوان المقال", href: "#hono-error-title" },
              { label: "تحقق من عنوان البريد الإلكتروني", href: "#hono-error-email" },
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
  <form action="/apps/search" method="get" class="rx-stack">
    <aside
      id="hono-errors"
      class="rx-notice rx-error-summary"
      data-tone="danger"
      aria-label="入力内容を確認してください"
      tabindex="-1"
    >
      <div class="heading">
        <span class="symbol" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x"></use></svg
        ></span>
        <h2 class="title">入力内容を確認してください</h2>
      </div>
      <div class="body">
        <ul>
          <li><a href="#hono-error-title">記事名を入力してください</a></li>
          <li>
            <a href="#hono-error-email">連絡先のメールアドレスを確認してください</a>
          </li>
        </ul>
      </div>
    </aside>
    <div class="rx-field">
      <div class="heading"><label for="hono-error-title">記事名</label></div>
      <input
        id="hono-error-title"
        aria-describedby="hono-error-title-error"
        aria-invalid="true"
        data-invalid="true"
        name="q"
        required=""
        class="rx-input"
      />
      <div class="messages">
        <p class="error" id="hono-error-title-error">
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
          ><span>記事名を入力してください</span>
        </p>
      </div>
    </div>
    <div class="rx-field">
      <div class="heading"><label for="hono-error-email">メールアドレス</label></div>
      <input
        id="hono-error-email"
        aria-describedby="hono-error-email-error"
        aria-invalid="true"
        data-invalid="true"
        type="email"
        name="email"
        value="example"
        required=""
        class="rx-input"
      />
      <div class="messages">
        <p class="error" id="hono-error-email-error">
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
          ><span>メールアドレスの形式を確認してください</span>
        </p>
      </div>
    </div>
    <button
      class="rx-button"
      type="submit"
      data-variant="secondary"
      data-size="default"
    >
      入力を確認する
    </button>
  </form>
  <div class="rx-disclosure-group" role="group" aria-label="件数と置き場所の違い">
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
        ><span class="label"><span class="title">一件だけ</span></span>
      </summary>
      <div class="body">
        <aside
          id="hono-errors-one"
          class="rx-notice rx-error-summary"
          data-tone="danger"
          aria-label="送信できませんでした"
          tabindex="-1"
        >
          <div class="heading">
            <span class="symbol" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x"></use></svg
            ></span>
            <h2 class="title">送信できませんでした</h2>
          </div>
          <div class="body">
            <ul>
              <li><a href="#hono-error-title">記事名を入力してください</a></li>
            </ul>
          </div>
        </aside>
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
        ><span class="label"><span class="title">項目が多い</span></span>
      </summary>
      <div class="body">
        <aside
          id="hono-errors-many"
          class="rx-notice rx-error-summary"
          data-tone="danger"
          aria-label="入力内容を確認してください"
          tabindex="-1"
        >
          <div class="heading">
            <span class="symbol" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x"></use></svg
            ></span>
            <h2 class="title">入力内容を確認してください</h2>
          </div>
          <div class="body">
            <ul>
              <li><a href="#hono-error-title">記事名を入力してください</a></li>
              <li><a href="#hono-error-title">カテゴリを選んでください</a></li>
              <li><a href="#hono-error-title">公開日を入力してください</a></li>
              <li>
                <a href="#hono-error-title">公開日は今日以降の日付にしてください</a>
              </li>
              <li><a href="#hono-error-title">概要を120文字以内にしてください</a></li>
              <li><a href="#hono-error-title">見出し画像を選んでください</a></li>
              <li>
                <a href="#hono-error-title"
                  >見出し画像の代替テキストを入力してください</a
                >
              </li>
              <li><a href="#hono-error-title">担当者を選んでください</a></li>
              <li>
                <a href="#hono-error-title">連絡先のメールアドレスを確認してください</a>
              </li>
              <li><a href="#hono-error-title">電話番号の形式を確認してください</a></li>
              <li><a href="#hono-error-title">タグは5つまでにしてください</a></li>
              <li><a href="#hono-error-title">利用規約への同意が必要です</a></li>
            </ul>
          </div>
        </aside>
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 16rem">
          <aside
            id="hono-errors-narrow"
            class="rx-notice rx-error-summary"
            data-tone="danger"
            aria-label="公開前に確認が必要な項目があります"
            tabindex="-1"
          >
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use></svg
              ></span>
              <h2 class="title">公開前に確認が必要な項目があります</h2>
            </div>
            <div class="body">
              <ul>
                <li>
                  <a href="#hono-error-title"
                    >見出し画像の代替テキストを、画像の内容が分かる文で入力してください</a
                  >
                </li>
                <li>
                  <a href="#hono-error-title"
                    >https://example.com/articles/autumn-reading-club-2026
                    は既に使われています</a
                  >
                </li>
              </ul>
            </div>
          </aside>
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
          <aside
            id="hono-errors-rtl"
            class="rx-notice rx-error-summary"
            data-tone="danger"
            aria-label="تحقق من البيانات المدخلة"
            tabindex="-1"
          >
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use></svg
              ></span>
              <h2 class="title">تحقق من البيانات المدخلة</h2>
            </div>
            <div class="body">
              <ul>
                <li><a href="#hono-error-title">أدخل عنوان المقال</a></li>
                <li><a href="#hono-error-email">تحقق من عنوان البريد الإلكتروني</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
