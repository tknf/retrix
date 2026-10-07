import { Hono } from "hono";
import { expect, test } from "vite-plus/test";
import { Popover, Button } from "../src/hono";

const render = async (options: { iconOnly?: boolean; disabled?: boolean } = {}) => {
  const app = new Hono().get("/", (c) =>
    c.html(
      <Popover
        id="help"
        label="補足を開く"
        title="共有範囲"
        description="閲覧できる人の説明"
        align="end"
        size="compact"
        {...options}
        actions={
          <Button popovertarget="help" popovertargetaction="hide">
            了解
          </Button>
        }
      >
        <a href="/settings?a=1&b=2">共有設定</a>
      </Popover>,
    ),
  );
  return (await app.request("/")).text();
};

test("標準Popoverの開閉と非モーダルの名前付けを維持する", async () => {
  const result = await render();
  expect(result).toContain('popover="auto"');
  expect(result).toContain('role="dialog"');
  expect(result).toContain('aria-labelledby="help-title"');
  expect(result).toContain('aria-describedby="help-description"');
  expect(result).toContain('popovertargetaction="hide"');
  expect(result).not.toContain("aria-modal");
  expect(result).not.toContain("aria-expanded=");
  expect(result).toContain('href="/settings?a=1&amp;b=2"');
});

test("アイコンのみでもトリガーに名前があり無効状態を保持する", async () => {
  const result = await render({ iconOnly: true, disabled: true });
  expect(result).toContain('aria-label="補足を開く"');
  expect(result).toContain('data-icon-only="true"');
  expect(result).toContain('class="rx-button"');
  expect(result).toContain("disabled");
});

test("配置・大きさと対応環境用controllerを同じHTMLに持つ", async () => {
  const result = await render();
  expect(result).toContain('data-controller="popover"');
  expect(result).toContain('data-align="end"');
  expect(result).toContain('data-size="compact"');
  expect(result).toContain('data-popover-target="trigger"');
  expect(result).toContain('data-popover-target="panel"');
  expect(result).toContain('<footer class="actions">');
  const anchor = result.match(/anchor-name: (--[a-z0-9-]+)/)?.[1];
  expect(anchor).toBeDefined();
  // 位置の基準はパネルへ変数で渡し、Overlayの共通CSSがposition-anchorへ使う。
  expect(result).toContain(`--rx-overlay-anchor: ${anchor}`);
});
