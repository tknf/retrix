<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# DropdownMenu

現在の対象に関する補助の操作をまとめます。

## 使いどころ

- 今見ている対象への補助の操作（複製・書き出し・削除など）を、一つの操作の中にしまう時に使います。
- 表示の切り替えや並び順のように、開いたままオン・オフを切り替えたり一つを選んだりする設定にも使えます（`checkbox`・`radio`）。
- 文字を入力して絞り込みながら選ぶ時は `FilterMenu`、フォームの値として一つを選ぶ時は `Select` を使います。
- 主操作にほかのやり方を▾で添える時は `SplitButton` を使います。
- 説明の文やフォームを載せる時は、白いパネルの `Popover` を使います。

## 使い方

`DropdownMenuController` を `dropdown-menu` として登録します。`id` は画面内で一意にし、`items` に項目を並べます。開く操作は共通の `Button` で、`variant`・`size`・`disabled`・`busy` は開く操作にかかります。

項目は `kind` で分けます。省略または `action` は通常の操作、`link` はページの移動、`checkbox` はオン・オフ、`radio` は単一選択、`submenu` は下の階層、`separator` は区切り線、`group` は見出し付きのまとまりです。`submenu` と `group` は `items` を持ち、入れ子にできます。`radio` の `name` は、同じ階層の中の選択のまとまりを表します。

項目には `icon`・`description`・`shortcut` を添えられ、通常の操作は `danger` で赤い文字にできます（ホバーした時と選んでいる時は、淡い赤の面に赤い文字にします）。`shortcut` は表示だけで、キーの登録は利用側が行います。

通常の操作は選ぶと閉じ、チェックと単一選択は開いたままチェックマークを更新します。`closeOnSelect` でこの既定を変えられます。リンクは標準のページ移動を行い、選択のイベントを発火しません。

選んだ項目は `dropdown-menu:select` の `detail` で受け取ります。`action` に `dropdown-menu:select->editor#apply` のようなStimulusのactionを渡すと、ルートの `data-action` になり、利用側のcontrollerへつなげます。選んだ後の処理（保存・通信・画面の更新）は利用側が行います。

メニューは白いパネル（1px #bbb の枠、角丸5px、外への柔らかい影）に黒い12pxの文字で、Popover APIのトップレイヤーに出します。開閉はその場で切り替え、アニメーションはしません。項目は28pxの間隔で並べます。ホバーした項目と矢印キーで選んでいる項目は、行の幅いっぱいの角の無い淡い青（`--rx-option-active`、#ddeefe）に黒い文字にし、ピルで囲みません。まとまりの見出しは灰色の小さな太字（11px）、区切りは1px #dedede の罫線です。使えない項目は文字だけを灰色にします。開く操作の下に出し、下に空きが無ければ上に出します。サブメニューは行の末尾側に開き、空きが無ければ反対側に開きます。どちらも画面の端から8pxの内側に収め、幅は20rem、高さは384pxを上限にして、あふれる分はスクロールします。

メニューの背後には透明な層を置き、層を押すとメニューを閉じます。背後のボタンやリンクは押されません。メニューの外へフォーカスが移った時と、別の `DropdownMenu` を開いた時も閉じます。

項目は上揃えです。一行の時は対称な上下の余白で中央に見え、説明が付いて複数行になると、同じ上端から下へ伸びます。項目の中身全体を `align-items: center` で中央へ寄せないでください。指で操作する環境では、一行の高さを2.75remにします。

`items` が空の時は「利用できる操作はありません」と出します。JavaScriptなしではメニューは開きません。

## キーボード

| キー                          | 動作                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| ↓ / Enter / Space（開く操作） | メニューを開き、最初の有効な項目へ移ります。                                                          |
| ↑（開く操作）                 | メニューを開き、最後の有効な項目へ移ります。                                                          |
| ↓ / ↑                         | 次・前の有効な項目へ移ります。端では反対の端へ戻ります。                                              |
| Home / End                    | 最初・最後の有効な項目へ移ります。                                                                    |
| →（右から左では←）            | サブメニューの項目では、サブメニューを開いて最初の項目へ移ります。                                    |
| ←（右から左では→）            | サブメニューを閉じ、親の項目へ戻ります。                                                              |
| Enter / Space                 | 項目を選びます。リンクは移動し、サブメニューの項目は下の階層を開きます。                              |
| Escape                        | 一段戻ります。一番上の階層では閉じて、開く操作へフォーカスを戻します。                                |
| Tab                           | メニューを全て閉じ、開く操作から次（Shift+Tabなら前）の要素へ進みます。                               |
| 文字                          | 項目名がその文字で始まる次の項目へ移ります。続けて打った文字（0.6秒以内）は一続きの語として探します。 |

## アクセシビリティ

- 開く操作は `aria-haspopup="menu"`・`aria-expanded`・`aria-controls` を持ち、メニューは `role="menu"` で開く操作の文言を名前にします。`iconOnly` の時は `label` を開く操作の `aria-label` にします。
- 項目は `menuitem`・`menuitemcheckbox`・`menuitemradio` で、チェックと単一選択は `aria-checked`（`mixed` を含む）で状態を伝えます。サブメニューの項目は `aria-haspopup`・`aria-expanded`・`aria-controls` を持ちます。
- 項目名は `aria-label`、`description` は `aria-description` として読み上げます。選べない項目は `aria-disabled="true"` にし、矢印の移動で飛ばします。
- `group` は見出しを名前にした `role="group"`、`separator` は `role="separator"` です。
- `shortcut` の表記は読み上げから外します（`aria-hidden`）。
- 日本語の変換中のキーと、Ctrl・Alt・Commandを押しながらのキーは奪いません。サブメニューをマウスで開くのは、項目にホバーして150ms後です。

