import { expect, test } from "vite-plus/test";
import { calendarPosition } from "../src/controllers/date-picker-position";

const geometry = (overrides: Partial<Parameters<typeof calendarPosition>[0]> = {}) => ({
  anchor: { top: 100, right: 500, bottom: 132, left: 100 },
  panel: { width: 320, height: 380 },
  viewport: { width: 1280, height: 900, offsetLeft: 0, offsetTop: 0 },
  layoutWidth: 1280,
  rtl: false,
  ...overrides,
});

test("カレンダーは入力欄の末端に揃えて8px下へ配置する", () => {
  expect(calendarPosition(geometry())).toEqual({ inlineStart: 180, blockStart: 140 });
});

test("下に収まらない場合は入力欄の8px上へ配置する", () => {
  expect(
    calendarPosition(geometry({ anchor: { top: 700, right: 500, bottom: 732, left: 100 } })),
  ).toEqual({ inlineStart: 180, blockStart: 312 });
});

test("画面の左右端にある入力欄でも余白を保つ", () => {
  for (const [left, right, expected] of [
    [0, 100, 8],
    [1100, 1280, 952],
  ]) {
    expect(
      calendarPosition(geometry({ anchor: { top: 100, right, bottom: 132, left } })).inlineStart,
    ).toBe(expected);
  }
});

test("入力欄の上下に収まらない場合も表示領域から出ない", () => {
  expect(
    calendarPosition(
      geometry({
        anchor: { top: 250, right: 350, bottom: 282, left: 20 },
        panel: { width: 320, height: 484 },
        viewport: { width: 375, height: 500, offsetLeft: 0, offsetTop: 0 },
        layoutWidth: 375,
      }),
    ),
  ).toEqual({ inlineStart: 30, blockStart: 8 });
});

test("拡大やソフトキーボードで移動した表示領域を基準に配置する", () => {
  expect(
    calendarPosition(
      geometry({
        anchor: { top: 420, right: 540, bottom: 452, left: 200 },
        panel: { width: 320, height: 384 },
        viewport: { width: 375, height: 400, offsetLeft: 80, offsetTop: 200 },
      }),
    ),
  ).toEqual({ inlineStart: 127, blockStart: 208 });
});

test("RTLでは入力欄の左端に揃えて論理方向の座標を返す", () => {
  expect(calendarPosition(geometry({ rtl: true }))).toEqual({
    inlineStart: 860,
    blockStart: 140,
  });
});
