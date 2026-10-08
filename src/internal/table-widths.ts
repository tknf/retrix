/** 列の幅（px）。幅を決めていない列はnull。 */
export type TableWidths = (number | null)[];

/** 列の幅の下限と上限（px）。 */
export const tableWidthMin = 48;
export const tableWidthMax = 1200;

/** cookie名に使えない文字を避けるため、保存キーはURLエンコードして名前へ含める。 */
export const tableWidthsCookieName = (storageKey: string) =>
  `rx-table-widths-${encodeURIComponent(storageKey)}`;

/** 「120,240,,96」の形式を読む。数でない値や範囲の外の値は、幅を決めていない列として扱う。 */
export const parseTableWidths = (value?: string): TableWidths => {
  if (!value) return [];
  return value.split(",").map((entry) => {
    if (entry === "") return null;
    const width = Number(entry);
    return Number.isInteger(width) && width >= tableWidthMin && width <= tableWidthMax
      ? width
      : null;
  });
};

export const serializeTableWidths = (widths: TableWidths) =>
  widths.map((width) => (width === null ? "" : String(Math.round(width)))).join(",");
