import { expect, test } from "@playwright/test";

for (const width of [375, 1280]) {
  test(`FieldGroupが${width}pxで説明と入力を読みやすく配置する`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/field-group");
    const example = page.locator('[data-example="hono"]');
    const group = example.getByRole("group", { name: "連絡先", exact: true });
    const description = group.getByText("予約に関するご連絡に使います。", { exact: true });
    const input = group.getByRole("textbox", { name: "名前", exact: true });
    const intro = await description.boundingBox();
    const field = await input.boundingBox();
    if (!intro || !field) throw new Error("説明と入力欄が描画されていません");
    if (width === 1280) expect(field.x).toBeGreaterThan(intro.x + intro.width);
    else expect(field.y).toBeGreaterThan(intro.y + intro.height);

    await input.fill("確認用の名前");
    await input.press("Tab");
    await expect(group.getByRole("textbox", { name: "メールアドレス", exact: true })).toBeFocused();
    const disabled = example.getByRole("group", { name: "配送先（受付停止中）", exact: true });
    for (const name of ["宛名", "住所"])
      await expect(disabled.getByRole("textbox", { name, exact: true })).toBeDisabled();

    await example.screenshot({ path: testInfo.outputPath(`field-group-${width}.png`) });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    const enlargedIntro = await description.boundingBox();
    const enlargedField = await input.boundingBox();
    if (!enlargedIntro || !enlargedField) throw new Error("文字拡大後の入力欄が描画されていません");
    expect(enlargedField.y).toBeGreaterThan(enlargedIntro.y + enlargedIntro.height);
    await example.screenshot({ path: testInfo.outputPath(`field-group-${width}-200.png`) });
  });
}
