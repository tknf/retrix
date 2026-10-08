import { expect, test } from "@playwright/test";

test("数値の操作と読み上げに接頭辞・単位を関連付ける", async ({ page }) => {
  await page.goto("/components/input-group");
  const example = page.locator('[data-example="hono"]');
  const price = example.getByRole("spinbutton", { name: "料金（円）", exact: true });
  await expect(price).toHaveAccessibleDescription("100円単位で設定できます。 ¥");
  await price.press("PageUp");
  await expect(price).toHaveValue("2200");
  await price.fill("0");
  await expect(price).toHaveAttribute("data-state", "min");
  const capacity = example.getByRole("spinbutton", { name: "定員（人）", exact: true });
  await expect(capacity).toHaveAccessibleDescription("人");
  await capacity.fill("20");
  await expect(capacity).toHaveAttribute("data-state", "max");
  await expect(
    example.getByRole("textbox", { name: "サイトのURL", exact: true }),
  ).toHaveAccessibleDescription("https:// .example.jp");
});

test("枠全体にフォーカスとエラーを反映して入力と操作を無効化する", async ({ page }) => {
  await page.goto("/components/input-group");
  await page.getByText("エラー・閲覧専用・利用不可・大きい入力", { exact: true }).click();
  const error = page.getByRole("spinbutton", { name: "料金（入力エラー）", exact: true });
  const frame = page.locator(".control").filter({ has: error });
  await error.focus();
  await error.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(error).toHaveCSS("outline-style", "none");
  await expect(frame).toHaveCSS("outline-style", "solid");
  // 危険の色（--rx-danger）の枠。
  await expect(frame).toHaveCSS("border-top-color", "rgb(153, 0, 0)");
  await expect(error).toHaveAccessibleDescription("料金を入力してください。 ¥");
  const readonly = page.getByRole("textbox", { name: "公開済みのURL", exact: true });
  await expect(readonly).not.toBeEditable();
  await readonly.focus();
  await readonly.press("Tab");
  await expect(
    page.getByRole("searchbox", { name: "記事を検索（大きい入力）", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("searchbox", { name: "停止中の検索", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "検索する", exact: true })).toBeDisabled();
});

for (const width of [375, 1280]) {
  test(`InputGroupが${width}pxと文字拡大で入力・単位・操作を収める`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/input-group");
    await page.getByText("エラー・閲覧専用・利用不可・大きい入力", { exact: true }).click();
    const example = page.locator('[data-example="hono"]');
    // 高さは入力の枠の文字の大きさから求める（通常は12pxの2倍で24px、largeは14pxの32/14倍で32px）。
    for (const [name, ratio] of [
      ["記事を検索", 2],
      ["記事を検索（大きい入力）", 32 / 14],
    ] as const) {
      const input = page.getByRole("searchbox", { name, exact: true });
      const group = example.locator(".rx-input-group").filter({ has: input });
      const control = await group.locator(".control").boundingBox();
      const buttonLocator = group.getByRole("button");
      const button = await buttonLocator.boundingBox();
      if (!control || !button) throw new Error("入力とボタンが描画されていません");
      const fontSize = await group
        .locator(".control")
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
      expect(control.height).toBeCloseTo(fontSize * ratio, 1);
      // BC2の欄（24px）とボタン（22px）は高さが違うので、上下の中央をそろえる。
      expect(button.y + button.height / 2).toBeCloseTo(control.y + control.height / 2, 0);
    }
    await example.screenshot({ path: testInfo.outputPath(`input-group-${width}.png`) });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    for (const input of await example.locator("input").all()) {
      const bounds = await input.boundingBox();
      if (!bounds) throw new Error("文字拡大後の入力が描画されていません");
      expect(bounds.width).toBeGreaterThan(40);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      const textSpace = await input.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          width:
            element.getBoundingClientRect().width -
            Number.parseFloat(style.paddingInlineStart) -
            Number.parseFloat(style.paddingInlineEnd),
          fontSize: Number.parseFloat(style.fontSize),
        };
      });
      expect(textSpace.width).toBeGreaterThanOrEqual(textSpace.fontSize * 2);
    }
    await example.screenshot({ path: testInfo.outputPath(`input-group-${width}-200.png`) });
  });
}

test("接頭辞と値の文字を同じ行の箱に載せ、隣のButtonを欄と同じ高さにそろえる", async ({ page }) => {
  await page.goto("/components/input-group");
  const control = page.locator('[data-example="hono"] .rx-input-group > .control').first();
  const lines = await control.evaluate((element) => {
    const affix = element.querySelector(":scope > .affix");
    const input = element.querySelector(":scope > .rx-input");
    if (!affix || !input) return null;
    return {
      affix: getComputedStyle(affix).lineHeight,
      input: getComputedStyle(input).lineHeight,
      inner: element.clientHeight,
    };
  });
  expect(lines).not.toBeNull();
  // flexの中央寄せと入力欄の中央寄せの違いで、接頭辞が値より上へずれないようにする。
  if (lines) {
    expect(lines.affix).toBe(lines.input);
    expect(Number.parseFloat(lines.input)).toBe(lines.inner);
  }
  const group = page.locator('[data-example="hono"] .rx-input-group:has(> .rx-button)').first();
  const field = await group.locator(":scope > .control").boundingBox();
  const button = await group.locator(":scope > .rx-button").boundingBox();
  expect(field).not.toBeNull();
  expect(button).not.toBeNull();
  if (field && button) {
    expect(button.height).toBe(field.height);
    expect(button.y).toBe(field.y);
  }
});
