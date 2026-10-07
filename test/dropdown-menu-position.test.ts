import { expect, test } from "vite-plus/test";
import { menuPosition } from "../src/controllers/dropdown-menu-position";

const geometry = () => ({
  anchor: { top: 100, left: 100, right: 200, bottom: 132 },
  panel: { width: 192, height: 160 },
  viewport: { width: 1000, height: 800, offsetLeft: 0, offsetTop: 0 },
  layoutWidth: 1000,
  rtl: false,
  submenu: false,
  align: "start" as const,
});

test("通常メニューはトリガーから4px離して始端または末端に揃える", () => {
  const input = geometry();
  expect(menuPosition(input)).toEqual({ inlineStart: 100, blockStart: 136 });
  expect(menuPosition({ ...input, align: "end" })).toEqual({ inlineStart: 8, blockStart: 136 });
});

test("下端のメニューは上側へ開く", () => {
  const input = geometry();
  input.anchor = { top: 700, bottom: 732, left: 100, right: 200 };
  expect(menuPosition(input)).toEqual({ inlineStart: 100, blockStart: 536 });
});

test("サブメニューは右へ開き右端では左へ折り返す", () => {
  const input = { ...geometry(), submenu: true };
  expect(menuPosition(input)).toEqual({ inlineStart: 204, blockStart: 100 });
  input.anchor = { top: 100, bottom: 132, left: 800, right: 992 };
  expect(menuPosition(input)).toEqual({ inlineStart: 604, blockStart: 100 });
});

test("右から左のサブメニューは左を優先し空きがなければ右へ開く", () => {
  const input = { ...geometry(), submenu: true, rtl: true };
  expect(menuPosition(input)).toEqual({ inlineStart: 604, blockStart: 100 });
  input.anchor = { top: 100, bottom: 132, left: 500, right: 692 };
  expect(menuPosition(input)).toEqual({ inlineStart: 504, blockStart: 100 });
});

test("拡大した表示領域と狭い画面でも8pxの端余白を保つ", () => {
  const input = geometry();
  input.viewport = { width: 250, height: 200, offsetLeft: 50, offsetTop: 80 };
  input.anchor = { top: 260, bottom: 292, left: 280, right: 310 };
  const result = menuPosition(input);
  expect(result).toEqual({ inlineStart: 100, blockStart: 96 });
  expect(result.inlineStart + input.panel.width).toBeLessThanOrEqual(292);
  expect(result.blockStart + input.panel.height).toBeLessThanOrEqual(272);
});
