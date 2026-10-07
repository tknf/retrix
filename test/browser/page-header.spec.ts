import { expect, test, type Page } from "@playwright/test";

// 1px広げた時の増分は約0.008px。Firefoxは文字の大きさを大きさの桁に応じた刻みへ丸め、
// 8〜16pxは1/64px、16〜32pxは1/32px、32〜64pxは1/16px（0.0625px）ずつ変わる。
// 段で切り替わる飛び（0.5px以上）とは桁が違うので、64px未満の見出しでの最大の刻みを超える0.1pxまでを連続とみなす。
const continuousStep = 0.1;

const sweepTitleSizes = async (
  page: Page,
  from: number,
  to: number,
  check: (width: number, step: number | undefined, overflow: number) => void,
) => {
  let previousTitleSize: number | undefined;
  for (let width = from; width <= to; width += 1) {
    await page.setViewportSize({ width, height: 800 });
    const { overflow, titleSize } = await page.evaluate(() => {
      const title = document.querySelector(".rx-page-header h1");
      if (!title) throw new Error("PageHeaderの見出しが見つかりません");
      return {
        overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
      };
    });
    check(
      width,
      previousTitleSize === undefined ? undefined : titleSize - previousTitleSize,
      overflow,
    );
    previousTitleSize = titleSize;
  }
};

test("PageHeaderの見出しは幅を広げても寸法が飛ばない", { tag: "@sweep" }, async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto("/components/page-header/preview");
  await sweepTitleSizes(page, 320, 1024, (width, step, overflow) => {
    expect(overflow, `${width}px幅でページ外へのはみ出し`).toBeLessThanOrEqual(1);
    if (step === undefined) return;
    expect(step, `${width}px幅で見出し寸法の飛び`).toBeGreaterThanOrEqual(0);
    expect(step, `${width}px幅で見出し寸法の飛び`).toBeLessThan(continuousStep);
  });
});

test("見出し寸法の飛びの基準は、段で切り替わる0.5pxの飛びを検出する", async ({ page }) => {
  await page.goto("/components/page-header/preview");
  await page.addStyleTag({
    content:
      "@media (min-width: 800px) { .rx-page-header h1 { font-size: calc(var(--rx-title) + 0.5px) !important; } }",
  });
  const jumps: number[] = [];
  await sweepTitleSizes(page, 797, 802, (width, step) => {
    if (step !== undefined && step >= continuousStep) jumps.push(width);
  });
  expect(jumps).toEqual([800]);
});
