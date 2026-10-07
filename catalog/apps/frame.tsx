import type { PropsWithChildren } from "hono/jsx";
import { AppShell, Avatar, CommandMenu, type AppShellProps, type IconName } from "../../src/hono";

/** 利用例のアプリ「つむぐ」の画面。小さな制作チームが、ヘルプセンターを作り直す仕事を進めている。 */
export type AppScreen =
  | "project"
  | "inbox"
  | "schedule"
  | "docs"
  | "files"
  | "sales"
  | "search"
  | "people"
  | "settings";

type ScreenEntry = {
  id: AppScreen;
  label: string;
  icon: IconName;
  accent: "blue" | "green" | "amber" | "coral";
  description: string;
  keywords?: readonly string[];
};

export const screens: readonly ScreenEntry[] = [
  {
    id: "project",
    label: "プロジェクト",
    icon: "layers",
    accent: "green",
    description: "仕事の進み具合を見渡す",
    keywords: ["ボード", "タスク"],
  },
  {
    id: "inbox",
    label: "受信トレイ",
    icon: "mail",
    accent: "blue",
    description: "届いた連絡を読む・整理する",
    keywords: ["メール", "inbox"],
  },
  {
    id: "schedule",
    label: "予定",
    icon: "calendar",
    accent: "amber",
    description: "打ち合わせと締め切りを確かめる",
    keywords: ["カレンダー"],
  },
  {
    id: "docs",
    label: "文書",
    icon: "pencil",
    accent: "coral",
    description: "記事を書いて公開の準備をする",
    keywords: ["記事", "下書き"],
  },
  {
    id: "files",
    label: "資料",
    icon: "file",
    accent: "amber",
    description: "チームの資料を探す・差し替える",
    keywords: ["ファイル"],
  },
  {
    id: "sales",
    label: "売上",
    icon: "chart",
    accent: "coral",
    description: "数値と推移を確かめる",
    keywords: ["集計", "レポート"],
  },
  {
    id: "search",
    label: "検索",
    icon: "search",
    accent: "blue",
    description: "記事と資料をキーワードで探す",
  },
  {
    id: "people",
    label: "メンバー",
    icon: "user",
    accent: "green",
    description: "チームの人と連絡先を見る",
    keywords: ["人", "連絡先"],
  },
  {
    id: "settings",
    label: "設定",
    icon: "grid",
    accent: "blue",
    description: "ワークスペースの名前や通知を変える",
  },
];

export const appPath = (screen: AppScreen) => `/apps/${screen}`;

/** アプリの画面の枠。ヘッダーの移動先で画面を切り替え、中央のシートに画面を置く。sizeは作業面の幅。 */
export const AppFrame = ({
  current,
  size,
  children,
}: PropsWithChildren<{ current: AppScreen; size?: AppShellProps["size"] }>) => (
  <AppShell
    size={size}
    home={<a href={appPath("project")}>つむぐ</a>}
    navigation={screens.map((screen) => ({
      label: screen.label,
      href: appPath(screen.id),
      current: screen.id === current,
    }))}
    commands={
      <CommandMenu
        id="app-commands"
        label="つむぐチーム"
        shortcut="mod+k"
        shortcuts={screens.slice(0, 4).map((screen) => ({
          label: screen.label,
          href: appPath(screen.id),
          icon: screen.icon,
          accent: screen.accent,
        }))}
        groups={[
          {
            label: "仕事を進める",
            items: screens.slice(0, 4).map((screen) => ({
              ...screen,
              href: appPath(screen.id),
              current: screen.id === current,
            })),
          },
          {
            label: "記録とチーム",
            items: screens.slice(4).map((screen) => ({
              ...screen,
              href: appPath(screen.id),
              current: screen.id === current,
            })),
          },
          {
            label: "Retrix",
            items: [
              {
                label: "コンポーネントカタログ",
                href: "/",
                icon: "grid",
                description: "この画面のコンポーネントと使い方を見る",
              },
            ],
          },
        ]}
      />
    }
    account={
      <>
        <Avatar name="田中 遥" initials="遥" tone="coral" size="small" />
        <a href={appPath("settings")}>田中 遥</a>
        <a href="/">コンポーネントカタログ</a>
      </>
    }
  >
    {children}
  </AppShell>
);
