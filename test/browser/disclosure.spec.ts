import { expect, test } from "@playwright/test";

test("連続Disclosureは4pxで並び見出しと本文の開始位置を揃える", async ({ page }) => {
  await page.goto("/components/disclosure");
  const group = page.getByRole("group", { name: "提出について", exact: true });
  const rows = group.locator(":scope > details");
  const boxes = await rows.evaluateAll((elements) =>
    elements.map((element) => {
      const r = element.getBoundingClientRect();
      return { y: r.y, bottom: r.bottom };
    }),
  );
  expect((boxes[1]?.y ?? Infinity) - (boxes[0]?.bottom ?? 0)).toBeCloseTo(4, 1);
  await group.getByText("提出できるファイル", { exact: true }).click();
  const alignment = await rows.first().evaluate((element) => {
    const label = element.querySelector("summary > .label"),
      body = element.querySelector(".body > p");
    if (!label || !body) throw new Error("内容がありません");
    return label.getBoundingClientRect().x - body.getBoundingClientRect().x;
  });
  expect(alignment).toBeCloseTo(0, 1);
});

test("Disclosureは単一展開・入力保持・狭幅の長文と入れ子を保つ", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/components/disclosure");
  const faq = page.getByRole("group", { name: "受付について", exact: true });
  await faq.locator("summary").filter({ hasText: "結果の確認" }).press("Enter");
  await expect(faq.locator("details[open]")).toHaveCount(1);
  await expect(faq.getByText("案件の一覧から確認できます。", { exact: true })).toBeVisible();
  const summary = page.locator("summary").filter({ hasText: "通知先を変更する" });
  await summary.press("Space");
  const email = page.getByRole("textbox", { name: "メールアドレス", exact: true });
  await email.fill("member@example.com");
  await summary.press("Space");
  await expect(email).toBeHidden();
  await summary.press("Space");
  await expect(email).toHaveValue("member@example.com");
  for (const title of ["入れ子の条件", "法人の場合", "代理で提出する場合"])
    await page.getByText(title, { exact: true }).click();
  await page.locator("summary").filter({ hasText: "提出前に確認してほしい" }).click();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expect(page.getByText("委任状も添付してください。", { exact: true })).toBeVisible();
  expect(
    await page
      .locator('[data-example="hono"]')
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
});
