import {
  readComponentApi,
  type ComponentApi,
  type PropDoc,
  type TypeDoc,
} from "../scripts/component-api";
import { componentGroups } from "./component-groups";

/**
 * コンポーネントのページの説明。文中の`code`はコードとして表示する。
 * propsの型と説明はsrc/honoの型とJSDocから作るので、ここには書かない。
 */
export type ComponentDoc = {
  id: string;
  name: string;
  /** 一覧とページの見出しに出す一文。 */
  description: string;
  /** このページで説明する公開コンポーネント。先頭が主なコンポーネント。 */
  api: readonly string[];
  /** 使いどころと、似たコンポーネントとの使い分け。 */
  guidance: readonly string[];
  /** 受け渡しと振る舞い。段落ごとに一要素。 */
  usage: readonly string[];
  /** キーと、そのキーで起きること。 */
  keyboard?: readonly (readonly [key: string, action: string])[];
  /** 読み上げ・フォーカス・ARIAの約束と、利用側が担うこと。 */
  accessibility?: readonly string[];
  /** 発火するイベントと、detailの中身。 */
  events?: readonly (readonly [name: string, detail: string])[];
  /** JSDocを書けないprops（標準のHTML属性やchildren）の説明。コンポーネント名→prop名→説明。 */
  propNotes?: Readonly<Record<string, Readonly<Record<string, string>>>>;
};

const modules = import.meta.glob<{ default: ComponentDoc }>("./component-docs/*.ts", {
  eager: true,
});

/** 分類の順に並べた全コンポーネントの説明。 */
export const componentDocs: readonly ComponentDoc[] = componentGroups.flatMap((group) =>
  group.ids.map((id) => {
    const doc = modules[`./component-docs/${id}.ts`]?.default;
    if (!doc) throw new Error(`コンポーネントの説明がありません: ${id}`);
    return doc;
  }),
);

let apiCache: Map<string, ComponentApi> | undefined;
/** src/honoの型から読んだ公開コンポーネントのAPI。型の解析は一度だけ行う。 */
export const componentApi = () => (apiCache ??= readComponentApi());

/** propsの説明。JSDocが無ければpropNotesを使う。 */
export const propDescription = (doc: ComponentDoc, component: string, prop: PropDoc) =>
  prop.description || doc.propNotes?.[component]?.[prop.name] || "";

export const requiredLabel = { yes: "必須", some: "形による", no: "" } as const;

/** 残りのpropsの行き先の説明。 */
export const elementNote = (element: string) =>
  /^[A-Z]/.test(element)
    ? `ほかのpropsは${element
        .split("・")
        .map((name) => `\`${name}\``)
        .join("または")}へそのまま渡します。`
    : `ほかに、\`<${element}>\`へ標準のHTML属性を渡せます。`;

/** Markdownの表のセル。縦線と改行をエスケープする。 */
const cell = (text: string) => text.replaceAll("|", "\\|").replaceAll("\n", " ");
const code = (text: string) => (text ? `\`${text}\`` : "");

const propTable = (doc: ComponentDoc, component: string, props: readonly PropDoc[]) => [
  "| 名前 | 型 | 既定値 | 説明 |",
  "| --- | --- | --- | --- |",
  ...props.map(
    (prop) =>
      `| ${code(prop.name)}${prop.required === "no" ? "" : `（${requiredLabel[prop.required]}）`} | ${cell(code(prop.type))} | ${cell(code(prop.defaultValue ?? ""))} | ${cell(propDescription(doc, component, prop))} |`,
  ),
];

/** 公開コンポーネントを説明するページのid。 */
export const pageOf = (component: string) =>
  componentDocs.find((doc) => doc.api.includes(component))?.id;

/** 型の見出し。直接書いたオブジェクト型は「`items`の項目」とする。 */
export const typeHeading = (type: TypeDoc) =>
  type.inline ? `\`${type.name}\`の項目` : `\`${type.name}\``;

const typeSection = (doc: ComponentDoc, component: string, type: TypeDoc) => [
  `#### ${typeHeading(type)}`,
  "",
  ...(type.component
    ? [`[${type.component}](${pageOf(type.component)}.md)のpropsと同じです。`, ""]
    : []),
  ...(type.description ? [type.description, ""] : []),
  ...(type.values
    ? [`値：${type.values.includes("docs/") ? type.values : code(type.values)}`, ""]
    : []),
  ...type.variants.flatMap((variant) => [
    ...(variant.label ? [`${variant.label}`, ""] : []),
    ...propTable(doc, component, variant.props),
    "",
  ]),
];

