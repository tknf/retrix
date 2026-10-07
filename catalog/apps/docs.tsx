import {
  ActionLink,
  Avatar,
  BackLink,
  Badge,
  DataList,
  EditableProperty,
  Field,
  Icon,
  Input,
  PageHeader,
  Prompt,
  Reactions,
  Section,
  SplitButton,
  SplitView,
  TextEditor,
  Timeline,
  ValueList,
} from "../../src/hono";
import { articles, members } from "./data";
import { AppFrame, appPath } from "./frame";

const tone = (state: string) =>
  state === "公開中" ? "success" : state === "確認待ち" ? "warning" : "neutral";

/** 文書。記事を選び、題名と本文を書き、担当や公開日をその場で編集する。確認待ちの記事には公開するかを確認する。 */
export const DocsScreen = ({ article: id }: { article?: string }) => {
  const article = articles.find((entry) => entry.id === id);
  if (!article)
    return (
      <AppFrame current="docs">
        <PageHeader
          title="文書"
          icon={<Icon name="pencil" />}
          description="ヘルプセンターの記事です。9月30日の公開に向けて書いています。"
          actions={
            <ActionLink href={`${appPath("docs")}?article=notifications`} variant="primary">
              ＋ 新しい記事
            </ActionLink>
          }
        />
        <Section title="記事" count={articles.length}>
          <DataList
            aria-label="記事"
            items={articles.map((entry) => {
              const owner = members[entry.owner];
              return {
                title: entry.title,
                description: entry.excerpt,
                href: `${appPath("docs")}?article=${entry.id}`,
                start: (
                  <Avatar
                    name={owner.name}
                    initials={owner.initials}
                    tone={owner.tone}
                    size="small"
                  />
                ),
                meta: `${entry.category} · ${entry.updated}`,
                end: <Badge tone={tone(entry.state)}>{entry.state}</Badge>,
              };
            })}
          />
        </Section>
      </AppFrame>
    );
  const owner = members[article.owner];
  return (
    <AppFrame current="docs">
      <BackLink href={appPath("docs")} label="記事の一覧" />
      <PageHeader
        title={article.title}
        description={`${article.category} · ${owner.name}が担当`}
        actions={
          <SplitButton
            id="docs-publish"
            label={article.state === "公開中" ? "更新する" : "公開する"}
            variant="primary"
            type="submit"
            form="docs-form"
            items={[
              { label: "下書きとして保存", value: "draft", icon: "pencil" },
              { label: "公開日を予約", value: "schedule", icon: "calendar" },
            ]}
          />
        }
      />
      {article.state === "確認待ち" && (
        <form method="get" action={appPath("docs")}>
          <input type="hidden" name="article" value={article.id} />
          <Prompt
            question="この記事を公開しますか？"
            name="decision"
            pointer={false}
            choices={[
              {
                value: "publish",
                title: "公開する",
                description: "9月30日のヘルプセンター公開と一緒に出します。",
              },
              {
                value: "revise",
                title: "書き直してもらう",
                description: `${owner.name}さんに直してほしい所を伝えます。`,
              },
            ]}
          />
        </form>
      )}
      <SplitView
        primary={
          <form class="rx-stack" id="docs-form" method="get" action={appPath("docs")}>
            <input type="hidden" name="article" value={article.id} />
            <Field id="docs-title" label="題名">
              {(attributes) => (
                <Input {...attributes} name="title" value={article.title} required />
              )}
            </Field>
            <TextEditor
              id="docs-body"
              label="本文"
              name="body"
              rows={10}
              value={`${article.excerpt}\n\n`}
            />
            <Section title="チームのリアクション">
              <Reactions
                label="この記事へのリアクション"
                items={[
                  { content: "👍", name: "いいね", by: ["佐藤 健", "森 美咲"] },
                  { content: "わかりやすい", by: ["森 美咲"] },
                ]}
                add={{ id: "docs-reactions", me: "田中 遥" }}
              />
            </Section>
          </form>
        }
        secondary={
          <div class="rx-stack">
            <ValueList
              items={[
                { label: "状態", value: <Badge tone={tone(article.state)}>{article.state}</Badge> },
                { label: "カテゴリ", value: article.category },
                { label: "最後の更新", value: article.updated },
              ]}
            />
            <EditableProperty
              id="docs-owner"
              label="担当"
              name="owner"
              value={owner.name}
              form="docs-form"
            />
            <EditableProperty
              id="docs-note"
              label="メモ"
              name="note"
              emptyLabel="未登録"
              form="docs-form"
              multiline
            />
            <Section title="変更の記録">
              <Timeline
                label="この記事の変更の記録"
                variant="compact"
                items={[
                  {
                    datetime: "2026-09-15T09:05",
                    time: "9:05",
                    title: "本文を書き足しました",
                    actor: owner.name,
                    day: "今日",
                  },
                  {
                    datetime: "2026-09-14T17:30",
                    time: "17:30",
                    title: "題名を変えました",
                    actor: "佐藤 健",
                    day: "9月14日（月）",
                  },
                  {
                    datetime: "2026-09-10T10:00",
                    time: "10:00",
                    title: "記事を作りました",
                    actor: owner.name,
                    kind: "system",
                  },
                ]}
              />
            </Section>
          </div>
        }
      />
    </AppFrame>
  );
};
