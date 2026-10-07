<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# SplitButton

主な操作のボタンと、別の方法を選ぶ▾のボタンをつなげて並べます。

## 使いどころ

- 「送る」に対する「送る日時を決める」「下書きとして保存」のように、主操作に同じ目的のほかのやり方を添える時に使います。
- 主操作と関係の薄い補助の操作をまとめる時は、独立した `DropdownMenu` を使います。
- やり方に優先の順が無く、どれも同じ重みで選ぶ時は、`SplitButton` にせず操作を並べます。

## 使い方

主操作は共通の `Button`、▾は共通の `DropdownMenu` のアイコンだけの操作です。`label` が主操作の文言、`items` が▾で開くやり方で、`items` の指定は `DropdownMenu` と同じです。▾のメニューは行の末尾側に揃えて開きます。

`DropdownMenuController` を `dropdown-menu` として登録します。主操作は通常の `button` なので、controllerは要りません。

`type`・`name`・`value`・`form`・`onclick`・`busy`・`busyLabel` など、`Button` へ渡す指定は主操作へそのまま渡ります。`class` だけはルートに付きます。`id` は主操作のボタンに付け、▾のメニューは `<id>-menu`、▾の操作は `<id>-menu-trigger` になります。

`variant`・`size`・`disabled` は両方にかかります。`busy` の間は主操作を `busyLabel` に置き換え、▾も押せなくします。`variant` の既定は `primary` です。

二つの操作は見た目だけを一体にします。向き合う側の角を落とし、間に細い区切りを入れます（塗りの操作では白く透かした線、`secondary` では枠と同じ濃い灰色の線）。ホバーした側、フォーカスのある側を手前に出します。

主操作を押した時の処理は `onclick` やフォームの送信で、▾で選んだやり方は `dropdown-menu:select` の `detail.value` で受け取ります。どちらの処理も利用側が行います。

## キーボード

| キー                   | 動作                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| Tab                    | 主操作と▾は別々のTab停止点です。                                             |
| ↓ / Enter / Space（▾） | やり方のメニューを開きます。メニューの中のキーは `DropdownMenu` と同じです。 |

## アクセシビリティ

- ▾はアイコンだけの操作なので、`menuLabel` を `aria-label` として読み上げます。やり方の中身が分かる名前にします。

## イベント

| イベント                     | 内容                                                                       |
| ---------------------------- | -------------------------------------------------------------------------- |
| `dropdown-menu:beforeselect` | ▾のやり方を選ぶ直前。取り消せます。`detail` は `DropdownMenu` と同じです。 |
| `dropdown-menu:select`       | ▾のやり方を選んだ後。`detail.value` で選んだやり方を知らせます。           |

## API

### SplitButton

「送信 ▾」のように、主操作と、ほかのやり方を選ぶ▾を一つのピルにつなげた操作。主操作は共通Button、▾は共通DropdownMenuで、見た目だけを一体にする。

| 名前            | 型                    | 既定値           | 説明                                                                                                   |
| --------------- | --------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `id`（必須）    | `string`              |                  | 主操作のボタンのid。▾のメニューは`<id>-menu`、▾の操作は`<id>-menu-trigger`になる。画面内で一意にする。 |
| `label`（必須） | `string`              |                  | 主操作の文言。                                                                                         |
| `items`（必須） | `readonly MenuItem[]` |                  | ▾で開くほかのやり方（「送信の予約」「下書きとして保存」など）。                                        |
| `menuLabel`     | `string`              | `"ほかのやり方"` | ▾の操作の名前。記号だけの操作なので`aria-label`として読み上げる。                                      |

ほかのpropsは`Button`へそのまま渡します。

登録するcontroller：`dropdown-menu`（`DropdownMenuController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/dropdown-menu.css`、`components/icon.css`、`components/keycap.css`、`components/split-button.css`

#### `MenuItem`

kind: "action"

