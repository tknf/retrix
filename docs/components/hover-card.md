<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# HoverCard

対象の概要と関連する操作を、近くに表示します。

## 使いどころ

- 人・案件・資料へのリンクのように、移る前に中身の概要を確かめたい対象に使います。
- 一言の補足で足りる時は `Tooltip`、押して開く補足や小さな入力は `Popover` を使います。
- ホバーしなくても分かるよう、欠かせない情報はプレビューだけに置かず、移動先にも置きます。

## 使い方

`HoverCardController` を `hover-card` として登録します。`id` は画面内で一意にします。ホバーして300ms後、またはフォーカスした時にプレビューのパネルを開き、ポインターとフォーカスが離れて150ms後に閉じます。ポインターをパネルへ移す間は、斜めに横切っても開いたままです。

`href` が無ければ `label` の操作を押しても開きます。`href` を渡すと、`label` を移動のリンクにし、隣に目のアイコンのプレビュー操作を置きます。リンクを押すと移動し、プレビュー操作を押すとパネルを開きます。プレビュー操作はcontrollerが働いた時だけ出します。

パネルの見出し・説明・本文・操作欄の組み立ては `Popover`・`Dialog` と同じです。`title` を省略すると `label` を見出しにします。関連する操作がある時だけ `actions` を渡します。`size` はパネルの幅の上限で、`compact` は16rem、`default` は20rem、`wide` は28remです。

Escapeと、見出しの横の閉じる操作で閉じます。閉じた後は、ポインターを離すかフォーカスを外すまで再び開きません。

タッチ操作では触れても開きません。JavaScriptなしではパネルは開かず、リンクは通常のリンクとして動きます。パネルの中身の取得や操作の処理は利用側が行います。

## キーボード

| キー                            | 動作                                                                  |
| ------------------------------- | --------------------------------------------------------------------- |
| Tab（リンク・操作へ）           | フォーカスするとパネルを開きます。パネルの中の操作へもTabで進めます。 |
| Enter / Space（プレビュー操作） | パネルを開きます。                                                    |
| Escape                          | パネルを閉じ、パネルの中にフォーカスがあれば開いた操作へ戻します。    |

## アクセシビリティ

- パネルは `role="dialog"` で、見出しを名前（`aria-labelledby`）、`description` を説明（`aria-describedby`）にします。
- 開く操作とプレビュー操作は `aria-controls` と `aria-expanded` を持ちます。プレビュー操作は「（label）のプレビューを開く」という名前で読み上げます。
- パネルの中に `autofocus` を置くと、controllerは働かず、コンソールに警告を出します。
- 見出しの横の閉じる操作はアイコンだけなので、`closeLabel` を `aria-label` にします。

## イベント

| イベント                  | 内容                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `hover-card:beforetoggle` | パネルを開く・閉じる直前。取り消せます。`detail` は `open`（次の状態）・`previousOpen`・`reason`（`pointer` または `keyboard`）です。 |
| `hover-card:toggle`       | パネルを開いた・閉じた後。`detail` は `hover-card:beforetoggle` と同じです。                                                          |

## API

### HoverCard

リンクや操作の対象を、hover・focusで開く操作可能なプレビュー。

| 名前            | 型                                 | 既定値      | 説明                                                                                                                          |
| --------------- | ---------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）    | `string`                           |             | パネルのid。画面内で一意にする。見出しは`<id>-title`になる。                                                                  |
| `label`（必須） | `string`                           |             | 開く操作（またはリンク）の文言。                                                                                              |
| `title`         | `string`                           | `label`     | パネルの見出し。省略するとlabelを使う。                                                                                       |
| `description`   | `string`                           |             | 見出しの下に置く短い説明。パネルの説明（`aria-describedby`）になる。                                                          |
| `size`          | `"compact" \| "default" \| "wide"` | `"default"` | パネルの幅。compactは16rem、defaultは20rem、wideは28remを上限にする。                                                         |
| `href`          | `string`                           |             | 渡すと、labelを移動のリンクにし、隣に目のアイコンのプレビュー操作を置く。押すとリンクは移動し、プレビュー操作はパネルを開く。 |
| `closeLabel`    | `string`                           | `"閉じる"`  | 見出しの横の閉じる操作の名前。                                                                                                |
| `actions`       | `Child`                            |             | パネルの下の操作欄に並べる関連操作。関連する操作がある時だけ渡す。                                                            |
| `children`      | `Child`                            |             | パネルの本文。対象の概要を置く。                                                                                              |

