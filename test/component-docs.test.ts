import { format } from "prettier";
import { describe, expect, test } from "vite-plus/test";
import { renderExample } from "../catalog/app";
import {
  componentApi,
  componentDocs,
  componentIndexMarkdown,
  componentMarkdown,
  propDescription,
} from "../catalog/reference";

const apis = componentApi();
/** 表の列をそろえる。コードの中身は見本のファイルのまま残す。 */
const markdown = (text: string) =>
  format(text, { parser: "markdown", embeddedLanguageFormatting: "off" });

describe("コンポーネントのリファレンス", () => {
  test("全ての公開コンポーネントを、ちょうど一つのページで説明する", () => {
    const pages = new Map<string, string[]>();
    for (const doc of componentDocs)
      for (const name of doc.api) pages.set(name, [...(pages.get(name) ?? []), doc.id]);
    const missing = [...apis.keys()].filter((name) => !pages.has(name));
    const duplicated = [...pages].filter(([, ids]) => ids.length > 1).map(([name]) => name);
    const unknown = [...pages.keys()].filter((name) => !apis.has(name));
    expect({ missing, duplicated, unknown }).toEqual({ missing: [], duplicated: [], unknown: [] });
  });

  test("各ページに使いどころと使い方がある", () => {
    const empty = componentDocs
      .filter((doc) => doc.guidance.length === 0 || doc.usage.length === 0)
      .map((doc) => doc.id);
    expect(empty).toEqual([]);
  });

  test("全てのpropsと、propsが参照する型の項目に説明がある", () => {
    const undocumented = componentDocs.flatMap((doc) =>
      doc.api.flatMap((name) => {
        const api = apis.get(name);
        if (!api) return [];
        return [
          ...api.props
            .filter((prop) => !propDescription(doc, name, prop))
            .map((prop) => `${name}.${prop.name}`),
          ...api.types.flatMap((type) =>
            type.variants.flatMap((variant) =>
              variant.props
                .filter((prop) => !propDescription(doc, name, prop))
                .map((prop) => `${name}の${type.name}.${prop.name}`),
            ),
          ),
        ];
      }),
    );
    expect([...new Set(undocumented)]).toEqual([]);
  });

  test("propNotesは実在するpropsだけに書く", () => {
    const stale = componentDocs.flatMap((doc) =>
      Object.entries(doc.propNotes ?? {}).flatMap(([name, notes]) =>
        Object.keys(notes)
          .filter((prop) => !apis.get(name)?.props.some((candidate) => candidate.name === prop))
          .map((prop) => `${doc.id}: ${name}.${prop}`),
      ),
    );
    expect(stale).toEqual([]);
  });

  test("docs/componentsの一覧が最新である", async () => {
    await expect(await markdown(componentIndexMarkdown())).toMatchFileSnapshot(
      "../docs/components/README.md",
    );
  });

  test("Agent Skillの部品一覧が最新である", async () => {
    const docs = "https://github.com/tknf/retrix/blob/main/docs";
    await expect(
      await markdown(
        componentIndexMarkdown({
          componentHref: (id) => `${docs}/components/${id}.md`,
          controllersHref: `${docs}/controllers.md`,
        }),
      ),
    ).toMatchFileSnapshot("../skills/retrix/references/components.md");
  });

  test.each(componentDocs.map((doc) => [doc.id, doc] as const))(
    "docs/components/%s.mdが最新である",
    async (id, doc) => {
      const { htmlCode, jsxCode } = await renderExample(id);
      await expect(
        await markdown(componentMarkdown(doc, { jsx: jsxCode.code, html: htmlCode.code })),
      ).toMatchFileSnapshot(`../docs/components/${id}.md`);
    },
  );
});
