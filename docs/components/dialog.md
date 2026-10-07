<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Dialog

今の画面を離れずに、操作の影響や内容を確認します。

## 使いどころ

- 削除や公開の前の確認、短いフォームの入力のように、答えるまで背後の画面を操作させない時に使います。
- 背後の操作を妨げない補足や小さな操作は `Popover`、リンクや対象の概要を近くに見せる時は `HoverCard` を使います。
- 影響のある操作を設定画面に並べる時は `DangerZone` に置き、確認にこの `Dialog` を渡します。
- 長い手順や、ほかの画面と行き来する作業は、ダイアログに詰めず作業面のページにします。

## 使い方

`DialogController` を `dialog` として登録します。`id` は画面内で一意にします。閉じたネイティブの `dialog` と開く操作を出力し、開く操作を押すとモーダルで開きます。

パネルは輪郭と影を持つ白いパネル（角丸4px）で、見出し・本文・操作欄に分け、長い本文は本文だけをスクロールします。見出しは `Section` と同じ赤茶の通常の太さの18pxの文字で、その下に罫線を一本引いて本文と分けます。操作欄は末尾側に揃えます。見出しの行の末尾に閉じる操作を置き、`closeLabel` はその名前です。`actions` を渡すと、操作欄の先頭に `closeLabel` の文言の閉じる操作を置き、その後ろに `actions` を並べます。

操作欄の操作で閉じるには `data-dialog-target="close"` を付けます。確認の後の保存・削除・通信は利用側が行い、`dialog:close` などのイベントや、操作の `onclick` で受け取ります。

フォームを載せる時は、`form` に `method="dialog"` を付けると、入力が有効な時だけ送信で閉じます。送信で閉じる時も `dialog:beforeclose`・`dialog:close` を発火し、`dialog:beforeclose` を取り消すと開いたままにします。`initialFocus` を `content` にし、最初に入力する欄に `autofocus` を付けます。本文の外の操作欄から送る時は、送信の `Button` に `form` でフォームのidを渡します。

`size` はパネルの幅の上限で、`compact` は26rem、`default` は32rem、`wide` は52remです。画面が狭い時は、画面の幅から余白を引いた幅に収めます。

幅40rem以下のタッチ画面では、下端に付くシートとして下から滑り上げて出し、上端に灰色の短いハンドルを置きます。上端のハンドルと見出しを下へ引くと閉じます（少し動かしただけでは閉じません）。

開いている間は背後を半透明の濃い灰色で覆って暗くし、Escape・閉じる操作・背景を押すと閉じ、フォーカスを開いた操作へ戻します。JavaScriptなしでは開きません。

## キーボード

| キー                      | 動作                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| Enter / Space（開く操作） | ダイアログを開き、見出し（`initialFocus` が `content` なら本文の `autofocus` の欄）へ移ります。 |
| Tab / Shift+Tab           | ダイアログの中の操作だけを巡ります。                                                            |
| Escape                    | ダイアログを閉じ、開いた操作へフォーカスを戻します。                                            |

## アクセシビリティ

- パネルはネイティブのモーダル `dialog` で、見出しを名前（`aria-labelledby`）、`description` を説明（`aria-describedby`）にします。背後の画面は操作できず、読み上げからも外れます。
- 開く操作は `aria-haspopup="dialog"`・`aria-controls`・`aria-expanded` を持ちます。
- 既定では見出しへフォーカスを移し、読み上げが題名から始まるようにします。見出しは `tabindex="-1"` で、Tabの巡回には入りません。
- 見出しの横の閉じる操作はアイコンだけなので、`closeLabel` を `aria-label` にします。

## イベント

