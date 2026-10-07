import { expect, test, type Page } from "@playwright/test";

// この計測はmacOSの実フォントを使う。枠ではなく、描画された字形の上下端を検査する。
test.use({ deviceScaleFactor: 2 });

const measureControls = async (page: Page) => {
  const positions = await page.evaluate(() => {
    const root = document.createElement("section");
    root.id = "control-text-fixture";
    root.style.cssText =
      "display:grid;grid-template-columns:repeat(4,240px);gap:12px;padding:24px;background:white;width:1044px;font-weight:700";
    document.body.replaceChildren(root);
    const positions = [];
    // 通常は14px、largeは16px。どちらも製品のCSSの大きさのまま測る。
    for (const size of ["通常", "large"] as const) {
      for (const wrapped of [false, true]) {
        for (const tag of ["button", "input"]) {
          const control = document.createElement(tag);
          control.className = tag === "button" ? "rx-button" : "rx-input";
          if (size === "large") control.dataset.size = "large";
          // 色だけを揃え、継承・フォント・行高・寸法は製品のCSSをそのまま使う。
          control.style.cssText = "color:black;background:white;width:240px";
          if (control instanceof HTMLInputElement) {
            if (wrapped) control.placeholder = "日本語を確認する";
            else control.value = "日本語を確認する";
          } else if (wrapped) {
            const label = document.createElement("span");
            label.textContent = "日本語を確認する";
            control.append(label);
          } else control.textContent = "日本語を確認する";
          root.append(control);
          const rect = control.getBoundingClientRect();
          positions.push({
            size,
            tag,
            wrapped,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            weight: getComputedStyle(control).fontWeight,
          });
        }
      }
    }
    return positions;
  });
  const screenshot = await page.locator("#control-text-fixture").screenshot();
  return page.evaluate(
    async ({ png, positions }) => {
      const bitmap = await createImageBitmap(
        new Blob([new Uint8Array(png)], { type: "image/png" }),
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvasを作れません");
      ctx.drawImage(bitmap, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return positions.map((pos) => {
        let top = Infinity;
        let bottom = -Infinity;
        for (let y = (pos.y + 4) * 2; y < (pos.y + pos.height - 4) * 2; y++) {
          for (let x = (pos.x + 8) * 2; x < (pos.x + pos.width - 8) * 2; x++) {
            const offset = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            if (data[offset] < 128 && data[offset + 1] < 128 && data[offset + 2] < 128) {
              top = Math.min(top, y);
              bottom = Math.max(bottom, y);
            }
          }
        }
        return { ...pos, delta: (top + bottom + 1) / 4 - pos.y - pos.height / 2 };
      });
    },
    { png: Array.from(screenshot), positions },
  );
};

test.beforeEach(async ({ page }) => {
  await page.goto("/components/button");
  const localFont = await page.evaluate(async () => {
    try {
      return (await document.fonts.load('14px "Retrix UI Japanese"')).some(
        (face) => face.status === "loaded",
      );
    } catch {
      return false;
    }
  });
  test.skip(!localFont, "macOSのHiraginoを使う描画位置の検査");
});

test("Button・Inputの通常とlargeで直書き・子要素・placeholderが上ずれない", async ({ page }) => {
  for (const metric of await measureControls(page)) {
    expect(metric.weight, "親の太字を操作コンポーネントへ引き継がない").toBe("400");
    expect(
      Math.abs(metric.delta),
      `${metric.tag} ${metric.size}px wrapped=${metric.wrapped}`,
    ).toBeLessThanOrEqual(0.5);
  }
});

test("Helvetica Neueを優先するフォント指定ではWebKitの入力文字の上ずれを実際に検出する", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "再現したWebKitの退行を検査する");
  await page.evaluate(() =>
    document.documentElement.style.setProperty(
      "--rx-control-font-family",
      '"Helvetica Neue", Arial, var(--rx-font)',
    ),
  );
  const metrics = await measureControls(page);
  const input = metrics.find(
    ({ tag, size, wrapped }) => tag === "input" && size === "通常" && !wrapped,
  );
  expect(input).toBeDefined();
  expect(input?.delta).toBeLessThan(-0.5);
});

test.describe("タッチ操作", () => {
  test.use({ hasTouch: true });
  test("44pxのButtonとInputでも文字の中心を保つ", async ({ page }) => {
    for (const metric of await measureControls(page)) {
      expect(Math.round(metric.height)).toBe(44);
      expect(Math.abs(metric.delta), `${metric.tag} ${metric.size}px`).toBeLessThanOrEqual(0.5);
    }
  });
});
