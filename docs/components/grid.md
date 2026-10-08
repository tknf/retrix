<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Grid

行と列の見出しを見ながら、縦横に並んだセルを確認・選択する表です。

## 使いどころ

- 日と時間の空き枠のように、行と列の交わりで意味が決まる表を、矢印キーでセルごとに読ませる時に使います。
- 列ごとに見比べる一覧で、並べ替えや行の選択が要る時は `Table`、行に親子の階層がある時は `Treegrid` を使います。
- 月の日付から選ばせる時は `Calendar` を使います。

## 使い方

`caption`・`rowHeader`・`columns`・`rows` を渡します。先頭の列は行の見出し（`rows[].label`）で、`rowHeader` はその列の見出しです。各行の `cells` は `columns` と同じ数、同じ順に渡します。`caption` か `rowHeader` が空の時、`columns` が0列の時、`pageSize` が1以上の整数でない時、`cells` の数が合わない時は、描く時にエラーにします。

`columns` の `current` は今日の列として、見出しのセルを黄色のハイライト（#ffffcc）で塗ります。列の見出しは `Table` と同じく、平らな灰色の帯（#e9e9e9）に12pxの黒い太字で置き、帯の下端に濃い灰色（#acacac）の1pxの線を引きます。行の見出し（時刻など）は灰色の小さな文字にします。行と列の間は淡い罫線（#e7e7e7）で区切り、ホバーしたセルは淡い灰色、フォーカスしたセルは黒い2pxの枠で示します。`cells` の `disabled` は埋まっている・使えない枠として、面をそのままにして文字だけを灰色にします。表が作業面より広い時は横にスクロールし、行の見出しは先頭側に留めます。

`GridController` を `grid` として登録すると、見出しを含む全てのセルを矢印・Home・End・PageUp・PageDownで移動できます。表の中でTabが止まるのは一か所だけで、最後にいたセルに戻ります。`rows` が0件の時はcontrollerを付けず、表の下に `empty` を出します。

Gridはセルの間の移動だけを持ち、値の選択・予約・更新とそのイベントは持ちません。選んだ枠を使う操作は表の外に置き、どの枠を選んだかの管理とデータの保存は利用側が持ちます。JavaScriptなしでは、見出し付きの通常の表として読めます。

## キーボード

| キー                     | 動作                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| ↑ / ↓                    | 上下のセルへ移動します。                                             |
| ← / →                    | 前後の列のセルへ移動します。右から左に読む時は向きが入れ替わります。 |
| Home / End               | 行の最初・最後のセルへ移動します。                                   |
| Ctrl + Home / Ctrl + End | 表の最初・最後のセルへ移動します。                                   |
| PageUp / PageDown        | `pageSize` の行数だけ上下へ移動します。                              |

## アクセシビリティ

- 行があるときは表に `role="grid"` を付け、`caption` を名前にします。列の見出しは `th scope="col"`、行の見出しは `th scope="row"` です。
- 今日の列の見出しには `aria-current="date"`、使えないセルには `aria-disabled="true"` を付けます。使えないセルにもキーで移動でき、読み上げで使えないことが伝わります。
- セルがフォーカスを受けるので、セルの中にボタンやリンクを置くと、Tabで止まる位置がもう一つ増えます。操作は表の外に置いてください。
- 0件の表示は `role="status"` で知らせます。

## API

### Grid

等列数の native table に上流 GridController の二次元移動を付ける。

| 名前                | 型                      | 既定値                           | 説明                                                       |
| ------------------- | ----------------------- | -------------------------------- | ---------------------------------------------------------- |
| `caption`（必須）   | `string`                |                                  | 表の名前。captionに出す。空にはできない。                  |
| `rowHeader`（必須） | `string`                |                                  | 行の見出しの列の見出し（左上の角の文字）。空にはできない。 |
| `columns`（必須）   | `readonly GridColumn[]` |                                  | 列。1列以上を渡す。                                        |
| `rows`（必須）      | `readonly GridRow[]`    |                                  | 行。0件の時はキー移動を付けず、emptyを出す。               |
| `pageSize`          | `number`                | `10`                             | PageUp・PageDownで移動する行数。1以上の整数にする。        |
| `empty`             | `Child`                 | `"表示できる項目はありません。"` | 行が0件の時に表の下に出す内容。                            |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`grid`（`GridController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/grid.css`

#### `GridColumn`

| 名前            | 型        | 既定値 | 説明                                                              |
| --------------- | --------- | ------ | ----------------------------------------------------------------- |
| `id`（必須）    | `string`  |        | 列を識別する値。見出しとセルのdata-column-idに入れる。            |
| `label`（必須） | `string`  |        | 列の見出しの文字。                                                |
| `current`       | `boolean` |        | 今日の列。見出しのセルを黄色で塗り、aria-current="date"を付ける。 |

#### `GridRow`

| 名前            | 型                    | 既定値 | 説明                                                                     |
| --------------- | --------------------- | ------ | ------------------------------------------------------------------------ |
| `id`（必須）    | `string`              |        | 行を識別する値。行のdata-row-idに入れる。                                |
| `label`（必須） | `string`              |        | 行の見出し（th scope="row"）の文字。横にスクロールしても先頭側に留める。 |
| `cells`（必須） | `readonly GridCell[]` |        | 行のセル。columnsと同じ数、同じ順に渡す。                                |

