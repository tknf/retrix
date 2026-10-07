import { Timeline, ActionLink, Avatar } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>変更履歴</h3>
      <Timeline
        label="記事の変更履歴"
        items={[
          {
            datetime: "2026-09-15T11:30:00+09:00",
            time: "11:30",
            day: "今日",
            actor: "森 美咲",
            title: "公開の日を9月28日に決めました",
            avatar: <Avatar name="森 美咲" initials="美" tone="coral" />,
          },
          {
            datetime: "2026-09-15T10:00:00+09:00",
            time: "10:00",
            actor: "田中 遥",
            title: "案内文を更新しました",
            avatar: <Avatar name="田中 遥" initials="遥" />,
            content: <p>利用時間とキャンセル条件を追記しました。</p>,
          },
          {
            datetime: "2026-09-14T15:30:00+09:00",
            time: "15:30",
            day: "9月14日（月）",
            actor: "佐藤 誠",
            title: "添付資料を確認しました",
            avatar: <Avatar name="佐藤 誠" initials="誠" tone="green" />,
            content: <ActionLink href="/apps/files">資料を開く</ActionLink>,
          },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>公開までの節目</h3>
      <Timeline
        label="公開までの節目"
        variant="milestones"
        items={[
          { datetime: "2026-09-12", time: "9月12日", title: "原稿を作成", state: "complete" },
          { datetime: "2026-09-24", time: "今日", title: "内容を確認", state: "current" },
          { datetime: "2026-09-28", time: "9月28日", title: "公開する", state: "upcoming" },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>システムの出来事と何もなかった期間</h3>
      <Timeline
        label="カードの履歴"
        items={[
          {
            datetime: "2026-09-29T09:00:00+09:00",
            time: "9月29日 9:00",
            actor: "田中 遥",
            title: "説明を書き直しました",
            avatar: <Avatar name="田中 遥" initials="遥" />,
          },
          {
            datetime: "2026-07-12",
            time: "7月12日〜9月28日",
            title: "78日間、出来事はありません",
            kind: "gap",
          },
          {
            datetime: "2026-07-11T12:13:00+09:00",
            time: "7月11日 12:13",
            actor: "佐藤 健",
            title: "が「完了」へ移しました",
            kind: "system",
          },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>短い変更履歴</h3>
      <Timeline
        label="短い変更履歴"
        variant="compact"
        items={[
          {
            datetime: "2026-09-24T10:00:00+09:00",
            time: "9月24日 10:00",
            title: "本文を更新",
          },
          {
            datetime: "2026-09-24T14:00:00+09:00",
            time: "9月24日 14:00",
            title: "添付資料を差し替え",
          },
        ]}
      />
    </section>
  </div>
);
