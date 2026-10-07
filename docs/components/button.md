<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Button

操作の主従、無効、処理中を表します。

## 使いどころ

- その場で何かを実行する操作（保存・送信・開く・削除）に `Button` を使います。
- 別のページへ移る操作は、同じ見た目の `ActionLink` を使います。移動を `Button` の `onclick` で行いません。
- 画面の主操作は一つだけ `primary` にし、ほかは `secondary` にします。取り返しのつかない操作は `danger`、文中や一覧の軽い操作は `link` にします。
- 続けて使う関連の操作を一つのまとまりに見せる時は `ButtonGroup`、主操作にほかのやり方を▾で添える時は `SplitButton` を使います。
- 格子に並べるアイコンと名前のタイルは `ActionTile`、対象への操作を矢印キーで移動できる一つの並びにする時は `Toolbar` を使います。

## 使い方

`Button` は既定で `type="button"` の `button` を出力します。フォームを送る時は `type="submit"`、戻す時は `type="reset"` を渡します。`name`・`value`・`form`・`onclick`・`data-*` などの標準の属性は、そのまま `button` に渡ります。

文字は操作の段（`--rx-label`、13px）です。`default` と `compact` の高さは31pxで、`compact` は左右の余白だけを0.875emから0.625emに狭めます。`large` は文字を14px、高さを34pxにし、フォーム末尾などの大きな操作に使います。タッチ操作の環境では、高さを2.75rem以上にします（`size="tag"` のアイコンだけの操作は除きます）。`tag` はTagの中の解除操作のための大きさです。

形はどれも角の小さな長方形（角丸3px、`--rx-radius-control`）で、`variant` は塗りの色で役割を分けます。`secondary` は白から淡い灰色への縦の塗りに濃い灰色の枠を付け、下の枠を少し濃くします。`primary` は緑、`danger` は赤茶の縦の塗りに白い文字です。`link` は面も枠も持たず、本文のリンクと同じ青緑の文字に下線を引き、ホバーすると赤茶になります。ホバーすると塗りが少し濃くなり、押すと内側へへこみます。`disabled` の操作は斜線の面と灰色の文字にします。

`Icon` は文字の前にも後にも置けます。アイコンだけの操作は `data-icon-only="true"` を付けて正方形にし、`aria-label` で操作名を付けます。`title` はマウス向けの補助で、`aria-label` の代わりにはなりません。

`busy` を渡すと、アイコンを含む内容を `busyLabel` に置き換え、`disabled`・`aria-busy="true"`・`data-busy="true"` を付けます。処理中は斜線にせず、役割の色の濃淡を一方向にゆっくり流し、カーソルを待機中の形にします。動きを減らす設定では流しません。処理の開始と終了、つまり `busy` の切り替えは利用側が行います。

`ActionLink` は `href` を持つ `a` を `Button` と同じ見た目で出力します。`disabled` は持たないので、移動できない時はリンクを出さないか、`disabled` の `Button` に置き換えます。

`ButtonGroup` は隣り合う `Button` の向き合う角を落とし、枠を重ねて一つにつなげます。最後に `iconOnly` の `DropdownMenu` を置くと、主操作と▾の組み合わせになります。`primary` の▾の前には白く透かした区切りを入れます。

`Button` の文字・太さ・行高・上下の余白・縦配置は `button.css` が持ちます。ほかのコンポーネントのCSSや利用側のCSSから、`font` の一括指定・太さ・行高・上下の余白・文字の移動で上書きしないでください。大きさは `size`、余白の違いは `compact` で選びます。

## アクセシビリティ

- `Button` はネイティブの `button`、`ActionLink` は `a` なので、EnterとSpace（リンクはEnter）で押せ、フォーカスした時は青い2pxのアウトラインを出します。
- アイコンだけの操作には必ず `aria-label` を付けます。
- `disabled` と `busy` の操作はフォーカスできなくなります。押せない理由を伝える時は、画面に理由の文を置き、`aria-describedby` で結び付けます。
- `ButtonGroup` は `role="group"` で、`label` をまとまりの名前として読み上げます。
- 強制カラーモードでは塗りと影を外し、`data-current="true"` の操作だけを強調色で示します。

