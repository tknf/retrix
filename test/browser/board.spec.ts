import { expect, test } from "@playwright/test";

const openCollapsedExample = async (page: import("@playwright/test").Page) => {
  await page
    .getByText("たたんだ列：件数と縦書きの名前のピル、押すと開いてたためる", { exact: true })
    .click();
  return page.getByRole("region", { name: "採用の進行" });
};

test("Boardは任意の内容を保って列間移動しEscapeと取消イベントで戻せる", async ({ page }) => {
  await page.goto("/components/board");
  const board = page.getByRole("region", { name: "制作の進行", exact: true });
  const item = board.locator('[data-board-id="estimate"]');
  const check = item.getByRole("checkbox", { name: "見積金額を確認", exact: true });
  await check.check();
  const handle = item.getByRole("button");
  await handle.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(board.locator('[data-column-id="doing"] [data-board-id="estimate"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(board.locator('[data-column-id="todo"] [data-board-id="estimate"]')).toBeVisible();
  await expect(check).toBeChecked();
  await board.evaluate((element) =>
    element.addEventListener("board:beforemove", (event) => event.preventDefault(), { once: true }),
  );
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(board.locator('[data-column-id="todo"] [data-board-id="estimate"]')).toBeVisible();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(board.locator('[data-column-id="doing"] [data-board-id="estimate"]')).toBeVisible();
  await expect(check).toBeChecked();
});

test("Boardはポインターで空の列へドロップできる", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/board");
  const board = page.getByRole("region", { name: "制作の進行", exact: true });
  const item = board.locator('[data-board-id="guide"]');
  const source = await item.getByRole("button").boundingBox();
  const column = board.locator('[data-column-id="done"]');
  const target = await column.boundingBox();
  if (!source || !target) throw new Error("移動対象がありません");
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x + target.width / 2, target.y + 70, { steps: 12 });
  await expect(page.locator("html")).toHaveAttribute("data-rx-board-dragging", "true");
  await expect(item.getByRole("button")).toHaveCSS("cursor", "grabbing");
  // ドラッグ中は項目を元の列に残し、移動先の列には挿入位置の線だけを出す。
  await expect(board.locator('[data-column-id="todo"] [data-board-id="guide"]')).toBeVisible();
  await expect(column.locator(".drop-marker")).toBeVisible();
  await expect(column.locator(".title > small")).toHaveText("0");
  await page.mouse.up();
  await expect(column.locator('[data-board-id="guide"]')).toBeVisible();
  await expect(board.locator(".drop-marker")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-rx-board-dragging");
  await expect(item).not.toHaveAttribute("data-moving", "true");
  await expect(item.getByRole("button")).toHaveCSS("cursor", "grab");
  await expect(column.locator(".title > small")).toHaveText("1");
  await expect(board.locator(".drag-preview")).toHaveCount(0);
});

test("Boardは移動した項目を置いた列の色に染め、たたんだ列はピルの幅になる", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/board");
  await page
    .locator('[data-example="hono"] details')
    .evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
  const approval = page.getByRole("region", { name: "原稿の承認", exact: true });
  // 列の色はカードの地ではなく、斜めの色付け（背景の画像）に出る。
  const fill = (id: string) =>
    approval
      .locator(`[data-board-id="${id}"]`)
      .evaluate((element) => getComputedStyle(element).backgroundImage);
  const approved = await fill("d3");
  expect(await fill("d1")).not.toBe(approved);
  await approval.locator('[data-board-id="d1"]').getByRole("button").focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(approval.locator('[data-column-id="approved"] [data-board-id="d1"]')).toBeVisible();
  await expect.poll(() => fill("d1")).toBe(approved);

  const hiring = page.getByRole("region", { name: "採用の進行", exact: true });
  const widths = await hiring
    .locator(":scope > section")
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
  expect(widths[0]).toBeLessThan(64);
  expect(widths[1]).toBeGreaterThan(200);
  await expect(hiring.locator('[data-column-id="closed"] .title > small')).toHaveText("3");
  await expect(hiring.locator('[data-column-id="closed"] .items')).toBeHidden();
});

test("Boardのたたんだ列は押すと開き、たためて、取り消せるboard:toggleを発火する", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/board");
  await page
    .locator('[data-example="hono"] details')
    .evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
  const hiring = page.getByRole("region", { name: "採用の進行", exact: true });
  const backlog = hiring.locator('[data-column-id="backlog"]');
  const toggle = backlog.getByRole("button", { name: "「応募」の列を開閉", exact: true });
  await page.evaluate(() => {
    const events: unknown[] = [];
    Object.assign(window, { boardToggles: events });
    document.addEventListener("board:toggle", (event) => {
      if (event instanceof CustomEvent) events.push(event.detail);
    });
  });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(backlog).not.toHaveAttribute("data-collapsed", "true");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(backlog.locator(".items")).toBeVisible();
  expect(
    await backlog.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(200);
  await toggle.click();
  await expect(backlog).toHaveAttribute("data-collapsed", "true");
  await expect(backlog.locator(".items")).toBeHidden();
  expect(await page.evaluate(() => Reflect.get(window, "boardToggles"))).toEqual([
    { column: "backlog", collapsed: false },
    { column: "backlog", collapsed: true },
  ]);
  // 利用アプリが取り消した時は、表示を変えない。
  await page.evaluate(() =>
    document.addEventListener("board:toggle", (event) => event.preventDefault(), { once: true }),
  );
  await toggle.click();
  await expect(backlog).toHaveAttribute("data-collapsed", "true");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  // たたんだピルは、名前など「開く」以外の場所を押しても開く。
  await backlog.locator(".title > .label").click();
  await expect(backlog).not.toHaveAttribute("data-collapsed", "true");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("Boardは広い画面内でもコンポーネント幅に応じて横スクロールから縦並びへ変わる", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/board");
  const board = page.locator('[data-example="hono"] .rx-board').first();
  await board.evaluate((element) => {
    if (element instanceof HTMLElement) element.style.inlineSize = "640px";
  });
  await board.focus();
  await page.keyboard.press("ArrowRight", { delay: 100 });
  await expect.poll(() => board.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await board.evaluate((element) => {
    if (element instanceof HTMLElement) element.style.inlineSize = "320px";
  });
  const shelves = await board.locator(":scope > section").evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, end: box.bottom };
    }),
  );
  const first = shelves[0];
  const second = shelves[1];
  expect(first).toBeDefined();
  expect(second).toBeDefined();
  expect(second?.x).toBe(first?.x);
  expect(second?.y).toBeGreaterThanOrEqual(first?.end ?? Infinity);
  expect(await board.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
});

test("JavaScriptがない時は、押しても働かない開閉ボタンを出さない", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5178/components/board");
    const board = await openCollapsedExample(page);
    await expect(board.locator("button[data-board-toggle]")).toHaveCount(4);
    for (const toggle of await board.locator("button[data-board-toggle]").all())
      await expect(toggle).toBeHidden();
    await expect(board.getByRole("list", { name: "面接" })).toBeVisible();
  } finally {
    await context.close();
  }
});