## イベント

| イベント                     | 内容                                                                                                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dropdown-menu:open`         | 一番上のメニューを開いた時。`detail` は空です。                                                                                                                                        |
| `dropdown-menu:close`        | メニューを閉じた時。`detail` は空です。                                                                                                                                                |
| `dropdown-menu:beforeselect` | 項目を選ぶ直前。取り消せます（`preventDefault()` でチェックを変えず、閉じません）。`detail` は `value`・`kind`、チェックと単一選択では選んだ後の `checked`、単一選択では `name` です。 |
| `dropdown-menu:select`       | 項目を選んだ後。`detail` は `dropdown-menu:beforeselect` と同じです。リンクとサブメニューの項目では出しません。                                                                        |

## API

### DropdownMenu

選択結果はdropdown-menu:select。チェック項目はcheckedも通知する。

| 名前            | 型                                           | 既定値    | 説明                                                                                                                                                                                                                  |
| --------------- | -------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`      | `boolean`                                    |           | 開く操作を押せなくする。                                                                                                                                                                                              |
| `size`          | `"default" \| "compact" \| "large" \| "tag"` |           | 大きさ。compactは同じ高さで左右の余白を狭め、largeはフォーム末尾などの大きな操作に使う。 tagはTagの中の解除操作用で、タッチ環境でも小さなタグの高さを保つ。                                                           |
| `variant`       | `ButtonVariant`                              |           | 見た目の役割。primaryは画面の主操作、secondaryは通常の操作、 dangerは取り返しのつかない操作、linkは文字だけの軽い操作。                                                                                               |
| `busy`          | `boolean`                                    |           | 処理中にする。押せなくし、aria-busyを付け、ポインターを待ちの形にする（控えめな操作は面を淡い灰色にする）。内容はbusyLabelに置き換える。アイコンだけの操作（data-icon-only="true"）は形を保つためアイコンのまま残す。 |
| `id`（必須）    | `string`                                     |           | メニューのid。画面内で一意にする。開く操作は`<id>-trigger`、項目は`<id>-<番号>-item`になる。                                                                                                                          |
| `label`（必須） | `string`                                     |           | 開く操作の文言。iconOnlyの時は`aria-label`として読み上げる。                                                                                                                                                          |
| `items`（必須） | `readonly MenuItem[]`                        |           | メニューの項目。空ならメニューに「利用できる操作はありません」と出す。                                                                                                                                                |
| `action`        | `string`                                     |           | ルートの`data-action`に渡すStimulusのaction。 `dropdown-menu:select->editor#apply`のように、選択のイベントを利用側のcontrollerへつなぐ。                                                                              |
| `align`         | `"start" \| "end"`                           | `"start"` | メニューを開く操作のどちらの端に揃えるか。endは行の末尾側に置いた操作に使う。                                                                                                                                         |
| `dir`           | `"ltr" \| "rtl"`                             |           | 文字の向き。rtlでは左右の矢印キーとサブメニューの開く向きが反転する。                                                                                                                                                 |
| `icon`          | `IconName`                                   |           | 開く操作の文言の前に置くアイコン。                                                                                                                                                                                    |
| `iconOnly`      | `boolean`                                    | `false`   | 開く操作をアイコンだけの正方形にする。iconが無ければ▾だけを出す。                                                                                                                                                     |

登録するcontroller：`dropdown-menu`（`DropdownMenuController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/dropdown-menu.css`、`components/icon.css`、`components/keycap.css`

#### `ButtonVariant`

操作の見た目の役割。primaryは平らな緑の塗りに白い太字（角丸4px）、secondaryは平らな白い面と1pxの灰色の枠（角丸5px）、 dangerは平らな赤の塗りに白い文字（角丸4px）、linkは面も枠も持たない青緑の文字に下線。

値：`"primary" | "secondary" | "danger" | "link"`

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
| `danger`        | `boolean`  |        | 削除など取り返しのつかない操作として、赤い文字で分ける。                             |
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
import {
  DropdownMenu,
  Disclosure,
  Button,
  ButtonGroup,
  type MenuItem,
} from "@tknf/retrix/hono";

const basicItems = () =>
  [
    { label: "確認する", value: "inspect" },
    { label: "選べない操作", value: "disabled", disabled: true },
    { label: "複製する", value: "copy" },
  ] satisfies MenuItem[];

