import { expect, test } from "@playwright/test";

test("検索中も主要なリンクを保ち、候補の選択とフォーカスを同期する", async ({ page }) => {
  await page.goto("/components/command-menu");
  const root = page.locator('[data-example="hono"] .rx-command-menu');
  const trigger = root.getByRole("button", { name: "Retrixの道具箱", exact: true });
  await trigger.click();
  const panel = root.getByRole("dialog");
  const search = panel.getByRole("combobox");
  await expect(search).toBeFocused();
  await expect(panel.getByRole("link", { name: /CommandMenu/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await search.fill("日付");
  await expect(
    panel.getByRole("navigation", { name: "よく使う場所" }).getByRole("link"),
  ).toHaveCount(4);
  await expect(panel.getByRole("treeitem")).toHaveCount(1);
  await expect(search).toHaveAttribute("aria-activedescendant", "command-example-entry-0-2");
  await search.fill("存在しない場所");
  await expect(panel.getByRole("status")).toHaveText("0件の候補");
  await expect(
    panel.getByText("見つかりませんでした。別の言葉で探してみてください。"),
  ).toBeVisible();
  await expect(search).not.toHaveAttribute("aria-activedescendant");
  await search.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(search).toHaveValue("");
  await search.press("ArrowDown");
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute("aria-activedescendant", "command-example-entry-0-1");
  // 移り先は利用するアプリが決めるので、画面は移さず、Enterで開くリンクを確かめる。
  await page.evaluate(() =>
    document.addEventListener("click", (event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      event.preventDefault();
      document.documentElement.dataset.followed = link.getAttribute("href") ?? "";
    }),
  );
  await search.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-followed", /\/components\/table$/);
});

test("操作の値を通知し、Esc・外側クリック・Tabで閉じる", async ({ page }) => {
  await page.goto("/components/command-menu");
  const root = page.locator('[data-example="hono"] .rx-command-menu');
  await root.evaluate((element) =>
    element.addEventListener("command-menu:select", (event) => {
      if (
        event instanceof CustomEvent &&
        typeof event.detail === "object" &&
        event.detail !== null &&
        "value" in event.detail
      )
        element.setAttribute("data-selected-command", String(event.detail.value));
    }),
  );
  const trigger = root.getByRole("button", { name: "Retrixの道具箱", exact: true });
  await trigger.click();
  const panel = root.getByRole("dialog");
  await panel.getByRole("button", { name: "操作イベントを試す" }).click();
  await expect(root).toHaveAttribute("data-selected-command", "example");
  await expect(page.locator('[data-example="hono"] output')).toHaveText("選択した操作：example");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(2, 2);
  await expect(panel).not.toBeVisible();
  await trigger.click();
  await panel.getByRole("button", { name: "コマンドを閉じる" }).click();
  await expect(panel).not.toBeVisible();
  await trigger.click();
  await panel.getByRole("button", { name: "操作イベントを試す" }).focus();
  await page.keyboard.press("Tab");
  await expect(panel).not.toBeVisible();
});

test("CtrlまたはCmdとKで開閉し、パネルは480pxで背景を暗転しない", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/command-menu");
  await page.keyboard.press("Control+k");
  const panel = page.getByRole("dialog");
  await expect(panel).toBeVisible();
  // 拡大しながら現れる動きの途中で測らないよう、動きの終わりを待つ。
  await panel.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const geometry = await panel.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      center: rect.x + rect.width / 2,
      backdrop: getComputedStyle(element, "::backdrop").backgroundColor,
    };
  });
  expect(geometry).toEqual({ width: 480, center: 640, backdrop: "rgba(0, 0, 0, 0)" });
  const search = panel.getByRole("combobox");
  await search.press("Shift+J");
  await expect(panel).toBeVisible();
  await expect(search).toHaveValue("J");
  await search.press("Control+k");
  await expect(panel).not.toBeVisible();
  await page.keyboard.press("Meta+k");
  await expect(panel).toBeVisible();
  await expect(search).toBeFocused();
  await page.setViewportSize({ width: 375, height: 667 });
  expect(
    await panel.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return (
        box.x >= 0 &&
        box.right <= innerWidth &&
        box.bottom <= innerHeight &&
        element.scrollWidth <= element.clientWidth + 1
      );
    }),
  ).toBe(true);
});

test("Tabで候補へ移った後も矢印・Home・End・Enterで操作できる", async ({ page }) => {
  await page.goto("/components/command-menu");
  await page.keyboard.press("Control+k");
  const panel = page.getByRole("dialog");
  const search = panel.getByRole("combobox");
  await search.press("Tab");
  await expect(panel.getByRole("link", { name: /Card/ })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(panel.getByRole("link", { name: /Table/ })).toBeFocused();
  await expect(search).toHaveAttribute("aria-activedescendant", "command-example-entry-0-1");
  await page.keyboard.press("End");
  await expect(panel.getByRole("button", { name: "操作イベントを試す" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(panel.getByRole("link", { name: /Card/ })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(panel.getByRole("link", { name: /CommandMenu/ })).toBeFocused();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  // 移り先は利用するアプリが決めるので、画面は移さず、Enterで開くリンクを確かめる。
  await page.evaluate(() =>
    document.addEventListener("click", (event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      event.preventDefault();
      document.documentElement.dataset.followed = link.getAttribute("href") ?? "";
    }),
  );
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-followed", /\/components\/table$/);
});

test("ShiftとJの任意設定は入力や日本語変換を奪わない", async ({ page }) => {
  await page.goto("/components/command-menu");
  const root = page.locator('[data-example="hono"] .rx-command-menu');
  await root.evaluate((element) => element.setAttribute("data-command-menu-shortcut", "shift+j"));
  await page.keyboard.press("Shift+J");
  const search = page.getByRole("combobox");
  await expect(search).toBeFocused();
  await search.press("Shift+J");
  await expect(search).toHaveValue("J");
  await search.fill("日付");
  const selected = await search.getAttribute("aria-activedescendant");
  await search.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  await search.dispatchEvent("keydown", { key: "Escape", isComposing: true });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(search).toHaveAttribute("aria-activedescendant", selected ?? "");
  await search.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
