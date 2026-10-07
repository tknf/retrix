import { expect, test } from "@playwright/test";

test("MessageListは日時や添付の長さで本文列をずらさない", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/message-list");
  const list = page.getByRole("list", { name: "長い内容と不足する情報", exact: true });
  const starts = await list
    .locator(".row > .body")
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().x));
  expect(starts.length).toBe(4);
  expect(Math.max(...starts) - Math.min(...starts)).toBeLessThan(0.5);
});
