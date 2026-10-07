import {
  ActionLink,
  Avatar,
  DataList,
  DropdownMenu,
  Icon,
  PageHeader,
  ProfileHeader,
  SearchResults,
  Section,
  SplitView,
  Tag,
  Timeline,
  ValueList,
} from "../../src/hono";
import { articles, members } from "./data";
import { AppFrame, appPath } from "./frame";

const activity = {
  haruka: [
    { datetime: "2026-09-15T10:31", time: "10:31", title: "会話に返信しました", day: "今日" },
    {
      datetime: "2026-09-15T09:05",
      time: "9:05",
      title: "「通知の受け取り方を変える」を書き始めました",
    },
    {
      datetime: "2026-09-12T16:40",
      time: "16:40",
      title: "「はじめての方へ」を公開しました",
      day: "9月12日（土）",
    },
  ],
  ken: [
    {
      datetime: "2026-09-14T18:20",
      time: "18:20",
      title: "スマートフォンの画面の見本を追加しました",
      day: "9月14日（月）",
    },
    {
      datetime: "2026-09-13T11:00",
      time: "11:00",
      title: "「データを書き出す」を確認に回しました",
      day: "9月13日（日）",
    },
  ],
  misaki: [
    { datetime: "2026-09-15T10:24", time: "10:24", title: "カテゴリ案をまとめました", day: "今日" },
    {
      datetime: "2026-09-11T15:10",
      time: "15:10",
      title: "「メンバーを招待する」を公開しました",
      day: "9月11日（金）",
    },
  ],
} as const;

/** メンバー。チームの人を一覧から選び、連絡先と担当している記事、最近の動きを読む。 */
export const PeopleScreen = ({ member }: { member?: string }) => {
  const selected = members.find((entry) => entry.id === member) ?? members[2];
  const owned = articles.filter((article) => members[article.owner].id === selected.id);
  return (
    <AppFrame current="people">
      <PageHeader
        title="メンバー"
        icon={<Icon name="user" />}
        description="つむぐチームの3人です。"
      />
      <SplitView
        primary={
          <div class="rx-stack">
            <ProfileHeader
              headingLevel={2}
              name={selected.name}
              avatar={
                <Avatar
                  name={selected.name}
                  initials={selected.initials}
                  tone={selected.tone}
                  size="large"
                />
              }
              detail={selected.email}
              badge={<Tag label={selected.role} />}
              actions={
                <ActionLink href={`mailto:${selected.email}`} variant="primary">
                  メールを送る
                </ActionLink>
              }
              preferences={
                <DropdownMenu
                  id="people-notify"
                  label="更新を通知する"
                  icon="bell"
                  items={[
                    {
                      kind: "radio",
                      name: "notify",
                      value: "on",
                      label: "更新を通知する",
                      checked: true,
                    },
                    { kind: "radio", name: "notify", value: "off", label: "通知しない" },
                  ]}
                />
              }
            />
            <ValueList
              items={[
                { label: "役割", value: selected.role },
                { label: "メール", value: selected.email },
                { label: "連絡できる時間", value: selected.hours },
              ]}
            />
            <Section title="担当している記事" count={owned.length}>
              <SearchResults
                label={`${selected.name}が担当している記事`}
                results={owned.map((article) => ({
                  title: article.title,
                  href: `${appPath("docs")}?article=${article.id}`,
                  meta: `${article.category} · ${article.state} · ${article.updated}`,
                }))}
              />
            </Section>
            <Section title="最近の動き">
              <Timeline
                label={`${selected.name}の最近の動き`}
                variant="compact"
                items={activity[selected.id].map((entry) => ({ ...entry }))}
              />
            </Section>
          </div>
        }
        secondary={
          <Section title="チーム" count={members.length}>
            <DataList
              aria-label="メンバー"
              items={members.map((entry) => ({
                title: entry.name,
                description: entry.role,
                href: `${appPath("people")}?member=${entry.id}`,
                current: entry.id === selected.id,
                start: (
                  <Avatar
                    name={entry.name}
                    initials={entry.initials}
                    tone={entry.tone}
                    size="small"
                  />
                ),
              }))}
            />
          </Section>
        }
      />
    </AppFrame>
  );
};
