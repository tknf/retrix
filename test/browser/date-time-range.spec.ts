import { expect, test } from "@playwright/test";

/*
  見た目の基準はBC2の予定のパネルの「Starts: / Ends:」。開始と終了を縦に積み、名前を先頭側の列に置く。
  以前の、矢印でつないだ横並び（矢印の向きの検査）は、この並びに変えたので外した。
*/
test("開始と終了は縦に積み、右から左に読む時は名前を右に置く", async ({ page }) => {
  await page.goto("/components/date-time-range");
  await page.getByText("右から左に読む場合", { exact: true }).click();
  const range = page.locator('[dir="rtl"] .rx-date-time-range').first();
  await expect(range.locator(".range > .arrow")).toBeHidden();
  const [start, end] = await range.locator(".range > .point").all();
  const startBox = await start.boundingBox();
  const endBox = await end.boundingBox();
  expect(startBox).not.toBeNull();
  expect(endBox).not.toBeNull();
  if (!startBox || !endBox) return;
  expect(endBox.y).toBeGreaterThanOrEqual(startBox.y + startBox.height);
  const caption = await start.locator(".caption").boundingBox();
  const date = await start.locator("input").first().boundingBox();
  if (!caption || !date) throw new Error("名前と日付の欄の位置を取れない");
  expect(caption.x).toBeGreaterThan(date.x + date.width);
});

test("狭い場所では、時刻の欄を日付の欄の下に回す", async ({ page }) => {
  await page.goto("/components/date-time-range");
  const range = page.locator('[data-example="hono"] .rx-date-time-range').first();
  await range.evaluate((element) => {
    element.style.maxInlineSize = "20rem";
  });
  const point = range.locator(".range > .point").first();
  const date = await point.locator("input").first().boundingBox();
  const time = await point.locator(".time input").boundingBox();
  if (!date || !time) throw new Error("日付と時刻の欄の位置を取れない");
  expect(time.y).toBeGreaterThanOrEqual(date.y + date.height);
  expect(Math.round(time.x)).toBe(Math.round(date.x));
});
