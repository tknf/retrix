import {
  Avatar,
  EmptyState,
  FilterBar,
  Icon,
  InputGroup,
  PageHeader,
  SearchResults,
  Section,
} from "../../src/hono";
import { articles, files, members } from "./data";
import { AppFrame, appPath } from "./frame";

const states = ["公開中", "下書き", "確認待ち"] as const;

/** 検索。キーワードと状態で記事と資料を探し、一致した語を強調して並べる。絞り込みはURLに持たせる。 */
export const SearchScreen = ({ query = "", state }: { query?: string; state?: string }) => {
  const q = query.trim();
  const current = states.find((entry) => entry === state);
  const matches = (text: string) => !q || text.toLocaleLowerCase().includes(q.toLocaleLowerCase());
  const foundArticles = articles.filter(
    (article) =>
      (!current || article.state === current) &&
      matches(`${article.title} ${article.excerpt} ${article.category}`),
  );
  const foundFiles = current ? [] : files.filter((file) => matches(file.name));
  const url = (next: string | undefined) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (next) params.set("state", next);
    const search = params.toString();
    return search ? `${appPath("search")}?${search}` : appPath("search");
  };
  return (
    <AppFrame current="search">
      <PageHeader title="検索" icon={<Icon name="search" />} />
      <form
        action={appPath("search")}
        method="get"
        role="search"
        class="rx-stack"
        data-space="small"
      >
        <InputGroup
          id="search-query"
          type="search"
          name="q"
          value={q}
          aria-label="記事と資料を探す"
          placeholder="記事と資料を探す…"
          autocomplete="off"
          prefix={<Icon name="search" />}
          action={{ label: "検索", type: "submit" }}
        />
        {current && <input type="hidden" name="state" value={current} />}
        <FilterBar
          label="記事の状態"
          items={[
            { label: "すべて", href: url(undefined), current: !current },
            ...states.map((entry) => ({
              label: entry,
              href: url(entry),
              current: current === entry,
            })),
          ]}
        />
      </form>
      {foundArticles.length + foundFiles.length === 0 ? (
        <EmptyState title="見つかりませんでした">
          <p>キーワードを短くするか、状態を「すべて」にして探してみてください。</p>
        </EmptyState>
      ) : (
        <>
          {foundArticles.length > 0 && (
            <Section title="記事" count={foundArticles.length}>
              <SearchResults
                label="記事の検索結果"
                query={q}
                results={foundArticles.map((article) => {
                  const owner = members[article.owner];
                  return {
                    title: article.title,
                    href: `${appPath("docs")}?article=${article.id}`,
                    excerpt: article.excerpt,
                    meta: `${article.category} · ${article.state} · ${owner.name} · ${article.updated}`,
                    leading: (
                      <Avatar
                        name={owner.name}
                        initials={owner.initials}
                        tone={owner.tone}
                        size="small"
                      />
                    ),
                  };
                })}
              />
            </Section>
          )}
          {foundFiles.length > 0 && (
            <Section title="資料" count={foundFiles.length}>
              <SearchResults
                label="資料の検索結果"
                query={q}
                results={foundFiles.map((file) => ({
                  title: file.name,
                  href: appPath("files"),
                  meta: `${file.kind} · ${file.size} · ${file.updated}`,
                  leading: <Icon name="file" />,
                }))}
              />
            </Section>
          )}
        </>
      )}
    </AppFrame>
  );
};
