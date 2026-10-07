import { raw } from "hono/html";
import type { Child } from "hono/jsx";
import {
  ActionLink,
  ActionList,
  CodeBlock,
  ContextBar,
  Disclosure,
  DisclosureGroup,
  Icon,
  LayerCard,
  PageHeader,
  Section,
  Table,
} from "../../src/hono";
import type { PropDoc, TypeDoc } from "../../scripts/component-api";
import { appPath, screens } from "../apps/frame";
import { componentGroups } from "../component-groups";
import { CatalogFrame, groupAnchor, type ComponentEntry } from "../layout";
import {
  componentApi,
  elementNote,
  pageOf,
  propDescription,
  requiredLabel,
  typeHeading,
  type ComponentDoc,
} from "../reference";

/** カタログのトップページ。利用例のアプリの画面と、分類ごとの全コンポーネントを並べる。 */
export const CatalogIndex = ({ components }: { components: readonly ComponentEntry[] }) => (
  <CatalogFrame components={components}>
    <PageHeader
      title="Retrix"
      description={`${components.length}種類のコンポーネント。上部中央のコマンドメニューから名前で探せます。`}
    />
    <LayerCard
      title="実務アプリの利用例"
      actions={<ActionLink href={appPath("project")}>アプリを開く</ActionLink>}
    >
      <ActionList
        layout="grid"
        items={screens.map((screen) => ({
          title: screen.label,
          description: screen.description,
          href: appPath(screen.id),
          icon: <Icon name={screen.icon} fill />,
          accent: screen.accent,
        }))}
      />
    </LayerCard>
    {componentGroups.map((group, index) => (
      <Section id={groupAnchor(index)} title={group.name} count={group.ids.length}>
        <ActionList
          layout="grid"
          aria-label={group.name}
          items={group.ids.flatMap((id) => {
            const entry = components.find((component) => component.id === id);
            return entry
              ? [
                  {
                    title: entry.name,
                    description: entry.description,
                    href: `/components/${entry.id}`,
                  },
                ]
              : [];
          })}
        />
      </Section>
    ))}
  </CatalogFrame>
);

/** 文中の`code`をcode要素にする。 */
const inline = (text: string): Child[] =>
  text.split("`").map((part, index) => (index % 2 === 1 ? <code>{part}</code> : part));

