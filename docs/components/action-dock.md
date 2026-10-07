<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ActionDock

画面の下に表示する操作バーです。アイコン・名前・ショートカットキーを並べます。

## 使いどころ

- 開いている一件（スレッドや記事）に対する主な操作を、内容を読みながらいつでも押せるよう、下に浮かべて並べる時に使います。
- 格子に並べるショートカットや一括操作は、操作バーに載せずに `ActionTile` を並べます。
- 対象の近くに置く操作の並びは `Toolbar`、補助の操作をしまう時は `DropdownMenu` を使います。

## 使い方

白いパネル（角丸4px、輪郭と浮かぶパネルの影）を画面の下の中央に浮かべ、`items` の操作を `ActionTile` で横に並べます。`items` の指定は `ActionTile` と同じで、`href` があればリンク、無ければボタンになります。

操作バーの中のタイルは普段の面と枠を消して平らにし、ホバーすると淡い黄色の面を出し、押すと黄色の面で内側へへこみます。一つのタイルの幅は5.25rem以上です。

`shortcut` でショートカットキーの表示を、`badge` で「下書き」のような状態バッジをアイコンの上に重ねます。キーの登録は利用側が行います。

`placement` の `sticky`（既定）は置いた場所の下端に留め、`fixed` は画面の下に浮かべます。`fixed` では端末の下端のセーフエリアの上に置きます。操作バーは配置先の幅いっぱいの透明な枠で、中身の幅で親を押し広げません。狭い場所では横にスクロールします。

操作を押した後の処理は、各タイルの `onclick` や `data-*` で利用側が行います。

## アクセシビリティ

- 操作バーは `nav` で、`label` を名前として読み上げます。タイルは一覧（`ul`）の項目として並びます。
- 各タイルはTabキーで順にフォーカスできます。ショートカットキーの表示は読み上げから外します。
- 強制カラーモードでは、パネルに輪郭線を引きます。

## API

### ActionDock

内容の下に浮かぶ操作バー。白いパネルを画面の下の中央に浮かべ、アイコン・名前・ショートカットキーの表示を縦に積んだ操作を横に並べる。操作はActionTileで、操作バーの中では浮き上がりを消して平らにする。

| 名前            | 型                           | 既定値     | 説明                                                                           |
| --------------- | ---------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `label`（必須） | `string`                     |            | 操作バーの名前。`nav`の`aria-label`として読み上げる。                          |
| `items`（必須） | `readonly ActionTileProps[]` |            | 並べる操作。ActionTileと同じ指定で、hrefがあればリンク、無ければボタンになる。 |
| `placement`     | `"sticky" \| "fixed"`        | `"sticky"` | fixedは画面の下の中央に浮かべ、stickyは置いた場所の下端に留める（既定）。      |

ほかに、`<nav>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/badge.css`、`components/action-tile.css`、`components/icon.css`、`components/keycap.css`、`components/action-dock.css`

#### `ActionTileProps`

[ActionTile](action-tile.md)のpropsと同じです。

## コード

