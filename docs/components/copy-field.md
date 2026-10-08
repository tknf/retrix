<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# CopyField

コピーして使う値を表示する欄と、コピーボタンです。

## 使いどころ

- 公開リンクや招待リンク、APIキーのように、ほかの場所へコピーして使う値を見せる時に使います。
- 書き換える値は `Field` と `Input`、長いコードの断片をコピーする時は `CodeBlock` を使います。

## 使い方

`value` を読み取り専用の一行の入力欄（高さ24px）に出し、欄の末尾にアイコンだけの控えめなボタン（高さ22px）を上下の中央をそろえて置きます。コピーできるとアイコンが緑のチェックに変わり、1.8秒ほどで元のアイコンに戻ります。長い値は欄の中で省略します。

`actions` には、リンクを作り直すなどの操作をコピーボタンの後に並べます。作り直した値の取得と保存は利用側が行い、新しい `value` で再描画します。

欄に `name` は無く、フォームで送信しません。

コピーの処理は `ClipboardController`、コピーした時のアイコンと読み上げは `CopyFieldController` が持つので、`clipboard` と `copy-field` の両方を登録します。コピーボタンはcontrollerが接続してから表示し、クリップボードへ書き込めないブラウザでは隠したままにします。コピーできなかった時はアイコンを変えず、欄の下にアイコンと赤の12pxの文で `failedLabel`（既定は「コピーできませんでした。欄の値を選んでコピーしてください。」）を出し、次にコピーの操作をするまで残します。

欄にフォーカスすると値を全て選ぶので、キーボードではそのままブラウザのコピー機能でもコピーできます。

JavaScriptが無い時は、コピーボタンを表示しません。欄の値を選んで、ブラウザのコピー機能でコピーします。

## アクセシビリティ

- コピーボタンはアイコンだけのボタンで、`copyLabel` を読み上げ名とツールチップにします。
- コピーできた時は `copiedLabel`、コピーできなかった時は `failedLabel` を、見えない `role="status"` の領域で読み上げます。コピーできなかった通知は色だけでなく、アイコンと文でも示します。

## イベント

