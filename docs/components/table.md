<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Table

数値・短い状態・長い文章を、列の役割に合わせて表示します。

## 使いどころ

- 複数の項目を同じ列で見比べる時に使います。マスタの一覧のような画面の中心になります。列の並べ替え、列の幅の変更と保存、行の選択と一括操作、見出しの固定を足せます。
- 一件ずつを題名と補足で読ませる一覧は `DataList`、一つの対象の属性は `ValueList` を使います。
- セルの間を矢印キーで移動させたい時は `Grid`、行に親子の階層がある時は `Treegrid` を使います。

## 使い方

`children` に標準の `thead`・`tbody`・`tfoot` を書きます。`caption` は表の名前として自動で置きます。セルに `data-cell="numeric"` を付けると末尾側へそろえて等幅の数字にし、`data-cell="short"` は折り返さず、`data-cell="text"` は14em以上の幅で長文を折り返します。表が作業面より広い時は、囲みの中で横にスクロールします。

Basecamp Classicの表に合わせ、見出しの行は平らな灰色（#e9e9e9）の帯に12pxの黒い太字で、帯の下端に濃い灰色（#acacac）の1pxの線を引きます。本文の行は12pxで、行の間を淡い灰色（#e7e7e7）の1pxの罫線で区切ります。合計の行（`tfoot`）は上に濃い灰色の線を引いて太字にします。縦の区切り線と外枠は持ちません。ホバーした行は淡い灰色、キーボードで操作中の行は角の無い淡い青、選んだ行は黄色のハイライトにします。行の中のリンクは通常の太さの青緑の文字と下線です。

`density` は既定の `compact` と、本文の行の上下を広げる `comfortable` から選びます。`striped` は本文の偶数行に淡い面を敷き、行が多く横に長い表で行をたどりやすくします。`stickyHeader` は囲みの高さを28remまでにし、縦にスクロールしても見出しの行を上に留めます。

並べ替えは `sort="local" | "manual"` です。並べ替えられる列の見出しは `TableSort` で書きます。`TableSort` 自身が `th` を出力するので、別の `th` で囲まず `thead` の行に直接置きます。見出しを押すたびに昇順・降順・元の順を切り替え、並べている列の見出しを青緑の文字にして矢印を出します。ほかの列の矢印は、見出しにホバーかフォーカスした時だけ出します。

`local` は表示中の行をその場で並べ替えます。比べる値はセルの `data-sort-value`、無ければセルの文字です。数値や日付は `data-sort-value` で表示と分けて渡します（例：表示は「1,280」、値は `1280`）。空の値と `type` で読めない値は、昇順でも降順でも末尾に置きます。同じ値の行は元の順を保ちます。`manual` は行を動かさず、見出しの状態だけを切り替えて `table:sort` を発火するので、サーバー側で並べ替えた行に差し替えます。

選択は `selectable` で有効にします。`TableSelection` はチェックボックスを出力し、`rowId` を渡すと行の選択、省略すると表の全ての行の選択になります。全選択は一部だけ選ばれている時に中間の状態を示し、使えない（`disabled`）行は全選択と範囲選択から外します。フォームで送る行の `TableSelection` には `name`・`value`（必要なら `form`）を渡します。フォームのリセットでは選択の表示も戻します。

行を選ぶと、`ActionDock` と同じ操作バー（白いパネル・角丸3px・影）を画面の下の中央に浮かべて出します。先頭に「N件選択」、続けて `selectionActions` の一括操作を横一列に並べ（`ActionTile` は面を持たない平らなタイル、`Button` もそのまま同じ列に置きます）、入らない時は操作の列だけを横にスクロールします。操作バーの角の×（「選択を解除」）は全ての選択を外し、フォーカスを全選択のチェックボックスへ戻します。操作バーは画面の上に浮かぶだけで、表は動きません。

列の幅は `resizable` で変えられるようにします。`TableResizeController` を `table-resize` として登録すると、列の見出しの末尾側の縁にハンドルを置き、ドラッグか矢印キーで幅を変えます（48〜1200px）。最後の列は残りの幅を使い、行を選ぶチェックの列にはハンドルを置きません。幅を変えた表は列の幅を固定し、長い文は折り返し、短い値は列の幅で切って末尾を省きます。ハンドルをダブルクリックすると全ての列を元の幅に戻します。見出しが複数の列にまたがる表では幅を変えません。

