import { expect, test } from "@playwright/test";

test("↑↓は空き（null）をまたいでも同じ曜日の前後の週へ移る", async ({ page }) => {
  await page.goto("/components/calendar");
  const calendar = page.getByRole("region", { name: "2026年9月の平日から選ぶ", exact: true });
  const day = (date: string) => calendar.locator(`[data-calendar-value="${date}"]`);
  await day("2026-09-15").focus();
  // 並んだボタンの7つ後（9月24日）ではなく、7日後の同じ火曜日へ移る。
  await page.keyboard.press("ArrowDown");
  await expect(day("2026-09-22")).toBeFocused();
  await expect(day("2026-09-22")).toHaveAttribute("tabindex", "0");
  await page.keyboard.press("ArrowDown");
  await expect(day("2026-09-29")).toBeFocused();
  // 表示の外（10月6日）には移らない。
  await page.keyboard.press("ArrowDown");
  await expect(day("2026-09-29")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await expect(day("2026-09-08")).toBeFocused();

  // 7日後の日が選べない時（9月23日）は動かない。
  await day("2026-09-16").focus();
  await page.keyboard.press("ArrowDown");
  await expect(day("2026-09-16")).toBeFocused();
});

test("日付を押すと選び、期間は始点を示し、予定の無い一覧は空であることを伝える", async ({
  page,
}) => {
  await page.setViewportSize({ width: 720, height: 800 });
  await page.goto("/components/calendar");
  const week = page.getByRole("region", { name: "9月14日〜20日から選ぶ", exact: true });
  const date = week.locator('[data-calendar-value="2026-09-16"]');
  await date.click();
  await expect(date).toHaveAttribute("aria-pressed", "true");
  const range = page.getByRole("region", { name: "9月21日〜27日から期間を選ぶ", exact: true });
  await range.locator('[data-calendar-value="2026-09-26"]').click();
  await expect(range.locator('[data-calendar-value="2026-09-26"]')).toHaveAttribute(
    "data-state",
    "range-start",
  );
  await expect(
    page.locator('[data-example="hono"] .rx-calendar[data-view="agenda"]').last(),
  ).toContainText("この期間に予定はありません");
});

test("月は狭幅でも7日の列を収め、週は領域の中をキーボードでスクロールできる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/calendar");
  // 月は狭い幅では予定を点にして、7日の列を横にはみ出さずに収める。
  const month = page
    .locator('[data-example="hono"] .rx-calendar[data-view="month"] > .viewport')
    .first();
  expect(await month.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  // 週は時間割の列を保ち、収まらない分を領域の中でスクロールする。
  const week = page
    .locator('[data-example="hono"] .rx-calendar[data-view="week"] > .viewport')
    .first();
  await week.focus();
  await expect(week).toBeFocused();
  await page.keyboard.press("ArrowRight", { delay: 100 });
  await expect.poll(() => week.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
