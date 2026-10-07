export type WingSide = "start" | "end";
export type WingState = Partial<Record<WingSide, boolean>>;

/** cookie名に使えない文字を避けるため、保存キーはURLエンコードして名前へ含める。 */
export const wingCookieName = (storageKey: string) => `rx-wing-${encodeURIComponent(storageKey)}`;

/** 「start=open&end=closed」の形式を読む。不明な値は無視して初期状態に任せる。 */
export const parseWingState = (value?: string): WingState => {
  const state: WingState = {};
  if (!value) return state;
  const params = new URLSearchParams(value);
  for (const side of ["start", "end"] as const) {
    const entry = params.get(side);
    if (entry === "open") state[side] = true;
    else if (entry === "closed") state[side] = false;
  }
  return state;
};

export const serializeWingState = (state: WingState) =>
  (["start", "end"] as const)
    .flatMap((side) => {
      const open = state[side];
      return open === undefined ? [] : [`${side}=${open ? "open" : "closed"}`];
    })
    .join("&");
