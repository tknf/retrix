import { expect, test } from "@playwright/test";

test("TaskListはキーボードで完了を切り替え無効な項目を保持する", async ({ page }) => {
  await page.goto("/components/task-list");
  const sample = page.locator('[data-example="hono"]');
  const task = sample.getByRole("checkbox").first();
  const initial = await task.isChecked();
  await task.focus();
  await page.keyboard.press("Space");
  expect(await task.isChecked()).toBe(!initial);
  await page.keyboard.press("Space");
  expect(await task.isChecked()).toBe(initial);
  await expect(sample.getByRole("checkbox", { name: "管理者の確認", exact: true })).toBeDisabled();
});
