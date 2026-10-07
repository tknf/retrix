import {
  ActionLink,
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  ErrorSummary,
  Field,
  FieldGroup,
  FilterBar,
  Icon,
  Input,
  InputGroup,
  Message,
  Navigation,
  Notice,
  PageHeader,
  Pagination,
  Section,
  Select,
  Table,
  TableSelection,
  TableSort,
  Textarea,
  Timeline,
  ValueList,
} from "../../src/hono";
import { AppFrame, appPath } from "./frame";

type Customer = {
  code: string;
  name: string;
  kana: string;
  status: "取引中" | "見込み" | "休眠";
  owner: string;
  city: string;
  phone: string;
  deals: number;
  sales: number;
  updated: string;
};

/** 取引先のマスタ。題材は小さな卸売の会社「つむぐ商会」。 */
const customers: readonly Customer[] = [
  {
    code: "C-0012",
    name: "株式会社みなと製作所",
    kana: "みなとせいさくしょ",
    status: "取引中",
    owner: "田中 遥",
    city: "横浜市",
    phone: "045-000-1201",
    deals: 3,
    sales: 4820000,
    updated: "2026-09-25",
  },
  {
    code: "C-0031",
    name: "ひかり書房",
    kana: "ひかりしょぼう",
    status: "取引中",
    owner: "佐藤 健",
    city: "京都市",
    phone: "075-000-3104",
    deals: 1,
    sales: 1260000,
    updated: "2026-09-24",
  },
  {
    code: "C-0047",
    name: "合同会社あおば農園",
    kana: "あおばのうえん",
    status: "見込み",
    owner: "森 美咲",
    city: "仙台市",
    phone: "022-000-4710",
    deals: 1,
    sales: 0,
    updated: "2026-09-22",
  },
  {
    code: "C-0052",
    name: "喫茶ことり",
    kana: "きっさことり",
    status: "取引中",
    owner: "田中 遥",
    city: "金沢市",
    phone: "076-000-5208",
    deals: 2,
    sales: 380000,
    updated: "2026-09-19",
  },
  {
    code: "C-0066",
    name: "株式会社しろくま運輸",
    kana: "しろくまうんゆ",
    status: "休眠",
    owner: "佐藤 健",
    city: "札幌市",
    phone: "011-000-6602",
    deals: 0,
    sales: 0,
    updated: "2026-07-03",
  },
  {
    code: "C-0071",
    name: "まちかど文具店",
    kana: "まちかどぶんぐてん",
    status: "取引中",
    owner: "森 美咲",
    city: "名古屋市",
    phone: "052-000-7115",
    deals: 1,
    sales: 912000,
    updated: "2026-09-12",
  },
  {
    code: "C-0083",
    name: "有限会社はるかぜ工房",
    kana: "はるかぜこうぼう",
    status: "見込み",
    owner: "田中 遥",
    city: "福岡市",
    phone: "092-000-8321",
    deals: 1,
    sales: 0,
    updated: "2026-09-09",
  },
];

/** 静的に書き出す取引先の詳細と編集の画面。 */
export const customerCodes = customers.map((customer) => customer.code);

const yen = (value: number) => `${value.toLocaleString("ja-JP")}円`;
const day = (iso: string) => `${Number(iso.slice(5, 7))}月${Number(iso.slice(8, 10))}日`;
const tone = (status: Customer["status"]) =>
  status === "取引中" ? "success" : status === "見込み" ? "info" : "neutral";
const customerPath = (code: string) => `${appPath("customers")}/${code}`;

const counts = {
  all: customers.length,
  active: customers.filter((customer) => customer.status === "取引中").length,
  lead: customers.filter((customer) => customer.status === "見込み").length,
  dormant: customers.filter((customer) => customer.status === "休眠").length,
};

