import { Steps, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <Steps
      label="申し込みの手順"
      items={[
        { label: "日時", state: "complete", href: "/apps/schedule" },
        { label: "連絡先", state: "current" },
        { label: "確認", state: "upcoming" },
      ]}
    />
    <DisclosureGroup label="段階の数と置き場所の違い">
      <Disclosure summary="段階が多い・名前が長い">
        <Steps
          label="公開までの手順"
          items={[
            { label: "記事の下書き", state: "complete", href: "/apps/docs" },
            { label: "画像と代替テキスト", state: "complete", href: "/apps/docs" },
            { label: "公開範囲と共有リンクの確認", state: "current" },
            { label: "担当者の承認", state: "upcoming" },
            { label: "公開", state: "upcoming" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="すべて終わった">
        <Steps
          label="終わった手順"
          items={[
            { label: "日時", state: "complete", href: "/apps/schedule" },
            { label: "連絡先", state: "complete", href: "/apps/schedule" },
            { label: "確認", state: "complete", href: "/apps/schedule" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で縦に積む">
        <div style="max-inline-size: 14rem">
          <Steps
            label="狭い場所の手順"
            items={[
              { label: "日時", state: "complete", href: "/apps/schedule" },
              { label: "連絡先", state: "current" },
              { label: "確認", state: "upcoming" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Steps
            label="خطوات الحجز"
            items={[
              { label: "الموعد", state: "complete", href: "/apps/schedule" },
              { label: "بيانات الاتصال", state: "current" },
              { label: "التأكيد", state: "upcoming" },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
