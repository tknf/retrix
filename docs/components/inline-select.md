<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# InlineSelect

文中の語をクリックして、選択肢から選びます。

## 使いどころ

- 「30分前に知らせる」「全員が送ったファイル」のように、設定や条件を一つの文として読ませ、その中の語だけを選べるようにする時に使います。
- ラベルの付いた欄として並べる時は `Select`、選んだ条件でページを移る時は `FilterBar` を使います。

## 使い方

`label` と `options`（`value`・`label`）を渡し、文の中に置きます。`value` に初めに選んでおく選択肢の値を渡し、渡さなければ先頭を選びます。選択肢の `label` は前後の文とつないで読める形で書きます。

実体は標準の `select` です。前後の文と同じ大きさ・行高のまま、選べる語を `Input` と同じ欄（濃い灰色の枠で上側をさらに濃くした、角丸3pxの白い欄）で囲み、終わりに灰色の小さな▾を添えます。フォーカスすると青い縁の外に淡い青の輪を広げ、`disabled` では斜線の面にします。幅は選んだ語に合わせ、収まらない時は語を省略します。

`class` は外側の `span` に付き、`name`・`disabled`・`form` などの残りの属性は `select` に付きます。`name` を渡すとフォームで選んだ `value` を送ります。

controllerは持ちません。選び直しは標準の `change` で受け取ります。JavaScriptが無い時も同じく動きます。

## アクセシビリティ

- 文の中では前後の文が見出しの役を持たないので、`label` を `select` の `aria-label` にします。何を選ぶかを短く書きます（「知らせる時」など）。
- キーボードの操作と選択肢の一覧は、ブラウザの標準の `select` のままです。

## API

### InlineSelect

「30分前に知らせる」「全員が送ったファイル」のように、文の中の語を押して選ぶ選択。実体は標準のselectで、文の中の青い語に見せる。欄を並べずに、設定を一つの文として読ませる時に使う。

| 名前              | 型                              | 既定値 | 説明                                                                         |
| ----------------- | ------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `label`（必須）   | `string`                        |        | 読み上げの名前。文の中では前後の文が見出しになるので、何を選ぶかを短く書く。 |
| `options`（必須） | `readonly InlineSelectOption[]` |        | 選べる語。並べた順にoptionにする。                                           |
| `value`           | `string`                        |        | 最初に選んでおく選択肢のvalue。渡さなければ先頭を選ぶ。                      |

ほかに、`<select>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/inline-select.css`

#### `InlineSelectOption`

| 名前            | 型       | 既定値 | 説明                                                                     |
| --------------- | -------- | ------ | ------------------------------------------------------------------------ |
| `value`（必須） | `string` |        | 送信する値。                                                             |
| `label`（必須） | `string` |        | 文の中に見せる語。前後の文とつないで読める形で書く（「30分前に」など）。 |

## コード

```tsx
import { InlineSelect, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

const before = [
  { value: "0", label: "予定の時刻に" },
  { value: "10", label: "10分前に" },
  { value: "30", label: "30分前に" },
  { value: "60", label: "1時間前に" },
];

export default () => (
  <div class="rx-stack">
    <p>
      予定の
      <InlineSelect label="知らせる時" name="notify" options={before} value="30" />
      知らせる
    </p>
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="一つの文に二つ" open>
        <p>
          <InlineSelect
            label="ファイルの種類"
            name="kind"
            value="all"
            options={[
              { value: "all", label: "すべてのファイル" },
              { value: "image", label: "画像" },
              { value: "pdf", label: "PDF" },
            ]}
          />
          を
          <InlineSelect
            label="送った人"
            name="sender"
            value="everyone"
            options={[
              { value: "everyone", label: "全員" },
              { value: "me", label: "自分" },
            ]}
          />
          が送ったもの
        </p>
      </Disclosure>
      <Disclosure summary="見出しの下の小さな文">
        <p style="font-size: var(--rx-small)">
          <InlineSelect
            label="並び順"
            name="order"
            value="new"
            options={[
              { value: "new", label: "新しい順" },
              { value: "old", label: "古い順" },
            ]}
          />
          に並べています
        </p>
      </Disclosure>
      <Disclosure summary="使えない時・右から左に読む場合">
        <p>
          予定の
          <InlineSelect
            label="知らせる時"
            name="notify-disabled"
            options={before}
            value="10"
            disabled
          />
          知らせる
        </p>
        <p dir="rtl" lang="ar">
          تذكير{" "}
          <InlineSelect
            label="وقت التذكير"
            name="rtl-notify"
            options={[{ value: "30", label: "قبل 30 دقيقة" }]}
            value="30"
          />
        </p>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <p>
    予定の<span class="rx-inline-select"
      ><select name="notify" aria-label="知らせる時">
        <option value="0">予定の時刻に</option>
        <option value="10">10分前に</option>
        <option value="30" selected="">30分前に</option>
        <option value="60">1時間前に</option></select
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
    >知らせる
  </p>
  <div class="rx-disclosure-group" role="group" aria-label="置き場所の違い">
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
        ><span class="label"><span class="title">一つの文に二つ</span></span>
      </summary>
      <div class="body">
        <p>
          <span class="rx-inline-select"
            ><select name="kind" aria-label="ファイルの種類">
              <option value="all" selected="">すべてのファイル</option>
              <option value="image">画像</option>
              <option value="pdf">PDF</option></select
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
          >を<span class="rx-inline-select"
            ><select name="sender" aria-label="送った人">
              <option value="everyone" selected="">全員</option>
              <option value="me">自分</option></select
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
          >が送ったもの
        </p>
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
        ><span class="label"><span class="title">見出しの下の小さな文</span></span>
      </summary>
      <div class="body">
        <p style="font-size: var(--rx-small)">
          <span class="rx-inline-select"
            ><select name="order" aria-label="並び順">
              <option value="new" selected="">新しい順</option>
              <option value="old">古い順</option></select
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
          >に並べています
        </p>
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
          ><span class="title">使えない時・右から左に読む場合</span></span
        >
      </summary>
      <div class="body">
        <p>
          予定の<span class="rx-inline-select"
            ><select name="notify-disabled" disabled="" aria-label="知らせる時">
              <option value="0">予定の時刻に</option>
              <option value="10" selected="">10分前に</option>
              <option value="30">30分前に</option>
              <option value="60">1時間前に</option></select
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
          >知らせる
        </p>
        <p dir="rtl" lang="ar">
          تذكير
          <span class="rx-inline-select"
            ><select name="rtl-notify" aria-label="وقت التذكير">
              <option value="30" selected="">قبل 30 دقيقة</option></select
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-caret"></use></svg
          ></span>
        </p>
      </div>
    </details>
  </div>
</div>
```

</details>