/** 取引先の分類と担当者。シートの外の先頭側の列に置く。 */
const CustomerAside = () => (
  <>
    <Navigation
      label="取引先の分類"
      items={[
        {
          label: "すべての取引先",
          href: appPath("customers"),
          current: true,
          count: counts.all,
          icon: <Icon name="user" fill />,
        },
        {
          label: "取引中",
          href: `${appPath("customers")}?status=active`,
          count: counts.active,
          icon: <Icon name="check" />,
        },
        {
          label: "見込み",
          href: `${appPath("customers")}?status=lead`,
          count: counts.lead,
          icon: <Icon name="lightning" />,
        },
        {
          label: "休眠",
          href: `${appPath("customers")}?status=dormant`,
          count: counts.dormant,
          icon: <Icon name="clock" />,
        },
      ]}
    />
    <Navigation
      label="担当者"
      items={[
        { label: "田中 遥", href: `${appPath("customers")}?owner=tanaka`, count: 3 },
        { label: "佐藤 健", href: `${appPath("customers")}?owner=sato`, count: 2 },
        { label: "森 美咲", href: `${appPath("customers")}?owner=mori`, count: 2 },
      ]}
    />
  </>
);

/**
 * 取引先の一覧。分類で絞り込み、並べ替え、選んだ行をまとめて操作する。
 * 列の幅は変えられ、cookieに保存する。savedColumnWidthsはサーバーで読んだcookieの値。
 */
export const CustomersScreen = ({ savedColumnWidths }: { savedColumnWidths?: string }) => (
  <AppFrame current="customers" aside={<CustomerAside />}>
    <PageHeader
      title="すべての取引先"
      description={`${counts.all}件の取引先。担当者・進行中の案件・今年の売上を管理します。`}
      actions={
        <>
          <Button>CSVから取り込む</Button>
          <Button variant="primary">取引先を追加</Button>
        </>
      }
    />
    <form
      class="rx-cluster"
      style="display: grid; grid-template-columns: minmax(0, 24rem) auto; justify-content: start"
      role="search"
      action={appPath("customers")}
      method="get"
    >
      <InputGroup
        id="customers-query"
        prefix={<Icon name="search" />}
        type="search"
        name="q"
        placeholder="名前・コード・電話番号で探す"
        aria-label="取引先を探す"
      />
      <Button type="submit">探す</Button>
    </form>
    <FilterBar
      label="取引先の状態"
      items={[
        { label: "すべて", href: appPath("customers"), count: counts.all, current: true },
        { label: "取引中", href: `${appPath("customers")}?status=active`, count: counts.active },
        { label: "見込み", href: `${appPath("customers")}?status=lead`, count: counts.lead },
        { label: "休眠", href: `${appPath("customers")}?status=dormant`, count: counts.dormant },
      ]}
    />
    <Table
      caption="取引先の一覧"
      sort="local"
      selectable
      striped
      resizable
      storageKey="customers"
      savedColumnWidths={savedColumnWidths}
      selectionActions={
        <>
          <Button size="compact">担当者を変える</Button>
          <Button size="compact">CSVに書き出す</Button>
          <Button size="compact" variant="danger">
            休眠にする
          </Button>
        </>
      }
    >
      <thead>
        <tr>
          <th scope="col">
            <TableSelection label="すべての取引先を選択" />
          </th>
          <TableSort column="code">コード</TableSort>
          <TableSort column="name">取引先</TableSort>
          <TableSort column="status">状態</TableSort>
          <TableSort column="owner">担当</TableSort>
          <th scope="col">所在地</th>
          <TableSort data-cell="numeric" column="deals" type="number">
            案件
          </TableSort>
          <TableSort data-cell="numeric" column="sales" type="number">
            今年の売上
          </TableSort>
          <TableSort column="updated" type="date">
            更新日
          </TableSort>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr>
            <td>
              <TableSelection
                rowId={customer.code}
                label={`${customer.name}を選択`}
                name="codes"
                value={customer.code}
              />
            </td>
            <td data-cell="short">{customer.code}</td>
            <th scope="row" data-cell="text" data-sort-value={customer.kana}>
              <a href={customerPath(customer.code)}>{customer.name}</a>
            </th>
            <td data-cell="short">
              <Badge tone={tone(customer.status)} draft={customer.status === "休眠"}>
                {customer.status}
              </Badge>
            </td>
            <td data-cell="short">{customer.owner}</td>
            <td data-cell="short">{customer.city}</td>
            <td data-cell="numeric" data-sort-value={String(customer.deals)}>
              {customer.deals}
            </td>
            <td data-cell="numeric" data-sort-value={String(customer.sales)}>
              {yen(customer.sales)}
            </td>
            <td data-cell="short" data-sort-value={customer.updated}>
              <time datetime={customer.updated}>{day(customer.updated)}</time>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Pagination
      items={[
        { label: "前へ" },
        { label: "1", current: true, href: appPath("customers") },
        { label: "2", href: `${appPath("customers")}?page=2` },
        { label: "3", href: `${appPath("customers")}?page=3` },
        { label: "次へ", href: `${appPath("customers")}?page=2` },
      ]}
    />
  </AppFrame>
);

