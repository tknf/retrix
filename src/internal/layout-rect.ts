/**
 * 拡大縮小の途中でも、変形前の配置の矩形を返す。
 * パネルは開いた瞬間に小さい状態から拡大するため、getBoundingClientRectをそのまま使うと位置の計算が狂う。
 */
export const layoutRect = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const [scaleX = 1, scaleY = scaleX] =
    style.scale === "none" ? [] : style.scale.split(" ").map(Number.parseFloat);
  const [originX = 0, originY = 0] = style.transformOrigin.split(" ").map(Number.parseFloat);
  const left = rect.left - originX * (1 - scaleX);
  const top = rect.top - originY * (1 - scaleY);
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  return { left, top, right: left + width, bottom: top + height, width, height };
};
