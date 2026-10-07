import { expect, test } from "@playwright/test";

test("操作から補足へポインターを移しても補足は閉じない", async ({ page }) => {
  await page.goto("/components/tooltip");
  const trigger = page.getByRole("button", { name: "共有範囲", exact: true });
  const tooltip = page.locator("#tooltip-button");
  await trigger.hover();
  await expect(tooltip).toBeVisible();
  const from = await trigger.boundingBox();
  const to = await tooltip.boundingBox();
  expect(from).not.toBeNull();
  expect(to).not.toBeNull();
  if (!from || !to) return;
  const x = to.x + to.width / 2;
  await page.mouse.move(x, from.y + from.height - 1);
  // 隙間を細かく刻んで通り、途中で操作と補足のどちらからも外れないことを確かめる。
  await page.mouse.move(x, to.y + to.height / 2, { steps: 12 });
  await expect(tooltip).toBeVisible();
  await page.mouse.move(x, to.y + to.height + 40);
  await expect(tooltip).not.toBeVisible();
});
