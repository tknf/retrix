import { expect, test } from "@playwright/test";

test("矢印キーは無効なタブを飛ばして次のタブと内容を出す", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/tabs");
  const tabs = page.locator('[data-example="hono"]');
  await tabs.getByRole("tab", { name: "内容", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "設定", exact: true })).toBeFocused();
  await expect(tabs.getByRole("tabpanel", { name: "設定", exact: true })).toBeVisible();
});
