import { expect, test } from "@playwright/test";

test("Statisticは横並びのグループに入れても狭幅で潰れない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/statistic");
  const statistic = page.locator('[data-example="hono"] .rx-statistic').first();
  await statistic.evaluate((element) => {
    const wrapper = document.createElement("div");
    wrapper.className = "rx-cluster";
    element.parentElement?.insertBefore(wrapper, element);
    wrapper.append(element);
  });
  await expect(statistic).toBeVisible();
  expect(
    await statistic.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(100);
});