| イベント               | 内容                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clipboard:beforecopy` | コピーする前に発火します。取り消せます。detailは `text`（コピーする値）・`source`・`reason`（`pointer` か `keyboard`）です。                      |
| `clipboard:copy`       | コピーを終えた後に発火します。detailは `text`・`source`・`reason`・`ok`（コピーできたか）・`error`（コピーできなかった時の `DOMException`）です。 |

## API

### CopyField

公開リンクや招待リンクのような、コピーして使う値の欄。コピーは欄の末尾のアイコンだけのコピーボタンで行い、コピーするとチェックに変わり、しばらくして元に戻る。コピーできなかった時は欄の下に`failedLabel`を出す。コピーの処理はClipboardController、結果の表示はCopyFieldControllerが持ち、コピーボタンは接続してから出す。

| 名前            | 型       | 既定値                                                         | 説明                                                                                       |
| --------------- | -------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `id`（必須）    | `string` |                                                                | 欄のid。ラベルと補足の関連付けに使う。                                                     |
| `label`（必須） | `string` |                                                                | 欄のラベル。                                                                               |
| `value`（必須） | `string` |                                                                | コピーする値。読み取り専用の欄に出し、送信はしない。                                       |
| `help`          | `string` |                                                                | 欄の下に出す淡い補足。                                                                     |
| `copyLabel`     | `string` | `"コピー"`                                                     | コピーボタンの読み上げ名とツールチップ。                                                   |
| `copiedLabel`   | `string` | `"コピーしました"`                                             | コピーできた時に読み上げる文言。                                                           |
| `failedLabel`   | `string` | `"コピーできませんでした。欄の値を選んでコピーしてください。"` | コピーできなかった時に欄の下へ出し、読み上げる文言。欄の値を選んでコピーする方法を含める。 |
| `actions`       | `Child`  |                                                                | 欄の末尾に置く操作（リンクを作り直すなど）。                                               |

登録するcontroller：`clipboard`（`ClipboardController`）、`copy-field`（`CopyFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/copy-field.css`

## コード

```tsx
import {
  CopyField,
  Button,
  Icon,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <CopyField
      id="public-link"
      label="公開リンク"
      value="https://example.com/public/boards/6Kq2"
      help="ログインしなくても、このボードだけを見られます。"
    />
    <DisclosureGroup label="操作と長さの違い">
      <Disclosure summary="作り直す操作を添える（招待リンク）" open>
        <CopyField
          id="invite-link"
          label="招待リンク"
          value="https://example.com/join/AJqP-fXVM-mirH"
          help="この招待は10回中0回使われています。"
          actions={
            <Button data-icon-only="true" aria-label="招待リンクを作り直す">
              <Icon name="redo" />
            </Button>
          }
        />
      </Disclosure>
      <Disclosure summary="狭い場所：長い値は欄の中で省略する">
        <div style="max-inline-size: 16rem">
          <CopyField
            id="narrow-link"
            label="共有の住所"
            value="https://example.com/articles/autumn-reading-club-2026/guide"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <CopyField
            id="rtl-link"
            label="رابط الدعوة"
            value="https://example.com/join/AJqP"
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
<div class="rx-stack">
  <div
    class="rx-copy-field"
    data-controller="clipboard copy-field"
    data-copy-field-copied-value="コピーしました"
  >
    <div class="rx-field">
      <div class="heading"><label for="public-link">公開リンク</label></div>
      <div class="row">
        <input
          id="public-link"
          aria-describedby="public-link-help"
          value="https://example.com/public/boards/6Kq2"
          readonly=""
          data-clipboard-target="source"
          data-action="focus-&gt;copy-field#select"
          class="rx-input"
        /><button
          data-icon-only="true"
          aria-label="コピー"
          title="コピー"
          data-clipboard-target="trigger"
          data-copy-field-target="trigger"
          hidden=""
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          <svg
            class="rx-icon copy"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-copy"></use></svg
          ><svg
            class="rx-icon copied"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg>
        </button>
      </div>
      <div class="messages">
        <p class="help" id="public-link-help">
          <span>ログインしなくても、このボードだけを見られます。</span>
        </p>
      </div>
    </div>
    <p class="failure" data-copy-field-target="failure" hidden="">
      <svg
        class="rx-icon"
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
      ><span>コピーできませんでした。欄の値を選んでコピーしてください。</span>
    </p>
    <p class="rx-visually-hidden" role="status" data-copy-field-target="status"></p>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="操作と長さの違い">
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
          ><span class="title">作り直す操作を添える（招待リンク）</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-copy-field"
          data-controller="clipboard copy-field"
          data-copy-field-copied-value="コピーしました"
        >
          <div class="rx-field">
            <div class="heading"><label for="invite-link">招待リンク</label></div>
            <div class="row">
              <input
                id="invite-link"
                aria-describedby="invite-link-help"
                value="https://example.com/join/AJqP-fXVM-mirH"
                readonly=""
                data-clipboard-target="source"
                data-action="focus-&gt;copy-field#select"
                class="rx-input"
              /><button
                data-icon-only="true"
                aria-label="コピー"
                title="コピー"
                data-clipboard-target="trigger"
                data-copy-field-target="trigger"
                hidden=""
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <svg
                  class="rx-icon copy"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-copy"></use></svg
                ><svg
                  class="rx-icon copied"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-check"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="招待リンクを作り直す"
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
                  <use href="/assets/rx-icons.svg#rx-redo"></use>
                </svg>
              </button>
            </div>
            <div class="messages">
              <p class="help" id="invite-link-help">
                <span>この招待は10回中0回使われています。</span>
              </p>
            </div>
          </div>
          <p class="failure" data-copy-field-target="failure" hidden="">
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
            ><span>コピーできませんでした。欄の値を選んでコピーしてください。</span>
          </p>
          <p
            class="rx-visually-hidden"
            role="status"
            data-copy-field-target="status"
          ></p>
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
          ><span class="title">狭い場所：長い値は欄の中で省略する</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 16rem">
          <div
            class="rx-copy-field"
            data-controller="clipboard copy-field"
            data-copy-field-copied-value="コピーしました"
          >
            <div class="rx-field">
              <div class="heading"><label for="narrow-link">共有の住所</label></div>
              <div class="row">
                <input
                  id="narrow-link"
                  value="https://example.com/articles/autumn-reading-club-2026/guide"
                  readonly=""
                  data-clipboard-target="source"
                  data-action="focus-&gt;copy-field#select"
                  class="rx-input"
                /><button
                  data-icon-only="true"
                  aria-label="コピー"
                  title="コピー"
                  data-clipboard-target="trigger"
                  data-copy-field-target="trigger"
                  hidden=""
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <svg
                    class="rx-icon copy"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-copy"></use></svg
                  ><svg
                    class="rx-icon copied"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check"></use>
                  </svg>
                </button>
              </div>
            </div>
            <p class="failure" data-copy-field-target="failure" hidden="">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>コピーできませんでした。欄の値を選んでコピーしてください。</span>
            </p>
            <p
              class="rx-visually-hidden"
              role="status"
              data-copy-field-target="status"
            ></p>
          </div>
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
          <div
            class="rx-copy-field"
            data-controller="clipboard copy-field"
            data-copy-field-copied-value="コピーしました"
          >
            <div class="rx-field">
              <div class="heading"><label for="rtl-link">رابط الدعوة</label></div>
              <div class="row">
                <input
                  id="rtl-link"
                  value="https://example.com/join/AJqP"
                  readonly=""
                  data-clipboard-target="source"
                  data-action="focus-&gt;copy-field#select"
                  class="rx-input"
                /><button
                  data-icon-only="true"
                  aria-label="コピー"
                  title="コピー"
                  data-clipboard-target="trigger"
                  data-copy-field-target="trigger"
                  hidden=""
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <svg
                    class="rx-icon copy"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-copy"></use></svg
                  ><svg
                    class="rx-icon copied"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check"></use>
                  </svg>
                </button>
              </div>
            </div>
            <p class="failure" data-copy-field-target="failure" hidden="">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>コピーできませんでした。欄の値を選んでコピーしてください。</span>
            </p>
            <p
              class="rx-visually-hidden"
              role="status"
              data-copy-field-target="status"
            ></p>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
