import { Badge, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack" data-space="small">
    <div class="rx-cluster">
      <Badge draft>下書き</Badge>
      <Badge>保留</Badge>
      <Badge tone="info">確認待ち</Badge>
      <Badge tone="success">公開中</Badge>
      <Badge tone="warning">期限が近づいています</Badge>
      <Badge tone="danger">送信失敗</Badge>
    </div>
    <p>
      今月の予約 <Badge>0件</Badge>
    </p>
    <Badge tone="info">担当者と管理者による公開前の最終確認を待っています</Badge>
    <DisclosureGroup label="役割と状態の組み合わせ">
      <Disclosure summary="役割ごと" open>
        <div class="rx-cluster">
          <Badge>保留</Badge>
          <Badge tone="info">確認待ち</Badge>
          <Badge tone="success">公開中</Badge>
          <Badge tone="warning">残りわずか</Badge>
          <Badge tone="danger">送信失敗</Badge>
        </div>
      </Disclosure>
      <Disclosure summary="下書き：役割の色を持たせない">
        <div class="rx-cluster">
          <Badge draft>下書き</Badge>
          <Badge tone="info" draft>
            予約の仮押さえ
          </Badge>
          <Badge tone="success" draft>
            公開予定
          </Badge>
          <Badge tone="warning" draft>
            要確認の下書き
          </Badge>
          <Badge tone="danger" draft>
            取り下げ予定
          </Badge>
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" data-space="small" style="max-inline-size: 12rem">
          <Badge tone="warning">期限が近づいています。今週中に提出してください</Badge>
          <Badge draft>公開前に担当者の確認を待つ下書き</Badge>
          <Badge tone="success">担当者と管理者が承認済み</Badge>
          <Badge>https://example.com/articles/autumn-reading-club-2026</Badge>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-cluster" dir="rtl" lang="ar">
          <Badge draft>مسودة</Badge>
          <Badge>معلق</Badge>
          <Badge tone="info">قيد المراجعة</Badge>
          <Badge tone="success">تمت الموافقة</Badge>
          <Badge tone="danger">فشل الإرسال</Badge>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
