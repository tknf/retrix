import { expect, test } from "@playwright/test";

const cases = [
  {
    id: "code-block",
    targets: [
      {
        selector: '[data-example="hono"] .rx-code-block code > span',
        property: "color",
        threshold: 4.5,
      },
    ],
  },
  {
    id: "avatar",
    targets: [{ selector: '[data-example="hono"] .rx-avatar', property: "color", threshold: 4.5 }],
  },
  {
    id: "surface",
    targets: [{ selector: '[data-example="hono"] .rx-surface p', property: "color", threshold: 7 }],
  },
  {
    id: "action-list",
    targets: [
      {
        selector: '[data-example="hono"] .rx-action-list > li > a > .title',
        property: "color",
        threshold: 7,
      },
      { selector: '[data-example="hono"] .rx-action-list small', property: "color", threshold: 7 },
      {
        selector: '[data-example="hono"] .rx-action-list > li > a > .preview p',
        property: "color",
        threshold: 7,
      },
    ],
  },
  {
    id: "button",
    targets: [
      // 文字のある操作は文字で操作と分かるので、WCAG 1.4.11は縁の対比を求めない。
      // 控えめな操作（secondary）は淡い縁と縦の陰影で描く設計なので、縁ではなく文字の対比を確かめる。
      { selector: '[data-example="hono"] .rx-button', property: "color", threshold: 4.5 },
    ],
  },
  {
    id: "badge",
    targets: [{ selector: '[data-example="hono"] .rx-badge', property: "color", threshold: 4.5 }],
  },
  {
    id: "input-group",
    targets: [
      {
        selector: '[data-example="hono"] .rx-input:not(:disabled)',
        property: "color",
        threshold: 7,
      },
      { selector: '[data-example="hono"] .affix', property: "color", threshold: 4.5 },
      {
        selector: '[data-example="hono"] .control:has(> .rx-input[data-invalid="true"])',
        property: "border-inline-start-color",
        threshold: 3,
      },
    ],
  },
  {
    id: "switch",
    targets: [
      { selector: '[data-example="hono"] .rx-switch > span', property: "color", threshold: 7 },
      { selector: '[data-example="hono"] .rx-switch small', property: "color", threshold: 7 },
      // 使えない操作はWCAGの対比の対象外なので、Fieldの入力と同じく除く。
      {
        selector: '[data-example="hono"] .rx-switch > input:not(:disabled)',
        property: "color",
        threshold: 3,
      },
    ],
  },
  {
    id: "notice",
    targets: [
      { selector: '[data-example="hono"] .rx-notice', property: "color", threshold: 7 },
      // アイコンと題名は、役割の色で塗ったピルの上の白い文字。全ての役割で本文と同じ基準にする。
      {
        selector: '[data-example="hono"] .rx-notice > .heading',
        property: "color",
        threshold: 4.5,
      },
    ],
  },
  {
    id: "field",
    targets: [
      {
        selector: '[data-example="hono"] .rx-input:not(:disabled)',
        property: "color",
        threshold: 7,
      },
      { selector: '[data-example="hono"] .rx-input:disabled', property: "color", threshold: 4.5 },
      {
        selector: '[data-example="hono"] .rx-input[data-invalid="true"]',
        property: "border-inline-start-color",
        threshold: 3,
      },
      {
        selector: '[data-example="hono"] .help, [data-example="hono"] .error',
        property: "color",
        threshold: 7,
      },
      {
        selector: '[data-example="hono"] .error > .rx-icon',
        property: "color",
        threshold: 3,
      },
    ],
  },
  {
    id: "image-frame",
    targets: [
      {
        selector: '[data-example="hono"] .rx-image-frame > .image > span',
        property: "color",
        threshold: 4.5,
      },
    ],
  },
  {
    id: "tabs",
    targets: [
      { selector: '[data-example="hono"] [role="tab"]', property: "color", threshold: 4.5 },
    ],
  },
  {
    id: "file-item",
    targets: [
      { selector: '[data-example="hono"] .rx-file-item p', property: "color", threshold: 7 },
    ],
  },
];

