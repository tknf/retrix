import { Wing, wingCookieName, ActionLink, Card, Surface, Timeline } from "../../src/hono";

const actions = (
  <>
    <ActionLink href="/apps/project">新しいプロジェクト</ActionLink>
    <ActionLink href="/apps/people">メンバーを招待</ActionLink>
    <ActionLink href="/apps/settings" variant="link">
      アカウントの管理
    </ActionLink>
  </>
);

const activity = (
  <Timeline
    label="最近の動き"
    variant="compact"
    items={[
      {
        datetime: "2026-09-25T10:00:00+09:00",
        time: "9月25日 10:00",
        title: "田中さんが資料を移動",
      },
      {
        datetime: "2026-09-24T15:30:00+09:00",
        time: "9月24日 15:30",
        title: "佐藤さんが予定を追加",
      },
    ]}
  />
);

const sheet = (
  <Surface>
    <div class="rx-stack">
      <Card title="秋の読書会" href="/apps/schedule" footer={<span>3人 · 9月25日更新</span>}>
        <p>最近読んだ本を持ち寄る会の準備です。</p>
      </Card>
      <Card title="仕事場の案内" href="/apps/docs" footer={<span>2人 · 9月24日更新</span>}>
        <p>利用時間とキャンセル条件を見直します。</p>
      </Card>
    </div>
  </Surface>
);

/** cookiesはサーバーが受け取ったcookie。HonoではgetCookie(c)を渡す。 */
export default ({ cookies }: { cookies: Record<string, string> }) => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>開閉を保存する</h3>
      <Wing
        storageKey="catalog-wing"
        savedState={cookies[wingCookieName("catalog-wing")]}
        start={{ label: "はじめる", icon: "pencil", content: actions }}
        end={{ label: "最近の動き", icon: "layers", content: activity, open: false }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small" lang="en">
      <h3>英語の見出し</h3>
      <Wing
        start={{ label: "Get started", icon: "pencil", content: <p>Create a project.</p> }}
        end={{
          label: "Recent activity",
          icon: "layers",
          content: <p>Nothing new today.</p>,
          open: false,
        }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>長い見出しとアイコンなし</h3>
      <Wing
        start={{ label: "プロジェクトとメンバーの管理", content: actions, open: false }}
        end={{ label: "Notifications and recent activity", content: activity, open: false }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>片側だけ</h3>
      <Wing end={{ label: "最近の動き", icon: "layers", content: activity }}>{sheet}</Wing>
    </section>
    <section class="rx-stack" data-space="small" dir="rtl" lang="ar">
      <h3>右から左へ書く言語</h3>
      <Wing
        start={{ label: "ابدأ", icon: "pencil", content: <p>أنشئ مشروعًا.</p> }}
        end={{ label: "النشاط الأخير", icon: "layers", content: <p>لا جديد اليوم.</p> }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>狭い幅</h3>
      <div style="max-inline-size: 24rem">
        <Wing
          start={{ label: "はじめる", icon: "pencil", content: actions }}
          end={{ label: "最近の動き", icon: "layers", content: activity, open: false }}
        >
          {sheet}
        </Wing>
      </div>
    </section>
  </div>
);
