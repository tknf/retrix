<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ToggleGroup

関連する状態を、一つまたは複数切り替えます。

## 使いどころ

- 表示密度や表示する項目のように、同じ画面の見え方を切り替えるボタンのグループに使います。一つだけを選ぶ時は既定のまま、複数を選ぶ時は `multiple` を付けます。
- URLで一覧の条件を切り替える時は `FilterBar`、パネルを切り替える時は `Tabs` を使います。
- フォームで送信する値を選ぶ時は、ラジオボタンの `Choice` か `CheckboxGroup` を使います。`ToggleGroup` は値を送信しません。

## 使い方

`items` を押せるボタンとして並べ、`selected` の値をオンにします。ボタンは控えめな `Button`（平らな白・1pxの灰色の枠・下の1pxの影・角丸5px）を隙間なくつなげ、枠を1px重ねて間を1本の線にし、外側の角だけを丸めます。オンのボタンは、Basecamp 2の切り替えで選んだ側と同じ黒の平らな塗りに白い文字で示します。`value` が空白だけの項目と、重なった値の二つ目以降は出しません。

既定では一つだけをオンにし、別のボタンを押すと切り替わります。オンのボタンを押してもオンのままで、`toggle-group:beforechange`・`toggle-group:change` は発火しません。`multiple` では押したボタンだけを切り替え、全てオフにもできます。

`orientation="vertical"` は縦に並べ、ボタンの幅を一番長い名前にそろえます。

`ToggleGroupController` を `toggle-group` として登録します。選んだ結果は `toggle-group:change` で受け取り、画面への反映や保存は利用側が行います。

JavaScriptが無い時は、初期の状態を見せるだけで、押しても切り替わりません。

## キーボード

| キー                  | 動作                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Tab                   | グループの中の一つのボタンへ入ります。前に移ったボタン、オンのボタン、最初のボタンの順に選びます。 |
| ← / →（`horizontal`） | 前・次のボタンへ移ります。端では反対の端へ回ります。右から左へ書く時は左右が逆になります。         |
| ↑ / ↓（`vertical`）   | 前・次のボタンへ移ります。端では反対の端へ回ります。                                               |
| Home / End            | 最初・最後のボタンへ移ります。                                                                     |
| Enter / Space         | 移ったボタンを切り替えます。一つだけを選ぶ時は、オンのボタンではオンのままです。                   |

## アクセシビリティ

- グループは `role="group"` で、`label` を読み上げ名にします。
- 各ボタンは `aria-pressed` でオン・オフを伝えます。`disabled` のボタンには移りません。

## イベント

| イベント                    | 内容                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `toggle-group:beforechange` | ボタンを押して選択が変わる前に発火します。取り消せます。detailは `selected`（変わった後の値）・`previousSelected`・`reason`（`pointer` か `keyboard`）です。 |
| `toggle-group:change`       | 選択が変わった後に発火します。detailは `toggle-group:beforechange` と同じです。                                                                              |

## API

### ToggleGroup

画面内の単一・複数の状態切替。変更結果はtoggle-group:changeで渡す。

| 名前            | 型                           | 既定値         | 説明                                                                                                                |
| --------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                     |                | まとまりの読み上げ名。                                                                                              |
| `items`（必須） | `readonly ToggleGroupItem[]` |                | 切り替えるボタン。                                                                                                  |
| `selected`      | `readonly string[]`          | `[]`           | 最初にオンにする値。multipleでない時は先頭の一つだけを使う。                                                        |
| `multiple`      | `boolean`                    | `false`        | trueで複数をオンにできる。falseは一つだけで、別のボタンを押すと切り替わり、オンのボタンを押してもオンのままにする。 |
| `orientation`   | `"horizontal" \| "vertical"` | `"horizontal"` | 並べる向き。矢印キーもhorizontalは左右、verticalは上下で移る。                                                      |

登録するcontroller：`toggle-group`（`ToggleGroupController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/toggle-group.css`

#### `ToggleGroupItem`

| 名前            | 型        | 既定値 | 説明                                                         |
| --------------- | --------- | ------ | ------------------------------------------------------------ |
| `value`（必須） | `string`  |        | 選択の値。空白だけの値と、重なった値の二つ目以降は出さない。 |
| `label`（必須） | `string`  |        | ボタンの文言。                                               |
| `disabled`      | `boolean` |        | 押せなくする。矢印キーの移動でも飛ばす。                     |

## コード

```tsx
import { ToggleGroup, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <ToggleGroup
      label="表示密度"
      items={[
        { value: "comfortable", label: "標準" },
        { value: "compact", label: "コンパクト" },
      ]}
      selected={["comfortable"]}
    />
    <ToggleGroup
      label="表示する項目"
      items={[
        { value: "date", label: "日付" },
        { value: "owner", label: "担当者" },
        { value: "status", label: "状態" },
      ]}
      selected={["date", "status"]}
      multiple
    />
    <DisclosureGroup label="並べ方の違い">
      <Disclosure summary="縦に並べる" open>
        <ToggleGroup
          label="カードの段"
          orientation="vertical"
          items={[
            { value: "not-now", label: "今はしない" },
            { value: "maybe", label: "たぶん" },
            { value: "on-hold", label: "保留" },
            { value: "done", label: "完了" },
          ]}
          selected={["on-hold"]}
        />
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
    class="rx-toggle-group"
    role="group"
    aria-label="表示密度"
    data-controller="toggle-group"
    data-toggle-group-multiple-value="false"
    data-toggle-group-selected-value='["comfortable"]'
    data-toggle-group-orientation-value="horizontal"
    data-orientation="horizontal"
  >
    <button
      data-toggle-group-target="item"
      data-toggle-group-value="comfortable"
      data-state="on"
      aria-pressed="true"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      標準</button
    ><button
      data-toggle-group-target="item"
      data-toggle-group-value="compact"
      data-state="off"
      aria-pressed="false"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      コンパクト
    </button>
  </div>
  <div
    class="rx-toggle-group"
    role="group"
    aria-label="表示する項目"
    data-controller="toggle-group"
    data-toggle-group-multiple-value="true"
    data-toggle-group-selected-value='["date","status"]'
    data-toggle-group-orientation-value="horizontal"
    data-orientation="horizontal"
  >
    <button
      data-toggle-group-target="item"
      data-toggle-group-value="date"
      data-state="on"
      aria-pressed="true"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      日付</button
    ><button
      data-toggle-group-target="item"
      data-toggle-group-value="owner"
      data-state="off"
      aria-pressed="false"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      担当者</button
    ><button
      data-toggle-group-target="item"
      data-toggle-group-value="status"
      data-state="on"
      aria-pressed="true"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      状態
    </button>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="並べ方の違い">
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
        ><span class="label"><span class="title">縦に並べる</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-toggle-group"
          role="group"
          aria-label="カードの段"
          data-controller="toggle-group"
          data-toggle-group-multiple-value="false"
          data-toggle-group-selected-value='["on-hold"]'
          data-toggle-group-orientation-value="vertical"
          data-orientation="vertical"
        >
          <button
            data-toggle-group-target="item"
            data-toggle-group-value="not-now"
            data-state="off"
            aria-pressed="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            今はしない</button
          ><button
            data-toggle-group-target="item"
            data-toggle-group-value="maybe"
            data-state="off"
            aria-pressed="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            たぶん</button
          ><button
            data-toggle-group-target="item"
            data-toggle-group-value="on-hold"
            data-state="on"
            aria-pressed="true"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            保留</button
          ><button
            data-toggle-group-target="item"
            data-toggle-group-value="done"
            data-state="off"
            aria-pressed="false"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            完了
          </button>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
