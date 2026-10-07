<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Popover

補足の説明や小さな操作を、必要な時に開いて表示します。

## 使いどころ

- 用語の補足、関連するリンク、短い入力のように、必要な時だけ開いて見る内容に使います。背後の画面は操作できるままです。
- 答えるまで先へ進ませない確認や必須の入力は `Dialog` を使います。
- リンクや対象にホバーした時の概要は `HoverCard`、操作に添える一言の補足は `Tooltip` を使います。
- 補助の操作を並べるだけなら `DropdownMenu` を使います。

## 使い方

標準のPopover API（`popover="auto"`）で開閉する、モーダルでない白いパネルです。開く操作とパネルはCSSのアンカーで結び、開く操作の下に揃えて置きます。`id` は画面内で一意にします。

`PopoverController` を `popover` として登録すると、CSSのアンカーに対応しない環境や、パネルが画面に収まらない時に位置を補い、画面の端から8pxの内側に収めます。スクロールと画面の大きさの変化にも追従します。

パネルは見出し・本文・操作欄に分けます。`title` を省略すると `label` を見出しにし、`titleHidden` で見出しを読み上げだけに残せます。`description` は見出しの下の説明、`actions` は下の操作欄です。`size` はパネルの幅の上限で、`compact` は16rem、`default` は20rem、`wide` は28remです。

`align` の `end` は、行の末尾側に置いた開く操作に揃えます。`dir="rtl"` では始端と末端が入れ替わります。

開く操作は `icon`・`iconOnly`・`disabled`・`triggerVariant` で変えられます。`iconOnly` の開く操作には `tooltip` で名前を出せます。

開くと見出しへフォーカスを移します。`initialFocus` を `content` にすると、本文の `autofocus` の欄へ移ります。パネルの外側を押す・Escape・閉じる操作で閉じます。パネルの中に別の `Popover` を開いても、元のパネルは開いたままです。

本文のフォームの送信やリンクの移動は、標準の振る舞いのまま利用側が扱います。JavaScriptなしでも標準のPopover APIで開閉し、CSSのアンカーに対応しない環境ではパネルを画面の中央に出します。

## キーボード

| キー                      | 動作                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| Enter / Space（開く操作） | パネルを開き、見出し（`initialFocus` が `content` なら本文の `autofocus` の欄）へ移ります。 |
| Escape                    | パネルを閉じ、開く操作へフォーカスを戻します。                                              |

## アクセシビリティ

- パネルは `role="dialog"` で、見出しを名前（`aria-labelledby`）、`description` を説明（`aria-describedby`）にします。見出しは `tabindex="-1"` で、Tabの巡回には入りません。
- 開く操作は `aria-haspopup="dialog"`・`aria-controls` を持ちます。`iconOnly` の時は `label` を `aria-label` にします（`icon` が無ければinfoのアイコンを出します）。
- `tooltip` で出す名前は見た目だけの補足で、`aria-describedby` には結び付けません。名前は `aria-label` で読み上げます。
- 見出しの横の閉じる操作はアイコンだけなので、`closeLabel` を `aria-label` にします。閉じる操作とEscapeで閉じると、開く操作へフォーカスを戻します。

## API

### Popover

非モーダルの補足表示。開閉は標準Popover API、位置指定はCSSを優先する。

