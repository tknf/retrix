<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Breadcrumb

階層をたどって、上の階層へ戻ります。

## 使いどころ

- 階層の深い画面で、上位の階層をたどって戻れるようにする時に使います。
- 作業面の上端で現在地と操作を一緒に置く時は`ContextBar`、一つ上へ戻るだけなら`BackLink`を使います。

## 使い方

`items`に上位から現在地までを順に渡します。`href`を持つ項目はリンクになります。最後の項目は現在地として太字の文字で出し、`href`を渡してもリンクにしません。

項目の間には「/」を置きます。狭い場所では項目の間で折り返し、長い名前は途中でも折り返します。

単独でも、`ContextBar`の現在地としても使えます。

## アクセシビリティ

- ルートは`label`を読み上げ名に持つ`nav`で、項目を`ol`の順に並べます。
- 最後の項目に`aria-current="page"`を付けます。

## API

### Breadcrumb

| 名前            | 型                          | 既定値         | 説明                                                                            |
| --------------- | --------------------------- | -------------- | ------------------------------------------------------------------------------- |
| `label`         | `string`                    | `"現在の位置"` | navの読み上げ名。                                                               |
| `items`（必須） | `readonly BreadcrumbItem[]` |                | 上位から現在地までの階層。最後の項目を現在地としてaria-current="page"を付ける。 |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/breadcrumb.css`

#### `BreadcrumbItem`

| 名前            | 型       | 既定値 | 説明                                                                                            |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 階層の名前。                                                                                    |
| `href`          | `string` |        | 戻り先のURL。最後の項目（現在地）では渡してもリンクにしない。省略するとリンクのない文字になる。 |

## コード

```tsx
import { Breadcrumb } from "@tknf/retrix/hono";

export default () => (
  <Breadcrumb
    items={[
      { label: "道具箱", href: "/" },
      { label: "記事", href: "/apps/search" },
      { label: "編集" },
    ]}
  />
);
```

<details>
<summary>出力されるHTML</summary>

```html
<nav class="rx-breadcrumb" aria-label="現在の位置">
  <ol>
    <li><a href="/">道具箱</a></li>
    <li><a href="/apps/search">記事</a></li>
    <li><span aria-current="page">編集</span></li>
  </ol>
</nav>
```

</details>
