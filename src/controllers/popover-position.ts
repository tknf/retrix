type Bounds = Pick<DOMRectReadOnly, "top" | "right" | "bottom" | "left">;
type Viewport = { width: number; height: number; offsetLeft: number; offsetTop: number };

/** CSSの構文対応だけで成功扱いにせず、実際の配置がアンカーに接しているか調べる。 */
export const isPopoverAnchored = (anchor: Bounds, panel: Bounds, viewport: Viewport) => {
  const nearAboveOrBelow =
    Math.min(Math.abs(panel.top - anchor.bottom - 4), Math.abs(anchor.top - panel.bottom - 4)) <= 2;
  const overlapsInline = panel.left <= anchor.right && panel.right >= anchor.left;
  const inViewport =
    panel.left >= viewport.offsetLeft - 1 &&
    panel.top >= viewport.offsetTop - 1 &&
    panel.right <= viewport.offsetLeft + viewport.width + 1 &&
    panel.bottom <= viewport.offsetTop + viewport.height + 1;
  return nearAboveOrBelow && overlapsInline && inViewport;
};
