import { expect, test } from "@playwright/test";

test("SplitViewはハンドルのドラッグと矢印キーで主領域の幅を変える", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/split-view");
  const view = page.locator('[data-example="hono"] .rx-split-view').first();
  await expect(view).toHaveAttribute("data-state", /.+/);
  const handle = view.locator(":scope > .panes > .handle");
  const primary = view.locator(":scope > .panes > .primary");
  const width = async () => (await primary.boundingBox())?.width ?? 0;
  const before = await width();
  const box = await handle.boundingBox();
  if (!box) throw new Error("ハンドルがありません");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 150, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  const dragged = await width();
  expect(dragged).toBeLessThan(before - 50);
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  expect(await width()).toBeGreaterThan(dragged);
});
