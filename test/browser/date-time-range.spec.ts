import { expect, test } from "@playwright/test";

test("矢印は右から左に読む時も、狭い幅では下を向く", async ({ page }) => {
  await page.goto("/components/date-time-range");
  await page.getByText("右から左に読む場合", { exact: true }).click();
  const range = page.locator('[dir="rtl"] .rx-date-time-range').first();
  const arrow = range.locator(".range > .arrow");
  await expect(arrow).toHaveCSS("rotate", "180deg");
  // 同じ見本を26rem未満に狭め、コンテナクエリの下向きが右から左の向きより勝つことを確かめる。
  await range.evaluate((element) => {
    element.style.maxInlineSize = "20rem";
  });
  await expect(arrow).toHaveCSS("rotate", "90deg");
});
