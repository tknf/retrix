import { expect, test, type Page } from "@playwright/test";

const mountShell = async (page: Page, selector = ".rx-app-shell", footer = false) => {
  await page.goto("/components/app-shell");
  await page
    .locator(`[data-example="hono"] ${selector}`)
    .first()
    .evaluate((shell, keepFooter) => {
      if (!keepFooter) shell.querySelector(":scope > .body > .main > .footer")?.remove();
      document.body.replaceChildren(shell);
    }, footer);
  await page.evaluate(() => document.fonts.ready);
};

const cases = [
  { name: "通常の画面", selector: ".rx-app-shell" },
  { name: "背後のシート", selector: ".rx-app-shell:has(> .body > .main > .trail)" },
  { name: "先頭側の列", selector: '.rx-app-shell:has(> .body[data-aside="true"])' },
  { name: "補助パネル", selector: ".rx-app-shell:has(> .body > .main > .rx-wing)" },
];

for (const { name, selector } of cases) {
  for (const width of [375, 1280]) {
    test(`AppShellの${name}は${width}px幅で作業面を残りの高さまで伸ばす`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await mountShell(page, selector);
      const workspace = page.locator(".workspace");
      // 狭い配置の補助パネルは作業面の下に並ぶため、最後のパネルまでの高さも確保する。
      const last =
        name === "補助パネル" && width === 375
          ? page.locator(".rx-wing > .layout > .end")
          : workspace;
      const height = await workspace.evaluate((node) => node.getBoundingClientRect().height);
      expect(await last.evaluate((node) => node.getBoundingClientRect().bottom)).toBeCloseTo(
        1000,
        0,
      );
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(1000);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(1);
      const title = page.getByRole("heading", { level: 1 });
      const top = await title.evaluate((node) => node.getBoundingClientRect().top);
      await page.setViewportSize({ width, height: 1200 });
      expect(await last.evaluate((node) => node.getBoundingClientRect().bottom)).toBeCloseTo(
        1200,
        0,
      );
      expect(await workspace.evaluate((node) => node.getBoundingClientRect().height)).toBeCloseTo(
        height + 200,
        0,
      );
      expect(await title.evaluate((node) => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
      if (name === "背後のシート") {
        expect(
          await page.locator(".trail li").evaluate((node) => node.getBoundingClientRect().bottom),
        ).toBeCloseTo(1200, 0);
      }
    });
  }
}

test("AppShellはフッターの領域を保ち、長い本文でも最後までスクロールできる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await mountShell(page, ".rx-app-shell", true);
  const workspace = page.locator(".workspace");
  const footer = page.locator("footer.footer");
  const bottom = await workspace.evaluate((node) => node.getBoundingClientRect().bottom);
  const footerTop = await footer.evaluate((node) => node.getBoundingClientRect().top);
  expect(footerTop).toBeGreaterThanOrEqual(bottom);
  await expect(footer).toBeInViewport();
  await workspace.evaluate((node) => {
    for (let index = 0; index < 40; index += 1) {
      const paragraph = document.createElement("p");
      paragraph.textContent = `作業の記録${index + 1}。長い内容はページをスクロールして読みます。`;
      node.append(paragraph);
    }
  });
  expect(await workspace.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(
    1000,
  );
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();
  expect(
    await workspace.evaluate((node) => node.scrollHeight - node.clientHeight),
  ).toBeLessThanOrEqual(1);
});
