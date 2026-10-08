<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ContextBar

現在の位置と、関連する移動・操作を作業面の上部にまとめます。

## 使いどころ

- 作業面の上端で、現在地のパンくずと、その対象への移動・操作をまとめる時に使います。
- パンくずだけを置く時は`Breadcrumb`、一つ上へ戻るだけなら`BackLink`を使います。
- `Toolbar`は関連する複数の操作、`ContextBar`は現在地とその対象の操作をまとめます。操作のグループにキー操作が要る時は、`ContextBar`の中に`Toolbar`を置きます。

## 使い方

`items`で現在地までの階層を渡し、`children`に`Button`・`ActionLink`・`Toolbar`・`ButtonGroup`・`DropdownMenu`などを置きます。操作はバーの末尾側に寄ります。

主要な操作は一つに絞り、補助操作の後に置きます。移動は`ActionLink`、フォームの送信や画面内の操作は`Button`を使います。フォームの外から送信・リセットする時は、`Button`の`form`属性に対象のフォームの`id`を渡します。

現在地は灰色の小さな文字（12px）で先頭側に置き、バーの下に1px `#dedede` の罫線を引いて、ここから中身が始まることを示します。バーの高さは操作の有無で変えません。幅が足りない時は現在地、操作の順に折り返し、長い名前や空白のない識別子も折り返します。

`Surface`と組み合わせる時は`context`に渡します。`Surface`の上端に、本文と同じ左右の余白で置き、下の区切り線を消します。`AppShell`の作業面の先頭に置いた時も同じく、見出しと同じ左右の位置に置いて区切り線を消し、作業面の上の余白を詰めます。

## アクセシビリティ

- 現在地は`Breadcrumb`の`nav`で出し、`label`がその読み上げ名になります。最後の項目に`aria-current="page"`を付けます。
- バー全体には`role="menu"`や`role="toolbar"`を付けません。
- 無効な操作を置く時は、操作できない理由を本文にも示し、`aria-describedby`などで関連付けます。

## API

### ContextBar

