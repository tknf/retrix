import { Disclosure, DisclosureGroup, Button, Field, Input } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <DisclosureGroup label="公開と提出資料">
      <Disclosure summary="公開範囲について" description="リンクを共有する前に確認してください。">
        <p>この案件に参加しているメンバーが閲覧できます。</p>
        <a href="/apps/settings">共有設定を開く</a>
      </Disclosure>
      <Disclosure summary="提出する資料について" open>
        <p>提出する資料はPDFで用意してください。提出後も期限内なら差し替えできます。</p>
      </Disclosure>
    </DisclosureGroup>
    <section class="rx-stack" data-space="small" aria-label="複数の項目を開く">
      <h3>複数の項目を開く</h3>
      <DisclosureGroup label="提出について">
        <Disclosure summary="提出できるファイル">
          <p>PDF・PNG・JPEGを添付できます。</p>
        </Disclosure>
        <Disclosure summary="提出後の変更">
          <p>受付期間中は何度でも差し替えできます。</p>
        </Disclosure>
      </DisclosureGroup>
    </section>
    <section class="rx-stack" data-space="small" aria-label="一つずつ開く">
      <h3>一つずつ開く</h3>
      <DisclosureGroup label="受付について">
        <Disclosure name="disclosure-faq" summary="受付期間" open>
          <p>9月1日から9月30日までです。</p>
        </Disclosure>
        <Disclosure name="disclosure-faq" summary="結果の確認">
          <p>案件の一覧から確認できます。</p>
        </Disclosure>
        <Disclosure name="disclosure-faq" summary="問い合わせ先">
          <a href="/apps/people">担当者に問い合わせる</a>
        </Disclosure>
      </DisclosureGroup>
    </section>
    <Disclosure summary="入れ子の条件">
      <p>契約内容によって必要な書類が異なります。</p>
      <Disclosure summary="法人の場合">
        <p>担当者名と法人名を記載してください。</p>
        <Disclosure summary="代理で提出する場合">
          <p>委任状も添付してください。</p>
        </Disclosure>
      </Disclosure>
      <Disclosure summary="個人の場合">
        <p>本人確認書類を添付してください。</p>
      </Disclosure>
    </Disclosure>
    <Disclosure summary="通知先を変更する" description="開閉しても入力中の内容は保持されます。">
      <form action="/apps/settings" method="get" class="rx-stack">
        <Field id="disclosure-email" label="メールアドレス">
          {(attributes) => <Input {...attributes} name="email" type="email" required />}
        </Field>
        <div class="rx-cluster">
          <Button type="submit">変更する</Button>
        </div>
      </form>
    </Disclosure>
    <Disclosure
      summary="提出前に確認してほしい、対象となる案件の条件と追加資料が必要になる場合についての詳しい説明"
      description="申請内容により追加資料をお願いする場合があります。"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <p key={index}>
          資料{index + 1}
          ：内容と提出先を確認してください。提出期限を過ぎた場合は担当者にご連絡ください。
        </p>
      ))}
      <p>
        https://example.com/projects/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
      </p>
    </Disclosure>
    <Disclosure summary="تفاصيل المشاركة" dir="rtl">
      <p>يمكن لأعضاء المشروع مشاهدة الملفات.</p>
    </Disclosure>
  </div>
);
