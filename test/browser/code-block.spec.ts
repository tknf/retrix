import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, browserName }) => {
  if (browserName === "chromium")
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
});

test("表示したコードを実際にコピーし、成功を通知する", async ({ page, browserName }) => {
  await page.goto("/components/code-block");
  const example = page.locator('[data-example="hono"] .rx-code-block').first();
  const source = await example.locator("code").textContent();
  await example.evaluate((element) =>
    element.addEventListener("clipboard:copy", (event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (
        detail &&
        typeof detail === "object" &&
        "text" in detail &&
        typeof detail.text === "string"
      )
        element.setAttribute("data-copied", detail.text);
    }),
  );
  await example.getByRole("button", { name: "CSSの読み込みをコピー" }).press("Enter");
  await expect(example.getByRole("status")).toHaveText("CSSの読み込みをコピーしました");
  await expect(example).toHaveAttribute("data-copied", source ?? "");
  if (browserName === "chromium")
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
});

for (const width of [375, 1280])
  test(`コピー通知が${width}pxと文字200%でコードや操作を動かさない`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install();
    await page.goto("/components/code-block");
    const example = page.locator('[data-example="hono"] .rx-code-block').first();
    const button = example.getByRole("button", { name: "CSSの読み込みをコピー" });
    const toast = example.locator(':scope > .rx-toast[data-tone="success"]');
    const failure = example.locator(':scope > .rx-toast[data-tone="danger"]');
    const bounds = () =>
      example.evaluate((element) =>
        [
          element,
          ...element.querySelectorAll(
            ".rx-layer-card > .heading,pre,[data-code-block-target=copy]",
          ),
        ].map((node) => {
          const rect = node.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        }),
      );
    for (const zoom of ["100%", "200%"]) {
      await page.evaluate((value) => {
        document.documentElement.style.fontSize = value;
      }, zoom);
      await button.scrollIntoViewIfNeeded();
      const before = await bounds();
      await button.press("Enter");
      await expect(toast).toBeVisible();
      await expect(button).toBeFocused();
      expect(await bounds()).toEqual(before);
      // 下から現れる動きの途中は画面の下端より下にあるので、動きの終わりを待ってから測る。
      await toast.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      expect(
        await toast.evaluate((element) => {
          const box = element.getBoundingClientRect();
          return box.x >= 0 && box.right <= innerWidth && box.bottom <= innerHeight;
        }),
      ).toBe(true);
      await button.press("Enter");
      // Toastのルートそのものがstatusなので、見本の中のstatusで確かめる。
      await expect(example.getByRole("status")).toHaveText("CSSの読み込みをコピーしました");
      expect(await bounds()).toEqual(before);
      await toast.hover();
      await page.clock.fastForward(5000);
      await expect(toast).toBeVisible();
      await page.mouse.move(0, 0);
      await page.clock.fastForward(4001);
      await expect(toast).not.toBeVisible();
      expect(await bounds()).toEqual(before);
    }
    await page.evaluate(() =>
      Object.defineProperty(navigator.clipboard, "writeText", {
        value: () => Promise.reject(new DOMException("拒否", "NotAllowedError")),
      }),
    );
    const before = await bounds();
    await button.press("Enter");
    await expect(example.getByRole("alert")).toContainText("コピーできませんでした");
    await expect(toast).not.toBeVisible();
    expect(await bounds()).toEqual(before);
    await page.clock.fastForward(8000);
    await expect(failure).toBeVisible();
    await failure.getByRole("button", { name: "コピー結果の通知を閉じる" }).press("Enter");
    await expect(failure).not.toBeVisible();
    await expect(button).toBeFocused();
    expect(await bounds()).toEqual(before);
  });

test("別のコードを続けてコピーしても通知が重ならずEscで閉じられる", async ({ page }) => {
  await page.goto("/components/code-block");
  const examples = page.locator('[data-example="hono"] .rx-code-block');
  await examples.first().getByRole("button", { name: "CSSの読み込みをコピー" }).press("Enter");
  await expect(examples.first().locator('.rx-toast[data-tone="success"]')).toBeVisible();
  const second = examples.nth(1).getByRole("button", { name: "公開設定の例をコピー" });
  await second.press("Enter");
  await expect(page.locator(".rx-code-block > .rx-toast:popover-open")).toHaveCount(1);
  await expect(examples.nth(1).getByRole("status")).toHaveText("公開設定の例をコピーしました");
  await second.press("Escape");
  await expect(page.locator(".rx-code-block > .rx-toast:popover-open")).toHaveCount(0);
  await expect(second).toBeFocused();
});

test("コピーが拒否されたら失敗を伝え、文字の選択とスクロールを残す", async ({ page }) => {
  await page.goto("/components/code-block");
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new DOMException("拒否", "NotAllowedError")),
    }),
  );
  const example = page.locator('[data-example="hono"] .rx-code-block').nth(1);
  await example.getByRole("button", { name: "公開設定の例をコピー" }).click();
  // 失敗は成功と別の通知で、危険の色とrole="alert"ですぐに伝える。
  const failure = example.locator(":scope > .rx-toast:popover-open");
  await expect(failure).toHaveCount(1);
  await expect(failure).toHaveAttribute("data-tone", "danger");
  await expect(failure).toHaveAttribute("aria-live", "assertive");
  await expect(example.getByRole("alert")).toHaveText(
    "コピーできませんでした。コードを選択してコピーしてください。",
  );
  await expect(example.getByRole("status")).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 900 });
  const pre = example.getByRole("region");
  await pre.focus();
  await expect(pre).toBeFocused();
  await page.keyboard.press("ArrowRight", { delay: 100 });
  await expect.poll(() => pre.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(
    await page
      .locator('[data-example="hono"]')
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
});

test("JavaScriptがなくてもコードを読め、動かないコピー操作を出さない", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5178/components/code-block");
  const examples = page.locator('[data-example="hono"]');
  await expect(examples.locator("code").first()).toContainText("<link");
  await expect(examples.getByRole("button")).toHaveCount(0);
  await context.close();
});

test("CodeBlockのカードは余白を持たず、コードの面が余白を持つ", async ({ page }) => {
  await page.goto("/components/code-block");
  const example = page.locator('[data-example="hono"] .rx-code-block').first();
  const padding = await example.evaluate((element) => {
    const body = element.querySelector(":scope > .rx-layer-card > .body"),
      pre = body?.querySelector(":scope > pre");
    if (!body || !pre) throw new Error("カードかコードがありません");
    const paper = getComputedStyle(body),
      code = getComputedStyle(pre);
    return {
      paper: [paper.paddingTop, paper.paddingLeft, paper.paddingRight, paper.paddingBottom],
      code: Number.parseFloat(code.paddingLeft),
    };
  });
  expect(padding.paper).toEqual(["0px", "0px", "0px", "0px"]);
  expect(padding.code).toBeGreaterThan(0);
});
