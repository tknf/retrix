<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Treegrid

階層のある行を、列をそろえて表示します。

## 使いどころ

- フォルダと資料、章と節のように親子の階層を持つ行を、担当・状態などの列と並べて見比べる時に使います。
- 列を持たない階層は `Tree`、階層のない行の一覧は `Table` を使います。

## 使い方

`columns` の先頭は行の題名（`label`）の列で、2列目以降に各行の `cells` を順に入れます。`children` を渡した行には開閉ボタンを付け、子の行を一つ深い階層として12pxずつ字下げして続けます。見出しの灰色の帯・行・罫線は `Table` と同じ見た目で、行の題名はMediumの太さです。`value` は全ての階層で一意にします。空の `value` と、重複した `value` の行は、その子孫ごと描きません。

`expanded` に最初に開いておく行、`selection` に選択の方式、`selected` に最初に選んでおく行を、それぞれ `value` で渡します。開閉と選択はその後controllerが持つので、保存したい時はイベントで受け取ります。開閉ボタンを押すと行を開閉し、`selection` が `none` 以外の時はセルを押すと行を選びます。選んだ行は `Table` と同じ黄色で塗ります。

`href` は子を持たない行だけでリンクになります。`disabled` の行はリンクにせず、題名の文字だけを灰色にし、押してもShift + Spaceでも選べません。キーでの移動には残ります。

`state` は `ready`・`loading`・`empty`・`error` です。`items` が0件なら `ready` でも `empty` として扱います。`ready` 以外では見出しの行だけを残して状態の文（または `stateContent`）を出し、controllerを付けません。

`TreegridController` を `treegrid` として登録します。JavaScriptなしでは、全ての行を開いた状態で表示し、動かない開閉ボタンは隠します。選択もできません。行のデータ・開閉と選択の保存は利用側が持ちます。

## キーボード

| キー                     | 動作                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| ↑ / ↓                    | 表示中の上下の行の、同じ列のセルへ移動します。                                                                             |
| ← / →                    | 前後の列のセルへ移動します。右から左に読む時は向きが入れ替わります。                                                       |
| Home / End               | 行の最初・最後のセルへ移動します。                                                                                         |
| Ctrl + Home / Ctrl + End | 表の最初・最後のセルへ移動します。                                                                                         |
| PageUp / PageDown        | `pageSize` の行数だけ上下へ移動します。                                                                                    |
| Enter                    | 子を持つ行の先頭のセルで、行を開閉します。                                                                                 |
| Shift + Space            | `selection` が `single`・`multiple` の時に、行を選びます。`multiple` では選択を切り替えます。`disabled` の行は選べません。 |

## アクセシビリティ

- ready の時は表に `role="treegrid"` と `caption` と同じ `aria-label` を付けます。行には `aria-level`・`aria-posinset`・`aria-setsize`、子を持つ行には `aria-expanded` を付けます。
- `selection="multiple"` では表に `aria-multiselectable="true"` を付け、各行に `aria-selected` を付けます。`single` では選んだ行だけに `aria-selected="true"` を付けます。
- セルのTab停止点は表の中で一つだけで、最後にいたセルに戻ります。行の題名のリンクは別にTabで止まります。開閉ボタンはTabで止まらず、読み上げ名は「〇〇を開閉」です。
- セルの中のリンクやボタンを押しても行は選ばれません。
- 状態の文は `role="status"` で、`loading` では表に `aria-busy="true"` を付けます。

## イベント

