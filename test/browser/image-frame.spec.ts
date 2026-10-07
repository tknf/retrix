import { expect, test } from "@playwright/test";

test("画像の内在サイズにかかわらず指定比率を守る", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/image-frame");
  for (const shape of ["portrait", "square", "landscape"] as const) {
    const expected = { portrait: 5 / 7, square: 1, landscape: 16 / 9 }[shape];
    const frames = page.locator(
      `[data-example="hono"] .rx-image-frame[data-shape="${shape}"] > .image`,
    );
    for (const frame of await frames.all()) {
      const ratio = await frame.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width / rect.height;
      });
      expect(ratio).toBeCloseTo(expected, 2);
    }
  }
});
