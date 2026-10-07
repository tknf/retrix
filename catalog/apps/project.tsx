import {
  Avatar,
  AvatarGroup,
  Board,
  Button,
  Composer,
  Dialog,
  Field,
  Icon,
  Input,
  InputGroup,
  Message,
  PageHeader,
  Progress,
  Reactions,
  Section,
  SplitView,
  Statistic,
  Tabs,
  Tag,
  TagGroup,
  TaskList,
  Timeline,
  ToggleGroup,
  ValueList,
  type Accent,
} from "../../src/hono";
import { members, type Member } from "./data";
import { AppFrame } from "./frame";

type Job = {
  id: string;
  code: string;
  title: string;
  category: string;
  accent: Accent;
  owner: number;
  progress?: { value: number; max: number };
};

const lanes: readonly {
  id: string;
  title: string;
  tone: "neutral" | "info" | "warning" | "success";
  jobs: readonly Job[];
}[] = [
  {
    id: "todo",
    title: "これから",
    tone: "neutral",
    jobs: [
      {
        id: "faq",
        code: "No. 21",
        title: "よくある質問を集める",
        category: "リサーチ",
        accent: "amber",
        owner: 2,
      },
      {
        id: "find",
        code: "No. 22",
        title: "記事の見つけ方を考える",
        category: "デザイン",
        accent: "coral",
        owner: 1,
      },
    ],
  },
  {
    id: "doing",
    title: "進めている",
    tone: "info",
    jobs: [
      {
        id: "guide",
        code: "No. 18",
        title: "はじめての方向けガイド",
        category: "記事",
        accent: "blue",
        owner: 0,
        progress: { value: 3, max: 5 },
      },
      {
        id: "mobile",
        code: "No. 19",
        title: "スマートフォンで読みやすく",
        category: "デザイン",
        accent: "coral",
        owner: 1,
      },
    ],
  },
  {
    id: "review",
    title: "確認待ち",
    tone: "warning",
    jobs: [
      {
        id: "export",
        code: "No. 16",
        title: "データの書き出しの記事",
        category: "記事",
        accent: "blue",
        owner: 1,
      },
    ],
  },
  {
    id: "done",
    title: "できた！",
    tone: "success",
    jobs: [
      {
        id: "goal",
        code: "No. 11",
        title: "チームでゴールを揃える",
        category: "準備",
        accent: "green",
        owner: 2,
      },
      {
        id: "inventory",
        code: "No. 12",
        title: "記事の棚卸し",
        category: "記事",
        accent: "blue",
        owner: 0,
      },
    ],
  },
];

const Person = ({ person }: { person: Member }) => (
  <Avatar name={person.name} initials={person.initials} tone={person.tone} size="small" />
);

/** ボードの項目の中身。題名・分類・進み具合・担当を載せる。担当はdata-ownerで絞り込みに使う。 */
const JobContent = ({ job }: { job: Job }) => {
  const owner = members[job.owner];
  return (
    <>
      <h4>{job.title}</h4>
      <TagGroup label="分類">
        <Tag label={job.category} accent={job.accent} />
      </TagGroup>
      {job.progress && (
        <Progress label="記事の準備" value={job.progress.value} max={job.progress.max} />
      )}
      <p class="rx-cluster" data-owner={owner.id}>
        <Person person={owner} />
        {owner.name}
      </p>
    </>
  );
};

