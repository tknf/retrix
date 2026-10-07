<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Disclosure

補足の内容を、HTMLの標準の要素で開閉します。

## 使いどころ

- よくある質問、条件ごとの補足、普段は使わない設定のように、読む人が必要な時だけ開く内容に使います。
- 同じ場所で表示を切り替える見出しの並びは `Tabs`、階層のある項目の一覧は `Tree` を使います。
- 必ず読んでほしい注意や、送信に欠かせない入力は、閉じた中にしまわず画面に出します。

## 使い方

標準の `details` と `summary` で開閉し、controllerの登録は要りません。`summary` が開閉の操作になる見出し、`description` がその下の補足、`children` が開いた時の本文です。`open` を渡すと開いた状態で出力します。

見出しは本文より一段大きな文字で、1.5remの開閉の矢印から0.5rem空けて置きます。見出し・補足・本文の書き始めを揃え、枠や縦線は引きません。入れ子は字下げで示します。

開く時は高さが伸びながら中身が現れ、閉じる時は縮みます。矢印も同じ時間で回ります。動きを減らす設定では動きません。閉じても中の入力の値は保たれます。

`DisclosureGroup` は項目を0.25remの間隔で縦に並べます。一つずつ開く時は、各 `Disclosure` に同じ `name` を渡します（標準の `details` の `name`）。

## キーボード

| キー                    | 動作                 |
| ----------------------- | -------------------- |
| Enter / Space（見出し） | 開閉を切り替えます。 |

## アクセシビリティ

- 開閉の状態は、標準の `details` と `summary` のとおり読み上げます。矢印のアイコンは読み上げから外します。
- `DisclosureGroup` は `role="group"` で、`label` をまとまりの名前として読み上げます。

## API

### Disclosure

基本の開閉はdetails/summaryだけで動く。controller登録は不要。

| 名前              | 型       | 既定値 | 説明                                             |
| ----------------- | -------- | ------ | ------------------------------------------------ |
| `summary`（必須） | `string` |        | 開閉の操作になる見出し。`summary`の中に置く。    |
| `description`     | `string` |        | 見出しの下に添える、閉じていても見える短い補足。 |
| `children`        | `Child`  |        | 開いた時の本文。見出しの書き始めに揃えて置く。   |

ほかに、`<details>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/disclosure.css`、`components/icon.css`

### DisclosureGroup

開閉する項目を狭い間隔で縦に並べ、一つのまとまりとして読ませる。

| 名前            | 型       | 既定値 | 説明                                                           |
| --------------- | -------- | ------ | -------------------------------------------------------------- |
| `label`（必須） | `string` |        | まとまりの名前。`role="group"`の`aria-label`として読み上げる。 |
| `children`      | `Child`  |        | 並べる `Disclosure`。                                          |

ほかに、`<div>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/disclosure-group.css`

## コード

