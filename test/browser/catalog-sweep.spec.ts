import { expect, test } from "@playwright/test";
import { componentIds } from "./catalog-pages";

// 全コンポーネントの見本を回り、どのコンポーネントにも共通する崩れを確かめる。
// コンポーネントごとの操作や寸法は、各コンポーネントのspecで確かめる。

const overflowOf = (element: Element) => {
  if (element.scrollWidth <= element.clientWidth + 1) return [];
  const edge = element.getBoundingClientRect();
  return Array.from(element.querySelectorAll("*"))
    .filter((child) => {
      const box = child.getBoundingClientRect();
      return (
        box.width > 0 && box.height > 0 && (box.right > edge.right + 1 || box.left < edge.left - 1)
      );
    })
    .slice(0, 6)
    .map((child) => ({
      tag: child.tagName,
      class: String(child.className),
      width: child.getBoundingClientRect().width,
      text: child.textContent?.slice(0, 30),
    }));
};

// 375pxの回では、同じ読み込みのまま幅だけを変え、ほかの狭い幅でも見本の外へはみ出さないかを確かめる。
const narrowWidths = [320, 360, 390, 414, 480, 600, 768, 1024];

for (const width of [375, 1280]) {
  test(
    `全${componentIds.length}コンポーネントが${width === 375 ? "375pxと320〜1024pxの各幅" : `${width}px`}で収まり参照先と表示を保つ`,
    {
      tag: "@sweep",
    },
    async ({ page }) => {
      test.setTimeout(600_000);
      await page.setViewportSize({ width, height: 1000 });
      for (const id of componentIds) {
        await page.goto(`/components/${id}`);
        await page
          .locator("details")
          .evaluateAll((elements) =>
            elements.forEach((element) => element.setAttribute("open", "")),
          );
        const sample = page.locator('[data-example="hono"]');
        await expect(sample).toBeVisible();
        // 見本の中の要素が指すidが、ページの中にあることを確かめる。
        const references = await sample.evaluate((root) => {
          const ids = Array.from(root.querySelectorAll("[id]"), (element) => element.id);
          const missing = Array.from(
            root.querySelectorAll(
              "[aria-labelledby], [aria-describedby], [aria-controls], label[for]",
            ),
          ).flatMap((element) =>
            ["aria-labelledby", "aria-describedby", "aria-controls", "for"].flatMap((attribute) =>
              (element.getAttribute(attribute)?.split(/\s+/) ?? []).filter(
                (reference) => reference && !document.getElementById(reference),
              ),
            ),
          );
          return {
            duplicates: ids.filter((entry, index) => ids.indexOf(entry) !== index),
            missing,
          };
        });
        expect.soft(references, id).toEqual({ duplicates: [], missing: [] });
        for (const zoom of ["100%", "200%"]) {
          await page.evaluate((size) => {
            document.documentElement.style.fontSize = size;
          }, zoom);
          expect.soft(await sample.evaluate(overflowOf), `${id}・文字${zoom}`).toEqual([]);
        }
        if (width === 375) {
          await page.evaluate(() => {
            document.documentElement.style.fontSize = "";
          });
          for (const narrow of narrowWidths) {
            await page.setViewportSize({ width: narrow, height: 1000 });
            expect.soft(await sample.evaluate(overflowOf), `${id}・${narrow}px幅`).toEqual([]);
          }
          await page.setViewportSize({ width, height: 1000 });
        }
      }
    },
  );
}
