import { expect, test, type Locator } from "@playwright/test";

test("現在値・境界・小数を表示し上流の変更キャンセルを反映する", async ({ page }) => {
  await page.goto("/components/range");
  const input = page.locator("#hono-range-zoom");
  const root = page.locator(".rx-range").filter({ has: input });
  const output = root.locator("output");
  await expect(input).toHaveAccessibleName("表示倍率（%）");
  await expect(output).toHaveText("100%");
  await input.focus();
  await input.press("ArrowRight");
  await expect(input).toHaveValue("110");
  await expect(output).toHaveText("110%");
  await root.evaluate((element) => {
    element.addEventListener("slider:beforechange", (event) => event.preventDefault(), {
      once: true,
    });
  });
  await input.press("ArrowRight");
  await expect(input).toHaveValue("110");
  await expect(output).toHaveText("110%");
  await input.press("Home");
  await expect(root).toHaveAttribute("data-state", "min");
  await expect(output).toHaveText("50%");
  await input.press("End");
  await expect(root).toHaveAttribute("data-state", "max");
  await expect(output).toHaveText("200%");
  await page.getByText("最小・最大・小数・利用不可", { exact: true }).click();
  const decimal = page.getByRole("slider", { name: "拡大率（小数）", exact: true });
  await decimal.focus();
  await decimal.press("ArrowRight");
  await expect(decimal).toHaveValue("1.3");
  await expect(page.locator(".rx-range").filter({ has: decimal }).locator("output")).toHaveText(
    "1.3倍",
  );
  await expect(page.getByRole("slider", { name: "変更できない範囲", exact: true })).toBeDisabled();
  await expect(
    page.getByRole("slider", { name: "予算（変更不可） 下限", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("spinbutton", { name: "予算（変更不可） 上限", exact: true }),
  ).toBeDisabled();
});

test("数値入力と二つのつまみを同期して逆転・送信・リセットを扱う", async ({ page }) => {
  await page.goto("/components/range");
  const form = page.getByRole("form", { name: "表示と予算の設定" });
  const group = page.getByRole("group", { name: "予算（円）", exact: true });
  const start = group.getByRole("slider", { name: "予算（円） 下限", exact: true });
  const end = group.getByRole("slider", { name: "予算（円） 上限", exact: true });
  const startNumber = group.getByRole("spinbutton", { name: "予算（円） 下限", exact: true });
  const endNumber = group.getByRole("spinbutton", { name: "予算（円） 上限", exact: true });
  await start.focus();
  await start.press("End");
  await expect(start).toHaveValue("5000");
  await expect(startNumber).toHaveValue("5000");
  await expect(group).toHaveAttribute("data-state", "empty");
  await end.focus();
  await end.press("Home");
  await expect(end).toHaveValue("5000");
  await startNumber.fill("0");
  await startNumber.press("Tab");
  await endNumber.fill("10000");
  await endNumber.press("Tab");
  await expect(start).toHaveValue("0");
  await expect(end).toHaveValue("10000");
  await expect(group).toHaveAttribute("data-state", "full");
  const values = await form.evaluate((element) =>
    element instanceof HTMLFormElement ? Array.from(new FormData(element).entries()) : [],
  );
  expect(values).toEqual([
    ["zoom", "100"],
    ["budget-start", "0"],
    ["budget-end", "10000"],
  ]);
  await form.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(start).toHaveValue("1000");
  await expect(endNumber).toHaveValue("5000");
  await expect(startNumber).toHaveValue("1000");
  await expect(group).toHaveAttribute("data-state", "partial");
});

test("トラックのクリックと両方のつまみのドラッグで値を変更する", async ({ page }) => {
  await page.goto("/components/range");
  const zoom = page.locator("#hono-range-zoom");
  const zoomBox = await zoom.boundingBox();
  if (!zoomBox) throw new Error("スライダーがありません");
  await zoom.click({ position: { x: zoomBox.width / 2, y: zoomBox.height / 2 } });
  expect(Number(await zoom.inputValue())).toBeGreaterThan(100);
  const group = page.getByRole("group", { name: "予算（円）", exact: true });
  for (const [bound, before, after] of [
    ["下限", 0.1, 0.3],
    ["上限", 0.5, 0.8],
  ] as const) {
    const input = group.getByRole("slider", { name: `予算（円） ${bound}`, exact: true });
    const box = await input.boundingBox();
    if (!box) throw new Error("範囲指定のつまみがありません");
    const radius = 9;
    const x = (ratio: number) => box.x + radius + (box.width - radius * 2) * ratio;
    await page.mouse.move(x(before), box.y + box.height / 2);
    await page.mouse.down();
    await expect(input).toHaveCSS("cursor", "grabbing");
    await page.mouse.move(x(after), box.y + box.height / 2, { steps: 8 });
    await expect(
      group.getByRole("spinbutton", { name: `予算（円） ${bound}`, exact: true }),
    ).toHaveValue(String(after * 10000));
    await page.mouse.up();
    await expect(input).toHaveValue(String(after * 10000));
  }
});

test("つまみとバーを補間し動きを減らす設定では即座に反映する", async ({ page }, testInfo) => {
  const pauseMotion = async (range: Locator, property: string) =>
    range.evaluate(async (element, name) => {
      const transition = element
        .getAnimations()
        .find(
          (animation) =>
            animation instanceof CSSTransition && animation.transitionProperty === name,
        );
      if (!transition) throw new Error("移動のtransitionがありません");
      const duration = transition.effect?.getTiming().duration;
      if (typeof duration !== "number") throw new Error("移動時間を取得できません");
      transition.pause();
      await transition.ready;
      transition.currentTime = duration / 2;
      const value = Number(getComputedStyle(element).getPropertyValue(name));
      for (const input of element.querySelectorAll(".input")) {
        const inherited = Number(getComputedStyle(input).getPropertyValue(name));
        if (Math.abs(inherited - value) > 0.001)
          throw new Error(`移動位置が継承されていません: ${value} / ${inherited}`);
      }
      // 撮影時のスタイル再計算でも、実際に補間された途中の位置を保つ。
      element.style.transition = "none";
      element.style.setProperty(name, String(value));
      return value;
    }, property);
  const finishMotion = async (range: Locator) =>
    range.evaluate((element) => {
      element.style.removeProperty("--rx-range-fill-start");
      element.style.removeProperty("--rx-range-fill-end");
      element.style.removeProperty("transition");
      for (const animation of element.getAnimations()) animation.finish();
    });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/range");
  const input = page.locator("#hono-range-zoom");
  const root = page.locator(".rx-range").filter({ has: input });
  expect(await root.evaluate((element) => element.getAnimations().length)).toBe(0);
  await input.press("End");
  const middle = await pauseMotion(root, "--rx-range-fill-end");
  expect(middle).toBeGreaterThan(1 / 3);
  expect(middle).toBeLessThan(1);
  await expect(input).toHaveValue("200");
  await root.screenshot({ path: testInfo.outputPath("range-motion-single.png") });
  await expect(root).toHaveCSS("--rx-range-fill-end", String(middle));
  const stop = await input.evaluate(
    (element) => getComputedStyle(element).backgroundImage.match(/([\d.]+)%/)?.[1],
  );
  expect(Number(stop) / 100).toBeCloseTo(middle, 4);
  await finishMotion(root);

  const group = page.getByRole("group", { name: "予算（円）", exact: true });
  const number = group.getByRole("spinbutton", { name: "予算（円） 上限", exact: true });
  await number.fill("8000");
  await number.press("Tab");
  const end = await pauseMotion(group, "--rx-range-fill-end");
  expect(end).toBeGreaterThan(0.5);
  expect(end).toBeLessThan(0.8);
  await group.screenshot({ path: testInfo.outputPath("range-motion-interval.png") });
  await finishMotion(group);

  await group.evaluate((element) => element.setAttribute("dir", "rtl"));
  const start = group.getByRole("slider", { name: "予算（円） 下限", exact: true });
  await start.press("End");
  const lower = await pauseMotion(group, "--rx-range-fill-start");
  expect(lower).toBeGreaterThan(0.1);
  expect(lower).toBeLessThan(0.8);
  await group.screenshot({ path: testInfo.outputPath("range-motion-rtl.png") });
  await finishMotion(group);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await start.press("Home");
  await expect(start).toHaveValue("0");
  await expect(group).toHaveCSS("--rx-range-fill-start", "0");
  expect(await group.evaluate((element) => element.getAnimations().length)).toBe(0);
});

test("狭い画面でも数値欄のタップで両端を指定できる", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 375, height: 800 },
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/range");
    const group = page.getByRole("group", { name: "予算（円）", exact: true });
    const start = group.getByRole("spinbutton", { name: "予算（円） 下限", exact: true });
    const end = group.getByRole("spinbutton", { name: "予算（円） 上限", exact: true });
    await start.tap();
    await expect(start).toBeFocused();
    await start.fill("2500");
    await end.tap();
    await end.fill("8500");
    await start.tap();
    await expect(group.getByRole("slider", { name: "予算（円） 下限", exact: true })).toHaveValue(
      "2500",
    );
    await expect(group.getByRole("slider", { name: "予算（円） 上限", exact: true })).toHaveValue(
      "8500",
    );
  } finally {
    await context.close();
  }
});

