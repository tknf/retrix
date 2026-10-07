<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ActionTile

塗りつぶしのアイコンと名前を縦に並べたタイルです。リンクや操作をグリッドに並べます。

## 使いどころ

- よく使う画面へのショートカットや、選んだ項目への一括操作を、アイコンと名前で格子に並べる時に使います。`CommandMenu` の上段のショートカットと、`Table` の `selectionActions` の一括操作もこのタイルです。
- 画面の下に浮かぶ操作バーにする時は、タイルを並べる `ActionDock` を使います。
- 文の流れの中やフォームの末尾に置く一つの操作は `Button` を使います。

## 使い方

`label` と `icon` は必須です。アイコンは塗りつぶしで上、名前は下に置きます。`href` を渡すと移動のリンク（`current` で今いる場所）、渡さなければ `type="button"` のボタンになり、`onclick` や `data-*` で操作を結び付けます。残りの標準の属性は `a` または `button` に渡ります。

`accent` は `blue`（既定）・`green`・`amber`・`coral` で、アイコンの色と、ホバー時の淡い背景色が変わります。

普段は影のない平らな淡い面で、ホバーするとアイコンの色を淡く敷き、押すと内側へへこみます。`disabled` はリンクなら移動しない要素（`href` の無い `span`）、ボタンなら押せない状態にし、どちらも半透明にします。

`shortcut` は `Keycap` の小さい形で、アイコンの末尾側の上に添えます。キーの登録は利用側が行います。`badge` は `Badge` の小さい形で、アイコンの上に重ねます。バッジがある時は、ショートカットキーの表示をタイルの末尾側の角へ寄せます。

タイルはセルいっぱいに広がるので、並べ方と列数は置く側の格子が決めます。名前は語の途中で切らず、文節の切れ目で折り返します。

文字の指定（書体・大きさ・太さ・行高）は `action-tile.css` が持ちます。共通の `Button` とは別の専用の操作として、文字位置の検査に登録しています。

## アクセシビリティ

- リンクは `a`、操作は `button` なので、標準のキー操作で押せます。`current` のリンクは `aria-current="page"` を持ちます。
- `disabled` のリンクは `role="link"`・`aria-disabled="true"` の `span` になり、フォーカスできません。リンクだけの属性（`target`・`rel` など）と `tabindex` は外し、`aria-description` などほかの属性は保ちます。
- `shortcut` の表記は読み上げから外します（`aria-hidden`）。`badge` の文字は名前の前に続けて読み上げます。
- 強制カラーモードでは、タイルに枠を引きます。

## API

### ActionTile

塗りつぶしのアイコンを上・名前を下に置いた、格子に並べるリンクや操作のタイル。 CommandMenuのリンクやTableの一括操作に使う。hrefを渡すと移動のリンク、渡さなければボタンになる。

