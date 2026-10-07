<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# CommandMenu

ヘッダーの末尾側に置く検索欄から開き、アプリ全体の移動先と操作を名前で探します。

## 使いどころ

- アプリ全体の移動先と操作を一か所から探す検索として、`AppShell`の`commands`に一つ置きます。ヘッダーの末尾側、主な移動先の後ろに並びます。
- よく使う場所は`shortcuts`のタイル、最近の場所・人・ページ・操作は`groups`の一覧に分けて渡します。
- 画面の中の一つの対象に対する操作の一覧は`DropdownMenu`、同じ領域のページの切り替えは`Navigation`、作業面の中の階層は`Tree`を使います。
- 開閉のキー（`shortcut`）は、アプリ全体で一つの`CommandMenu`だけに指定します。

## 使い方

`id`・`label`・`shortcuts`・`groups`を渡し、`CommandMenuController`を`command-menu`として登録します。`label`は開くボタンとパネルの見出しに出す名前です。開くボタンは、枠のある白い検索欄の見た目にします。上の枠を少し濃くした沈んだ欄に、`icon`（既定は`layers`）と灰色の`label`を先頭から並べ、16rem以上の幅を取ります。パネルを開いている間は、欄にフォーカスがある時と同じ青緑の枠と淡い青の輪を付けます。

開くボタンを押すと、背景を暗転しない`popover="auto"`のパネルを開きます。パネルは輪郭と影を持つ白いパネル（角丸4px、幅30remまで）で、画面の上端から1remの位置の中央に、上端の中央から少し大きくなりながら現れます。中は見出し、`shortcuts`のタイル（`columns`の列数、既定は4列で、パネルが狭い時は2列）、検索欄、候補の一覧、キーの案内の順です。候補はまとまりごとに小さな灰色の太字の見出しを置き、まとまりの間を罫線で区切ります。ホバーした候補と矢印キーで選んでいる候補は、`DropdownMenu`と同じく青緑で塗って白い文字にします。開くたびに検索欄を空にして全候補を出し、検索欄へフォーカスを移します。先頭の候補を選んだ状態で始まります。移動や操作の項目を選ぶ、閉じるボタンかEscを押す、パネルの外を押す、フォーカスがパネルの外へ移る、のいずれかで閉じます。Turboのキャッシュの直前（`turbo:before-cache`）にも閉じます。

検索欄の文字は、各項目の`label`・`description`・`keywords`をつないだ文字列と照合します。空白で区切った語をすべて含む項目だけを残し、全角と半角、大文字と小文字は区別しません。項目の残らないグループは隠し、一件も残らなければ「見つかりませんでした。」を出します。`shortcuts`は絞り込みの対象外です。

`groups`の項目は、`href`を渡すと移動のリンク、`value`を渡すと操作のボタンになります。移動は通常のリンクとして画面を移ります。操作を選ぶとパネルを閉じて開くボタンへフォーカスを戻し、`command-menu:select`を発火して`detail.value`を渡します。操作の実行は利用側のcontrollerが担い、`action`に`command-menu:select->（controller名）#（メソッド名）`の形で受け取り先を書きます。

`shortcut`を指定すると、ページのどこからでもそのキーで開閉し、パネルの下にキーの案内を出します。`shift+j`は入力欄・テキストエリア・選択欄・編集できる要素の中では働かず、`mod+k`は入力中も働きます。どちらも、Altを押している時、キーを押し続けた繰り返し、日本語の変換中、開くボタンが無効か表示されていない時は働きません。開いている時に押すと閉じて、開くボタンへフォーカスを戻します。

JavaScriptなしでも、開くボタンと閉じるボタンは`popovertarget`でパネルを開閉し、ショートカットと移動の項目は通常のリンクとして動作します。絞り込み、矢印キーの選択、操作の項目の実行、開閉のキーはcontrollerが担います。

## キーボード

