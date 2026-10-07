import { Hono } from "hono";
import { html } from "hono/html";
import { getCookie } from "hono/cookie";
import { stylesheets } from "../src/hono/index";
import { getHonoExample } from "./hono-examples";
import { formatExample } from "./code-format";
import { componentDocs } from "./reference";
import { Document } from "./layout";
import { CatalogIndex, ComponentPage } from "./pages/catalog";
import { appPath, screens } from "./apps/frame";
import { ProjectScreen } from "./apps/project";
import { InboxScreen } from "./apps/inbox";
import { ScheduleScreen } from "./apps/schedule";
import { DocsScreen } from "./apps/docs";
import { FilesScreen } from "./apps/files";
import { SalesScreen } from "./apps/sales";
import { SearchScreen } from "./apps/search";
import { PeopleScreen } from "./apps/people";
import { SettingsScreen } from "./apps/settings";

const inboxMessages = ["categories", "meeting", "review"] as const;

/** 静的に書き出すページ。カタログのトップページ・コンポーネントのページ・利用例のアプリの画面だけを持つ。 */
export const paths = [
  "/",
  ...componentDocs.map(({ id }) => `/components/${id}`),
  "/components/page-header/preview",
  ...screens.map((screen) => appPath(screen.id)),
  ...inboxMessages.map((id) => `${appPath("inbox")}/${id}`),
];

export const app = new Hono();

app.get("/", (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="カタログ">
          <CatalogIndex components={componentDocs} />
        </Document>
      )}`,
  ),
);

// PageHeaderは画面に一つの見出しなので、コンポーネントのページの見出しと重ならないよう別の文書で見せる。
app.get("/components/page-header/preview", (c) =>
  c.html(
    html`<!doctype html>${(
        <html lang="ja">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>PageHeaderの見本</title>
            {stylesheets.map((file) => (
              <link rel="stylesheet" href={`/src/css/${file}`} />
            ))}
          </head>
          <body>{getHonoExample("page-header").render({ cookies: getCookie(c) })}</body>
        </html>
      )}`,
  ),
);

/** コンポーネントの見本の出力HTMLと、整形したHTML・Honoのコード。 */
export const renderExample = async (id: string, cookies: Record<string, string> = {}) => {
  const example = getHonoExample(id);
  const markup = String(await html`${example.render({ cookies })}`);
  const [htmlCode, jsxCode] = await Promise.all([
    formatExample(markup, "html"),
    formatExample(example.source, "tsx"),
  ]);
  return { markup, htmlCode, jsxCode };
};

app.get("/components/:id", async (c) => {
  const entry = componentDocs.find(({ id }) => id === c.req.param("id"));
  if (!entry) return c.notFound();
  const { markup, htmlCode, jsxCode } = await renderExample(entry.id, getCookie(c));
  return c.html(
    html`<!doctype html>${(
        <Document title={entry.name}>
          <ComponentPage
            components={componentDocs}
            entry={entry}
            markup={markup}
            htmlCode={htmlCode}
            jsxCode={jsxCode}
          />
        </Document>
      )}`,
  );
});

// 利用例のアプリのトップページ。静的な書き出しには含めず、開発サーバーでだけプロジェクトの画面へ移動させる。
app.get("/apps", (c) => c.redirect(appPath("project")));
app.get(appPath("project"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="プロジェクト">
          <ProjectScreen />
        </Document>
      )}`,
  ),
);
app.get(appPath("inbox"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="受信トレイ">
          <InboxScreen />
        </Document>
      )}`,
  ),
);
app.get(`${appPath("inbox")}/:message`, (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="受信トレイ">
          <InboxScreen message={c.req.param("message")} />
        </Document>
      )}`,
  ),
);
app.get(appPath("schedule"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="予定">
          <ScheduleScreen
            year={c.req.query("year")}
            month={c.req.query("month")}
            view={c.req.query("view")}
            week={c.req.query("week")}
          />
        </Document>
      )}`,
  ),
);
app.get(appPath("docs"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="文書">
          <DocsScreen article={c.req.query("article")} />
        </Document>
      )}`,
  ),
);
app.get(appPath("files"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="資料">
          <FilesScreen kind={c.req.query("kind")} />
        </Document>
      )}`,
  ),
);
app.get(appPath("sales"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="売上">
          <SalesScreen />
        </Document>
      )}`,
  ),
);
app.get(appPath("search"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="検索">
          <SearchScreen query={c.req.query("q")} state={c.req.query("state")} />
        </Document>
      )}`,
  ),
);
app.get(appPath("people"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="メンバー">
          <PeopleScreen member={c.req.query("member")} />
        </Document>
      )}`,
  ),
);
app.get(appPath("settings"), (c) =>
  c.html(
    html`<!doctype html>${(
        <Document title="設定">
          <SettingsScreen />
        </Document>
      )}`,
  ),
);