| 名前            | 型         | 既定値 | 説明                                                                                 |
| --------------- | ---------- | ------ | ------------------------------------------------------------------------------------ |
| `label`（必須） | `string`   |        | 項目名。文字を打って項目を探す時は、この名前の先頭で探す。                           |
| `disabled`      | `boolean`  |        | 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。 |
| `icon`          | `IconName` |        | 項目名の前に置くアイコン。                                                           |
| `description`   | `string`   |        | 項目名の下に添える補足。読み上げでは`aria-description`になる。                       |
| `shortcut`      | `string`   |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                               |
| `kind`          | `"action"` |        | 通常の操作。省略してもよい。                                                         |
| `value`（必須） | `string`   |        | 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。                   |
| `danger`        | `boolean`  |        | 削除など取り返しのつかない操作として、淡い赤の文字で分ける。                         |
| `closeOnSelect` | `boolean`  |        | 選んだ後に閉じるか。通常の操作は既定で閉じる。falseで開いたままにする。              |

kind: "link"

| 名前            | 型                    | 既定値 | 説明                                                                                 |
| --------------- | --------------------- | ------ | ------------------------------------------------------------------------------------ |
| `label`（必須） | `string`              |        | 項目名。文字を打って項目を探す時は、この名前の先頭で探す。                           |
| `disabled`      | `boolean`             |        | 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。 |
| `icon`          | `IconName`            |        | 項目名の前に置くアイコン。                                                           |
| `description`   | `string`              |        | 項目名の下に添える補足。読み上げでは`aria-description`になる。                       |
| `shortcut`      | `string`              |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                               |
| `kind`（必須）  | `"link"`              |        | ページの移動。選ぶと標準のページ移動を行い、選択のイベントは発火しない。             |
| `href`（必須）  | `string`              |        | 移動先。                                                                             |
| `target`        | `"_blank" \| "_self"` |        | リンクを開く場所。_blankでは`rel="noopener noreferrer"`を付ける。                    |

kind: "checkbox"

