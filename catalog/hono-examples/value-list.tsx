import { ValueList, Badge, ActionLink, Icon, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <ValueList
      items={[
        {
          label: "公開状態",
          value: <Badge tone="success">公開中</Badge>,
          icon: <Icon name="eye" fill />,
          accent: "green",
        },
        {
          label: "公開日時",
          value: <time datetime="2026-09-15T10:00:00+09:00">2026年9月15日 10:00</time>,
          icon: <Icon name="calendar" fill />,
        },
        {
          label: "予約件数",
          value: 0,
          description: "今月の受付分です。",
          icon: <Icon name="chart" fill />,
          accent: "amber",
        },
        { label: "担当者", value: null, icon: <Icon name="info" fill />, accent: "coral" },
        {
          label: "利用規約とキャンセル条件",
          value: (
            <>
              <p>前日までのキャンセルは無料です。当日の変更は受付にご相談ください。</p>
              <ActionLink href="/apps/schedule">予約内容を確認する</ActionLink>
            </>
          ),
          icon: <Icon name="file" fill />,
        },
        {
          label: "管理番号",
          value: "workspace-autumn-2026-abcdefghijklmnopqrstuvwxyz0123456789",
          icon: <Icon name="grid" fill />,
        },
      ]}
    />
    <DisclosureGroup label="アイコンの有無と置き場所の違い">
      <Disclosure summary="アイコンなし">
        <ValueList
          items={[
            { label: "部屋", value: "中会議室" },
            { label: "人数", value: "8名" },
            { label: "担当者", value: null },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ValueList
            items={[
              {
                label: "共有リンク",
                value: "https://example.com/articles/autumn-reading-club-2026",
                icon: <Icon name="mail" fill />,
              },
              { label: "人数", value: "8名", icon: <Icon name="chat" fill />, accent: "green" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ValueList
            items={[
              { label: "الغرفة", value: "قاعة الاجتماعات", icon: <Icon name="grid" fill /> },
              {
                label: "التاريخ",
                value: "١٥ سبتمبر",
                icon: <Icon name="calendar" fill />,
                accent: "amber",
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
