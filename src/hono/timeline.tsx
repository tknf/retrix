import type { Child } from "hono/jsx";
import { Divider } from "./divider";
import { classes, type ElementProps } from "./types";

export type TimelineProps = ElementProps<"ol"> & {
  /** 一覧（ol）の読み上げ名。 */
  label: string;
  /**
   * activityは出来事の記録。milestonesは節目で、stateの違いをマーカーと線で描き分ける。
   * compactは行の間を詰め、題名を普通の太さにする。
   */
  variant?: "activity" | "milestones" | "compact";
  /** 出来事。渡した順に並べるので、時系列の順は利用側でそろえる。 */
  items: readonly {
    /** 機械可読の日時。time要素のdatetimeに入れる。 */
    datetime: string;
    /** 表示する時刻や日付の文。 */
    time: string;
    /** 題名。 */
    title: string;
    /** 題名の下に置く中身（本文・添付など）。 */
    content?: Child;
    /**
     * 節目の状態。`complete`は終えたもの、`current`は今のもの、`upcoming`はこれから。
     * 読み上げでは題名の前に「完了：」「進行中：」「予定：」を添え、マーカーと線の描き分けはmilestonesの時だけ行う。
     */
    state?: "complete" | "current" | "upcoming";
    /** 出来事を起こした人。線の上のマーカーの代わりにアバターを置く。 */
    avatar?: Child;
    /** 起こした人の名前。題名の前に太字で置き、題名は普通の太さにする。 */
    actor?: string;
    /** この出来事から始まる日の名前（「今日」「9月14日（月）」など）。黒い太字の名前と、縦の線から横へ伸びる帯で日を区切る（中身はDivider）。 */
    day?: string;
    /**
     * 出来事の種類。`event`は人の出来事。`system`は移動・自動で閉じたなどのシステムの出来事で、淡い灰色の帯の中央に書く。
     * `gap`は何もなかった期間で、線を破線にし、時刻を出さずに淡い文だけを置く（「60日間、出来事はありません」）。
     */
    kind?: "event" | "system" | "gap";
  }[];
};
export const Timeline = ({
  label,
  items,
  variant = "activity",
  class: className,
  ...attributes
}: TimelineProps) => (
  <ol
    {...attributes}
    class={classes("rx-timeline", className)}
    aria-label={label}
    data-variant={variant}
    data-avatars={items.some((item) => item.avatar != null) ? "true" : undefined}
  >
    {items.map((item) => (
      <>
        {item.day && (
          <li class="day">
            <Divider label={item.day} />
          </li>
        )}
        <li
          data-state={item.state}
          data-actor={item.actor ? "true" : undefined}
          data-kind={item.kind && item.kind !== "event" ? item.kind : undefined}
        >
          <span class="marker" aria-hidden={item.avatar == null ? "true" : undefined}>
            {item.avatar}
          </span>
          <time datetime={item.datetime}>{item.time}</time>
          <div class="body">
            <p class="title">
              {item.state && (
                <span class="rx-visually-hidden">
                  {item.state === "complete"
                    ? "完了："
                    : item.state === "current"
                      ? "進行中："
                      : "予定："}
                </span>
              )}
              {item.actor && <strong class="actor">{item.actor}</strong>}
              {item.title}
            </p>
            {item.content}
          </div>
        </li>
      </>
    ))}
  </ol>
);
