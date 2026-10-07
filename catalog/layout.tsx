import type { PropsWithChildren } from "hono/jsx";
import { AppShell, CommandMenu, stylesheets, type IconName } from "../src/hono/index";
import { screens, appPath } from "./apps/frame";
import { componentGroups } from "./component-groups";

export type ComponentEntry = { id: string; name: string; description: string };

/** カタログの分類のアイコンと色。一覧のタイルとコマンドメニューの項目で同じものを使う。 */
export const groupLooks: readonly {
  icon: IconName;
  accent: "blue" | "green" | "amber" | "coral";
}[] = [
  { icon: "layers", accent: "green" },
  { icon: "pencil", accent: "blue" },
  { icon: "lightning", accent: "amber" },
  { icon: "files", accent: "blue" },
  { icon: "calendar", accent: "coral" },
  { icon: "bell", accent: "amber" },
];

export const groupAnchor = (index: number) => `group-${index}`;

/** HTML文書の外側。カタログもアプリの利用例も同じスタイルシートとスクリプトを読む。 */
export const Document = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title} · Retrix</title>
      {stylesheets.map((file) => (
        <link rel="stylesheet" href={`/src/css/${file}`} />
      ))}
      <link rel="stylesheet" href="/catalog/catalog.css" />
      <script
        type="module"
        src={import.meta.env.PROD ? "/assets/client.js" : "/catalog/client.ts"}
      />
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
);

/**
 * カタログの枠。Retrixのアプリと同じく、ヘッダーに名前・主な移動先・CommandMenuを並べ、中央のシートに中身を置く。
 * カタログのトップページはコンポーネントの分類、一覧は全コンポーネントと利用例のアプリの画面。
 */
export const CatalogFrame = ({
  components,
  current,
  children,
}: PropsWithChildren<{ components: readonly ComponentEntry[]; current?: string }>) => (
  <AppShell
    home={<a href="/">Retrix</a>}
    navigation={[
      { label: "コンポーネント", href: "/", current: true },
      { label: "利用例", href: appPath("project") },
    ]}
    commands={
      <CommandMenu
        id="catalog-commands"
        label="コンポーネントカタログ"
        icon="search"
        // 全体のショートカットキーは一つのCommandMenuにだけ登録する。CommandMenuのページでは見本がmod+kを使うので譲る。
        shortcut={current === "command-menu" ? undefined : "mod+k"}
        columns={3}
        shortcuts={componentGroups.map((group, index) => ({
          label: group.name,
          href: `/#${groupAnchor(index)}`,
          icon: groupLooks[index]?.icon ?? "grid",
          accent: groupLooks[index]?.accent ?? "blue",
        }))}
        groups={[
          ...componentGroups.map((group) => ({
            label: group.name,
            items: group.ids.flatMap((id) => {
              const entry = components.find((component) => component.id === id);
              return entry
                ? [
                    {
                      label: entry.name,
                      href: `/components/${entry.id}`,
                      description: entry.description,
                      current: entry.id === current,
                      keywords: [entry.id],
                    },
                  ]
                : [];
            }),
          })),
          {
            label: "実務アプリの利用例",
            items: screens.map((screen) => ({
              label: screen.label,
              href: appPath(screen.id),
              icon: screen.icon,
              accent: screen.accent,
              description: screen.description,
            })),
          },
        ]}
      />
    }
    footer={<span>Retrix · Basecamp 2の頃の37signalsの画面を手本にしたデザインシステム</span>}
  >
    {children}
  </AppShell>
);
