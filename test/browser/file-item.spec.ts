import { expect, test } from "@playwright/test";

test("FileItemは広い幅でもアイコンとサムネイルの高さを40pxにそろえ、本文の書き始めをそろえる", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/components/file-item");
  const items = page.locator('[data-example="hono"] .rx-file-item');
  await expect(items.first()).toBeVisible();
  const boxes = await items.evaluateAll((elements) =>
    elements.map((element) => {
      const mark = element.querySelector(":scope > .preview, :scope > .icon"),
        body = element.querySelector(":scope > .body");
      if (!mark || !body) throw new Error("アイコンか本文がありません");
      const m = mark.getBoundingClientRect(),
        b = body.getBoundingClientRect(),
        rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      return {
        wide: element.getBoundingClientRect().width >= 26 * rootFontSize,
        preview: mark.classList.contains("preview"),
        width: m.width,
        height: m.height,
        gap: b.left - m.right,
        bodyStart: b.left - element.getBoundingClientRect().left,
      };
    }),
  );
  expect(boxes.some((box) => box.wide)).toBe(true);
  for (const box of boxes) {
    // サムネイルは40pxの正方形、ファイルのアイコンは書類の形の縦長（32×40px）。
    expect(box.width).toBeCloseTo(box.preview ? 40 : 32, 0);
    expect(box.height).toBeCloseTo(40, 0);
    expect(box.gap).toBeGreaterThan(0);
  }
  expect(new Set(boxes.map((box) => Math.round(box.bodyStart))).size).toBe(1);
});
