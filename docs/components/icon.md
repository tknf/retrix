<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Icon

操作や用途を表す文言に添えるアイコンです。

## 使いどころ

- 操作名や項目名の前に置き、文言を補う時に使います。アイコンだけで意味を伝えません。
- 縦に並ぶ一覧のように、塗ったアイコンで項目を見分ける場所では `fill` の塗りつぶしの版を使います。
- アイコンだけのボタンは、`Button` に `aria-label` を付けて作ります。
- `Button`・`ActionLink` の中では、`Icon` を文言の前にそのまま置きます。アイコンと文言の間隔と縦の配置は `Button` が持つので、クラスは要りません。

## 使い方

`name` にアイコンの名前を渡します。Phosphor Icons（MIT）のregularを共通で使い、`fill` で同じ絵柄の塗りつぶしの版にします。

大きさは文字に合わせた1em、`data-size="small"` は6em/7です。14pxの文字なら14px・12pxの枠になります。名前による大きさや太さの分岐はありません。大きなショートカットや空状態の図は、その役割を持つ親要素が大きさを決めます。色は文字の色を継ぎます。

`Icon` は外部のSVGスプライトを `<use>` で参照します。pathを出現箇所ごとに埋め込まないので、HTMLが重複せず、スプライトは共通のリソースとしてキャッシュできます。パッケージの `@tknf/retrix/icons.svg`（`dist/icons.svg`）を、アプリと同じオリジンに置きます。既定のURLは `/assets/rx-icons.svg` で、別の場所に置いた時は `sprite` で指定します。キャッシュ期間は利用側のHTTPヘッダーで決めます。

JavaScriptは使いません。CSSだけで使う時も、`class="rx-icon"`・`viewBox="0 0 256 256"`・`aria-hidden="true"`・`focusable="false"` の `svg` に `<use href="/assets/rx-icons.svg#rx-pencil">` を書きます。塗りつぶしの版は `#rx-pencil-fill` です。

Checkbox・TaskListのチェックマークとSelectの矢印は、同じ素材から作った単独のSVGをCSSのmaskや背景として使います。

使える名前は `src/internal/icon-manifest.json` で決まります。キーが `name` に渡す名前、値がPhosphor Iconsの元の名前です。追加する時はこのファイルに書き、`vp run icons:build` でスプライト・CSS用の単独SVG・`IconName` 型を作り直します。スプライトの中と `dist/PHOSPHOR-LICENSE` に、MITの著作権・許諾文を同梱しています。

## アクセシビリティ

- `Icon` は `aria-hidden="true"`・`focusable="false"` で、読み上げとフォーカスから外れます。
- 意味は隣の文言か、操作の `aria-label` で伝えます。

## API

### Icon

装飾アイコン。意味と操作名は隣の文言または操作コンポーネントのaria-labelで伝える。

| 名前           | 型         | 既定値                   | 説明                                                                                       |
| -------------- | ---------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `name`（必須） | `IconName` |                          | アイコンの名前。使える名前はdocs/icons.mdの「使えるアイコン」を見る。                      |
| `fill`         | `boolean`  | `false`                  | 塗りつぶし版。縦並びの一覧など、太いアイコンで項目を見分ける場所で使う。                   |
| `sprite`       | `string`   | `"/assets/rx-icons.svg"` | スプライトのURL。配布のicons.svgを既定と別の場所に置いた時に指定する。同じオリジンに置く。 |
| `class`        | `string`   |                          | svgに追加するクラス。ルートのrx-iconは常に付く。                                           |
| `data-size`    | `"small"`  |                          | smallは6em/7の大きさにする。渡さなければ1em（文字と同じ大きさ）。                          |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

## コード

