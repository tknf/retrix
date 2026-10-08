<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Toast

操作の結果を、閉じるまで読める通知として表示します。

## 使いどころ

- 保存・送信・コピーなど、今した操作の結果を、作業を止めずに短く知らせる時に使います。
- 読み続けてほしい事実や注意は、本文のそばに置く `Notice` を使います。
- 送信で直すところがある時は、入力の近くのエラーと `ErrorSummary` で示します。Toastだけに残しません。
- 確認や判断を求める時は `Dialog` を使います。

## 使い方

Toastはページに置いておき、閉じた状態（`popover="manual"`）で描きます。開くのは、`popovertarget` にToastの `id` を指したボタンか、スクリプトからの `showPopover()` です。開いてもフォーカスは移しません。閉じるボタンも、Toastを指した `popovertarget` のボタンです。`ToastController` を `toast` として登録すると、`duration` と開閉のイベントが働きます。

ToastはBasecamp 2の黄色の案内と同じく、黄色（`--rx-mark`）の平らな面に1pxの濃い黄色（#eac73b）の枠を付け、下の枠だけを3pxにし、角丸4pxで、影は付けません。文は黒で、一行目を太字にします。`tone` で通知の種類を選びます。`info`（既定）と `success` は黄色の面のままで、`success` はアイコンを緑にします。`warning` と `danger` は面をそれぞれの役割の淡い色にし、枠とアイコンを琥珀色・赤にします。アイコンは `success` でチェック、`danger` で丸の中のバツ、他はiです。文と操作は一行に並べ、入らなければ文を先に折り返します。`actions` を渡すと、通知の文の後に操作を置きます。

既定では閉じるボタンを押すまで残します。`duration` にミリ秒を渡すと、開いてからその時間で閉じます。フォーカスがToastの中にある間は数えず、外へ出てから数え直します。失敗の通知は `live="assertive"` にして自動で閉じず、重要なエラーは入力の近くや `ErrorSummary` にも残します。

単独のToastは、画面下部の末尾側（左から右に読む画面では右下）に浮かべます。開閉はその場で切り替え、動きは付けません。

複数のToastは `ToastStack` で囲み、`ToastStackController` を `toast-stack` として登録します。開いた順に、新しいものを手前にして重ねます。奥のToastは上へ少しずつずらして小さくし、上端へ向かって薄れる縁だけを見せます。二つ以上の時、スタックを押すと上へ広がり、外を押すかEscapeで畳みます。キーボードでフォーカスがスタックの中へ入った時も広がります。Toastの中のボタンやリンクを押しても、スタックは開閉しません。`placement` で置き場所を選びます。

Toastを指した `popovertarget` のボタン（閉じるボタンを含む）を押して開閉した時は、`Dialog` と同じく、取り消せる `toast:beforeshow`・`toast:beforehide` と、`toast:show`・`toast:hide` を発火します。スクリプトからの `showPopover()`・`hidePopover()` と `duration` で開閉した時は発火しません。開き方に関わらず開閉を受け取る時は、標準の `toggle` を使います。

JavaScriptが無い時も、`popovertarget` のボタンと閉じるボタンでToastを開閉できます。`duration`、開閉のイベント、重ねる動きは働きません。

## キーボード

| キー   | 動作                                                        |
| ------ | ----------------------------------------------------------- |
| Tab    | `ToastStack` の中へフォーカスが入ると、スタックを広げます。 |
| Escape | 広げた `ToastStack` を畳みます。Toastそのものは閉じません。 |

## アクセシビリティ

- `live` に合わせて、`polite` は `role="status"`、`assertive` は `role="alert"` と `aria-live` を付けます。
- 開いてもフォーカスを移さないので、作業を続けたまま読み上げで結果を伝えます。
- 閉じるボタンは `closeLabel` を読み上げ名にします。
- 操作を持つToastに `duration` を付ける時は、読んで操作するまでに閉じない長さにします。フォーカスが中にある間は閉じません。
- 通知の色は見分けの補助です。成功か失敗かは文言で伝えます。

## イベント

