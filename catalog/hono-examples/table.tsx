import {
  Table,
  TableSort,
  TableSelection,
  Badge,
  Disclosure,
  DisclosureGroup,
  Button,
  ActionTile,
} from "../../src/hono";
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
                    {Number(record.date.slice(5, 7))}月{Number(record.date.slice(8, 10))}日
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