```tsx
import { Disclosure, DisclosureGroup, Button, Field, Input } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <DisclosureGroup label="公開と提出資料">
      <Disclosure
        summary="公開範囲について"
        description="リンクを共有する前に確認してください。"
      >
        <p>この案件に参加しているメンバーが閲覧できます。</p>
        <a href="/apps/settings">共有設定を開く</a>
      </Disclosure>
      <Disclosure summary="提出する資料について" open>
        <p>提出する資料はPDFで用意してください。提出後も期限内なら差し替えできます。</p>
      </Disclosure>
    </DisclosureGroup>
    <section class="rx-stack" data-space="small" aria-label="複数の項目を開く">
      <h3>複数の項目を開く</h3>
      <DisclosureGroup label="提出について">
        <Disclosure summary="提出できるファイル">
          <p>PDF・PNG・JPEGを添付できます。</p>
        </Disclosure>
        <Disclosure summary="提出後の変更">
          <p>受付期間中は何度でも差し替えできます。</p>
        </Disclosure>
      </DisclosureGroup>
    </section>
    <section class="rx-stack" data-space="small" aria-label="一つずつ開く">
      <h3>一つずつ開く</h3>
      <DisclosureGroup label="受付について">
        <Disclosure name="disclosure-faq" summary="受付期間" open>
          <p>9月1日から9月30日までです。</p>
        </Disclosure>
        <Disclosure name="disclosure-faq" summary="結果の確認">
          <p>案件の一覧から確認できます。</p>
        </Disclosure>
        <Disclosure name="disclosure-faq" summary="問い合わせ先">
          <a href="/apps/people">担当者に問い合わせる</a>
        </Disclosure>
      </DisclosureGroup>
    </section>
    <Disclosure summary="入れ子の条件">
      <p>契約内容によって必要な書類が異なります。</p>
      <Disclosure summary="法人の場合">
        <p>担当者名と法人名を記載してください。</p>
        <Disclosure summary="代理で提出する場合">
          <p>委任状も添付してください。</p>
        </Disclosure>
      </Disclosure>
      <Disclosure summary="個人の場合">
        <p>本人確認書類を添付してください。</p>
      </Disclosure>
    </Disclosure>
    <Disclosure
      summary="通知先を変更する"
      description="開閉しても入力中の内容は保持されます。"
    >
      <form action="/apps/settings" method="get" class="rx-stack">
        <Field id="disclosure-email" label="メールアドレス">
          {(attributes) => <Input {...attributes} name="email" type="email" required />}
        </Field>
        <div class="rx-cluster">
          <Button type="submit">変更する</Button>
        </div>
      </form>
    </Disclosure>
    <Disclosure
      summary="提出前に確認してほしい、対象となる案件の条件と追加資料が必要になる場合についての詳しい説明"
      description="申請内容により追加資料をお願いする場合があります。"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <p key={index}>
          資料{index + 1}
          ：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
        </p>
      ))}
      <p>
        https://example.com/projects/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
      </p>
    </Disclosure>
    <Disclosure summary="تفاصيل المشاركة" dir="rtl">
      <p>يمكن لأعضاء المشروع مشاهدة الملفات.</p>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-disclosure-group" role="group" aria-label="公開と提出資料">
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
          ><span class="title">公開範囲について</span
          ><span class="description">リンクを共有する前に確認してください。</span></span
        >
      </summary>
      <div class="body">
        <p>この案件に参加しているメンバーが閲覧できます。</p>
        <a href="/apps/settings">共有設定を開く</a>
      </div>
    </details>
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
        ><span class="label"><span class="title">提出する資料について</span></span>
      </summary>
      <div class="body">
        <p>提出する資料はPDFで用意してください。提出後も期限内なら差し替えできます。</p>
      </div>
    </details>
  </div>
  <section class="rx-stack" data-space="small" aria-label="複数の項目を開く">
    <h3>複数の項目を開く</h3>
    <div class="rx-disclosure-group" role="group" aria-label="提出について">
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
          ><span class="label"><span class="title">提出できるファイル</span></span>
        </summary>
        <div class="body"><p>PDF・PNG・JPEGを添付できます。</p></div>
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
          ><span class="label"><span class="title">提出後の変更</span></span>
        </summary>
        <div class="body"><p>受付期間中は何度でも差し替えできます。</p></div>
      </details>
    </div>
  </section>
  <section class="rx-stack" data-space="small" aria-label="一つずつ開く">
    <h3>一つずつ開く</h3>
    <div class="rx-disclosure-group" role="group" aria-label="受付について">
      <details name="disclosure-faq" open="" class="rx-disclosure">
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
          ><span class="label"><span class="title">受付期間</span></span>
        </summary>
        <div class="body"><p>9月1日から9月30日までです。</p></div>
      </details>
      <details name="disclosure-faq" class="rx-disclosure">
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
          ><span class="label"><span class="title">結果の確認</span></span>
        </summary>
        <div class="body"><p>案件の一覧から確認できます。</p></div>
      </details>
      <details name="disclosure-faq" class="rx-disclosure">
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
          ><span class="label"><span class="title">問い合わせ先</span></span>
        </summary>
        <div class="body"><a href="/apps/people">担当者に問い合わせる</a></div>
      </details>
    </div>
  </section>
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
      ><span class="label"><span class="title">入れ子の条件</span></span>
    </summary>
    <div class="body">
      <p>契約内容によって必要な書類が異なります。</p>
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
          ><span class="label"><span class="title">法人の場合</span></span>
        </summary>
        <div class="body">
          <p>担当者名と法人名を記載してください。</p>
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
              ><span class="label"><span class="title">代理で提出する場合</span></span>
            </summary>
            <div class="body"><p>委任状も添付してください。</p></div>
          </details>
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
          ><span class="label"><span class="title">個人の場合</span></span>
        </summary>
        <div class="body"><p>本人確認書類を添付してください。</p></div>
      </details>
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
        ><span class="title">通知先を変更する</span
        ><span class="description">開閉しても入力中の内容は保持されます。</span></span
      >
    </summary>
    <div class="body">
      <form action="/apps/settings" method="get" class="rx-stack">
        <div class="rx-field">
          <div class="heading">
            <label for="disclosure-email">メールアドレス</label>
          </div>
          <input
            id="disclosure-email"
            name="email"
            type="email"
            required=""
            class="rx-input"
          />
        </div>
        <div class="rx-cluster">
          <button
            class="rx-button"
            type="submit"
            data-variant="secondary"
            data-size="default"
          >
            変更する
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
          >提出前に確認してほしい、対象となる案件の条件と追加資料が必要になる場合についての詳しい説明</span
        ><span class="description"
          >申請内容により追加資料をお願いする場合があります。</span
        ></span
      >
    </summary>
    <div class="body">
      <p>
        資料1：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        資料2：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        資料3：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        資料4：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        資料5：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        資料6：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
      </p>
      <p>
        https://example.com/projects/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
      </p>
    </div>
  </details>
  <details dir="rtl" class="rx-disclosure">
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
      ><span class="label"><span class="title">تفاصيل المشاركة</span></span>
    </summary>
    <div class="body"><p>يمكن لأعضاء المشروع مشاهدة الملفات.</p></div>
  </details>
</div>
```

</details>
