import { expect, test } from "vite-plus/test";
import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import {
  Field,
  Button,
  ActionLink,
  Suggestion,
  DatePicker,
  FileInput,
  Navigation,
  FilterBar,
  type NavigationItem,
} from "../src/hono/index";
import { app, paths } from "../catalog/app";
import { Input, ValueList, Dialog, ContextBar, DataList, Tabs, Progress } from "../src/hono";

const render = async (child: Child) => {
  const server = new Hono().get("/", (c) => c.html(html`${child}`));
  return (await server.request("http://localhost/")).text();
};

type LinkTarget =
  | { kind: "fragment" }
  | { kind: "external" }
  | { kind: "asset" }
  | { kind: "route"; pathname: string };

const classifyLinkTarget = (value: string, pagePath: string): LinkTarget => {
  const destination = value.replaceAll("&amp;", "&").trim();
  if (destination.startsWith("#")) return { kind: "fragment" };

  const url = new URL(destination, `https://retrix.invalid${pagePath}`);
  if (url.origin !== "https://retrix.invalid") return { kind: "external" };
  if (
    /^\/(?:assets|src\/css|catalog)\//.test(url.pathname) ||
    /\.(?:css|ico|js|png|svg|webp|woff2?)$/i.test(url.pathname)
  ) {
    return { kind: "asset" };
  }

  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return { kind: "route", pathname };
};

const navigationItems = () =>
  [
    { label: "すべて", href: "/items", current: true, count: 0 },
    { label: "公開中", href: "/items?state=published&sort=date", count: 3 },
    { label: "下書き", href: "/items?state=draft" },
  ] satisfies NavigationItem[];

for (const [name, Component] of [
  ["Navigation", Navigation],
  ["FilterBar", FilterBar],
] as const) {
  test(`${name}は現在地と0件を保ちURLをエスケープする`, async () => {
    const result = await render(<Component label="記事の状態" items={navigationItems()} />);
    expect(result).toContain('aria-label="記事の状態"');
    expect(result.match(/aria-current="page"/g)).toHaveLength(1);
    expect(result.match(/data-current="true"/g)).toHaveLength(1);
    expect(result).toContain("<span>すべて</span><small>0</small>");
    expect(result).toContain('href="/items?state=published&amp;sort=date"');
    expect(result).toContain("<span>下書き</span></a>");
    expect(result).not.toContain("data-controller");
  });
}

test("FilterBarは既存のchildrenと標準属性を保つ", async () => {
  const result = await render(
    <FilterBar label="表示する月" id="months" class="custom-filter" dir="rtl">
      <a href="/month/9" aria-current="page" data-current="true">
        9月
      </a>
    </FilterBar>,
  );
  expect(result).toContain('id="months"');
  expect(result).toContain('class="rx-filter-bar custom-filter"');
  expect(result).toContain('dir="rtl"');
  expect(result).toContain('href="/month/9" aria-current="page" data-current="true">9月</a>');
});

test("FilterBarの各項目は共通のActionLinkを使う", async () => {
  const items = navigationItems();
  const result = await render(<FilterBar label="記事の状態" items={items} />);
  for (const item of items) {
    const link = await render(
      <ActionLink
        href={item.href}
        aria-current={item.current ? "page" : undefined}
        data-current={item.current ? "true" : undefined}
      >
        <span>{item.label}</span>
        {item.count !== undefined && <small>{item.count}</small>}
      </ActionLink>,
    );
    expect(result).toContain(link);
  }
});

test("予定の画面はURLの月のカレンダーと、その月の表示形式を現在地として返す", async () => {
  for (const [path, month] of [
    ["/apps/schedule?month=8", 8],
    ["/apps/schedule", 9],
  ] as const) {
    const response = await app.request(`http://localhost${path}`);
    expect(response.status).toBe(200);
    const result = await response.text();
    expect(result).toContain(`<h2>2026年${month}月</h2>`);
    expect(result).toContain(`aria-label="2026年${month}月の日付グリッド"`);
    expect(result).toMatch(
      new RegExp(
        `href="/apps/schedule\\?year=2026&amp;month=${month}&amp;view=month&amp;week=\\d+" aria-current="page"`,
      ),
    );
  }
});

