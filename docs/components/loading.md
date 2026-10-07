<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Loading

読み込み中の処理を、文言とインジケーターで示します。

## 使いどころ

- 次の記事やコメントの取得など、短い待ちを何を待っているかの言葉と一緒に示す時に使います。
- 送信などボタンを押した後の待ちは、そのボタンの `busy` を使います。
- 作業量が分かる処理や、終わりの分からない長い処理は `Progress` を使います。架空の進み具合を付けません。
- 読み込んだ結果が0件だった時は `EmptyState` を使います。

## 使い方

`label` に待っている処理を書きます。文とインジケーターは灰色です。インジケーターは `variant` で選び、`wave`（既定）は三つの灰色の点を先頭側から順に濃くします。点は動かさず、濃くなっていない点も消さずに淡く残します。`orbit` は淡い輪の一部だけを濃くして回す丸、`halo` は中心から広がって消える灰色の輪です。

`layout="inline"` は文の流れに置く小さなインジケーターです。領域全体で待つ時は `layout="region"` にすると、面を敷かずに大きめのインジケーターと文を中央に縦に並べます。

読み込みを終えたら、Loadingを結果に置き換えます。JavaScriptは使いません。

## アクセシビリティ

- `role="status"` を持つので、`label` の文を読み上げます。インジケーターは読み上げから外します。
- 動きを減らす設定では、インジケーターの動きを止めます。

## API

### Loading

| 名前      | 型                            | 既定値          | 説明                                                                                                                 |
| --------- | ----------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `label`   | `string`                      | `"読み込み中…"` | 待っている処理を表す文。インジケーターの隣に書き、role="status"で読み上げる。                                        |
| `variant` | `"orbit" \| "wave" \| "halo"` | `"wave"`        | waveは青から紫の三つの点が順に跳ねるインジケーター（既定）、orbitは回る丸、haloは広がって消える輪。                  |
| `layout`  | `"inline" \| "region"`        | `"inline"`      | inlineは文の流れに置く小さなインジケーター。regionは待っている領域の中央に、大きめのインジケーターと文を縦に並べる。 |

ほかに、`<p>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/loading.css`

## コード

```tsx
import {
  Loading,
  Button,
  Progress,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <Loading label="次の記事を読み込んでいます…" />
    <Loading label="プロジェクトに添付されたすべてのファイルと画像を確認しています。もう少しお待ちください。" />
    <Loading
      layout="region"
      label="資料一覧を準備しています。表示できるまで、この領域でお待ちください。"
    />
    <div class="rx-cluster">
      <Button busy busyLabel="保存しています…">
        保存する
      </Button>
      <span>操作の待ち時間は、その操作のそばに表示します。</span>
    </div>
    <Progress label="添付ファイルの処理量を確認しています" />
    <DisclosureGroup label="動きと置き場所の違い">
      <Disclosure summary="三つの動き（順に跳ねる三つの点・回る丸・広がる輪）" open>
        <div class="rx-stack" data-space="small">
          <Loading
            variant="wave"
            label="順に跳ねる三つの点（既定）：返信を読み込んでいます…"
          />
          <Loading variant="orbit" label="回る丸：次のページを読み込んでいます…" />
          <Loading variant="halo" label="広がる輪：確認しています…" />
        </div>
      </Disclosure>
      <Disclosure summary="この領域で待つ">
        <div class="rx-stack" data-space="small">
          <Loading layout="region" label="コメントを読み込んでいます…" />
          <Loading
            variant="orbit"
            layout="region"
            label="記事の一覧を読み込んでいます…"
          />
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" data-space="small" style="max-inline-size: 14rem">
          <Loading label="秋の読書会の資料と参加者名簿を読み込んでいます…" />
          <Loading
            variant="halo"
            layout="region"
            label="https://example.com/articles/autumn-reading-club-2026 を確認しています…"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-stack" data-space="small" dir="rtl" lang="ar">
          <Loading variant="orbit" label="جارٍ تحميل الصفحة التالية…" />
          <Loading variant="wave" label="جارٍ كتابة الرد…" />
          <Loading variant="halo" layout="region" label="جارٍ التحقق…" />
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
  <p class="rx-loading" role="status" data-variant="wave" data-layout="inline">
    <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
    ><span class="label">次の記事を読み込んでいます…</span>
  </p>
  <p class="rx-loading" role="status" data-variant="wave" data-layout="inline">
    <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
    ><span class="label"
      >プロジェクトに添付されたすべてのファイルと画像を確認しています。もう少しお待ちください。</span
    >
  </p>
  <p class="rx-loading" role="status" data-variant="wave" data-layout="region">
    <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
    ><span class="label"
      >資料一覧を準備しています。表示できるまで、この領域でお待ちください。</span
    >
  </p>
  <div class="rx-cluster">
    <button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
      data-busy="true"
      disabled=""
      aria-busy="true"
    >
      保存しています…</button
    ><span>操作の待ち時間は、その操作のそばに表示します。</span>
  </div>
  <label class="rx-progress"
    ><span class="heading"><span>添付ファイルの処理量を確認しています</span></span
    ><span class="track" data-state="indeterminate" aria-hidden="true"
      ><span class="fill"></span></span
    ><progress class="rx-visually-hidden" max="100">処理中</progress></label
  >
  <div class="rx-disclosure-group" role="group" aria-label="動きと置き場所の違い">
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
          ><span class="title"
            >三つの動き（順に跳ねる三つの点・回る丸・広がる輪）</span
          ></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small">
          <p class="rx-loading" role="status" data-variant="wave" data-layout="inline">
            <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
            ><span class="label"
              >順に跳ねる三つの点（既定）：返信を読み込んでいます…</span
            >
          </p>
          <p class="rx-loading" role="status" data-variant="orbit" data-layout="inline">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label">回る丸：次のページを読み込んでいます…</span>
          </p>
          <p class="rx-loading" role="status" data-variant="halo" data-layout="inline">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label">広がる輪：確認しています…</span>
          </p>
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
        ><span class="label"><span class="title">この領域で待つ</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small">
          <p class="rx-loading" role="status" data-variant="wave" data-layout="region">
            <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
            ><span class="label">コメントを読み込んでいます…</span>
          </p>
          <p class="rx-loading" role="status" data-variant="orbit" data-layout="region">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label">記事の一覧を読み込んでいます…</span>
          </p>
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small" style="max-inline-size: 14rem">
          <p class="rx-loading" role="status" data-variant="wave" data-layout="inline">
            <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
            ><span class="label">秋の読書会の資料と参加者名簿を読み込んでいます…</span>
          </p>
          <p class="rx-loading" role="status" data-variant="halo" data-layout="region">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label"
              >https://example.com/articles/autumn-reading-club-2026
              を確認しています…</span
            >
          </p>
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
        <div class="rx-stack" data-space="small" dir="rtl" lang="ar">
          <p class="rx-loading" role="status" data-variant="orbit" data-layout="inline">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label">جارٍ تحميل الصفحة التالية…</span>
          </p>
          <p class="rx-loading" role="status" data-variant="wave" data-layout="inline">
            <span class="indicator" aria-hidden="true"><i></i><i></i><i></i></span
            ><span class="label">جارٍ كتابة الرد…</span>
          </p>
          <p class="rx-loading" role="status" data-variant="halo" data-layout="region">
            <span class="indicator" aria-hidden="true"></span
            ><span class="label">جارٍ التحقق…</span>
          </p>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
