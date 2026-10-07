import { Card, Badge, Button, ActionLink, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-split">
      <Card
        title="仕事場の案内を更新する"
        href="/apps/docs"
        footer={<span>田中 遥 · 9月15日</span>}
      >
        <p>利用時間とキャンセル条件を見直します。</p>
        <Badge tone="info">確認待ち</Badge>
      </Card>
      <Card
        title="秋の読書会"
        href="/apps/schedule"
        eyebrow={<span>イベント</span>}
        footer={<span>9月25日 18:00 · あと4席</span>}
      >
        <p>最近読んだ本を一冊持ち寄って、小さな感想を交換する会です。</p>
        <Badge tone="success">受付中</Badge>
      </Card>
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="複数段落・内側の操作・長い見出し">
        <Card
          title="初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内"
          href="/apps/docs"
          footer={
            <div class="rx-cluster">
              <ActionLink href="/apps/docs">編集する</ActionLink>
              <Button disabled>公開する</Button>
            </div>
          }
        >
          <p>予約内容を確認してから、受付へお越しください。</p>
          <p>公開前に担当者の確認が必要です。内側の操作は見出しリンクと独立しています。</p>
        </Card>
      </Disclosure>
      <Disclosure summary="題名だけ・詰めた密度">
        <div class="rx-split">
          <Card title="会議室の鍵を返却する" />
          <Card
            title="備品の貸し出し記録を確認する"
            data-density="compact"
            footer={
              <>
                <span>森 美咲</span>
                <span>9月12日</span>
              </>
            }
          />
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <Card
            title="https://example.com/articles/autumn-reading-club-2026 の公開前確認"
            eyebrow={<span>読書会・お知らせ</span>}
            footer={
              <>
                <span>佐藤 健</span>
                <span>9月14日</span>
              </>
            }
          >
            <p>公開前に担当者と管理者の確認が必要です。</p>
          </Card>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Card
            title="نادي القراءة في الخريف"
            href="/apps/schedule"
            eyebrow={<span>فعالية</span>}
            footer={<span>٢٥ سبتمبر · ٤ مقاعد متبقية</span>}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </Card>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