#### `GridCell`

| 名前              | 型        | 既定値 | 説明                                                                              |
| ----------------- | --------- | ------ | --------------------------------------------------------------------------------- |
| `content`（必須） | `Child`   |        | セルの中身。                                                                      |
| `disabled`        | `boolean` |        | 使えないセル。文字だけを灰色にし、aria-disabledを付ける。キーでの移動先には残る。 |

## コード

```tsx
import { Grid, Disclosure } from "@tknf/retrix/hono";

const days = [
  { id: "mon", label: "月 14" },
  { id: "tue", label: "火 15", current: true },
  { id: "wed", label: "水 16" },
  { id: "thu", label: "木 17" },
  { id: "fri", label: "金 18" },
  { id: "sat", label: "土 19" },
  { id: "sun", label: "日 20" },
] as const;

export default () => (
  <div class="rx-stack">
    <Grid
      caption="会議室の空き時間"
      rowHeader="開始"
      columns={days}
      rows={[
        {
          id: "morning",
          label: "10:00",
          cells: [
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "休館", disabled: true },
          ],
        },
        {
          id: "afternoon",
          label: "14:00",
          cells: [
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "休館", disabled: true },
          ],
        },
      ]}
    />
    <p class="catalog-footnote">
      Tabで表へ入り、矢印キーで日付と時間を移動します。Home・Endは行の端、PageUp・PageDownは行単位で移動します。
      狭い幅では表を横へスクロールできます。予約操作はセル内に置かず、選んだ時間を別の操作へ渡してください。
    </p>
    <Disclosure summary="空の状態">
      <Grid
        caption="検索した時間の空き状況"
        rowHeader="開始"
        columns={days}
        rows={[]}
      />
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-grid">
    <table
      class="table"
      role="grid"
      data-controller="grid"
      data-grid-page-size-value="10"
    >
      <caption>
        会議室の空き時間
      </caption>
      <thead>
        <tr>
          <th scope="col">開始</th>
          <th scope="col" data-column-id="mon"><span class="label">月 14</span></th>
          <th scope="col" data-column-id="tue" data-current="true" aria-current="date">
            <span class="label">火 15</span>
          </th>
          <th scope="col" data-column-id="wed"><span class="label">水 16</span></th>
          <th scope="col" data-column-id="thu"><span class="label">木 17</span></th>
          <th scope="col" data-column-id="fri"><span class="label">金 18</span></th>
          <th scope="col" data-column-id="sat"><span class="label">土 19</span></th>
          <th scope="col" data-column-id="sun"><span class="label">日 20</span></th>
        </tr>
      </thead>
      <tbody>
        <tr data-row-id="morning">
          <th scope="row">10:00</th>
          <td data-column-id="mon">空き</td>
          <td data-column-id="tue" data-disabled="true" aria-disabled="true">
            予約済み
          </td>
          <td data-column-id="wed">空き</td>
          <td data-column-id="thu">空き</td>
          <td data-column-id="fri" data-disabled="true" aria-disabled="true">
            予約済み
          </td>
          <td data-column-id="sat">空き</td>
          <td data-column-id="sun" data-disabled="true" aria-disabled="true">休館</td>
        </tr>
        <tr data-row-id="afternoon">
          <th scope="row">14:00</th>
          <td data-column-id="mon" data-disabled="true" aria-disabled="true">
            予約済み
          </td>
          <td data-column-id="tue">空き</td>
          <td data-column-id="wed">空き</td>
          <td data-column-id="thu" data-disabled="true" aria-disabled="true">
            予約済み
          </td>
          <td data-column-id="fri">空き</td>
          <td data-column-id="sat">空き</td>
          <td data-column-id="sun" data-disabled="true" aria-disabled="true">休館</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="catalog-footnote">
    Tabで表へ入り、矢印キーで日付と時間を移動します。Home・Endは行の端、PageUp・PageDownは行単位で移動します。
    狭い幅では表を横へスクロールできます。予約操作はセル内に置かず、選んだ時間を別の操作へ渡してください。
  </p>
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
      ><span class="label"><span class="title">空の状態</span></span>
    </summary>
    <div class="body">
      <div class="rx-grid">
        <table class="table" data-grid-page-size-value="10">
          <caption>
            検索した時間の空き状況
          </caption>
          <thead>
            <tr>
              <th scope="col">開始</th>
              <th scope="col" data-column-id="mon"><span class="label">月 14</span></th>
              <th
                scope="col"
                data-column-id="tue"
                data-current="true"
                aria-current="date"
              >
                <span class="label">火 15</span>
              </th>
              <th scope="col" data-column-id="wed"><span class="label">水 16</span></th>
              <th scope="col" data-column-id="thu"><span class="label">木 17</span></th>
              <th scope="col" data-column-id="fri"><span class="label">金 18</span></th>
              <th scope="col" data-column-id="sat"><span class="label">土 19</span></th>
              <th scope="col" data-column-id="sun"><span class="label">日 20</span></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <p class="empty" role="status">表示できる項目はありません。</p>
      </div>
    </div>
  </details>
</div>
```

</details>
