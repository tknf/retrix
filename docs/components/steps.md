<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Steps

手順と現在の段階を示します。

## 使いどころ

- 申し込みや公開の準備など、いくつかの段階に分かれた作業で、全体の手順と今の段階を示す時に使います。
- 時系列の出来事は`Timeline`、一覧のページ送りは`Pagination`を使います。

## 使い方

`label`と`items`を渡します。各段階は`label`と`state`を持ちます。Highriseのインポートの手順と同じく、段階ごとに同じ幅の平らな面を2pxずつ空けて並べます。面に枠と角丸はありません。他の段階は灰色の面（#e9e8e8）に灰色の13pxの文字、`current`は淡い青灰色の面（#dfe7eb）に黒い太字の文字です。番号は名前と同じ色の数字で前に置き、`complete`は番号の代わりに緑のチェックにします。名前の下に「完了」「入力中」「未入力」を灰色の小さな文字（11px）で添えます。

`href`を渡した段階は、名前がリンクになります。完了した段階へ戻れるようにする時などに渡します。未入力の段階へ移れるかは利用側で決めます。

段階は幅に応じて横に並べ、一段階あたり10remに満たない時は折り返します。

## アクセシビリティ

- `label`を読み上げ名に持つ`ol`で、今の段階に`aria-current="step"`を付けます。
- 番号とチェックは`aria-hidden`で読み上げず、状態は名前の下の文言で伝えます。

## API

### Steps

| 名前            | 型                                                                                           | 既定値 | 説明                                               |
| --------------- | -------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| `label`（必須） | `string`                                                                                     |        | 手順の一覧の読み上げ名（「申し込みの手順」など）。 |
| `items`（必須） | `readonly { label: string; state: "complete" \| "current" \| "upcoming"; href?: string; }[]` |        | 段階。並べた順に番号を振る。                       |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/steps.css`

#### `items`の項目

| 名前            | 型                                      | 既定値 | 説明                                                                                                                                                               |
| --------------- | --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                                |        | 段階の名前。                                                                                                                                                       |
| `state`（必須） | `"complete" \| "current" \| "upcoming"` |        | 段階の状態。`complete`（完了）は番号の代わりにチェック、`current`（入力中）は`aria-current="step"`を付ける。名前の下に「完了」「入力中」「未入力」の文言を添える。 |
| `href`          | `string`                                |        | 渡すと、名前をその段階へのリンクにする。                                                                                                                           |

## コード

```tsx
import { Steps, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <Steps
      label="申し込みの手順"
      items={[
        { label: "日時", state: "complete", href: "/apps/schedule" },
        { label: "連絡先", state: "current" },
        { label: "確認", state: "upcoming" },
      ]}
    />
    <DisclosureGroup label="段階の数と置き場所の違い">
      <Disclosure summary="段階が多い・名前が長い">
        <Steps
          label="公開までの手順"
          items={[
            { label: "記事の下書き", state: "complete", href: "/apps/docs" },
            { label: "画像と代替テキスト", state: "complete", href: "/apps/docs" },
            { label: "公開範囲と共有リンクの確認", state: "current" },
            { label: "担当者の承認", state: "upcoming" },
            { label: "公開", state: "upcoming" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="すべて終わった">
        <Steps
          label="終わった手順"
          items={[
            { label: "日時", state: "complete", href: "/apps/schedule" },
            { label: "連絡先", state: "complete", href: "/apps/schedule" },
            { label: "確認", state: "complete", href: "/apps/schedule" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で縦に積む">
        <div style="max-inline-size: 14rem">
          <Steps
            label="狭い場所の手順"
            items={[
              { label: "日時", state: "complete", href: "/apps/schedule" },
              { label: "連絡先", state: "current" },
              { label: "確認", state: "upcoming" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Steps
            label="خطوات الحجز"
            items={[
              { label: "الموعد", state: "complete", href: "/apps/schedule" },
              { label: "بيانات الاتصال", state: "current" },
              { label: "التأكيد", state: "upcoming" },
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
<div class="rx-stack" data-space="small">
  <ol class="rx-steps" aria-label="申し込みの手順">
    <li data-state="complete">
      <span class="number" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
      ><span><a href="/apps/schedule">日時</a><small>完了</small></span>
    </li>
    <li data-state="current" aria-current="step">
      <span class="number" aria-hidden="true">2</span
      ><span>連絡先<small>入力中</small></span>
    </li>
    <li data-state="upcoming">
      <span class="number" aria-hidden="true">3</span
      ><span>確認<small>未入力</small></span>
    </li>
  </ol>
  <div class="rx-disclosure-group" role="group" aria-label="段階の数と置き場所の違い">
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
        ><span class="label"><span class="title">段階が多い・名前が長い</span></span>
      </summary>
      <div class="body">
        <ol class="rx-steps" aria-label="公開までの手順">
          <li data-state="complete">
            <span class="number" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span><a href="/apps/docs">記事の下書き</a><small>完了</small></span>
          </li>
          <li data-state="complete">
            <span class="number" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span><a href="/apps/docs">画像と代替テキスト</a><small>完了</small></span>
          </li>
          <li data-state="current" aria-current="step">
            <span class="number" aria-hidden="true">3</span
            ><span>公開範囲と共有リンクの確認<small>入力中</small></span>
          </li>
          <li data-state="upcoming">
            <span class="number" aria-hidden="true">4</span
            ><span>担当者の承認<small>未入力</small></span>
          </li>
          <li data-state="upcoming">
            <span class="number" aria-hidden="true">5</span
            ><span>公開<small>未入力</small></span>
          </li>
        </ol>
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
        ><span class="label"><span class="title">すべて終わった</span></span>
      </summary>
      <div class="body">
        <ol class="rx-steps" aria-label="終わった手順">
          <li data-state="complete">
            <span class="number" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span><a href="/apps/schedule">日時</a><small>完了</small></span>
          </li>
          <li data-state="complete">
            <span class="number" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span><a href="/apps/schedule">連絡先</a><small>完了</small></span>
          </li>
          <li data-state="complete">
            <span class="number" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span><a href="/apps/schedule">確認</a><small>完了</small></span>
          </li>
        </ol>
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
        ><span class="label"><span class="title">狭い場所で縦に積む</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 14rem">
          <ol class="rx-steps" aria-label="狭い場所の手順">
            <li data-state="complete">
              <span class="number" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
              ><span><a href="/apps/schedule">日時</a><small>完了</small></span>
            </li>
            <li data-state="current" aria-current="step">
              <span class="number" aria-hidden="true">2</span
              ><span>連絡先<small>入力中</small></span>
            </li>
            <li data-state="upcoming">
              <span class="number" aria-hidden="true">3</span
              ><span>確認<small>未入力</small></span>
            </li>
          </ol>
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
          <ol class="rx-steps" aria-label="خطوات الحجز">
            <li data-state="complete">
              <span class="number" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
              ><span><a href="/apps/schedule">الموعد</a><small>完了</small></span>
            </li>
            <li data-state="current" aria-current="step">
              <span class="number" aria-hidden="true">2</span
              ><span>بيانات الاتصال<small>入力中</small></span>
            </li>
            <li data-state="upcoming">
              <span class="number" aria-hidden="true">3</span
              ><span>التأكيد<small>未入力</small></span>
            </li>
          </ol>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
