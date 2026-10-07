type CalendarGeometry = {
  anchor: Pick<DOMRectReadOnly, "top" | "right" | "bottom" | "left">;
  panel: Pick<DOMRectReadOnly, "width" | "height">;
  viewport: { width: number; height: number; offsetLeft: number; offsetTop: number };
  layoutWidth: number;
  rtl: boolean;
};

/** 入力欄の末尾側の端に揃え、表示領域から8pxの余白を取って配置する。 */
export const calendarPosition = ({
  anchor,
  panel,
  viewport,
  layoutWidth,
  rtl,
}: CalendarGeometry) => {
  const x = Math.max(
    viewport.offsetLeft + 8,
    Math.min(
      rtl ? anchor.left : anchor.right - panel.width,
      viewport.offsetLeft + viewport.width - panel.width - 8,
    ),
  );
  const below = anchor.bottom + 8;
  const y = Math.max(
    viewport.offsetTop + 8,
    Math.min(
      below + panel.height <= viewport.offsetTop + viewport.height - 8
        ? below
        : anchor.top - panel.height - 8,
      viewport.offsetTop + viewport.height - panel.height - 8,
    ),
  );
  return {
    inlineStart: rtl ? layoutWidth - x - panel.width : x,
    blockStart: y,
  };
};
