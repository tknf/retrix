import { expect, test } from "@playwright/test";

test("CSSアンカーが解決できない場合もボタンの近くへ補正する", async ({ page }) => {
  await page.goto("/components/popover");
  const panel = page.locator("#hono-popover");
  await panel.evaluate((element) => {
    element.style.setProperty("position-anchor", "--missing-anchor");
  });
  const trigger = page
    .locator('[data-example="hono"]')
    .getByRole("button", { name: "共有範囲", exact: true });
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect
    .poll(() =>
      panel.evaluate((element) => element.style.getPropertyValue("position-try-fallbacks")),
    )
    .toBe("none");
  const anchorBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  expect(anchorBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  if (anchorBox && panelBox) {
    expect(panelBox.x).toBeLessThanOrEqual(anchorBox.x + anchorBox.width);
    expect(panelBox.x + panelBox.width).toBeGreaterThanOrEqual(anchorBox.x);
    expect(
      Math.min(
        Math.abs(panelBox.y - anchorBox.y - anchorBox.height - 4),
        Math.abs(anchorBox.y - panelBox.y - panelBox.height - 4),
      ),
    ).toBeLessThanOrEqual(2);
  }
});

test("Popoverは操作ボタンの近くに開きEscapeで戻れる", async ({ page }) => {
  await page.goto("/components/popover");
  const root = page.locator('[data-example="hono"]');
  const trigger = root.getByRole("button", { name: "共有範囲", exact: true });
  await trigger.click();
  const panel = page.locator("#hono-popover");
  await expect(panel).toBeVisible();
  const anchorBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  expect(anchorBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  if (anchorBox && panelBox) {
    expect(
      panelBox.y >= anchorBox.y + anchorBox.height || panelBox.y + panelBox.height <= anchorBox.y,
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("子のPopoverを閉じても親の補足は残る", async ({ page }) => {
  await page.goto("/components/popover");
  await page.getByText("Popover内の補足・Dialog内の補足", { exact: true }).click();
  await page.getByRole("button", { name: "公開設定の補足", exact: true }).click();
  await page.getByRole("button", { name: "リンク共有について", exact: true }).click();
  await expect(page.locator("#popover-parent")).toBeVisible();
  await expect(page.locator("#popover-child")).toBeVisible();
  await page.locator("#popover-child").getByRole("button", { name: "閉じる", exact: true }).click();
  await expect(page.locator("#popover-child")).not.toBeVisible();
  await expect(page.locator("#popover-parent")).toBeVisible();
});

test("狭い画面の右端でも本文と閉じる操作が表示領域に収まる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/components/popover");
  await page.getByText("右寄せ・右から左の配置", { exact: true }).click();
  await page.getByRole("button", { name: "右端の補足", exact: true }).click();
  const panel = page.locator("#popover-end");
  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(667);
  }
  await expect(panel.getByRole("button", { name: "閉じる", exact: true })).toBeInViewport();
});

test("見出しの行に閉じる操作を置き、本文を分ける", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 800 });
  await page.goto("/components/popover");
  await page.locator('[data-popover-target="trigger"][popovertarget="hono-popover"]').click();
  const popover = page.locator("#hono-popover");
  await expect(popover).toBeVisible();
  await expect(popover.locator(":scope > .heading > .heading-row > .close")).toBeVisible();
  await expect(popover.locator(":scope > .body")).toContainText("この案件に参加");
});

test("タッチ画面でも画面内に開き、閉じる操作で閉じる", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/components/popover");
  await page.locator('[data-popover-target="trigger"][popovertarget="hono-popover"]').click();
  const popover = page.locator("#hono-popover");
  await expect(popover).toBeVisible();
  expect(
    await popover.evaluate((element) => element.getBoundingClientRect().right),
  ).toBeLessThanOrEqual(375);
  await popover.getByRole("button", { name: "閉じる" }).click();
  await expect(popover).toBeHidden();
  await context.close();
});

test("JavaScriptがなくても開閉とEscapeで閉じる操作ができる", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/popover");
    const example = page.locator('[data-example="hono"]');
    await example.getByRole("button", { name: "共有範囲", exact: true }).click();
    await expect(example.locator("#hono-popover")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(example.locator("#hono-popover")).not.toBeVisible();
  } finally {
    await context.close();
  }
});