| イベント           | 内容                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toast:beforeshow` | 取り消せます。`popovertarget` のボタンで開く前に発火し、`preventDefault()` で開きません。`detail` は `{ reason }` で、`reason` は `pointer` か `keyboard` です。 |
| `toast:show`       | `popovertarget` のボタンで開いた後に発火します。`detail` は `toast:beforeshow` と同じです。                                                                      |
| `toast:beforehide` | 取り消せます。閉じるボタンか `popovertarget` のボタンで閉じる前に発火し、`preventDefault()` で閉じません。`detail` は `toast:beforeshow` と同じです。            |
| `toast:hide`       | 閉じるボタンか `popovertarget` のボタンで閉じた後に発火します。`detail` は `toast:beforeshow` と同じです。                                                       |

## API

### Toast

通知の可視性・消去時間・ライブ領域はToastControllerが管理する。閉じるボタンは標準のpopovertargetで閉じるので、JavaScriptが無い時も働く。

| 名前         | 型                         | 既定値     | 説明                                                                                                                                             |
| ------------ | -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`（必須） | `string`                   |            | popoverのid。開く操作のpopovertargetや、showPopover()で開く時に指す。画面の中で一意にする。                                                      |
| `actions`    | `Child`                    |            | 通知の文の後に置く操作（「記事を確認する」「もう一度保存する」など）。                                                                           |
| `closeLabel` | `string`                   | `"閉じる"` | 閉じるボタンの読み上げ名。                                                                                                                       |
| `duration`   | `number`                   | `0`        | 開いてから自動で閉じるまでのミリ秒。0は閉じるボタンを押すまで残す。フォーカスが中にある間は数えず、外へ出てから数え直す。ToastControllerが要る。 |
| `live`       | `"polite" \| "assertive"`  | `"polite"` | 読み上げの緊急度。politeはrole="status"、assertiveはrole="alert"にする。失敗の通知はassertiveにする。                                            |
| `tone`       | `Exclude<Tone, "neutral">` | `"info"`   | 通知の種類。infoとsuccessは黄色の面のままで、successはアイコンを緑にする。warningとdangerは面と枠をその役割の色にする。                          |
| `children`   | `Child`                    |            | 通知の文。アイコンの隣に表示します。                                                                                                             |

登録するcontroller：`toast`（`ToastController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/toast.css`

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

### ToastStack

開いているToastを、新しいものを手前にして重ねる。押すと広げ、外を押すかEscで畳む。重ね方と広げ方はToastStackControllerが扱う。childrenにはToastだけを置く。

| 名前        | 型                             | 既定値  | 説明                                                                 |
| ----------- | ------------------------------ | ------- | -------------------------------------------------------------------- |
| `placement` | `"start" \| "center" \| "end"` | `"end"` | スタックを置く場所。既定は末尾側の下（左から右に読む画面では右下）。 |
| `children`  | `Child`                        |         | 重ねる `Toast`。Toastだけを置きます。                                |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`toast-stack`（`ToastStackController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/toast-stack.css`

## コード

