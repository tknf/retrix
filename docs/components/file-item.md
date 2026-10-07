<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# FileItem

既存のファイルの名前と状態を示します。

## 使いどころ

- 添付済み・送信待ち・送信に失敗したファイルを、一件ずつ名前と状態で示す時に使います。
- ファイルを選ぶ・ドロップする欄は `FileInput` を使います。画像そのものを見せる時は `ImageFrame` を使います。

## 使い方

`name` と `description`（形式・大きさ・日付など）を渡します。ファイルのアイコンは、1px #e0e0e0 の枠とごく淡い影を持つ白い縦長の四角（32×40px）に青緑で描きます。名前は12pxの黒い太字、説明は灰色（#757575）の小さな文字（11px）です。`href` を渡すと名前がリンクになり、ホバーした時だけ赤い文字と下線にします。長い名前も省略せずに折り返します。

`preview` に画像やPDFの1ページ目の縮小を渡すと、ファイルのアイコンの代わりに中身を見せます。縮小は角丸なしの1px #ccc の枠で囲み、40pxの正方形に切り抜きます。

`state` は `ready`・`pending`・`error` です。`pending` はアイコンを淡い灰色の面に灰色で描いて縮小を薄くし、説明の前に「待機中 · 」を付けます。`error` はアイコンを淡い赤の面に赤で描き、説明の前に赤い「送信失敗 · 」を付けます。`error` の時は `description` に直し方を書きます。

`actions` に確認や再送信の操作を渡します。置き場所の幅が26rem以上なら右端に、狭ければ名前の下に置きます。送信・再送・削除の処理は利用側が持ちます。

JavaScriptは使いません。

## アクセシビリティ

- 「待機中」「送信失敗」は説明の一部として読み上げるので、状態は色だけでなく文言でも伝わります。
- ファイルのアイコンは読み上げから外れます。`preview` に画像を渡す時は、`alt` や `aria-label` を利用側で付けます。

## API

### FileItem

