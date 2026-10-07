import { expect, test } from "@playwright/test";

test("ツールバーへTabで一か所だけ入り、矢印キーで書式ツールの間を移る", async ({ page }) => {
  await page.goto("/components/text-editor");
  const toolbar = page.getByRole("toolbar", { name: "コメントの書式", exact: true });
  const textarea = page.getByRole("textbox", { name: "コメント", exact: true });
  await textarea.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(toolbar.getByRole("button", { name: "太字", exact: true })).toBeFocused();
  await expect(toolbar.locator('[data-toolbar-target="control"][tabindex="0"]')).toHaveCount(1);

  await page.keyboard.press("ArrowRight");
  await expect(toolbar.getByRole("button", { name: "斜体", exact: true })).toBeFocused();
  await page.keyboard.press("End");
  await expect(toolbar.getByRole("button", { name: "やり直す", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(toolbar.getByRole("button", { name: "太字", exact: true })).toBeFocused();

  // 前にいた書式ツールを覚え、入力エリアから戻るとその書式ツールに止まる。
  await page.keyboard.press("ArrowLeft");
  await textarea.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(toolbar.getByRole("button", { name: "やり直す", exact: true })).toBeFocused();
});

test("使えない時は書式ツールにTabで止まらない", async ({ page }) => {
  await page.goto("/components/text-editor");
  // 閉じたDisclosureの中にあるので、アクセシビリティツリーではなくIDで探す。
  const toolbar = page.locator("#disabled-editor-toolbar");
  await expect(toolbar.locator('[data-toolbar-target="control"]')).not.toHaveCount(0);
  await expect(toolbar.locator('[data-toolbar-target="control"][tabindex="0"]')).toHaveCount(0);
});
