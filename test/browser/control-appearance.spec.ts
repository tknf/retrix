import { expect, test } from "@playwright/test";

test("選択済みCheckboxは状態だけでなく白いcheckを実際に描画する", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/table");
  const input = page.locator('[data-table-select-target="item"]').first();
  await input.check();
  const pixels = await input.screenshot();
  const white = await page.evaluate(
    async (bytes) => {
      const bitmap = await createImageBitmap(
        new Blob([new Uint8Array(bytes)], { type: "image/png" }),
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("チェックの描画を測定できません");
      context.drawImage(bitmap, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let count = 0;
      // 外枠や周囲の白を除いた内側だけを調べる。青い枠だけなら0になる。
      for (let y = 3; y < canvas.height - 3; y++)
        for (let x = 3; x < canvas.width - 3; x++) {
          const offset = (y * canvas.width + x) * 4;
          if (
            (data[offset] ?? 0) > 150 &&
            (data[offset + 1] ?? 0) > 170 &&
            (data[offset + 2] ?? 0) > 200
          )
            count++;
        }
      bitmap.close();
      return count;
    },
    [...pixels],
  );
  expect(white).toBeGreaterThanOrEqual(4);
});

test("基本色を変えてもhover・押下が既定の色へ戻らず、塗りと文字の位置を保つ", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/button");
  await page.evaluate(() => document.documentElement.style.setProperty("--rx-brand", "#146f53"));
  const button = page.locator('[data-example="hono"] button[data-variant="primary"]').first();
  const color = () =>
    button.evaluate((element) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("色を測定できません");
      context.fillStyle = getComputedStyle(element).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
    });
  await button.scrollIntoViewIfNeeded();
  const bounds = await button.boundingBox();
  const normal = await color();
  await button.hover();
  const hover = await color();
  await page.mouse.down();
  const active = await color();
  expect(await button.boundingBox()).toEqual(bounds);
  await page.mouse.up();
  for (const [red = 0, green = 0, blue = 0] of [normal, hover, active]) {
    expect(green).toBeGreaterThan(red);
    expect(green).toBeGreaterThan(blue);
  }
  // 塗りの色はホバーしても押しても変えず、影だけで応える。
  expect(hover).toEqual(normal);
  expect(active).toEqual(normal);
});

test("選択中のButtonを無効にした場合も通常の無効状態として見分けられる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/button");
  const button = page.locator('[data-example="hono"] button[data-variant="primary"]').first();
  await button.evaluate((element) => {
    element.setAttribute("data-current", "true");
    element.setAttribute("disabled", "");
  });
  const expected = await page
    .locator('[data-example="hono"]')
    .getByRole("button", { name: "変更なし", exact: true })
    .evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
      image: getComputedStyle(element).backgroundImage,
    }));
  await expect
    .poll(() =>
      button.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          color: style.color,
          image: style.backgroundImage,
          shadow: style.boxShadow,
        };
      }),
    )
    .toEqual({ ...expected, shadow: "none" });
  // 使えない操作は斜線で示す。
  expect(expected.image).toContain("repeating-linear-gradient");
  await expect(button).toBeDisabled();
});
