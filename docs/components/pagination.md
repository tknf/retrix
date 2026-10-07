<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Pagination

分割された一覧のページを移動します。

## 使いどころ

- 検索結果や一覧を複数のページに分け、ページの間を移る時に使います。
- 手順の段階を示す時は`Steps`、同じ領域のページを切り替える時は`Navigation`を使います。

## 使い方

`items`に前後の送り・番号・省略記号を並べて渡します。どの番号を並べ、どこを「…」で省くか、各項目のURLは利用側が決めます。

文字は11pxの黒い太字です。`href`を持つ項目は、控えめなボタンと同じ5pxの角丸の四角のリンクになります（ピルにはしません）。枠は下ほど濃い灰色（上`#dddddd`・横`#cecece`・下`#b8b8b8`）で、面は白から`#e7e7e7`への縦の塗り（Highriseのページ送りの実測）、下に淡い1pxの影を付けます。ホバーすると塗りを一段灰色に寄せ、押すと塗りの上下を反転して影を外します。`current`の項目はリンクにせず、面も枠も持たない黒い太字の文字で、送りの間に置いて今のページを示します。`href`のない項目（最初のページの「前へ」など）は、形・枠・塗りをそのままにし、文字だけを灰色にします。`label`が「…」の項目は、省略記号として文字だけを出します。

四角の高さと最小の幅は24pxで、指で操作する画面では44pxにします。狭い場所では折り返します。

## アクセシビリティ

- ルートは`label`を読み上げ名に持つ`nav`です。
- 今のページに`aria-current="page"`、押せない送りに`aria-disabled="true"`を付けます。

## API

### Pagination

| 名前            | 型                    | 既定値         | 説明                                                                               |
| --------------- | --------------------- | -------------- | ---------------------------------------------------------------------------------- |
| `items`（必須） | `readonly PageLink[]` |                | 左から順に並べるページ送り。前後への送り・番号・省略記号を利用側が組み立てて渡す。 |
| `label`         | `string`              | `"ページ送り"` | navの読み上げ名。                                                                  |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/pagination.css`

#### `PageLink`

| 名前            | 型        | 既定値 | 説明                                                                                                                      |
| --------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`  |        | 表示する文字（「1」「次へ」など）。「…」は省略記号として、無効の扱いにせず文字だけを出す。                                |
| `href`          | `string`  |        | 移動先のURL。省略した項目は押せないページ送りとして、aria-disabled="true"を付け、形はそのままに文字だけを灰色にして出す。 |
| `current`       | `boolean` |        | 今のページ。hrefがあってもリンクにせず、aria-current="page"を付けて面の無い黒い太字で出す。                               |

## コード

```tsx
import { Pagination, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <Pagination
      items={[
        { label: "前へ" },
        { label: "1", current: true, href: "/apps/search" },
        { label: "2", href: "/apps/search?page=2" },
        { label: "3", href: "/apps/search?page=3" },
        { label: "次へ", href: "/apps/search?page=2" },
      ]}
    />
    <DisclosureGroup label="位置と長さの違い">
      <Disclosure summary="途中のページ：前後があり、間を省く">
        <Pagination
          items={[
            { label: "前へ", href: "/apps/search?page=6" },
            { label: "1", href: "/apps/search" },
            { label: "…" },
            { label: "6", href: "/apps/search?page=6" },
            { label: "7", current: true, href: "/apps/search?page=7" },
            { label: "8", href: "/apps/search?page=8" },
            { label: "…" },
            { label: "24", href: "/apps/search?page=24" },
            { label: "次へ", href: "/apps/search?page=8" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="最後のページ：次へは押せない">
        <Pagination
          items={[
            { label: "前へ", href: "/apps/search?page=2" },
            { label: "1", href: "/apps/search" },
            { label: "2", href: "/apps/search?page=2" },
            { label: "3", current: true, href: "/apps/search?page=3" },
            { label: "次へ" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 14rem">
          <Pagination
            items={[
              { label: "前のページへ", href: "/apps/search?page=6" },
              { label: "6", href: "/apps/search?page=6" },
              { label: "7", current: true, href: "/apps/search?page=7" },
              { label: "8", href: "/apps/search?page=8" },
              { label: "次のページへ", href: "/apps/search?page=8" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Pagination
            label="التنقل بين الصفحات"
            items={[
              { label: "السابق" },
              { label: "١", current: true, href: "/apps/search" },
              { label: "٢", href: "/apps/search?page=2" },
              { label: "التالي", href: "/apps/search?page=2" },
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
  <nav class="rx-pagination" aria-label="ページ送り">
    <ul>
      <li><span data-disabled="true" aria-disabled="true">前へ</span></li>
      <li><span data-current="true" aria-current="page">1</span></li>
      <li><a href="/apps/search?page=2">2</a></li>
      <li><a href="/apps/search?page=3">3</a></li>
      <li><a href="/apps/search?page=2">次へ</a></li>
    </ul>
  </nav>
  <div class="rx-disclosure-group" role="group" aria-label="位置と長さの違い">
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
          ><span class="title">途中のページ：前後があり、間を省く</span></span
        >
      </summary>
      <div class="body">
        <nav class="rx-pagination" aria-label="ページ送り">
          <ul>
            <li><a href="/apps/search?page=6">前へ</a></li>
            <li><a href="/apps/search">1</a></li>
            <li><span>…</span></li>
            <li><a href="/apps/search?page=6">6</a></li>
            <li><span data-current="true" aria-current="page">7</span></li>
            <li><a href="/apps/search?page=8">8</a></li>
            <li><span>…</span></li>
            <li><a href="/apps/search?page=24">24</a></li>
            <li><a href="/apps/search?page=8">次へ</a></li>
          </ul>
        </nav>
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
          ><span class="title">最後のページ：次へは押せない</span></span
        >
      </summary>
      <div class="body">
        <nav class="rx-pagination" aria-label="ページ送り">
          <ul>
            <li><a href="/apps/search?page=2">前へ</a></li>
            <li><a href="/apps/search">1</a></li>
            <li><a href="/apps/search?page=2">2</a></li>
            <li><span data-current="true" aria-current="page">3</span></li>
            <li><span data-disabled="true" aria-disabled="true">次へ</span></li>
          </ul>
        </nav>
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
        <div style="max-inline-size: 14rem">
          <nav class="rx-pagination" aria-label="ページ送り">
            <ul>
              <li><a href="/apps/search?page=6">前のページへ</a></li>
              <li><a href="/apps/search?page=6">6</a></li>
              <li><span data-current="true" aria-current="page">7</span></li>
              <li><a href="/apps/search?page=8">8</a></li>
              <li><a href="/apps/search?page=8">次のページへ</a></li>
            </ul>
          </nav>
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
          <nav class="rx-pagination" aria-label="التنقل بين الصفحات">
            <ul>
              <li><span data-disabled="true" aria-disabled="true">السابق</span></li>
              <li><span data-current="true" aria-current="page">١</span></li>
              <li><a href="/apps/search?page=2">٢</a></li>
              <li><a href="/apps/search?page=2">التالي</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