/** プロジェクト。公開までの数値、ドラッグで移動できるボード、今週のチェック、会話、記録をタブで切り替える。 */
export const ProjectScreen = () => (
  <AppFrame current="project" size="wide">
    <div class="rx-stack" data-controller="project-demo">
      <PageHeader
        title="ヘルプセンターのリニューアル"
        icon={<Icon name="layers" />}
        description="迷わず答えにたどり着ける場所へ。9月30日に公開します。"
        actions={
          <Dialog
            id="project-add"
            title="タスクを追加"
            trigger="＋ タスクを追加"
            triggerVariant="primary"
            initialFocus="content"
            closeLabel="閉じる"
            actions={
              <Button type="submit" form="project-add-form" variant="primary" disabled>
                追加する
              </Button>
            }
          >
            <form id="project-add-form" class="rx-stack" data-action="submit->project-demo#add">
              <Field id="project-task" label="何をしますか？">
                {(attributes) => (
                  <Input
                    {...attributes}
                    name="task"
                    required
                    autofocus
                    placeholder="例：記事のタイトルを見直す"
                  />
                )}
              </Field>
              <p role="status" data-project-demo-target="status" />
            </form>
          </Dialog>
        }
      />
      <div class="rx-split">
        <Statistic label="公開まで" value="6" unit="日" note="9月30日（水）" />
        <Statistic label="記事の準備" value="18" unit="/ 24本" note="今週6本増えました" />
        <Statistic label="確認待ち" value="1" unit="件" note="佐藤 健さんが確認中" />
      </div>
      <Tabs
        id="project-views"
        label="プロジェクトの表示"
        items={[
          {
            value: "board",
            label: "ボード",
            icon: <Icon name="grid" />,
            content: (
              <div class="rx-stack" data-space="small">
                <div
                  class="rx-stack"
                  data-space="small"
                  role="search"
                  aria-label="ボードの絞り込み"
                >
                  <InputGroup
                    id="project-search"
                    type="search"
                    aria-label="タスクを探す"
                    placeholder="タスクを探す…"
                    prefix={<Icon name="search" />}
                    data-action="input->project-demo#filter"
                  />
                  <span data-action="toggle-group:change->project-demo#owner">
                    <ToggleGroup
                      label="担当で絞り込む"
                      items={[
                        { value: "all", label: "全員" },
                        ...members.map((person) => ({ value: person.id, label: person.name })),
                      ]}
                      selected={["all"]}
                    />
                  </span>
                </div>
                <Board
                  label="ヘルプセンターの仕事"
                  movable
                  columns={lanes.map((lane) => ({
                    id: lane.id,
                    title: lane.title,
                    tone: lane.tone,
                    collapsible: lane.id === "done",
                    collapsed: lane.id === "done",
                    empty: "ここへ移動できます",
                    items: lane.jobs.map((job) => ({
                      id: job.id,
                      code: job.code,
                      label: job.title,
                      content: <JobContent job={job} />,
                    })),
                  }))}
                />
                <p class="rx-save-status" role="status" data-project-demo-target="filterStatus" />
              </div>
            ),
          },
          {
            value: "checklist",
            label: "今週のチェック",
            icon: <Icon name="check" />,
            count: 3,
            content: (
              <SplitView
                primary={
                  <TaskList
                    label="公開前のチェック"
                    heading="公開前に確かめること"
                    items={[
                      {
                        name: "project-links",
                        label: "リンク切れがないか確認する",
                        detail: "記事の中から、次のページへ進めるか。",
                        checked: true,
                        end: <Person person={members[1]} />,
                      },
                      {
                        name: "project-mobile",
                        label: "スマートフォンで読んでみる",
                        detail: "小さい文字、長い見出し、操作しづらいボタンがないか。",
                        end: <Person person={members[0]} />,
                      },
                      {
                        name: "project-first",
                        label: "はじめて使う人に試してもらう",
                        detail: "説明なしで、知りたいことを見つけられるか。",
                        end: <Person person={members[2]} />,
                      },
                    ]}
                  />
                }
                secondary={
                  <ValueList
                    items={[
                      { label: "公開予定", value: "9月30日（水）" },
                      { label: "対象", value: "初めて利用するお客さま" },
                      {
                        label: "チーム",
                        value: (
                          <AvatarGroup
                            label={members.map((person) => person.name).join("、")}
                            size="small"
                          >
                            {members.map((person) => (
                              <Person person={person} />
                            ))}
                          </AvatarGroup>
                        ),
                      },
                    ]}
                  />
                }
              />
            ),
          },
          {
            value: "conversation",
            label: "会話",
            icon: <Icon name="chat" />,
            count: 2,
            content: (
              <div class="rx-reading-pane">
                <Message
                  author="森 美咲"
                  time="今日 10:24"
                  datetime="2026-09-15T10:24:00+09:00"
                  avatar={<Person person={members[2]} />}
                  replies={
                    <Message
                      author="田中 遥"
                      time="今日 10:31"
                      datetime="2026-09-15T10:31:00+09:00"
                      avatar={<Person person={members[0]} />}
                    >
                      <p>まずは「はじめての方へ」から、実際の記事を入れて試してみましょう。</p>
                    </Message>
                  }
                >
                  <p>
                    記事のカテゴリを5つに絞ってみました。最初の画面で見渡せるので、迷わず入口を選べそうです。
                  </p>
                  <Reactions
                    label="この投稿へのリアクション"
                    items={[
                      { content: "👍", name: "いいね", by: ["田中 遥", "佐藤 健"] },
                      { content: "わかりやすい", by: ["佐藤 健"] },
                    ]}
                    add={{ id: "project-reactions", me: "田中 遥" }}
                  />
                </Message>
                <Composer
                  id="project-reply"
                  label="チームに書く"
                  name="message"
                  placeholder="チームに書く…"
                  submitLabel="送る"
                />
              </div>
            ),
          },
          {
            value: "history",
            label: "記録",
            icon: <Icon name="clock" />,
            content: (
              <Section title="最近の動き">
                <Timeline
                  label="プロジェクトの記録"
                  items={[
                    {
                      datetime: "2026-09-15T10:31",
                      time: "10:31",
                      actor: "田中 遥",
                      title: "会話に返信しました",
                      avatar: <Person person={members[0]} />,
                      day: "今日",
                    },
                    {
                      datetime: "2026-09-15T09:40",
                      time: "9:40",
                      actor: "佐藤 健",
                      title: "「データの書き出しの記事」を確認待ちへ移しました",
                      avatar: <Person person={members[1]} />,
                    },
                    {
                      datetime: "2026-09-14T18:00",
                      time: "18:00",
                      title: "「記事の棚卸し」を自動でできた！へ移しました",
                      kind: "system",
                      day: "9月14日（月）",
                    },
                    {
                      datetime: "2026-09-14T11:20",
                      time: "11:20",
                      actor: "森 美咲",
                      title: "よくある質問を集め始めました",
                      avatar: <Person person={members[2]} />,
                    },
                  ]}
                />
              </Section>
            ),
          },
        ]}
      />
    </div>
  </AppFrame>
);