test("フィールドは存在する説明とエラーだけを参照する", async () => {
  const result = (
    <Field id="title" label="記事名" help="補足" error="入力してください">
      {(attributes) => <input {...attributes} />}
    </Field>
  );
  const html = await render(result);
  expect(html).toContain('for="title"');
  expect(html).toContain('aria-describedby="title-help title-error"');
  expect(html).toContain('aria-invalid="true"');
  expect(html).toContain('data-invalid="true"');
  const empty = (
    <Field id="title" label="記事名">
      {(attributes) => <input {...attributes} />}
    </Field>
  );
  expect(await render(empty)).not.toContain("aria-describedby");
});

test("処理中は無効化と読み上げ属性と表示を同期する", async () => {
  const result = (
    <Button busy busyLabel="保存中…">
      保存する
    </Button>
  );
  const html = await render(result);
  expect(html).toContain("disabled");
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain("保存中…");
});

test("候補入力はIDを補い空候補と重複を除いて標準入力属性を保つ", async () => {
  const result = await render(
    <>
      <Suggestion
        label="分類"
        options={["", "暮らし", "暮らし"]}
        class="custom-input"
        aria-invalid="true"
      />
      <Suggestion label="対象" options={["仕事場"]} help="補足" error="入力してください" />
    </>,
  );
  const ids = [...result.matchAll(/<input[^>]*\sid="([^"]+)"/g)].map((match) => match[1]);
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) {
    expect(result).toContain(`for="${id}"`);
    expect(result).toContain(`list="${id}-options"`);
  }
  expect(result.match(/<option value="暮らし"/g)).toHaveLength(1);
  expect(result).not.toContain('<option value=""');
  expect(result).toContain('class="rx-input custom-input"');
  expect(result.match(/aria-invalid="true"/g)).toHaveLength(2);
});

test("DatePickerは表示欄と明示された送信名を分ける", async () => {
  const result = await render(
    <DatePicker
      id="period"
      label="集計期間"
      mode="range"
      startName="report[begins_on]"
      endName="report[finishes_on]"
      form="report-form"
      class="custom-period"
      start="2026-09-01"
      end="2026-09-30"
      required
    />,
  );
  expect(result).toContain('class="rx-date-picker custom-period"');
  expect(result).toContain('name="report[begins_on]"');
  expect(result).toContain('name="report[finishes_on]"');
  expect(result).toContain('data-date-picker-choice-value="range"');
  expect(result).toContain('value="2026/09/01 – 2026/09/30"');
  expect(result).toMatch(/<input[^>]*id="period-input"[^>]*form="report-form"/);
  expect(result).not.toMatch(/<input[^>]*id="period-input"[^>]*name=/);
  expect(result).toContain('popovertarget="period-calendar"');
});

test("FileInputはファイルの送信属性と説明・エラーの関連付けを保つ", async () => {
  const result = await render(
    <FileInput
      id="attachment"
      name="documents[]"
      label="添付資料"
      form="attachment-form"
      accept=".pdf,application/pdf"
      multiple
      required
      class="custom-file"
      aria-describedby="shared-note"
      help="PDFを選択してください。"
      error="ファイルを選び直してください。"
    />,
  );
  expect(result).toContain('for="attachment"');
  expect(result).toContain('name="documents[]"');
  expect(result).toContain('form="attachment-form"');
  expect(result).toContain('accept=".pdf,application/pdf"');
  expect(result).toMatch(/<input[^>]*multiple[^>]*required[^>]*type="file"/);
  expect(result).toContain('class="rx-input custom-file"');
  expect(result).toContain('aria-describedby="shared-note attachment-help attachment-error"');
  expect(result).toContain('aria-invalid="true"');
  expect(result).toContain('data-invalid="true"');
  expect(result).toContain('data-controller="file-input"');
  expect(result).toContain('data-file-input-target="input"');
});

