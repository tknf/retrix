<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# FilterMenu

文字を入力して候補を絞り込み、選択する小さなパネルです。

## 使いどころ

- ラベル付けや担当の割り当てのように、多めの候補から打って絞り込みながら選ぶ時に使います。
- 候補が少なく、打って探す必要が無い操作は `DropdownMenu` を使います。
- フォームの欄として値を入力・選択する時は、`Select`・`Suggestion`・`Picker` など入力欄のコンポーネントを使います。

## 使い方

`FilterMenuController` を `filter-menu` として登録します。`id` は画面内で一意にし、`label` に開く操作の文言、`title` にパネルの見出し、`options` に候補を渡します。

見た目は `DropdownMenu` と同じ白いパネル（1px #bbb の枠、角丸5px、外への柔らかい影）に黒い12pxの文字で、上に一行の入力欄と同じ絞り込みの欄（1px #dedede の枠、角丸2px）、その下に灰色の小さな太字（11px）の見出しと候補を28pxの間隔で並べます。選んだ候補は太字にしてチェックを置き、ホバーした候補と矢印キーで選んでいる候補は角の無い淡い青（`--rx-option-active`、#ddeefe）に黒い文字にします。ピルで囲みません。使えない候補は文字だけを灰色にします。開閉はその場で切り替え、アニメーションはしません。中に文字の欄を持つため、メニューではなく、コンボボックス（絞り込みの欄）とリストボックス（候補）を載せたパネルにしています。パネルは標準のPopover APIで開き、開く操作に揃えて置きます。Escapeとパネルの外側を押すと閉じます。

開くと前に打った文字を消し、絞り込みの欄へ移ります。打った文字を名前に含む候補だけを残し（大文字と小文字は区別しません）、残った最初の候補を選ぶ位置にします。当てはまる候補が無い時は `emptyLabel` を出します。

`multiple` なら開いたまま選択のチェックを切り替え、そうでなければ選んだ一つにチェックを付けて閉じます。一つだけの時は、選んだ候補を選び直しても外れません。候補には `icon`・`shortcut`・`disabled` を添えられます。`shortcut` は表示だけで、キーの登録は利用側が行います。

選ぶたびに `filter-menu:select` を出します。`name` を渡すと、候補ごとに隠し入力を置き、選んだ候補の値だけをフォームで送ります。

`createLabel` を渡すと絞り込みの欄の隣に作る操作を置き、押すと `filter-menu:create` を発火し、打った文字を渡します。候補を作ってパネルの候補に加える処理と、選んだ結果の保存は利用側が行います。

JavaScriptなしでもパネルは標準のPopover APIで開閉し、初めから選んだ候補の値は送信されますが、絞り込みと選択はできません。

## キーボード

| キー                      | 動作                                                     |
| ------------------------- | -------------------------------------------------------- |
| Enter / Space（開く操作） | パネルを開き、絞り込みの欄へ移ります。                   |
| 文字                      | 候補を名前で絞り込みます。                               |
| ↓ / ↑                     | 次・前の選べる候補へ移ります。端では反対の端へ戻ります。 |
| Enter                     | 選ぶ位置の候補を選びます。                               |
| Escape                    | パネルを閉じます。                                       |

## アクセシビリティ

- 開く操作は `aria-haspopup="dialog"`・`aria-controls` を持ち、パネルは `title` を名前にした `role="dialog"` です。`iconOnly` の時は `label` を開く操作の `aria-label` にし、`icon` が無ければ▾のマークを出します。
- 開く操作の `aria-expanded` は、controllerがパネルの開閉に合わせて切り替えます。JavaScriptなしでは初期HTMLに書かず、標準のPopover APIの開閉状態をブラウザが伝えます。
- 絞り込みの欄は `role="combobox"` で、`placeholder` を `aria-label` にし、選ぶ位置の候補を `aria-activedescendant` で伝えます。
- 候補は `role="listbox"` の `option` で、選んだ状態を `aria-selected`、選べない候補を `aria-disabled` で伝えます。`multiple` の時は `aria-multiselectable="true"` を付けます。
- 日本語の変換中の矢印とEnterは、候補の移動や選択に使いません。
- `shortcut` の表記は読み上げから外します（`aria-hidden`）。

## イベント