/** 取引先の詳細。属性・案件・メモと履歴を読む。上の階層（一覧）は背後のシートで示す。 */
export const CustomerScreen = ({ code }: { code: string }) => {
  const customer = customers.find((entry) => entry.code === code) ?? customers[0];
  if (!customer) return null;
  return (
    <AppFrame current="customers" trail={[{ label: "取引先", href: appPath("customers") }]}>
      <PageHeader
        title={customer.name}
        description={`${customer.code} · ${customer.city} · 担当 ${customer.owner}`}
        icon={<Icon name="user" fill />}
        actions={
          <>
            <ActionLink href={`${customerPath(customer.code)}/edit`}>編集</ActionLink>
            <DropdownMenu
              id="customer-actions"
              label="その他の操作"
              items={[
                { label: "複製する", value: "copy", icon: "copy" },
                { label: "CSVに書き出す", value: "export", icon: "file" },
                { kind: "separator" },
                { label: "休眠にする", value: "dormant", icon: "trash", danger: true },
              ]}
            />
          </>
        }
      />
      <div class="rx-workspace">
        <div class="rx-stack">
          <Section
            title="案件"
            count={customer.deals}
            actions={<Button size="compact">案件を追加</Button>}
          >
            <Table caption="進行中の案件">
              <thead>
                <tr>
                  <th scope="col">案件</th>
                  <th scope="col">段階</th>
                  <th scope="col" data-cell="numeric">
                    見込み金額
                  </th>
                  <th scope="col">期日</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" data-cell="text">
                    <a href={appPath("sales")}>展示会の什器の見積もり</a>
                  </th>
                  <td data-cell="short">
                    <Badge tone="info">提案中</Badge>
                  </td>
                  <td data-cell="numeric">1,200,000円</td>
                  <td data-cell="short">9月30日</td>
                </tr>
                <tr>
                  <th scope="row" data-cell="text">
                    <a href={appPath("sales")}>秋のカタログの印刷</a>
                  </th>
                  <td data-cell="short">
                    <Badge tone="warning">見積もり待ち</Badge>
                  </td>
                  <td data-cell="numeric">640,000円</td>
                  <td data-cell="short">10月8日</td>
                </tr>
              </tbody>
            </Table>
          </Section>
          <Section title="メモ" count={2} actions={<Button size="compact">メモを追加</Button>}>
            <Message
              author="田中 遥"
              time="9月25日 10:24"
              datetime="2026-09-25T10:24:00+09:00"
              avatar={<Avatar name="田中 遥" initials="遥" tone="coral" size="small" />}
            >
              <p>
                展示会の什器は、10台から15台に増える見込みです。来週の打ち合わせで数量を確定します。
              </p>
            </Message>
            <Message
              author="佐藤 健"
              time="9月18日 16:02"
              datetime="2026-09-18T16:02:00+09:00"
              avatar={<Avatar name="佐藤 健" initials="健" size="small" />}
            >
              <p>請求書の送り先が経理部に変わりました。住所は変わりません。</p>
            </Message>
          </Section>
        </div>
        <div class="rx-stack">
          <Section title="基本情報">
            <ValueList
              items={[
                {
                  label: "状態",
                  value: (
                    <Badge tone={tone(customer.status)} draft={customer.status === "休眠"}>
                      {customer.status}
                    </Badge>
                  ),
                },
                { label: "電話番号", value: customer.phone },
                { label: "担当", value: customer.owner },
                { label: "今年の売上", value: yen(customer.sales) },
                {
                  label: "更新日",
                  value: <time datetime={customer.updated}>{day(customer.updated)}</time>,
                },
              ]}
            />
          </Section>
          <Section title="最近の動き">
            <Timeline
              label="取引先の履歴"
              items={[
                {
                  datetime: "2026-09-25T10:24:00+09:00",
                  time: "10:24",
                  day: "9月25日",
                  actor: "田中 遥",
                  title: "メモを追加しました",
                },
                {
                  datetime: "2026-09-18T16:02:00+09:00",
                  time: "16:02",
                  day: "9月18日",
                  actor: "佐藤 健",
                  title: "請求先を変更しました",
                },
              ]}
            />
          </Section>
        </div>
      </div>
    </AppFrame>
  );
};

