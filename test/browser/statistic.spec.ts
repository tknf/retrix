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
  // 内容の幅まで縮んでも、数字と名前が枠からはみ出さず、6rem（96px）より狭く潰れない。
  const size = await statistic.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    overflow: element.scrollWidth - element.clientWidth,
  }));
  expect(size.width).toBeGreaterThan(96);
  expect(size.overflow).toBeLessThanOrEqual(1);
});
