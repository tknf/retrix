import { expect, test } from "vite-plus/test";
import { isPopoverAnchored } from "../src/controllers/popover-position";

const geometry = () => ({
  anchor: { left: 234, right: 373, top: 575, bottom: 607 },
  viewport: { width: 1432, height: 887, offsetLeft: 0, offsetTop: 0 },
});

test("ボタンが画面内にあるのに左上へ出た配置を拒否する", () => {
  const { anchor, viewport } = geometry();
  expect(isPopoverAnchored(anchor, { left: 0, right: 352, top: 0, bottom: 155 }, viewport)).toBe(
    false,
  );
});

test("ボタンの下側と上側に接する配置を認める", () => {
  const { anchor, viewport } = geometry();
  expect(
    isPopoverAnchored(anchor, { left: 234, right: 586, top: 611, bottom: 766 }, viewport),
  ).toBe(true);
  expect(isPopoverAnchored(anchor, { left: 21, right: 373, top: 416, bottom: 571 }, viewport)).toBe(
    true,
  );
});

test("縦位置だけ合っていても別の列に出た配置を拒否する", () => {
  const { anchor, viewport } = geometry();
  expect(
    isPopoverAnchored(anchor, { left: 800, right: 1152, top: 611, bottom: 766 }, viewport),
  ).toBe(false);
});

test("アンカーに接していても画面外へはみ出す配置を拒否する", () => {
  const { anchor, viewport } = geometry();
  expect(
    isPopoverAnchored(anchor, { left: -50, right: 373, top: 611, bottom: 766 }, viewport),
  ).toBe(false);
});