| イベント             | 内容                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filter-menu:select` | 候補を選んだ時。`detail` は `value`（候補の値）と `selected`（選んだ後の状態）です。`multiple` では外した時に `selected` が `false` になります。 |
| `filter-menu:create` | 作る操作を押した時。`detail.query` に絞り込みの欄の文字（前後の空白を除く）を渡します。                                                          |

## API

### FilterMenu

ラベル付けや担当の割り当てのように、候補を入力して絞り込みながら選ぶ小さなパネル。見た目はDropdownMenuと同じ白いパネルだが、中に入力欄を持つので、メニューではなくコンボボックス（絞り込みの欄）とリストボックス（候補）の組み合わせにする。選ぶとfilter-menu:selectイベントを発火し、値と選んだかどうかを渡す。

| 名前              | 型                            | 既定値                         | 説明                                                                                                           |
| ----------------- | ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `id`（必須）      | `string`                      |                                | パネルと候補のidの元。画面内で一意にする。パネルは`<id>-panel`、候補の一覧は`<id>-list`になる。                |
| `label`（必須）   | `string`                      |                                | 開く操作の名前。                                                                                               |
| `title`（必須）   | `string`                      |                                | パネルの見出し（「ラベルを選ぶ」「担当を決める」など）。                                                       |
| `options`（必須） | `readonly FilterMenuOption[]` |                                | 候補。                                                                                                         |
| `multiple`        | `boolean`                     | `false`                        | 複数を選べる時（ラベル・タグ）。一つだけの時（担当）は選ぶと閉じる。                                           |
| `name`            | `string`                      |                                | 渡すと、選んだ値をこの名前の隠し入力で送る。                                                                   |
| `placeholder`     | `string`                      | `"絞り込む…"`                  | 絞り込みの欄のプレースホルダー。欄の`aria-label`にもなる。                                                     |
| `createLabel`     | `string`                      |                                | 渡すと、絞り込みの欄の隣に「新しく作る」を置き、押すとfilter-menu:createイベントを発火して入力した文字を渡す。 |
| `emptyLabel`      | `string`                      | `"当てはまる候補はありません"` | 当てはまる候補が無い時に出す文言。                                                                             |
| `icon`            | `IconName`                    |                                | 開く操作の文言の前に置くアイコン。                                                                             |
| `iconOnly`        | `boolean`                     | `false`                        | 開く操作をアイコンだけにする。iconが無ければ▾のマークを出す。labelは`aria-label`として読み上げる。             |
| `variant`         | `ButtonProps["variant"]`      | `"secondary"`                  | 開く操作の見た目。値の意味はButtonと同じ。                                                                     |
| `align`           | `"start" \| "end"`            | `"start"`                      | パネルを開く操作のどちらの端に揃えるか。endは行の末尾側に置いた操作に使う。                                    |
| `disabled`        | `boolean`                     |                                | 開く操作を押せなくする。                                                                                       |

登録するcontroller：`filter-menu`（`FilterMenuController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/keycap.css`、`components/filter-menu.css`

#### `FilterMenuOption`

| 名前            | 型         | 既定値 | 説明                                                                                             |
| --------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------ |
| `value`（必須） | `string`   |        | 選んだ時に発火する`filter-menu:select`の`detail.value`に入る値。nameがあれば送信する値にもなる。 |
| `label`（必須） | `string`   |        | 候補の名前。絞り込みは、入力した文字をこの名前に含むかで決める（大文字と小文字は区別しない）。   |
| `icon`          | `IconName` |        | 選択マークの代わりに前に置くアイコン。渡すと、選択マークは行の末尾に出す。                       |
| `shortcut`      | `string`   |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                                           |
| `selected`      | `boolean`  |        | 最初から選んでおく。                                                                             |
| `disabled`      | `boolean`  |        | 選べない候補にする。矢印の移動でも飛ばす。                                                       |

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

#### `ButtonProps`

[Button](button.md)のpropsと同じです。

## コード

```tsx
import { FilterMenu, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <FilterMenu
        id="label-menu"
        label="ラベル"
        icon="layers"
        title="ラベルを選ぶ"
        multiple
        name="labels"
        createLabel="新しく作る"
        options={[
          { value: "guide", label: "案内", selected: true },
          { value: "invoice", label: "請求" },
          { value: "event", label: "イベント" },
          { value: "later", label: "あとで読む" },
        ]}
      />
      <FilterMenu
        id="assign-menu"
        label="担当"
        title="担当を決める"
        name="assignee"
        options={[
          { value: "me", label: "自分", shortcut: "M", selected: true },
          { value: "tanaka", label: "田中 遥" },
          { value: "sato", label: "佐藤 健" },
          { value: "mori", label: "森 美咲", disabled: true },
        ]}
      />
    </div>
    <DisclosureGroup label="候補と置き場所の違い">
      <Disclosure summary="候補にアイコンとキーを添える・末尾側に開く">
        <div class="rx-cluster" style="justify-content: end">
          <FilterMenu
            id="move-menu"
            label="移動"
            title="移動する先"
            align="end"
            options={[
              {
                value: "inbox",
                label: "受信トレイ",
                icon: "mail",
                shortcut: "1",
                selected: true,
              },
              { value: "feed", label: "お知らせ", icon: "files", shortcut: "2" },
              { value: "paper", label: "控え", icon: "file", shortcut: "3" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="当てはまる候補がない時">
        <FilterMenu
          id="empty-menu"
          label="タグ"
          title="タグを選ぶ"
          multiple
          createLabel="新しく作る"
          emptyLabel="まだタグがありません"
          options={[]}
        />
      </Disclosure>
      <Disclosure summary="使えない時・右から左に読む場合">
        <div class="rx-cluster">
          <FilterMenu
            id="disabled-menu"
            label="ラベル"
            title="ラベルを選ぶ"
            disabled
            options={[]}
          />
          <div dir="rtl" lang="ar">
            <FilterMenu
              id="rtl-menu"
              label="التسمية"
              title="اختر تسمية"
              placeholder="تصفية…"
              options={[
                { value: "a", label: "دليل", selected: true },
                { value: "b", label: "فاتورة" },
              ]}
            />
          </div>
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
  <div class="rx-cluster">
    <div
      class="rx-filter-menu"
      data-controller="filter-menu"
      data-filter-menu-multiple-value="true"
      data-align="start"
    >
      <button
        popovertarget="label-menu-panel"
        style="anchor-name: --rx-popover-6c-61-62-65-6c-2d-6d-65-6e-75"
        aria-haspopup="dialog"
        aria-controls="label-menu-panel"
        data-filter-menu-target="trigger"
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
          <use href="/assets/rx-icons.svg#rx-layers"></use></svg
        >ラベル<svg
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
        id="label-menu-panel"
        popover="auto"
        class="panel rx-overlay"
        data-placement="anchor"
        data-align="start"
        style="--rx-overlay-anchor: --rx-popover-6c-61-62-65-6c-2d-6d-65-6e-75"
        role="dialog"
        aria-labelledby="label-menu-title"
        data-filter-menu-target="panel"
        data-action="toggle-&gt;filter-menu#opened"
      >
        <div class="search">
          <span class="field"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-search"></use></svg
            ><input
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="label-menu-list"
              aria-autocomplete="list"
              aria-label="絞り込む…"
              placeholder="絞り込む…"
              autocomplete="off"
              data-filter-menu-target="input"
              data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key" /></span
          ><button
            data-action="filter-menu#create"
            class="rx-button create"
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
              <use href="/assets/rx-icons.svg#rx-plus"></use></svg
            >新しく作る
          </button>
        </div>
        <p class="title" id="label-menu-title">ラベルを選ぶ</p>
        <ul
          class="options"
          id="label-menu-list"
          role="listbox"
          aria-labelledby="label-menu-title"
          aria-multiselectable="true"
        >
          <li
            id="label-menu-option-0"
            class="option"
            role="option"
            aria-selected="true"
            data-selected="true"
            data-value="guide"
            data-label="案内"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">案内</span
            ><input type="hidden" name="labels" value="guide" />
          </li>
          <li
            id="label-menu-option-1"
            class="option"
            role="option"
            aria-selected="false"
            data-selected="false"
            data-value="invoice"
            data-label="請求"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">請求</span
            ><input type="hidden" name="labels" value="invoice" disabled="" />
          </li>
          <li
            id="label-menu-option-2"
            class="option"
            role="option"
            aria-selected="false"
            data-selected="false"
            data-value="event"
            data-label="イベント"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">イベント</span
            ><input type="hidden" name="labels" value="event" disabled="" />
          </li>
          <li
            id="label-menu-option-3"
            class="option"
            role="option"
            aria-selected="false"
            data-selected="false"
            data-value="later"
            data-label="あとで読む"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">あとで読む</span
            ><input type="hidden" name="labels" value="later" disabled="" />
          </li>
        </ul>
        <p class="empty" data-filter-menu-target="empty" hidden="">
          当てはまる候補はありません
        </p>
      </div>
    </div>
    <div
      class="rx-filter-menu"
      data-controller="filter-menu"
      data-filter-menu-multiple-value="false"
      data-align="start"
    >
      <button
        popovertarget="assign-menu-panel"
        style="anchor-name: --rx-popover-61-73-73-69-67-6e-2d-6d-65-6e-75"
        aria-haspopup="dialog"
        aria-controls="assign-menu-panel"
        data-filter-menu-target="trigger"
        class="rx-button"
        type="button"
        data-variant="secondary"
        data-size="default"
      >
        担当<svg
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
        id="assign-menu-panel"
        popover="auto"
        class="panel rx-overlay"
        data-placement="anchor"
        data-align="start"
        style="--rx-overlay-anchor: --rx-popover-61-73-73-69-67-6e-2d-6d-65-6e-75"
        role="dialog"
        aria-labelledby="assign-menu-title"
        data-filter-menu-target="panel"
        data-action="toggle-&gt;filter-menu#opened"
      >
        <div class="search">
          <span class="field"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-search"></use></svg
            ><input
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="assign-menu-list"
              aria-autocomplete="list"
              aria-label="絞り込む…"
              placeholder="絞り込む…"
              autocomplete="off"
              data-filter-menu-target="input"
              data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key"
          /></span>
        </div>
        <p class="title" id="assign-menu-title">担当を決める</p>
        <ul
          class="options"
          id="assign-menu-list"
          role="listbox"
          aria-labelledby="assign-menu-title"
        >
          <li
            id="assign-menu-option-0"
            class="option"
            role="option"
            aria-selected="true"
            data-selected="true"
            data-value="me"
            data-label="自分"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">自分</span
            ><span
              aria-hidden="true"
              class="rx-keycap shortcut"
              data-size="small"
              data-inverse="true"
              ><kbd>M</kbd></span
            ><input type="hidden" name="assignee" value="me" />
          </li>
          <li
            id="assign-menu-option-1"
            class="option"
            role="option"
            aria-selected="false"
            data-selected="false"
            data-value="tanaka"
            data-label="田中 遥"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">田中 遥</span
            ><input type="hidden" name="assignee" value="tanaka" disabled="" />
          </li>
          <li
            id="assign-menu-option-2"
            class="option"
            role="option"
            aria-selected="false"
            data-selected="false"
            data-value="sato"
            data-label="佐藤 健"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">佐藤 健</span
            ><input type="hidden" name="assignee" value="sato" disabled="" />
          </li>
          <li
            id="assign-menu-option-3"
            class="option"
            role="option"
            aria-selected="false"
            aria-disabled="true"
            data-selected="false"
            data-disabled="true"
            data-value="mori"
            data-label="森 美咲"
            data-filter-menu-target="option"
            data-action="click-&gt;filter-menu#choose"
          >
            <span class="mark" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
            ><span class="label">森 美咲</span
            ><input type="hidden" name="assignee" value="mori" disabled="" />
          </li>
        </ul>
        <p class="empty" data-filter-menu-target="empty" hidden="">
          当てはまる候補はありません
        </p>
      </div>
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="候補と置き場所の違い">
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
          ><span class="title">候補にアイコンとキーを添える・末尾側に開く</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-cluster" style="justify-content: end">
          <div
            class="rx-filter-menu"
            data-controller="filter-menu"
            data-filter-menu-multiple-value="false"
            data-align="end"
          >
            <button
              popovertarget="move-menu-panel"
              style="anchor-name: --rx-popover-6d-6f-76-65-2d-6d-65-6e-75"
              aria-haspopup="dialog"
              aria-controls="move-menu-panel"
              data-filter-menu-target="trigger"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              移動<svg
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
              id="move-menu-panel"
              popover="auto"
              class="panel rx-overlay"
              data-placement="anchor"
              data-align="end"
              style="--rx-overlay-anchor: --rx-popover-6d-6f-76-65-2d-6d-65-6e-75"
              role="dialog"
              aria-labelledby="move-menu-title"
              data-filter-menu-target="panel"
              data-action="toggle-&gt;filter-menu#opened"
            >
              <div class="search">
                <span class="field"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-search"></use></svg
                  ><input
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="move-menu-list"
                    aria-autocomplete="list"
                    aria-label="絞り込む…"
                    placeholder="絞り込む…"
                    autocomplete="off"
                    data-filter-menu-target="input"
                    data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key"
                /></span>
              </div>
              <p class="title" id="move-menu-title">移動する先</p>
              <ul
                class="options"
                id="move-menu-list"
                role="listbox"
                aria-labelledby="move-menu-title"
              >
                <li
                  id="move-menu-option-0"
                  class="option"
                  role="option"
                  aria-selected="true"
                  data-selected="true"
                  data-value="inbox"
                  data-label="受信トレイ"
                  data-filter-menu-target="option"
                  data-action="click-&gt;filter-menu#choose"
                >
                  <span class="mark" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
                  ><span class="label">受信トレイ</span
                  ><span
                    aria-hidden="true"
                    class="rx-keycap shortcut"
                    data-size="small"
                    data-inverse="true"
                    ><kbd>1</kbd></span
                  ><span class="check" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-check"></use></svg
                  ></span>
                </li>
                <li
                  id="move-menu-option-1"
                  class="option"
                  role="option"
                  aria-selected="false"
                  data-selected="false"
                  data-value="feed"
                  data-label="お知らせ"
                  data-filter-menu-target="option"
                  data-action="click-&gt;filter-menu#choose"
                >
                  <span class="mark" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-files"></use></svg></span
                  ><span class="label">お知らせ</span
                  ><span
                    aria-hidden="true"
                    class="rx-keycap shortcut"
                    data-size="small"
                    data-inverse="true"
                    ><kbd>2</kbd></span
                  ><span class="check" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-check"></use></svg
                  ></span>
                </li>
                <li
                  id="move-menu-option-2"
                  class="option"
                  role="option"
                  aria-selected="false"
                  data-selected="false"
                  data-value="paper"
                  data-label="控え"
                  data-filter-menu-target="option"
                  data-action="click-&gt;filter-menu#choose"
                >
                  <span class="mark" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-file"></use></svg></span
                  ><span class="label">控え</span
                  ><span
                    aria-hidden="true"
                    class="rx-keycap shortcut"
                    data-size="small"
                    data-inverse="true"
                    ><kbd>3</kbd></span
                  ><span class="check" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-check"></use></svg
                  ></span>
                </li>
              </ul>
              <p class="empty" data-filter-menu-target="empty" hidden="">
                当てはまる候補はありません
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
        ><span class="label"><span class="title">当てはまる候補がない時</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-filter-menu"
          data-controller="filter-menu"
          data-filter-menu-multiple-value="true"
          data-align="start"
        >
          <button
            popovertarget="empty-menu-panel"
            style="anchor-name: --rx-popover-65-6d-70-74-79-2d-6d-65-6e-75"
            aria-haspopup="dialog"
            aria-controls="empty-menu-panel"
            data-filter-menu-target="trigger"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            タグ<svg
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
            id="empty-menu-panel"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            data-align="start"
            style="--rx-overlay-anchor: --rx-popover-65-6d-70-74-79-2d-6d-65-6e-75"
            role="dialog"
            aria-labelledby="empty-menu-title"
            data-filter-menu-target="panel"
            data-action="toggle-&gt;filter-menu#opened"
          >
            <div class="search">
              <span class="field"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-search"></use></svg
                ><input
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="empty-menu-list"
                  aria-autocomplete="list"
                  aria-label="絞り込む…"
                  placeholder="絞り込む…"
                  autocomplete="off"
                  data-filter-menu-target="input"
                  data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key" /></span
              ><button
                data-action="filter-menu#create"
                class="rx-button create"
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
                  <use href="/assets/rx-icons.svg#rx-plus"></use></svg
                >新しく作る
              </button>
            </div>
            <p class="title" id="empty-menu-title">タグを選ぶ</p>
            <ul
              class="options"
              id="empty-menu-list"
              role="listbox"
              aria-labelledby="empty-menu-title"
              aria-multiselectable="true"
            ></ul>
            <p class="empty" data-filter-menu-target="empty" hidden="">
              まだタグがありません
            </p>
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
          ><span class="title">使えない時・右から左に読む場合</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <div
            class="rx-filter-menu"
            data-controller="filter-menu"
            data-filter-menu-multiple-value="false"
            data-align="start"
          >
            <button
              popovertarget="disabled-menu-panel"
              style="anchor-name: --rx-popover-64-69-73-61-62-6c-65-64-2d-6d-65-6e-75"
              aria-haspopup="dialog"
              aria-controls="disabled-menu-panel"
              data-filter-menu-target="trigger"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
              disabled=""
            >
              ラベル<svg
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
              id="disabled-menu-panel"
              popover="auto"
              class="panel rx-overlay"
              data-placement="anchor"
              data-align="start"
              style="
                --rx-overlay-anchor: --rx-popover-64-69-73-61-62-6c-65-64-2d-6d-65-6e-75;
              "
              role="dialog"
              aria-labelledby="disabled-menu-title"
              data-filter-menu-target="panel"
              data-action="toggle-&gt;filter-menu#opened"
            >
              <div class="search">
                <span class="field"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-search"></use></svg
                  ><input
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="disabled-menu-list"
                    aria-autocomplete="list"
                    aria-label="絞り込む…"
                    placeholder="絞り込む…"
                    autocomplete="off"
                    data-filter-menu-target="input"
                    data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key"
                /></span>
              </div>
              <p class="title" id="disabled-menu-title">ラベルを選ぶ</p>
              <ul
                class="options"
                id="disabled-menu-list"
                role="listbox"
                aria-labelledby="disabled-menu-title"
              ></ul>
              <p class="empty" data-filter-menu-target="empty" hidden="">
                当てはまる候補はありません
              </p>
            </div>
          </div>
          <div dir="rtl" lang="ar">
            <div
              class="rx-filter-menu"
              data-controller="filter-menu"
              data-filter-menu-multiple-value="false"
              data-align="start"
            >
              <button
                popovertarget="rtl-menu-panel"
                style="anchor-name: --rx-popover-72-74-6c-2d-6d-65-6e-75"
                aria-haspopup="dialog"
                aria-controls="rtl-menu-panel"
                data-filter-menu-target="trigger"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                التسمية<svg
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
                id="rtl-menu-panel"
                popover="auto"
                class="panel rx-overlay"
                data-placement="anchor"
                data-align="start"
                style="--rx-overlay-anchor: --rx-popover-72-74-6c-2d-6d-65-6e-75"
                role="dialog"
                aria-labelledby="rtl-menu-title"
                data-filter-menu-target="panel"
                data-action="toggle-&gt;filter-menu#opened"
              >
                <div class="search">
                  <span class="field"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-search"></use></svg
                    ><input
                      type="text"
                      role="combobox"
                      aria-expanded="true"
                      aria-controls="rtl-menu-list"
                      aria-autocomplete="list"
                      aria-label="تصفية…"
                      placeholder="تصفية…"
                      autocomplete="off"
                      data-filter-menu-target="input"
                      data-action="input-&gt;filter-menu#filter keydown-&gt;filter-menu#key"
                  /></span>
                </div>
                <p class="title" id="rtl-menu-title">اختر تسمية</p>
                <ul
                  class="options"
                  id="rtl-menu-list"
                  role="listbox"
                  aria-labelledby="rtl-menu-title"
                >
                  <li
                    id="rtl-menu-option-0"
                    class="option"
                    role="option"
                    aria-selected="true"
                    data-selected="true"
                    data-value="a"
                    data-label="دليل"
                    data-filter-menu-target="option"
                    data-action="click-&gt;filter-menu#choose"
                  >
                    <span class="mark" aria-hidden="true"
                      ><svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
                    ><span class="label">دليل</span>
                  </li>
                  <li
                    id="rtl-menu-option-1"
                    class="option"
                    role="option"
                    aria-selected="false"
                    data-selected="false"
                    data-value="b"
                    data-label="فاتورة"
                    data-filter-menu-target="option"
                    data-action="click-&gt;filter-menu#choose"
                  >
                    <span class="mark" aria-hidden="true"
                      ><svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-check"></use></svg></span
                    ><span class="label">فاتورة</span>
                  </li>
                </ul>
                <p class="empty" data-filter-menu-target="empty" hidden="">
                  当てはまる候補はありません
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