test("FileInputはIDを補いJavaScriptなしの標準入力とdisabledを維持する", async () => {
  const result = await render(
    <>
      <FileInput label="添付資料" />
      <FileInput label="利用できない添付資料" disabled />
    </>,
  );
  const ids = [...result.matchAll(/<input[^>]*\sid="([^"]+)"/g)].map((match) => match[1]);
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) expect(result).toContain(`for="${id}"`);
  expect(result).not.toMatch(/<input[^>]*\shidden/);
  expect(result.match(/<input[^>]*disabled/g)).toHaveLength(1);
  const buttons = [...result.matchAll(/<button\b[^>]*>/g)].map(([button]) => button);
  expect(buttons).toHaveLength(2);
  for (const button of buttons) {
    expect(button).toContain('data-file-input-target="clear"');
    expect(button).toContain("hidden");
  }
  expect(buttons.filter((button) => button.includes("disabled"))).toHaveLength(1);
  expect(result).not.toContain("aria-describedby");
});

test("同日の期間はサーバーが指定した種別を保持する", async () => {
  const result = await render(
    <DatePicker
      id="date"
      label="予定日"
      mode="flexible"
      startName="date[start]"
      endName="date[end]"
      kindName="date[kind]"
      selection={{ kind: "range", start: "2026-09-12", end: "2026-09-12" }}
    />,
  );
  expect(result).toContain('value="2026/09/12 – 2026/09/12"');
  expect(result).toContain('name="date[kind]"');
  expect(result).toContain('<option value="range" selected');
  expect(result).toContain('data-date-picker-mode-value="range"');
});

// 全ページを描き、コンポーネントのページは型の解析も行うので、既定の5秒では足りない。
test("カタログの全経路を生成でき内部routeへ到達できる", async () => {
  const generatedRoutes = new Set(paths);
  const unresolved = new Set<string>();
  for (const path of paths) {
    const response = await app.request(`http://localhost${path}`);
    expect(response.status).toBe(200);
    const document = await response.text();
    expect(document).toContain("<!doctype html>");
    for (const [, target] of document.matchAll(/(?:^|\s)(?:href|action)="([^"]*)"/g)) {
      const classified = classifyLinkTarget(target, path);
      if (classified.kind === "route" && !generatedRoutes.has(classified.pathname)) {
        unresolved.add(`${path} -> ${classified.pathname}`);
      }
    }
  }
  expect([...unresolved]).toEqual([]);
}, 30_000);

test("Toolbarの使用例は標準フォーム操作を持ち表示と掲載コードでIDを重複させない", async () => {
  const response = await app.request("http://localhost/components/toolbar");
  const result = await response.text();
  const ids = [...result.matchAll(/(?<![-\w])id="([^"]+)"/g)].map((match) => match[1]);
  expect(new Set(ids).size).toBe(ids.length);
  expect(result).toContain('action="/apps/search" method="get"');
  for (const prefix of ["hono-toolbar"]) {
    expect(result).toContain(`id="${prefix}-query"`);
    expect(result).toContain(`aria-describedby="${prefix}-help"`);
  }
  expect(result.match(/<button[^>]*type="submit"[^>]*>検索する<\/button>/g)).toHaveLength(1);
  expect(result.match(/<button[^>]*type="reset"[^>]*>初期値に戻す<\/button>/g)).toHaveLength(1);
});

test("標準HTML属性とStimulus属性をコンポーネントへ渡せる", async () => {
  const result = await render(
    <Button type="submit" name="intent" value="save" form="editor" data-action="click->editor#save">
      保存する
    </Button>,
  );
  expect(result).toContain('name="intent"');
  expect(result).toContain('form="editor"');
  expect(result).toContain('data-action="click-&gt;editor#save"');
  const input = await render(<Input id="count" name="count" min={1} required type="number" />);
  expect(input).toContain('name="count"');
  expect(input).toContain("required");
});

test("未登録と数値0を区別し外部文字列をエスケープする", async () => {
  const result = await render(
    <ValueList
      items={[
        { label: "件数", value: 0 },
        { label: "未設定", value: null },
        { label: "入力", value: "<script>alert(1)</script>" },
      ]}
    />,
  );
  expect(result).toContain("<dd>0</dd>");
  expect(result).toContain("未登録");
  expect(result).not.toContain("<script>");
});

test("初期HTMLのダイアログは閉じた状態でIDを関連付ける", async () => {
  const result = await render(
    <Dialog id="review" title="内容を確認" trigger="確認する" description="説明">
      内容
    </Dialog>,
  );
  expect(result).toContain('aria-controls="review"');
  expect(result).toContain('aria-labelledby="review-title"');
  expect(result).toContain('aria-describedby="review-description"');
  expect(result).not.toMatch(/<dialog[^>]*\sopen(?:\s|=|>)/);
});