for (const { id, targets } of cases)
  test(`${id}のバリエーションを実際の背景でコントラスト測定する`, async ({ page }, testInfo) => {
    await page.goto(`/components/${id}`);
    const { measurements, calibration } = await page.evaluate(async (targets) => {
      await document.fonts.ready;
      // 初期CSSの適用中に発生する有限のtransitionを終えてから、表示色を測る。
      await Promise.allSettled(
        document
          .getAnimations()
          .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime))
          .map((animation) => animation.finished),
      );
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("描画色の測定に失敗しました");
      const color = (value: string) => {
        // color(srgb ...)の0〜1をrgb(...)の0〜255として読まない。
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
        return { r, g, b, a: a / 255 };
      };
      const composite = (front: ReturnType<typeof color>, back: ReturnType<typeof color>) => ({
        r: front.r * front.a + back.r * (1 - front.a),
        g: front.g * front.a + back.g * (1 - front.a),
        b: front.b * front.a + back.b * (1 - front.a),
        a: 1,
      });
      const luminance = (value: ReturnType<typeof color>) => {
        const linear = (channel: number) => {
          const c = channel / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        return linear(value.r) * 0.2126 + linear(value.g) * 0.7152 + linear(value.b) * 0.0722;
      };
      const measurements = targets.flatMap(({ selector, property, threshold }) => {
        const elements = Array.from(document.querySelectorAll(selector));
        if (!elements.length) throw new Error(`測定対象がありません: ${selector}`);
        return elements.map((element) => {
          const chain: Element[] = [];
          for (let current: Element | null = element; current; current = current.parentElement)
            chain.unshift(current);
          let backgrounds = [color("rgb(255 255 255)")];
          for (const ancestor of chain) {
            // 境界は外側、文字は要素自身の塗りを含む背景と比較する。
            if (property !== "color" && ancestor === element) continue;
            const style = getComputedStyle(ancestor);
            backgrounds = backgrounds.map((background) =>
              composite(color(style.backgroundColor), background),
            );
            // 薄いグラデーションも無視せず、各色のうち最も弱いコントラストを採る。
            const stops = style.backgroundImage.includes("gradient(")
              ? style.backgroundImage.match(/(?:rgba?|color|oklch|oklab|lab|lch|hsla?)\([^)]*\)/g)
              : null;
            if (stops)
              backgrounds = backgrounds.flatMap((background) =>
                stops.map((stop) => composite(color(stop), background)),
              );
          }
          const foregroundColor = color(getComputedStyle(element).getPropertyValue(property));
          const contrasts = backgrounds.map((background) => {
            const foreground = composite(foregroundColor, background);
            const first = luminance(foreground);
            const second = luminance(background);
            return {
              ratio: (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05),
              foreground,
              background,
            };
          });
          const weakest = contrasts.reduce((previous, current) =>
            current.ratio < previous.ratio ? current : previous,
          );
          return {
            selector,
            label: element.textContent?.trim().slice(0, 60),
            property,
            threshold,
            ...weakest,
          };
        });
      });
      return {
        measurements,
        calibration: [color("rgb(255, 255, 255)"), color("color(srgb 1 1 1)")],
      };
    }, targets);
    expect(calibration).toEqual([
      { r: 255, g: 255, b: 255, a: 1 },
      { r: 255, g: 255, b: 255, a: 1 },
    ]);
    await testInfo.attach("contrast", {
      body: JSON.stringify(measurements, null, 2),
      contentType: "application/json",
    });
    for (const measurement of measurements)
      expect(
        measurement.ratio,
        `${measurement.selector}: ${measurement.label}`,
      ).toBeGreaterThanOrEqual(measurement.threshold);
  });
