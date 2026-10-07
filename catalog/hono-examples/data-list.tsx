import { DataList, Avatar, Badge, Button, Icon, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <DataList
      aria-label="担当者の一覧"
      items={[
        {
          title: "森 美咲",
          href: "/apps/docs",
          start: <Avatar name="森 美咲" initials="美" tone="green" />,
          description: "mori@example.com",
          end: <Badge tone="info">編集</Badge>,
          current: true,
        },
        {
          title: "佐藤 健",
          href: "/apps/docs",
          start: <Avatar name="佐藤 健" initials="健" />,
          description: "sato@example.com",
        },
        {
          title: "株式会社とても長い名前の制作会社・海外事業部の山田さん",
          href: "/apps/docs",
          start: <Avatar name="山田" initials="山" tone="coral" />,
          description: "yamada-overseas-department@example-production-company.co.jp",
          end: "9月12日",
        },
      ]}
    />
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="記事の一覧（状態と操作）">
        <DataList
          aria-label="記事の一覧"
          items={[
            {
              title: "暮らしの記録",
              href: "/apps/docs",
              description: "季節の移り変わりを、写真と文章で記録しています。",
              meta: "田中 遥 · 9月15日更新",
              end: <Badge tone="success">公開中</Badge>,
            },
            {
              title: "初めての予約から当日の受付まで、仕事場を利用する方への詳しいご案内",
              href: "/apps/docs",
              description: "利用方法と料金、キャンセルの条件をまとめています。",
              end: (
                <>
                  <Badge tone="info">確認待ち</Badge>
                  <Button disabled>公開する</Button>
                </>
              ),
            },
            {
              title: "今月の問い合わせ",
              description: "回答を待っている問い合わせの件数です。",
              end: 0,
            },
            { title: "まだ公開されていない記事", description: "内容を準備しています。" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="アイコン付きの一覧">
        <DataList
          aria-label="資料の一覧"
          items={[
            {
              title: "利用規約",
              href: "/apps/docs",
              start: <Icon name="file" fill />,
              description: "PDF · 2.4 MB",
            },
            {
              title: "予約の受付",
              href: "/apps/docs",
              start: <Icon name="calendar" fill />,
              description: "毎日 9:00〜18:00",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 18rem">
          <DataList
            aria-label="狭い場所の一覧"
            items={[
              {
                title: "初めての予約から当日の受付までのご案内",
                href: "/apps/docs",
                start: <Avatar name="田中 遥" initials="田" tone="amber" />,
                description: "https://example.com/articles/autumn-reading-club-2026",
                end: <Badge tone="warning">期限間近</Badge>,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <DataList
            aria-label="قائمة"
            items={[
              {
                title: "ليلى",
                href: "/apps/docs",
                start: <Avatar name="ليلى" initials="ل" tone="coral" />,
                description: "layla@example.com",
                end: <Badge tone="info">محرر</Badge>,
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