test("現在位置をリンクにせず最後の項目だけに指定する", async () => {
  const result = await render(
    <ContextBar
      items={[
        { label: "一覧", href: "/items" },
        { label: "編集", href: "/edit" },
      ]}
    />,
  );
  expect(result.match(/aria-current=/g)).toHaveLength(1);
  expect(result).not.toContain('href="/edit"');
});

test("一覧の末尾に渡した0件を保持し条件付きの非表示は省く", async () => {
  expect(await render(<DataList items={[{ title: "件数", end: false }]} />)).not.toContain(
    'class="end"',
  );
  expect(await render(<DataList items={[{ title: "件数", end: 0 }]} />)).toContain(
    '<div class="end">0</div>',
  );
});

test("タブの無効・不明な初期値は最初の有効項目へ戻す", async () => {
  const createItems = () => [
    { value: "disabled", label: "無効", disabled: true, content: "選べません" },
    { value: "first", label: "最初", content: "最初の内容" },
    { value: "last", label: "最後", content: "最後の内容" },
  ];
  for (const selected of ["disabled", "missing", undefined]) {
    const result = await render(
      <Tabs id="fallback" label="表示" selected={selected} items={createItems()} />,
    );
    expect(result).toContain('data-tabs-value-value="first"');
    expect(result.match(/aria-selected="true"/g)).toHaveLength(1);
  }
  const disabled = await render(
    <Tabs
      id="disabled"
      label="表示"
      items={createItems().map((item) => ({ ...item, disabled: true }))}
    />,
  );
  expect(disabled).not.toContain('aria-selected="true"');
});

test("進捗の範囲外値でも表示とnative値を一致させる", async () => {
  expect(await render(<Progress label="超過" value={120} />)).toContain(
    '<progress class="rx-visually-hidden" value="100" max="100">100%</progress>',
  );
  expect(await render(<Progress label="負値" value={-1} />)).toContain(
    '<progress class="rx-visually-hidden" value="0" max="100">0%</progress>',
  );
  expect(await render(<Progress label="不正な上限" value={1} max={0} />)).toContain(
    '<progress class="rx-visually-hidden" value="1" max="1">100%</progress>',
  );
  expect(await render(<Progress label="未確定" value={Number.NaN} />)).toContain(
    '<progress class="rx-visually-hidden" max="100">処理中</progress>',
  );
});

test("DatePickerの上限下限参照を項目名から独立して指定できる", async () => {
  const result = await render(
    <DatePicker
      id="release"
      name="published_on"
      label="公開予定日"
      min="2026-09-01"
      max="2026-12-31"
      minFrom={{ id: "deadline", offsetDays: 1 }}
      maxFrom={{ id: "event-period", bound: "end", offsetDays: -1 }}
    />,
  );
  expect(result).toContain('data-date-picker-min-from-value="deadline"');
  expect(result).toContain('data-date-picker-min-offset-value="1"');
  expect(result).toContain('data-date-picker-max-from-value="event-period"');
  expect(result).toContain('data-date-picker-max-bound-value="end"');
  expect(result).toContain('data-date-picker-max-offset-value="-1"');
  expect(result).toContain('name="published_on"');
  expect(result).not.toContain("minFrom=");
});

test("日付編集欄はカレンダーの上に終了日スイッチは下に置く", async () => {
  const result = await render(
    <DatePicker
      label="予定日"
      mode="flexible"
      startName="start"
      endName="end"
      kindName="kind"
      selection={{ kind: "single", start: "2026-09-14" }}
    />,
  );
  const editors = result.indexOf('class="editors"');
  const calendar = result.indexOf('class="grid"');
  const options = result.indexOf('data-date-picker-target="rangeToggle"');
  expect(editors).toBeLessThan(calendar);
  expect(calendar).toBeLessThan(options);
  expect(result).toContain('role="switch"');
  expect(result).toContain('data-date-picker-target="editorEnd" hidden');
  expect(result).not.toContain(">適用<");
});
