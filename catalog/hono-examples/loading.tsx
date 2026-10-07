import { Loading, Button, Progress, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <Loading label="次の記事を読み込んでいます…" />
    <Loading label="プロジェクトに添付されたすべてのファイルと画像を確認しています。もう少しお待ちください。" />
    <Loading
      layout="region"
      label="資料一覧を準備しています。表示できるまで、この領域でお待ちください。"
    />
    <div class="rx-cluster">
      <Button busy busyLabel="保存しています…">
        保存する
      </Button>
      <span>操作の待ち時間は、その操作のそばに表示します。</span>
    </div>
    <Progress label="添付ファイルの処理量を確認しています" />
    <DisclosureGroup label="動きと置き場所の違い">
      <Disclosure summary="三つの動き（順に跳ねる三つの点・回る丸・広がる輪）" open>
        <div class="rx-stack" data-space="small">
          <Loading variant="wave" label="順に跳ねる三つの点（既定）：返信を読み込んでいます…" />
          <Loading variant="orbit" label="回る丸：次のページを読み込んでいます…" />
          <Loading variant="halo" label="広がる輪：確認しています…" />
        </div>
      </Disclosure>
      <Disclosure summary="この領域で待つ">
        <div class="rx-stack" data-space="small">
          <Loading layout="region" label="コメントを読み込んでいます…" />
          <Loading variant="orbit" layout="region" label="記事の一覧を読み込んでいます…" />
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" data-space="small" style="max-inline-size: 14rem">
          <Loading label="秋の読書会の資料と参加者名簿を読み込んでいます…" />
          <Loading
            variant="halo"
            layout="region"
            label="https://example.com/articles/autumn-reading-club-2026 を確認しています…"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-stack" data-space="small" dir="rtl" lang="ar">
          <Loading variant="orbit" label="جارٍ تحميل الصفحة التالية…" />
          <Loading variant="wave" label="جارٍ كتابة الرد…" />
          <Loading variant="halo" layout="region" label="جارٍ التحقق…" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