| イベント             | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dialog:beforeopen`  | 開く操作を押した直後、開く前。取り消せます。`detail.reason` は `pointer` または `keyboard` です。                                                                                                                                                                                                                                                                                                                                              |
| `dialog:open`        | 開いた後。`detail.reason` は `dialog:beforeopen` と同じです。                                                                                                                                                                                                                                                                                                                                                                                  |
| `dialog:beforeclose` | 閉じる前。取り消せます（`preventDefault()` で開いたままにします）。`detail.reason` は `pointer`（閉じる操作や背景を押した時）・`keyboard`（Escapeや、キーで閉じる操作を押した時）・`swipe`（シートを下へ引いた時）・`submit`（`method="dialog"` のフォームを送信した時）、`detail.returnValue` は閉じた時の値（送信で閉じた時は送信した操作の `value`）です。背景を押した時は、ブラウザが `closedby` に対応しているかによらず `pointer` です。 |
| `dialog:close`       | 閉じた後。`detail` は `reason` と `returnValue` です。                                                                                                                                                                                                                                                                                                                                                                                         |

## API

### Dialog

閉じたnative dialogを出力する。保存や削除の処理は利用側で実装する。

| 名前              | 型                                 | 既定値        | 説明                                                                                                                         |
| ----------------- | ---------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）      | `string`                           |               | `dialog`要素のid。画面内で一意にする。見出しは`<id>-title`、説明は`<id>-description`になる。                                 |
| `title`（必須）   | `string`                           |               | 見出し。ダイアログの名前として読み上げる。                                                                                   |
| `trigger`（必須） | `string`                           |               | 開く操作の文言。                                                                                                             |
| `description`     | `string`                           |               | 見出しの下に置く短い説明。ダイアログの説明（`aria-describedby`）になる。                                                     |
| `triggerVariant`  | `ButtonVariant`                    | `"secondary"` | 開く操作の見た目。削除の確認ならdangerにする。                                                                               |
| `triggerDisabled` | `boolean`                          |               | 開く操作を押せなくする。                                                                                                     |
| `size`            | `"compact" \| "default" \| "wide"` | `"default"`   | パネルの幅。compactは26rem、defaultは32rem、wideは52remを上限にする。                                                        |
| `closeLabel`      | `string`                           | `"閉じる"`    | 見出しの横の閉じる操作の名前。actionsがある時は、操作欄の先頭に置くキャンセル操作の文言にもなる。                            |
| `actions`         | `Child`                            |               | 操作欄に並べる操作。渡すと、閉じる操作（closeLabel）の後ろに置く。押して閉じる操作には`data-dialog-target="close"`を付ける。 |
| `initialFocus`    | `"title" \| "content"`             | `"title"`     | contentでは本文内のautofocus、または最初の操作へ移る。                                                                       |
| `children`        | `Child`                            |               | 本文。長い時は本文だけをスクロールする。                                                                                     |

登録するcontroller：`dialog`（`DialogController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/dialog.css`、`components/icon.css`

#### `ButtonVariant`

操作の見た目の役割。primaryは青の塗り、secondaryは白い面と枠、dangerは赤の塗り、 linkは面も枠も持たない青い文字。形はどれもピルで、違いは塗りの色で出す。

値：`"primary" | "secondary" | "danger" | "link"`

## コード

```tsx
import {
  Dialog,
  Button,
  Disclosure,
  Field,
  Input,
  DropdownMenu,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Dialog
      id="hono-dialog"
      title="内容を確認する"
      trigger="確認画面を開く"
      description="データは変更しません。"
      size="compact"
    >
      <p>
        見出しと本文を確認してから、閉じるボタン・Escape・背景のクリックで戻れます。
      </p>
    </Dialog>
    <Disclosure summary="確認・キャンセル・主要操作">
      <Dialog
        id="dialog-confirm"
        title="下書きを公開しますか？"
        trigger="公開の確認"
        description="この例では実際の公開は行いません。"
        size="compact"
        closeLabel="キャンセル"
        actions={
          <Button variant="primary" data-dialog-target="close">
            公開する
          </Button>
        }
      >
        <p>公開すると、記事が一覧に表示されます。</p>
      </Dialog>
    </Disclosure>
    <Disclosure summary="危険操作・長い操作ラベル">
      <Dialog
        id="dialog-danger"
        title="記事を削除しますか？"
        trigger="削除の確認"
        triggerVariant="danger"
        closeLabel="削除しない"
        size="compact"
        actions={
          <Button variant="danger" data-dialog-target="close">
            記事と添付ファイルを削除する
          </Button>
        }
      >
        <p>この操作を取り消すことはできません。</p>
        <p>この例では確認画面を閉じるだけで、データは削除しません。</p>
      </Dialog>
    </Disclosure>
    <Disclosure summary="フォーム・必須入力・入力欄への初期フォーカス">
      <Dialog
        id="dialog-form"
        title="担当者を登録する"
        trigger="登録フォームを開く"
        description="保存は行わず、入力が有効なら画面を閉じます。"
        initialFocus="content"
        closeLabel="キャンセル"
        actions={
          <Button type="submit" form="dialog-person-form" variant="primary">
            登録する
          </Button>
        }
      >
        <form
          id="dialog-person-form"
          method="dialog"
          class="rx-stack"
          data-space="small"
        >
          <Field id="dialog-person-name" label="名前" help="必須項目です。">
            {(attributes) => (
              <Input
                {...attributes}
                name="name"
                required
                autocomplete="name"
                autofocus
              />
            )}
          </Field>
          <Field id="dialog-person-email" label="メールアドレス">
            {(attributes) => (
              <Input {...attributes} name="email" type="email" autocomplete="email" />
            )}
          </Field>
        </form>
      </Dialog>
    </Disclosure>
    <Disclosure summary="エラー・処理中・無効な操作">
      <div class="rx-stack" data-space="small">
        <Dialog
          id="dialog-error"
          title="保存できませんでした"
          trigger="エラーの例"
          closeLabel="編集に戻る"
          actions={
            <Button variant="primary" data-dialog-target="close">
              もう一度試す
            </Button>
          }
        >
          <p>
            通信を確認してから、もう一度お試しください。入力内容は保持されています。
          </p>
          <p>この例は表示の確認用です。通信処理は行いません。</p>
        </Dialog>
        <Dialog
          id="dialog-busy"
          title="処理中の表示"
          trigger="処理中の例"
          actions={
            <Button variant="primary" busy busyLabel="保存しています…">
              保存する
            </Button>
          }
        >
          <p>
            主要操作の処理中表示を確認できます。この例の状態は自動では変わりません。
          </p>
        </Dialog>
        <Dialog
          id="dialog-disabled"
          title="利用できない操作"
          trigger="権限がない場合"
          triggerDisabled
        >
          <p>この画面は開けません。</p>
        </Dialog>
      </div>
    </Disclosure>
    <Disclosure summary="長文・本文スクロール・広いダイアログ">
      <Dialog
        id="dialog-long"
        title="公開前の確認事項"
        trigger="長文の例を開く"
        size="wide"
      >
        {Array.from({ length: 12 }, (_, index) => (
          <section class="rx-stack" data-space="small">
            <h3>確認事項 {index + 1}</h3>
            <p>
              本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
            </p>
          </section>
        ))}
      </Dialog>
    </Disclosure>
    <Disclosure summary="タイトルと説明のみ・長い見出し">
      <Dialog
        id="dialog-title"
        title="公開前に記事の文章と添付ファイルと公開設定をまとめて確認してください"
        trigger="長い見出しの例"
        description="本文がない場合でも、説明と閉じる操作を表示します。"
        size="compact"
      />
    </Disclosure>
    <Disclosure summary="ダイアログ内のDropdownMenu">
      <Dialog
        id="dialog-menu"
        title="添付ファイルの操作"
        trigger="内側のメニューを確認"
      >
        <p>メニューを閉じても、このダイアログは開いたままです。</p>
        <DropdownMenu
          id="dialog-file-menu"
          label="ファイルの操作"
          items={[
            { label: "確認する", value: "inspect", icon: "eye" },
            {
              kind: "submenu",
              label: "書き出す",
              items: [
                { label: "PDF", value: "pdf" },
                { label: "画像", value: "image" },
              ],
            },
          ]}
        />
      </Dialog>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-dialog" data-controller="dialog" data-state="closed">
    <button
      data-dialog-target="trigger"
      aria-controls="hono-dialog"
      aria-haspopup="dialog"
      aria-expanded="false"
      data-state="closed"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      確認画面を開く
    </button>
    <dialog
      id="hono-dialog"
      class="panel rx-overlay"
      closedby="any"
      data-dialog-target="dialog"
      data-state="closed"
      data-size="compact"
      aria-labelledby="hono-dialog-title"
      aria-describedby="hono-dialog-description"
    >
      <header class="heading">
        <div class="heading-row">
          <h2
            id="hono-dialog-title"
            data-dialog-target="title"
            tabindex="-1"
            autofocus=""
          >
            内容を確認する
          </h2>
          <span class="close"
            ><button
              data-dialog-target="close"
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
        <p id="hono-dialog-description">データは変更しません。</p>
      </header>
      <div class="body">
        <p>
          見出しと本文を確認してから、閉じるボタン・Escape・背景のクリックで戻れます。
        </p>
      </div>
    </dialog>
  </div>
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
      ><span class="label"><span class="title">確認・キャンセル・主要操作</span></span>
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-confirm"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          公開の確認
        </button>
        <dialog
          id="dialog-confirm"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="compact"
          aria-labelledby="dialog-confirm-title"
          aria-describedby="dialog-confirm-description"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="dialog-confirm-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                下書きを公開しますか？
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
                  data-icon-only="true"
                  aria-label="キャンセル"
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
            <p id="dialog-confirm-description">この例では実際の公開は行いません。</p>
          </header>
          <div class="body"><p>公開すると、記事が一覧に表示されます。</p></div>
          <footer class="actions">
            <button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              キャンセル</button
            ><button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="primary"
              data-size="default"
            >
              公開する
            </button>
          </footer>
        </dialog>
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
      ><span class="label"><span class="title">危険操作・長い操作ラベル</span></span>
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-danger"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="default"
        >
          削除の確認
        </button>
        <dialog
          id="dialog-danger"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="compact"
          aria-labelledby="dialog-danger-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="dialog-danger-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                記事を削除しますか？
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
                  data-icon-only="true"
                  aria-label="削除しない"
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
          <div class="body">
            <p>この操作を取り消すことはできません。</p>
            <p>この例では確認画面を閉じるだけで、データは削除しません。</p>
          </div>
          <footer class="actions">
            <button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              削除しない</button
            ><button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="danger"
              data-size="default"
            >
              記事と添付ファイルを削除する
            </button>
          </footer>
        </dialog>
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
        ><span class="title">フォーム・必須入力・入力欄への初期フォーカス</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-form"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          登録フォームを開く
        </button>
        <dialog
          id="dialog-form"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="default"
          aria-labelledby="dialog-form-title"
          aria-describedby="dialog-form-description"
        >
          <header class="heading">
            <div class="heading-row">
              <h2 id="dialog-form-title" data-dialog-target="title" tabindex="-1">
                担当者を登録する
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
                  data-icon-only="true"
                  aria-label="キャンセル"
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
            <p id="dialog-form-description">
              保存は行わず、入力が有効なら画面を閉じます。
            </p>
          </header>
          <div class="body">
            <form
              id="dialog-person-form"
              method="dialog"
              class="rx-stack"
              data-space="small"
            >
              <div class="rx-field">
                <div class="heading"><label for="dialog-person-name">名前</label></div>
                <input
                  id="dialog-person-name"
                  aria-describedby="dialog-person-name-help"
                  name="name"
                  required=""
                  autocomplete="name"
                  autofocus=""
                  class="rx-input"
                />
                <div class="messages">
                  <p class="help" id="dialog-person-name-help">
                    <span>必須項目です。</span>
                  </p>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="dialog-person-email">メールアドレス</label>
                </div>
                <input
                  id="dialog-person-email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  class="rx-input"
                />
              </div>
            </form>
          </div>
          <footer class="actions">
            <button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              キャンセル</button
            ><button
              form="dialog-person-form"
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              登録する
            </button>
          </footer>
        </dialog>
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
      ><span class="label"><span class="title">エラー・処理中・無効な操作</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack" data-space="small">
        <div class="rx-dialog" data-controller="dialog" data-state="closed">
          <button
            data-dialog-target="trigger"
            aria-controls="dialog-error"
            aria-haspopup="dialog"
            aria-expanded="false"
            data-state="closed"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            エラーの例
          </button>
          <dialog
            id="dialog-error"
            class="panel rx-overlay"
            closedby="any"
            data-dialog-target="dialog"
            data-state="closed"
            data-size="default"
            aria-labelledby="dialog-error-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h2
                  id="dialog-error-title"
                  data-dialog-target="title"
                  tabindex="-1"
                  autofocus=""
                >
                  保存できませんでした
                </h2>
                <span class="close"
                  ><button
                    data-dialog-target="close"
                    data-icon-only="true"
                    aria-label="編集に戻る"
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
            <div class="body">
              <p>
                通信を確認してから、もう一度お試しください。入力内容は保持されています。
              </p>
              <p>この例は表示の確認用です。通信処理は行いません。</p>
            </div>
            <footer class="actions">
              <button
                data-dialog-target="close"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                編集に戻る</button
              ><button
                data-dialog-target="close"
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="default"
              >
                もう一度試す
              </button>
            </footer>
          </dialog>
        </div>
        <div class="rx-dialog" data-controller="dialog" data-state="closed">
          <button
            data-dialog-target="trigger"
            aria-controls="dialog-busy"
            aria-haspopup="dialog"
            aria-expanded="false"
            data-state="closed"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            処理中の例
          </button>
          <dialog
            id="dialog-busy"
            class="panel rx-overlay"
            closedby="any"
            data-dialog-target="dialog"
            data-state="closed"
            data-size="default"
            aria-labelledby="dialog-busy-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h2
                  id="dialog-busy-title"
                  data-dialog-target="title"
                  tabindex="-1"
                  autofocus=""
                >
                  処理中の表示
                </h2>
                <span class="close"
                  ><button
                    data-dialog-target="close"
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
            <div class="body">
              <p>
                主要操作の処理中表示を確認できます。この例の状態は自動では変わりません。
              </p>
            </div>
            <footer class="actions">
              <button
                data-dialog-target="close"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                閉じる</button
              ><button
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="default"
                data-busy="true"
                disabled=""
                aria-busy="true"
              >
                保存しています…
              </button>
            </footer>
          </dialog>
        </div>
        <div class="rx-dialog" data-controller="dialog" data-state="closed">
          <button
            data-dialog-target="trigger"
            aria-controls="dialog-disabled"
            aria-haspopup="dialog"
            aria-expanded="false"
            data-state="closed"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            disabled=""
          >
            権限がない場合
          </button>
          <dialog
            id="dialog-disabled"
            class="panel rx-overlay"
            closedby="any"
            data-dialog-target="dialog"
            data-state="closed"
            data-size="default"
            aria-labelledby="dialog-disabled-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h2
                  id="dialog-disabled-title"
                  data-dialog-target="title"
                  tabindex="-1"
                  autofocus=""
                >
                  利用できない操作
                </h2>
                <span class="close"
                  ><button
                    data-dialog-target="close"
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
            <div class="body"><p>この画面は開けません。</p></div>
          </dialog>
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
      ><span class="label"
        ><span class="title">長文・本文スクロール・広いダイアログ</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-long"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          長文の例を開く
        </button>
        <dialog
          id="dialog-long"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="wide"
          aria-labelledby="dialog-long-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="dialog-long-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                公開前の確認事項
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
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
          <div class="body">
            <section class="rx-stack" data-space="small">
              <h3>確認事項 1</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 2</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 3</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 4</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 5</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 6</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 7</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 8</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 9</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 10</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 11</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
            <section class="rx-stack" data-space="small">
              <h3>確認事項 12</h3>
              <p>
                本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
              </p>
            </section>
          </div>
        </dialog>
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
        ><span class="title">タイトルと説明のみ・長い見出し</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-title"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          長い見出しの例
        </button>
        <dialog
          id="dialog-title"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="compact"
          aria-labelledby="dialog-title-title"
          aria-describedby="dialog-title-description"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="dialog-title-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                公開前に記事の文章と添付ファイルと公開設定をまとめて確認してください
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
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
            <p id="dialog-title-description">
              本文がない場合でも、説明と閉じる操作を表示します。
            </p>
          </header>
          <div class="body"></div>
        </dialog>
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
      ><span class="label"><span class="title">ダイアログ内のDropdownMenu</span></span>
    </summary>
    <div class="body">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="dialog-menu"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          内側のメニューを確認
        </button>
        <dialog
          id="dialog-menu"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="default"
          aria-labelledby="dialog-menu-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="dialog-menu-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                添付ファイルの操作
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
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
          <div class="body">
            <p>メニューを閉じても、このダイアログは開いたままです。</p>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="start"
            >
              <button
                id="dialog-file-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="dialog-file-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                ファイルの操作<svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-caret"></use>
                </svg>
              </button>
              <div
                class="shield"
                data-dropdown-menu-target="shield"
                popover="manual"
                tabindex="-1"
                hidden=""
              ></div>
              <menu
                id="dialog-file-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="dialog-file-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="dialog-file-menu-0-item"
                    role="menuitem"
                    aria-label="確認する"
                    data-menu-kind="action"
                    data-menu-label="確認する"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="inspect"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content" data-leading="true"
                      ><span class="heading"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-eye"></use></svg
                        ><span class="text"><span>確認する</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li role="none">
                  <button
                    id="dialog-file-menu-1-item"
                    role="menuitem"
                    aria-label="書き出す"
                    data-menu-kind="submenu"
                    data-menu-label="書き出す"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-controls="dialog-file-menu-1-menu"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>書き出す</span></span
                        ><span class="caret"
                          ><svg
                            class="rx-icon"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <use
                              href="/assets/rx-icons.svg#rx-caret"
                            ></use></svg></span></span
                    ></span>
                  </button>
                  <menu
                    id="dialog-file-menu-1-menu"
                    class="rx-menu"
                    role="menu"
                    popover="manual"
                    data-menu-panel="submenu"
                    aria-labelledby="dialog-file-menu-1-item"
                    tabindex="-1"
                    hidden=""
                  >
                    <li role="none">
                      <button
                        id="dialog-file-menu-1-menu-0-item"
                        role="menuitem"
                        aria-label="PDF"
                        data-menu-kind="action"
                        data-menu-label="PDF"
                        tabindex="-1"
                        data-dropdown-menu-target="item"
                        data-dropdown-menu-value="pdf"
                        class="rx-button item"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        <span class="content"
                          ><span class="heading"
                            ><span class="text"><span>PDF</span></span></span
                          ></span
                        >
                      </button>
                    </li>
                    <li role="none">
                      <button
                        id="dialog-file-menu-1-menu-1-item"
                        role="menuitem"
                        aria-label="画像"
                        data-menu-kind="action"
                        data-menu-label="画像"
                        tabindex="-1"
                        data-dropdown-menu-target="item"
                        data-dropdown-menu-value="image"
                        class="rx-button item"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        <span class="content"
                          ><span class="heading"
                            ><span class="text"><span>画像</span></span></span
                          ></span
                        >
                      </button>
                    </li>
                  </menu>
                </li>
              </menu>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  </details>
</div>
```

</details>
