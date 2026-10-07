import { expect, test } from "@playwright/test";

test("開く操作のaria-expandedをパネルの開閉に合わせる", async ({ page }) => {
  await page.goto("/components/filter-menu");
  const trigger = page.getByRole("button", { name: "担当", exact: true });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  const panel = page.getByRole("dialog", { name: "担当を決める", exact: true });
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await panel.getByRole("option", { name: "田中 遥", exact: true }).click();
  await expect(panel).not.toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