`storageKey` を渡すと、変えた幅をcookie（名前は `tableWidthsCookieName(storageKey)`、値は「120,240,,96」の形式）へ一年間保存し、次に開いた時に戻します。サーバーでcookieを読んで `savedColumnWidths` に渡すと、初回の描画から保存した幅で表示し、読み込み後に幅が変わりません。利用者ごとにサーバーへ保存する時は、`table-resize:change` を受けて保存し、その値を `savedColumnWidths` に渡します。

`state` は `ready`・`loading`・`empty`・`error` です。`ready` 以外では `thead` を保ったまま本文の行を隠し、状態の文（または `stateContent`）を出します。この間は並べ替えのボタンを押せず、選択も付けません。

`sort` か `selectable` を使う時は、`TableController` を `table`、`TableSortController` を `table-sort`、`TableSelectController` を `table-select` として三つとも登録します。JavaScriptなしでは、並べ替えのボタンは押せないまま表示し、チェックボックスは通常のフォームの値として送れます。選択バーは浮かべずに表の下へ置き、件数と×を除いた `selectionActions` を常に出すので、行のチェックと同じformの送信ボタンを渡すと選んだ行を送れます。行のデータ・並べ替えの保存・一括操作の実行は利用側が持ちます。

## キーボード

| キー                             | 動作                                                                                                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab                              | 表の囲みへ移り、見出しのボタン・リンク・チェックボックスを順に移動します。行を選んでいる時は、表の後に選択バーの操作へ進みます。囲みにフォーカスがある時は矢印キーで表をスクロールできます。 |
| Enter / Space（見出し）          | その列で並べ替えます。押すたびに昇順・降順・元の順を切り替えます。                                                                                                                           |
| Space（チェックボックス）        | 行、または全ての行の選択を切り替えます。                                                                                                                                                     |
| ← / →（列の幅のハンドル）        | 列の幅を16pxずつ変えます。Shiftを押していると64pxずつ変えます。右から左に読む言語では向きが逆になります。                                                                                    |
| Home / End（列の幅のハンドル）   | 列の幅を最小（48px）・最大（1200px）にします。                                                                                                                                               |
| Shift + Space / Shift + クリック | 前に操作した行から、この行までをまとめて同じ選択の状態にします。                                                                                                                             |

## アクセシビリティ

- 表の囲みは `role="region"` で、`caption` を名前に持ち、Tabで止まってキーボードでスクロールできます。
- 並べ替えている列の `th` には `aria-sort`（`ascending`・`descending`・`none`）を付けます。`local` で並べ替えると、「記事名を昇順に並べました。」のような文を読み上げ用の `role="status"` で知らせます。
- `TableSelection` の `label` はチェックボックスの `aria-label` になります。どの行か分かる名前（「〇〇を選択」）を付けてください。
- 選択バーは `role="group"`（「選択した行の操作」）で、件数は `aria-live="polite"` で知らせます。選択バーはDOMでは表の後にあるので、行を選んだ後はTabで表の後の一括操作へ進めます。
- 状態の文は `role="status"` で、`loading` では表に `aria-busy="true"` を付けます。
- 列の幅のハンドルは `role="separator"`（縦向き）で、「「記事名」の列の幅」のような読み上げ名と、今の幅を `aria-valuenow`（px）で持ち、Tabで止まります。

## イベント

