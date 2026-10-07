import { expect, test } from "@playwright/test";

test("見出しの行に閉じる操作を置き、本文と操作を分ける", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 800 });
  await page.goto("/components/hover-card");
  await page
    .locator('[data-example="hono"] .rx-hover-card [data-hover-card-target="trigger"]')
    .first()
    .click();
  const hoverCard = page.locator("#hover-card-summary");
  await expect(hoverCard).toBeVisible();
  await expect(hoverCard.locator(":scope > .heading > .heading-row > .close")).toBeVisible();
  await expect(hoverCard.locator(":scope > .body")).toContainText("田中 遥");
  await expect(hoverCard.locator(":scope > .actions")).toContainText("案件を開く");
});