| 名前                  | 型                                | 既定値    | 説明                                                                                                                                                                         |
| --------------------- | --------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`（必須）        | `string`                          |           | ファイル名。長い名前も省略せずに折り返す。                                                                                                                                   |
| `description`（必須） | `string`                          |           | 名前の下に灰色の小さな文字で添える形式・サイズ・日付など。エラーの時は直し方を書く。                                                                                         |
| `href`                | `string`                          |           | 渡すと名前をリンクにする。開く・ダウンロードするURLは利用側が用意する。                                                                                                      |
| `state`               | `"ready" \| "pending" \| "error"` | `"ready"` | readyは通常の表示。pendingはアイコンを控えめにして説明の前に「待機中 · 」を、 errorはアイコンと文言を危険の色にして「送信失敗 · 」を付ける。送信や再送の処理は利用側が持つ。 |
| `actions`             | `Child`                           |           | 行の末尾に置く操作（確認・再送信など）。広い幅では右端、狭い幅では名前の下に積む。                                                                                           |
| `preview`             | `Child`                           |           | 画像やPDFの1ページ目のサムネイル。渡すとファイルのアイコンの代わりに中身を見せる。                                                                                           |

ほかに、`<div>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/file-item.css`、`components/icon.css`

## コード

```tsx
import { FileItem, ActionLink, Button } from "@tknf/retrix/hono";
export default () => (
  <div>
    <FileItem
      name="読書会の写真.jpg"
      description="JPEG · 552 KB · 9月26日"
      href="/apps/files"
      preview={
        <svg viewBox="0 0 40 40" role="img" aria-label="窓辺の机の写真">
          <rect width="40" height="40" fill="#c9d8e2" />
          <rect y="26" width="40" height="14" fill="#8a6f55" />
          <rect x="6" y="8" width="14" height="14" fill="#eef4f8" />
          <circle cx="29" cy="20" r="6" fill="#5f7f6a" />
        </svg>
      }
    />
    <FileItem
      name="利用料金の請求書-2026-09.pdf"
      description="PDF · 47.7 KB · 9月13日"
      href="/apps/files"
      preview={
        <svg viewBox="0 0 40 40" role="img" aria-label="請求書の1ページ目">
          <rect width="40" height="40" fill="#ffffff" />
          <rect x="6" y="7" width="14" height="2" fill="#243946" />
          <rect x="6" y="13" width="28" height="1" fill="#b7c4cc" />
          <rect x="6" y="17" width="28" height="1" fill="#b7c4cc" />
          <rect x="6" y="21" width="20" height="1" fill="#b7c4cc" />
          <rect x="24" y="29" width="10" height="2" fill="#243946" />
        </svg>
      }
    />
    <FileItem
      name="仕事場の案内.pdf"
      description="PDF · 2.4 MB · 9月15日更新"
      href="/apps/files"
      actions={<ActionLink href="/apps/files">ファイルを確認する</ActionLink>}
    />
    <FileItem
      name="秋の読書会のお知らせと参加される皆さまへの詳しいご案内_2026年9月版.pdf"
      description="PDF · 1.8 MB"
      state="pending"
    />
    <FileItem
      name="project-2026-abcdefghijklmnopqrstuvwxyz0123456789.zip"
      description="接続を確認し、もう一度選択してください。"
      state="error"
      actions={<Button disabled>再送信する</Button>}
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div>
  <div class="rx-file-item" data-state="ready">
    <span class="preview"
      ><svg viewBox="0 0 40 40" role="img" aria-label="窓辺の机の写真">
        <rect width="40" height="40" fill="#c9d8e2"></rect>
        <rect y="26" width="40" height="14" fill="#8a6f55"></rect>
        <rect x="6" y="8" width="14" height="14" fill="#eef4f8"></rect>
        <circle cx="29" cy="20" r="6" fill="#5f7f6a"></circle></svg
    ></span>
    <div class="body">
      <p class="title"><a href="/apps/files">読書会の写真.jpg</a></p>
      <p class="description">JPEG · 552 KB · 9月26日</p>
    </div>
  </div>
  <div class="rx-file-item" data-state="ready">
    <span class="preview"
      ><svg viewBox="0 0 40 40" role="img" aria-label="請求書の1ページ目">
        <rect width="40" height="40" fill="#ffffff"></rect>
        <rect x="6" y="7" width="14" height="2" fill="#243946"></rect>
        <rect x="6" y="13" width="28" height="1" fill="#b7c4cc"></rect>
        <rect x="6" y="17" width="28" height="1" fill="#b7c4cc"></rect>
        <rect x="6" y="21" width="20" height="1" fill="#b7c4cc"></rect>
        <rect x="24" y="29" width="10" height="2" fill="#243946"></rect></svg
    ></span>
    <div class="body">
      <p class="title"><a href="/apps/files">利用料金の請求書-2026-09.pdf</a></p>
      <p class="description">PDF · 47.7 KB · 9月13日</p>
    </div>
  </div>
  <div class="rx-file-item" data-state="ready">
    <span class="icon"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-file"></use></svg
    ></span>
    <div class="body">
      <p class="title"><a href="/apps/files">仕事場の案内.pdf</a></p>
      <p class="description">PDF · 2.4 MB · 9月15日更新</p>
    </div>
    <div class="actions">
      <a
        href="/apps/files"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        >ファイルを確認する</a
      >
    </div>
  </div>
  <div class="rx-file-item" data-state="pending">
    <span class="icon"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-file"></use></svg
    ></span>
    <div class="body">
      <p class="title">
        <strong
          >秋の読書会のお知らせと参加される皆さまへの詳しいご案内_2026年9月版.pdf</strong
        >
      </p>
      <p class="description"><span class="state">待機中 · </span>PDF · 1.8 MB</p>
    </div>
  </div>
  <div class="rx-file-item" data-state="error">
    <span class="icon"
      ><svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-file"></use></svg
    ></span>
    <div class="body">
      <p class="title">
        <strong>project-2026-abcdefghijklmnopqrstuvwxyz0123456789.zip</strong>
      </p>
      <p class="description">
        <span class="state">送信失敗 · </span>接続を確認し、もう一度選択してください。
      </p>
    </div>
    <div class="actions">
      <button
        class="rx-button"
        type="button"
        data-variant="secondary"
        data-size="default"
        disabled=""
      >
        再送信する
      </button>
    </div>
  </div>
</div>
```

</details>