| イベント                    | 内容                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table:beforesort`          | 並べ替える前に発火します。取り消せます（取り消すと見出しの状態も行も変えません）。detailは `{ column, direction, previousColumn, previousDirection, reason }` で、`direction` は `ascending`・`descending`・`none`、`reason` は `pointer`・`keyboard` です。                                                           |
| `table:sort`                | 並べ替えた後に発火します。detailは `table:beforesort` と同じです。`manual` ではこのイベントを受けて行を差し替えます。                                                                                                                                                                                                  |
| `table-select:beforechange` | 利用者の操作で選択が変わる前に、`table` 要素で発火します。取り消せます。detailは `{ selected, previousSelected, reason }` で、`selected` は選ばれる行の `rowId` の配列です。                                                                                                                                           |
| `table:selectionchange`     | 利用者の操作（チェックボックスと×）で選択が変わった後に発火します。detailは `{ ids, count, scope }` で、`ids` は選んでいる行の `rowId` を表の並びで、`count` はその数、`scope` は表示中の行だけを数えたことを示す `"rendered"` です。フォームのリセットでは発火しません。                                              |
| `table-resize:change`       | 利用者が列の幅を変えた後（ドラッグを離した時・矢印キーを押した時・ダブルクリックで戻した時）に、`table` 要素で発火します。detailは `{ widths, column }` で、`widths` は列ごとの幅（px、幅を決めていない列は `null`）、`column` は変えた列の番号です。元の幅に戻した時は `widths` が空の配列、`column` が `null` です。 |

## API

### Table

| 名前                | 型                                           | 既定値      | 説明                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `caption`（必須）   | `string`                                     |             | 表の名前。captionに出し、スクロールする囲み（role="region"）のaria-labelにも使う。                                                                                                                            |
| `density`           | `"compact" \| "comfortable"`                 | `"compact"` | 本文の行の密度。comfortableは本文の行の上下の余白を広げる。                                                                                                                                                   |
| `striped`           | `boolean`                                    | `false`     | 本文の偶数行に淡い面を敷く。行が多く横に長い表で、行をたどりやすくする。                                                                                                                                      |
| `sort`              | `"local" \| "manual"`                        |             | 並べ替えの方式。TableSortの見出しを押すと、昇順・降順・元の順を順に切り替える。 localは表示中の行をその場で並べ替え、manualは行を動かさずtable:sortイベントだけを発火する（サーバー側で並べ替える時に使う）。 |
| `selectable`        | `boolean`                                    | `false`     | 行の選択を有効にする。TableSelectionのチェックで選び、選んでいる間は画面の下の中央に選択バーを出す。                                                                                                          |
| `selectionActions`  | `Child`                                      |             | 選択バーに件数に続けて並べる一括操作（ActionTileやButton）。selectableの時だけ出す。 JavaScriptがない時は表の下に置くので、行のチェックと同じformの送信ボタンにすると選んだ行を送れる。                       |
| `stickyHeader`      | `boolean`                                    | `false`     | 見出しの行をスクロールしても上に留める。表の囲みの高さを28remまでにし、囲みの中で縦にスクロールする。                                                                                                         |
| `resizable`         | `boolean`                                    | `false`     | 列の幅を変えられるようにする。TableResizeControllerが列の見出しの末尾側の縁にハンドルを置き、ドラッグか矢印キーで幅を変える。最後の列は残りの幅を使う。                                                       |
| `storageKey`        | `string`                                     |             | 列の幅を保存するcookieのキー。resizableの時に使い、cookie名はtableWidthsCookieName(storageKey)。省略すると保存しない。                                                                                        |
| `savedColumnWidths` | `string`                                     |             | サーバーで読んだcookieの値（tableWidthsCookieName(storageKey)の値）。渡すと初回の描画から保存した幅で表示する。                                                                                               |
| `state`             | `"ready" \| "loading" \| "empty" \| "error"` | `"ready"`   | 表の状態。ready以外ではtheadを残して本文の行を隠し、状態の文を出す。並べ替えと選択も止める。loadingではaria-busyを付ける。                                                                                    |
| `stateContent`      | `Child`                                      |             | ready以外の時に、既定の状態の文の代わりに出す内容。                                                                                                                                                           |
| `children`          | `Child`                                      |             | 表の中身。`thead`・`tbody`・`tfoot` を書く。`caption` は自動で置くので書かない。                                                                                                                              |

ほかに、`<table>`へ標準のHTML属性を渡せます。

登録するcontroller：`table`（`TableController`）、`table-sort`（`TableSortController`）、`table-select`（`TableSelectController`）、`table-resize`（`TableResizeController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/table.css`

### TableSort

並べ替え可能な見出しセル。上流controllerの契約に沿ったthを出力する。

| 名前             | 型                             | 既定値   | 説明                                                                                                                                                                                                                                        |
| ---------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `column`（必須） | `string`                       |          | 列を識別する値。表の中で一意にし、table:sortのdetail.columnで渡す。                                                                                                                                                                         |
| `type`           | `"text" \| "number" \| "date"` | `"text"` | sort="local"で値を比べる方法。textは文字の自然順、numberは桁区切りのカンマを除いた数、dateはDate.parseで読める日時で比べる。比べる値はセルのdata-sort-value、無ければセルの文字から読む。読めない値と空の値は、昇順でも降順でも末尾に置く。 |
| `disabled`       | `boolean`                      | `false`  | この列の並べ替えを止める。見出しのボタンを押せなくする。                                                                                                                                                                                    |
| `children`       | `Child`                        |          | 列の見出しの文字。並べ替えのボタンの中に置き、並べ替えを知らせる文にも使う。                                                                                                                                                                |

ほかに、`<th>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`

### TableSelection

rowIdなしは現在の表の全選択。行のcheckboxは送信用name/value/formも指定できる。

| 名前            | 型       | 既定値 | 説明                                                                                                                            |
| --------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | チェックボックスの読み上げ名。aria-labelに入れる（例：「〇〇を選択」「すべての行を選択」）。                                    |
| `rowId`         | `string` |        | 行を識別する値。表の中で一意にし、table:selectionchangeのdetail.idsで渡す。省略すると表の全ての行を選ぶチェックボックスになる。 |

ほかに、`<input>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`

## コード

```tsx
import {
  Table,
  TableSort,
  TableSelection,
  Badge,
  Disclosure,
  DisclosureGroup,
  Button,
  ActionTile,
} from "@tknf/retrix/hono";
const records = [
  {
    id: "guide",
    title: "初めて仕事場を利用する方へ、予約方法と当日の受付について",
    date: "2026-09-15T10:00:00+09:00",
    status: "確認待ち",
    views: 0,
  },
  {
    id: "reading",
    title: "秋の読書会",
    date: "2026-09-14T15:30:00+09:00",
    status: "公開中",
    views: 1280,
  },
  { id: "news", title: "今月のお知らせ", date: "", status: "下書き", views: 0 },
  {
    id: "access",
    title: "アクセスと営業時間",
    date: "2026-09-12T09:00:00+09:00",
    status: "公開中",
    views: 234,
  },
  {
    id: "faq",
    title: "利用前によくある質問",
    date: "2026-09-11T10:00:00+09:00",
    status: "公開中",
    views: 98,
  },
  {
    id: "space",
    title: "会議室の利用案内",
    date: "2026-09-10T10:00:00+09:00",
    status: "下書き",
    views: 12,
  },
  { id: "plan", title: "来月の予定", date: "", status: "下書き", views: 0 },
  {
    id: "review",
    title: "ご利用者からの声",
    date: "2026-09-08T10:00:00+09:00",
    status: "確認待ち",
    views: 8,
  },
];
export default () => (
  <div class="rx-stack">
    <form data-controller="table-demo" data-action="submit->table-demo#confirm">
      <Table
        caption="記事の公開状況"
        sort="local"
        resizable
        storageKey="catalog-articles"
        selectable
        stickyHeader
        selectionActions={
          <Button type="submit" size="compact">
            選択したIDを確認
          </Button>
        }
      >
        <thead>
          <tr>
            <th scope="col">
              <TableSelection label="この表のすべての行を選択" />
            </th>
            <TableSort column="title">記事名</TableSort>
            <TableSort column="updated" type="date">
              更新日時
            </TableSort>
            <TableSort column="status">状態</TableSort>
            <TableSort data-cell="numeric" column="views" type="number">
              閲覧
            </TableSort>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr data-record-id={record.id}>
              <td>
                <TableSelection
                  rowId={record.id}
                  label={record.title + "を選択"}
                  name="ids"
                  value={record.id}
                />
              </td>
              <th scope="row" data-cell="text">
                <a href="/apps/docs">{record.title}</a>
              </th>
              <td data-cell="short" data-sort-value={record.date}>
                {record.date ? (
                  <time datetime={record.date}>
                    {Number(record.date.slice(5, 7))}月
                    {Number(record.date.slice(8, 10))}日
                  </time>
                ) : (
                  "未登録"
                )}
              </td>
              <td data-cell="short">
                <Badge
                  tone={
                    record.status === "公開中"
                      ? "success"
                      : record.status === "確認待ち"
                        ? "info"
                        : "neutral"
                  }
                  draft={record.status === "下書き"}
                >
                  {record.status}
                </Badge>
              </td>
              <td data-cell="numeric" data-sort-value={String(record.views)}>
                {record.views.toLocaleString("ja-JP")}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <output data-table-demo-target="result" class="catalog-footnote" />
    </form>
    <DisclosureGroup label="表の状態">
      <Disclosure summary="基本の表・数値の右揃え" open>
        <Table caption="料金">
          <thead>
            <tr>
              <th scope="col">利用時間</th>
              <th scope="col" data-cell="numeric">
                料金
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1時間</th>
              <td data-cell="numeric">1,200円</td>
            </tr>
            <tr>
              <th scope="row">3時間</th>
              <td data-cell="numeric">3,000円</td>
            </tr>
          </tbody>
        </Table>
      </Disclosure>
      <Disclosure summary="0件・読み込み中・読み込み失敗">
        {(["empty", "loading", "error"] as const).map((state) => (
          <Table
            caption={
              state === "empty"
                ? "検索結果"
                : state === "loading"
                  ? "読み込み中の一覧"
                  : "読み込みに失敗した一覧"
            }
            state={state}
            stateContent={
              state === "error" ? (
                <p>一覧を読み込めませんでした。ページを再読み込みしてください。</p>
              ) : undefined
            }
          >
            <thead>
              <tr>
                <th scope="col">記事名</th>
                <th scope="col">更新日時</th>
                <th scope="col">状態</th>
              </tr>
            </thead>
          </Table>
        ))}
      </Disclosure>
      <Disclosure summary="一括操作が多い表（タイルを格子で並べる）">
        <Table
          caption="資料の整理"
          selectable
          selectionActions={
            <>
              <ActionTile label="公開する" icon="check" />
              <ActionTile label="下書きに戻す" icon="pencil" />
              <ActionTile label="分類をつける" icon="layers" accent="green" />
              <ActionTile label="複製する" icon="files" accent="amber" />
              <ActionTile label="書き出す" icon="file" />
              <ActionTile label="削除する" icon="trash" accent="coral" />
            </>
          }
        >
          <thead>
            <tr>
              <th scope="col">
                <TableSelection label="資料をすべて選択" />
              </th>
              <th scope="col">資料</th>
              <th scope="col">更新</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["guide", "利用案内", "9月15日"],
              ["terms", "利用規約", "9月12日"],
              ["price", "料金表", "9月10日"],
            ].map(([id, title, date]) => (
              <tr>
                <td>
                  <TableSelection rowId={id} label={title + "を選択"} />
                </td>
                <th scope="row">{title}</th>
                <td>{date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Disclosure>
      <Disclosure summary="無効な行・数値の欠損・負の値・密度">
        <Table caption="増減の確認" sort="local" selectable density="comfortable">
          <thead>
            <tr>
              <th>
                <TableSelection label="比較行をすべて選択" />
              </th>
              <TableSort column="label">対象</TableSort>
              <TableSort data-cell="numeric" column="amount" type="number">
                増減
              </TableSort>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <TableSelection rowId="minus" label="減少した項目を選択" />
              </td>
              <th scope="row">減少</th>
              <td data-cell="numeric" data-sort-value="-12800">
                -12,800
              </td>
            </tr>
            <tr>
              <td>
                <TableSelection rowId="missing" label="未確定の項目を選択" disabled />
              </td>
              <th scope="row">未確定</th>
              <td data-cell="numeric" data-sort-value="">
                —
              </td>
            </tr>
            <tr>
              <td>
                <TableSelection rowId="zero" label="変更なしの項目を選択" />
              </td>
              <th scope="row">変更なし</th>
              <td data-cell="numeric" data-sort-value="0">
                0
              </td>
            </tr>
          </tbody>
        </Table>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <form data-controller="table-demo" data-action="submit-&gt;table-demo#confirm">
    <div
      class="rx-table"
      role="region"
      aria-label="記事の公開状況"
      tabindex="0"
      data-controller="table"
      data-sort-mode="local"
      data-state="ready"
      data-sticky="true"
    >
      <table
        data-controller="table-sort table-select table-resize"
        data-table-resize-storage-key-value="catalog-articles"
        data-density="compact"
        class="table"
      >
        <caption>
          記事の公開状況
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <label class="rx-choice"
                ><input
                  type="checkbox"
                  aria-label="この表のすべての行を選択"
                  data-table-select="all"
                  data-table-select-target="all"
              /></label>
            </th>
            <th
              scope="col"
              aria-sort="none"
              data-state="none"
              data-table-sort-target="sortable"
              data-table-sort-column="title"
            >
              <button
                data-table-sort="title"
                data-sort-type="text"
                class="rx-button sort"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                記事名<span class="indicator" aria-hidden="true">↕</span>
              </button>
            </th>
            <th
              scope="col"
              aria-sort="none"
              data-state="none"
              data-table-sort-target="sortable"
              data-table-sort-column="updated"
            >
              <button
                data-table-sort="updated"
                data-sort-type="date"
                class="rx-button sort"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                更新日時<span class="indicator" aria-hidden="true">↕</span>
              </button>
            </th>
            <th
              scope="col"
              aria-sort="none"
              data-state="none"
              data-table-sort-target="sortable"
              data-table-sort-column="status"
            >
              <button
                data-table-sort="status"
                data-sort-type="text"
                class="rx-button sort"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                状態<span class="indicator" aria-hidden="true">↕</span>
              </button>
            </th>
            <th
              data-cell="numeric"
              scope="col"
              aria-sort="none"
              data-state="none"
              data-table-sort-target="sortable"
              data-table-sort-column="views"
            >
              <button
                data-table-sort="views"
                data-sort-type="number"
                class="rx-button sort"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                閲覧<span class="indicator" aria-hidden="true">↕</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr data-record-id="guide">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="guide"
                  type="checkbox"
                  aria-label="初めて仕事場を利用する方へ、予約方法と当日の受付についてを選択"
                  data-table-select="row"
                  data-row-id="guide"
                  data-table-select-target="item"
                  data-table-select-value="guide"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs"
                >初めて仕事場を利用する方へ、予約方法と当日の受付について</a
              >
            </th>
            <td data-cell="short" data-sort-value="2026-09-15T10:00:00+09:00">
              <time datetime="2026-09-15T10:00:00+09:00">9月15日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="info">確認待ち</span>
            </td>
            <td data-cell="numeric" data-sort-value="0">0</td>
          </tr>
          <tr data-record-id="reading">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="reading"
                  type="checkbox"
                  aria-label="秋の読書会を選択"
                  data-table-select="row"
                  data-row-id="reading"
                  data-table-select-target="item"
                  data-table-select-value="reading"
              /></label>
            </td>
            <th scope="row" data-cell="text"><a href="/apps/docs">秋の読書会</a></th>
            <td data-cell="short" data-sort-value="2026-09-14T15:30:00+09:00">
              <time datetime="2026-09-14T15:30:00+09:00">9月14日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="success">公開中</span>
            </td>
            <td data-cell="numeric" data-sort-value="1280">1,280</td>
          </tr>
          <tr data-record-id="news">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="news"
                  type="checkbox"
                  aria-label="今月のお知らせを選択"
                  data-table-select="row"
                  data-row-id="news"
                  data-table-select-target="item"
                  data-table-select-value="news"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs">今月のお知らせ</a>
            </th>
            <td data-cell="short" data-sort-value="">未登録</td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span>
            </td>
            <td data-cell="numeric" data-sort-value="0">0</td>
          </tr>
          <tr data-record-id="access">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="access"
                  type="checkbox"
                  aria-label="アクセスと営業時間を選択"
                  data-table-select="row"
                  data-row-id="access"
                  data-table-select-target="item"
                  data-table-select-value="access"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs">アクセスと営業時間</a>
            </th>
            <td data-cell="short" data-sort-value="2026-09-12T09:00:00+09:00">
              <time datetime="2026-09-12T09:00:00+09:00">9月12日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="success">公開中</span>
            </td>
            <td data-cell="numeric" data-sort-value="234">234</td>
          </tr>
          <tr data-record-id="faq">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="faq"
                  type="checkbox"
                  aria-label="利用前によくある質問を選択"
                  data-table-select="row"
                  data-row-id="faq"
                  data-table-select-target="item"
                  data-table-select-value="faq"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs">利用前によくある質問</a>
            </th>
            <td data-cell="short" data-sort-value="2026-09-11T10:00:00+09:00">
              <time datetime="2026-09-11T10:00:00+09:00">9月11日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="success">公開中</span>
            </td>
            <td data-cell="numeric" data-sort-value="98">98</td>
          </tr>
          <tr data-record-id="space">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="space"
                  type="checkbox"
                  aria-label="会議室の利用案内を選択"
                  data-table-select="row"
                  data-row-id="space"
                  data-table-select-target="item"
                  data-table-select-value="space"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs">会議室の利用案内</a>
            </th>
            <td data-cell="short" data-sort-value="2026-09-10T10:00:00+09:00">
              <time datetime="2026-09-10T10:00:00+09:00">9月10日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span>
            </td>
            <td data-cell="numeric" data-sort-value="12">12</td>
          </tr>
          <tr data-record-id="plan">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="plan"
                  type="checkbox"
                  aria-label="来月の予定を選択"
                  data-table-select="row"
                  data-row-id="plan"
                  data-table-select-target="item"
                  data-table-select-value="plan"
              /></label>
            </td>
            <th scope="row" data-cell="text"><a href="/apps/docs">来月の予定</a></th>
            <td data-cell="short" data-sort-value="">未登録</td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span>
            </td>
            <td data-cell="numeric" data-sort-value="0">0</td>
          </tr>
          <tr data-record-id="review">
            <td>
              <label class="rx-choice"
                ><input
                  name="ids"
                  value="review"
                  type="checkbox"
                  aria-label="ご利用者からの声を選択"
                  data-table-select="row"
                  data-row-id="review"
                  data-table-select-target="item"
                  data-table-select-value="review"
              /></label>
            </td>
            <th scope="row" data-cell="text">
              <a href="/apps/docs">ご利用者からの声</a>
            </th>
            <td data-cell="short" data-sort-value="2026-09-08T10:00:00+09:00">
              <time datetime="2026-09-08T10:00:00+09:00">9月8日</time>
            </td>
            <td data-cell="short">
              <span class="rx-badge" data-tone="info">確認待ち</span>
            </td>
            <td data-cell="numeric" data-sort-value="8">8</td>
          </tr>
        </tbody>
      </table>
      <div class="selection-bar" role="group" aria-label="選択した行の操作">
        <header class="heading">
          <span class="count" role="status" aria-live="polite"></span
          ><span class="close"
            ><button
              data-table-clear="true"
              data-icon-only="true"
              aria-label="選択を解除"
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
                <use href="/assets/rx-icons.svg#rx-x"></use>
              </svg></button
          ></span>
        </header>
        <div class="actions">
          <button
            class="rx-button"
            type="submit"
            data-variant="secondary"
            data-size="compact"
          >
            選択したIDを確認
          </button>
        </div>
      </div>
      <p class="rx-visually-hidden" data-table-announcement="true" role="status"></p>
    </div>
    <output data-table-demo-target="result" class="catalog-footnote"></output>
  </form>
  <div class="rx-disclosure-group" role="group" aria-label="表の状態">
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
        ><span class="label"><span class="title">基本の表・数値の右揃え</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-table"
          role="region"
          aria-label="料金"
          tabindex="0"
          data-state="ready"
        >
          <table data-controller="" data-density="compact" class="table">
            <caption>
              料金
            </caption>
            <thead>
              <tr>
                <th scope="col">利用時間</th>
                <th scope="col" data-cell="numeric">料金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1時間</th>
                <td data-cell="numeric">1,200円</td>
              </tr>
              <tr>
                <th scope="row">3時間</th>
                <td data-cell="numeric">3,000円</td>
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
          ><span class="title">0件・読み込み中・読み込み失敗</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-table"
          role="region"
          aria-label="検索結果"
          tabindex="0"
          data-state="empty"
        >
          <table data-controller="" data-density="compact" class="table">
            <caption>
              検索結果
            </caption>
            <thead>
              <tr>
                <th scope="col">記事名</th>
                <th scope="col">更新日時</th>
                <th scope="col">状態</th>
              </tr>
            </thead>
          </table>
          <div class="state" role="status">表示する項目はありません。</div>
        </div>
        <div
          class="rx-table"
          role="region"
          aria-label="読み込み中の一覧"
          tabindex="0"
          data-state="loading"
        >
          <table
            data-controller=""
            data-density="compact"
            class="table"
            aria-busy="true"
          >
            <caption>
              読み込み中の一覧
            </caption>
            <thead>
              <tr>
                <th scope="col">記事名</th>
                <th scope="col">更新日時</th>
                <th scope="col">状態</th>
              </tr>
            </thead>
          </table>
          <div class="state" role="status">読み込んでいます…</div>
        </div>
        <div
          class="rx-table"
          role="region"
          aria-label="読み込みに失敗した一覧"
          tabindex="0"
          data-state="error"
        >
          <table data-controller="" data-density="compact" class="table">
            <caption>
              読み込みに失敗した一覧
            </caption>
            <thead>
              <tr>
                <th scope="col">記事名</th>
                <th scope="col">更新日時</th>
                <th scope="col">状態</th>
              </tr>
            </thead>
          </table>
          <div class="state" role="status">
            <p>一覧を読み込めませんでした。ページを再読み込みしてください。</p>
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
          ><span class="title">一括操作が多い表（タイルを格子で並べる）</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-table"
          role="region"
          aria-label="資料の整理"
          tabindex="0"
          data-controller="table"
          data-state="ready"
        >
          <table data-controller="table-select" data-density="compact" class="table">
            <caption>
              資料の整理
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="資料をすべて選択"
                      data-table-select="all"
                      data-table-select-target="all"
                  /></label>
                </th>
                <th scope="col">資料</th>
                <th scope="col">更新</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="利用案内を選択"
                      data-table-select="row"
                      data-row-id="guide"
                      data-table-select-target="item"
                      data-table-select-value="guide"
                  /></label>
                </td>
                <th scope="row">利用案内</th>
                <td>9月15日</td>
              </tr>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="利用規約を選択"
                      data-table-select="row"
                      data-row-id="terms"
                      data-table-select-target="item"
                      data-table-select-value="terms"
                  /></label>
                </td>
                <th scope="row">利用規約</th>
                <td>9月12日</td>
              </tr>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="料金表を選択"
                      data-table-select="row"
                      data-row-id="price"
                      data-table-select-target="item"
                      data-table-select-value="price"
                  /></label>
                </td>
                <th scope="row">料金表</th>
                <td>9月10日</td>
              </tr>
            </tbody>
          </table>
          <div class="selection-bar" role="group" aria-label="選択した行の操作">
            <header class="heading">
              <span class="count" role="status" aria-live="polite"></span
              ><span class="close"
                ><button
                  data-table-clear="true"
                  data-icon-only="true"
                  aria-label="選択を解除"
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
                    <use href="/assets/rx-icons.svg#rx-x"></use>
                  </svg></button
              ></span>
            </header>
            <div class="actions">
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
              ><button type="button" class="rx-action-tile">
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
                ><span class="name">複製する</span></button
              ><button type="button" class="rx-action-tile">
                <span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-file-fill"></use></svg></span
                ><span class="name">書き出す</span></button
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
          <p
            class="rx-visually-hidden"
            data-table-announcement="true"
            role="status"
          ></p>
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
          ><span class="title">無効な行・数値の欠損・負の値・密度</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-table"
          role="region"
          aria-label="増減の確認"
          tabindex="0"
          data-controller="table"
          data-sort-mode="local"
          data-state="ready"
        >
          <table
            data-controller="table-sort table-select"
            data-density="comfortable"
            class="table"
          >
            <caption>
              増減の確認
            </caption>
            <thead>
              <tr>
                <th>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="比較行をすべて選択"
                      data-table-select="all"
                      data-table-select-target="all"
                  /></label>
                </th>
                <th
                  scope="col"
                  aria-sort="none"
                  data-state="none"
                  data-table-sort-target="sortable"
                  data-table-sort-column="label"
                >
                  <button
                    data-table-sort="label"
                    data-sort-type="text"
                    class="rx-button sort"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                    disabled=""
                  >
                    対象<span class="indicator" aria-hidden="true">↕</span>
                  </button>
                </th>
                <th
                  data-cell="numeric"
                  scope="col"
                  aria-sort="none"
                  data-state="none"
                  data-table-sort-target="sortable"
                  data-table-sort-column="amount"
                >
                  <button
                    data-table-sort="amount"
                    data-sort-type="number"
                    class="rx-button sort"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                    disabled=""
                  >
                    増減<span class="indicator" aria-hidden="true">↕</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="減少した項目を選択"
                      data-table-select="row"
                      data-row-id="minus"
                      data-table-select-target="item"
                      data-table-select-value="minus"
                  /></label>
                </td>
                <th scope="row">減少</th>
                <td data-cell="numeric" data-sort-value="-12800">-12,800</td>
              </tr>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      disabled=""
                      type="checkbox"
                      aria-label="未確定の項目を選択"
                      data-table-select="row"
                      data-row-id="missing"
                      data-table-select-target="item"
                      data-table-select-value="missing"
                  /></label>
                </td>
                <th scope="row">未確定</th>
                <td data-cell="numeric" data-sort-value="">—</td>
              </tr>
              <tr>
                <td>
                  <label class="rx-choice"
                    ><input
                      type="checkbox"
                      aria-label="変更なしの項目を選択"
                      data-table-select="row"
                      data-row-id="zero"
                      data-table-select-target="item"
                      data-table-select-value="zero"
                  /></label>
                </td>
                <th scope="row">変更なし</th>
                <td data-cell="numeric" data-sort-value="0">0</td>
              </tr>
            </tbody>
          </table>
          <div class="selection-bar" role="group" aria-label="選択した行の操作">
            <header class="heading">
              <span class="count" role="status" aria-live="polite"></span
              ><span class="close"
                ><button
                  data-table-clear="true"
                  data-icon-only="true"
                  aria-label="選択を解除"
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
                    <use href="/assets/rx-icons.svg#rx-x"></use>
                  </svg></button
              ></span>
            </header>
          </div>
          <p
            class="rx-visually-hidden"
            data-table-announcement="true"
            role="status"
          ></p>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
