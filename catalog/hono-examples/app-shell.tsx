import {
  AppShell,
  ActionLink,
  Avatar,
  Board,
  Button,
  CommandMenu,
  Field,
  Icon,
  Input,
  PageHeader,
  Switch,
  Table,
} from "../../src/hono";

/** 見本ごとにidを変えるため、共通コマンドは関数で作る。 */
const commands = (id: string) => (
  <CommandMenu
    id={id}
    label="つむぐチーム"
    shortcuts={[
      { label: "プロジェクト", href: "/apps/project", icon: "layers", accent: "green" },
      { label: "受信トレイ", href: "/apps/inbox", icon: "mail", accent: "blue" },
      { label: "資料", href: "/apps/files", icon: "file", accent: "amber" },
      { label: "売上", href: "/apps/sales", icon: "chart", accent: "coral" },
    ]}
    groups={[
      {
        label: "移動",
        items: [
          { label: "プロジェクト", href: "/apps/project", icon: "layers" },
          { label: "受信トレイ", href: "/apps/inbox", icon: "mail" },
        ],
      },
    ]}
  />
);

const home = (
  <ActionLink href="/apps/project" variant="link">
    ホーム
  </ActionLink>
);

const account = <Avatar name="田中 遥" initials="遥" size="small" tone="coral" />;

const records = [
  {
    title: "ヘルプセンターの目次を見直す",
    owner: "田中 遥",
    reviewer: "佐藤 健",
    updated: "2026年9月25日 10:00",
    due: "2026年9月30日",
    status: "確認待ち",
    place: "ヘルプセンター（日本語）",
    priority: "高",
    comments: "3件",
  },
  {
    title: "料金とキャンセル条件を更新する",
    owner: "佐藤 健",
    reviewer: "森 美咲",
    updated: "2026年9月24日 15:30",
    due: "2026年10月3日",
    status: "進行中",
    place: "料金ページ",
    priority: "中",
    comments: "1件",
  },
  {
    title: "よくある質問を集める",
    owner: "森 美咲",
    reviewer: "田中 遥",
    updated: "2026年9月22日 9:00",
    due: "2026年10月10日",
    status: "これから",
    place: "ヘルプセンター（英語）",
    priority: "低",
    comments: "0件",
  },
];

const job = (id: string, code: string, title: string) => ({
  id,
  code,
  label: title,
  content: <h4>{title}</h4>,
});

/*
  見本のAppShellは高さを決めた枠の中でスクロールさせ、上端に留まるバーを見せる。
  isolationで、見本のバーがカタログ自身のバーに重ならないようにする。
*/
const frame = "block-size: 32rem; overflow: auto; isolation: isolate";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>既定の幅（default）</h3>
      <div style={frame}>
        <AppShell home={home} commands={commands("shell-default")} account={account}>
          <PageHeader
            title="今日の仕事"
            description="上部中央のコマンドメニューから移動し、中央の作業面で仕事を進めます。横に広い表は作業面の端までスクロールします。"
            icon={<Icon name="layers" />}
            actions={<Button variant="primary">仕事を追加</Button>}
          />
          <Table caption="担当している仕事">
            <thead>
              <tr>
                <th scope="col">仕事</th>
                <th scope="col">担当</th>
                <th scope="col">確認者</th>
                <th scope="col">更新日時</th>
                <th scope="col">期限</th>
                <th scope="col">状態</th>
                <th scope="col">公開先</th>
                <th scope="col">優先度</th>
                <th scope="col" data-cell="numeric">
                  コメント
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr>
                  <th scope="row" data-cell="text">
                    {record.title}
                  </th>
                  <td data-cell="short">{record.owner}</td>
                  <td data-cell="short">{record.reviewer}</td>
                  <td data-cell="short">{record.updated}</td>
                  <td data-cell="short">{record.due}</td>
                  <td data-cell="short">{record.status}</td>
                  <td data-cell="short">{record.place}</td>
                  <td data-cell="short">{record.priority}</td>
                  <td data-cell="numeric">{record.comments}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>入力が中心の画面（compact）</h3>
      <div style={frame}>
        <AppShell size="compact" home={home} commands={commands("shell-compact")} account={account}>
          <PageHeader title="設定" description="ワークスペースの名前と通知を変えます。" />
          <form class="rx-stack" aria-label="ワークスペースの設定">
            <Field id="shell-workspace-name" label="ワークスペースの名前">
              {(attributes) => <Input {...attributes} name="name" value="小さな仕事場" />}
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
        <AppShell size="wide" home={home} commands={commands("shell-wide")} account={account}>
          <PageHeader title="ヘルプセンターのリニューアル" icon={<Icon name="grid" />} />
          <Board
            label="ヘルプセンターの仕事"
            columns={[
              {
                id: "todo",
                title: "これから",
                items: [job("faq", "No. 21", "よくある質問を集める")],
              },
              {
                id: "doing",
                title: "進めている",
                tone: "info",
                items: [job("guide", "No. 18", "はじめての方向けガイド")],
              },
              {
                id: "review",
                title: "確認待ち",
                tone: "warning",
                items: [job("export", "No. 16", "データの書き出しの記事")],
              },
              {
                id: "done",
                title: "できた！",
                tone: "success",
                collapsible: true,
                items: [job("goal", "No. 11", "チームでゴールを揃える")],
              },
            ]}
          />
        </AppShell>
      </div>
    </section>
  </div>
);
