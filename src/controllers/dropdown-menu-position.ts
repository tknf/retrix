type MenuGeometry = {
  anchor: Pick<DOMRectReadOnly, "top" | "right" | "bottom" | "left">;
  panel: Pick<DOMRectReadOnly, "width" | "height">;
  viewport: { width: number; height: number; offsetLeft: number; offsetTop: number };
  layoutWidth: number;
  rtl: boolean;
  submenu: boolean;
  align: "start" | "end";
};

/** 上下・左右の空きを選び、表示領域内へ収める。サブメニューは論理方向の末尾側を優先する。 */
export const menuPosition = ({
  anchor,
  panel,
  viewport,
  layoutWidth,
  rtl,
  submenu,
  align,
}: MenuGeometry) => {
  const minX = viewport.offsetLeft + 8;
  const maxX = Math.max(minX, viewport.offsetLeft + viewport.width - panel.width - 8);
  const minY = viewport.offsetTop + 8;
  const maxY = Math.max(minY, viewport.offsetTop + viewport.height - panel.height - 8);
  const right = anchor.right + 4;
  const left = anchor.left - panel.width - 4;
  const preferred = rtl ? left : right;
  const other = rtl ? right : left;
  const x = submenu
    ? preferred >= minX && preferred <= maxX
      ? preferred
      : other
    : (align === "end") !== rtl
      ? anchor.right - panel.width
      : anchor.left;
  const below = anchor.bottom + 4;
  const y = submenu ? anchor.top : below <= maxY ? below : anchor.top - panel.height - 4;
  const boundedX = Math.max(minX, Math.min(x, maxX));
  return {
    inlineStart: rtl ? layoutWidth - boundedX - panel.width : boundedX,
    blockStart: Math.max(minY, Math.min(y, maxY)),
  };
};