| 名前            | 型                          | 既定値                       | 説明                                                                                                     |
| --------------- | --------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `items`（必須） | `readonly BreadcrumbItem[]` |                              | 現在地までの階層。Breadcrumbのitemsと同じで、最後の項目が現在地になる。                                  |
| `label`         | `string`                    | `"現在の位置と関連する操作"` | 現在地を示すnavの読み上げ名。                                                                            |
| `children`      | `Child`                     |                              | バーの末尾側に置く操作。`Button`・`ActionLink`・`Toolbar`・`ButtonGroup`・`DropdownMenu`などを渡します。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/context-bar.css`、`components/breadcrumb.css`

#### `BreadcrumbItem`

| 名前            | 型       | 既定値 | 説明                                                                                            |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 階層の名前。                                                                                    |
| `href`          | `string` |        | 戻り先のURL。最後の項目（現在地）では渡してもリンクにしない。省略するとリンクのない文字になる。 |

## コード

```tsx
import {
  ActionLink,
  Button,
  ButtonGroup,
  ContextBar,
  Dialog,
  Disclosure,
  DropdownMenu,
  Field,
  Icon,
  Input,
  Surface,
  Toolbar,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small" aria-label="現在地だけ">
      <h3>現在地だけ</h3>
      <ContextBar
        items={[{ label: "資料", href: "/apps/files" }, { label: "仕事場の案内" }]}
      />
    </section>
    <section class="rx-stack" data-space="small" aria-label="一つの主要操作">
      <h3>一つの主要操作</h3>
      <ContextBar
        items={[{ label: "記事", href: "/apps/search" }, { label: "記事一覧" }]}
      >
        <ActionLink href="/apps/docs" variant="primary">
          <Icon name="pencil" />
          記事を書く
        </ActionLink>
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="補助操作と主要操作">
      <h3>補助操作と主要操作</h3>
      <ContextBar
        items={[{ label: "記事", href: "/apps/search" }, { label: "仕事場の案内" }]}
      >
        <Dialog
          id="context-article-preview"
          title="仕事場の案内"
          trigger="プレビュー"
          size="compact"
        >
          <p>初めて利用する方へ。予約方法と、当日の受付についてご案内します。</p>
          <p>利用する部屋と時間を選び、受付で予約名をお伝えください。</p>
        </Dialog>
        <ActionLink href="/apps/docs" variant="primary">
          <Icon name="pencil" />
          編集する
        </ActionLink>
      </ContextBar>
    </section>
    <section
      class="rx-stack"
      data-space="small"
      aria-label="離れたフォームの送信とリセット"
    >
      <h3>離れたフォームの送信とリセット</h3>
      <ContextBar
        items={[{ label: "記事", href: "/apps/search" }, { label: "検索条件" }]}
      >
        <Button type="reset" form="context-search-form">
          元に戻す
        </Button>
        <Button type="submit" form="context-search-form" variant="primary">
          <Icon name="search" />
          検索する
        </Button>
      </ContextBar>
      <form id="context-search-form" action="/apps/search" method="get">
        <Field
          id="context-search-query"
          label="キーワード"
          help="検索ボタンはフォームの外側にあります。"
        >
          {(attributes) => (
            <Input {...attributes} name="q" type="search" value="暮らし" required />
          )}
        </Field>
      </form>
    </section>
    <section class="rx-stack" data-space="small" aria-label="主操作とメニューを接続">
      <h3>主操作とメニューを接続</h3>
      <ContextBar
        items={[{ label: "資料", href: "/apps/files" }, { label: "記事の準備" }]}
      >
        <ButtonGroup label="記事の準備を始める">
          <ActionLink href="/apps/docs" variant="primary">
            記事を書く
          </ActionLink>
          <DropdownMenu
            id="context-create-menu"
            label="関連する作業を選ぶ"
            iconOnly
            variant="primary"
            align="end"
            items={[
              {
                kind: "link",
                label: "記事一覧から選ぶ",
                href: "/apps/search",
                icon: "pencil",
              },
              {
                kind: "link",
                label: "使う資料を探す",
                href: "/apps/files",
                icon: "files",
              },
            ]}
          />
        </ButtonGroup>
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="前後の移動と追加操作">
      <h3>前後の移動と追加操作</h3>
      <ContextBar
        items={[
          { label: "受信トレイ", href: "/apps/inbox" },
          { label: "来週の打ち合わせについて" },
        ]}
      >
        <Toolbar label="連絡を移動">
          <ActionLink
            href="/apps/inbox/categories"
            size="compact"
            data-toolbar-target="control"
          >
            前へ
          </ActionLink>
          <ActionLink
            href="/apps/inbox/review"
            size="compact"
            data-toolbar-target="control"
          >
            次へ
          </ActionLink>
        </Toolbar>
        <DropdownMenu
          id="context-message-menu"
          label="その他"
          align="end"
          items={[
            {
              kind: "link",
              label: "受信トレイを開く",
              href: "/apps/inbox",
              icon: "mail",
            },
            { kind: "separator" },
            {
              label: "連絡を削除する",
              value: "delete",
              icon: "trash",
              danger: true,
              disabled: true,
              description: "閲覧専用のため削除できません。",
            },
          ]}
        />
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="処理中と閲覧専用">
      <h3>処理中と閲覧専用</h3>
      <ContextBar
        items={[{ label: "記事", href: "/apps/search" }, { label: "保存中の記事" }]}
      >
        <Button busy busyLabel="保存中…" variant="primary">
          保存する
        </Button>
      </ContextBar>
      <ContextBar
        items={[
          { label: "共有資料", href: "/apps/files" },
          { label: "閲覧専用の資料" },
        ]}
      >
        <Button disabled aria-describedby="context-readonly-reason">
          編集する
        </Button>
        <DropdownMenu id="context-locked-menu" label="共有設定" items={[]} disabled />
      </ContextBar>
      <p id="context-readonly-reason">
        閲覧権限のみの場合は、操作できない理由を本文にも示します。
      </p>
    </section>
    <section class="rx-stack" data-space="small" aria-label="狭い作業面と長い現在地">
      <h3>狭い作業面と長い現在地</h3>
      <p>同じ画面内の小さな作業面でも、現在地と操作を省略せずに折り返します。</p>
      <div class="rx-split">
        <Surface
          context={
            <ContextBar
              items={[
                { label: "資料", href: "/apps/files" },
                { label: "仕事場の利用案内と申込手順・2026年秋の改訂版" },
              ]}
            >
              <ActionLink href="/assets/sample-cover.svg" download="仕事場の表紙.svg">
                ダウンロード
              </ActionLink>
            </ContextBar>
          }
        >
          <p>本文とContextBarを、同じ作業面の中で組み合わせた例です。</p>
        </Surface>
        <Surface
          context={
            <ContextBar
              items={[
                { label: "プロジェクト", href: "/apps/project" },
                {
                  label:
                    "2026-autumn-editorial-project-abcdefghijklmnopqrstuvwxyz0123456789",
                },
              ]}
            >
              <ActionLink href="/apps/project">プロジェクトを開く</ActionLink>
            </ContextBar>
          }
        >
          <p>空白のない識別子が届いても、操作を横へ押し出しません。</p>
        </Surface>
      </div>
    </section>
    <Disclosure summary="右から左へ書く言語">
      <ContextBar
        dir="rtl"
        label="الموقع الحالي"
        items={[
          { label: "المستندات", href: "/apps/files" },
          { label: "دليل استخدام مساحة العمل" },
        ]}
      >
        <ActionLink href="/apps/docs" variant="primary">
          تحرير
        </ActionLink>
      </ContextBar>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section class="rx-stack" data-space="small" aria-label="現在地だけ">
    <h3>現在地だけ</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/files">資料</a></li>
          <li><span aria-current="page">仕事場の案内</span></li>
        </ol>
      </nav>
    </div>
  </section>
  <section class="rx-stack" data-space="small" aria-label="一つの主要操作">
    <h3>一つの主要操作</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/search">記事</a></li>
          <li><span aria-current="page">記事一覧</span></li>
        </ol>
      </nav>
      <div class="actions">
        <a
          href="/apps/docs"
          class="rx-button"
          data-variant="primary"
          data-size="default"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >記事を書く</a
        >
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small" aria-label="補助操作と主要操作">
    <h3>補助操作と主要操作</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/search">記事</a></li>
          <li><span aria-current="page">仕事場の案内</span></li>
        </ol>
      </nav>
      <div class="actions">
        <div class="rx-dialog" data-controller="dialog" data-state="closed">
          <button
            data-dialog-target="trigger"
            aria-controls="context-article-preview"
            aria-haspopup="dialog"
            aria-expanded="false"
            data-state="closed"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            プレビュー
          </button>
          <dialog
            id="context-article-preview"
            class="panel rx-overlay"
            closedby="any"
            data-dialog-target="dialog"
            data-state="closed"
            data-size="compact"
            aria-labelledby="context-article-preview-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h2
                  id="context-article-preview-title"
                  data-dialog-target="title"
                  tabindex="-1"
                  autofocus=""
                >
                  仕事場の案内
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
              <p>初めて利用する方へ。予約方法と、当日の受付についてご案内します。</p>
              <p>利用する部屋と時間を選び、受付で予約名をお伝えください。</p>
            </div>
          </dialog>
        </div>
        <a
          href="/apps/docs"
          class="rx-button"
          data-variant="primary"
          data-size="default"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >編集する</a
        >
      </div>
    </div>
  </section>
  <section
    class="rx-stack"
    data-space="small"
    aria-label="離れたフォームの送信とリセット"
  >
    <h3>離れたフォームの送信とリセット</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/search">記事</a></li>
          <li><span aria-current="page">検索条件</span></li>
        </ol>
      </nav>
      <div class="actions">
        <button
          form="context-search-form"
          class="rx-button"
          type="reset"
          data-variant="secondary"
          data-size="default"
        >
          元に戻す</button
        ><button
          form="context-search-form"
          class="rx-button"
          type="submit"
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
            <use href="/assets/rx-icons.svg#rx-search"></use></svg
          >検索する
        </button>
      </div>
    </div>
    <form id="context-search-form" action="/apps/search" method="get">
      <div class="rx-field">
        <div class="heading"><label for="context-search-query">キーワード</label></div>
        <input
          id="context-search-query"
          aria-describedby="context-search-query-help"
          name="q"
          type="search"
          value="暮らし"
          required=""
          class="rx-input"
        />
        <div class="messages">
          <p class="help" id="context-search-query-help">
            <span>検索ボタンはフォームの外側にあります。</span>
          </p>
        </div>
      </div>
    </form>
  </section>
  <section class="rx-stack" data-space="small" aria-label="主操作とメニューを接続">
    <h3>主操作とメニューを接続</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/files">資料</a></li>
          <li><span aria-current="page">記事の準備</span></li>
        </ol>
      </nav>
      <div class="actions">
        <div class="rx-button-group" role="group" aria-label="記事の準備を始める">
          <a
            href="/apps/docs"
            class="rx-button"
            data-variant="primary"
            data-size="default"
            >記事を書く</a
          >
          <div
            class="rx-dropdown-menu"
            data-controller="dropdown-menu"
            data-state="closed"
            data-align="end"
          >
            <button
              id="context-create-menu-trigger"
              data-dropdown-menu-target="trigger"
              aria-controls="context-create-menu"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="関連する作業を選ぶ"
              data-icon-only="true"
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
              id="context-create-menu"
              class="rx-menu"
              data-dropdown-menu-target="menu"
              data-menu-panel="root"
              role="menu"
              popover="manual"
              aria-labelledby="context-create-menu-trigger"
              tabindex="-1"
              hidden=""
            >
              <li role="none">
                <a
                  id="context-create-menu-0-item"
                  role="menuitem"
                  aria-label="記事一覧から選ぶ"
                  data-menu-kind="link"
                  data-menu-label="記事一覧から選ぶ"
                  tabindex="-1"
                  href="/apps/search"
                  class="rx-button item"
                  data-variant="secondary"
                  data-size="default"
                  ><span class="content" data-leading="true"
                    ><span class="heading"
                      ><svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
                      ><span class="text"><span>記事一覧から選ぶ</span></span></span
                    ></span
                  ></a
                >
              </li>
              <li role="none">
                <a
                  id="context-create-menu-1-item"
                  role="menuitem"
                  aria-label="使う資料を探す"
                  data-menu-kind="link"
                  data-menu-label="使う資料を探す"
                  tabindex="-1"
                  href="/apps/files"
                  class="rx-button item"
                  data-variant="secondary"
                  data-size="default"
                  ><span class="content" data-leading="true"
                    ><span class="heading"
                      ><svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-files"></use></svg
                      ><span class="text"><span>使う資料を探す</span></span></span
                    ></span
                  ></a
                >
              </li>
            </menu>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small" aria-label="前後の移動と追加操作">
    <h3>前後の移動と追加操作</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/inbox">受信トレイ</a></li>
          <li><span aria-current="page">来週の打ち合わせについて</span></li>
        </ol>
      </nav>
      <div class="actions">
        <div
          class="rx-toolbar"
          role="toolbar"
          aria-label="連絡を移動"
          data-controller="toolbar"
        >
          <a
            href="/apps/inbox/categories"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="compact"
            >前へ</a
          ><a
            href="/apps/inbox/review"
            data-toolbar-target="control"
            class="rx-button"
            data-variant="secondary"
            data-size="compact"
            >次へ</a
          >
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="end"
        >
          <button
            id="context-message-menu-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="context-message-menu"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            その他<svg
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
            id="context-message-menu"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="context-message-menu-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <a
                id="context-message-menu-0-item"
                role="menuitem"
                aria-label="受信トレイを開く"
                data-menu-kind="link"
                data-menu-label="受信トレイを開く"
                tabindex="-1"
                href="/apps/inbox"
                class="rx-button item"
                data-variant="secondary"
                data-size="default"
                ><span class="content" data-leading="true"
                  ><span class="heading"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-mail"></use></svg
                    ><span class="text"><span>受信トレイを開く</span></span></span
                  ></span
                ></a
              >
            </li>
            <li class="separator" role="separator"></li>
            <li role="none">
              <button
                id="context-message-menu-2-item"
                role="menuitem"
                aria-label="連絡を削除する"
                aria-description="閲覧専用のため削除できません。"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="連絡を削除する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="delete"
                data-tone="danger"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
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
                      <use href="/assets/rx-icons.svg#rx-trash"></use></svg
                    ><span class="text"><span>連絡を削除する</span></span></span
                  ><small class="description"
                    >閲覧専用のため削除できません。</small
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small" aria-label="処理中と閲覧専用">
    <h3>処理中と閲覧専用</h3>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/search">記事</a></li>
          <li><span aria-current="page">保存中の記事</span></li>
        </ol>
      </nav>
      <div class="actions">
        <button
          class="rx-button"
          type="button"
          data-variant="primary"
          data-size="default"
          data-busy="true"
          disabled=""
          aria-busy="true"
        >
          保存中…
        </button>
      </div>
    </div>
    <div class="rx-context-bar">
      <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
        <ol>
          <li><a href="/apps/files">共有資料</a></li>
          <li><span aria-current="page">閲覧専用の資料</span></li>
        </ol>
      </nav>
      <div class="actions">
        <button
          aria-describedby="context-readonly-reason"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
          disabled=""
        >
          編集する
        </button>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="context-locked-menu-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="context-locked-menu"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            disabled=""
          >
            共有設定<svg
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
            id="context-locked-menu"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="context-locked-menu-trigger"
            tabindex="-1"
            hidden=""
          >
            <li class="empty" role="none">利用できる操作はありません</li>
          </menu>
        </div>
      </div>
    </div>
    <p id="context-readonly-reason">
      閲覧権限のみの場合は、操作できない理由を本文にも示します。
    </p>
  </section>
  <section class="rx-stack" data-space="small" aria-label="狭い作業面と長い現在地">
    <h3>狭い作業面と長い現在地</h3>
    <p>同じ画面内の小さな作業面でも、現在地と操作を省略せずに折り返します。</p>
    <div class="rx-split">
      <div class="rx-surface" data-layout="standard">
        <div class="rx-context-bar">
          <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
            <ol>
              <li><a href="/apps/files">資料</a></li>
              <li>
                <span aria-current="page"
                  >仕事場の利用案内と申込手順・2026年秋の改訂版</span
                >
              </li>
            </ol>
          </nav>
          <div class="actions">
            <a
              href="/assets/sample-cover.svg"
              download="仕事場の表紙.svg"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >ダウンロード</a
            >
          </div>
        </div>
        <div class="body">
          <p>本文とContextBarを、同じ作業面の中で組み合わせた例です。</p>
        </div>
      </div>
      <div class="rx-surface" data-layout="standard">
        <div class="rx-context-bar">
          <nav class="rx-breadcrumb" aria-label="現在の位置と関連する操作">
            <ol>
              <li><a href="/apps/project">プロジェクト</a></li>
              <li>
                <span aria-current="page"
                  >2026-autumn-editorial-project-abcdefghijklmnopqrstuvwxyz0123456789</span
                >
              </li>
            </ol>
          </nav>
          <div class="actions">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >プロジェクトを開く</a
            >
          </div>
        </div>
        <div class="body">
          <p>空白のない識別子が届いても、操作を横へ押し出しません。</p>
        </div>
      </div>
    </div>
  </section>
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
      ><span class="label"><span class="title">右から左へ書く言語</span></span>
    </summary>
    <div class="body">
      <div dir="rtl" class="rx-context-bar">
        <nav class="rx-breadcrumb" aria-label="الموقع الحالي">
          <ol>
            <li><a href="/apps/files">المستندات</a></li>
            <li><span aria-current="page">دليل استخدام مساحة العمل</span></li>
          </ol>
        </nav>
        <div class="actions">
          <a
            href="/apps/docs"
            class="rx-button"
            data-variant="primary"
            data-size="default"
            >تحرير</a
          >
        </div>
      </div>
    </div>
  </details>
</div>
```

</details>