/** docs/components/<id>.mdの本文。カタログのコンポーネントのページと同じ内容を持つ。 */
export const componentMarkdown = (doc: ComponentDoc, example: { jsx: string; html: string }) => {
  const apis = componentApi();
  const list = (items: readonly string[] | undefined) => (items ?? []).map((item) => `- ${item}`);
  const lines = [
    "<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->",
    "",
    `# ${doc.name}`,
    "",
    doc.description,
    "",
    "## 使いどころ",
    "",
    ...list(doc.guidance),
    "",
    "## 使い方",
    "",
    ...doc.usage.flatMap((paragraph) => [paragraph, ""]),
  ];
  if (doc.keyboard?.length)
    lines.push(
      "## キーボード",
      "",
      "| キー | 動作 |",
      "| --- | --- |",
      ...doc.keyboard.map(([key, action]) => `| ${cell(key)} | ${cell(action)} |`),
      "",
    );
  if (doc.accessibility?.length)
    lines.push("## アクセシビリティ", "", ...list(doc.accessibility), "");
  if (doc.events?.length)
    lines.push(
      "## イベント",
      "",
      "| イベント | 内容 |",
      "| --- | --- |",
      ...doc.events.map(([name, detail]) => `| ${code(name)} | ${cell(detail)} |`),
      "",
    );
  lines.push("## API", "");
  for (const name of doc.api) {
    const api = apis.get(name);
    if (!api) throw new Error(`公開されていないコンポーネントです: ${name}`);
    lines.push(`### ${name}`, "");
    if (api.description) lines.push(api.description, "");
    if (api.props.length > 0) lines.push(...propTable(doc, name, api.props), "");
    if (api.element) lines.push(elementNote(api.element), "");
    if (api.controllers.length > 0)
      lines.push(
        "登録するcontroller：" +
          api.controllers
            .map((entry) => {
              const [identifier, controller] = entry.split(":");
              return `\`${identifier}\`（\`${controller}\`）`;
            })
            .join("、"),
        "",
      );
    lines.push(`読み込むCSS：${api.stylesheets.map(code).join("、")}`, "");
    for (const type of api.types) lines.push(...typeSection(doc, name, type));
  }
  lines.push(
    "## コード",
    "",
    "```tsx",
    example.jsx.trimEnd(),
    "```",
    "",
    "<details>",
    "<summary>出力されるHTML</summary>",
    "",
    "```html",
    example.html.trimEnd(),
    "```",
    "",
    "</details>",
    "",
  );
  return lines.join("\n");
};

/** docs/components/README.md。分類ごとの全コンポーネントと、controllerの登録名の一覧。 */
/**
 * docs/components/README.mdと、Agent Skillの部品一覧の本文。
 * skillは利用するプロジェクトへ入れて読むので、リンクはリポジトリのURLにする。
 */
export const componentIndexMarkdown = ({
  componentHref = (id: string) => `${id}.md`,
  controllersHref = "../controllers.md",
}: { componentHref?: (id: string) => string; controllersHref?: string } = {}) => {
  const apis = componentApi();
  const controllers = new Map<string, { controller: string; components: Set<string> }>();
  for (const doc of componentDocs)
    for (const name of doc.api)
      for (const entry of apis.get(name)?.controllers ?? []) {
        const [identifier, controller] = entry.split(":");
        const found = controllers.get(identifier) ?? { controller, components: new Set() };
        found.components.add(`[${name}](${componentHref(doc.id)})`);
        controllers.set(identifier, found);
      }
  return [
    "<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->",
    "",
    "# コンポーネント",
    "",
    "全コンポーネントのリファレンスです。カタログの各ページ（`/components/<id>`）と同じ内容で、見本の表示はカタログで確認できます。",
    "",
    ...componentGroups.flatMap((group) => [
      `## ${group.name}`,
      "",
      ...group.ids.map((id) => {
        const doc = componentDocs.find((candidate) => candidate.id === id);
        return doc ? `- [${doc.name}](${componentHref(id)})：${doc.description}` : "";
      }),
      "",
    ]),
    "## controllerの登録名",
    "",
    `\`@tknf/retrix/controllers\`のcontrollerを、次の登録名でStimulusのApplicationへ登録します。登録の仕方は[controller](${controllersHref})を参照してください。`,
    "",
    "| 登録名 | controller | 使うコンポーネント |",
    "| --- | --- | --- |",
    ...[...controllers]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([identifier, { controller, components }]) =>
          `| \`${identifier}\` | \`${controller}\` | ${[...components].join("、")} |`,
      ),
    "",
  ].join("\n");
};
