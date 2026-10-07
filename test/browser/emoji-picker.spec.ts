import { expect, test } from "@playwright/test";

test("↑↓は種類をまたいでも上下の行の同じ列へ移る", async ({ page }) => {
  await page.goto("/components/emoji-picker");
  const picker = page.locator(".rx-emoji-picker").first();
  const faces = picker.getByRole("region", { name: "顔", exact: true });
  // 「顔」の最後の行の先頭。行の途中で終わる種類からでも、次の種類の先頭の列へ真下に移る。
  const lastRowStart = await faces.locator("button.emoji").evaluateAll((buttons) => {
    const top = (button: Element) => (button instanceof HTMLElement ? button.offsetTop : 0);
    const bottom = Math.max(...buttons.map(top));
    return buttons.find((button) => top(button) === bottom)?.getAttribute("aria-label") ?? "";
  });
  await faces.getByRole("button", { name: lastRowStart, exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(picker.getByRole("button", { name: "拍手", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(faces.getByRole("button", { name: lastRowStart, exact: true })).toBeFocused();

  await picker.getByRole("button", { name: "お祝い", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(picker.getByRole("button", { name: "うれし泣き", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await expect(picker.getByRole("button", { name: "お祝い", exact: true })).toBeFocused();
});