| キー           | 動作                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Ctrl+K / Cmd+K | `shortcut="mod+k"`の時、ページのどこからでもパネルを開閉します。入力中も働きます。                                               |
| Shift+J        | `shortcut="shift+j"`の時、入力欄の外でパネルを開閉します。                                                                       |
| ↓ / ↑          | 検索欄か候補の中で、次・前の候補を選びます。無効な項目は飛ばし、端で止まります。候補の中では、選んだ候補へフォーカスも移ります。 |
| Home / End     | 候補の中で、先頭・末尾の候補を選びます。検索欄では文字の移動のままです。                                                         |
| Enter          | 検索欄で、選んでいる候補を実行します。リンクは移動し、操作は`command-menu:select`を発火します。日本語の変換中は実行しません。    |
| Esc            | パネルを閉じ、開くボタンへフォーカスを戻します。                                                                                 |
| Tab            | パネルの中の閉じるボタン・ショートカット・検索欄・候補を順に移ります。パネルの外へ出ると閉じます。                               |

## アクセシビリティ

- 開くボタンは`aria-haspopup="dialog"`・`aria-controls`・`aria-expanded`を持ちます。`shortcut`を指定すると、`aria-keyshortcuts`でキーを伝えます。
- パネルは`role="dialog"`で、「（`label`）のコマンド」という読み上げ名を持ちます。ショートカットの並びは「よく使う場所」という読み上げ名の`nav`です。
- 検索欄は`role="combobox"`、候補の一覧は`role="tree"`、各項目は`role="treeitem"`です。フォーカスを検索欄に残したまま、選んでいる候補を`aria-activedescendant`と`aria-selected`で伝えます。
- 絞り込むたびに、候補の件数を`role="status"`で読み上げます。
- 現在地の項目は`aria-current="page"`と「現在地」の読み上げで伝えます。無効な項目は`aria-disabled="true"`です。
- `description`は、一覧の移動の項目では名前の後に表示し、操作の項目とショートカットのタイルでは画面に出さず`aria-description`で読み上げます（無効なショートカットでも保ちます）。見える名前だけで選べるようにし、欠かせない情報を`description`だけに置きません。

## イベント

| イベント              | 内容                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `command-menu:select` | `value`を持つ操作の項目を選んだ時に、ルートから発火します。`detail.value`は項目の`value`です。 |

## API

### CommandMenu

主要なショートカットと、仕事・人・ページへの移動を一つの場所へまとめる。

| 名前                | 型                        | 既定値     | 説明                                                                                                                                                                   |
| ------------------- | ------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）        | `string`                  |            | パネルのid。開くボタンのpopovertargetと、検索欄・結果の各idの元になる。ページ内で一意にする。                                                                          |
| `label`（必須）     | `string`                  |            | 開くボタンとパネルの見出しに出す名前（チーム名・アプリ名など）。パネルの読み上げ名にも使う。                                                                           |
| `shortcuts`（必須） | `readonly CommandLink[]`  |            | 検索欄の上にグリッドで並べる主要なショートカット。空にするとショートカットの段を出さない。                                                                             |
| `groups`（必須）    | `readonly CommandGroup[]` |            | 検索欄の下に並べる候補のグループ（最近の場所・人・ページ・操作など）。検索でこの中を絞り込む。                                                                         |
| `columns`           | `3 \| 4`                  | `4`        | ショートカットの段の列数。パネルが狭い時は2列にする。                                                                                                                  |
| `icon`              | `IconName`                | `"layers"` | 開くボタンの名前の前のアイコン。                                                                                                                                       |
| `shortcut`          | `"shift+j" \| "mod+k"`    |            | 開閉のキー。shift+jはShift+J、mod+kはCtrlまたはCmdとKで開閉し、パネルの下にキーの案内を出す。省略するとキーを登録しない。アプリ全体で一つのCommandMenuだけに指定する。 |
| `action`            | `string`                  |            | ルートのdata-action。command-menu:selectを受け取るcontrollerのアクションを書く。                                                                                       |

登録するcontroller：`command-menu`（`CommandMenuController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/command-menu.css`、`components/badge.css`、`components/button.css`、`components/action-tile.css`、`components/overlay.css`、`components/icon.css`、`components/input-group.css`、`components/keycap.css`

#### `CommandLink`

