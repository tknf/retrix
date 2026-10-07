<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Toolbar

対象に対する複数の操作をまとめます。

## 使いどころ

- 一つの対象やフォームに対する複数の操作（送信・リセット・移動）を、一続きの並びにまとめる時に使います。
- 現在の絞り込み条件を示す並びは `FilterBar`（`nav`）を使います。`Toolbar` は実行する操作の並び（`role="toolbar"`）です。両方の操作は同じピル形です。
- 関連する二つ三つの操作を一つにつなげて見せる時は `ButtonGroup`、画面の下に浮かべる操作バーは `ActionDock` を使います。

## 使い方

`ToolbarController` を `toolbar` として登録します。`Button`・`ActionLink` などの操作に `data-toolbar-target="control"` を付けると、全体が一つのTab停止点になり、矢印キーで操作を移れます。`data-controller` を渡すと、`toolbar` に続けて追加します。

縦に並べる時は `data-toolbar-orientation-value="vertical"` を渡します。上下の矢印で移り、`aria-orientation="vertical"` を付けます。

フォームの送信・リセットは `Button` の `type` で指定します。押した後の処理は各操作とフォームが行います。

操作は0.25remの間隔で並び、狭い配置では折り返します。子に `class="start"` を付けると伸びる欄（14remから24remまで）、`class="end"` を付けると行末へ寄せたまとまりになります。

`data-toolbar-target="control"` の付いた操作が一つも無い時は、controllerは働かず、コンソールに警告を出します。JavaScriptなしでは、各操作が通常のTab停止点のまま動きます。

## キーボード

| キー       | 動作                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Tab        | 並びに入る時は一つの操作（最後に使った操作、無ければ最初の有効な操作）へ移り、もう一度押すと並びの外へ出ます。 |
| → / ←      | 次・前の有効な操作へ移ります。右から左では反転し、端では反対の端へ戻ります。                                   |
| ↓ / ↑      | 縦の並びの時に、次・前の有効な操作へ移ります。                                                                 |
| Home / End | 最初・最後の有効な操作へ移ります。                                                                             |

## アクセシビリティ

- ルートは `role="toolbar"` で、`label` を名前として読み上げます。並びの説明は、画面の文を `aria-describedby` で結び付けます。
- `disabled` または `aria-disabled="true"` の操作は、矢印の移動で飛ばします。

## API

### Toolbar

関連する操作を一つのTab停止点にまとめる。操作にはdata-toolbar-target="control"を付ける。

| 名前            | 型       | 既定値 | 説明                                                                          |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 操作のまとまりの名前。`role="toolbar"`の`aria-label`として読み上げる。        |
| `children`      | `Child`  |        | 並べる操作。矢印キーで渡る操作には `data-toolbar-target="control"` を付ける。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`toolbar`（`ToolbarController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/toolbar.css`

## コード

