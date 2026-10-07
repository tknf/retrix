import { expect, test } from "@playwright/test";

test("ラベル・説明・送信値を保って切り替えとリセットを行う", async ({ page }) => {
  await page.goto("/components/switch");
  const form = page.getByRole("form", { name: "通知と表示の設定" });
  const digest = form.getByRole("switch", { name: "週次のまとめ", exact: true });
  const completed = form.getByRole("switch", { name: "完了した仕事を表示", exact: true });
  await expect(digest).toHaveAccessibleDescription("一週間の更新をまとめて受け取ります。");
  await expect(digest).toBeChecked();
  await expect(completed).not.toBeChecked();
  await form.getByText("一週間の更新をまとめて受け取ります。", { exact: true }).click();
  await expect(digest).not.toBeChecked();
  await completed.check();
  const values = await form.evaluate((element) =>
    element instanceof HTMLFormElement ? Array.from(new FormData(element).entries()) : [],
  );
  expect(values).toEqual([["completed", "show"]]);
  await form.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(digest).toBeChecked();
  await expect(completed).not.toBeChecked();
});

test("Spaceとフォーカス表示を保ち無効なONとOFFを変更しない", async ({ page }) => {
  await page.goto("/components/switch");
  const form = page.getByRole("form", { name: "通知と表示の設定" });
  const digest = form.getByRole("switch", { name: "週次のまとめ", exact: true });
  await digest.focus();
  await digest.press("Space");
  await expect(digest).not.toBeChecked();
  await expect(digest).toHaveCSS("outline-style", "solid");
  await digest.press("Tab");
  await expect(form.getByRole("switch", { name: "完了した仕事を表示" })).toBeFocused();
  await form.getByText("利用不可・長いラベル", { exact: true }).click();
  const lockedOn = form.getByRole("switch", { name: "お知らせを受け取る", exact: true });
  const lockedOff = form.getByRole("switch", { name: "外部への共有を許可", exact: true });
  await expect(lockedOn).toBeDisabled();
  await expect(lockedOff).toBeDisabled();
  await form.getByText("お知らせを受け取る", { exact: true }).click({ force: true });
  await form.getByText("外部への共有を許可", { exact: true }).click({ force: true });
  await expect(lockedOn).toBeChecked();
  await expect(lockedOff).not.toBeChecked();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(digest).toHaveCSS("appearance", "auto");
  await digest.check();
  await expect(digest).toBeChecked();
});

test("JavaScriptがなくても切り替えと初期値への復帰を行う", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/switch");
    const form = page.getByRole("form", { name: "通知と表示の設定" });
    const digest = form.getByRole("switch", { name: "週次のまとめ", exact: true });
    await digest.uncheck();
    await expect(digest).not.toBeChecked();
    await form.getByRole("button", { name: "初期値に戻す", exact: true }).click();
    await expect(digest).toBeChecked();
  } finally {
    await context.close();
  }
});

for (const width of [375, 1280]) {
  test(`${width}pxの長いラベルを文字拡大とRTLでも操作できる`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/switch");
    const form = page.getByRole("form", { name: "通知と表示の設定" });
    await form.getByText("利用不可・長いラベル", { exact: true }).click();
    await form.screenshot({ path: testInfo.outputPath(`switch-${width}.png`) });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    for (const label of await form.locator(".rx-switch").all()) {
      const input = await label.locator("input").boundingBox();
      const text = await label.locator(":scope > span").boundingBox();
      if (!input || !text) throw new Error("スイッチとラベルがありません");
      expect(input.x + input.width).toBeLessThan(text.x);
      expect(Math.abs(input.y - text.y)).toBeLessThan(1);
    }
    await form.screenshot({ path: testInfo.outputPath(`switch-${width}-200.png`) });
    await form.evaluate((element) => element.setAttribute("dir", "rtl"));
    const completed = form.getByRole("switch", { name: "完了した仕事を表示", exact: true });
    await completed.check();
    await expect(completed).toBeChecked();
    for (const label of await form.locator(".rx-switch").all()) {
      const input = await label.locator("input").boundingBox();
      const text = await label.locator(":scope > span").boundingBox();
      if (!input || !text) throw new Error("RTLのスイッチとラベルがありません");
      expect(text.x + text.width).toBeLessThan(input.x);
    }
    await form.screenshot({ path: testInfo.outputPath(`switch-${width}-rtl-200.png`) });
  });
}