| 名前             | 型                                 | 既定値        | 説明                                                                                                                                                         |
| ---------------- | ---------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`（必須）     | `string`                           |               | パネルのid。画面内で一意にする。開く操作の`popovertarget`と、CSSのアンカー名の元になる。                                                                     |
| `label`（必須）  | `string`                           |               | 開く操作の文言。iconOnlyの時は`aria-label`として読み上げる。                                                                                                 |
| `title`          | `string`                           | `label`       | パネルの見出し。省略するとlabelを使う。                                                                                                                      |
| `description`    | `string`                           |               | 見出しの下に置く短い説明。パネルの説明（`aria-describedby`）になる。                                                                                         |
| `align`          | `"start" \| "end"`                 | `"start"`     | パネルを開く操作のどちらの端に揃えるか。                                                                                                                     |
| `size`           | `"compact" \| "default" \| "wide"` | `"default"`   | パネルの幅。compactは16rem、defaultは20rem、wideは28remを上限にする。                                                                                        |
| `icon`           | `IconName`                         |               | 開く操作の文言の前に置くアイコン。                                                                                                                           |
| `iconOnly`       | `boolean`                          | `false`       | 開く操作をアイコンだけにする。iconが無ければinfoのアイコンを出す。                                                                                           |
| `disabled`       | `boolean`                          |               | 開く操作を押せなくする。                                                                                                                                     |
| `triggerVariant` | `ButtonProps["variant"]`           | `"secondary"` | 開く操作の見た目。値の意味はButtonと同じ。                                                                                                                   |
| `closeLabel`     | `string`                           | `"閉じる"`    | 見出しの横の閉じる操作の名前。                                                                                                                               |
| `initialFocus`   | `"title" \| "content"`             | `"title"`     | 開いた時にフォーカスを移す先。titleは見出し（既定）。contentは中身のautofocusを付けた欄へ移り、開いてすぐ入力を始めるもの（EmojiPickerの検索欄など）に使う。 |
| `titleHidden`    | `boolean`                          | `false`       | 見出しを読み上げだけに残し、画面には出さない。開く操作の名前で中身が分かる小さなパネルに使う。                                                               |
| `tooltip`        | `boolean`                          | `false`       | アイコンだけの開く操作に、ホバー時とフォーカス時の名前をTooltipで出す。既定は出さない。                                                                      |
| `actions`        | `Child`                            |               | パネルの下の操作欄に並べる操作。                                                                                                                             |
| `dir`            | `"ltr" \| "rtl"`                   |               | 文字の向き。rtlでは先頭と末尾が入れ替わる。                                                                                                                  |
| `children`       | `Child`                            |               | パネルの本文。リンクや短いフォームを置ける。                                                                                                                 |

登録するcontroller：`popover`（`PopoverController`）、`tooltip`（`TooltipController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/popover.css`、`components/tooltip.css`

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

#### `ButtonProps`

[Button](button.md)のpropsと同じです。

## コード

```tsx
import {
  Popover,
  Dialog,
  Disclosure,
  Button,
  ActionLink,
  Field,
  Input,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Popover id="hono-popover" label="共有範囲">
      <p>この案件に参加しているメンバーが閲覧できます。</p>
      <a href="/apps/settings">設定を開く</a>
    </Popover>
    <Disclosure summary="説明だけ・アイコンのみのトリガー">
      <div class="rx-cluster">
        <Popover
          id="popover-note"
          label="公開範囲について"
          size="compact"
          description="公開すると、リンクを知っている人が閲覧できます。"
        />
        <Popover
          id="popover-icon"
          label="閲覧権限について"
          title="閲覧できる人"
          icon="info"
          iconOnly
          size="compact"
        >
          <p>招待されたメンバーだけが閲覧できます。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="関連リンク・操作欄">
      <Popover
        id="popover-links"
        label="関連するページ"
        title="案件の管理"
        actions={
          <ActionLink href="/apps/settings" variant="primary">
            設定を開く
          </ActionLink>
        }
      >
        <a href="/apps/project">案件の状況を見る</a>
        <a href="/apps/schedule">予定を見る</a>
      </Popover>
    </Disclosure>
    <Disclosure summary="短い入力・必須入力の検証">
      <Popover
        id="popover-search"
        label="記事を検索"
        title="キーワードで探す"
        actions={
          <Button type="submit" form="popover-search-form" variant="primary">
            検索する
          </Button>
        }
      >
        <form id="popover-search-form" action="/apps/search" method="get">
          <Field id="popover-query" label="キーワード" help="必須項目です。">
            {(attributes) => (
              <Input {...attributes} name="q" required placeholder="例：案内" />
            )}
          </Field>
        </form>
      </Popover>
    </Disclosure>
    <Disclosure summary="右寄せ・右から左の配置">
      <div class="rx-stack" data-space="small">
        <Popover id="popover-end" label="右端の補足" align="end">
          <p>末端に揃え、画面に収まらない場合は位置を調整します。</p>
        </Popover>
        <Popover id="popover-rtl" label="右から左の補足" dir="rtl">
          <p>文字の方向に合わせて、配置の始端と末端を切り替えます。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="長い見出し・長文・スクロール">
      <Popover
        id="popover-long"
        label="公開前の補足を読む"
        size="wide"
        title="公開前に文章と添付ファイルと共有設定をまとめて確認してください"
      >
        {Array.from({ length: 10 }, (_, index) => (
          <p>
            確認事項 {index + 1}
            ：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
          </p>
        ))}
      </Popover>
    </Disclosure>
    <Disclosure summary="処理中・エラー・無効状態">
      <div class="rx-cluster">
        <Popover
          id="popover-loading"
          label="取得中の例"
          title="共有情報を取得しています"
          actions={
            <Button busy busyLabel="取得中…">
              再取得
            </Button>
          }
        >
          <p>この例は表示の確認用で、状態は自動では変わりません。</p>
        </Popover>
        <Popover
          id="popover-error"
          label="エラーの例"
          title="共有情報を取得できませんでした"
        >
          <p>時間をおいて、もう一度開いてください。この例では通信を行いません。</p>
        </Popover>
        <Popover id="popover-disabled" label="権限のない補足" disabled>
          <p>この補足は開けません。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="Popover内の補足・Dialog内の補足">
      <div class="rx-cluster">
        <Popover id="popover-parent" label="公開設定の補足">
          <p>公開する範囲を確認してください。</p>
          <Popover id="popover-child" label="リンク共有について" size="compact">
            <p>リンクを知っている人が閲覧できます。閉じると元の補足へ戻ります。</p>
          </Popover>
        </Popover>
        <Dialog
          id="popover-in-dialog"
          title="共有設定の確認"
          trigger="Dialog内で確認する"
        >
          <p>補足を閉じても、この確認画面は開いたままです。</p>
          <Popover id="popover-dialog-help" label="共有範囲の補足" size="compact">
            <p>招待されたメンバーだけが閲覧できます。</p>
          </Popover>
        </Dialog>
      </div>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-popover" data-controller="popover" data-align="start">
    <button
      popovertarget="hono-popover"
      style="anchor-name: --rx-popover-68-6f-6e-6f-2d-70-6f-70-6f-76-65-72"
      data-popover-target="trigger"
      aria-haspopup="dialog"
      aria-controls="hono-popover"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      共有範囲
    </button>
    <div
      id="hono-popover"
      popover="auto"
      class="panel rx-overlay"
      data-placement="anchor"
      style="--rx-overlay-anchor: --rx-popover-68-6f-6e-6f-2d-70-6f-70-6f-76-65-72"
      data-popover-target="panel"
      data-align="start"
      data-size="default"
      role="dialog"
      aria-labelledby="hono-popover-title"
    >
      <header class="heading">
        <div class="heading-row">
          <h3 id="hono-popover-title" tabindex="-1" autofocus="">共有範囲</h3>
          <span class="close"
            ><button
              popovertarget="hono-popover"
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
      <div class="body">
        <p>この案件に参加しているメンバーが閲覧できます。</p>
        <a href="/apps/settings">設定を開く</a>
      </div>
    </div>
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
      ><span class="label"
        ><span class="title">説明だけ・アイコンのみのトリガー</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-cluster">
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-note"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-6e-6f-74-65"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-note"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            公開範囲について
          </button>
          <div
            id="popover-note"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-6e-6f-74-65;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="compact"
            role="dialog"
            aria-labelledby="popover-note-title"
            aria-describedby="popover-note-description"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-note-title" tabindex="-1" autofocus="">
                  公開範囲について
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-note"
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
              <p id="popover-note-description">
                公開すると、リンクを知っている人が閲覧できます。
              </p>
            </header>
            <div class="body"></div>
          </div>
        </div>
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-icon"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-69-63-6f-6e"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-icon"
            aria-label="閲覧権限について"
            data-icon-only="true"
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
              <use href="/assets/rx-icons.svg#rx-info"></use>
            </svg>
          </button>
          <div
            id="popover-icon"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-69-63-6f-6e;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="compact"
            role="dialog"
            aria-labelledby="popover-icon-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-icon-title" tabindex="-1" autofocus="">閲覧できる人</h3>
                <span class="close"
                  ><button
                    popovertarget="popover-icon"
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
            <div class="body"><p>招待されたメンバーだけが閲覧できます。</p></div>
          </div>
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
      ><span class="label"><span class="title">関連リンク・操作欄</span></span>
    </summary>
    <div class="body">
      <div class="rx-popover" data-controller="popover" data-align="start">
        <button
          popovertarget="popover-links"
          style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-69-6e-6b-73"
          data-popover-target="trigger"
          aria-haspopup="dialog"
          aria-controls="popover-links"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          関連するページ
        </button>
        <div
          id="popover-links"
          popover="auto"
          class="panel rx-overlay"
          data-placement="anchor"
          style="
            --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-69-6e-6b-73;
          "
          data-popover-target="panel"
          data-align="start"
          data-size="default"
          role="dialog"
          aria-labelledby="popover-links-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h3 id="popover-links-title" tabindex="-1" autofocus="">案件の管理</h3>
              <span class="close"
                ><button
                  popovertarget="popover-links"
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
          <div class="body">
            <a href="/apps/project">案件の状況を見る</a
            ><a href="/apps/schedule">予定を見る</a>
          </div>
          <footer class="actions">
            <a
              href="/apps/settings"
              class="rx-button"
              data-variant="primary"
              data-size="default"
              >設定を開く</a
            >
          </footer>
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
      ><span class="label"><span class="title">短い入力・必須入力の検証</span></span>
    </summary>
    <div class="body">
      <div class="rx-popover" data-controller="popover" data-align="start">
        <button
          popovertarget="popover-search"
          style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-73-65-61-72-63-68"
          data-popover-target="trigger"
          aria-haspopup="dialog"
          aria-controls="popover-search"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          記事を検索
        </button>
        <div
          id="popover-search"
          popover="auto"
          class="panel rx-overlay"
          data-placement="anchor"
          style="
            --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-73-65-61-72-63-68;
          "
          data-popover-target="panel"
          data-align="start"
          data-size="default"
          role="dialog"
          aria-labelledby="popover-search-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h3 id="popover-search-title" tabindex="-1" autofocus="">
                キーワードで探す
              </h3>
              <span class="close"
                ><button
                  popovertarget="popover-search"
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
          <div class="body">
            <form id="popover-search-form" action="/apps/search" method="get">
              <div class="rx-field">
                <div class="heading"><label for="popover-query">キーワード</label></div>
                <input
                  id="popover-query"
                  aria-describedby="popover-query-help"
                  name="q"
                  required=""
                  placeholder="例：案内"
                  class="rx-input"
                />
                <div class="messages">
                  <p class="help" id="popover-query-help">
                    <span>必須項目です。</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <footer class="actions">
            <button
              form="popover-search-form"
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              検索する
            </button>
          </footer>
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
      ><span class="label"><span class="title">右寄せ・右から左の配置</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack" data-space="small">
        <div class="rx-popover" data-controller="popover" data-align="end">
          <button
            popovertarget="popover-end"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-65-6e-64"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-end"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            右端の補足
          </button>
          <div
            id="popover-end"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="--rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-65-6e-64"
            data-popover-target="panel"
            data-align="end"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-end-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-end-title" tabindex="-1" autofocus="">右端の補足</h3>
                <span class="close"
                  ><button
                    popovertarget="popover-end"
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
            <div class="body">
              <p>末端に揃え、画面に収まらない場合は位置を調整します。</p>
            </div>
          </div>
        </div>
        <div class="rx-popover" data-controller="popover" data-align="start" dir="rtl">
          <button
            popovertarget="popover-rtl"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-72-74-6c"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-rtl"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            右から左の補足
          </button>
          <div
            id="popover-rtl"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="--rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-72-74-6c"
            data-popover-target="panel"
            data-align="start"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-rtl-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-rtl-title" tabindex="-1" autofocus="">
                  右から左の補足
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-rtl"
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
            <div class="body">
              <p>文字の方向に合わせて、配置の始端と末端を切り替えます。</p>
            </div>
          </div>
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
        ><span class="title">長い見出し・長文・スクロール</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-popover" data-controller="popover" data-align="start">
        <button
          popovertarget="popover-long"
          style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-6f-6e-67"
          data-popover-target="trigger"
          aria-haspopup="dialog"
          aria-controls="popover-long"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          公開前の補足を読む
        </button>
        <div
          id="popover-long"
          popover="auto"
          class="panel rx-overlay"
          data-placement="anchor"
          style="--rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-6f-6e-67"
          data-popover-target="panel"
          data-align="start"
          data-size="wide"
          role="dialog"
          aria-labelledby="popover-long-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h3 id="popover-long-title" tabindex="-1" autofocus="">
                公開前に文章と添付ファイルと共有設定をまとめて確認してください
              </h3>
              <span class="close"
                ><button
                  popovertarget="popover-long"
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
          <div class="body">
            <p>
              確認事項
              1：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              2：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              3：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              4：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              5：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              6：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              7：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              8：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              9：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
            <p>
              確認事項
              10：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
            </p>
          </div>
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
      ><span class="label"><span class="title">処理中・エラー・無効状態</span></span>
    </summary>
    <div class="body">
      <div class="rx-cluster">
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-loading"
            style="
              anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-6f-61-64-69-6e-67;
            "
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-loading"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            取得中の例
          </button>
          <div
            id="popover-loading"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-6c-6f-61-64-69-6e-67;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-loading-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-loading-title" tabindex="-1" autofocus="">
                  共有情報を取得しています
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-loading"
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
            <div class="body">
              <p>この例は表示の確認用で、状態は自動では変わりません。</p>
            </div>
            <footer class="actions">
              <button
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
                data-busy="true"
                disabled=""
                aria-busy="true"
              >
                取得中…
              </button>
            </footer>
          </div>
        </div>
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-error"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-65-72-72-6f-72"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-error"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            エラーの例
          </button>
          <div
            id="popover-error"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-65-72-72-6f-72;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-error-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-error-title" tabindex="-1" autofocus="">
                  共有情報を取得できませんでした
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-error"
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
            <div class="body">
              <p>時間をおいて、もう一度開いてください。この例では通信を行いません。</p>
            </div>
          </div>
        </div>
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-disabled"
            style="
              anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-64-69-73-61-62-6c-65-64;
            "
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-disabled"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            disabled=""
          >
            権限のない補足
          </button>
          <div
            id="popover-disabled"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-64-69-73-61-62-6c-65-64;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-disabled-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-disabled-title" tabindex="-1" autofocus="">
                  権限のない補足
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-disabled"
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
            <div class="body"><p>この補足は開けません。</p></div>
          </div>
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
        ><span class="title">Popover内の補足・Dialog内の補足</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-cluster">
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="popover-parent"
            style="anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-70-61-72-65-6e-74"
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="popover-parent"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            公開設定の補足
          </button>
          <div
            id="popover-parent"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-70-61-72-65-6e-74;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="default"
            role="dialog"
            aria-labelledby="popover-parent-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="popover-parent-title" tabindex="-1" autofocus="">
                  公開設定の補足
                </h3>
                <span class="close"
                  ><button
                    popovertarget="popover-parent"
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
            <div class="body">
              <p>公開する範囲を確認してください。</p>
              <div class="rx-popover" data-controller="popover" data-align="start">
                <button
                  popovertarget="popover-child"
                  style="
                    anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-63-68-69-6c-64;
                  "
                  data-popover-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="popover-child"
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  リンク共有について
                </button>
                <div
                  id="popover-child"
                  popover="auto"
                  class="panel rx-overlay"
                  data-placement="anchor"
                  style="
                    --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-63-68-69-6c-64;
                  "
                  data-popover-target="panel"
                  data-align="start"
                  data-size="compact"
                  role="dialog"
                  aria-labelledby="popover-child-title"
                >
                  <header class="heading">
                    <div class="heading-row">
                      <h3 id="popover-child-title" tabindex="-1" autofocus="">
                        リンク共有について
                      </h3>
                      <span class="close"
                        ><button
                          popovertarget="popover-child"
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
                  <div class="body">
                    <p>
                      リンクを知っている人が閲覧できます。閉じると元の補足へ戻ります。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rx-dialog" data-controller="dialog" data-state="closed">
          <button
            data-dialog-target="trigger"
            aria-controls="popover-in-dialog"
            aria-haspopup="dialog"
            aria-expanded="false"
            data-state="closed"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            Dialog内で確認する
          </button>
          <dialog
            id="popover-in-dialog"
            class="panel rx-overlay"
            closedby="any"
            data-dialog-target="dialog"
            data-state="closed"
            data-size="default"
            aria-labelledby="popover-in-dialog-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h2
                  id="popover-in-dialog-title"
                  data-dialog-target="title"
                  tabindex="-1"
                  autofocus=""
                >
                  共有設定の確認
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
              <p>補足を閉じても、この確認画面は開いたままです。</p>
              <div class="rx-popover" data-controller="popover" data-align="start">
                <button
                  popovertarget="popover-dialog-help"
                  style="
                    anchor-name: --rx-popover-70-6f-70-6f-76-65-72-2d-64-69-61-6c-6f-67-2d-68-65-6c-70;
                  "
                  data-popover-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="popover-dialog-help"
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  共有範囲の補足
                </button>
                <div
                  id="popover-dialog-help"
                  popover="auto"
                  class="panel rx-overlay"
                  data-placement="anchor"
                  style="
                    --rx-overlay-anchor: --rx-popover-70-6f-70-6f-76-65-72-2d-64-69-61-6c-6f-67-2d-68-65-6c-70;
                  "
                  data-popover-target="panel"
                  data-align="start"
                  data-size="compact"
                  role="dialog"
                  aria-labelledby="popover-dialog-help-title"
                >
                  <header class="heading">
                    <div class="heading-row">
                      <h3 id="popover-dialog-help-title" tabindex="-1" autofocus="">
                        共有範囲の補足
                      </h3>
                      <span class="close"
                        ><button
                          popovertarget="popover-dialog-help"
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
                  <div class="body"><p>招待されたメンバーだけが閲覧できます。</p></div>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  </details>
</div>
```

</details>