登録するcontroller：`hover-card`（`HoverCardController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/hover-card.css`

## コード

```tsx
import { ActionLink, HoverCard } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-cluster">
    <HoverCard
      id="hover-card-summary"
      label="公開準備"
      description="案件の進行と担当者"
      actions={<ActionLink href="/apps/project">案件を開く</ActionLink>}
    >
      <p>担当者：田中 遥</p>
    </HoverCard>
    <HoverCard id="hover-card-link" label="資料一覧" href="/apps/files" size="compact">
      <p>追加された資料と更新日を確認できます。</p>
    </HoverCard>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-cluster">
  <div class="rx-hover-card" data-controller="hover-card">
    <button
      data-hover-card-target="trigger"
      aria-controls="hover-card-summary"
      aria-expanded="false"
      style="
        anchor-name: --rx-hover-card-68-6f-76-65-72-2d-63-61-72-64-2d-73-75-6d-6d-61-72-79;
      "
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      公開準備
    </button>
    <div
      id="hover-card-summary"
      class="panel rx-overlay"
      data-placement="anchor"
      popover="manual"
      role="dialog"
      aria-labelledby="hover-card-summary-title"
      aria-describedby="hover-card-summary-description"
      data-hover-card-target="content"
      data-size="default"
      style="
        --rx-overlay-anchor: --rx-hover-card-68-6f-76-65-72-2d-63-61-72-64-2d-73-75-6d-6d-61-72-79;
      "
    >
      <header class="heading">
        <div class="heading-row">
          <strong id="hover-card-summary-title">公開準備</strong
          ><span class="close"
            ><button
              data-hover-card-target="close"
              data-icon-only="true"
              aria-label="閉じる"
              class="rx-button"
              type="button"
              data-variant="primary"
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
              </svg></button
          ></span>
        </div>
        <p id="hover-card-summary-description">案件の進行と担当者</p>
      </header>
      <div class="body"><p>担当者：田中 遥</p></div>
      <footer class="actions">
        <a
          href="/apps/project"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >案件を開く</a
        >
      </footer>
    </div>
  </div>
  <div class="rx-hover-card" data-controller="hover-card">
    <a
      href="/apps/files"
      data-hover-card-target="trigger"
      aria-controls="hover-card-link"
      aria-expanded="false"
      style="anchor-name: --rx-hover-card-68-6f-76-65-72-2d-63-61-72-64-2d-6c-69-6e-6b"
      class="rx-button"
      data-variant="secondary"
      data-size="default"
      >資料一覧</a
    ><button
      data-hover-card-target="preview"
      data-icon-only="true"
      aria-label="資料一覧のプレビューを開く"
      aria-controls="hover-card-link"
      aria-expanded="false"
      class="rx-button preview"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      <svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-eye"></use>
      </svg>
    </button>
    <div
      id="hover-card-link"
      class="panel rx-overlay"
      data-placement="anchor"
      popover="manual"
      role="dialog"
      aria-labelledby="hover-card-link-title"
      data-hover-card-target="content"
      data-size="compact"
      style="
        --rx-overlay-anchor: --rx-hover-card-68-6f-76-65-72-2d-63-61-72-64-2d-6c-69-6e-6b;
      "
    >
      <header class="heading">
        <div class="heading-row">
          <strong id="hover-card-link-title">資料一覧</strong
          ><span class="close"
            ><button
              data-hover-card-target="close"
              data-icon-only="true"
              aria-label="閉じる"
              class="rx-button"
              type="button"
              data-variant="primary"
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
              </svg></button
          ></span>
        </div>
      </header>
      <div class="body"><p>追加された資料と更新日を確認できます。</p></div>
    </div>
  </div>
</div>
```

</details>