```tsx
import {
  Toast,
  ToastStack,
  Button,
  ActionLink,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <p>
      続けて開くと右下に重なります。重なりを押すと広がり、外側を押すかEscで畳みます。
    </p>
    <div class="rx-cluster">
      <Button popovertarget="hono-toast">結果表示を試す</Button>
      <Button popovertarget="hono-toast-timed">5秒で閉じる通知</Button>
      <Button popovertarget="hono-toast-short">短い通知</Button>
      <Button popovertarget="hono-toast-warning">注意の通知</Button>
      <Button popovertarget="hono-toast-danger">失敗の通知</Button>
    </div>
    <ToastStack>
      <Toast
        id="hono-toast"
        tone="success"
        actions={<ActionLink href="/apps/docs">記事を確認する</ActionLink>}
      >
        「初めて仕事場を利用する方へのご案内」を下書きに保存しました。公開する前に内容を確認できます。
      </Toast>
      <Toast id="hono-toast-timed" duration={5000}>
        変更を保存しました。
      </Toast>
      <Toast id="hono-toast-short" tone="success">
        コピーしました
      </Toast>
      <Toast id="hono-toast-warning" tone="warning">
        通信が不安定です。保存は続けています。
      </Toast>
      <Toast
        id="hono-toast-danger"
        tone="danger"
        live="assertive"
        actions={<Button>もう一度保存する</Button>}
      >
        保存できませんでした。接続を確認してください。
      </Toast>
    </ToastStack>
    <DisclosureGroup label="置き場所と読む向きの違い">
      <Disclosure summary="下の中央・左下に置く">
        <div class="rx-cluster">
          <Button popovertarget="hono-toast-center">下の中央に出す</Button>
          <Button popovertarget="hono-toast-start">左下に出す</Button>
        </div>
        <ToastStack placement="center">
          <Toast id="hono-toast-center">下の中央に出す通知です。</Toast>
        </ToastStack>
        <ToastStack placement="start">
          <Toast id="hono-toast-start">左下に出す通知です。</Toast>
        </ToastStack>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <Button popovertarget="hono-toast-rtl">右から左に読む通知</Button>
        <div dir="rtl" lang="ar">
          <ToastStack>
            <Toast id="hono-toast-rtl" closeLabel="إغلاق">
              تم حفظ التغييرات.
            </Toast>
          </ToastStack>
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
  <p>続けて開くと右下に重なります。重なりを押すと広がり、外側を押すかEscで畳みます。</p>
  <div class="rx-cluster">
    <button
      popovertarget="hono-toast"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      結果表示を試す</button
    ><button
      popovertarget="hono-toast-timed"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      5秒で閉じる通知</button
    ><button
      popovertarget="hono-toast-short"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      短い通知</button
    ><button
      popovertarget="hono-toast-warning"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      注意の通知</button
    ><button
      popovertarget="hono-toast-danger"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      失敗の通知
    </button>
  </div>
  <div class="rx-toast-stack" data-controller="toast-stack" data-placement="end">
    <aside
      id="hono-toast"
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
            ><span
              >「初めて仕事場を利用する方へのご案内」を下書きに保存しました。公開する前に内容を確認できます。</span
            >
          </div>
          <span class="close"
            ><button
              popovertarget="hono-toast"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="閉じる"
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
      <footer class="actions">
        <a
          href="/apps/docs"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >記事を確認する</a
        >
      </footer>
    </aside>
    <aside
      id="hono-toast-timed"
      class="rx-toast rx-overlay"
      popover="manual"
      role="status"
      aria-live="polite"
      data-controller="toast"
      data-toast-duration-value="5000"
      data-toast-live-value="polite"
      data-state="hidden"
      data-tone="info"
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
              <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg
            ><span>変更を保存しました。</span>
          </div>
          <span class="close"
            ><button
              popovertarget="hono-toast-timed"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="閉じる"
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
      id="hono-toast-short"
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
            ><span>コピーしました</span>
          </div>
          <span class="close"
            ><button
              popovertarget="hono-toast-short"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="閉じる"
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
      id="hono-toast-warning"
      class="rx-toast rx-overlay"
      popover="manual"
      role="status"
      aria-live="polite"
      data-controller="toast"
      data-toast-duration-value="0"
      data-toast-live-value="polite"
      data-state="hidden"
      data-tone="warning"
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
              <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg
            ><span>通信が不安定です。保存は続けています。</span>
          </div>
          <span class="close"
            ><button
              popovertarget="hono-toast-warning"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="閉じる"
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
      id="hono-toast-danger"
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
            ><span>保存できませんでした。接続を確認してください。</span>
          </div>
          <span class="close"
            ><button
              popovertarget="hono-toast-danger"
              popovertargetaction="hide"
              data-icon-only="true"
              aria-label="閉じる"
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
      <footer class="actions">
        <button
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          もう一度保存する
        </button>
      </footer>
    </aside>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="置き場所と読む向きの違い">
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
        ><span class="label"><span class="title">下の中央・左下に置く</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <button
            popovertarget="hono-toast-center"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            下の中央に出す</button
          ><button
            popovertarget="hono-toast-start"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            左下に出す
          </button>
        </div>
        <div
          class="rx-toast-stack"
          data-controller="toast-stack"
          data-placement="center"
        >
          <aside
            id="hono-toast-center"
            class="rx-toast rx-overlay"
            popover="manual"
            role="status"
            aria-live="polite"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="polite"
            data-state="hidden"
            data-tone="info"
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
                    <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg
                  ><span>下の中央に出す通知です。</span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="hono-toast-center"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="閉じる"
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
        </div>
        <div
          class="rx-toast-stack"
          data-controller="toast-stack"
          data-placement="start"
        >
          <aside
            id="hono-toast-start"
            class="rx-toast rx-overlay"
            popover="manual"
            role="status"
            aria-live="polite"
            data-controller="toast"
            data-toast-duration-value="0"
            data-toast-live-value="polite"
            data-state="hidden"
            data-tone="info"
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
                    <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg
                  ><span>左下に出す通知です。</span>
                </div>
                <span class="close"
                  ><button
                    popovertarget="hono-toast-start"
                    popovertargetaction="hide"
                    data-icon-only="true"
                    aria-label="閉じる"
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
        <button
          popovertarget="hono-toast-rtl"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          右から左に読む通知
        </button>
        <div dir="rtl" lang="ar">
          <div
            class="rx-toast-stack"
            data-controller="toast-stack"
            data-placement="end"
          >
            <aside
              id="hono-toast-rtl"
              class="rx-toast rx-overlay"
              popover="manual"
              role="status"
              aria-live="polite"
              data-controller="toast"
              data-toast-duration-value="0"
              data-toast-live-value="polite"
              data-state="hidden"
              data-tone="info"
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
                      <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg
                    ><span>تم حفظ التغييرات.</span>
                  </div>
                  <span class="close"
                    ><button
                      popovertarget="hono-toast-rtl"
                      popovertargetaction="hide"
                      data-icon-only="true"
                      aria-label="إغلاق"
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
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
