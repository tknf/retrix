import { expect, test } from "@playwright/test";

test("独自のチェックとラジオをラベル・キーボードで操作できる", async ({ page }) => {
  await page.goto("/components/field");
  const check = page.getByLabel("条件を確認しました", { exact: true });
  await expect(check).toHaveCSS("appearance", "none");
  await page.getByText("条件を確認しました", { exact: true }).click();
  await expect(check).toBeChecked();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Space");
  await expect(check).not.toBeChecked();
  await expect(check).toBeFocused();
  await expect(check).toHaveCSS("outline-style", "solid");
  await expect(page.getByLabel("選択済みの停止項目", { exact: true })).toBeChecked();
  await expect(page.getByLabel("選択済みの停止項目", { exact: true })).toBeDisabled();
  const radio = page.getByRole("radio", { name: /^標準/ });
  await radio.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: /^静かな部屋/ })).toBeChecked();
  await expect(radio).not.toBeChecked();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(check).toHaveCSS("appearance", "auto");
  await check.check();
  await expect(check).toBeChecked();
});

test("説明付きの選択肢は文字200%でもマークと重ならない", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto("/components/field");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page
      .locator('[data-example="hono"]')
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  const option = page.locator('[data-example="hono"] .rx-choice[data-kind="option"]').first();
  const box = await option.locator("input").boundingBox();
  const text = await option.locator("span").first().boundingBox();
  if (!box || !text) throw new Error("選択肢がありません");
  expect(box.x + box.width).toBeLessThan(text.x);
  // コンポーネントのページはリファレンスで長く、Firefoxのページ全体の撮影の上限を超えるので、見本だけを撮る。
  await page
    .locator('[data-example="hono"]')
    .screenshot({ path: testInfo.outputPath("field-375-text-200.png") });
});
