import { expect, test, type Locator } from "@playwright/test";

type Ink = { top: number; bottom: number; left: number; right: number };

/** パネルの中の見える物（文字の行・入力欄・ボタン）の箱を集める。角の閉じる操作は数えない。 */
const inksOf = (panel: Locator) =>
  panel.evaluate((root): Ink[] => {
    const result: Ink[] = [];
    const walk = (node: Node) => {
      for (const child of node.childNodes) {
        if (child instanceof Text) {
          if (!child.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(child);
          for (const rect of range.getClientRects()) {
            if (rect.width > 0.5) result.push(rect);
          }
        } else if (child instanceof HTMLElement) {
          const style = getComputedStyle(child);
          if (style.display === "none" || child.matches(".close, .rx-visually-hidden")) continue;
          if (child.matches("input, textarea, select, .rx-button")) {
            result.push(child.getBoundingClientRect());
            continue;
          }
          walk(child);
        }
      }
    };
    walk(root);
    return result.map(({ top, bottom, left, right }) => ({ top, bottom, left, right }));
  });

const insetsOf = async (panel: Locator) => {
  const box = await panel.boundingBox();
  const inks = await inksOf(panel);
  if (!box || inks.length === 0) throw new Error("パネルの中身を測れない");
  return {
    top: Math.min(...inks.map((ink) => ink.top)) - box.y,
    bottom: box.y + box.height - Math.max(...inks.map((ink) => ink.bottom)),
    left: Math.min(...inks.map((ink) => ink.left)) - box.x,
  };
};

test("Dialogは内側の余白を上下左右でそろえ、本文の段の間を見出しと本文の間より広げない", async ({
  page,
}) => {
  await page.goto("/components/dialog");
  await page.getByText("フォーム・必須入力・入力欄への初期フォーカス", { exact: true }).click();
  await page.getByRole("button", { name: "登録フォームを開く", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "担当者を登録する", exact: true });
  await expect(dialog).toBeVisible();
  const insets = await insetsOf(dialog);
  // 上は題名の行の余りの分だけ文字が下がるので、2px前後の差を許す。
  expect(Math.abs(insets.top - insets.left)).toBeLessThanOrEqual(4);
  expect(Math.abs(insets.bottom - insets.left)).toBeLessThanOrEqual(4);
  // 見出しの説明から本文の最初の入力の項目名までが、本文の中の項目の間より狭くならない。
  const gaps = await dialog.evaluate((panel) => {
    const description = panel.querySelector(":scope > .heading > p");
    const fields = [...panel.querySelectorAll(":scope > .body .rx-field")];
    const first = fields[0];
    const second = fields[1];
    if (!description || !first || !second) return null;
    return {
      heading: first.getBoundingClientRect().top - description.getBoundingClientRect().bottom,
      body: second.getBoundingClientRect().top - first.getBoundingClientRect().bottom,
    };
  });
  expect(gaps).not.toBeNull();
  if (gaps) expect(gaps.heading).toBeGreaterThanOrEqual(gaps.body);
});

test("題名を読み上げだけにしたPopoverは、本文を上の余白から始め、角の×と本文を重ねない", async ({
  page,
}) => {
  await page.goto("/components/reactions");
  await page.getByRole("button", { name: "リアクションを追加", exact: true }).first().click();
  const panel = page.locator(".rx-reactions .panel:popover-open");
  await expect(panel).toBeVisible();
  const insets = await insetsOf(panel);
  expect(Math.abs(insets.top - insets.left)).toBeLessThanOrEqual(4);
  const close = await panel.locator(".close").boundingBox();
  expect(close).not.toBeNull();
  if (close) {
    const overlapping = (await inksOf(panel)).filter(
      (ink) =>
        ink.left < close.x + close.width &&
        ink.right > close.x &&
        ink.top < close.y + close.height &&
        ink.bottom > close.y,
    );
    expect(overlapping).toEqual([]);
  }
});