```tsx
import {
  Toolbar,
  Button,
  ActionLink,
  Field,
  Input,
  Disclosure,
} from "@tknf/retrix/hono";

export default ({ id = "hono-toolbar" }: { id?: string } = {}) => (
  <div class="rx-stack">
    <form class="rx-stack" action="/apps/search" method="get">
      <Field id={`${id}-query`} label="記事のキーワード">
        {(attributes) => <Input {...attributes} name="q" value="案内" />}
      </Field>
      <Toolbar id={`${id}-search`} label="検索の操作" aria-describedby={`${id}-help`}>
        <Button type="submit" variant="primary" data-toolbar-target="control">
          検索する
        </Button>
        <Button type="reset" data-toolbar-target="control">
          初期値に戻す
        </Button>
        <ActionLink href="/apps/search" data-toolbar-target="control">
          記事一覧
        </ActionLink>
      </Toolbar>
      <p id={`${id}-help`}>
        検索結果へ移動します。リセットはキーワードを「案内」に戻します。
      </p>
    </form>
    <Disclosure summary="移動リンク・利用できない操作との組み合わせ">
      <Toolbar label="記事の操作">
        <ActionLink href="/apps/docs" data-toolbar-target="control">
          編集
        </ActionLink>
        <ActionLink href="/apps/docs" data-toolbar-target="control">
          比較
        </ActionLink>
        <Button disabled data-toolbar-target="control">
          変更なし
        </Button>
      </Toolbar>
    </Disclosure>
    <Disclosure summary="長いラベル・サイズ違い・右から左の配置">
      <div class="rx-stack">
        <Toolbar label="公開前の確認">
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            公開前に文章と設定の変更内容を確認する
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            編集画面へ戻って内容を修正する
          </ActionLink>
        </Toolbar>
        <Toolbar label="サイズ違いの操作">
          <ActionLink href="/apps/docs" size="compact" data-toolbar-target="control">
            編集
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            比較
          </ActionLink>
          <ActionLink href="/apps/search" size="large" data-toolbar-target="control">
            記事一覧
          </ActionLink>
        </Toolbar>
        <Toolbar label="右から左に並ぶ操作" dir="rtl">
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            編集
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            比較
          </ActionLink>
          <Button disabled data-toolbar-target="control">
            変更なし
          </Button>
        </Toolbar>
      </div>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <form class="rx-stack" action="/apps/search" method="get">
    <div class="rx-field">
      <div class="heading">
        <label for="hono-toolbar-query">記事のキーワード</label>
      </div>
      <input id="hono-toolbar-query" name="q" value="案内" class="rx-input" />
    </div>
    <div
      id="hono-toolbar-search"
      aria-describedby="hono-toolbar-help"
      class="rx-toolbar"
      role="toolbar"
      aria-label="検索の操作"
      data-controller="toolbar"
    >
      <button
        data-toolbar-target="control"
        class="rx-button"
        type="submit"
        data-variant="primary"
        data-size="default"
      >
        検索する</button
      ><button
        data-toolbar-target="control"
        class="rx-button"
        type="reset"
        data-variant="secondary"
        data-size="default"
      >
        初期値に戻す</button
      ><a
        href="/apps/search"
        data-toolbar-target="control"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        >記事一覧</a
      >
    </div>
    <p id="hono-toolbar-help">
      検索結果へ移動します。リセットはキーワードを「案内」に戻します。
    </p>
  </form>
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
        ><span class="title">移動リンク・利用できない操作との組み合わせ</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-toolbar"
        role="toolbar"
        aria-label="記事の操作"
        data-controller="toolbar"
      >
        <a
          href="/apps/docs"
          data-toolbar-target="control"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >編集</a
        ><a
          href="/apps/docs"
          data-toolbar-target="control"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >比較</a
        ><button
          data-toolbar-target="control"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
          disabled=""
        >
          変更なし
        </button>
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
        ><span class="title">長いラベル・サイズ違い・右から左の配置</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div
          class="rx-toolbar"
          role="toolbar"
          aria-label="公開前の確認"
          data-controller="toolbar"
        >
          <a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >公開前に文章と設定の変更内容を確認する</a
          ><a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >編集画面へ戻って内容を修正する</a
          >
        </div>
        <div
          class="rx-toolbar"
          role="toolbar"
          aria-label="サイズ違いの操作"
          data-controller="toolbar"
        >
          <a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="compact"
            >編集</a
          ><a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >比較</a
          ><a
            href="/apps/search"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="large"
            >記事一覧</a
          >
        </div>
        <div
          dir="rtl"
          class="rx-toolbar"
          role="toolbar"
          aria-label="右から左に並ぶ操作"
          data-controller="toolbar"
        >
          <a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >編集</a
          ><a
            href="/apps/docs"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >比較</a
          ><button
            data-toolbar-target="control"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            disabled=""
          >
            変更なし
          </button>
        </div>
      </div>
    </div>
  </details>
</div>
```

</details>
