import { expect, test } from "@playwright/test";

// 特定のコンポーネントではなく、コンポーネントに共通するCSSの規則（読み込み順・入れ子・継承・表示環境）を確かめる。

test("コンポーネントの入れ子とCSSの読み込み順が文字と固有の状態を変えない", async ({ page }) => {
  // 読込直後のtransition途中ではなく、確定したスタイル同士を比較する。
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of ["card", "notice", "comparison", "button", "badge", "tag", "field"]) {
    await page.goto(`/components/${id}`);
    const samples = page.locator('[data-example="hono"]');
    const signatures = () =>
      samples.evaluate((element) =>
        Array.from(
          element.querySelectorAll(
            ".rx-card > .title, .rx-notice > .heading > .title, .rx-comparison > .title, .rx-button, .rx-badge, .rx-tag, .rx-input",
          ),
          (child) => {
            const style = getComputedStyle(child);
            return {
              component: child.closest("[data-component]")?.getAttribute("data-component"),
              label: child.textContent?.trim(),
              color: style.color,
              background: style.backgroundColor,
              image: style.backgroundImage,
              border: style.borderColor,
              shadow: style.boxShadow,
              font: style.fontFamily,
              size: style.fontSize,
              line: style.lineHeight,
              weight: style.fontWeight,
              padding: style.paddingBlock,
            };
          },
        ),
      );
    const original = await signatures();
    await page.evaluate(() =>
      Array.from(document.querySelectorAll('link[href*="/components/"]'))
        .reverse()
        .forEach((link) => document.head.append(link)),
    );
    await expect.poll(signatures, { message: id }).toEqual(original);
  }
});

test("入れ子の局所クラスへ外側の見出しと状態の指定が漏れない", async ({ page }) => {
  await page.goto("/components/comparison");
  const sample = page.locator('[data-example="hono"]');
  const comparisons = sample.locator(".rx-comparison");
  const first = comparisons.first().locator(":scope > .title");
  const nested = comparisons.last().locator(":scope > .title");
  const font = (element: HTMLElement) => ({
    size: getComputedStyle(element).fontSize,
    weight: getComputedStyle(element).fontWeight,
  });
  expect(await nested.evaluate(font)).toEqual(await first.evaluate(font));
  await page.goto("/components/notice");
  await page.getByText("入れ子の通知", { exact: true }).click();
  const standalone = page.getByRole("complementary", { name: "招待を送りました", exact: true });
  const inner = page.getByRole("complementary", { name: "内側の完了", exact: true });
  expect(await inner.evaluate((element) => getComputedStyle(element).borderInlineStartColor)).toBe(
    await standalone.evaluate((element) => getComputedStyle(element).borderInlineStartColor),
  );
});

test("文章・数値・操作の文字寸法を親からの継承で変えない", async ({ page }) => {
  // 表と案内は補足の段（13px・行高18px）、カードの説明はBC2のプロジェクトのカードの16px・行高20px。
  for (const [id, selector, font, line] of [
    ["table", '[data-example="hono"] tbody td', 13, 18],
    ["card", '[data-example="hono"] .rx-card > .body > p', 16, 20],
    ["notice", '[data-example="hono"] .rx-notice > .body > p', 13, 18],
  ] as const) {
    await page.goto(`/components/${id}`);
    const element = page.locator(selector).first();
    const style = await element.evaluate((node) => ({
      font: Number.parseFloat(getComputedStyle(node).fontSize),
      line: Number.parseFloat(getComputedStyle(node).lineHeight),
    }));
    expect(Math.abs(style.font - font), selector).toBeLessThan(0.05);
    expect(Math.abs(style.line - line), selector).toBeLessThan(0.05);
  }
  await page.goto("/components/icon");
  const button = page.locator('[data-example="hono"] .rx-button').first();
  const dimensions = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      // 上と同じく、clampの丸めによる0.05px未満の差は同じ大きさとして扱う。
      font: Math.round(Number.parseFloat(style.fontSize) * 10) / 10,
      line: Math.round(Number.parseFloat(style.lineHeight) * 10) / 10,
      block: Math.round(element.getBoundingClientRect().height),
      paddingStart: style.paddingBlockStart,
      paddingEnd: style.paddingBlockEnd,
    };
  });
  // 控えめなButtonはBC2の実測どおり12pxの文字で高さ22px。
  expect(dimensions).toEqual({
    font: 12,
    line: 17,
    block: 22,
    paddingStart: "0px",
    paddingEnd: "0px",
  });
});

test("RTLと動きを減らす設定でも配置と操作の意味を保つ", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  for (const id of ["loading", "icon"]) {
    await page.goto(`/components/${id}`);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      id,
    ).toBe(true);
  }
  await page.goto("/components/loading");
  const loading = page.locator('[data-example="hono"] .rx-loading > .indicator').first();
  expect(await loading.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  await page.goto("/components/icon");
  const button = page.locator('[data-example="hono"] .rx-button:not(:disabled)').first();
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
});

test("動作コンポーネントのフォーカスがforced-colorsでも見える", async ({ page }, testInfo) => {
  await testInfo.attach("browser-version", {
    body: page.context().browser()?.version() ?? "不明",
    contentType: "text/plain",
  });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  for (const { path, selector } of [
    { path: "button", selector: ".rx-button" },
    { path: "field", selector: ".rx-input" },
    { path: "tabs", selector: '[role="tab"]' },
    { path: "dropdown-menu", selector: ".rx-button" },
    { path: "disclosure", selector: "summary" },
  ]) {
    await page.goto(`/components/${path}`);
    const control = page.locator('[data-example="hono"]').locator(selector).first();
    await control.focus();
    await expect(control).toBeFocused();
    const style = await control.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { outline: computed.outlineStyle, width: Number.parseFloat(computed.outlineWidth) };
    });
    expect(style.outline).not.toBe("none");
    expect(style.width).toBeGreaterThanOrEqual(2);
  }
});
