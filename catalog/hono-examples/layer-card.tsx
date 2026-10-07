import {
  LayerCard,
  Card,
  ValueList,
  DataList,
  Badge,
  ActionLink,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-split">
      <LayerCard
        title="今週の予約"
        actions={<ActionLink href="/apps/schedule">すべて見る</ActionLink>}
      >
        <DataList
          aria-label="今週の予約"
          items={[
            {
              title: "秋の読書会",
              href: "/apps/schedule",
              meta: "9月25日 18:00 · 8名",
              end: <Badge tone="success">確定</Badge>,
            },
            {
              title: "仕事場の見学",
              href: "/apps/schedule",
              meta: "9月26日 10:00 · 2名",
              end: <Badge tone="info">確認待ち</Badge>,
            },
          ]}
        />
      </LayerCard>
      <LayerCard title="予約の内容">
        <ValueList
          items={[
            { label: "部屋", value: "中会議室" },
            {
              label: "日時",
              value: <time datetime="2026-09-25T18:00:00+09:00">9月25日 18:00〜20:00</time>,
            },
            { label: "人数", value: "8名" },
          ]}
        />
      </LayerCard>
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="Cardと並べる">
        <div class="rx-split">
          <Card title="次にすること">
            <p>見出しをカードの中に書くと、題名と中身が同じ面に並び、区別しにくくなります。</p>
          </Card>
          <LayerCard title="次にすること">
            <p>見出しを層に置くと、カードの中は中身だけになります。</p>
          </LayerCard>
        </div>
      </Disclosure>
      <Disclosure summary="本文の段落・長い見出し">
        <LayerCard title="初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内">
          <p>予約内容を確認してから、受付へお越しください。</p>
          <p>公開前に担当者の確認が必要です。</p>
        </LayerCard>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <LayerCard
            title="https://example.com/articles/autumn-reading-club-2026 の公開前確認"
            actions={<ActionLink href="/apps/docs">開く</ActionLink>}
          >
            <p>公開前に担当者と管理者の確認が必要です。</p>
          </LayerCard>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <LayerCard
            title="نادي القراءة في الخريف"
            actions={<ActionLink href="/apps/schedule">عرض الكل</ActionLink>}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </LayerCard>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
