import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { AppShell, Wing, wingCookieName } from "../src/hono";
import { parseWingState, serializeWingState } from "../src/internal/wing-state";

const render = async (node: unknown) => String(await html`${node}`);

test("Wingは作業面・start・endの読み順を保ち、既定で展開する", async () => {
  const markup = await render(
    <Wing
      start={{ label: "はじめる", content: <p>作成</p> }}
      end={{ label: "最近の動き", content: <p>履歴</p>, open: false }}
    >
      <p>作業面</p>
    </Wing>,
  );
  expect(markup.indexOf('class="main"')).toBeLessThan(markup.indexOf('class="start"'));
  expect(markup.indexOf('class="start"')).toBeLessThan(markup.indexOf('class="end"'));
  expect(markup).toMatch(/<details class="start" open/);
  expect(markup).not.toMatch(/<details class="end" open/);
  // 閉じている間はアイコンだけを見せるので、ハンドルに名前のツールチップを付ける。読み上げの名前とは重ねない。
  expect(markup).toContain('<span class="tip rx-overlay" aria-hidden="true">はじめる</span>');
  expect(markup).not.toContain("data-controller");
});

test("storageKeyを指定した時だけ開閉状態の保存先を接続する", async () => {
  const markup = await render(
    <Wing storageKey="home" start={{ label: "はじめる", content: <p>作成</p> }}>
      <p>作業面</p>
    </Wing>,
  );
  expect(markup).toContain('data-controller="wing"');
  expect(markup).toContain('data-wing-storage-key-value="home"');
  expect(markup).toMatch(/<details class="start" open="" data-wing-target="panel"/);
});

test("Wingは指定しない側を描画しない", async () => {
  const markup = await render(
    <Wing end={{ label: "最近の動き", content: <p>履歴</p> }}>
      <p>作業面</p>
    </Wing>,
  );
  expect(markup).not.toContain('class="start"');
  expect(markup).toContain('class="end"');
});

test("AppShellはwingsを渡した時だけ作業面をWingの中央へ置く", async () => {
  const plain = await render(
    <AppShell commands={<a href="/">移動</a>}>
      <p>作業面</p>
    </AppShell>,
  );
  expect(plain).not.toContain("rx-wing");
  const winged = await render(
    <AppShell
      commands={<a href="/">移動</a>}
      wings={{ start: { label: "はじめる", content: <p>作成</p> } }}
    >
      <p>作業面</p>
    </AppShell>,
  );
  expect(winged).toMatch(/class="main"><div class="workspace">/);
});

test("保存した開閉状態でSSRし、不明な値は初期状態に任せる", async () => {
  const markup = await render(
    <Wing
      storageKey="home"
      savedState="start=closed&end=open"
      start={{ label: "はじめる", content: <p>作成</p> }}
      end={{ label: "最近の動き", content: <p>履歴</p>, open: false }}
    >
      <p>作業面</p>
    </Wing>,
  );
  expect(markup).not.toMatch(/<details class="start" open/);
  expect(markup).toMatch(/<details class="end" open/);
  expect(parseWingState("start=wide")).toEqual({});
  expect(serializeWingState({ start: true, end: false })).toBe("start=open&end=closed");
  expect(wingCookieName("a b")).toBe("rx-wing-a%20b");
});

test("storageKeyがない時は保存値を読まない", async () => {
  const markup = await render(
    <Wing savedState="start=closed" start={{ label: "はじめる", content: <p>作成</p> }}>
      <p>作業面</p>
    </Wing>,
  );
  expect(markup).toMatch(/<details class="start" open/);
});
