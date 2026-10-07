import { expect, test, type Page } from "@playwright/test";

/** Toastに届いたtoast:*のイベントを、名前とreasonの組で記録する。 */
const recordEvents = (page: Page, id: string) =>
  page.evaluate((id) => {
    const toast = document.getElementById(id);
    const events: string[] = [];
    Reflect.set(window, "toastEvents", events);
    for (const name of ["beforeshow", "show", "beforehide", "hide"])
      toast?.addEventListener(`toast:${name}`, (event) => {
        const reason = event instanceof CustomEvent ? String(event.detail?.reason) : "";
        events.push(`${name}:${reason}`);
      });
  }, id);
const recordedEvents = (page: Page) =>
  page.evaluate(() => {
    const events = Reflect.get(window, "toastEvents");
    return Array.isArray(events) ? events.map(String) : [];
  });

test("popovertargetのボタンと閉じるボタンで開閉すると、Dialogと同じく開閉のイベントを発火する", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await recordEvents(page, "hono-toast-short");
  const toast = page.locator("#hono-toast-short");
  const open = page.getByRole("button", { name: "短い通知", exact: true });
  await open.click();
  await expect(toast).toBeVisible();
  await toast.getByRole("button", { name: "閉じる", exact: true }).click();
  await expect(toast).not.toBeVisible();
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(toast).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(toast).not.toBeVisible();
  expect(await recordedEvents(page)).toEqual([
    "beforeshow:pointer",
    "show:pointer",
    "beforehide:pointer",
    "hide:pointer",
    "beforeshow:keyboard",
    "show:keyboard",
    "beforehide:keyboard",
    "hide:keyboard",
  ]);
});

test("toast:beforeshow・toast:beforehideを取り消すと、標準の開閉も起きない", async ({ page }) => {
  await page.goto("/components/toast");
  const toast = page.locator("#hono-toast-short");
  await page.evaluate(() => {
    document
      .getElementById("hono-toast-short")
      ?.addEventListener("toast:beforeshow", (event) => event.preventDefault(), { once: true });
  });
  const open = page.getByRole("button", { name: "短い通知", exact: true });
  await open.click();
  await expect(toast).not.toBeVisible();
  await open.click();
  await expect(toast).toBeVisible();
  await page.evaluate(() => {
    document
      .getElementById("hono-toast-short")
      ?.addEventListener("toast:beforehide", (event) => event.preventDefault(), { once: true });
  });
  const close = toast.getByRole("button", { name: "閉じる", exact: true });
  await close.click();
  await expect(toast).toBeVisible();
  await close.click();
  await expect(toast).not.toBeVisible();
});

test("スクリプトとdurationで開閉した時はtoast:*を出さず、標準のtoggleで受け取れる", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await recordEvents(page, "hono-toast-timed");
  await page.evaluate(() => {
    const toast = document.getElementById("hono-toast-timed");
    const states: string[] = [];
    Reflect.set(window, "toastToggles", states);
    toast?.addEventListener("toggle", (event) => {
      if (event instanceof ToggleEvent) states.push(event.newState);
    });
    toast?.showPopover();
  });
  const toast = page.locator("#hono-toast-timed");
  await expect(toast).toBeVisible();
  await expect(toast).not.toBeVisible({ timeout: 8000 });
  expect(await recordedEvents(page)).toEqual([]);
  expect(
    await page.evaluate(() => {
      const states = Reflect.get(window, "toastToggles");
      return Array.isArray(states) ? states.map(String) : [];
    }),
  ).toEqual(["open", "closed"]);
});

test("JavaScriptがなくても、popovertargetのボタンで開き閉じるボタンで閉じる", async ({
  browser,
}) => {
  // JavaScriptを切ると、出る動きの途中に押した時にPlaywrightが止まるのを待ち続けるので、動きを止めて確かめる。
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/toast");
    const toast = page.locator("#hono-toast-short");
    await page.getByRole("button", { name: "短い通知", exact: true }).click();
    await expect(toast).toBeVisible();
    await toast.getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(toast).not.toBeVisible();
  } finally {
    await context.close();
  }
});

test("長い通知と操作が狭幅に収まる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/toast");
  const sample = page.locator('[data-example="hono"]');
  await sample.getByRole("button", { name: "結果表示を試す", exact: true }).click();
  const toast = sample.locator(".rx-toast").first();
  await expect(toast).toBeVisible();
  // 閉じる操作は角からはみ出させるため、見出し・本文・操作の行がそれぞれ幅に収まるかを測る。
  expect(
    await toast.evaluate((element) =>
      Array.from(element.querySelectorAll(":scope > *")).every(
        (part) => part.scrollWidth <= part.clientWidth + 1,
      ),
    ),
  ).toBe(true);
  const closeBox = await toast.getByRole("button", { name: "閉じる", exact: true }).boundingBox();
  if (!closeBox) throw new Error("閉じる操作がありません");
  expect(closeBox.x + closeBox.width).toBeLessThanOrEqual(375);
});

test("Toastの閉じる操作はパネルの右上の角からはみ出し、本文と操作行へ混ざらない", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("/components/toast");
  await page.getByRole("button", { name: "結果表示を試す", exact: true }).click();
  const toast = page.locator(".rx-toast").first();
  // 下から現れる動きの途中で二つを順に測ると位置がずれるため、動きの終わりを待つ。
  await toast.evaluate((element) =>
    Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  );
  const close = await toast.getByRole("button", { name: "閉じる", exact: true }).boundingBox();
  const message = await toast.locator(".message").boundingBox();
  const paper = await toast.boundingBox();
  const actions = await toast.locator(".actions").boundingBox();
  if (!close || !message || !paper || !actions) throw new Error("通知がありません");
  expect(close.x).toBeGreaterThanOrEqual(message.x + message.width);
  expect(close.y).toBeLessThan(paper.y);
  expect(close.x + close.width).toBeGreaterThan(paper.x + paper.width);
  expect(close.y + close.height).toBeLessThan(actions.y);
});
