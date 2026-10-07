<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# CodeBlock

設定や短いコードを、改行を保って表示します。

## 使いどころ

- 設定・コマンド・短いコードを、改行と字下げを保って読ませる時に使います。
- 一行の値をコピーさせる欄は `CopyField`、キー操作の表記は `Keycap` を使います。

## 使い方

`code` と `label` を渡します。名前とコピーの操作は `LayerCard` の層の見出しの行に、コードは層の上のカードの中の、淡い灰色（`#f9f9f9`）の面に等幅の11pxの文字で書きます。

`tokens` に色分けした区切りを渡すと着色します。改行も含めて、全ての `content` をつないだ文字列を `code` と一致させます。一致しない時は着色せずに元の `code` を書きます。ライブラリは整形器やハイライターを持たないので、`tokens` は利用側で作ります（見本はサーバー側でShikiの `codeToTokens` を使います）。`tokens` もHTMLも、文字としてエスケープして書きます。

`lineNumbers` で行の頭に番号を振り、`highlight` に1から数えた行の番号を渡すと、その行を黄色のハイライト（`#ffffcc`）で強調します。行番号はコピーする内容に含めません。

長い行は横に、高さが28remを超えるコードは縦に、コード領域の中でスクロールします。右から左に読むページでも、コードは左から右に書きます。

`copy` を付ける時は、`ClipboardController` を `clipboard`、`CodeBlockController` を `code-block`、`ToastController` を `toast` として登録します。コピーの操作はクリップボードに書き込める環境でだけ表示し、表示した全文をコピーして結果をToastで通知します。成功の通知は成功の色で出し、4秒で閉じ、ホバー中やフォーカスがある間は閉じません。失敗の通知は危険の色で出し、コードを選んでコピーするよう促して閉じるまで残します。

JavaScriptがない時はコピーの操作を出さず、コードは読めます。

## キーボード

| キー | 動作                                                                                           |
| ---- | ---------------------------------------------------------------------------------------------- |
| Tab  | コード領域とコピーの操作へ移ります。フォーカスのあるコード領域は矢印キーでスクロールできます。 |
| Esc  | コピーの結果の通知が開いている時、フォーカスがCodeBlockの中にあれば通知を閉じます。            |

## アクセシビリティ

- コード領域は `pre` に `role="region"`・`tabindex="0"` を付け、`label` を名前にします。
- コピーの操作は「`label`をコピー」を名前に持ちます。成功は `role="status"` の通知で控えめに、失敗は `role="alert"` の通知ですぐに読み上げます。
- 通知を閉じた時、フォーカスが通知の中にあればコピーの操作へ戻します。
- 行番号はCSSで描き、選択とコピーに含めません。

## イベント

| イベント               | 内容                                                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clipboard:beforecopy` | コピーの操作を押した時、書き込む前に発火します。取り消せます。detailは `text`（コピーする全文）・`source`・`reason`（`pointer`・`keyboard`）です。 |
| `clipboard:copy`       | 書き込みを試みた後に発火します。detailは `text`・`source`・`reason`・`ok`（書き込めたか）・`error`（失敗した時の `DOMException`）です。            |

## API

### CodeBlock

トークンも通常の文字としてエスケープし、表示とコピーの内容を一致させる。

| 名前            | 型                     | 既定値  | 説明                                                                                                                                                                                                                                               |
| --------------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`（必須）  | `string`               |         | 表示してコピーするコードの全文。改行と字下げをそのまま保ち、HTMLも文字として書く。                                                                                                                                                                 |
| `label`（必須） | `string`               |         | コードの名前（ファイル名や用途）。見出しの行と、コード領域のaria-labelにする。                                                                                                                                                                     |
| `tokens`        | `readonly CodeToken[]` |         | 着色した区切りの並び。全てのcontentをつないだ文字列がcodeと一致する時だけ使い、一致しなければ着色せずにcodeを書く。ハイライトは利用側で行う（Shikiの結果などを渡す）。                                                                             |
| `copy`          | `boolean`              | `false` | 見出しの行にコピーの操作を置く。クリップボードに書き込める環境でだけ表示し、結果をToastで知らせる。成功はrole="status"の成功の色、失敗はrole="alert"の危険の色で知らせる。 ClipboardController・CodeBlockController・ToastControllerの登録が要る。 |
| `lineNumbers`   | `boolean`              | `false` | 行の先頭に番号を振る。番号はコピーする内容に含めない。                                                                                                                                                                                             |
| `highlight`     | `readonly number[]`    |         | 黄色のハイライトで目印にする行（1から数える）。                                                                                                                                                                                                    |

