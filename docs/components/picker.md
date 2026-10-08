<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Picker

検索して、候補から値を選びます。

## 使いどころ

- 担当者や確認する人のように、候補が多く、名前で探して選ぶ時に使います。`multiple` で複数を選べます。
- 候補が少なく探す必要が無い時は `Select`、候補に無い値も入力させる時は `Suggestion` を使います。
- 自由な語を付け足していく時は `TagInput` を使います。

## 使い方

送信する値は、見えない標準の `select` が `name` で送ります。上の検索欄は候補を探すためだけのもので、送信しません。`options` の `value` が空白だけの候補と、重なった値の二つ目以降は出しません。

検索欄に移ると候補の一覧を開きます。打った文字で候補の名前を絞り込み、全角と半角、大文字と小文字は区別しません。選べる候補が一つも無い時は「一致する候補はありません。」と出します。候補を選ぶと検索欄を空にして一覧を閉じ、検索欄へフォーカスを戻します。

候補の一覧は検索欄のすぐ下に、選んだ値と補足の上へ重ねて開く白いパネル（1px `#bbbbbb` の枠、角丸5px、柔らかい影）で、12pxの候補の行を隙間なく並べます。ホバーした候補とキーボードで移った候補は、角の無い淡い青（`#ddeefe`）に黒い文字で塗ります。ピルで囲みません。選び済みの候補は太字、選べない候補は灰色の文字にします。

選んだ候補は、検索欄の下に解除の操作付きの `Tag` で並べます。一つを選ぶ時は、別の候補を選ぶと置き換え、選び済みの候補を選び直しても変更として扱いません。`multiple` では選ぶたびに加え、同じ候補をもう一度選ぶと外します。どちらも `Tag` の解除の操作で外せます。

`required` で未選択のまま送信すると、検索欄へフォーカスを移して「候補を選択してください。」と出します。フォームのリセットでは標準の `select` の初期値に戻し、表示も合わせます。

`ComboboxController` を `combobox`、`PickerController` を `picker` として登録します。選択を変えると `picker:change` を出し、標準の `select` でも `input`・`change` を発火します。`Tag` の見た目に `components/tag.css`、候補の一覧に `components/field.css` も読み込みます。

候補を取得し直した時は、`PickerController` の `replaceOptions(options)` へ新しい候補を渡します。新しい候補にも残る選択は保ち、選択が変わった時は標準の `select` で `input`・`change` を発火します。候補の取得と通信は利用側が行います。

JavaScriptが無い時は、検索欄を出さず、標準の `select` をそのまま使います。一つを選ぶ時は先頭に「選択してください」の空の選択肢を置きます。

## キーボード

| キー                             | 動作                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| ↓ / ↑                            | 一覧を開き、次・前の候補へ移ります。                            |
| Home / End（一覧が開いている時） | 最初・最後の候補へ移ります。                                    |
| Enter（一覧が開いている時）      | 移った候補を選びます。`multiple` で選び済みの候補なら外します。 |
| Escape（一覧が開いている時）     | 一覧を閉じます。                                                |
| Tab                              | 検索欄の次に、選んだ `Tag` の解除の操作へ移ります。             |

## アクセシビリティ

- controllerが動くと、ラベルの `for` を標準の `select` から検索欄へ移します。検索欄は `role="combobox"` と `aria-autocomplete="list"` で、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。
- 候補の一覧は「（`label`）の候補」、選んだ値の並びは「選択中」、`Tag` の解除の操作は「（候補の名前）を解除」という読み上げ名にします。
- 候補が無い時や未選択の時の知らせは `role="status"` の領域で読み上げます。
- `help`・`error` は標準の `select` と検索欄の両方へ説明として関連付け、`error` がある時は両方を `aria-invalid` にします。

## イベント

| イベント                | 内容                                                                                                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `picker:change`         | 選択を変えた後に出します。detailは `selected`（選んでいる値の配列）・`value`（標準の `select` の値）です。取り消せません。                                                                                                                                       |
| `combobox:beforechange` | 候補を選ぶ前に出します。取り消すとその候補を選びません。detailは `value`（押した候補の値）・`selected`（選んだ後の値の配列。一つを選ぶ時は押した候補だけ）・`previousSelected`（選ぶ前の値の配列）・`reason` です。選んだ結果は `picker:change` で受け取ります。 |

## API

### Picker

選択値は標準selectが送信し、検索欄は選択のためだけに使う。