| イベント                | 内容                                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treegrid:beforetoggle` | 行を開閉する前に発火します。取り消せます。detailは `{ value, expanded, reason }` で、`expanded` は開くなら `true`、`reason` は `pointer`・`keyboard` です。                             |
| `treegrid:toggle`       | 行を開閉した後に発火します。detailは `treegrid:beforetoggle` と同じです。                                                                                                               |
| `treegrid:beforechange` | 選択が変わる前に発火します。取り消せます。detailは `{ selected, previousSelected, reason }` で、`selected` は選ばれる行の `value` の配列です。`disabled` の行を押した時は発火しません。 |
| `treegrid:change`       | 選択が変わった後に発火します。detailは `treegrid:beforechange` と同じです。                                                                                                             |

## API

### Treegrid

Tableの見た目・階層表示を共有し、開閉と二次元移動はTreegridController（上流を継承）に委ねる。

| 名前              | 型                                           | 既定値      | 説明                                                                                                                                                                              |
| ----------------- | -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `caption`（必須） | `string`                                     |             | 表の名前。captionとaria-labelに入れる。空白だけの時は「階層表」にする。                                                                                                           |
| `columns`（必須） | `readonly TreegridColumn[]`                  |             | 列。先頭の列は行の題名（label）の列になる。空の時は「項目」の一列にする。                                                                                                         |
| `items`（必須）   | `readonly TreegridItem[]`                    |             | 最上位の行。0件の時はstateがreadyでもemptyとして扱う。                                                                                                                            |
| `expanded`        | `readonly string[]`                          | `[]`        | 最初に開いておく行のvalue。開閉はその後controllerが持ち、保存したい時はtreegrid:toggleで受け取る。 JavaScriptがない時は開閉できないので、全ての行を開いて見せ、開閉ボタンを隠す。 |
| `selection`       | `"none" \| "single" \| "multiple"`           | `"none"`    | 行の選択。singleは一行、multipleは複数行を選べ、noneは選択を持たない。                                                                                                            |
| `selected`        | `readonly string[]`                          | `[]`        | 最初に選んでおく行のvalue。singleでは表の並びで最初の一つだけを使う。                                                                                                             |
| `pageSize`        | `number`                                     | `10`        | PageUp・PageDownで移動する行数。1以上の整数でない時は10にする。                                                                                                                   |
| `density`         | `"compact" \| "comfortable"`                 | `"compact"` | 本文の行の密度。Tableのdensityと同じ。                                                                                                                                            |
| `state`           | `"ready" \| "loading" \| "empty" \| "error"` | `"ready"`   | 表の状態。ready以外では見出しの行だけを残し、状態の文を出す。キー操作・開閉・選択も付けない。                                                                                     |
| `stateContent`    | `Child`                                      |             | ready以外の時に、既定の状態の文の代わりに出す内容。                                                                                                                               |

登録するcontroller：`treegrid`（`TreegridController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/overlay.css`、`components/table.css`、`components/treegrid.css`

#### `TreegridColumn`

| 名前              | 型                               | 既定値 | 説明                                                                                                                           |
| ----------------- | -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `heading`（必須） | `string`                         |        | 列の見出しの文字。                                                                                                             |
| `cell`            | `"text" \| "short" \| "numeric"` |        | 列の文字の扱い。Tableのdata-cellと同じで、textは長文を折り返し、shortは折り返さず、numericは末尾側へそろえて等幅の数字にする。 |

#### `TreegridItem`

| 名前            | 型                        | 既定値 | 説明                                                                                                      |
| --------------- | ------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `value`（必須） | `string`                  |        | 行を識別する値。全ての階層で一意にする。空の値と重複した値の行は、その子孫ごと描かない。                  |
| `label`（必須） | `string`                  |        | 先頭の列に出す行の題名。空白だけの時はvalueを出す。                                                       |
| `href`          | `string`                  |        | 葉の行だけに設定する移動先。                                                                              |
| `disabled`      | `boolean`                 |        | 行を利用できない状態。リンクにせず、押してもShift+Spaceでも選べない。行とセルのキーボード移動は維持する。 |
| `cells`         | `readonly Child[]`        |        | 2列目以降のセル。columnsの2番目からの順に対応させ、足りないセルには「—」を出す。                          |
| `children`      | `readonly TreegridItem[]` |        | 子の行。渡すと行に開閉ボタンを付け、一つ深い階層として続けて描く。                                        |

## コード

```tsx
import { Badge, Disclosure, Treegrid } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Treegrid
      caption="公開資料と進行状況"
      columns={[
        { heading: "資料", cell: "text" },
        { heading: "担当" },
        { heading: "状態" },
      ]}
      expanded={["guide"]}
      selection="single"
      items={[
        {
          value: "guide",
          label: "利用案内",
          cells: ["編集チーム", <Badge tone="info">確認中</Badge>],
          children: [
            {
              value: "guide-start",
              label: "はじめに",
              href: "#treegrid-guide-start",
              cells: ["田中", <Badge tone="success">公開中</Badge>],
            },
            {
              value: "guide-admin",
              label: "管理者向け",
              cells: ["佐藤", <Badge draft>下書き</Badge>],
              children: [
                {
                  value: "guide-admin-access",
                  label: "アクセス権限の設定と確認",
                  cells: ["佐藤", <Badge draft>下書き</Badge>],
                },
              ],
            },
          ],
        },
        {
          value: "terms",
          label: "利用規約",
          href: "#treegrid-terms",
          cells: ["法務", <Badge tone="success">公開中</Badge>],
        },
      ]}
    />
    <Disclosure summary="複数選択・利用できないリンク・長い階層">
      <Treegrid
        caption="素材の確認"
        columns={[
          { heading: "名前", cell: "text" },
          { heading: "形式", cell: "short" },
        ]}
        selection="multiple"
        selected={["draft"]}
        expanded={["assets"]}
        density="comfortable"
        items={[
          {
            value: "assets",
            label: "素材",
            cells: ["フォルダ"],
            children: [
              {
                value: "draft",
                label: "確認待ちの原稿",
                href: "#treegrid-draft",
                cells: ["文書"],
              },
              {
                value: "archived",
                label: "閲覧不可の資料",
                disabled: true,
                cells: ["文書"],
              },
            ],
          },
        ]}
      />
    </Disclosure>
    <Disclosure summary="空・読み込み中・読み込み失敗">
      {(["empty", "loading", "error"] as const).map((state) => (
        <Treegrid
          caption={
            state === "empty"
              ? "空の資料"
              : state === "loading"
                ? "読み込み中の資料"
                : "読み込みに失敗した資料"
          }
          columns={[{ heading: "資料" }, { heading: "状態" }]}
          items={[]}
          state={state}
        />
      ))}
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-table rx-treegrid" data-state="ready">
    <table
      class="table"
      role="treegrid"
      aria-label="公開資料と進行状況"
      data-density="compact"
      data-controller="treegrid"
      data-treegrid-expanded-value='["guide"]'
      data-treegrid-selection-value="single"
      data-treegrid-selected-value="[]"
      data-treegrid-page-size-value="10"
    >
      <caption>
        公開資料と進行状況
      </caption>
      <thead>
        <tr>
          <th scope="col" data-cell="text">資料</th>
          <th scope="col">担当</th>
          <th scope="col">状態</th>
        </tr>
      </thead>
      <tbody>
        <tr
          data-treegrid-target="row"
          data-treegrid-value="guide"
          data-treegrid-level="1"
          aria-level="1"
          aria-posinset="1"
          aria-setsize="2"
          style="--rx-treegrid-depth: 0"
        >
          <th scope="row" data-cell="text" tabindex="0">
            <span class="node"
              ><button
                data-icon-only="true"
                data-treegrid-target="toggle"
                aria-label="利用案内を開閉"
                tabindex="-1"
                class="rx-button toggle"
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
                  <use href="/assets/rx-icons.svg#rx-caret"></use>
                </svg></button
              ><span class="label">利用案内</span></span
            >
          </th>
          <td tabindex="-1">編集チーム</td>
          <td tabindex="-1"><span class="rx-badge" data-tone="info">確認中</span></td>
        </tr>
        <tr
          data-treegrid-target="row"
          data-treegrid-value="guide-start"
          data-treegrid-level="2"
          aria-level="2"
          aria-posinset="1"
          aria-setsize="2"
          style="--rx-treegrid-depth: 1"
        >
          <th scope="row" data-cell="text" tabindex="-1">
            <span class="node"
              ><span class="spacer" aria-hidden="true"></span
              ><a href="#treegrid-guide-start">はじめに</a></span
            >
          </th>
          <td tabindex="-1">田中</td>
          <td tabindex="-1">
            <span class="rx-badge" data-tone="success">公開中</span>
          </td>
        </tr>
        <tr
          data-treegrid-target="row"
          data-treegrid-value="guide-admin"
          data-treegrid-level="2"
          aria-level="2"
          aria-posinset="2"
          aria-setsize="2"
          style="--rx-treegrid-depth: 1"
        >
          <th scope="row" data-cell="text" tabindex="-1">
            <span class="node"
              ><button
                data-icon-only="true"
                data-treegrid-target="toggle"
                aria-label="管理者向けを開閉"
                tabindex="-1"
                class="rx-button toggle"
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
                  <use href="/assets/rx-icons.svg#rx-caret"></use>
                </svg></button
              ><span class="label">管理者向け</span></span
            >
          </th>
          <td tabindex="-1">佐藤</td>
          <td tabindex="-1">
            <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span>
          </td>
        </tr>
        <tr
          data-treegrid-target="row"
          data-treegrid-value="guide-admin-access"
          data-treegrid-level="3"
          aria-level="3"
          aria-posinset="1"
          aria-setsize="1"
          style="--rx-treegrid-depth: 2"
        >
          <th scope="row" data-cell="text" tabindex="-1">
            <span class="node"
              ><span class="spacer" aria-hidden="true"></span
              ><span class="label">アクセス権限の設定と確認</span></span
            >
          </th>
          <td tabindex="-1">佐藤</td>
          <td tabindex="-1">
            <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span>
          </td>
        </tr>
        <tr
          data-treegrid-target="row"
          data-treegrid-value="terms"
          data-treegrid-level="1"
          aria-level="1"
          aria-posinset="2"
          aria-setsize="2"
          style="--rx-treegrid-depth: 0"
        >
          <th scope="row" data-cell="text" tabindex="-1">
            <span class="node"
              ><span class="spacer" aria-hidden="true"></span
              ><a href="#treegrid-terms">利用規約</a></span
            >
          </th>
          <td tabindex="-1">法務</td>
          <td tabindex="-1">
            <span class="rx-badge" data-tone="success">公開中</span>
          </td>
        </tr>
      </tbody>
    </table>
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
        ><span class="title">複数選択・利用できないリンク・長い階層</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-table rx-treegrid" data-state="ready">
        <table
          class="table"
          role="treegrid"
          aria-label="素材の確認"
          aria-multiselectable="true"
          data-density="comfortable"
          data-controller="treegrid"
          data-treegrid-expanded-value='["assets"]'
          data-treegrid-selection-value="multiple"
          data-treegrid-selected-value='["draft"]'
          data-treegrid-page-size-value="10"
        >
          <caption>
            素材の確認
          </caption>
          <thead>
            <tr>
              <th scope="col" data-cell="text">名前</th>
              <th scope="col" data-cell="short">形式</th>
            </tr>
          </thead>
          <tbody>
            <tr
              data-treegrid-target="row"
              data-treegrid-value="assets"
              data-treegrid-level="1"
              aria-level="1"
              aria-posinset="1"
              aria-setsize="1"
              aria-selected="false"
              style="--rx-treegrid-depth: 0"
            >
              <th scope="row" data-cell="text" tabindex="0">
                <span class="node"
                  ><button
                    data-icon-only="true"
                    data-treegrid-target="toggle"
                    aria-label="素材を開閉"
                    tabindex="-1"
                    class="rx-button toggle"
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
                      <use href="/assets/rx-icons.svg#rx-caret"></use>
                    </svg></button
                  ><span class="label">素材</span></span
                >
              </th>
              <td data-cell="short" tabindex="-1">フォルダ</td>
            </tr>
            <tr
              data-treegrid-target="row"
              data-treegrid-value="draft"
              data-treegrid-level="2"
              data-selected="true"
              aria-level="2"
              aria-posinset="1"
              aria-setsize="2"
              aria-selected="true"
              style="--rx-treegrid-depth: 1"
            >
              <th scope="row" data-cell="text" tabindex="-1">
                <span class="node"
                  ><span class="spacer" aria-hidden="true"></span
                  ><a href="#treegrid-draft">確認待ちの原稿</a></span
                >
              </th>
              <td data-cell="short" tabindex="-1">文書</td>
            </tr>
            <tr
              data-treegrid-target="row"
              data-treegrid-value="archived"
              data-treegrid-level="2"
              data-disabled="true"
              aria-level="2"
              aria-posinset="2"
              aria-setsize="2"
              aria-selected="false"
              style="--rx-treegrid-depth: 1"
            >
              <th scope="row" data-cell="text" tabindex="-1">
                <span class="node"
                  ><span class="spacer" aria-hidden="true"></span
                  ><span class="label">閲覧不可の資料</span></span
                >
              </th>
              <td data-cell="short" tabindex="-1">文書</td>
            </tr>
          </tbody>
        </table>
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
        ><span class="title">空・読み込み中・読み込み失敗</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-table rx-treegrid" data-state="empty">
        <table class="table" aria-label="空の資料" data-density="compact">
          <caption>
            空の資料
          </caption>
          <thead>
            <tr>
              <th scope="col">資料</th>
              <th scope="col">状態</th>
            </tr>
          </thead>
        </table>
        <div class="state" role="status">表示する項目はありません。</div>
      </div>
      <div class="rx-table rx-treegrid" data-state="loading">
        <table
          class="table"
          aria-label="読み込み中の資料"
          aria-busy="true"
          data-density="compact"
        >
          <caption>
            読み込み中の資料
          </caption>
          <thead>
            <tr>
              <th scope="col">資料</th>
              <th scope="col">状態</th>
            </tr>
          </thead>
        </table>
        <div class="state" role="status">読み込んでいます…</div>
      </div>
      <div class="rx-table rx-treegrid" data-state="error">
        <table class="table" aria-label="読み込みに失敗した資料" data-density="compact">
          <caption>
            読み込みに失敗した資料
          </caption>
          <thead>
            <tr>
              <th scope="col">資料</th>
              <th scope="col">状態</th>
            </tr>
          </thead>
        </table>
        <div class="state" role="status">一覧を読み込めませんでした。</div>
      </div>
    </div>
  </details>
</div>
```

</details>
