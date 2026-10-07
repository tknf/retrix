import { expect, test } from "@playwright/test";

for (const width of [375, 1280])
  test(`ContextBarの全例が${width}pxと文字200%で操作と現在地を収める`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/components/context-bar");
    await page.getByText("右から左へ書く言語", { exact: true }).click();
    const examples = page.locator('[data-example="hono"]');
    const bars = examples.locator(".rx-context-bar");
    await expect(bars).toHaveCount(11);
    for (const zoom of ["100%", "200%"]) {
      await page.evaluate((value) => {
        document.documentElement.style.fontSize = value;
      }, zoom);
      const geometries = await bars.evaluateAll((elements) =>
        elements.map((element) => {
          const outer = element.getBoundingClientRect();
          const crumb = element.querySelector(".rx-breadcrumb")?.getBoundingClientRect();
          const actions = element.querySelector(".actions")?.getBoundingClientRect();
          return {
            visible: outer.width > 0 && outer.height > 0,
            current: element.querySelectorAll('[aria-current="page"]').length,
            overflow: element.scrollWidth > element.clientWidth + 1,
            outside: actions
              ? actions.left < outer.left - 1 || actions.right > outer.right + 1
              : false,
            overlap:
              crumb && actions
                ? Math.min(crumb.right, actions.right) - Math.max(crumb.left, actions.left) > 1 &&
                  Math.min(crumb.bottom, actions.bottom) - Math.max(crumb.top, actions.top) > 1
                : false,
          };
        }),
      );
      for (const geometry of geometries)
        expect(geometry).toEqual({
          visible: true,
          current: 1,
          overflow: false,
          outside: false,
          overlap: false,
        });
      expect(
        await page
          .locator('[data-example="hono"]')
          .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);
    }
  });

test("ContextBarからDialogと接続したDropdownを開いて起点へ戻れる", async ({ page }) => {
  await page.goto("/components/context-bar");
  const preview = page.getByRole("button", { name: "プレビュー", exact: true });
  const bar = page
    .getByRole("region", { name: "補助操作と主要操作", exact: true })
    .locator(".rx-context-bar");
  const before = await bar.boundingBox();
  await preview.click();
  await expect(page.getByRole("dialog", { name: "仕事場の案内", exact: true })).toBeVisible();
  expect(await bar.boundingBox()).toEqual(before);
  await page.keyboard.press("Escape");
  await expect(preview).toBeFocused();
  const trigger = page.getByRole("button", { name: "関連する作業を選ぶ", exact: true });
  await trigger.click();
  await expect(page.getByRole("menuitem", { name: "使う資料を探す", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("button", { name: "保存中…", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "共有設定", exact: true })).toBeDisabled();
});

test("ContextBarの外部フォーム操作はresetと入力検証とGET送信を保つ", async ({ page }) => {
  await page.goto("/components/context-bar");
  const input = page.getByRole("searchbox", { name: "キーワード", exact: true });
  await input.fill("別の条件");
  await page.getByRole("button", { name: "元に戻す", exact: true }).click();
  await expect(input).toHaveValue("暮らし");
  await input.fill("");
  await page.getByRole("button", { name: "検索する", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/context-bar$/);
  await expect(input).toBeFocused();
  await input.fill("暮らし");
  // 画面の移り先はアプリが決めるので、送る方法と値だけを確かめる。
  expect(
    await input.evaluate((element) => {
      if (!(element instanceof HTMLInputElement) || !element.form) return null;
      return { method: element.form.method, q: new FormData(element.form).get("q") };
    }),
  ).toEqual({ method: "get", q: "暮らし" });
});

test("NavigationとCommandMenuの行は通常時と選択時に同じ角丸を使う", async ({ page }) => {
  await page.goto("/components/navigation");
  const navigation = page.locator('[data-example="hono"] .rx-navigation > a').first();
  const radius = await navigation.evaluate((element) => getComputedStyle(element).borderRadius);
  await navigation.hover();
  expect(await navigation.evaluate((element) => getComputedStyle(element).borderRadius)).toBe(
    radius,
  );
  await page.goto("/components/command-menu");
  await page.locator('[data-example="hono"] .rx-command-menu > button').click();
  const entries = page.locator('[data-example="hono"] .results .entry > :is(.link, .command)');
  expect(await entries.count()).toBeGreaterThan(1);
  for (const entry of await entries.all()) await expect(entry).toHaveCSS("border-radius", radius);
  await entries.first().hover();
  await expect(entries.first()).toHaveCSS("border-radius", radius);
  await page.getByRole("combobox").press("ArrowDown");
  const active = page.locator(
    '[data-example="hono"] .entry[data-active="true"] > :is(.link, .command)',
  );
  await expect(active).toHaveCount(1);
  await expect(active).toHaveCSS("border-radius", radius);
});
