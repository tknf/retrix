import { expect, test } from "@playwright/test";
import { componentIds } from "./catalog-pages";

/*
  片側だけの線と角丸を組み合わせると、線の端が角の丸みに沿って細く欠ける。
  線のある辺の端の角が丸く、その角でつながる隣の辺に線が無い要素（擬似要素を含む）を見つけたら失敗にする。
  inset の影で片側だけに線を引く時も同じに扱う。
*/
for (const id of componentIds) {
  test(`${id}は片側だけの線と角丸を組み合わせない`, { tag: "@sweep" }, async ({ page }) => {
    await page.goto(`/components/${id}`);
    await page.evaluate(() =>
      document.querySelectorAll("details").forEach((details) => details.setAttribute("open", "")),
    );
    const problems = await page.evaluate(() => {
      const found: string[] = [];
      const check = (element: Element, pseudo?: string) => {
        const style = getComputedStyle(element, pseudo);
        if (pseudo && (style.content === "none" || style.content === "normal")) return;
        if (style.display === "none") return;
        const [tl, tr, bl, br] = [
          style.borderTopLeftRadius,
          style.borderTopRightRadius,
          style.borderBottomLeftRadius,
          style.borderBottomRightRadius,
        ].map((value) => Number.parseFloat(value) > 0.5);
        if (!tl && !tr && !bl && !br) return;
        const line = (side: "Top" | "Right" | "Bottom" | "Left") =>
          style[`border${side}Style`] !== "none" &&
          Number.parseFloat(style[`border${side}Width`]) > 0 &&
          style[`border${side}Color`] !== "rgba(0, 0, 0, 0)";
        const [top, right, bottom, left] = [
          line("Top"),
          line("Right"),
          line("Bottom"),
          line("Left"),
        ];
        const broken =
          (top && ((tl && !left) || (tr && !right))) ||
          (bottom && ((bl && !left) || (br && !right))) ||
          (left && ((tl && !top) || (bl && !bottom))) ||
          (right && ((tr && !top) || (br && !bottom)));
        const edgeShadow = style.boxShadow
          .split(/,(?![^(]*\))/)
          .filter((part) => part.includes("inset"))
          .some((part) => {
            const [x = 0, y = 0, blur = 0, spread = 0] = (
              part.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) ?? []
            ).map(Number.parseFloat);
            return blur === 0 && spread === 0 && (x !== 0) !== (y !== 0) && Math.abs(x || y) >= 1.5;
          });
        if (broken || edgeShadow)
          found.push(
            `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}${pseudo ?? ""}`,
          );
      };
      for (const element of document.querySelectorAll('[data-example="hono"] *')) {
        check(element);
        check(element, "::before");
        check(element, "::after");
      }
      return found;
    });
    expect(problems).toEqual([]);
  });
}