| 名前            | 型                   | 既定値 | 説明                                                                                                                                                   |
| --------------- | -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`             |        | 項目名。文字を打って項目を探す時は、この名前の先頭で探す。                                                                                             |
| `disabled`      | `boolean`            |        | 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。                                                                   |
| `icon`          | `IconName`           |        | 項目名の前に置くアイコン。                                                                                                                             |
| `description`   | `string`             |        | 項目名の下に添える補足。読み上げでは`aria-description`になる。                                                                                         |
| `shortcut`      | `string`             |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                                                                                                 |
| `kind`（必須）  | `"checkbox"`         |        | オン・オフを切り替える複数選択の項目。                                                                                                                 |
| `value`（必須） | `string`             |        | 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。                                                                                     |
| `checked`       | `boolean \| "mixed"` |        | チェックマークの初期状態。mixedは一部だけ選んだ状態。選ぶたびにcontrollerが切り替え、切り替えた後の値を`detail.checked`で渡す（mixedから選ぶとtrue）。 |
| `closeOnSelect` | `boolean`            |        | 選んだ後に閉じるか。チェックは既定で開いたまま更新する。trueで閉じる。                                                                                 |

kind: "radio"

| 名前            | 型         | 既定値 | 説明                                                                                 |
| --------------- | ---------- | ------ | ------------------------------------------------------------------------------------ |
| `label`（必須） | `string`   |        | 項目名。文字を打って項目を探す時は、この名前の先頭で探す。                           |
| `disabled`      | `boolean`  |        | 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。 |
| `icon`          | `IconName` |        | 項目名の前に置くアイコン。                                                           |
| `description`   | `string`   |        | 項目名の下に添える補足。読み上げでは`aria-description`になる。                       |
| `shortcut`      | `string`   |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                               |
| `kind`（必須）  | `"radio"`  |        | 同じnameの中から一つを選ぶ単一選択の項目。                                           |
| `value`（必須） | `string`   |        | 選んだ時に発火する`dropdown-menu:select`の`detail.value`に入る値。                   |
| `name`（必須）  | `string`   |        | 選択のまとまりの名前。同じ階層で同じnameを持つ項目から一つだけを選ぶ。               |
| `checked`       | `boolean`  |        | 最初に選んでおく項目。                                                               |
| `closeOnSelect` | `boolean`  |        | 選んだ後に閉じるか。単一選択は既定で開いたまま更新する。trueで閉じる。               |

kind: "submenu"

| 名前            | 型                    | 既定値 | 説明                                                                                 |
| --------------- | --------------------- | ------ | ------------------------------------------------------------------------------------ |
| `label`（必須） | `string`              |        | 項目名。文字を打って項目を探す時は、この名前の先頭で探す。                           |
| `disabled`      | `boolean`             |        | 選べない項目にする。矢印の移動でも飛ばす。リンクは移動せず、サブメニューは開かない。 |
| `icon`          | `IconName`            |        | 項目名の前に置くアイコン。                                                           |
| `description`   | `string`              |        | 項目名の下に添える補足。読み上げでは`aria-description`になる。                       |
| `shortcut`      | `string`              |        | 表示用の補助表記。ショートカットの登録は利用側で行う。                               |
| `kind`（必須）  | `"submenu"`           |        | 下の階層を開く項目。                                                                 |
| `items`（必須） | `readonly MenuItem[]` |        | 下の階層の項目。入れ子にできる。                                                     |

kind: "separator"

| 名前           | 型            | 既定値 | 説明       |
| -------------- | ------------- | ------ | ---------- |
| `kind`（必須） | `"separator"` |        | 区切り線。 |

kind: "group"

| 名前            | 型                    | 既定値 | 説明                                                       |
| --------------- | --------------------- | ------ | ---------------------------------------------------------- |
| `kind`（必須）  | `"group"`             |        | 見出し付きのまとまり。見出しは選べない。                   |
| `label`（必須） | `string`              |        | まとまりの見出し。中の項目の`role="group"`の名前にもなる。 |
| `items`（必須） | `readonly MenuItem[]` |        | まとまりに入れる項目。                                     |

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

## コード

```tsx
import { SplitButton, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

const items = [
  { value: "schedule", label: "送る日時を決める" },
  { value: "draft", label: "下書きとして保存" },
  { kind: "separator" as const },
  { value: "discard", label: "破棄する", danger: true },
];

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <SplitButton id="send" label="送る" items={items} />
      <SplitButton id="save" label="保存する" variant="secondary" items={items} />
    </div>
    <DisclosureGroup label="大きさと状態の違い">
      <Disclosure summary="大きさ" open>
        <div class="rx-cluster">
          <SplitButton id="send-compact" label="送る" size="compact" items={items} />
          <SplitButton id="send-large" label="送る" size="large" items={items} />
        </div>
      </Disclosure>
      <Disclosure summary="使えない時・送っている時">
        <div class="rx-cluster">
          <SplitButton id="send-disabled" label="送る" disabled items={items} />
          <SplitButton id="send-busy" label="送っています…" busy items={items} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SplitButton
            id="send-rtl"
            label="إرسال"
            items={[{ value: "draft", label: "حفظ كمسودة" }]}
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
  <div class="rx-cluster">
    <div class="rx-split-button" data-variant="primary">
      <button
        id="send"
        class="rx-button main"
        type="button"
        data-variant="primary"
        data-size="default"
      >
        送る
      </button>
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="end"
      >
        <button
          id="send-menu-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="send-menu"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="ほかのやり方"
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
          id="send-menu"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="send-menu-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="send-menu-0-item"
              role="menuitem"
              aria-label="送る日時を決める"
              data-menu-kind="action"
              data-menu-label="送る日時を決める"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="schedule"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>送る日時を決める</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="send-menu-1-item"
              role="menuitem"
              aria-label="下書きとして保存"
              data-menu-kind="action"
              data-menu-label="下書きとして保存"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="draft"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>下書きとして保存</span></span></span
                ></span
              >
            </button>
          </li>
          <li class="separator" role="separator"></li>
          <li role="none">
            <button
              id="send-menu-3-item"
              role="menuitem"
              aria-label="破棄する"
              data-menu-kind="action"
              data-menu-label="破棄する"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="discard"
              data-tone="danger"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>破棄する</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
    </div>
    <div class="rx-split-button" data-variant="secondary">
      <button
        id="save"
        class="rx-button main"
        type="button"
        data-variant="secondary"
        data-size="default"
      >
        保存する
      </button>
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="end"
      >
        <button
          id="save-menu-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="save-menu"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="ほかのやり方"
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
          id="save-menu"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="save-menu-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="save-menu-0-item"
              role="menuitem"
              aria-label="送る日時を決める"
              data-menu-kind="action"
              data-menu-label="送る日時を決める"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="schedule"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>送る日時を決める</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="save-menu-1-item"
              role="menuitem"
              aria-label="下書きとして保存"
              data-menu-kind="action"
              data-menu-label="下書きとして保存"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="draft"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>下書きとして保存</span></span></span
                ></span
              >
            </button>
          </li>
          <li class="separator" role="separator"></li>
          <li role="none">
            <button
              id="save-menu-3-item"
              role="menuitem"
              aria-label="破棄する"
              data-menu-kind="action"
              data-menu-label="破棄する"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="discard"
              data-tone="danger"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>破棄する</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="大きさと状態の違い">
    <details open="" class="rx-disclosure">
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
        ><span class="label"><span class="title">大きさ</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <div class="rx-split-button" data-variant="primary">
            <button
              id="send-compact"
              class="rx-button main"
              type="button"
              data-variant="primary"
              data-size="compact"
            >
              送る
            </button>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="end"
            >
              <button
                id="send-compact-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="send-compact-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="ほかのやり方"
                data-icon-only="true"
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
                id="send-compact-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="send-compact-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="send-compact-menu-0-item"
                    role="menuitem"
                    aria-label="送る日時を決める"
                    data-menu-kind="action"
                    data-menu-label="送る日時を決める"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="schedule"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>送る日時を決める</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li role="none">
                  <button
                    id="send-compact-menu-1-item"
                    role="menuitem"
                    aria-label="下書きとして保存"
                    data-menu-kind="action"
                    data-menu-label="下書きとして保存"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="draft"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>下書きとして保存</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li class="separator" role="separator"></li>
                <li role="none">
                  <button
                    id="send-compact-menu-3-item"
                    role="menuitem"
                    aria-label="破棄する"
                    data-menu-kind="action"
                    data-menu-label="破棄する"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="discard"
                    data-tone="danger"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>破棄する</span></span></span
                      ></span
                    >
                  </button>
                </li>
              </menu>
            </div>
          </div>
          <div class="rx-split-button" data-variant="primary">
            <button
              id="send-large"
              class="rx-button main"
              type="button"
              data-variant="primary"
              data-size="large"
            >
              送る
            </button>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="end"
            >
              <button
                id="send-large-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="send-large-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="ほかのやり方"
                data-icon-only="true"
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
                id="send-large-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="send-large-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="send-large-menu-0-item"
                    role="menuitem"
                    aria-label="送る日時を決める"
                    data-menu-kind="action"
                    data-menu-label="送る日時を決める"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="schedule"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>送る日時を決める</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li role="none">
                  <button
                    id="send-large-menu-1-item"
                    role="menuitem"
                    aria-label="下書きとして保存"
                    data-menu-kind="action"
                    data-menu-label="下書きとして保存"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="draft"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>下書きとして保存</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li class="separator" role="separator"></li>
                <li role="none">
                  <button
                    id="send-large-menu-3-item"
                    role="menuitem"
                    aria-label="破棄する"
                    data-menu-kind="action"
                    data-menu-label="破棄する"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="discard"
                    data-tone="danger"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>破棄する</span></span></span
                      ></span
                    >
                  </button>
                </li>
              </menu>
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
        ><span class="label"><span class="title">使えない時・送っている時</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <div class="rx-split-button" data-variant="primary">
            <button
              id="send-disabled"
              class="rx-button main"
              type="button"
              data-variant="primary"
              data-size="default"
              disabled=""
            >
              送る
            </button>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="end"
            >
              <button
                id="send-disabled-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="send-disabled-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="ほかのやり方"
                data-icon-only="true"
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
                id="send-disabled-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="send-disabled-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="send-disabled-menu-0-item"
                    role="menuitem"
                    aria-label="送る日時を決める"
                    data-menu-kind="action"
                    data-menu-label="送る日時を決める"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="schedule"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>送る日時を決める</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li role="none">
                  <button
                    id="send-disabled-menu-1-item"
                    role="menuitem"
                    aria-label="下書きとして保存"
                    data-menu-kind="action"
                    data-menu-label="下書きとして保存"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="draft"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>下書きとして保存</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li class="separator" role="separator"></li>
                <li role="none">
                  <button
                    id="send-disabled-menu-3-item"
                    role="menuitem"
                    aria-label="破棄する"
                    data-menu-kind="action"
                    data-menu-label="破棄する"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="discard"
                    data-tone="danger"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>破棄する</span></span></span
                      ></span
                    >
                  </button>
                </li>
              </menu>
            </div>
          </div>
          <div class="rx-split-button" data-variant="primary">
            <button
              id="send-busy"
              class="rx-button main"
              type="button"
              data-variant="primary"
              data-size="default"
              data-busy="true"
              disabled=""
              aria-busy="true"
            >
              処理中…
            </button>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="end"
            >
              <button
                id="send-busy-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="send-busy-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="ほかのやり方"
                data-icon-only="true"
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="default"
                data-busy="true"
                disabled=""
                aria-busy="true"
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
                id="send-busy-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="send-busy-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="send-busy-menu-0-item"
                    role="menuitem"
                    aria-label="送る日時を決める"
                    data-menu-kind="action"
                    data-menu-label="送る日時を決める"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="schedule"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>送る日時を決める</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li role="none">
                  <button
                    id="send-busy-menu-1-item"
                    role="menuitem"
                    aria-label="下書きとして保存"
                    data-menu-kind="action"
                    data-menu-label="下書きとして保存"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="draft"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>下書きとして保存</span></span></span
                      ></span
                    >
                  </button>
                </li>
                <li class="separator" role="separator"></li>
                <li role="none">
                  <button
                    id="send-busy-menu-3-item"
                    role="menuitem"
                    aria-label="破棄する"
                    data-menu-kind="action"
                    data-menu-label="破棄する"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="discard"
                    data-tone="danger"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>破棄する</span></span></span
                      ></span
                    >
                  </button>
                </li>
              </menu>
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <div class="rx-split-button" data-variant="primary">
            <button
              id="send-rtl"
              class="rx-button main"
              type="button"
              data-variant="primary"
              data-size="default"
            >
              إرسال
            </button>
            <div
              class="rx-dropdown-menu"
              data-controller="dropdown-menu"
              data-state="closed"
              data-align="end"
            >
              <button
                id="send-rtl-menu-trigger"
                data-dropdown-menu-target="trigger"
                aria-controls="send-rtl-menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="ほかのやり方"
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
                id="send-rtl-menu"
                class="rx-menu"
                data-dropdown-menu-target="menu"
                data-menu-panel="root"
                role="menu"
                popover="manual"
                aria-labelledby="send-rtl-menu-trigger"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="send-rtl-menu-0-item"
                    role="menuitem"
                    aria-label="حفظ كمسودة"
                    data-menu-kind="action"
                    data-menu-label="حفظ كمسودة"
                    tabindex="-1"
                    data-dropdown-menu-target="item"
                    data-dropdown-menu-value="draft"
                    class="rx-button item"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    <span class="content"
                      ><span class="heading"
                        ><span class="text"><span>حفظ كمسودة</span></span></span
                      ></span
                    >
                  </button>
                </li>
              </menu>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
