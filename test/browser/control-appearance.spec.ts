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

test("主操作の色を変えてもhover・押下が既定の色へ戻らず、文字の位置を保つ", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/components/button");
  await page.evaluate(() => document.documentElement.style.setProperty("--rx-green", "#146f53"));
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
  // ホバーと押下は、変えた緑を少し濃くするだけで、既定の色へは戻らない。
  expect(normal).toEqual([0x14, 0x6f, 0x53]);
  expect(hover).not.toEqual(normal);
});

test("選択中のButtonを無効にした場合は、選んだ状態の塗りを残して文字だけを灰色にする", async ({
  page,
}) => {
  await page.goto("/components/button");
  const button = page.locator('[data-example="hono"] button[data-variant="primary"]').first();
  await button.evaluate((element) => {
    element.setAttribute("data-current", "true");
    element.setAttribute("disabled", "");
  });
  // 使えない操作は、Highriseの「First」と同じく形と塗りをそのままにし、文字だけを灰色にする。
  // 選んでいる状態の塗りは淡い青（選ぶ操作の共通の見た目）なので、白い面に戻さずそのまま残す。
  await expect
    .poll(() => button.evaluate((element) => getComputedStyle(element).color))
    .toBe("rgb(154, 154, 154)");
  expect(await button.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
    "linear-gradient",
  );
  await expect(button).toHaveCSS("border-inline-start-color", "rgb(94, 100, 179)");
  await expect(button).toBeDisabled();
});
