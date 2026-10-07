<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# PageHeader

対象と作業を、大きな見出しで伝えます。

## 使いどころ

- 画面の最上部で、その画面の対象と作業を大きな見出しで示す時に使います。
- 作業面の中のまとまりの見出しは`Section`、人やグループの画面の見出しは`ProfileHeader`を使います。
- `align="center"`は作業面の主題を示す時だけに使います。本文や入力欄は中央に揃えません。

## 使い方

`title`を見出し、`description`をその下の補足として出します。`icon`は見出しの前の大きなアイコン、`actions`は見出しの後に並ぶ操作です。

既定は先頭側に揃えます。`align="center"`では、アイコン・見出し・補足・操作を中央に積み、見出しの左右から線を伸ばします。

見出しの文字は、画面の見出しの大きさを上限に、`PageHeader`自身の幅が狭いほど小さくします。小見出しより小さくはしません。幅が30rem未満では`actions`を見出しの下の行へ回します。

## アクセシビリティ

- ルートは`header`で、見出しと補足を`hgroup`にまとめます。
- 見出しは常に`h1`です。一つの画面に`PageHeader`は一つだけ置きます。

## API

### PageHeader

| 名前            | 型                    | 既定値    | 説明                                                                                            |
| --------------- | --------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `title`（必須） | `string`              |           | 画面の見出し。h1で出すので、一つの画面に一つだけ置く。                                          |
| `description`   | `string`              |           | 見出しの下の補足の一文。                                                                        |
| `icon`          | `Child`               |           | 見出しの先頭側に置く大きなアイコン（Iconなど）。淡い背景の角丸の枠に収める。                    |
| `actions`       | `Child`               |           | 見出しの末尾側に並べる操作。狭い場所では見出しの下の行へ回す。                                  |
| `align`         | `"center" \| "start"` | `"start"` | startは先頭側に揃える。centerは見出しを中央に置き、左右から線を伸ばして作業面の主題として示す。 |

ほかに、`<header>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/page-header.css`

## コード

```tsx
import { PageHeader } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <PageHeader
      title="設定を確認する"
      description="入力軸に揃えるバリエーションです。"
      align="start"
    />
    <PageHeader
      title="受信トレイ"
      description="作業面の主題は中央に置き、見出しの左右から線を伸ばします。"
      align="center"
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <header class="rx-page-header" data-align="start">
    <hgroup class="heading">
      <h1>設定を確認する</h1>
      <p>入力軸に揃えるバリエーションです。</p>
    </hgroup>
  </header>
  <header class="rx-page-header" data-align="center">
    <hgroup class="heading">
      <h1>受信トレイ</h1>
      <p>作業面の主題は中央に置き、見出しの左右から線を伸ばします。</p>
    </hgroup>
  </header>
</div>
```

</details>
