import { expect, test } from "@playwright/test";

test("Buttonは画面幅で文字サイズを変えず、文字拡大に寸法が追従する", async ({ page }, testInfo) => {
  const sizes: number[] = [];
  for (const width of [375, 960, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/button");
    const example = page.getByRole("region", { name: "見本" });
    const buttons = example.getByRole("button", {
      name: /^(保存する|編集する|確定する|プレビュー|削除する)$/,
    });
    const measure = () =>
      buttons.evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          return {
            font: Number.parseFloat(style.fontSize),
            height: element.getBoundingClientRect().height,
            width: element.getBoundingClientRect().width,
            iconOnly: element.getAttribute("data-icon-only") === "true",
            padding: Number.parseFloat(style.paddingInlineStart),
          };
        }),
      );
    const before = await measure();
    const normal = before[0];
    if (!normal) throw new Error("通常ボタンがありません");
    sizes.push(normal.font);
    await example.screenshot({ path: testInfo.outputPath(`button-${width}.png`) });
    await buttons.evaluateAll((elements) => {
      for (const element of elements) {
        if (element instanceof HTMLElement)
          element.style.fontSize = `${Number.parseFloat(getComputedStyle(element).fontSize) * 2}px`;
      }
    });
    const after = await measure();
    for (const [index, original] of before.entries()) {
      const enlarged = after[index];
      if (!enlarged) throw new Error("拡大後のボタンがありません");
      expect(enlarged.font / original.font).toBeCloseTo(2, 2);
      expect(enlarged.height / original.height).toBeCloseTo(2, 2);
      expect(enlarged.padding).toBeCloseTo(original.padding * 2, 1);
      if (original.iconOnly) {
        expect(original.width).toBeCloseTo(original.height, 1);
        expect(enlarged.width).toBeCloseTo(enlarged.height, 1);
      }
    }
    await expect
      .poll(() =>
        page
          .locator('[data-example="hono"]')
          .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      )
      .toBe(true);
    await example.screenshot({ path: testInfo.outputPath(`button-${width}-200.png`) });
  }
  const [small, medium, large] = sizes;
  if (small === undefined || medium === undefined || large === undefined)
    throw new Error("各幅の測定値がありません");
  // 管理画面で情報を多く並べるため、ボタンの文字は画面幅によらず13pxにする。
  expect(small).toBeCloseTo(13, 2);
  expect(medium).toBeCloseTo(13, 2);
  expect(large).toBeCloseTo(13, 2);
});

test("ボタンは置いた厚みの影を持ち、ホバーすると面が濃くなり、押すと内側へへこみ、focusで輪郭が見える", async ({
  page,
}) => {
  // 変化の途中ではなく、確定したスタイル同士を比較する。
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/button");
  const buttons = page.locator('[data-example="hono"] .rx-button:not(:disabled)');
  for (const button of await buttons.all()) {
    const look = () =>
      button.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          color: style.color,
          border: style.borderInlineStartColor,
          surface: `${style.backgroundColor} ${style.backgroundImage}`,
          shadow: style.boxShadow,
        };
      });
    await page.mouse.move(0, 0);
    const before = await look();
    const variant = await button.getAttribute("data-variant");
    await button.hover();
    const hovered = await look();
    if (variant === "link") {
      // 文字だけの操作は面と影を持たず、ホバーすると文字の色だけが変わる。
      expect(before.surface.startsWith("rgba(0, 0, 0, 0)")).toBe(true);
      expect(before.shadow).toBe("none");
      expect(hovered.surface).toBe(before.surface);
      expect(hovered.color).not.toBe(before.color);
    } else {
      // 普段から、上端の光と下へ落ちる浅い影で机に置いた厚みを見せる。
      expect(before.shadow).not.toBe("none");
      // ホバーすると面が濃くなり、文字の色は変えない。
      expect(hovered.color).toBe(before.color);
      expect(hovered.surface).not.toBe(before.surface);
      await page.mouse.down();
      const pressed = await look();
      expect(pressed.shadow.split("),")[0]).toContain("inset");
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
    await button.focus();
    await page.keyboard.press("Tab");
    await button.focus();
    await expect(button).toBeFocused();
    expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
      "solid",
    );
  }
});
