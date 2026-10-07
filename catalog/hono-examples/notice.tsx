import { Notice, ActionLink, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack" data-space="small">
    <Notice label="変更は保存後に反映されます">
      <p>入力を終えたら、このページの「設定を保存」を押してください。</p>
    </Notice>
    <Notice label="招待を送りました" tone="success">
      <p>相手が参加すると、メンバーの一覧に表示されます。</p>
    </Notice>
    <Notice label="公開期限は明日です" tone="warning">
      <p>9月16日を過ぎると、共有リンクから記事を閲覧できなくなります。</p>
      <ActionLink href="/apps/docs">公開設定を確認する</ActionLink>
    </Notice>
    <Notice label="添付ファイルを送信できませんでした" tone="danger">
      <p>入力した内容は残っています。接続を確認してから、もう一度送信してください。</p>
    </Notice>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="入れ子の通知">
        <Notice label="外側の注意" tone="warning">
          <p>一部のファイルに確認が必要です。</p>
          <Notice label="内側の完了" tone="success">
            <p>本文の確認は完了しました。</p>
          </Notice>
        </Notice>
      </Disclosure>
      <Disclosure summary="題名だけ・見出しとして置く">
        <div class="rx-stack" data-space="small">
          <Notice label="この記事は公開済みです" tone="success" />
          <Notice label="メンテナンスのお知らせ" heading>
            <p>9月30日 2:00〜4:00は、予約の受付を停止します。</p>
          </Notice>
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <Notice
            label="https://example.com/articles/autumn-reading-club-2026 は公開できません"
            tone="danger"
          >
            <p>見出し画像の代替テキストを入力してから、もう一度公開してください。</p>
            <ActionLink href="/apps/docs">記事を編集する</ActionLink>
          </Notice>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Notice label="تنتهي مدة النشر غدًا" tone="warning">
            <p>بعد ١٦ سبتمبر لن يمكن عرض المقال من رابط المشاركة.</p>
          </Notice>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