ほかに、`<figure>`へ標準のHTML属性を渡せます。

登録するcontroller：`clipboard`（`ClipboardController`）、`code-block`（`CodeBlockController`）、`toast`（`ToastController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/section.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/layer-card.css`、`components/toast.css`、`components/code-block.css`

#### `CodeToken`

着色の一区切り。

| 名前              | 型       | 既定値 | 説明                                                                                        |
| ----------------- | -------- | ------ | ------------------------------------------------------------------------------------------- |
| `content`（必須） | `string` |        | 区切りの文字列。改行を含めてよい。全てのcontentをつなぐとcodeと同じになるようにする。       |
| `color`           | `string` |        | 文字の色（CSSの色の値）。渡さなければ地の文字の色で書く。空白だけの区切りには色を付けない。 |

## コード

```tsx
import { CodeBlock, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
import { codeToTokens } from "shiki";

type Language = "html" | "json" | "ts" | "css" | "shell";

const highlight = async (code: string, lang: Language) => {
  const { tokens } = await codeToTokens(code, { lang, theme: "github-light" });
  return tokens.flatMap((line, index) => [
    ...(index ? [{ content: "\n" }] : []),
    ...line,
  ]);
};

export default async () => {
  const markup = '<link rel="stylesheet" href="/retrix/components/button.css">';
  const settings =
    '{\n  "title": "秋の読書会",\n  "published": false,\n  "path": "/articles/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789"\n}';
  const controller = [
    'import { Application } from "@hotwired/stimulus";',
    'import { BoardController } from "@tknf/retrix/controllers";',
    "",
    "const application = Application.start();",
    'application.register("board", BoardController);',
    "",
    "// 列を移ったら、サーバーへ新しい並びを送る。",
    'document.addEventListener("board:move", async (event) => {',
    "  const { id, toColumn, toIndex } = event.detail;",
    '  await fetch(`/cards/${id}`, { method: "PATCH", body: JSON.stringify({ toColumn, toIndex }) });',
    "});",
  ].join("\n");
  const styles = Array.from(
    { length: 30 },
    (_, index) =>
      `.note-${index + 1} {\n  margin-block-start: var(--rx-space-${(index % 6) + 1});\n}`,
  ).join("\n");
  const command = "vp add retrix\nvp run build";
  const [htmlTokens, jsonTokens, tsTokens, cssTokens, shellTokens] = await Promise.all([
    highlight(markup, "html"),
    highlight(settings, "json"),
    highlight(controller, "ts"),
    highlight(styles, "css"),
    highlight(command, "shell"),
  ]);
  return (
    <div class="rx-stack">
      <CodeBlock label="CSSの読み込み" code={markup} tokens={htmlTokens} copy />
      <CodeBlock
        label="公開設定の例"
        code={settings}
        tokens={jsonTokens}
        copy
        lineNumbers
        highlight={[4]}
      />
      <DisclosureGroup label="中身と置き場所の違い">
        <Disclosure summary="コマンド：短い数行" open>
          <CodeBlock label="インストール" code={command} tokens={shellTokens} copy />
        </Disclosure>
        <Disclosure summary="行番号と強調した行">
          <CodeBlock
            label="controllers.ts"
            code={controller}
            tokens={tsTokens}
            copy
            lineNumbers
            highlight={[8, 9, 10]}
          />
        </Disclosure>
        <Disclosure summary="長いコード：高さを決めて縦にスクロールする">
          <CodeBlock label="notes.css" code={styles} tokens={cssTokens} lineNumbers />
        </Disclosure>
        <Disclosure summary="着色しないコード：そのまま文字として表示する">
          <CodeBlock
            label="コードはそのまま文字として表示します"
            code={'<script>alert("実行されません")</script>'}
          />
        </Disclosure>
        <Disclosure summary="狭い場所">
          <div style="max-inline-size: 20rem">
            <CodeBlock
              label="CSSの読み込み"
              code={markup}
              tokens={htmlTokens}
              copy
              lineNumbers
            />
          </div>
        </Disclosure>
        <Disclosure summary="右から左に読むページ">
          <CodeBlock
            dir="rtl"
            lang="ar"
            label="الإعدادات"
            code={settings}
            tokens={jsonTokens}
            lineNumbers
          />
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
};
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <figure class="rx-code-block" data-controller="clipboard code-block">
    <section class="rx-layer-card">
      <header class="heading">
        <h3 class="title">CSSの読み込み</h3>
        <div class="actions">
          <button
            aria-label="CSSの読み込みをコピー"
            data-clipboard-target="trigger"
            data-code-block-target="copy"
            hidden=""
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="compact"
          >
            コピー
          </button>
        </div>
      </header>
      <div class="body">
        <pre
          tabindex="0"
          role="region"
          aria-label="CSSの読み込み"
        ><code data-clipboard-target="source"><span class="line"><span style="color:#24292E">&lt;</span><span style="color:#22863A">link</span> <span style="color:#6F42C1">rel</span><span style="color:#24292E">=</span><span style="color:#032F62">&quot;stylesheet&quot;</span> <span style="color:#6F42C1">href</span><span style="color:#24292E">=</span><span style="color:#032F62">&quot;/retrix/components/button.css&quot;</span><span style="color:#24292E">&gt;</span></span></code></pre>
      </div>
    </section>
    <aside
      id="code-copy-:r2d:-done"
      class="rx-toast rx-overlay"
      popover="manual"
      role="status"
      aria-live="polite"
      data-controller="toast"
      data-toast-duration-value="0"
      data-toast-live-value="polite"
      data-state="hidden"
      data-tone="success"
    >
      <header class="heading">
        <div class="heading-row">
          <div class="message">
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg
            ><span><span data-code-block-target="status"></span></span>
          </div>
          <span class="close"
            ><button
              popovertarget="code-copy-:r2d:-done"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="コピー結果の通知を閉じる"
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
      <div class="body"></div>
    </aside>
    <aside
      id="code-copy-:r2d:-failed"
      class="rx-toast rx-overlay"
      popover="manual"
      role="alert"
      aria-live="assertive"
      data-controller="toast"
      data-toast-duration-value="0"
      data-toast-live-value="assertive"
      data-state="hidden"
      data-tone="danger"
    >
      <header class="heading">
        <div class="heading-row">
          <div class="message">
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg
            ><span><span data-code-block-target="status"></span></span>
          </div>
          <span class="close"
            ><button
              popovertarget="code-copy-:r2d:-failed"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="コピー結果の通知を閉じる"
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
      <div class="body"></div>
    </aside>
  </figure>
  <figure
    class="rx-code-block"
    data-line-numbers="true"
    data-controller="clipboard code-block"
  >
    <section class="rx-layer-card">
      <header class="heading">
        <h3 class="title">公開設定の例</h3>
        <div class="actions">
          <button
            aria-label="公開設定の例をコピー"
            data-clipboard-target="trigger"
            data-code-block-target="copy"
            hidden=""
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="compact"
          >
            コピー
          </button>
        </div>
      </header>
      <div class="body">
        <pre
          tabindex="0"
          role="region"
          aria-label="公開設定の例"
        ><code data-clipboard-target="source"><span class="line"><span style="color:#24292E">{</span>
</span><span class="line">  <span style="color:#005CC5">&quot;title&quot;</span><span style="color:#24292E">: </span><span style="color:#032F62">&quot;秋の読書会&quot;</span><span style="color:#24292E">,</span>
</span><span class="line">  <span style="color:#005CC5">&quot;published&quot;</span><span style="color:#24292E">: </span><span style="color:#005CC5">false</span><span style="color:#24292E">,</span>
</span><span class="line" data-highlighted="true">  <span style="color:#005CC5">&quot;path&quot;</span><span style="color:#24292E">: </span><span style="color:#032F62">&quot;/articles/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789&quot;</span>
</span><span class="line"><span style="color:#24292E">}</span></span></code></pre>
      </div>
    </section>
    <aside
      id="code-copy-:r2e:-done"
      class="rx-toast rx-overlay"
      popover="manual"
      role="status"
      aria-live="polite"
      data-controller="toast"
      data-toast-duration-value="0"
      data-toast-live-value="polite"
      data-state="hidden"
      data-tone="success"
    >
      <header class="heading">
        <div class="heading-row">
          <div class="message">
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg
            ><span><span data-code-block-target="status"></span></span>
          </div>
          <span class="close"
            ><button
              popovertarget="code-copy-:r2e:-done"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="コピー結果の通知を閉じる"
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
      <div class="body"></div>
    </aside>
    <aside
      id="code-copy-:r2e:-failed"
      class="rx-toast rx-overlay"
      popover="manual"
      role="alert"
      aria-live="assertive"
      data-controller="toast"
      data-toast-duration-value="0"
      data-toast-live-value="assertive"
      data-state="hidden"
      data-tone="danger"
    >
      <header class="heading">
        <div class="heading-row">
          <div class="message">
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg
            ><span><span data-code-block-target="status"></span></span>
          </div>
          <span class="close"
            ><button
              popovertarget="code-copy-:r2e:-failed"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="コピー結果の通知を閉じる"
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
      <div class="body"></div>
    </aside>
  </figure>
  <div class="rx-disclosure-group" role="group" aria-label="中身と置き場所の違い">
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
        ><span class="label"><span class="title">コマンド：短い数行</span></span>
      </summary>
      <div class="body">
        <figure class="rx-code-block" data-controller="clipboard code-block">
          <section class="rx-layer-card">
            <header class="heading">
              <h3 class="title">インストール</h3>
              <div class="actions">
                <button
                  aria-label="インストールをコピー"
                  data-clipboard-target="trigger"
                  data-code-block-target="copy"
                  hidden=""
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  コピー
                </button>
              </div>
            </header>
            <div class="body">
              <pre
                tabindex="0"
                role="region"
                aria-label="インストール"
              ><code data-clipboard-target="source"><span class="line"><span style="color:#6F42C1">vp</span> <span style="color:#032F62">add</span> <span style="color:#032F62">retrix</span>
</span><span class="line"><span style="color:#6F42C1">vp</span> <span style="color:#032F62">run</span> <span style="color:#032F62">build</span></span></code></pre>
            </div>
          </section>
          <aside
            id="code-copy-:r2f:-done"
            class="rx-toast rx-overlay"
            popover="manual"
            role="status"
            aria-live="polite"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="polite"
            data-state="hidden"
            data-tone="success"
          >
            <header class="heading">
              <div class="heading-row">
                <div class="message">
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg
                  ><span><span data-code-block-target="status"></span></span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="code-copy-:r2f:-done"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="コピー結果の通知を閉じる"
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
            <div class="body"></div>
          </aside>
          <aside
            id="code-copy-:r2f:-failed"
            class="rx-toast rx-overlay"
            popover="manual"
            role="alert"
            aria-live="assertive"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="assertive"
            data-state="hidden"
            data-tone="danger"
          >
            <header class="heading">
              <div class="heading-row">
                <div class="message">
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg
                  ><span><span data-code-block-target="status"></span></span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="code-copy-:r2f:-failed"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="コピー結果の通知を閉じる"
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
            <div class="body"></div>
          </aside>
        </figure>
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
        ><span class="label"><span class="title">行番号と強調した行</span></span>
      </summary>
      <div class="body">
        <figure
          class="rx-code-block"
          data-line-numbers="true"
          data-controller="clipboard code-block"
        >
          <section class="rx-layer-card">
            <header class="heading">
              <h3 class="title">controllers.ts</h3>
              <div class="actions">
                <button
                  aria-label="controllers.tsをコピー"
                  data-clipboard-target="trigger"
                  data-code-block-target="copy"
                  hidden=""
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  コピー
                </button>
              </div>
            </header>
            <div class="body">
              <pre
                tabindex="0"
                role="region"
                aria-label="controllers.ts"
              ><code data-clipboard-target="source"><span class="line"><span style="color:#D73A49">import</span><span style="color:#24292E"> { Application } </span><span style="color:#D73A49">from</span> <span style="color:#032F62">&quot;@hotwired/stimulus&quot;</span><span style="color:#24292E">;</span>
</span><span class="line"><span style="color:#D73A49">import</span><span style="color:#24292E"> { BoardController } </span><span style="color:#D73A49">from</span> <span style="color:#032F62">&quot;@tknf/retrix/controllers&quot;</span><span style="color:#24292E">;</span>
</span><span class="line">
</span><span class="line"><span style="color:#D73A49">const</span> <span style="color:#005CC5">application</span> <span style="color:#D73A49">=</span><span style="color:#24292E"> Application.</span><span style="color:#6F42C1">start</span><span style="color:#24292E">();</span>
</span><span class="line"><span style="color:#24292E">application.</span><span style="color:#6F42C1">register</span><span style="color:#24292E">(</span><span style="color:#032F62">&quot;board&quot;</span><span style="color:#24292E">, BoardController);</span>
</span><span class="line">
</span><span class="line"><span style="color:#6A737D">// 列を移ったら、サーバーへ新しい並びを送る。</span>
</span><span class="line" data-highlighted="true"><span style="color:#24292E">document.</span><span style="color:#6F42C1">addEventListener</span><span style="color:#24292E">(</span><span style="color:#032F62">&quot;board:move&quot;</span><span style="color:#24292E">, </span><span style="color:#D73A49">async</span><span style="color:#24292E"> (</span><span style="color:#E36209">event</span><span style="color:#24292E">) </span><span style="color:#D73A49">=&gt;</span><span style="color:#24292E"> {</span>
</span><span class="line" data-highlighted="true">  <span style="color:#D73A49">const</span><span style="color:#24292E"> { </span><span style="color:#005CC5">id</span><span style="color:#24292E">, </span><span style="color:#005CC5">toColumn</span><span style="color:#24292E">, </span><span style="color:#005CC5">toIndex</span><span style="color:#24292E"> } </span><span style="color:#D73A49">=</span><span style="color:#24292E"> event.detail;</span>
</span><span class="line" data-highlighted="true">  <span style="color:#D73A49">await</span> <span style="color:#6F42C1">fetch</span><span style="color:#24292E">(</span><span style="color:#032F62">`/cards/${</span><span style="color:#24292E">id</span><span style="color:#032F62">}`</span><span style="color:#24292E">, { method: </span><span style="color:#032F62">&quot;PATCH&quot;</span><span style="color:#24292E">, body: </span><span style="color:#005CC5">JSON</span><span style="color:#24292E">.</span><span style="color:#6F42C1">stringify</span><span style="color:#24292E">({ toColumn, toIndex }) });</span>
</span><span class="line"><span style="color:#24292E">});</span></span></code></pre>
            </div>
          </section>
          <aside
            id="code-copy-:r2g:-done"
            class="rx-toast rx-overlay"
            popover="manual"
            role="status"
            aria-live="polite"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="polite"
            data-state="hidden"
            data-tone="success"
          >
            <header class="heading">
              <div class="heading-row">
                <div class="message">
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg
                  ><span><span data-code-block-target="status"></span></span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="code-copy-:r2g:-done"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="コピー結果の通知を閉じる"
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
            <div class="body"></div>
          </aside>
          <aside
            id="code-copy-:r2g:-failed"
            class="rx-toast rx-overlay"
            popover="manual"
            role="alert"
            aria-live="assertive"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="assertive"
            data-state="hidden"
            data-tone="danger"
          >
            <header class="heading">
              <div class="heading-row">
                <div class="message">
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg
                  ><span><span data-code-block-target="status"></span></span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="code-copy-:r2g:-failed"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="コピー結果の通知を閉じる"
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
            <div class="body"></div>
          </aside>
        </figure>
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
          ><span class="title">長いコード：高さを決めて縦にスクロールする</span></span
        >
      </summary>
      <div class="body">
        <figure class="rx-code-block" data-line-numbers="true">
          <section class="rx-layer-card">
            <header class="heading"><h3 class="title">notes.css</h3></header>
            <div class="body">
              <pre
                tabindex="0"
                role="region"
                aria-label="notes.css"
              ><code><span class="line"><span style="color:#6F42C1">.note-1</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-1</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-2</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-2</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-3</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-3</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-4</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-4</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-5</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-5</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-6</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-6</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-7</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-1</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-8</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-2</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-9</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-3</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-10</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-4</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-11</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-5</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-12</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-6</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-13</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-1</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-14</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-2</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-15</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-3</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-16</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-4</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-17</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-5</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-18</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-6</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-19</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-1</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-20</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-2</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-21</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-3</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-22</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-4</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-23</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-5</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-24</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-6</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-25</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-1</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-26</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-2</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-27</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-3</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-28</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-4</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-29</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-5</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span>
</span><span class="line"><span style="color:#6F42C1">.note-30</span><span style="color:#24292E"> {</span>
</span><span class="line">  <span style="color:#005CC5">margin-block-start</span><span style="color:#24292E">: </span><span style="color:#005CC5">var</span><span style="color:#24292E">(</span><span style="color:#E36209">--rx-space-6</span><span style="color:#24292E">);</span>
</span><span class="line"><span style="color:#24292E">}</span></span></code></pre>
            </div>
          </section>
        </figure>
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
          ><span class="title">着色しないコード：そのまま文字として表示する</span></span
        >
      </summary>
      <div class="body">
        <figure class="rx-code-block">
          <section class="rx-layer-card">
            <header class="heading">
              <h3 class="title">コードはそのまま文字として表示します</h3>
            </header>
            <div class="body">
              <pre
                tabindex="0"
                role="region"
                aria-label="コードはそのまま文字として表示します"
              ><code><span class="line">&lt;script&gt;alert(&quot;実行されません&quot;)&lt;/script&gt;</span></code></pre>
            </div>
          </section>
        </figure>
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
        ><span class="label"><span class="title">狭い場所</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 20rem">
          <figure
            class="rx-code-block"
            data-line-numbers="true"
            data-controller="clipboard code-block"
          >
            <section class="rx-layer-card">
              <header class="heading">
                <h3 class="title">CSSの読み込み</h3>
                <div class="actions">
                  <button
                    aria-label="CSSの読み込みをコピー"
                    data-clipboard-target="trigger"
                    data-code-block-target="copy"
                    hidden=""
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="compact"
                  >
                    コピー
                  </button>
                </div>
              </header>
              <div class="body">
                <pre
                  tabindex="0"
                  role="region"
                  aria-label="CSSの読み込み"
                ><code data-clipboard-target="source"><span class="line"><span style="color:#24292E">&lt;</span><span style="color:#22863A">link</span> <span style="color:#6F42C1">rel</span><span style="color:#24292E">=</span><span style="color:#032F62">&quot;stylesheet&quot;</span> <span style="color:#6F42C1">href</span><span style="color:#24292E">=</span><span style="color:#032F62">&quot;/retrix/components/button.css&quot;</span><span style="color:#24292E">&gt;</span></span></code></pre>
              </div>
            </section>
            <aside
              id="code-copy-:r2j:-done"
              class="rx-toast rx-overlay"
              popover="manual"
              role="status"
              aria-live="polite"
              data-controller="toast"
              data-toast-duration-value="0"
              data-toast-live-value="polite"
              data-state="hidden"
              data-tone="success"
            >
              <header class="heading">
                <div class="heading-row">
                  <div class="message">
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg
                    ><span><span data-code-block-target="status"></span></span>
                  </div>
                  <span class="close"
                    ><button
                      popovertarget="code-copy-:r2j:-done"
                      popovertargetaction="hide"
                      data-icon-only="true"
                      aria-label="コピー結果の通知を閉じる"
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
              <div class="body"></div>
            </aside>
            <aside
              id="code-copy-:r2j:-failed"
              class="rx-toast rx-overlay"
              popover="manual"
              role="alert"
              aria-live="assertive"
              data-controller="toast"
              data-toast-duration-value="0"
              data-toast-live-value="assertive"
              data-state="hidden"
              data-tone="danger"
            >
              <header class="heading">
                <div class="heading-row">
                  <div class="message">
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-x-circle-fill"></use></svg
                    ><span><span data-code-block-target="status"></span></span>
                  </div>
                  <span class="close"
                    ><button
                      popovertarget="code-copy-:r2j:-failed"
                      popovertargetaction="hide"
                      data-icon-only="true"
                      aria-label="コピー結果の通知を閉じる"
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
              <div class="body"></div>
            </aside>
          </figure>
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
        ><span class="label"><span class="title">右から左に読むページ</span></span>
      </summary>
      <div class="body">
        <figure dir="rtl" lang="ar" class="rx-code-block" data-line-numbers="true">
          <section class="rx-layer-card">
            <header class="heading"><h3 class="title">الإعدادات</h3></header>
            <div class="body">
              <pre
                tabindex="0"
                role="region"
                aria-label="الإعدادات"
              ><code><span class="line"><span style="color:#24292E">{</span>
</span><span class="line">  <span style="color:#005CC5">&quot;title&quot;</span><span style="color:#24292E">: </span><span style="color:#032F62">&quot;秋の読書会&quot;</span><span style="color:#24292E">,</span>
</span><span class="line">  <span style="color:#005CC5">&quot;published&quot;</span><span style="color:#24292E">: </span><span style="color:#005CC5">false</span><span style="color:#24292E">,</span>
</span><span class="line">  <span style="color:#005CC5">&quot;path&quot;</span><span style="color:#24292E">: </span><span style="color:#032F62">&quot;/articles/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789&quot;</span>
</span><span class="line"><span style="color:#24292E">}</span></span></code></pre>
            </div>
          </section>
        </figure>
      </div>
    </details>
  </div>
</div>
```

</details>