## API

### Button

操作のボタン。文字・太さ・行高・上下の余白・縦配置はbutton.cssが持つ。外から上書きしない。

| 名前        | 型                                           | 既定値        | 説明                                                                                                                                                                                  |
| ----------- | -------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`  | `boolean`                                    | `false`       | 押せなくする。斜線の面と灰色の文字になり、フォーカスできなくなる。                                                                                                                    |
| `type`      | `"submit" \| "reset" \| "button"`            | `"button"`    | `button` の種類。フォームを送る時は `submit`、戻す時は `reset` にする。                                                                                                               |
| `variant`   | `ButtonVariant`                              | `"secondary"` | 見た目の役割。primaryは画面の主操作、secondaryは通常の操作、 dangerは取り返しのつかない操作、linkは文字だけの軽い操作。                                                               |
| `size`      | `"default" \| "compact" \| "large" \| "tag"` | `"default"`   | 大きさ。compactは同じ高さで左右の余白を狭め、largeはフォーム末尾などの大きな操作に使う。 tagはTagの中の解除操作用で、タッチ環境でも小さなタグの高さを保つ。                           |
| `busy`      | `boolean`                                    | `false`       | 処理中にする。役割の色をゆっくり流して示し、押せなくし、aria-busyを付ける。内容はbusyLabelに置き換える。アイコンだけの操作（data-icon-only="true"）は形を保つためアイコンのまま残す。 |
| `busyLabel` | `string`                                     | `"処理中…"`   | 処理中に内容の代わりに出す文言。アイコンも含めて置き換える。アイコンだけの操作では使わない。                                                                                          |
| `children`  | `Child`                                      |               | 操作の文言。`Icon` を文字の前後に置ける。`busy` の時は `busyLabel` に置き換わる。                                                                                                     |

ほかに、`<button>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`

#### `ButtonVariant`

操作の見た目の役割。primaryは青の塗り、secondaryは白い面と枠、dangerは赤の塗り、 linkは面も枠も持たない青い文字。形はどれもピルで、違いは塗りの色で出す。

値：`"primary" | "secondary" | "danger" | "link"`

### ActionLink

Buttonと同じ見た目の移動リンク。

| 名前           | 型                                  | 既定値        | 説明                                                     |
| -------------- | ----------------------------------- | ------------- | -------------------------------------------------------- |
| `href`（必須） | `string`                            |               | 移動先。ページの移動にはButtonではなくこのリンクを使う。 |
| `variant`      | `ButtonVariant`                     | `"secondary"` | 見た目の役割。値の意味はButtonと同じ。                   |
| `size`         | `"default" \| "compact" \| "large"` | `"default"`   | 大きさ。値の意味はButtonと同じ。                         |
| `children`     | `Child`                             |               | リンクの文言。`Icon` を文字の前後に置ける。              |

ほかに、`<a>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`

#### `ButtonVariant`

操作の見た目の役割。primaryは青の塗り、secondaryは白い面と枠、dangerは赤の塗り、 linkは面も枠も持たない青い文字。形はどれもピルで、違いは塗りの色で出す。

値：`"primary" | "secondary" | "danger" | "link"`

### ButtonGroup

関連する操作を隙間なくつなげ、一つのまとまりとして読ませる。

| 名前            | 型       | 既定値 | 説明                                                              |
| --------------- | -------- | ------ | ----------------------------------------------------------------- |
| `label`（必須） | `string` |        | まとまりの名前。`aria-label`として読み上げる。                    |
| `children`      | `Child`  |        | つなげる `Button`。最後に `iconOnly` の `DropdownMenu` を置ける。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button-group.css`

## コード

