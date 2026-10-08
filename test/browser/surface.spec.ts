import { expect, test, type Page } from "@playwright/test";

const mountSurface = async (page: Page, layout: "standard" | "document" = "standard") => {
  await page.goto("/components/surface");
  await page.evaluate((value) => {
    const surface = document.querySelector('[data-example="hono"] .rx-surface');
    if (!(surface instanceof HTMLElement)) throw new Error("Surfaceの見本がありません");
    surface.dataset.layout = value;
    document.body.replaceChildren(surface);
  }, layout);
  await page.evaluate(() => document.fonts.ready);
};

for (const layout of ["standard", "document"] as const) {
  for (const width of [375, 1280]) {
    test(`Surfaceの${layout}は${width}px幅で短い内容を画面下端まで伸ばす`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await mountSurface(page, layout);
      const surface = page.locator(".rx-surface");
      const top = await page
        .getByRole("heading", { name: "記事", exact: true })
        .evaluate((heading) => heading.getBoundingClientRect().top);
      expect(await surface.evaluate((node) => node.getBoundingClientRect().bottom)).toBeCloseTo(
        800,
        0,
      );
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(800);
      await page.setViewportSize({ width, height: 1000 });
      expect(await surface.evaluate((node) => node.getBoundingClientRect().bottom)).toBeCloseTo(
        1000,
        0,
      );
      expect(
        await page
          .getByRole("heading", { name: "記事", exact: true })
          .evaluate((heading) => heading.getBoundingClientRect().top),
      ).toBe(top);
    });
  }
}

test("Surfaceの長い本文は作業面を伸ばし、末尾までページをスクロールできる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 640 });
  await mountSurface(page);
  await page.locator(".rx-surface > .body").evaluate((body) => {
    for (let index = 0; index < 40; index += 1) {
      const paragraph = document.createElement("p");
      paragraph.textContent = `資料の本文${index + 1}。作業面の高さを固定せず、最後まで読みます。`;
      body.append(paragraph);
    }
  });
  const surface = page.locator(".rx-surface");
  expect(await surface.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(
    640,
  );
  const last = surface.locator(".body > p").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
  expect(
    await surface.evaluate((node) => node.scrollHeight - node.clientHeight),
  ).toBeLessThanOrEqual(1);
});