const PropTable = ({
  doc,
  component,
  caption,
  props,
}: {
  doc: ComponentDoc;
  component: string;
  caption: string;
  props: readonly PropDoc[];
}) => (
  <Table caption={caption}>
    <thead>
      <tr>
        <th scope="col">名前</th>
        <th scope="col">型</th>
        <th scope="col">既定値</th>
        <th scope="col">説明</th>
      </tr>
    </thead>
    <tbody>
      {props.map((prop) => (
        <tr>
          <th scope="row">
            <code>{prop.name}</code>
            {prop.required !== "no" && (
              <span class="catalog-required">{requiredLabel[prop.required]}</span>
            )}
          </th>
          <td>
            <code>{prop.type}</code>
          </td>
          <td>{prop.defaultValue && <code>{prop.defaultValue}</code>}</td>
          <td>{inline(propDescription(doc, component, prop))}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const TypeReference = ({
  doc,
  component,
  type,
}: {
  doc: ComponentDoc;
  component: string;
  type: TypeDoc;
}) => (
  <section class="rx-stack" data-space="small">
    <h4>{inline(typeHeading(type))}</h4>
    {type.description && <p>{inline(type.description)}</p>}
    {type.component && (
      <p>
        <a href={`/components/${pageOf(type.component)}`}>{type.component}</a>
        のpropsと同じです。
      </p>
    )}
    {type.values && (
      <p>
        値：
        {type.values.includes("docs/") ? (
          <a href="/components/icon">Iconの見本</a>
        ) : (
          <code>{type.values}</code>
        )}
      </p>
    )}
    {type.variants.map((variant) => (
      <PropTable
        doc={doc}
        component={component}
        caption={`${type.inline ? `${type.name}の項目` : type.name}${variant.label ? `（${variant.label}）` : ""}`}
        props={variant.props}
      />
    ))}
  </section>
);

/** コンポーネントのページの説明とAPI。docs/components/<id>.mdと同じ内容を持つ。 */
const Reference = ({ doc }: { doc: ComponentDoc }) => {
  const apis = componentApi();
  return (
    <div class="rx-stack catalog-reference">
      <Section title="使いどころ">
        <ul>
          {doc.guidance.map((item) => (
            <li>{inline(item)}</li>
          ))}
        </ul>
      </Section>
      <Section title="使い方">
        <div class="rx-stack" data-space="small">
          {doc.usage.map((paragraph) => (
            <p>{inline(paragraph)}</p>
          ))}
        </div>
      </Section>
      {doc.keyboard && doc.keyboard.length > 0 && (
        <Section title="キーボード">
          <Table caption={`${doc.name}のキーボード操作`}>
            <thead>
              <tr>
                <th scope="col">キー</th>
                <th scope="col">動作</th>
              </tr>
            </thead>
            <tbody>
              {doc.keyboard.map(([key, action]) => (
                <tr>
                  <th scope="row">{inline(key)}</th>
                  <td>{inline(action)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}
      {doc.accessibility && doc.accessibility.length > 0 && (
        <Section title="アクセシビリティ">
          <ul>
            {doc.accessibility.map((item) => (
              <li>{inline(item)}</li>
            ))}
          </ul>
        </Section>
      )}
      {doc.events && doc.events.length > 0 && (
        <Section title="イベント">
          <Table caption={`${doc.name}が発火するイベント`}>
            <thead>
              <tr>
                <th scope="col">イベント</th>
                <th scope="col">内容</th>
              </tr>
            </thead>
            <tbody>
              {doc.events.map(([name, detail]) => (
                <tr>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>{inline(detail)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}
      <Section title="API">
        <div class="rx-stack">
          {doc.api.map((name) => {
            const api = apis.get(name);
            if (!api) throw new Error(`公開されていないコンポーネントです: ${name}`);
            return (
              <LayerCard title={name}>
                <div class="rx-stack" data-space="small">
                  {api.description && <p>{inline(api.description)}</p>}
                  {api.props.length > 0 && (
                    <PropTable
                      doc={doc}
                      component={name}
                      caption={`${name}のprops`}
                      props={api.props}
                    />
                  )}
                  {api.element && <p>{inline(elementNote(api.element))}</p>}
                  {api.controllers.length > 0 && (
                    <p>
                      登録するcontroller：
                      {api.controllers.map((entry, index) => {
                        const [identifier, controller] = entry.split(":");
                        return (
                          <>
                            {index > 0 && "、"}
                            <code>{identifier}</code>（<code>{controller}</code>）
                          </>
                        );
                      })}
                    </p>
                  )}
                  <p>
                    読み込むCSS：
                    {api.stylesheets.map((file, index) => (
                      <>
                        {index > 0 && "、"}
                        <code>{file}</code>
                      </>
                    ))}
                  </p>
                  {api.types.map((type) => (
                    <TypeReference doc={doc} component={name} type={type} />
                  ))}
                </div>
              </LayerCard>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

type Code = Awaited<ReturnType<typeof import("../code-format").formatExample>>;

/** コンポーネントのページ。見本・説明・API・同じ見本のHTMLとHono JSXを並べ、分類の中で前後のコンポーネントへ移動できる。 */
export const ComponentPage = ({
  components,
  entry,
  markup,
  htmlCode,
  jsxCode,
}: {
  components: readonly ComponentEntry[];
  entry: ComponentDoc;
  markup: string;
  htmlCode: Code;
  jsxCode: Code;
}) => {
  const idsOf = (ids: readonly string[]) => ids;
  const groupIndex = componentGroups.findIndex((group) => idsOf(group.ids).includes(entry.id));
  const group = componentGroups[groupIndex];
  const order = componentGroups.flatMap((candidate) => idsOf(candidate.ids));
  const position = order.indexOf(entry.id);
  const neighbor = (offset: number) =>
    components.find((component) => component.id === order[position + offset]);
  const previous = neighbor(-1);
  const next = neighbor(1);
  return (
    <CatalogFrame components={components} current={entry.id}>
      <ContextBar
        items={[
          { label: "カタログ", href: "/" },
          ...(group ? [{ label: group.name, href: `/#${groupAnchor(groupIndex)}` }] : []),
          { label: entry.name },
        ]}
      />
      <PageHeader title={entry.name} description={entry.description} />
      <section class="rx-stack" aria-label="見本">
        <div class="rx-stack" data-example="hono">
          {entry.id === "page-header" ? (
            <iframe
              class="catalog-preview"
              title="PageHeaderの見本"
              src="/components/page-header/preview"
            />
          ) : (
            raw(markup)
          )}
        </div>
      </section>
      <Reference doc={entry} />
      <Section title="コード">
        <DisclosureGroup label="見本のコード">
          <Disclosure
            summary="HTML"
            data-controller="code-example"
            data-action="toggle->code-example#opened"
          >
            <template>
              <CodeBlock label="HTML" {...htmlCode} copy />
            </template>
            <noscript>
              <CodeBlock label="HTML" code={htmlCode.code} />
            </noscript>
          </Disclosure>
          <Disclosure
            summary="Hono JSX"
            data-controller="code-example"
            data-action="toggle->code-example#opened"
          >
            <template>
              <CodeBlock label="Hono JSX" {...jsxCode} copy />
            </template>
            <noscript>
              <CodeBlock label="Hono JSX" code={jsxCode.code} />
            </noscript>
          </Disclosure>
        </DisclosureGroup>
      </Section>
      <nav class="rx-cluster" aria-label="前後のコンポーネント">
        {previous && (
          <ActionLink href={`/components/${previous.id}`} variant="link">
            ← {previous.name}
          </ActionLink>
        )}
        {next && (
          <ActionLink href={`/components/${next.id}`} variant="link">
            {next.name} →
          </ActionLink>
        )}
      </nav>
    </CatalogFrame>
  );
};