| 名前               | 型         | 既定値 | 説明                                                                                                                                                                                                                  |
| ------------------ | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）    | `string`   |        | 名前。アイコンの下に置き、長い時は文節の切れ目で折り返す。                                                                                                                                                            |
| `icon`（必須）     | `IconName` |        | 塗りつぶしで上に置くアイコン。                                                                                                                                                                                        |
| `accent`           | `Accent`   |        | アイコンの色。既定は青。                                                                                                                                                                                              |
| `disabled`         | `boolean`  |        | 使えない状態にする。リンクは`href`を外して移動しない状態（`aria-disabled`）にし、ボタンは押せなくする。移動しないリンクはTabで止まらず、リンクだけの属性（`target`・`rel`など）と`tabindex`を外し、ほかの属性は保つ。 |
| `class`            | `string`   |        | ルートに追加するクラス。`rx-action-tile`は常に付く。                                                                                                                                                                  |
| `shortcut`         | `string`   |        | 表示用のショートカットキー。Keycapの小さい形で、アイコンの末尾側の上に添える。登録は利用側で行う。                                                                                                                    |
| `badge`            | `string`   |        | 状態バッジ（「下書き」など）。Badgeの小さい形で、アイコンの上に重ねる。                                                                                                                                               |
| `href`（形による） | `string`   |        | 移動先。渡すとリンクになり、渡さなければ`type="button"`のボタンになる。                                                                                                                                               |
| `current`          | `boolean`  |        | 今いる場所へのリンクとして`aria-current="page"`を付ける。                                                                                                                                                             |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/badge.css`、`components/action-tile.css`、`components/icon.css`、`components/keycap.css`

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

## コード

```tsx
import { ActionTile, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
// セルは5〜7.5remで、入る数だけ並べる（文字を大きくした狭い画面では一列になる）。
const grid =
  "display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem)); gap: 0.75rem";
export default () => (
  <div class="rx-stack">
    <div style={grid}>
      <ActionTile href="/" label="カタログ" icon="grid" accent="green" current />
      <ActionTile href="/components/field" label="入力" icon="pencil" />
      <ActionTile
        href="/apps/schedule?view=year"
        label="予定"
        icon="calendar"
        accent="amber"
      />
      <ActionTile href="/components/toast" label="通知" icon="mail" accent="coral" />
    </div>
    <DisclosureGroup label="操作・キーとバッジ・使えない状態・長い名前・右から左">
      <Disclosure summary="ボタンとして押す操作">
        <div style={grid}>
          <ActionTile label="公開する" icon="check" />
          <ActionTile label="複製する" icon="files" accent="amber" />
          <ActionTile label="削除する" icon="trash" accent="coral" />
        </div>
      </Disclosure>
      <Disclosure summary="ショートカットキーの表示と状態バッジを添える">
        <div style={grid}>
          <ActionTile label="今すぐ返信" icon="reply" shortcut="R" badge="下書き" />
          <ActionTile label="あとで返信" icon="clock" shortcut="L" />
          <ActionTile label="取っておく" icon="layers" accent="green" shortcut="A" />
          <ActionTile href="/apps/search" label="検索" icon="search" shortcut="⌘K" />
        </div>
      </Disclosure>
      <Disclosure summary="使えないリンクと操作">
        <div style={grid}>
          <ActionTile href="/apps/search" label="報告" icon="chart" disabled />
          <ActionTile label="書き出す" icon="file" disabled />
        </div>
      </Disclosure>
      <Disclosure summary="名前が長い時は文節で折り返す">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 6rem)); gap: 0.75rem">
          <ActionTile label="下書きに戻す" icon="pencil" />
          <ActionTile label="分類をつける" icon="layers" accent="green" />
          <ActionTile label="ファイルを送る" icon="files" accent="amber" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div style={grid} dir="rtl" lang="ar">
          <ActionTile label="رد" icon="reply" shortcut="R" badge="مسودة" />
          <ActionTile label="لاحقًا" icon="clock" shortcut="L" />
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
    style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem));
      gap: 0.75rem;
    "
  >
    <a class="rx-action-tile" data-accent="green" href="/" aria-current="page"
      ><span class="icon"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-grid-fill"></use></svg></span
      ><span class="name">カタログ</span></a
    ><a class="rx-action-tile" href="/components/field"
      ><span class="icon"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
      ><span class="name">入力</span></a
    ><a class="rx-action-tile" data-accent="amber" href="/apps/schedule?view=year"
      ><span class="icon"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
      ><span class="name">予定</span></a
    ><a class="rx-action-tile" data-accent="coral" href="/components/toast"
      ><span class="icon"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg></span
      ><span class="name">通知</span></a
    >
  </div>
  <div
    class="rx-disclosure-group"
    role="group"
    aria-label="操作・キーとバッジ・使えない状態・長い名前・右から左"
  >
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
        ><span class="label"><span class="title">ボタンとして押す操作</span></span>
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem));
            gap: 0.75rem;
          "
        >
          <button type="button" class="rx-action-tile">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check-fill"></use></svg></span
            ><span class="name">公開する</span></button
          ><button type="button" class="rx-action-tile" data-accent="amber">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
            ><span class="name">複製する</span></button
          ><button type="button" class="rx-action-tile" data-accent="coral">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-trash-fill"></use></svg></span
            ><span class="name">削除する</span>
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
          ><span class="title">ショートカットキーの表示と状態バッジを添える</span></span
        >
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem));
            gap: 0.75rem;
          "
        >
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
            ></button
          ><button type="button" class="rx-action-tile">
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
            ></button
          ><button type="button" class="rx-action-tile" data-accent="green">
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
            ></button
          ><a class="rx-action-tile" href="/apps/search"
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
              ><kbd>⌘K</kbd></span
            ></a
          >
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
        ><span class="label"><span class="title">使えないリンクと操作</span></span>
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem));
            gap: 0.75rem;
          "
        >
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
                <use href="/assets/rx-icons.svg#rx-chart-fill"></use></svg></span
            ><span class="name">報告</span></span
          ><button type="button" class="rx-action-tile" disabled="">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file-fill"></use></svg></span
            ><span class="name">書き出す</span>
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
          ><span class="title">名前が長い時は文節で折り返す</span></span
        >
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 6rem));
            gap: 0.75rem;
          "
        >
          <button type="button" class="rx-action-tile">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
            ><span class="name">下書きに戻す</span></button
          ><button type="button" class="rx-action-tile" data-accent="green">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
            ><span class="name">分類をつける</span></button
          ><button type="button" class="rx-action-tile" data-accent="amber">
            <span class="icon"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
            ><span class="name">ファイルを送る</span>
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 7.5rem));
            gap: 0.75rem;
          "
          dir="rtl"
          lang="ar"
        >
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
                >مسودة</span
              ></span
            ><span class="name">رد</span
            ><span aria-hidden="true" class="rx-keycap shortcut" data-size="small"
              ><kbd>R</kbd></span
            ></button
          ><button type="button" class="rx-action-tile">
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
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
