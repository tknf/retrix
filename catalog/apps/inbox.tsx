import {
  ActionDock,
  BackLink,
  PageHeader,
  TextEditor,
  Tabs,
  MessageList,
  Message,
  Avatar,
  Button,
} from "../../src/hono";
import { AppFrame, appPath } from "./frame";

const people = [
  { name: "森 美咲", initials: "美", tone: "green" },
  { name: "佐藤 健", initials: "健", tone: "blue" },
  { name: "田中 遥", initials: "遥", tone: "coral" },
] as const;
const messages = [
  {
    id: "categories",
    person: 0,
    title: "カテゴリ案をまとめました",
    preview: "5つのカテゴリに整理してみました。まずは実際の記事を入れて、試してみませんか。",
    time: "10:24",
    datetime: "2026-09-15T10:24:00+09:00",
    body: [
      "おはようございます。ヘルプセンターの記事を、5つのカテゴリに整理してみました。",
      "「はじめての方へ」を入口にして、設定・使い方・お支払い・困ったとき、へ進める構成です。",
      "まずはこの形で記事を入れて、実際に探しやすいか試してみたいです。",
    ],
  },
  {
    id: "meeting",
    person: 1,
    title: "来週の打ち合わせについて",
    preview: "火曜日14時から、30分ほどお話しできればと思っています。",
    time: "9:42",
    datetime: "2026-09-15T09:42:00+09:00",
    body: [
      "新しいヘルプセンターの件、来週の火曜日14時から、30分ほどお話しできればと思っています。",
      "先にカテゴリ案に目を通していただけると助かります。ご都合が悪ければ、別の日でも大丈夫です。",
    ],
  },
  {
    id: "review",
    person: 2,
    title: "公開前のチェックをお願いします",
    preview: "リンク・スマートフォンでの表示・初めて使う方の確認。3つに絞りました。",
    time: "8:15",
    datetime: "2026-09-15T08:15:00+09:00",
    body: [
      "公開前に確認したいことを、3つに絞りました。リンク切れ、スマートフォンでの表示、初めて使う方の確認です。",
      "気づいたことを返信で教えてください。修正できたものから、プロジェクトのチェックを進めていきましょう。",
    ],
  },
] as const;
const folders = [
  {
    id: "inbox",
    label: "受信トレイ",
    empty: "ひとまず、ひと区切り。",
    description: "届いた連絡はすべて確認できました。",
  },
  {
    id: "later",
    label: "あとで",
    empty: "あとで読む連絡はありません",
    description: "今すぐ取りかかれない連絡を、ここに置いておけます。",
  },
  {
    id: "done",
    label: "確認済み",
    empty: "確認済みの連絡はありません",
    description: "確認を終えた連絡も、ここから読み返せます。",
  },
] as const;

export const InboxScreen = ({ message }: { message?: string } = {}) => {
  const selected = messages.find((item) => item.id === message);
  return (
    <AppFrame current="inbox">
      <div class="rx-stack" data-controller="inbox-demo" data-inbox-message={selected?.id}>
        {selected ? (
          <>
            <BackLink href={appPath("inbox")} label="受信トレイ" />
            <div class="rx-reading-pane">
              <PageHeader title={selected.title} />
              <Message
                layout="document"
                author={people[selected.person].name}
                time={`今日 ${selected.time}`}
                datetime={selected.datetime}
                avatar={<Avatar {...people[selected.person]} size="small" />}
              >
                {selected.body.map((paragraph) => (
                  <p>{paragraph}</p>
                ))}
              </Message>
              <form class="rx-stack" data-space="small" data-inbox-draft>
                <TextEditor
                  id="inbox-reply"
                  label={`${people[selected.person].name}への返信`}
                  name="reply"
                  rows={4}
                  placeholder="返信を書く…"
                  placement="bottom"
                  tools={["bold", "italic", "link", "|", "bullets", "|", "attach"]}
                  actions={<Button type="submit">下書きを保存</Button>}
                />
                <p class="rx-save-status" role="status" data-inbox-status />
              </form>
            </div>
            <ActionDock
              label="連絡を整理する"
              items={[
                {
                  label: "受信トレイに戻す",
                  icon: "back",
                  "data-inbox-folder": "inbox",
                  hidden: true,
                },
                { label: "あとで読む", icon: "clock", shortcut: "L", "data-inbox-folder": "later" },
                {
                  label: "確認を終える",
                  icon: "check",
                  accent: "green",
                  shortcut: "E",
                  "data-inbox-folder": "done",
                },
              ]}
            />
          </>
        ) : (
          <>
            <PageHeader title="受信トレイ" />
            <Tabs
              id="inbox-folders"
              label="連絡の状態"
              items={folders.map((folder) => ({
                value: folder.id,
                label: folder.label,
                count: folder.id === "inbox" ? messages.length : 0,
                content: (
                  <div class="rx-stack" data-space="small" data-inbox-folder-panel={folder.id}>
                    <MessageList
                      label={folder.label}
                      items={
                        folder.id === "inbox"
                          ? messages.map((item) => ({
                              id: item.id,
                              sender: people[item.person].name,
                              title: item.title,
                              preview: item.preview,
                              href: `${appPath("inbox")}/${item.id}`,
                              time: item.time,
                              datetime: item.datetime,
                              avatar: <Avatar {...people[item.person]} size="small" />,
                              unread: true,
                            }))
                          : []
                      }
                      empty={{
                        title: folder.empty,
                        description: <p>{folder.description}</p>,
                        kind: folder.id === "inbox" ? "complete" : "empty",
                      }}
                    />
                  </div>
                ),
              }))}
            />
          </>
        )}
      </div>
    </AppFrame>
  );
};
