import type { PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps, type Tone } from "./types";
import { Icon } from "./icon";

export type NoticeProps = PropsWithChildren<
  ElementProps<"aside"> & {
    /** 通知の役割。アイコンと題名のピルをその色で塗り、アイコンはsuccessでチェック、dangerでバツ、他はiを置く。 */
    tone?: Exclude<Tone, "neutral">;
    /** 題名。ピルに書き、asideの読み上げ名（aria-label）にもする。 */
    label: string;
    /** 題名をh2で書く。ページの節の見出しとして読ませる時に使う。既定はp。 */
    heading?: boolean;
  }
>;
/** 通知は本文のそばへ置く。読み上げを必要とする動的な更新では利用側でroleを指定する。 */
export const Notice = ({
  children,
  tone = "info",
  label,
  heading = false,
  class: className,
  ...attributes
}: NoticeProps) => (
  <aside
    {...attributes}
    class={classes("rx-notice", className)}
    data-tone={tone}
    aria-label={label}
  >
    {/* アイコンと題名を一つのピルにまとめ、カードの上の縁にまたがせる。 */}
    <div class="heading">
      <span class="symbol" aria-hidden="true">
        <Icon name={tone === "success" ? "check" : tone === "danger" ? "x" : "info"} />
      </span>
      {heading ? <h2 class="title">{label}</h2> : <p class="title">{label}</p>}
    </div>
    <div class="body">{children}</div>
  </aside>
);