```tsx
import { ActionDock, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <ActionDock
      label="このスレッドの操作"
      items={[
        { label: "今すぐ返信", icon: "reply", shortcut: "R", badge: "下書き" },
        { label: "あとで返信", icon: "clock", shortcut: "L" },
        { label: "取っておく", icon: "layers", shortcut: "A" },
        { label: "浮かせる", icon: "sparkle", shortcut: "Z", accent: "coral" },
        { label: "ほかの操作", icon: "grip", shortcut: "M" },
      ]}
    />
    <DisclosureGroup label="置き方の違い">
      <Disclosure summary="移動のリンクと使えない操作">
        <ActionDock
          label="移動"
          items={[
            { label: "ピン留め", icon: "layers", href: "/", shortcut: "P" },
            { label: "検索", icon: "search", href: "/", shortcut: "K" },
            { label: "通知", icon: "bell", href: "/", shortcut: "N", disabled: true },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：横にスクロール">
        <div style="max-inline-size: 18rem">
          <ActionDock
            label="狭い場所の操作"
            items={[
              { label: "今すぐ返信", icon: "reply" },
              { label: "あとで返信", icon: "clock" },
              { label: "取っておく", icon: "layers" },
              { label: "浮かせる", icon: "sparkle" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ActionDock
            label="الإجراءات"
            items={[
              { label: "رد", icon: "reply", shortcut: "R" },
              { label: "لاحقًا", icon: "clock", shortcut: "L" },
            ]}
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
  <nav class="rx-action-dock" aria-label="このスレッドの操作" data-placement="sticky">
    <ul>
      <li>
        <button type="button" class="rx-action-tile">
          <span class="icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-reply-fill"></use></svg
            ><span class="rx-badge" data-tone="info" data-size="small"
              >下書き</span
            ></span
          ><span class="name">今すぐ返信</span
          ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
            ><kbd>R</kbd></span
          >
        </button>
      </li>
      <li>
        <button type="button" class="rx-action-tile">
          <span class="icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-clock-fill"></use></svg></span
          ><span class="name">あとで返信</span
          ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
            ><kbd>L</kbd></span
          >
        </button>
      </li>
      <li>
        <button type="button" class="rx-action-tile">
          <span class="icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
          ><span class="name">取っておく</span
          ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
            ><kbd>A</kbd></span
          >
        </button>
      </li>
      <li>
        <button type="button" class="rx-action-tile" data-accent="coral">
          <span class="icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-sparkle-fill"></use></svg></span
          ><span class="name">浮かせる</span
          ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
            ><kbd>Z</kbd></span
          >
        </button>
      </li>
      <li>
        <button type="button" class="rx-action-tile">
          <span class="icon"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-grip-fill"></use></svg></span
          ><span class="name">ほかの操作</span
          ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
            ><kbd>M</kbd></span
          >
        </button>
      </li>
    </ul>
  </nav>
  <div class="rx-disclosure-group" role="group" aria-label="置き方の違い">
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
          ><span class="title">移動のリンクと使えない操作</span></span
        >
      </summary>
      <div class="body">
        <nav class="rx-action-dock" aria-label="移動" data-placement="sticky">
          <ul>
            <li>
              <a class="rx-action-tile" href="/"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
                ><span class="name">ピン留め</span
                ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
                  ><kbd>P</kbd></span
                ></a
              >
            </li>
            <li>
              <a class="rx-action-tile" href="/"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-search-fill"></use></svg></span
                ><span class="name">検索</span
                ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
                  ><kbd>K</kbd></span
                ></a
              >
            </li>
            <li>
              <span
                class="rx-action-tile"
                data-disabled="true"
                role="link"
                aria-disabled="true"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-bell-fill"></use></svg></span
                ><span class="name">通知</span
                ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
                  ><kbd>N</kbd></span
                ></span
              >
            </li>
          </ul>
        </nav>
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
        ><span class="label"><span class="title">狭い場所：横にスクロール</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 18rem">
          <nav
            class="rx-action-dock"
            aria-label="狭い場所の操作"
            data-placement="sticky"
          >
            <ul>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-reply-fill"></use></svg></span
                  ><span class="name">今すぐ返信</span>
                </button>
              </li>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-clock-fill"></use></svg></span
                  ><span class="name">あとで返信</span>
                </button>
              </li>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
                  ><span class="name">取っておく</span>
                </button>
              </li>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use
                        href="/assets/rx-icons.svg#rx-sparkle-fill"
                      ></use></svg></span
                  ><span class="name">浮かせる</span>
                </button>
              </li>
            </ul>
          </nav>
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
          <nav class="rx-action-dock" aria-label="الإجراءات" data-placement="sticky">
            <ul>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-reply-fill"></use></svg></span
                  ><span class="name">رد</span
                  ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
                    ><kbd>R</kbd></span
                  >
                </button>
              </li>
              <li>
                <button type="button" class="rx-action-tile">
                  <span class="icon"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-clock-fill"></use></svg></span
                  ><span class="name">لاحقًا</span
                  ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
                    ><kbd>L</kbd></span
                  >
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