| 名前              | 型                            | 既定値         | 説明                                                                                                   |
| ----------------- | ----------------------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| `id`              | `string`                      |                | idの元。省略すると生成する。標準selectは`<id>-native`、検索欄は`<id>-search`になる。                   |
| `label`（必須）   | `string`                      |                | 欄の名前。                                                                                             |
| `name`（必須）    | `string`                      |                | 標準selectのname。選んだ値をこの名前で送信する。                                                       |
| `options`（必須） | `readonly PickerOption[]`     |                | 選べる候補。取得後に入れ替える時はPickerController.replaceOptions()を使う。                            |
| `value`           | `string \| readonly string[]` |                | 最初に選んでおく値。multipleの時は配列で渡す。                                                         |
| `multiple`        | `boolean`                     | `false`        | trueで複数を選べる。選ぶたびに加え、同じ候補をもう一度選ぶか、Tagの解除で外す。                        |
| `required`        | `boolean`                     |                | 標準selectのrequired。未選択で送信すると検索欄へフォーカスが移り、「候補を選択してください。」と出す。 |
| `disabled`        | `boolean`                     |                | 標準selectと検索欄を使えなくする。                                                                     |
| `help`            | `string`                      |                | 欄の下に出す灰色の小さな補足。説明として読み上げる。                                                   |
| `error`           | `string`                      |                | 直す所を書くエラー文。欄をaria-invalidにし、説明として読み上げる。                                     |
| `placeholder`     | `string`                      | `"候補を検索"` | 検索欄のplaceholder。                                                                                  |
| `form`            | `string`                      |                | 標準selectのform属性。フォームの外に置く時に、送信するformのidを渡す。                                 |

登録するcontroller：`combobox`（`ComboboxController`）、`picker`（`PickerController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/picker.css`、`components/tag.css`

#### `PickerOption`

| 名前            | 型        | 既定値 | 説明                                                           |
| --------------- | --------- | ------ | -------------------------------------------------------------- |
| `value`（必須） | `string`  |        | 送信する値。空白だけの値と、重なった値の二つ目以降は出さない。 |
| `label`（必須） | `string`  |        | 候補に出す名前。検索はこの名前で絞り込む。                     |
| `disabled`      | `boolean` |        | 一覧に出すが選べなくする。                                     |

## コード