```tsx
import { Button, ActionLink, Icon } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <Button variant="primary">保存する</Button>
      <Button>キャンセル</Button>
    </div>
    <div class="rx-cluster">
      <Button size="compact" variant="primary">
        保存する
      </Button>
      <Button size="compact">キャンセル</Button>
    </div>
    <div class="rx-cluster">
      <Button size="large" variant="primary">
        保存する
      </Button>
      <Button size="large">キャンセル</Button>
    </div>
    <div class="rx-cluster">
      {(["primary", "secondary", "danger", "link"] as const).map((variant) => (
        <Button variant={variant}>{variant}の操作</Button>
      ))}
      <Button size="compact">小さな補助操作</Button>
      <Button disabled>変更なし</Button>
      <Button busy busyLabel="保存中…">
        保存する
      </Button>
      <Button variant="primary" busy busyLabel="公開中…">
        公開する
      </Button>
      <ActionLink href="/apps/schedule" variant="link">
        予定を開く
      </ActionLink>
    </div>
    <section class="rx-stack" aria-label="アイコン付きの操作">
      <h3>アイコンと文字</h3>
      {(["default", "compact", "large"] as const).map((size) => (
        <div class="rx-stack">
          <p>
            {size === "default" ? "通常" : size === "compact" ? "compact" : "large"}
          </p>
          <div class="rx-cluster">
            <Button size={size} variant="primary">
              <Icon name="pencil" />
              編集する
            </Button>
            <Button size={size}>
              確定する
              <Icon name="check" />
            </Button>
            <ActionLink size={size} href="/apps/schedule">
              予約へ
              <Icon name="arrow" />
            </ActionLink>
            <Button
              size={size}
              data-icon-only="true"
              aria-label="プレビュー"
              title="プレビュー"
            >
              <Icon name="eye" />
            </Button>
          </div>
        </div>
      ))}
      <h3>アイコンのみ：背景と枠線</h3>
      {(
        [
          { variant: "primary", label: "塗り背景", icon: "check", action: "確定する" },
          {
            variant: "secondary",
            label: "枠線付き",
            icon: "pencil",
            action: "編集する",
          },
          {
            variant: "link",
            label: "背景・枠線なし",
            icon: "eye",
            action: "プレビュー",
          },
          { variant: "danger", label: "危険操作", icon: "trash", action: "削除する" },
        ] as const
      ).map(({ variant, label, icon, action }) => (
        <div class="rx-stack">
          <p>{label}</p>
          <div class="rx-cluster">
            {(["default", "compact", "large"] as const).map((size) => (
              <Button
                size={size}
                variant={variant}
                data-icon-only="true"
                aria-label={action}
                title={action}
              >
                <Icon name={icon} />
              </Button>
            ))}
            <Button
              variant={variant}
              data-icon-only="true"
              disabled
              aria-label={action}
              title={`${action}（無効）`}
            >
              <Icon name={icon} />
            </Button>
          </div>
        </div>
      ))}
      <p>各行は通常・compact・large・無効の順です。</p>
      <h3>アイコン付きの無効・処理中</h3>
      <div class="rx-cluster">
        <Button disabled>
          <Icon name="pencil" />
          編集する
        </Button>
        <Button
          disabled
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
        >
          <Icon name="eye" />
        </Button>
        <Button busy busyLabel="保存中…">
          <Icon name="check" />
          保存する
        </Button>
      </div>
    </section>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-cluster">
    <button class="rx-button" type="button" data-variant="primary" data-size="default">
      保存する</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      キャンセル
    </button>
  </div>
  <div class="rx-cluster">
    <button class="rx-button" type="button" data-variant="primary" data-size="compact">
      保存する</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="compact"
    >
      キャンセル
    </button>
  </div>
  <div class="rx-cluster">
    <button class="rx-button" type="button" data-variant="primary" data-size="large">
      保存する</button
    ><button class="rx-button" type="button" data-variant="secondary" data-size="large">
      キャンセル
    </button>
  </div>
  <div class="rx-cluster">
    <button class="rx-button" type="button" data-variant="primary" data-size="default">
      primaryの操作</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      secondaryの操作</button
    ><button class="rx-button" type="button" data-variant="danger" data-size="default">
      dangerの操作</button
    ><button class="rx-button" type="button" data-variant="link" data-size="default">
      linkの操作</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="compact"
    >
      小さな補助操作</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
      disabled=""
    >
      変更なし</button
    ><button
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
      data-busy="true"
      disabled=""
      aria-busy="true"
    >
      保存中…</button
    ><button
      class="rx-button"
      type="button"
      data-variant="primary"
      data-size="default"
      data-busy="true"
      disabled=""
      aria-busy="true"
    >
      公開中…</button
    ><a href="/apps/schedule" class="rx-button" data-variant="link" data-size="default"
      >予定を開く</a
    >
  </div>
  <section class="rx-stack" aria-label="アイコン付きの操作">
    <h3>アイコンと文字</h3>
    <div class="rx-stack">
      <p>通常</p>
      <div class="rx-cluster">
        <button
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
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >編集する</button
        ><button
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          確定する<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >予約へ<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></a
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
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
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="rx-stack">
      <p>compact</p>
      <div class="rx-cluster">
        <button
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >編集する</button
        ><button
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="compact"
        >
          確定する<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="compact"
          >予約へ<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></a
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="rx-stack">
      <p>large</p>
      <div class="rx-cluster">
        <button
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >編集する</button
        ><button
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="large"
        >
          確定する<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="large"
          >予約へ<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></a
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg>
        </button>
      </div>
    </div>
    <h3>アイコンのみ：背景と枠線</h3>
    <div class="rx-stack">
      <p>塗り背景</p>
      <div class="rx-cluster">
        <button
          data-icon-only="true"
          aria-label="確定する"
          title="確定する"
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
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="確定する"
          title="確定する"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="確定する"
          title="確定する"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-check"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="確定する"
          title="確定する（無効）"
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="default"
          disabled=""
        >
          <svg
            class="rx-icon"
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
    <div class="rx-stack">
      <p>枠線付き</p>
      <div class="rx-cluster">
        <button
          data-icon-only="true"
          aria-label="編集する"
          title="編集する"
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
            <use href="/assets/rx-icons.svg#rx-pencil"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="編集する"
          title="編集する"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="編集する"
          title="編集する"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="編集する"
          title="編集する（無効）"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
          disabled=""
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="rx-stack">
      <p>背景・枠線なし</p>
      <div class="rx-cluster">
        <button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="プレビュー"
          title="プレビュー（無効）"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="default"
          disabled=""
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="rx-stack">
      <p>危険操作</p>
      <div class="rx-cluster">
        <button
          data-icon-only="true"
          aria-label="削除する"
          title="削除する"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-trash"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="削除する"
          title="削除する"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-trash"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="削除する"
          title="削除する"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="large"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-trash"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="削除する"
          title="削除する（無効）"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="default"
          disabled=""
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-trash"></use>
          </svg>
        </button>
      </div>
    </div>
    <p>各行は通常・compact・large・無効の順です。</p>
    <h3>アイコン付きの無効・処理中</h3>
    <div class="rx-cluster">
      <button
        class="rx-button"
        type="button"
        data-variant="secondary"
        data-size="default"
        disabled=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
        >編集する</button
      ><button
        data-icon-only="true"
        aria-label="プレビュー"
        title="プレビュー"
        class="rx-button"
        type="button"
        data-variant="secondary"
        data-size="default"
        disabled=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-eye"></use>
        </svg></button
      ><button
        class="rx-button"
        type="button"
        data-variant="secondary"
        data-size="default"
        data-busy="true"
        disabled=""
        aria-busy="true"
      >
        保存中…
      </button>
    </div>
  </section>
</div>
```

</details>
