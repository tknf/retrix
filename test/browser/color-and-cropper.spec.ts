import { expect, test } from "@playwright/test";

test("ColorPickerの色相操作がフォーム値と表示色を同期する", async ({ page }) => {
  await page.goto("/components/color-picker");
  const picker = page.locator("#color-picker-brand");
  const hue = picker.getByRole("slider", { name: "色相" });

  await expect(picker).toHaveAttribute("data-state", "idle");
  await hue.press("ArrowRight");
  const nextHue = await hue.inputValue();
  expect(Number(nextHue)).toBeGreaterThan(215);
  await expect(picker).toHaveCSS("--color-picker-hue", nextHue);
  await expect(picker.getByRole("slider", { name: "彩度" })).toHaveValue("68");
});

test("ImageCropperの移動操作が位置スライダーを同期する", async ({ page }) => {
  await page.goto("/components/image-cropper");
  const cropper = page.locator("#hono-image-cropper");

  await expect(cropper).toHaveAttribute("data-state", "idle");
  await cropper.getByRole("button", { name: "選択範囲を移動" }).press("ArrowRight");
  await expect(cropper).toHaveCSS("--image-cropper-x", "13");
  await expect(cropper.locator('[data-image-cropper-target="xControl"]')).toHaveValue("13");
});

test("ImageCropperはJavaScriptなしではハンドルと調整の欄を出さず、接続すると出す", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto("http://127.0.0.1:5178/components/image-cropper");
    const staticCropper = staticPage.locator("#hono-image-cropper");
    await expect(staticCropper.locator("img")).toBeVisible();
    await expect(staticCropper.getByRole("button", { name: "選択範囲を移動" })).toBeHidden();
    await expect(staticCropper.getByRole("slider", { name: "拡大率" })).toBeHidden();
  } finally {
    await context.close();
  }

  await page.goto("/components/image-cropper");
  const cropper = page.locator("#hono-image-cropper");
  await expect(cropper).toHaveAttribute("data-connected", "true");
  await expect(cropper.getByRole("button", { name: "選択範囲を移動" })).toBeVisible();
  await expect(cropper.getByRole("slider", { name: "拡大率" })).toBeVisible();
});