```tsx
import { Picker } from "@tknf/retrix/hono";

const people = [
  { value: "tanaka", label: "田中 遥" },
  { value: "sato", label: "佐藤 健" },
  { value: "suzuki", label: "鈴木 美咲" },
  { value: "unavailable", label: "選択できない担当者", disabled: true },
];

export default () => (
  <div class="rx-stack">
    <Picker
      id="picker-owner"
      label="担当者"
      name="owner"
      options={people}
      value="tanaka"
    />
    <Picker
      id="picker-reviewers"
      label="確認する人"
      name="reviewers"
      options={people}
      value={["sato", "suzuki"]}
      multiple
      help="複数人を選べます。"
    />
    <Picker
      id="picker-required"
      label="必須の担当者"
      name="required-owner"
      options={people}
      required
      error="担当者を選択してください。"
    />
    <Picker
      id="picker-disabled"
      label="変更できない担当者"
      name="locked-owner"
      options={people}
      value="tanaka"
      disabled
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div
    class="rx-combobox rx-picker"
    data-controller="combobox picker"
    data-combobox-multiple-value="true"
    data-combobox-selected-value='["tanaka"]'
    data-picker-multiple-value="false"
    data-action="combobox:change-&gt;picker#selectionChanged"
  >
    <label
      class="label"
      id="picker-owner-label"
      for="picker-owner-native"
      data-picker-target="label"
      >担当者</label
    ><select
      id="picker-owner-native"
      name="owner"
      data-picker-target="native"
      class="rx-input native"
    >
      <option value="">選択してください</option>
      <option value="tanaka" selected="">田中 遥</option>
      <option value="sato">佐藤 健</option>
      <option value="suzuki">鈴木 美咲</option>
      <option value="unavailable" disabled="">選択できない担当者</option></select
    ><input
      id="picker-owner-search"
      type="search"
      role="combobox"
      aria-labelledby="picker-owner-label"
      aria-controls="picker-owner-options"
      aria-expanded="false"
      aria-autocomplete="list"
      autocomplete="off"
      placeholder="候補を検索"
      data-combobox-target="input"
      data-picker-target="search"
      hidden=""
      class="rx-input search"
    />
    <ul class="values" data-picker-target="values" aria-label="選択中" hidden=""></ul>
    <template data-picker-target="template"
      ><li>
        <span class="rx-tag removable"
          ><span class="label"></span
          ><button
            data-icon-only="true"
            aria-label="選択を解除"
            class="rx-button remove"
            type="button"
            data-variant="link"
            data-size="tag"
          ></button
        ></span></li
    ></template>
    <ul
      class="options"
      id="picker-owner-options"
      role="listbox"
      aria-label="担当者の候補"
      data-combobox-target="listbox"
      data-picker-target="listbox"
      hidden=""
    >
      <li
        id="picker-owner-option-0"
        role="option"
        aria-selected="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="tanaka"
      >
        田中 遥
      </li>
      <li
        id="picker-owner-option-1"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="sato"
      >
        佐藤 健
      </li>
      <li
        id="picker-owner-option-2"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="suzuki"
      >
        鈴木 美咲
      </li>
      <li
        id="picker-owner-option-3"
        role="option"
        aria-selected="false"
        aria-disabled="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="unavailable"
      >
        選択できない担当者
      </li>
    </ul>
    <p class="note" data-picker-target="note" role="status" hidden="">
      一致する候補はありません。
    </p>
  </div>
  <div
    class="rx-combobox rx-picker"
    data-controller="combobox picker"
    data-combobox-multiple-value="true"
    data-combobox-selected-value='["sato","suzuki"]'
    data-picker-multiple-value="true"
    data-action="combobox:change-&gt;picker#selectionChanged"
  >
    <label
      class="label"
      id="picker-reviewers-label"
      for="picker-reviewers-native"
      data-picker-target="label"
      >確認する人</label
    ><select
      id="picker-reviewers-native"
      name="reviewers"
      multiple=""
      aria-describedby="picker-reviewers-help"
      data-picker-target="native"
      class="rx-input native"
    >
      <option value="tanaka">田中 遥</option>
      <option value="sato" selected="">佐藤 健</option>
      <option value="suzuki" selected="">鈴木 美咲</option>
      <option value="unavailable" disabled="">選択できない担当者</option></select
    ><input
      id="picker-reviewers-search"
      type="search"
      role="combobox"
      aria-labelledby="picker-reviewers-label"
      aria-controls="picker-reviewers-options"
      aria-expanded="false"
      aria-autocomplete="list"
      aria-describedby="picker-reviewers-help"
      autocomplete="off"
      placeholder="候補を検索"
      data-combobox-target="input"
      data-picker-target="search"
      hidden=""
      class="rx-input search"
    />
    <ul class="values" data-picker-target="values" aria-label="選択中" hidden=""></ul>
    <template data-picker-target="template"
      ><li>
        <span class="rx-tag removable"
          ><span class="label"></span
          ><button
            data-icon-only="true"
            aria-label="選択を解除"
            class="rx-button remove"
            type="button"
            data-variant="link"
            data-size="tag"
          ></button
        ></span></li
    ></template>
    <ul
      class="options"
      id="picker-reviewers-options"
      role="listbox"
      aria-label="確認する人の候補"
      data-combobox-target="listbox"
      data-picker-target="listbox"
      hidden=""
    >
      <li
        id="picker-reviewers-option-0"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="tanaka"
      >
        田中 遥
      </li>
      <li
        id="picker-reviewers-option-1"
        role="option"
        aria-selected="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="sato"
      >
        佐藤 健
      </li>
      <li
        id="picker-reviewers-option-2"
        role="option"
        aria-selected="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="suzuki"
      >
        鈴木 美咲
      </li>
      <li
        id="picker-reviewers-option-3"
        role="option"
        aria-selected="false"
        aria-disabled="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="unavailable"
      >
        選択できない担当者
      </li>
    </ul>
    <p class="note" data-picker-target="note" role="status" hidden="">
      一致する候補はありません。
    </p>
    <div class="messages">
      <p class="help" id="picker-reviewers-help">複数人を選べます。</p>
    </div>
  </div>
  <div
    class="rx-combobox rx-picker"
    data-controller="combobox picker"
    data-combobox-multiple-value="true"
    data-combobox-selected-value="[]"
    data-picker-multiple-value="false"
    data-action="combobox:change-&gt;picker#selectionChanged"
  >
    <label
      class="label"
      id="picker-required-label"
      for="picker-required-native"
      data-picker-target="label"
      >必須の担当者</label
    ><select
      id="picker-required-native"
      name="required-owner"
      required=""
      aria-describedby="picker-required-error"
      aria-invalid="true"
      data-invalid="true"
      data-picker-target="native"
      class="rx-input native"
    >
      <option value="">選択してください</option>
      <option value="tanaka">田中 遥</option>
      <option value="sato">佐藤 健</option>
      <option value="suzuki">鈴木 美咲</option>
      <option value="unavailable" disabled="">選択できない担当者</option></select
    ><input
      id="picker-required-search"
      type="search"
      role="combobox"
      aria-labelledby="picker-required-label"
      aria-controls="picker-required-options"
      aria-expanded="false"
      aria-autocomplete="list"
      aria-describedby="picker-required-error"
      aria-invalid="true"
      data-invalid="true"
      autocomplete="off"
      placeholder="候補を検索"
      data-combobox-target="input"
      data-picker-target="search"
      hidden=""
      class="rx-input search"
    />
    <ul class="values" data-picker-target="values" aria-label="選択中" hidden=""></ul>
    <template data-picker-target="template"
      ><li>
        <span class="rx-tag removable"
          ><span class="label"></span
          ><button
            data-icon-only="true"
            aria-label="選択を解除"
            class="rx-button remove"
            type="button"
            data-variant="link"
            data-size="tag"
          ></button
        ></span></li
    ></template>
    <ul
      class="options"
      id="picker-required-options"
      role="listbox"
      aria-label="必須の担当者の候補"
      data-combobox-target="listbox"
      data-picker-target="listbox"
      hidden=""
    >
      <li
        id="picker-required-option-0"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="tanaka"
      >
        田中 遥
      </li>
      <li
        id="picker-required-option-1"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="sato"
      >
        佐藤 健
      </li>
      <li
        id="picker-required-option-2"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="suzuki"
      >
        鈴木 美咲
      </li>
      <li
        id="picker-required-option-3"
        role="option"
        aria-selected="false"
        aria-disabled="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="unavailable"
      >
        選択できない担当者
      </li>
    </ul>
    <p class="note" data-picker-target="note" role="status" hidden="">
      一致する候補はありません。
    </p>
    <div class="messages">
      <p class="error" id="picker-required-error">
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span>担当者を選択してください。</span>
      </p>
    </div>
  </div>
  <div
    class="rx-combobox rx-picker"
    data-controller="combobox picker"
    data-combobox-multiple-value="true"
    data-combobox-selected-value='["tanaka"]'
    data-picker-multiple-value="false"
    data-action="combobox:change-&gt;picker#selectionChanged"
  >
    <label
      class="label"
      id="picker-disabled-label"
      for="picker-disabled-native"
      data-picker-target="label"
      >変更できない担当者</label
    ><select
      id="picker-disabled-native"
      name="locked-owner"
      disabled=""
      data-picker-target="native"
      class="rx-input native"
    >
      <option value="">選択してください</option>
      <option value="tanaka" selected="">田中 遥</option>
      <option value="sato">佐藤 健</option>
      <option value="suzuki">鈴木 美咲</option>
      <option value="unavailable" disabled="">選択できない担当者</option></select
    ><input
      id="picker-disabled-search"
      type="search"
      role="combobox"
      aria-labelledby="picker-disabled-label"
      aria-controls="picker-disabled-options"
      aria-expanded="false"
      aria-autocomplete="list"
      autocomplete="off"
      placeholder="候補を検索"
      disabled=""
      data-combobox-target="input"
      data-picker-target="search"
      hidden=""
      class="rx-input search"
    />
    <ul class="values" data-picker-target="values" aria-label="選択中" hidden=""></ul>
    <template data-picker-target="template"
      ><li>
        <span class="rx-tag removable"
          ><span class="label"></span
          ><button
            data-icon-only="true"
            aria-label="選択を解除"
            class="rx-button remove"
            type="button"
            data-variant="link"
            data-size="tag"
          ></button
        ></span></li
    ></template>
    <ul
      class="options"
      id="picker-disabled-options"
      role="listbox"
      aria-label="変更できない担当者の候補"
      data-combobox-target="listbox"
      data-picker-target="listbox"
      hidden=""
    >
      <li
        id="picker-disabled-option-0"
        role="option"
        aria-selected="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="tanaka"
      >
        田中 遥
      </li>
      <li
        id="picker-disabled-option-1"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="sato"
      >
        佐藤 健
      </li>
      <li
        id="picker-disabled-option-2"
        role="option"
        aria-selected="false"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="suzuki"
      >
        鈴木 美咲
      </li>
      <li
        id="picker-disabled-option-3"
        role="option"
        aria-selected="false"
        aria-disabled="true"
        data-combobox-target="option"
        data-picker-target="option"
        data-combobox-value="unavailable"
      >
        選択できない担当者
      </li>
    </ul>
    <p class="note" data-picker-target="note" role="status" hidden="">
      一致する候補はありません。
    </p>
  </div>
</div>
```

</details>