| 名前            | 型                                        | 既定値 | 説明                                                                                                                                                                     |
| --------------- | ----------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                                  |        | 項目の名前。一覧の項目では検索の対象になる。                                                                                                                             |
| `description`   | `string`                                  |        | 名前に添える補足。一覧の移動の項目では名前の後に表示し、操作の項目とショートカットのタイルでは画面に出さずaria-descriptionで読み上げる。一覧の項目では検索の対象になる。 |
| `icon`          | `IconName`                                |        | 名前の前のアイコン。移動の項目とショートカットで省略すると矢印のアイコンになる。操作の項目で省略するとアイコンを出さない。                                               |
| `keywords`      | `readonly string[]`                       |        | 画面には出さない検索語。別名や関連語を渡すと、その言葉でも絞り込める。                                                                                                   |
| `disabled`      | `boolean`                                 |        | 選べない状態で表示する。リンクは移動せず、操作は押せず、矢印キーの移動の対象から外す。理由は名前や補足で伝える。                                                         |
| `accent`        | `"blue" \| "green" \| "amber" \| "coral"` |        | アイコンの色。ショートカットのタイルと、一覧の移動の項目のアイコンに使う。                                                                                               |
| `href`（必須）  | `string`                                  |        | 移動先のURL。選ぶと通常のリンクとして移動し、パネルを閉じる。                                                                                                            |
| `current`       | `boolean`                                 |        | 今いる場所。aria-current="page"を付け、一覧では末尾側にチェックマークを出す。                                                                                            |

#### `CommandGroup`

| 名前            | 型                       | 既定値 | 説明                                                                                          |
| --------------- | ------------------------ | ------ | --------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                 |        | グループの見出し（「最近の場所」など）。                                                      |
| `items`（必須） | `readonly CommandItem[]` |        | グループの項目。hrefを持つ項目は移動、valueを持つ項目は操作になる。空のグループは表示しない。 |

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

#### `CommandItem`

href・currentを持つ形

| 名前            | 型                                        | 既定値 | 説明                                                                                                                                                                     |
| --------------- | ----------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                                  |        | 項目の名前。一覧の項目では検索の対象になる。                                                                                                                             |
| `description`   | `string`                                  |        | 名前に添える補足。一覧の移動の項目では名前の後に表示し、操作の項目とショートカットのタイルでは画面に出さずaria-descriptionで読み上げる。一覧の項目では検索の対象になる。 |
| `icon`          | `IconName`                                |        | 名前の前のアイコン。移動の項目とショートカットで省略すると矢印のアイコンになる。操作の項目で省略するとアイコンを出さない。                                               |
| `keywords`      | `readonly string[]`                       |        | 画面には出さない検索語。別名や関連語を渡すと、その言葉でも絞り込める。                                                                                                   |
| `disabled`      | `boolean`                                 |        | 選べない状態で表示する。リンクは移動せず、操作は押せず、矢印キーの移動の対象から外す。理由は名前や補足で伝える。                                                         |
| `accent`        | `"blue" \| "green" \| "amber" \| "coral"` |        | アイコンの色。ショートカットのタイルと、一覧の移動の項目のアイコンに使う。                                                                                               |
| `href`（必須）  | `string`                                  |        | 移動先のURL。選ぶと通常のリンクとして移動し、パネルを閉じる。                                                                                                            |
| `current`       | `boolean`                                 |        | 今いる場所。aria-current="page"を付け、一覧では末尾側にチェックマークを出す。                                                                                            |

valueを持つ形

| 名前            | 型                                        | 既定値 | 説明                                                                                                                                                                     |
| --------------- | ----------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                                  |        | 項目の名前。一覧の項目では検索の対象になる。                                                                                                                             |
| `description`   | `string`                                  |        | 名前に添える補足。一覧の移動の項目では名前の後に表示し、操作の項目とショートカットのタイルでは画面に出さずaria-descriptionで読み上げる。一覧の項目では検索の対象になる。 |
| `icon`          | `IconName`                                |        | 名前の前のアイコン。移動の項目とショートカットで省略すると矢印のアイコンになる。操作の項目で省略するとアイコンを出さない。                                               |
| `keywords`      | `readonly string[]`                       |        | 画面には出さない検索語。別名や関連語を渡すと、その言葉でも絞り込める。                                                                                                   |
| `disabled`      | `boolean`                                 |        | 選べない状態で表示する。リンクは移動せず、操作は押せず、矢印キーの移動の対象から外す。理由は名前や補足で伝える。                                                         |
| `accent`        | `"blue" \| "green" \| "amber" \| "coral"` |        | アイコンの色。ショートカットのタイルと、一覧の移動の項目のアイコンに使う。                                                                                               |
| `value`（必須） | `string`                                  |        | 操作の値。選ぶとcommand-menu:selectイベントを発火し、detail.valueで渡す。実行は利用側が担う。                                                                            |