/** 取引先の編集。入力の誤りは上のErrorSummaryと各欄の下に示す。 */
export const CustomerEditScreen = ({ code }: { code: string }) => {
  const customer = customers.find((entry) => entry.code === code) ?? customers[0];
  if (!customer) return null;
  return (
    <AppFrame
      current="customers"
      size="compact"
      trail={[
        { label: "取引先", href: appPath("customers") },
        { label: customer.name, href: customerPath(customer.code) },
      ]}
    >
      <PageHeader title="取引先を編集" description={`${customer.code}の登録内容を変えます。`} />
      <form class="rx-form" action={customerPath(customer.code)} method="post">
        <ErrorSummary
          id="customer-errors"
          errors={[{ label: "電話番号の形式を確かめてください", href: "#customer-phone" }]}
        />
        <FieldGroup legend="会社" description="請求書と送り状に印字します。">
          <Field id="customer-name" label="取引先の名前">
            {(attributes) => <Input {...attributes} name="name" value={customer.name} required />}
          </Field>
          <Field id="customer-kana" label="よみがな" help="一覧の並べ替えに使います。">
            {(attributes) => <Input {...attributes} name="kana" value={customer.kana} />}
          </Field>
          <Field id="customer-status" label="状態">
            {(attributes) => (
              <Select {...attributes} name="status">
                {(["取引中", "見込み", "休眠"] as const).map((status) => (
                  <option value={status} selected={status === customer.status}>
                    {status}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </FieldGroup>
        <FieldGroup legend="連絡先">
          <Field
            id="customer-phone"
            label="電話番号"
            error="電話番号の形式を確かめてください"
            help="ハイフンを入れて入力します。"
          >
            {(attributes) => <Input {...attributes} type="tel" name="phone" value="045-000-12O1" />}
          </Field>
          <Field id="customer-note" label="メモ">
            {(attributes) => (
              <Textarea {...attributes} name="note" rows={4}>
                請求書の送り先は経理部。
              </Textarea>
            )}
          </Field>
        </FieldGroup>
        <Notice label="変更は保存すると、すぐに一覧へ反映されます" />
        <div class="rx-cluster">
          <Button type="submit" variant="primary">
            保存する
          </Button>
          <ActionLink href={customerPath(customer.code)}>キャンセル</ActionLink>
        </div>
      </form>
    </AppFrame>
  );
};
