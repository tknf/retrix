import { expect, test } from "@playwright/test";

test("Treegridのdisabledの行は押してもShift+Spaceでも選ばれず、変更のイベントも発火しない", async ({
  page,
}) => {
  await page.goto("/components/treegrid");
  await page.getByText("複数選択・利用できないリンク・長い階層", { exact: true }).click();
  const grid = page.getByRole("treegrid", { name: "素材の確認", exact: true });
  await grid.evaluate((element) => {
    element.setAttribute("data-changes", "0");
    element.addEventListener("treegrid:beforechange", () =>
      element.setAttribute(
        "data-changes",
        String(Number(element.getAttribute("data-changes")) + 1),
      ),
    );
  });
  const row = grid.getByRole("row", { name: /閲覧不可の資料/ });
  await expect(row).toHaveAttribute("aria-selected", "false");
  await row.getByRole("gridcell").first().click();
  await expect(row).toHaveAttribute("aria-selected", "false");
  const title = row.getByRole("rowheader");
  await title.focus();
  await page.keyboard.press("Shift+Space");
  await expect(row).toHaveAttribute("aria-selected", "false");
  await expect(row).not.toHaveAttribute("data-selected");
  await expect(grid).toHaveAttribute("data-changes", "0");
  // 使える行は同じ操作で選べる。
  const folder = grid.getByRole("row", { name: /素材/ }).first();
  await folder.getByRole("gridcell").first().click();
  await expect(folder).toHaveAttribute("aria-selected", "true");
  await expect(grid).toHaveAttribute("data-changes", "1");
});

test("Treegridは接続すると閉じた行の子を隠し、開閉ボタンで開閉できる", async ({ page }) => {
  await page.goto("/components/treegrid");
  const grid = page.getByRole("treegrid", { name: "公開資料と進行状況", exact: true });
  const guide = grid.getByRole("row", { name: /利用案内/ }).first();
  await expect(guide).toHaveAttribute("aria-expanded", "true");
  // expandedに含めない行は閉じて始まり、子の行を隠す。
  await expect(grid.getByRole("row", { name: /管理者向け/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(grid.getByRole("row", { name: /アクセス権限の設定と確認/ })).toBeHidden();
  const toggle = grid.getByRole("button", { name: "利用案内を開閉", exact: true });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(guide).toHaveAttribute("aria-expanded", "false");
  await expect(grid.getByRole("row", { name: /はじめに/ })).toBeHidden();
});

test("JavaScriptがなくてもTreegridの全ての行を読め、動かない開閉ボタンを出さない", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5178/components/treegrid");
  const first = page.locator("table", {
    has: page.locator("caption", { hasText: "公開資料と進行状況" }),
  });
  // expandedに含めない行（閉じて始まる行）の子も読める。
  await expect(first.getByText("アクセス権限の設定と確認", { exact: true })).toBeVisible();
  await expect(first.locator("tr[aria-expanded]")).toHaveCount(0);
  await expect(first.locator(".toggle")).toHaveCount(2);
  for (const toggle of await first.locator(".toggle").all()) await expect(toggle).toBeHidden();
  await context.close();
});
