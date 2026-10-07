<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# BackLink

一つ上の階層へ戻るためのリンクです。

## 使いどころ

- 詳細の画面から、一つ上の場所（一覧や設定など）へ戻るだけのリンクを、画面の先頭側の角に置く時に使います。
- 階層を並べて見せる時は`Breadcrumb`、現在地と操作を一緒に置く時は`ContextBar`を使います。

## 使い方

`href`と`label`（戻る先の名前）を渡します。戻る向きのアイコンと名前を並べたリンクになります（「← 受信トレイへ戻る」）。

文字は12pxです。`tone="filled"`は本文のリンクと同じ青緑の文字で名前に1pxの下線を引き、ホバーすると赤にします。`tone="plain"`は灰色の文字で下線を引かず、ホバーした時だけ赤の文字と下線にします。どちらも面も枠も持ちません。

`shortcut`は名前の後にショートカットキーの表示を添えるだけです。キーの登録と、押した時の移動は利用側で行います。

長い名前は折り返します。右から左へ書く言語ではアイコンの向きを反転します。

## アクセシビリティ

- ルートは`a`で、読み上げ名は`label`です。
- ショートカットキーの表示は`aria-hidden`で読み上げません。キーを伝える時は、`aria-keyshortcuts`を利用側で渡します。

## API

### BackLink

一つ上の場所へ戻るだけのリンク。パンくずより軽く、画面の先頭側の角に置く。

| 名前            | 型                    | 既定値     | 説明                                                                                      |
| --------------- | --------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `href`（必須）  | `string`              |            | 戻る先のURL。                                                                             |
| `label`（必須） | `string`              |            | 戻る先の名前（「受信トレイ」「設定」など）。                                              |
| `shortcut`      | `string`              |            | 表示用のショートカットキー（「Esc」など）。登録は利用側で行う。                           |
| `tone`          | `"filled" \| "plain"` | `"filled"` | filledは下線付きの青緑の文字（既定）、plainは下線の無い灰色の文字。どちらも面を持たない。 |

ほかに、`<a>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/keycap.css`、`components/back-link.css`

## コード

```tsx
import { BackLink, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <BackLink href="/" label="受信トレイ" />
      <BackLink href="/" label="設定" />
    </div>
    <DisclosureGroup label="形の違い">
      <Disclosure summary="背景を持たない太字とショートカットキーの表示" open>
        <BackLink href="/" label="ボードへ戻る" tone="plain" shortcut="ESC" />
      </Disclosure>
      <Disclosure summary="長い名前">
        <div style="max-inline-size: 14rem">
          <BackLink href="/" label="秋の読書会の準備と当日の受付" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <BackLink href="/" label="الإعدادات" />
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
  <div class="rx-cluster">
    <a class="rx-back-link" href="/" data-tone="filled"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-back"></use></svg
      ><span class="label">受信トレイ</span></a
    ><a class="rx-back-link" href="/" data-tone="filled"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-back"></use></svg
      ><span class="label">設定</span></a
    >
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="形の違い">
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
        ><span class="label"
          ><span class="title">背景を持たない太字とショートカットキーの表示</span></span
        >
      </summary>
      <div class="body">
        <a class="rx-back-link" href="/" data-tone="plain"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-back"></use></svg
          ><span class="label">ボードへ戻る</span
          ><span aria-hidden="true" class="rx-keycap"><kbd>ESC</kbd></span></a
        >
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
        ><span class="label"><span class="title">長い名前</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 14rem">
          <a class="rx-back-link" href="/" data-tone="filled"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-back"></use></svg
            ><span class="label">秋の読書会の準備と当日の受付</span></a
          >
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
          <a class="rx-back-link" href="/" data-tone="filled"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-back"></use></svg
            ><span class="label">الإعدادات</span></a
          >
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
