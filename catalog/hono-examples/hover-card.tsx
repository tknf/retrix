import { ActionLink, HoverCard } from "../../src/hono";

export default () => (
  <div class="rx-cluster">
    <HoverCard
      id="hover-card-summary"
      label="公開準備"
      description="案件の進行と担当者"
      actions={<ActionLink href="/apps/project">案件を開く</ActionLink>}
    >
      <p>担当者：田中 遥</p>
    </HoverCard>
    <HoverCard id="hover-card-link" label="資料一覧" href="/apps/files" size="compact">
      <p>追加された資料と更新日を確認できます。</p>
    </HoverCard>
  </div>
);