test("JavaScriptなしでは独立した二本のトラックをクリックできる", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/range");
    const group = page.getByRole("group", { name: "予算（円）", exact: true });
    const start = group.getByRole("slider", { name: "予算（円） 下限", exact: true });
    const end = group.getByRole("slider", { name: "予算（円） 上限", exact: true });
    const startBox = await start.boundingBox();
    const endBox = await end.boundingBox();
    if (!startBox || !endBox) throw new Error("二本のトラックがありません");
    expect(startBox.y + startBox.height).toBeLessThan(endBox.y);
    await start.click({ position: { x: startBox.width * 0.2, y: startBox.height / 2 } });
    await end.click({ position: { x: endBox.width * 0.8, y: endBox.height / 2 } });
    expect(Number(await start.inputValue())).toBeGreaterThan(1000);
    expect(Number(await end.inputValue())).toBeGreaterThan(5000);
    await expect(group.locator(".values")).toBeHidden();
  } finally {
    await context.close();
  }
});

for (const width of [375, 1280]) {
  test(`${width}pxの通常・文字拡大・RTLで表示と数値入力を保つ`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/range");
    await page.getByText("最小・最大・小数・利用不可", { exact: true }).click();
    const form = page.getByRole("form", { name: "表示と予算の設定" });
    await form.screenshot({ path: testInfo.outputPath(`range-${width}.png`) });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    for (const input of await form.locator("input").all()) {
      const box = await input.boundingBox();
      if (!box) throw new Error("拡大後の入力がありません");
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
    await form.screenshot({ path: testInfo.outputPath(`range-${width}-200.png`) });
    await form.evaluate((element) => element.setAttribute("dir", "rtl"));
    const endNumber = form.getByRole("spinbutton", { name: "予算（円） 上限", exact: true });
    await endNumber.fill("8000");
    await endNumber.press("Tab");
    await expect(form.getByRole("slider", { name: "予算（円） 上限", exact: true })).toHaveValue(
      "8000",
    );
    await form.screenshot({ path: testInfo.outputPath(`range-${width}-rtl-200.png`) });
    await page.emulateMedia({ forcedColors: "active" });
    await page.locator("#hono-range-zoom").focus();
    await page.locator("#hono-range-zoom").press("ArrowRight");
    await form.screenshot({ path: testInfo.outputPath(`range-${width}-forced.png`) });
  });
}

test("範囲指定の数の入力にunitを添え、説明として読み上げる", async ({ page }) => {
  await page.goto("/components/range");
  const group = page.getByRole("group", { name: "予算（円）", exact: true });
  for (const bound of ["下限", "上限"]) {
    const number = group.getByRole("spinbutton", { name: `予算（円） ${bound}`, exact: true });
    await expect(number).toHaveAccessibleDescription("円");
  }
  await expect(group.locator(".values .affix")).toHaveText(["円", "円"]);
});