```tsx
import {
  Icon,
  Button,
  ActionLink,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const names = [
  "pencil",
  "search",
  "calendar",
  "files",
  "file",
  "chart",
  "check",
  "layers",
  "arrow",
  "eye",
  "eye-slash",
  "compare",
  "caret",
  "trash",
  "x",
  "x-circle",
  "info",
  "mail",
  "chat",
  "grid",
  "grip",
  "equals",
  "plus",
] as const;
export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <Button>
        <Icon name="pencil" />
        編集する
      </Button>
      <ActionLink href="/apps/search">
        <Icon name="search" />
        記事を探す
      </ActionLink>
      <Button aria-label="削除する" data-icon-only="true" variant="danger">
        <Icon name="trash" />
      </Button>
    </div>
    <div class="rx-cluster">
      <span>
        <Icon name="calendar" /> 9月25日の予定
      </span>
      <span>
        <Icon name="file" /> 添付ファイル
      </span>
    </div>
    <div class="rx-cluster">
      <Button disabled>
        <Icon name="check" />
        確認済み
      </Button>
      <Button size="large">
        <Icon name="pencil" />
        記事を書く
      </Button>
    </div>
    <DisclosureGroup label="アイコンの一覧と塗りつぶしの形">
      <Disclosure summary="すべてのアイコン（通常の形と塗りつぶしの形）">
        <ul class="catalog-icon-grid">
          {names.map((name) => (
            <li>
              <span class="pair">
                <Icon name={name} />
                <Icon name={name} fill />
              </span>
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </Disclosure>
      <Disclosure summary="塗りつぶしのアイコンで項目を見分ける">
        <ul class="catalog-icon-rows">
          <li>
            <Icon name="mail" fill />
            受信箱
          </li>
          <li>
            <Icon name="calendar" fill />
            予定
          </li>
          <li>
            <Icon name="files" fill />
            すべてのファイル
          </li>
        </ul>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-cluster">
    <button
      class="rx-button"
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
        <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
      >編集する</button
    ><a
      href="/apps/search"
      class="rx-button"
      data-variant="secondary"
      data-size="default"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-search"></use></svg
      >記事を探す</a
    ><button
      aria-label="削除する"
      data-icon-only="true"
      class="rx-button"
      type="button"
      data-variant="danger"
      data-size="default"
    >
      <svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-trash"></use>
      </svg>
    </button>
  </div>
  <div class="rx-cluster">
    <span
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-calendar"></use>
      </svg>
      9月25日の予定</span
    ><span
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-file"></use>
      </svg>
      添付ファイル</span
    >
  </div>
  <div class="rx-cluster">
    <button
      class="rx-button"
      type="button"
      data-variant="secondary"
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
        <use href="/assets/rx-icons.svg#rx-check"></use></svg
      >確認済み</button
    ><button class="rx-button" type="button" data-variant="secondary" data-size="large">
      <svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
      >記事を書く
    </button>
  </div>
  <div
    class="rx-disclosure-group"
    role="group"
    aria-label="アイコンの一覧と塗りつぶしの形"
  >
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
          ><span class="title">すべてのアイコン（通常の形と塗りつぶしの形）</span></span
        >
      </summary>
      <div class="body">
        <ul class="catalog-icon-grid">
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
            ><code>pencil</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-search"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-search-fill"></use></svg></span
            ><code>search</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
            ><code>calendar</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-files"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
            ><code>files</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file-fill"></use></svg></span
            ><code>file</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-chart"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-chart-fill"></use></svg></span
            ><code>chart</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg></span
            ><code>check</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
            ><code>layers</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow-fill"></use></svg></span
            ><code>arrow</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-eye"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-eye-fill"></use></svg></span
            ><code>eye</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-eye-slash"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-eye-slash-fill"></use></svg></span
            ><code>eye-slash</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-compare"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-compare-fill"></use></svg></span
            ><code>compare</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-caret"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-caret-fill"></use></svg></span
            ><code>caret</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-trash"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-trash-fill"></use></svg></span
            ><code>trash</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-fill"></use></svg></span
            ><code>x</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg></span
            ><code>x-circle</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-info"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg></span
            ><code>info</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-mail"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg></span
            ><code>mail</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-chat"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-chat-fill"></use></svg></span
            ><code>chat</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-grid"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-grid-fill"></use></svg></span
            ><code>grid</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-grip"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-grip-fill"></use></svg></span
            ><code>grip</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-equals"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-equals-fill"></use></svg></span
            ><code>equals</code>
          </li>
          <li>
            <span class="pair"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-plus"></use></svg
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-plus-fill"></use></svg></span
            ><code>plus</code>
          </li>
        </ul>
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
          ><span class="title">塗りつぶしのアイコンで項目を見分ける</span></span
        >
      </summary>
      <div class="body">
        <ul class="catalog-icon-rows">
          <li>
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg
            >受信箱
          </li>
          <li>
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg
            >予定
          </li>
          <li>
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg
            >すべてのファイル
          </li>
        </ul>
      </div>
    </details>
  </div>
</div>
```

</details>
