import {
  AppShell,
  Avatar,
  Board,
  Button,
  CommandMenu,
  Field,
  Icon,
  Input,
  Navigation,
  PageHeader,
  Section,
  Switch,
  Table,
} from "../../src/hono";

/** 見本ごとにidを変えるため、検索のCommandMenuは関数で作る。 */
const commands = (id: string) => (
  <CommandMenu
    id={id}
    label="取引先・案件・担当者を探す"
    icon="search"
    shortcuts={[
      { label: "取引先", href: "/apps/people", icon: "user", accent: "green" },
      { label: "案件", href: "/apps/sales", icon: "chart", accent: "coral" },
    ]}
    groups={[
      {
        label: "移動",
        items: [
          { label: "取引先", href: "/apps/people", icon: "user" },
          { label: "案件", href: "/apps/sales", icon: "chart" },
        ],
      },
    ]}
  />
);

const home = <a href="/apps/project">つむぐ商会</a>;

const navigation = [
  { label: "ホーム", href: "/apps/project" },
  { label: "取引先", href: "/apps/people", current: true },
  { label: "案件", href: "/apps/sales" },
  { label: "予定", href: "/apps/schedule" },
  { label: "設定", href: "/apps/settings" },
];

const account = (
  <>
    <Avatar name="田中 遥" initials="遥" size="small" tone="coral" />
    <a href="/apps/settings">田中 遥</a>
    <a href="/">ログアウト</a>
  </>
);

const customers = [
  { code: "C-0012", name: "株式会社みなと製作所", owner: "田中 遥", deals: 3, updated: "9月25日" },
  { code: "C-0031", name: "ひかり書房", owner: "佐藤 健", deals: 1, updated: "9月24日" },
  { code: "C-0047", name: "合同会社あおば農園", owner: "森 美咲", deals: 0, updated: "9月22日" },
];

const CustomerTable = () => (
  <Table caption="取引先の一覧">
    <thead>
      <tr>
        <th scope="col">コード</th>
        <th scope="col">取引先</th>
        <th scope="col">担当</th>
        <th scope="col" data-cell="numeric">
          進行中の案件
        </th>
        <th scope="col">更新日</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((customer) => (
        <tr>
          <td data-cell="short">{customer.code}</td>
          <th scope="row" data-cell="text">
            <a href="/apps/people">{customer.name}</a>
          </th>
          <td data-cell="short">{customer.owner}</td>
          <td data-cell="numeric">{customer.deals}</td>
          <td data-cell="short">{customer.updated}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const job = (id: string, code: string, title: string) => ({
  id,
  code,
  label: title,
  content: <h4>{title}</h4>,
});

/* 見本のAppShellは高さを決めた枠の中でスクロールさせる。 */
const frame = "block-size: 34rem; overflow: auto; isolation: isolate";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>既定の幅（default）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          navigation={navigation}
          commands={commands("shell-default")}
          account={account}
          footer={<span>つむぐ商会 · 顧客管理</span>}
        >
          <PageHeader
            title="取引先"
            description="取引のある会社と、担当者・進行中の案件を管理します。"
            actions={<Button variant="primary">取引先を追加</Button>}
          />
          <CustomerTable />
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>上の階層を背後に重ねる（trail）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          navigation={navigation}
          commands={commands("shell-trail")}
          account={account}
          trail={[{ label: "株式会社みなと製作所", href: "/apps/people" }]}
        >
          <PageHeader
            title="展示会の什器の見積もり"
            description="案件 · 担当 田中 遥 · 9月30日まで"
            actions={<Button>編集</Button>}
          />
          <Section title="やること" count={2} actions={<Button size="compact">追加</Button>}>
            <p>見積書の数量を確かめ、来週の打ち合わせまでに送ります。</p>
          </Section>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>先頭側の列を置く（aside）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          commands={commands("shell-aside")}
          account={account}
          aside={
            <Navigation
              label="取引先の分類"
              items={[
                { label: "すべての取引先", href: "/apps/people", current: true, count: 128 },
                { label: "見込み", href: "/apps/people", count: 24 },
                { label: "取引中", href: "/apps/people", count: 87 },
                { label: "休眠", href: "/apps/people", count: 17 },
              ]}
            />
          }
        >
          <PageHeader title="すべての取引先" description="128件の取引先" />
          <CustomerTable />
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>入力が中心の画面（compact）</h3>
      <div style={frame}>
        <AppShell size="compact" home={home} navigation={navigation} account={account}>
          <PageHeader title="設定" description="会社の名前と通知を変えます。" />
          <form class="rx-stack" aria-label="会社の設定">
            <Field id="shell-workspace-name" label="会社の名前">
              {(attributes) => <Input {...attributes} name="name" value="つむぐ商会" />}
            </Field>
            <Switch
              id="shell-digest"
              label="週次のまとめを受け取る"
              name="digest"
              value="weekly"
              checked
            />
            <div>
              <Button type="submit" variant="primary">
                保存
              </Button>
            </div>
          </form>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>横に広い画面（wide）</h3>
      <div style={frame}>
        <AppShell size="wide" home={home} navigation={navigation} account={account}>
          <PageHeader title="案件の進み具合" icon={<Icon name="grid" />} />
          <Board
            label="案件"
            columns={[
              {
                id: "lead",
                title: "見込み",
                items: [job("fair", "No. 21", "展示会の什器の見積もり")],
              },
              {
                id: "proposal",
                title: "提案中",
                tone: "info",
                items: [job("catalog", "No. 18", "秋のカタログの印刷")],
              },
              {
                id: "won",
                title: "受注",
                tone: "success",
                collapsible: true,
                items: [job("sign", "No. 11", "店舗の看板の交換")],
              },
            ]}
          />
        </AppShell>
      </div>
    </section>
  </div>
);