export default () => (
  <div class="rx-stack">
    <DropdownMenu id="hono-menu" label="項目の操作" items={basicItems()} />
    <Disclosure summary="アイコン・説明・補助表記・区切り・危険操作">
      <DropdownMenu
        id="menu-actions"
        label="記事の操作"
        items={[
          {
            kind: "group",
            label: "編集",
            items: [
              { label: "編集する", value: "edit", icon: "pencil", shortcut: "⌘E" },
              {
                label: "複製する",
                value: "copy",
                icon: "layers",
                description: "新しい下書きを作ります",
              },
            ],
          },
          { kind: "separator" },
          { label: "削除する", value: "delete", icon: "trash", danger: true },
        ]}
      />
      <p>補助表記は表示のみです。削除を含め、この例ではデータを変更しません。</p>
    </Disclosure>
    <Disclosure summary="サブメニュー・多段の階層・無効なサブメニュー">
      <DropdownMenu
        id="menu-nested"
        label="書き出しと共有"
        items={[
          { label: "プレビュー", value: "preview", icon: "eye" },
          {
            kind: "submenu",
            label: "書き出す",
            items: [
              { label: "PDF", value: "pdf" },
              {
                kind: "submenu",
                label: "画像",
                items: [
                  { label: "PNG", value: "png" },
                  { label: "JPEG", value: "jpeg" },
                  { label: "SVG", value: "svg", disabled: true },
                ],
              },
            ],
          },
          {
            kind: "submenu",
            label: "共有する",
            items: [
              { label: "リンクをコピー", value: "copy-link" },
              { label: "メールで送る", value: "email" },
            ],
          },
          {
            kind: "submenu",
            label: "管理者の操作",
            disabled: true,
            items: [{ label: "所有者を変更", value: "owner" }],
          },
        ]}
      />
    </Disclosure>
    <Disclosure summary="複数選択・一部選択・単一選択">
      <DropdownMenu
        id="menu-checks"
        label="表示設定"
        items={[
          {
            kind: "group",
            label: "表示する項目",
            items: [
              { kind: "checkbox", label: "担当者", value: "assignee", checked: true },
              { kind: "checkbox", label: "期限", value: "due", checked: false },
              {
                kind: "checkbox",
                label: "通知",
                value: "notifications",
                checked: "mixed",
              },
              {
                kind: "checkbox",
                label: "管理者メモ",
                value: "admin-note",
                checked: true,
                disabled: true,
              },
            ],
          },
          { kind: "separator" },
          {
            kind: "group",
            label: "並び順",
            items: [
              {
                kind: "radio",
                name: "sort",
                label: "更新が新しい順",
                value: "updated",
                checked: true,
              },
              { kind: "radio", name: "sort", label: "名前順", value: "name" },
              {
                kind: "radio",
                name: "sort",
                label: "優先度順",
                value: "priority",
                disabled: true,
              },
            ],
          },
          { kind: "separator" },
          { label: "完了", value: "done" },
        ]}
      />
      <p>チェック・単一選択は開いたまま更新します。完了またはEscapeで閉じます。</p>
    </Disclosure>
    <Disclosure summary="リンク・別タブ・無効なリンク">
      <DropdownMenu
        id="menu-links"
        label="関連ページ"
        items={[
          { kind: "link", label: "記事一覧", href: "/apps/search", icon: "files" },
          {
            kind: "link",
            label: "記事一覧を別タブで開く",
            href: "/apps/search",
            target: "_blank",
          },
          {
            kind: "link",
            label: "利用できないページ",
            href: "/apps/search",
            disabled: true,
          },
        ]}
      />
    </Disclosure>
    <Disclosure summary="トリガーのサイズ・アイコンのみ・主要操作との組み合わせ">
      <div class="rx-stack">
        <DropdownMenu
          id="menu-compact"
          label="小さなトリガー"
          size="compact"
          items={basicItems()}
        />
        <DropdownMenu
          id="menu-large"
          label="大きなトリガー"
          size="large"
          variant="primary"
          items={basicItems()}
        />
        <DropdownMenu
          id="menu-icon"
          label="追加の操作"
          icon="layers"
          iconOnly
          items={basicItems()}
        />
        <ButtonGroup label="公開操作">
          <Button variant="primary">公開する</Button>
          <DropdownMenu
            id="menu-publish"
            variant="primary"
            label="公開方法を選ぶ"
            iconOnly
            items={[
              { label: "日時を指定して公開", value: "schedule" },
              { label: "下書きとして保存", value: "draft" },
            ]}
          />
        </ButtonGroup>
      </div>
    </Disclosure>
    <Disclosure summary="無効・処理中・空・全項目が無効">
      <div class="rx-stack">
        <DropdownMenu
          id="menu-disabled"
          label="操作不可"
          disabled
          items={basicItems()}
        />
        <DropdownMenu id="menu-busy" label="処理中の操作" busy items={basicItems()} />
        <DropdownMenu id="menu-empty" label="操作がない場合" items={[]} />
        <DropdownMenu
          id="menu-all-disabled"
          label="権限がない場合"
          items={[
            { label: "編集する", value: "edit", disabled: true },
            { label: "削除する", value: "delete", danger: true, disabled: true },
          ]}
        />
      </div>
    </Disclosure>
    <Disclosure summary="右寄せ・右から左・長文・スクロール">
      <div class="rx-stack">
        <DropdownMenu
          id="menu-end"
          label="右端の操作"
          align="end"
          items={[
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
        <DropdownMenu
          id="menu-rtl"
          label="右から左の操作"
          dir="rtl"
          items={[
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
        <DropdownMenu
          id="menu-long"
          label="長い項目名"
          items={[
            {
              label: "公開前に文章と添付ファイルと設定の変更内容をまとめて確認する",
              value: "review",
              description: "項目名も説明文もメニューの幅に合わせて折り返します",
            },
            {
              label: "VeryLongUnbrokenActionNameForCheckingMenuOverflowAndWrapping",
              value: "long",
            },
          ]}
        />
        <DropdownMenu
          id="menu-many"
          label="大量の項目"
          items={Array.from({ length: 30 }, (_, index) => ({
            label: `保存先 ${index + 1}`,
            value: `folder-${index + 1}`,
          }))}
        />
      </div>
    </Disclosure>
    <Disclosure summary="選択後も開く操作・選択後に閉じるチェック">
      <DropdownMenu
        id="menu-stay"
        label="選択後の動作"
        items={[
          { label: "リンクをコピー", value: "copy-link", closeOnSelect: false },
          {
            kind: "checkbox",
            label: "通知を受け取る",
            value: "notify",
            closeOnSelect: true,
          },
        ]}
      />
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div
    class="rx-dropdown-menu"
    data-controller="dropdown-menu"
    data-state="closed"
    data-align="start"
  >
    <button
      id="hono-menu-trigger"
      data-dropdown-menu-target="trigger"
      aria-controls="hono-menu"
      aria-haspopup="menu"
      aria-expanded="false"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      項目の操作<svg
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
      id="hono-menu"
      class="rx-menu"
      data-dropdown-menu-target="menu"
      data-menu-panel="root"
      role="menu"
      popover="manual"
      aria-labelledby="hono-menu-trigger"
      tabindex="-1"
      hidden=""
    >
      <li role="none">
        <button
          id="hono-menu-0-item"
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
          <span class="content"
            ><span class="heading"
              ><span class="text"><span>確認する</span></span></span
            ></span
          >
        </button>
      </li>
      <li role="none">
        <button
          id="hono-menu-1-item"
          role="menuitem"
          aria-label="選べない操作"
          aria-disabled="true"
          data-disabled="true"
          data-menu-kind="action"
          data-menu-label="選べない操作"
          tabindex="-1"
          data-dropdown-menu-target="item"
          data-dropdown-menu-value="disabled"
          class="rx-button item"
          type="button"
          data-variant="secondary"
          data-size="default"
          disabled=""
        >
          <span class="content"
            ><span class="heading"
              ><span class="text"><span>選べない操作</span></span></span
            ></span
          >
        </button>
      </li>
      <li role="none">
        <button
          id="hono-menu-2-item"
          role="menuitem"
          aria-label="複製する"
          data-menu-kind="action"
          data-menu-label="複製する"
          tabindex="-1"
          data-dropdown-menu-target="item"
          data-dropdown-menu-value="copy"
          class="rx-button item"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          <span class="content"
            ><span class="heading"
              ><span class="text"><span>複製する</span></span></span
            ></span
          >
        </button>
      </li>
    </menu>
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
        ><span class="title">アイコン・説明・補助表記・区切り・危険操作</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="menu-actions-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="menu-actions"
          aria-haspopup="menu"
          aria-expanded="false"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          記事の操作<svg
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
          id="menu-actions"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="menu-actions-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <span class="label" id="menu-actions-0-label">編集</span>
            <ul
              class="rx-menu"
              data-variant="group"
              role="group"
              aria-labelledby="menu-actions-0-label"
            >
              <li role="none">
                <button
                  id="menu-actions-0-0-item"
                  role="menuitem"
                  aria-label="編集する"
                  data-menu-kind="action"
                  data-menu-label="編集する"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="edit"
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
                        <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
                      ><span class="text"><span>編集する</span></span
                      ><span
                        aria-hidden="true"
                        class="rx-keycap shortcut"
                        data-size="small"
                        data-inverse="true"
                        ><kbd>⌘E</kbd></span
                      ></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-actions-0-1-item"
                  role="menuitem"
                  aria-label="複製する"
                  aria-description="新しい下書きを作ります"
                  data-menu-kind="action"
                  data-menu-label="複製する"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="copy"
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
                        <use href="/assets/rx-icons.svg#rx-layers"></use></svg
                      ><span class="text"><span>複製する</span></span></span
                    ><small class="description">新しい下書きを作ります</small></span
                  >
                </button>
              </li>
            </ul>
          </li>
          <li class="separator" role="separator"></li>
          <li role="none">
            <button
              id="menu-actions-2-item"
              role="menuitem"
              aria-label="削除する"
              data-menu-kind="action"
              data-menu-label="削除する"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="delete"
              data-tone="danger"
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
                    <use href="/assets/rx-icons.svg#rx-trash"></use></svg
                  ><span class="text"><span>削除する</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
      <p>補助表記は表示のみです。削除を含め、この例ではデータを変更しません。</p>
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
        ><span class="title">サブメニュー・多段の階層・無効なサブメニュー</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="menu-nested-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="menu-nested"
          aria-haspopup="menu"
          aria-expanded="false"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          書き出しと共有<svg
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
          id="menu-nested"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="menu-nested-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="menu-nested-0-item"
              role="menuitem"
              aria-label="プレビュー"
              data-menu-kind="action"
              data-menu-label="プレビュー"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="preview"
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
                  ><span class="text"><span>プレビュー</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="menu-nested-1-item"
              role="menuitem"
              aria-label="書き出す"
              data-menu-kind="submenu"
              data-menu-label="書き出す"
              tabindex="-1"
              data-dropdown-menu-target="item"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls="menu-nested-1-menu"
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
              id="menu-nested-1-menu"
              class="rx-menu"
              role="menu"
              popover="manual"
              data-menu-panel="submenu"
              aria-labelledby="menu-nested-1-item"
              tabindex="-1"
              hidden=""
            >
              <li role="none">
                <button
                  id="menu-nested-1-menu-0-item"
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
                  id="menu-nested-1-menu-1-item"
                  role="menuitem"
                  aria-label="画像"
                  data-menu-kind="submenu"
                  data-menu-label="画像"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-controls="menu-nested-1-menu-1-menu"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content"
                    ><span class="heading"
                      ><span class="text"><span>画像</span></span
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
                  id="menu-nested-1-menu-1-menu"
                  class="rx-menu"
                  role="menu"
                  popover="manual"
                  data-menu-panel="submenu"
                  aria-labelledby="menu-nested-1-menu-1-item"
                  tabindex="-1"
                  hidden=""
                >
                  <li role="none">
                    <button
                      id="menu-nested-1-menu-1-menu-0-item"
                      role="menuitem"
                      aria-label="PNG"
                      data-menu-kind="action"
                      data-menu-label="PNG"
                      tabindex="-1"
                      data-dropdown-menu-target="item"
                      data-dropdown-menu-value="png"
                      class="rx-button item"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      <span class="content"
                        ><span class="heading"
                          ><span class="text"><span>PNG</span></span></span
                        ></span
                      >
                    </button>
                  </li>
                  <li role="none">
                    <button
                      id="menu-nested-1-menu-1-menu-1-item"
                      role="menuitem"
                      aria-label="JPEG"
                      data-menu-kind="action"
                      data-menu-label="JPEG"
                      tabindex="-1"
                      data-dropdown-menu-target="item"
                      data-dropdown-menu-value="jpeg"
                      class="rx-button item"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      <span class="content"
                        ><span class="heading"
                          ><span class="text"><span>JPEG</span></span></span
                        ></span
                      >
                    </button>
                  </li>
                  <li role="none">
                    <button
                      id="menu-nested-1-menu-1-menu-2-item"
                      role="menuitem"
                      aria-label="SVG"
                      aria-disabled="true"
                      data-disabled="true"
                      data-menu-kind="action"
                      data-menu-label="SVG"
                      tabindex="-1"
                      data-dropdown-menu-target="item"
                      data-dropdown-menu-value="svg"
                      class="rx-button item"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                      disabled=""
                    >
                      <span class="content"
                        ><span class="heading"
                          ><span class="text"><span>SVG</span></span></span
                        ></span
                      >
                    </button>
                  </li>
                </menu>
              </li>
            </menu>
          </li>
          <li role="none">
            <button
              id="menu-nested-2-item"
              role="menuitem"
              aria-label="共有する"
              data-menu-kind="submenu"
              data-menu-label="共有する"
              tabindex="-1"
              data-dropdown-menu-target="item"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls="menu-nested-2-menu"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>共有する</span></span
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
              id="menu-nested-2-menu"
              class="rx-menu"
              role="menu"
              popover="manual"
              data-menu-panel="submenu"
              aria-labelledby="menu-nested-2-item"
              tabindex="-1"
              hidden=""
            >
              <li role="none">
                <button
                  id="menu-nested-2-menu-0-item"
                  role="menuitem"
                  aria-label="リンクをコピー"
                  data-menu-kind="action"
                  data-menu-label="リンクをコピー"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="copy-link"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content"
                    ><span class="heading"
                      ><span class="text"><span>リンクをコピー</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-nested-2-menu-1-item"
                  role="menuitem"
                  aria-label="メールで送る"
                  data-menu-kind="action"
                  data-menu-label="メールで送る"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="email"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content"
                    ><span class="heading"
                      ><span class="text"><span>メールで送る</span></span></span
                    ></span
                  >
                </button>
              </li>
            </menu>
          </li>
          <li role="none">
            <button
              id="menu-nested-3-item"
              role="menuitem"
              aria-label="管理者の操作"
              aria-disabled="true"
              data-disabled="true"
              data-menu-kind="submenu"
              data-menu-label="管理者の操作"
              tabindex="-1"
              data-dropdown-menu-target="item"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls="menu-nested-3-menu"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
              disabled=""
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>管理者の操作</span></span
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
              id="menu-nested-3-menu"
              class="rx-menu"
              role="menu"
              popover="manual"
              data-menu-panel="submenu"
              aria-labelledby="menu-nested-3-item"
              tabindex="-1"
              hidden=""
            >
              <li role="none">
                <button
                  id="menu-nested-3-menu-0-item"
                  role="menuitem"
                  aria-label="所有者を変更"
                  data-menu-kind="action"
                  data-menu-label="所有者を変更"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="owner"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content"
                    ><span class="heading"
                      ><span class="text"><span>所有者を変更</span></span></span
                    ></span
                  >
                </button>
              </li>
            </menu>
          </li>
        </menu>
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
        ><span class="title">複数選択・一部選択・単一選択</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="menu-checks-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="menu-checks"
          aria-haspopup="menu"
          aria-expanded="false"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          表示設定<svg
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
          id="menu-checks"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="menu-checks-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <span class="label" id="menu-checks-0-label">表示する項目</span>
            <ul
              class="rx-menu"
              data-variant="group"
              role="group"
              aria-labelledby="menu-checks-0-label"
            >
              <li role="none">
                <button
                  id="menu-checks-0-0-item"
                  role="menuitemcheckbox"
                  aria-label="担当者"
                  data-menu-kind="checkbox"
                  data-menu-label="担当者"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="assignee"
                  aria-checked="true"
                  data-checked="true"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-check"></use></svg
                        ><span class="mixed">−</span></span
                      ><span class="text"><span>担当者</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-checks-0-1-item"
                  role="menuitemcheckbox"
                  aria-label="期限"
                  data-menu-kind="checkbox"
                  data-menu-label="期限"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="due"
                  aria-checked="false"
                  data-checked="false"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-check"></use></svg
                        ><span class="mixed">−</span></span
                      ><span class="text"><span>期限</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-checks-0-2-item"
                  role="menuitemcheckbox"
                  aria-label="通知"
                  data-menu-kind="checkbox"
                  data-menu-label="通知"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="notifications"
                  aria-checked="mixed"
                  data-checked="mixed"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-check"></use></svg
                        ><span class="mixed">−</span></span
                      ><span class="text"><span>通知</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-checks-0-3-item"
                  role="menuitemcheckbox"
                  aria-label="管理者メモ"
                  aria-disabled="true"
                  data-disabled="true"
                  data-menu-kind="checkbox"
                  data-menu-label="管理者メモ"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="admin-note"
                  aria-checked="true"
                  data-checked="true"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                  disabled=""
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-check"></use></svg
                        ><span class="mixed">−</span></span
                      ><span class="text"><span>管理者メモ</span></span></span
                    ></span
                  >
                </button>
              </li>
            </ul>
          </li>
          <li class="separator" role="separator"></li>
          <li role="none">
            <span class="label" id="menu-checks-2-label">並び順</span>
            <ul
              class="rx-menu"
              data-variant="group"
              role="group"
              aria-labelledby="menu-checks-2-label"
            >
              <li role="none">
                <button
                  id="menu-checks-2-0-item"
                  role="menuitemradio"
                  aria-label="更新が新しい順"
                  data-menu-kind="radio"
                  data-menu-label="更新が新しい順"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="updated"
                  data-menu-group="sort"
                  aria-checked="true"
                  data-checked="true"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><span class="dot"></span></span
                      ><span class="text"><span>更新が新しい順</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-checks-2-1-item"
                  role="menuitemradio"
                  aria-label="名前順"
                  data-menu-kind="radio"
                  data-menu-label="名前順"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="name"
                  data-menu-group="sort"
                  aria-checked="false"
                  data-checked="false"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><span class="dot"></span></span
                      ><span class="text"><span>名前順</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-checks-2-2-item"
                  role="menuitemradio"
                  aria-label="優先度順"
                  aria-disabled="true"
                  data-disabled="true"
                  data-menu-kind="radio"
                  data-menu-label="優先度順"
                  tabindex="-1"
                  data-dropdown-menu-target="item"
                  data-dropdown-menu-value="priority"
                  data-menu-group="sort"
                  aria-checked="false"
                  data-checked="false"
                  class="rx-button item"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                  disabled=""
                >
                  <span class="content" data-leading="true"
                    ><span class="heading"
                      ><span class="mark" aria-hidden="true"
                        ><span class="dot"></span></span
                      ><span class="text"><span>優先度順</span></span></span
                    ></span
                  >
                </button>
              </li>
            </ul>
          </li>
          <li class="separator" role="separator"></li>
          <li role="none">
            <button
              id="menu-checks-4-item"
              role="menuitem"
              aria-label="完了"
              data-menu-kind="action"
              data-menu-label="完了"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="done"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>完了</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
      <p>チェック・単一選択は開いたまま更新します。完了またはEscapeで閉じます。</p>
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
        ><span class="title">リンク・別タブ・無効なリンク</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="menu-links-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="menu-links"
          aria-haspopup="menu"
          aria-expanded="false"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          関連ページ<svg
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
          id="menu-links"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="menu-links-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <a
              id="menu-links-0-item"
              role="menuitem"
              aria-label="記事一覧"
              data-menu-kind="link"
              data-menu-label="記事一覧"
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
                    <use href="/assets/rx-icons.svg#rx-files"></use></svg
                  ><span class="text"><span>記事一覧</span></span></span
                ></span
              ></a
            >
          </li>
          <li role="none">
            <a
              id="menu-links-1-item"
              role="menuitem"
              aria-label="記事一覧を別タブで開く"
              data-menu-kind="link"
              data-menu-label="記事一覧を別タブで開く"
              tabindex="-1"
              href="/apps/search"
              target="_blank"
              rel="noopener noreferrer"
              class="rx-button item"
              data-variant="secondary"
              data-size="default"
              ><span class="content"
                ><span class="heading"
                  ><span class="text"><span>記事一覧を別タブで開く</span></span></span
                ></span
              ></a
            >
          </li>
          <li role="none">
            <button
              id="menu-links-2-item"
              role="menuitem"
              aria-label="利用できないページ"
              aria-disabled="true"
              data-disabled="true"
              data-menu-kind="link"
              data-menu-label="利用できないページ"
              tabindex="-1"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
              disabled=""
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>利用できないページ</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
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
        ><span class="title"
          >トリガーのサイズ・アイコンのみ・主要操作との組み合わせ</span
        ></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-compact-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-compact"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="compact"
          >
            小さなトリガー<svg
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
            id="menu-compact"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-compact-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-compact-0-item"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>確認する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-compact-1-item"
                role="menuitem"
                aria-label="選べない操作"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="選べない操作"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="disabled"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>選べない操作</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-compact-2-item"
                role="menuitem"
                aria-label="複製する"
                data-menu-kind="action"
                data-menu-label="複製する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="copy"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>複製する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-large-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-large"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="primary"
            data-size="large"
          >
            大きなトリガー<svg
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
            id="menu-large"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-large-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-large-0-item"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>確認する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-large-1-item"
                role="menuitem"
                aria-label="選べない操作"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="選べない操作"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="disabled"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>選べない操作</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-large-2-item"
                role="menuitem"
                aria-label="複製する"
                data-menu-kind="action"
                data-menu-label="複製する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="copy"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>複製する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-icon-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-icon"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="追加の操作"
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
              <use href="/assets/rx-icons.svg#rx-layers"></use>
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
            id="menu-icon"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-icon-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-icon-0-item"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>確認する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-icon-1-item"
                role="menuitem"
                aria-label="選べない操作"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="選べない操作"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="disabled"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>選べない操作</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-icon-2-item"
                role="menuitem"
                aria-label="複製する"
                data-menu-kind="action"
                data-menu-label="複製する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="copy"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>複製する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div class="rx-button-group" role="group" aria-label="公開操作">
          <button
            class="rx-button"
            type="button"
            data-variant="primary"
            data-size="default"
          >
            公開する
          </button>
          <div
            class="rx-dropdown-menu"
            data-controller="dropdown-menu"
            data-state="closed"
            data-align="start"
          >
            <button
              id="menu-publish-trigger"
              data-dropdown-menu-target="trigger"
              aria-controls="menu-publish"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="公開方法を選ぶ"
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
              id="menu-publish"
              class="rx-menu"
              data-dropdown-menu-target="menu"
              data-menu-panel="root"
              role="menu"
              popover="manual"
              aria-labelledby="menu-publish-trigger"
              tabindex="-1"
              hidden=""
            >
              <li role="none">
                <button
                  id="menu-publish-0-item"
                  role="menuitem"
                  aria-label="日時を指定して公開"
                  data-menu-kind="action"
                  data-menu-label="日時を指定して公開"
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
                      ><span class="text"><span>日時を指定して公開</span></span></span
                    ></span
                  >
                </button>
              </li>
              <li role="none">
                <button
                  id="menu-publish-1-item"
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
      ><span class="label"
        ><span class="title">無効・処理中・空・全項目が無効</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-disabled-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-disabled"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            disabled=""
          >
            操作不可<svg
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
            id="menu-disabled"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-disabled-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-disabled-0-item"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>確認する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-disabled-1-item"
                role="menuitem"
                aria-label="選べない操作"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="選べない操作"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="disabled"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>選べない操作</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-disabled-2-item"
                role="menuitem"
                aria-label="複製する"
                data-menu-kind="action"
                data-menu-label="複製する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="copy"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>複製する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-busy-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-busy"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
            data-busy="true"
            disabled=""
            aria-busy="true"
          >
            処理中…
          </button>
          <div
            class="shield"
            data-dropdown-menu-target="shield"
            popover="manual"
            tabindex="-1"
            hidden=""
          ></div>
          <menu
            id="menu-busy"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-busy-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-busy-0-item"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>確認する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-busy-1-item"
                role="menuitem"
                aria-label="選べない操作"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="選べない操作"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="disabled"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>選べない操作</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-busy-2-item"
                role="menuitem"
                aria-label="複製する"
                data-menu-kind="action"
                data-menu-label="複製する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="copy"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>複製する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-empty-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-empty"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            操作がない場合<svg
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
            id="menu-empty"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-empty-trigger"
            tabindex="-1"
            hidden=""
          >
            <li class="empty" role="none">利用できる操作はありません</li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-all-disabled-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-all-disabled"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            権限がない場合<svg
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
            id="menu-all-disabled"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-all-disabled-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-all-disabled-0-item"
                role="menuitem"
                aria-label="編集する"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="編集する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="edit"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>編集する</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-all-disabled-1-item"
                role="menuitem"
                aria-label="削除する"
                aria-disabled="true"
                data-disabled="true"
                data-menu-kind="action"
                data-menu-label="削除する"
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
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>削除する</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
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
        ><span class="title">右寄せ・右から左・長文・スクロール</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="end"
        >
          <button
            id="menu-end-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-end"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            右端の操作<svg
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
            id="menu-end"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-end-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-end-0-item"
                role="menuitem"
                aria-label="書き出す"
                data-menu-kind="submenu"
                data-menu-label="書き出す"
                tabindex="-1"
                data-dropdown-menu-target="item"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-controls="menu-end-0-menu"
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
                id="menu-end-0-menu"
                class="rx-menu"
                role="menu"
                popover="manual"
                data-menu-panel="submenu"
                aria-labelledby="menu-end-0-item"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="menu-end-0-menu-0-item"
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
                    id="menu-end-0-menu-1-item"
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
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
          dir="rtl"
        >
          <button
            id="menu-rtl-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-rtl"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            右から左の操作<svg
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
            id="menu-rtl"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-rtl-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-rtl-0-item"
                role="menuitem"
                aria-label="書き出す"
                data-menu-kind="submenu"
                data-menu-label="書き出す"
                tabindex="-1"
                data-dropdown-menu-target="item"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-controls="menu-rtl-0-menu"
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
                id="menu-rtl-0-menu"
                class="rx-menu"
                role="menu"
                popover="manual"
                data-menu-panel="submenu"
                aria-labelledby="menu-rtl-0-item"
                tabindex="-1"
                hidden=""
              >
                <li role="none">
                  <button
                    id="menu-rtl-0-menu-0-item"
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
                    id="menu-rtl-0-menu-1-item"
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
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-long-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-long"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            長い項目名<svg
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
            id="menu-long"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-long-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-long-0-item"
                role="menuitem"
                aria-label="公開前に文章と添付ファイルと設定の変更内容をまとめて確認する"
                aria-description="項目名も説明文もメニューの幅に合わせて折り返します"
                data-menu-kind="action"
                data-menu-label="公開前に文章と添付ファイルと設定の変更内容をまとめて確認する"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="review"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"
                      ><span
                        >公開前に文章と添付ファイルと設定の変更内容をまとめて確認する</span
                      ></span
                    ></span
                  ><small class="description"
                    >項目名も説明文もメニューの幅に合わせて折り返します</small
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-long-1-item"
                role="menuitem"
                aria-label="VeryLongUnbrokenActionNameForCheckingMenuOverflowAndWrapping"
                data-menu-kind="action"
                data-menu-label="VeryLongUnbrokenActionNameForCheckingMenuOverflowAndWrapping"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="long"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"
                      ><span
                        >VeryLongUnbrokenActionNameForCheckingMenuOverflowAndWrapping</span
                      ></span
                    ></span
                  ></span
                >
              </button>
            </li>
          </menu>
        </div>
        <div
          class="rx-dropdown-menu"
          data-controller="dropdown-menu"
          data-state="closed"
          data-align="start"
        >
          <button
            id="menu-many-trigger"
            data-dropdown-menu-target="trigger"
            aria-controls="menu-many"
            aria-haspopup="menu"
            aria-expanded="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            大量の項目<svg
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
            id="menu-many"
            class="rx-menu"
            data-dropdown-menu-target="menu"
            data-menu-panel="root"
            role="menu"
            popover="manual"
            aria-labelledby="menu-many-trigger"
            tabindex="-1"
            hidden=""
          >
            <li role="none">
              <button
                id="menu-many-0-item"
                role="menuitem"
                aria-label="保存先 1"
                data-menu-kind="action"
                data-menu-label="保存先 1"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-1"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 1</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-1-item"
                role="menuitem"
                aria-label="保存先 2"
                data-menu-kind="action"
                data-menu-label="保存先 2"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-2"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 2</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-2-item"
                role="menuitem"
                aria-label="保存先 3"
                data-menu-kind="action"
                data-menu-label="保存先 3"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-3"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 3</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-3-item"
                role="menuitem"
                aria-label="保存先 4"
                data-menu-kind="action"
                data-menu-label="保存先 4"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-4"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 4</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-4-item"
                role="menuitem"
                aria-label="保存先 5"
                data-menu-kind="action"
                data-menu-label="保存先 5"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-5"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 5</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-5-item"
                role="menuitem"
                aria-label="保存先 6"
                data-menu-kind="action"
                data-menu-label="保存先 6"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-6"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 6</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-6-item"
                role="menuitem"
                aria-label="保存先 7"
                data-menu-kind="action"
                data-menu-label="保存先 7"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-7"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 7</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-7-item"
                role="menuitem"
                aria-label="保存先 8"
                data-menu-kind="action"
                data-menu-label="保存先 8"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-8"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 8</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-8-item"
                role="menuitem"
                aria-label="保存先 9"
                data-menu-kind="action"
                data-menu-label="保存先 9"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-9"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 9</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-9-item"
                role="menuitem"
                aria-label="保存先 10"
                data-menu-kind="action"
                data-menu-label="保存先 10"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-10"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 10</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-10-item"
                role="menuitem"
                aria-label="保存先 11"
                data-menu-kind="action"
                data-menu-label="保存先 11"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-11"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 11</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-11-item"
                role="menuitem"
                aria-label="保存先 12"
                data-menu-kind="action"
                data-menu-label="保存先 12"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-12"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 12</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-12-item"
                role="menuitem"
                aria-label="保存先 13"
                data-menu-kind="action"
                data-menu-label="保存先 13"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-13"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 13</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-13-item"
                role="menuitem"
                aria-label="保存先 14"
                data-menu-kind="action"
                data-menu-label="保存先 14"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-14"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 14</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-14-item"
                role="menuitem"
                aria-label="保存先 15"
                data-menu-kind="action"
                data-menu-label="保存先 15"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-15"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 15</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-15-item"
                role="menuitem"
                aria-label="保存先 16"
                data-menu-kind="action"
                data-menu-label="保存先 16"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-16"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 16</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-16-item"
                role="menuitem"
                aria-label="保存先 17"
                data-menu-kind="action"
                data-menu-label="保存先 17"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-17"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 17</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-17-item"
                role="menuitem"
                aria-label="保存先 18"
                data-menu-kind="action"
                data-menu-label="保存先 18"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-18"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 18</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-18-item"
                role="menuitem"
                aria-label="保存先 19"
                data-menu-kind="action"
                data-menu-label="保存先 19"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-19"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 19</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-19-item"
                role="menuitem"
                aria-label="保存先 20"
                data-menu-kind="action"
                data-menu-label="保存先 20"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-20"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 20</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-20-item"
                role="menuitem"
                aria-label="保存先 21"
                data-menu-kind="action"
                data-menu-label="保存先 21"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-21"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 21</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-21-item"
                role="menuitem"
                aria-label="保存先 22"
                data-menu-kind="action"
                data-menu-label="保存先 22"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-22"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 22</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-22-item"
                role="menuitem"
                aria-label="保存先 23"
                data-menu-kind="action"
                data-menu-label="保存先 23"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-23"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 23</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-23-item"
                role="menuitem"
                aria-label="保存先 24"
                data-menu-kind="action"
                data-menu-label="保存先 24"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-24"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 24</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-24-item"
                role="menuitem"
                aria-label="保存先 25"
                data-menu-kind="action"
                data-menu-label="保存先 25"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-25"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 25</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-25-item"
                role="menuitem"
                aria-label="保存先 26"
                data-menu-kind="action"
                data-menu-label="保存先 26"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-26"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 26</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-26-item"
                role="menuitem"
                aria-label="保存先 27"
                data-menu-kind="action"
                data-menu-label="保存先 27"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-27"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 27</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-27-item"
                role="menuitem"
                aria-label="保存先 28"
                data-menu-kind="action"
                data-menu-label="保存先 28"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-28"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 28</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-28-item"
                role="menuitem"
                aria-label="保存先 29"
                data-menu-kind="action"
                data-menu-label="保存先 29"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-29"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 29</span></span></span
                  ></span
                >
              </button>
            </li>
            <li role="none">
              <button
                id="menu-many-29-item"
                role="menuitem"
                aria-label="保存先 30"
                data-menu-kind="action"
                data-menu-label="保存先 30"
                tabindex="-1"
                data-dropdown-menu-target="item"
                data-dropdown-menu-value="folder-30"
                class="rx-button item"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="content"
                  ><span class="heading"
                    ><span class="text"><span>保存先 30</span></span></span
                  ></span
                >
              </button>
            </li>
          </menu>
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
        ><span class="title">選択後も開く操作・選択後に閉じるチェック</span></span
      >
    </summary>
    <div class="body">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="menu-stay-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="menu-stay"
          aria-haspopup="menu"
          aria-expanded="false"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          選択後の動作<svg
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
          id="menu-stay"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="menu-stay-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="menu-stay-0-item"
              role="menuitem"
              aria-label="リンクをコピー"
              data-menu-kind="action"
              data-menu-label="リンクをコピー"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="copy-link"
              data-close-on-select="false"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>リンクをコピー</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="menu-stay-1-item"
              role="menuitemcheckbox"
              aria-label="通知を受け取る"
              data-menu-kind="checkbox"
              data-menu-label="通知を受け取る"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="notify"
              data-close-on-select="true"
              aria-checked="false"
              data-checked="false"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content" data-leading="true"
                ><span class="heading"
                  ><span class="mark" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-check"></use></svg
                    ><span class="mixed">−</span></span
                  ><span class="text"><span>通知を受け取る</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
    </div>
  </details>
</div>
```

</details>
