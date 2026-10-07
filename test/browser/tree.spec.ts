import { expect, test } from "@playwright/test";

const openVariants = async (page: import("@playwright/test").Page) => {
  await page.goto("/components/tree");
  const summary = page.getByText("リンクの項目・右から左に読む場合", { exact: true });
  await summary.click();
  // WebKitは開いた直後の1フレームほど中身をcontent-visibility: hiddenのまま保ち、その間はfocus()が効かない。
  // toBeVisibleはこの状態でも通るので、中身のcontent-visibilityが切り替わるまで待つ。
  const disclosure = page.locator("details", { has: summary });
  await expect
    .poll(() =>
      disclosure.evaluate(
        (element) => getComputedStyle(element, "::details-content").contentVisibility,
      ),
    )
    .toBe("visible");
};

test("Tabは一覧だけに止まり、中のリンクと開閉のボタンには止まらない", async ({ page }) => {
  await openVariants(page);
  const tree = page.getByRole("tree", { name: "リンクの資料", exact: true });
  await tree.focus();
  await expect(tree).toBeFocused();
  await page.keyboard.press("Tab");
  const focusedInside = await tree.evaluate((element) =>
    element.contains(element.ownerDocument.activeElement),
  );
  expect(focusedInside).toBe(false);
  for (const control of await tree.locator("a[href], .toggle").all())
    await expect(control).toHaveAttribute("tabindex", "-1");
});

test("Enterでリンクの項目を選ぶとリンク先へ移る", async ({ page }) => {
  await openVariants(page);
  const tree = page.getByRole("tree", { name: "リンクの資料", exact: true });
  await tree.focus();
  await page.keyboard.press("End");
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
  await expect(page.locator("html")).toHaveAttribute("data-followed", /#linked-rules$/);
});

test("右から左に書く時は←で開いて子へ進み、→で閉じる", async ({ page }) => {
  await openVariants(page);
  const tree = page.getByRole("tree", { name: "المستندات", exact: true });
  const parent = tree.getByRole("treeitem", { name: "الدليل", exact: true });
  await tree.focus();
  await page.keyboard.press("Home");
  await expect(parent).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("ArrowLeft");
  await expect(parent).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowLeft");
  const child = tree.getByRole("treeitem", { name: "البداية", exact: true });
  await expect(tree).toHaveAttribute(
    "aria-activedescendant",
    (await child.getAttribute("id")) ?? "",
  );
  await page.keyboard.press("ArrowRight");
  await expect(tree).toHaveAttribute(
    "aria-activedescendant",
    (await parent.getAttribute("id")) ?? "",
  );
  await page.keyboard.press("ArrowRight");
  await expect(parent).toHaveAttribute("aria-expanded", "false");
});

test("外側のキーの処理には押したキーのまま届ける", async ({ page }) => {
  await openVariants(page);
  await page.evaluate(() => {
    const keys: string[] = [];
    Reflect.set(window, "treeKeys", keys);
    document.addEventListener("keydown", (event) => keys.push(event.key));
  });
  const tree = page.getByRole("tree", { name: "المستندات", exact: true });
  await tree.focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowLeft");
  expect(await page.evaluate(() => Reflect.get(window, "treeKeys"))).toEqual(["Home", "ArrowLeft"]);
});
