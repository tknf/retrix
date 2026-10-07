import type { Child } from "hono/jsx";
import { Disclosure } from "./disclosure";
import { classes, type ElementProps } from "./types";

/** 凡例の一件。 */
export type ChartLegendItem = {
  /** 系列の名前。 */
  label: string;
  /** マークの色。図の系列の色と合わせる。 */
  tone: "blue" | "green" | "amber" | "coral";
};

export type ChartFrameProps = ElementProps<"figure"> & {
  /** 図の題名。figcaptionに太字で書く。 */
  title: string;
  /** 題名の下に淡い文字で書く図の要点。図を見なくても結論が分かる一文にする。 */
  description?: string;
  /** 利用側で描いた図（SVGなど）。読み上げから外すので、同じ値をtableで渡す。 */
  graphic: Child;
  /** graphicと同じ値の表。table要素を渡す。Disclosureに畳んで置く。 */
  table: Child;
  /** 数値の表を開く見出し。 */
  tableLabel: string;
  /** measureは幅36remまで、wideは置き場所の幅いっぱいに広げる。 */
  size?: "measure" | "wide";
  /** 図の下に並べる凡例。空なら置かない。 */
  legend?: readonly ChartLegendItem[];
  /** 図の最後に「出典：」を付けて書く出典。 */
  source?: string;
};

/** グラフ描画は利用側が持ち、同じ値を表で読めるようにする。 */
export const ChartFrame = ({
  title,
  description,
  graphic,
  table,
  tableLabel,
  size = "measure",
  legend = [],
  source,
  class: className,
  ...attributes
}: ChartFrameProps) => (
  <figure {...attributes} class={classes("rx-chart-frame", className)} data-size={size}>
    <figcaption>
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </figcaption>
    <div class="graphic" aria-hidden="true">
      {graphic}
    </div>
    {legend.length > 0 && (
      <ul class="legend" aria-label="凡例">
        {legend.map((item) => (
          <li data-tone={item.tone}>
            <span class="mark" aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    )}
    {/* 数値の表は他の開閉と同じDisclosureで畳む。表の見た目はrx-tableの枠が持つ。 */}
    <Disclosure class="data" summary={tableLabel}>
      {/* Tableは準備中の本文を隠すので、表示できる状態（ready）を明示する。 */}
      <div class="rx-table" data-state="ready">
        {table}
      </div>
    </Disclosure>
    {source && <p class="source">出典：{source}</p>}
  </figure>
);
