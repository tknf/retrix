import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import {
  ActionTile,
  Calendar,
  Card,
  DataList,
  ErrorSummary,
  FileItem,
  Icon,
  Keycap,
  LayerCard,
  Prompt,
  Reactions,
  Toast,
  ToastStack,
} from "../src/hono";

const makeDay = () => ({
  day: 1,
  date: "2026-09-01",
  events: [{ label: "<script>例</script>", href: "/event?a=1&b=2" }],
});

test("一覧の選択先を伝え主情報・補足・件数0を別の読み順で保つ", async () => {
  const markup = String(
    await html`${(
      <DataList
        items={[
          {
            title: "資料",
            href: "/files",
            current: true,
            start: <Icon name="file" />,
            description: "共有する資料",
            meta: 0,
            end: 0,
          },
        ]}
      />
    )}`,
  );
  expect(markup).toContain('aria-current="true"');
  expect(markup).toContain('class="meta">0</div>');
  expect(markup).toContain('class="end">0</div>');
  expect(markup.indexOf('class="start"')).toBeLessThan(markup.indexOf('class="body"'));
});

test("月カレンダーは不足するセルを補い予定の文字列をエスケープする", async () => {
  const result = await html`${<Calendar label="予定" weeks={[[null, makeDay()]]} />}`;
  const markup = String(result);
  expect(markup.match(/<td/g)).toHaveLength(7);
  expect(markup).toContain("&lt;script&gt;例&lt;/script&gt;");
  expect(markup).toContain('href="/event?a=1&amp;b=2"');
});

test("エラーがないときは空の修正案内やフォーカス先を出さない", async () => {
  expect(String(await html`${<ErrorSummary errors={[]} />}`)).toBe("");
});

test("件数0を補足として保持しファイルの状態を文言でも示す", async () => {
  const card = String(await html`${<Card title="予約" footer={0} />}`);
  expect(card).toContain('class="meta">0</footer>');
  const file = String(
    await html`${<FileItem name="資料.pdf" description="接続を確認してください。" state="error" />}`,
  );
  expect(file).toContain("送信失敗");
  expect(file).toContain("接続を確認してください。");
});

test("共有Iconへ局所の役割名を付けても装飾としての属性を保つ", async () => {
  const icon = String(await html`${<Icon name="file" class="icon" />}`);
  expect(icon).toContain('class="rx-icon icon"');
  expect(icon).toContain('aria-hidden="true"');
  expect(icon).toContain('focusable="false"');
});

test("LayerCardは見出しを層に置き中身をカードに入れ操作がない時は空の領域を出さない", async () => {
  const markup = String(await html`${<LayerCard title="今週の予約">予約はありません</LayerCard>}`);
  expect(markup).toContain('<header class="heading"><h3 class="title">今週の予約</h3></header>');
  expect(markup).toContain('<div class="body">予約はありません</div>');
  expect(markup).not.toContain('class="actions"');
  const withActions = String(
    await html`${<LayerCard title="今週の予約" actions={<a href="/all">すべて見る</a>} />}`,
  );
  expect(withActions).toContain('<div class="actions"><a href="/all">すべて見る</a></div>');
});

test("ActionTileはhrefでリンク、無ければボタンになり、使えない状態と追加のclassを保つ", async () => {
  const link = String(
    await html`${<ActionTile href="/mail" label="通知" icon="mail" accent="coral" current />}`,
  );
  expect(link).toMatch(
    /^<a class="rx-action-tile" data-accent="coral" href="\/mail" aria-current="page">/,
  );
  expect(link).toContain('<span class="name">通知</span>');
  const disabledLink = String(
    await html`${<ActionTile href="/report" label="報告" icon="chart" disabled />}`,
  );
  expect(disabledLink).toMatch(
    /^<span class="rx-action-tile" data-disabled="true" role="link" aria-disabled="true">/,
  );
  const button = String(
    await html`${<ActionTile label="削除する" icon="trash" class="extra" disabled data-action="table#remove" />}`,
  );
  expect(button).toMatch(/^<button type="button"/);
  expect(button).toContain('class="rx-action-tile extra"');
  expect(button).toContain('data-action="table#remove"');
  expect(button).toContain("disabled");
});

test("ToastStackは既定で末尾側の下に置き、スタックのcontrollerを付けてToastを並べる", async () => {
  const markup = String(
    await html`${(
      <ToastStack>
        <Toast id="saved">保存しました</Toast>
      </ToastStack>
    )}`,
  );
  expect(markup).toContain('data-controller="toast-stack"');
  expect(markup).toContain('data-placement="end"');
  expect(markup).toContain('id="saved"');
  const center = String(await html`${<ToastStack placement="center" />}`);
  expect(center).toContain('data-placement="center"');
});

const makeReaction = (content: string, by: string[], mine = false) => ({
  content,
  name: content === "👍" ? "いいね" : undefined,
  by,
  mine,
});

test("Reactionsは付けた人数を数にし、自分のリアクションを押せる状態で示し、誰もいないリアクションは出さない", async () => {
  const markup = String(
    await html`${(
      <Reactions
        label="反応"
        items={[
          makeReaction("👍", ["田中 遥", "自分"], true),
          makeReaction("🎉", ["佐藤 健"]),
          makeReaction("誰もいないリアクション", []),
        ]}
        add={{ id: "r" }}
      />
    )}`,
  );
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('aria-label="いいね：田中 遥、自分"');
  expect(markup).toContain('<span class="count" aria-hidden="true">2</span>');
  expect(markup).not.toContain("誰もいないリアクション");
  expect(markup).toContain('aria-label="リアクションを追加"');
  expect(markup).toContain('data-controller="emoji-picker"');
});

test("Reactionsはaddが無ければ押せないリアクションにし、読み上げに付けた人を残す", async () => {
  const markup = String(
    await html`${<Reactions label="反応" items={[makeReaction("👍", ["田中 遥"])]} />}`,
  );
  expect(markup).not.toContain("<button");
  expect(markup).toContain("いいね：田中 遥");
});

test("Keycapは小さい形と塗った面の上の形をdata属性で示す", async () => {
  const markup = String(await html`${<Keycap keys={["⌘", "K"]} size="small" inverse />}`);
  expect(markup).toContain('data-size="small"');
  expect(markup).toContain('data-inverse="true"');
  expect(markup).toContain("<kbd>⌘</kbd><kbd>K</kbd>");
  expect(String(await html`${<Keycap keys={["Esc"]} />}`)).not.toContain("data-size");
});

test("PromptはLayerCardの層に問いを置き、ボタンの選択肢はnameとvalueを送る", async () => {
  const markup = String(
    await html`${(
      <Prompt
        question="どれに近いですか？"
        name="kind"
        choices={[{ value: "person", title: "人から", description: "大事なもの" }]}
      />
    )}`,
  );
  expect(markup).toContain('class="rx-layer-card rx-prompt"');
  expect(markup).toContain('<h3 class="title">どれに近いですか？</h3>');
  expect(markup).toContain('name="kind" value="person"');
  expect(markup).toContain('data-pointer="true"');
});
