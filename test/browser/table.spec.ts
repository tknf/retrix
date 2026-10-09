import { expect, test } from "@playwright/test";

test("Tableは数値の三段階ソートと上流のShift範囲選択を使う", async ({ page }) => {
  await page.goto("/components/table");
  const table = page.getByRole("region", { name: "記事の公開状況", exact: true });
  const records = table.locator("tbody > tr");
  const original = await records.evaluateAll((rows) =>
    rows.map((row) => row.getAttribute("data-record-id")),
  );
  const sort = table.getByRole("button", { name: "閲覧", exact: true });
  await sort.click();
  await expect(table.locator('[data-table-sort-column="views"]')).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await sort.click();
  await expect(records.first()).toHaveAttribute("data-record-id", "reading");
  await sort.click();
  expect(
    await records.evaluateAll((rows) => rows.map((row) => row.getAttribute("data-record-id"))),
  ).toEqual(original);
  const checks = table.locator('input[data-table-select-target="item"]');
  await checks.nth(0).check();
  await checks.nth(2).click({ modifiers: ["Shift"] });
  expect(
    await checks.evaluateAll(
      (inputs) =>
        inputs.filter((input) => input instanceof HTMLInputElement && input.checked).length,
    ),
  ).toBe(3);
  await expect(table.locator('input[data-table-select-target="all"]')).toHaveJSProperty(
    "indeterminate",
    true,
  );
  await table.getByRole("button", { name: "選択を解除", exact: true }).click();
  await expect(table.locator(".selection-bar")).toBeHidden();
  await checks.first().check();
  await checks.first().evaluate((element) => {
    if (!(element instanceof HTMLInputElement) || !element.form)
      throw new Error("送信フォームがありません");
    element.form.reset();
  });
  await expect(checks.first()).not.toBeChecked();
  await expect(table.locator(".selection-bar")).toBeHidden();
});

test("Tableのmanualモードは行を動かさず列と方向を通知する", async ({ page }) => {
  await page.goto("/components/table");
  const table = page.getByRole("region", { name: "記事の公開状況", exact: true });
  const rows = table.locator("tbody > tr");
  const original = await rows.allTextContents();
  await table.evaluate((element) => {
    element.setAttribute("data-sort-mode", "manual");
    element.addEventListener("table:sort", (event) => {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (
        typeof detail !== "object" ||
        detail === null ||
        !("column" in detail) ||
        !("direction" in detail)
      )
        return;
      element.setAttribute(
        "data-last-request",
        `${String(detail.column)}:${String(detail.direction)}`,
      );
    });
  });
  await table.getByRole("button", { name: "閲覧", exact: true }).click();
  await expect(table).toHaveAttribute("data-last-request", "views:ascending");
  expect(await rows.allTextContents()).toEqual(original);
});

test("Tableの欠損は末尾に保ちソート要求の取消に従う", async ({ page }) => {
  await page.goto("/components/table");
  await page.getByText("無効な行・数値の欠損・負の値・密度", { exact: true }).click();
  const table = page.getByRole("region", { name: "増減の確認", exact: true });
  const sort = table.getByRole("button", { name: "増減", exact: true });
  await sort.click();
  await expect(table.locator("tbody > tr").last()).toContainText("未確定");
  await sort.click();
  await expect(table.locator("tbody > tr").last()).toContainText("未確定");
  await table.evaluate((element) =>
    element.addEventListener("table:beforesort", (event) => event.preventDefault(), { once: true }),
  );
  await sort.click();
  await expect(table.locator('[data-table-sort-column="amount"]')).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await table.getByRole("checkbox", { name: "比較行をすべて選択", exact: true }).check();
  await expect(
    table.getByRole("checkbox", { name: "未確定の項目を選択", exact: true }),
  ).not.toBeChecked();
});

test("Tableの選択バーは表の後にあり、行を選んだ後にTabで一括操作へ進める", async ({ page }) => {
  await page.goto("/components/table");
  const table = page.getByRole("region", { name: "記事の公開状況", exact: true });
  const bar = table.locator(".selection-bar");
  expect(
    await table.evaluate((element) => {
      const grid = element.querySelector(":scope > table"),
        shelf = element.querySelector(":scope > .selection-bar");
      return Boolean(
        grid && shelf && grid.compareDocumentPosition(shelf) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  await expect(bar).toHaveAttribute("popover", "manual");
  await table.locator('input[data-table-select-target="item"]').last().check();
  await expect(bar).toBeVisible();
  // 表の最後の行のリンクから、Shift+Tabで戻らずにTabで選択バーへ進む。
  await table.locator("tbody > tr").last().getByRole("link").focus();
  await page.keyboard.press("Tab");
  expect(await bar.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(bar.getByRole("button", { name: "選択したIDを確認", exact: true })).toBeFocused();
});

test("小さな表を狭幅で広げず、文字の列は14文字分の幅を保つ", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/table");
  const table = page.getByRole("region", { name: "料金", exact: true });
  expect(await table.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
    true,
  );
  // 文字の列は14文字分（14em）を保つ。文字は画面幅に合わせて変わるので、その要素の文字の大きさから求める。
  const textCell = page.locator('[data-example="hono"] [data-cell="text"]').first();
  const { width, fontSize } = await textCell.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
  }));
  expect(width).toBeGreaterThanOrEqual(fontSize * 14 - 0.5);
});

test("JavaScriptがなくてもTableの一括操作を表の下に置き、選んだ行を送れる", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5178/components/table");
  const table = page.getByRole("region", { name: "記事の公開状況", exact: true });
  const bar = table.getByRole("group", { name: "選択した行の操作", exact: true });
  await expect(bar).toBeVisible();
  // 動かない件数と解除の×は出さない。
  await expect(bar.getByRole("button", { name: "選択を解除", exact: true })).toBeHidden();
  const submit = bar.getByRole("button", { name: "選択したIDを確認", exact: true });
  await expect(submit).toBeVisible();
  const grid = await table.locator(":scope > table").boundingBox(),
    shelf = await bar.boundingBox();
  if (!grid || !shelf) throw new Error("表か選択バーがありません");
  expect(shelf.y).toBeGreaterThanOrEqual(grid.y + grid.height - 1);
  const item = table.locator('input[data-table-select-target="item"]').first();
  await item.check();
  // 画面の移り先はアプリが決めるので、押した時に送る値だけを確かめる。
  const sent = await submit.evaluate((button) => {
    if (!(button instanceof HTMLButtonElement) || !button.form) return [];
    return new FormData(button.form, button).getAll("ids").map(String);
  });
  expect(sent).toEqual([await item.inputValue()]);
  await context.close();
});

test("列を指定しないセルは折り返さず、表が囲みより広い時は横にスクロールする", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/components/table");
  const table = page.getByRole("region", { name: "Tableのprops", exact: true });
  // bodyのoverflow-wrap: anywhereを引き継ぐと、名前の列が1文字の幅まで縮み「selectionA / ctions」と割れて、表が溢れなかった。
  const name = table.locator("tbody > tr > th code", { hasText: /^selectionActions$/ });
  expect(await name.evaluate((element) => element.getClientRects().length)).toBe(1);
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await table.evaluate((element) => element.scrollBy({ left: 100 }));
  expect(await table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
