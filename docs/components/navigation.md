<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Navigation

同じ領域のページを切り替えます。

## 使いどころ

- 設定の項目や記事の分類など、同じ領域の中のページを縦に並べて切り替える時に使います。画面の端に固定するサイドバーにはしません。`AppShell`の`aside`の列か、作業面の中に置きます。
- アプリ全体の移動は`AppShell`のヘッダーの`navigation`、名前で探す移動は`CommandMenu`、同じ場所でパネルを切り替える時は`Tabs`、一覧の絞り込みを切り替える時は`FilterBar`を使います。

## 使い方

`label`と`items`を渡します。各項目は通常のリンクで、背景のパネルを持たず、置いた場所の地（机の地やシート）の上に行を直接並べます。行の間に線は引きません。ホバーすると名前に下線を引きます。

`current`の項目は、行を淡い灰色の面で塗り、名前を黒い太字にして示します。

`count`は名前のすぐ後ろに小さな茶色の数字で出し（「連絡先 60」）、`0`も表示します。`icon`は名前の前の列に揃え、名前より淡い灰色で置きます。

一覧は中身の高さに収め、隣の要素の高さまで引き伸ばしません。長い名前は折り返します。

## アクセシビリティ

- ルートは`label`を読み上げ名に持つ`nav`で、項目は通常のリンクです。アプリのメニューのrole（`menu`など）は付けません。
- `current`の項目に`aria-current="page"`を付けます。

## API

### Navigation

| 名前            | 型                          | 既定値 | 説明                                                                             |
| --------------- | --------------------------- | ------ | -------------------------------------------------------------------------------- |
| `label`（必須） | `string`                    |        | navの読み上げ名（「設定項目」など）。同じ画面に複数のnavがある時の区別にもなる。 |
| `items`（必須） | `readonly NavigationItem[]` |        | 並べるページ。上から順に一行ずつ出す。                                           |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/navigation.css`

#### `NavigationItem`

| 名前            | 型        | 既定値 | 説明                                                                |
| --------------- | --------- | ------ | ------------------------------------------------------------------- |
| `label`（必須） | `string`  |        | 項目の名前。                                                        |
| `href`（必須）  | `string`  |        | 移動先のURL。現在地の項目もリンクのまま出す。                       |
| `current`       | `boolean` |        | 今いる項目。aria-current="page"を付け、見た目でも現在地として示す。 |
| `count`         | `number`  |        | 名前の後に出す件数。0も表示し、省略すると出さない。                 |
| `icon`          | `Child`   |        | 名前の前のアイコン（Iconなど）。                                    |

## コード

```tsx
import { Navigation, Icon, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <div style="max-inline-size: 18rem">
      <Navigation
        label="記事の分類"
        items={[
          { label: "すべての記事", href: "/apps/search", current: true, count: 6 },
          { label: "下書き", href: "/apps/search?state=draft", count: 2 },
          { label: "道具箱へ", href: "/" },
        ]}
      />
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="アイコン付き">
        <div style="max-inline-size: 18rem">
          <Navigation
            label="設定項目"
            items={[
              {
                label: "基本情報",
                href: "#basic",
                icon: <Icon name="pencil" fill />,
                current: true,
              },
              {
                label: "通知と表示",
                href: "#display",
                icon: <Icon name="mail" fill />,
              },
              {
                label: "予定",
                href: "#calendar",
                icon: <Icon name="calendar" fill />,
                count: 12,
              },
              { label: "ファイル", href: "#files", icon: <Icon name="files" fill /> },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="長い名前・狭い場所で折り返す">
        <div style="max-inline-size: 14rem">
          <Navigation
            label="長い名前の分類"
            items={[
              {
                label: "公開前の確認が終わっていない、とても長い名前の記事",
                href: "/apps/search?state=review",
                current: true,
                count: 128,
              },
              { label: "下書き", href: "/apps/search?state=draft", count: 2 },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar" style="max-inline-size: 18rem">
          <Navigation
            label="تصنيف المقالات"
            items={[
              { label: "كل المقالات", href: "/apps/search", current: true, count: 6 },
              {
                label: "المسودات",
                href: "/apps/search?state=draft",
                icon: <Icon name="pencil" fill />,
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
<div class="rx-stack" data-space="small">
  <div style="max-inline-size: 18rem">
    <nav class="rx-navigation" aria-label="記事の分類">
      <a href="/apps/search" aria-current="page" data-current="true"
        ><span>すべての記事</span><small>6</small></a
      ><a href="/apps/search?state=draft"><span>下書き</span><small>2</small></a
      ><a href="/"><span>道具箱へ</span></a>
    </nav>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="内容と置き場所の違い">
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
        ><span class="label"><span class="title">アイコン付き</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 18rem">
          <nav class="rx-navigation" aria-label="設定項目">
            <a href="#basic" aria-current="page" data-current="true"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
              ><span>基本情報</span></a
            ><a href="#display"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg></span
              ><span>通知と表示</span></a
            ><a href="#calendar"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
              ><span>予定</span><small>12</small></a
            ><a href="#files"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
              ><span>ファイル</span></a
            >
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
        ><span class="label"
          ><span class="title">長い名前・狭い場所で折り返す</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 14rem">
          <nav class="rx-navigation" aria-label="長い名前の分類">
            <a href="/apps/search?state=review" aria-current="page" data-current="true"
              ><span>公開前の確認が終わっていない、とても長い名前の記事</span
              ><small>128</small></a
            ><a href="/apps/search?state=draft"><span>下書き</span><small>2</small></a>
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
        <div dir="rtl" lang="ar" style="max-inline-size: 18rem">
          <nav class="rx-navigation" aria-label="تصنيف المقالات">
            <a href="/apps/search" aria-current="page" data-current="true"
              ><span>كل المقالات</span><small>6</small></a
            ><a href="/apps/search?state=draft"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
              ><span>المسودات</span></a
            >
          </nav>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