## コード

```tsx
import { CommandMenu } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack" data-space="small" data-controller="command-demo">
    <CommandMenu
      id="command-example"
      shortcut="mod+k"
      label="Retrixの道具箱"
      action="command-menu:select->command-demo#selected"
      shortcuts={[
        { label: "カタログ", href: "/", icon: "grid", accent: "green" },
        { label: "入力", href: "/components/field", icon: "pencil", accent: "blue" },
        {
          label: "予定",
          href: "/components/calendar",
          icon: "calendar",
          accent: "amber",
        },
        {
          label: "通知",
          href: "/components/message-list",
          icon: "mail",
          accent: "coral",
        },
      ]}
      groups={[
        {
          label: "最近使ったコンポーネント",
          items: [
            {
              label: "Card",
              href: "/components/card",
              icon: "file",
              description: "内容をまとめる",
            },
            {
              label: "Table",
              href: "/components/table",
              icon: "grid",
              description: "数値や属性を比べる",
            },
            {
              label: "DatePicker",
              href: "/components/date-picker",
              icon: "calendar",
              description: "日付・期間",
              keywords: ["日付", "予定"],
            },
            {
              label: "編集できないコンポーネント（閲覧権限のみ）",
              value: "restricted",
              disabled: true,
            },
          ],
        },
        {
          label: "道具箱",
          items: [
            {
              label: "CommandMenu",
              href: "/components/command-menu",
              current: true,
              icon: "layers",
            },
            { label: "操作イベントを試す", value: "example", icon: "check" },
          ],
        },
      ]}
    />
    <output aria-live="polite">
      「操作イベントを試す」を選ぶと、受け取った値をここに表示します。
    </output>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack" data-space="small" data-controller="command-demo">
  <div
    class="rx-command-menu"
    data-controller="command-menu"
    data-action="command-menu:select-&gt;command-demo#selected"
    data-command-menu-shortcut="mod+k"
  >
    <button
      popovertarget="command-example"
      data-command-menu-target="trigger"
      aria-haspopup="dialog"
      aria-controls="command-example"
      aria-expanded="false"
      aria-keyshortcuts="Control+k Meta+k"
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
        <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg
      >Retrixの道具箱<svg
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
      class="panel"
      popover="auto"
      role="dialog"
      id="command-example"
      aria-label="Retrixの道具箱のコマンド"
      data-command-menu-target="panel"
    >
      <header class="heading">
        <span class="name">Retrixの道具箱</span
        ><button
          aria-label="コマンドを閉じる"
          popovertarget="command-example"
          popovertargetaction="hide"
          data-command-menu-target="close"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="compact"
        >
          閉じる
        </button>
      </header>
      <nav class="shortcuts" aria-label="よく使う場所" data-columns="4">
        <div class="shortcut">
          <a tabindex="0" class="rx-action-tile" data-accent="green" href="/"
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
          >
        </div>
        <div class="shortcut">
          <a
            tabindex="0"
            class="rx-action-tile"
            data-accent="blue"
            href="/components/field"
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
          >
        </div>
        <div class="shortcut">
          <a
            tabindex="0"
            class="rx-action-tile"
            data-accent="amber"
            href="/components/calendar"
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
          >
        </div>
        <div class="shortcut">
          <a
            tabindex="0"
            class="rx-action-tile"
            data-accent="coral"
            href="/components/message-list"
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
      </nav>
      <div class="search">
        <div class="rx-input-group">
          <div class="control" data-size="large">
            <span class="affix" id="command-example-search-prefix"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
            ><input
              type="search"
              role="combobox"
              aria-label="仕事・人・ページを探す"
              aria-haspopup="tree"
              aria-autocomplete="list"
              aria-controls="command-example-results"
              aria-expanded="false"
              autocomplete="off"
              autofocus=""
              placeholder="仕事・人・ページを探す…"
              data-command-menu-target="search"
              id="command-example-search"
              data-size="large"
              aria-describedby="command-example-search-prefix"
              class="rx-input"
            />
          </div>
        </div>
      </div>
      <div
        class="results"
        id="command-example-results"
        role="tree"
        aria-label="移動先・操作"
      >
        <section
          class="group"
          role="group"
          aria-labelledby="command-example-group-0"
          data-command-menu-target="group"
        >
          <h2 id="command-example-group-0">最近使ったコンポーネント</h2>
          <ul class="list" role="none">
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-0-0"
              aria-selected="false"
              data-command-menu-target="entry"
              data-search="Card 内容をまとめる"
            >
              <a class="link" href="/components/card" tabindex="0"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-file-fill"></use></svg></span
                ><span class="name">Card</span
                ><span class="context">内容をまとめる</span></a
              >
            </li>
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-0-1"
              aria-selected="false"
              data-command-menu-target="entry"
              data-search="Table 数値や属性を比べる"
            >
              <a class="link" href="/components/table" tabindex="0"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grid-fill"></use></svg></span
                ><span class="name">Table</span
                ><span class="context">数値や属性を比べる</span></a
              >
            </li>
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-0-2"
              aria-selected="false"
              data-command-menu-target="entry"
              data-search="DatePicker 日付・期間 日付 予定"
            >
              <a class="link" href="/components/date-picker" tabindex="0"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
                ><span class="name">DatePicker</span
                ><span class="context">日付・期間</span></a
              >
            </li>
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-0-3"
              aria-selected="false"
              aria-disabled="true"
              data-disabled="true"
              data-command-menu-target="entry"
              data-search="編集できないコンポーネント（閲覧権限のみ）"
            >
              <button
                data-command-value="restricted"
                class="rx-button command"
                type="button"
                data-variant="link"
                data-size="default"
                disabled=""
              >
                編集できないコンポーネント（閲覧権限のみ）
              </button>
            </li>
          </ul>
        </section>
        <section
          class="group"
          role="group"
          aria-labelledby="command-example-group-1"
          data-command-menu-target="group"
        >
          <h2 id="command-example-group-1">道具箱</h2>
          <ul class="list" role="none">
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-1-0"
              aria-selected="false"
              data-command-menu-target="entry"
              data-search="CommandMenu"
            >
              <a
                class="link"
                href="/components/command-menu"
                tabindex="0"
                aria-current="page"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg></span
                ><span class="name">CommandMenu</span
                ><span class="current"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check"></use></svg
                  ><span class="rx-visually-hidden">現在地</span></span
                ></a
              >
            </li>
            <li
              class="entry"
              role="treeitem"
              id="command-example-entry-1-1"
              aria-selected="false"
              data-command-menu-target="entry"
              data-search="操作イベントを試す"
            >
              <button
                data-command-value="example"
                class="rx-button command"
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
                  <use href="/assets/rx-icons.svg#rx-check"></use></svg
                >操作イベントを試す
              </button>
            </li>
          </ul>
        </section>
        <p class="empty" data-command-menu-target="empty" hidden="">
          見つかりませんでした。別の言葉で探してみてください。
        </p>
      </div>
      <footer class="help" aria-label="キーボード操作">
        <span class="hint"
          ><span class="rx-keycap"><kbd>↑</kbd><kbd>↓</kbd></span
          >選択</span
        ><span class="hint"
          ><span class="rx-keycap"><kbd>Enter</kbd></span
          >実行</span
        ><span class="hint"
          ><span class="rx-keycap"><kbd>Esc</kbd></span
          >閉じる</span
        ><span class="hint"
          ><span class="rx-keycap"><kbd>Ctrl / Cmd</kbd><kbd>K</kbd></span
          >開閉</span
        >
      </footer>
      <span
        class="rx-visually-hidden"
        role="status"
        data-command-menu-target="status"
      ></span>
    </div>
  </div>
  <output aria-live="polite"
    >「操作イベントを試す」を選ぶと、受け取った値をここに表示します。</output
  >
</div>
```

</details>
