import {
  Surface,
  ContextBar,
  PageHeader,
  ActionLink,
  Section,
  DataList,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

const items = [
  {
    title: "秋の読書会",
    description: "最近読んだ本を一冊持ち寄って、小さな感想を交換する会です。",
    meta: "田中 遥 · 9月25日",
  },
  {
    title: "仕事場の案内",
    description: "利用時間とキャンセル条件を見直します。",
    meta: "佐藤 健 · 9月24日",
  },
];

export default () => (
  <div class="rx-stack" data-space="small">
    <Surface
      context={
        <ContextBar items={[{ label: "仕事場", href: "/apps/docs" }, { label: "記事" }]}>
          <ActionLink href="/apps/docs" size="compact">
            記事を書く
          </ActionLink>
        </ContextBar>
      }
    >
      <PageHeader title="記事" description="仕事場のお知らせと、日々の記録をまとめます。" />
      <Section title="最近の記事" count={items.length}>
        <DataList items={items} />
      </Section>
    </Surface>
    <p class="catalog-footnote">
      内容が短い時も、作業面の高さは画面の高さまで伸びます。長い本文はページをスクロールして読みます。
    </p>
    <DisclosureGroup label="作業面の使い方">
      <Disclosure summary="文書：本文を読みやすい行長に収める">
        <Surface
          layout="document"
          context={
            <ContextBar items={[{ label: "記事", href: "/apps/docs" }, { label: "秋の読書会" }]} />
          }
        >
          <PageHeader title="秋の読書会" description="9月25日 18:00から、2階の小部屋で開きます。" />
          <p>
            最近読んだ本を一冊持ち寄って、小さな感想を交換する会です。途中からの参加や、読みかけの本でもかまいません。広い画面でも本文は読みやすい行長に収まり、左右の余白が広がります。
          </p>
        </Surface>
      </Disclosure>
      <Disclosure summary="パンくずなし">
        <Surface>
          <PageHeader title="はじめに" />
          <p>パンくずを持たない画面では、見出しから作業面が始まります。</p>
        </Surface>
      </Disclosure>
      <Disclosure summary="狭い場所：左右の余白を詰める">
        <div style="max-inline-size: 22rem">
          <Surface context={<ContextBar items={[{ label: "仕事場" }, { label: "記事" }]} />}>
            <PageHeader title="とても長い名前の記事の一覧と、その下書きをまとめた場所" />
            <DataList items={items} />
          </Surface>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Surface
            context={<ContextBar items={[{ label: "مساحة العمل" }, { label: "المقالات" }]} />}
          >
            <PageHeader title="المقالات" description="أخبار مساحة العمل والسجلات اليومية." />
            <p>تبدأ الصفحة من اليمين، وتبقى المسافات متساوية على الجانبين.</p>
          </Surface>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
