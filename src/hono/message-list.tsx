import type { Child } from "hono/jsx";
import { Badge } from "./badge";
import { Divider } from "./divider";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

export type MessageListItem = {
  /** 連絡を識別する値。行のdata-message-idに入れ、newSinceの位置合わせにも使う。 */
  id: string;
  /** 差出人の名前。空白だけの時は「差出人不明」と出す。 */
  sender: string;
  /** 件名。空白だけの時は「（件名なし）」と出す。一行に収まらない分は省略する（幅が30rem未満では二行まで折り返す）。 */
  title: string;
  /** 本文の書き出し。差出人の後ろに続け、previewLinesの行数に収まらない分は省略する。 */
  preview?: string;
  /** 行を開く移動先。省略すると行はリンクにならない。 */
  href?: string;
  /** 行の末尾に出す時刻の文字。書式は利用側で決める。 */
  time?: string;
  /** timeに対応する機械可読の日時。日時として読める値の時だけtime要素にする。 */
  datetime?: string;
  /** 差出人のアバター（Avatarなど）。一覧のどれかの行に渡すと全ての行にアバターの列を設け、無い行には手紙のアイコンを置く。 */
  avatar?: Child;
  /** 未読。件名と差出人を太字にし、時刻の後ろに青い点と読み上げ用の「未読」を添える。 */
  unread?: boolean;
  /** 今開いている連絡。行を淡い青の背景にし、aria-current="page"を付ける。 */
  current?: boolean;
  /** 会話の件数。2以上の時だけ件名の後ろに数を出す。 */
  threadCount?: number;
  /** 添付ファイルの数。1以上の時だけ件名の後ろにファイルのアイコンと数を出す。 */
  attachments?: number;
  /** 送信の状態。件名の前にバッジを置く（draftは「下書き」、sendingは「送信中」で行を控えめに、failedは赤い「送信失敗」）。 */
  state?: "draft" | "sending" | "failed";
  /** 閲覧できない理由。指定するとstateより優先して「閲覧不可」のバッジを出し、書き出しの位置に理由を出す。 */
  unavailableReason?: string;
};
export type MessageListProps = ElementProps<"ul"> & {
  /** 一覧の名前。ulのaria-labelに入れる。 */
  label: string;
  /** 並べる連絡。並び順と絞り込みは利用側で決める。 */
  items: readonly MessageListItem[];
  /** 一覧全体の状態。loadingとerrorでは行を出さず、一覧の場所に状態の文を出す。loadingではaria-busyを付ける。 */
  state?: "ready" | "loading" | "error";
  /** 状態の文の代わりに出す内容。readyでは0件の時の表示（empty）の代わりになる。 */
  stateContent?: Child;
  /** 書き出しの行数。1は差出人と書き出しを一行に並べ、2は差出人の下で書き出しを二行まで折り返す。 */
  previewLines?: 1 | 2;
  /** この項目の直前に区切りの線とラベルを置き、ここから新しいことを示す。 */
  newSince?: {
    /** 区切りを置く項目のid。この項目の直前に線とラベルを置く。一致する項目が無ければ何も置かない。 */
    id: string;
    /** 区切りのラベル。既定は「ここから新着」。 */
    label?: string;
  };
  /**
   * 連絡が一件もない時の表示。EmptyStateで描く。行を後から出し入れしても、行が一つもない時だけ見える。
   * 既定は「連絡はまだありません」。
   */
  empty?: {
    /** 空の時の題名。 */
    title: string;
    /** 題名の下に添える説明。 */
    description?: Child;
    /** EmptyStateの場面（`empty`・`start`・`complete`）。 */
    kind?: EmptyStateProps["kind"];
  };
};
export const MessageList = ({
  label,
  items,
  state = "ready",
  stateContent,
  previewLines = 1,
  newSince,
  empty = { title: "連絡はまだありません" },
  class: className,
  ...attributes
}: MessageListProps) => {
  const avatars = items.some((item) => item.avatar != null && item.avatar !== false);
  return (
    <ul
      {...attributes}
      class={classes("rx-message-list", className)}
      aria-label={label}
      aria-busy={state === "loading" ? "true" : undefined}
      data-state={state !== "ready" ? state : items.length === 0 ? "empty" : "ready"}
      data-avatars={String(avatars)}
      data-preview-lines={previewLines}
    >
      {/* ulの直下のliにはlistitem以外の役割を付けられないので、状態の文の役割は中の要素に付ける。 */}
      {state !== "ready" ? (
        <li class="state">
          <div role="status">
            {stateContent ??
              (state === "loading" ? "連絡を読み込んでいます…" : "連絡を読み込めませんでした。")}
          </div>
        </li>
      ) : (
        <li class="state" data-empty="true">
          <div role="status">
            {stateContent ?? (
              <EmptyState title={empty.title} kind={empty.kind}>
                {empty.description}
              </EmptyState>
            )}
          </div>
        </li>
      )}
      {state === "ready" &&
        items.map((item) => {
          const Row = item.href ? "a" : "div";
          const validDate = item.datetime && Number.isFinite(Date.parse(item.datetime));
          return (
            <>
              {newSince?.id === item.id && (
                <li class="divider">
                  <Divider label={newSince.label ?? "ここから新着"} />
                </li>
              )}
              <li
                data-message-id={item.id}
                data-unread={item.unread ? "true" : "false"}
                data-current={item.current ? "true" : undefined}
                data-state={item.state}
                data-unavailable={item.unavailableReason ? "true" : undefined}
              >
                <Row class="row" href={item.href} aria-current={item.current ? "page" : undefined}>
                  {avatars && (
                    <span class="avatar" aria-hidden="true">
                      {item.avatar ?? <Icon name="mail" />}
                    </span>
                  )}
                  <span class="body">
                    <strong class="title">
                      {/* 状態（「下書き」など）は、件名の前に共通のBadgeで置く。 */}
                      {(item.state || item.unavailableReason) && (
                        <Badge
                          class="state"
                          tone={
                            !item.unavailableReason && item.state === "failed"
                              ? "danger"
                              : "neutral"
                          }
                          draft={!item.unavailableReason && item.state === "draft"}
                        >
                          {item.unavailableReason
                            ? "閲覧不可"
                            : item.state === "draft"
                              ? "下書き"
                              : item.state === "sending"
                                ? "送信中"
                                : "送信失敗"}
                        </Badge>
                      )}
                      <span class="subject">{item.title.trim() || "（件名なし）"}</span>
                      {/* spanにはaria-labelを付けられないので、見える数は読み上げから外し、読み上げ用の文を添える。 */}
                      {item.threadCount != null && item.threadCount > 1 && (
                        <span class="count">
                          <span aria-hidden="true">{item.threadCount}</span>
                          <span class="rx-visually-hidden">{`${item.threadCount}件の会話`}</span>
                        </span>
                      )}
                      {item.attachments != null && item.attachments > 0 && (
                        <span class="attachment">
                          <Icon name="file" />
                          <span aria-hidden="true">{item.attachments}</span>
                          <span class="rx-visually-hidden">{`添付ファイル${item.attachments}件`}</span>
                        </span>
                      )}
                    </strong>
                    <span class="summary">
                      <span class="sender">{item.sender.trim() || "差出人不明"}</span>
                      {(item.unavailableReason ?? item.preview) && (
                        <span class="preview">{item.unavailableReason ?? item.preview}</span>
                      )}
                    </span>
                  </span>
                  <span class="meta">
                    {item.time &&
                      (validDate ? (
                        <time datetime={item.datetime}>{item.time}</time>
                      ) : (
                        <span>{item.time}</span>
                      ))}
                    <span class="unread" hidden={!item.unread}>
                      <span class="rx-visually-hidden">未読</span>
                    </span>
                  </span>
                </Row>
              </li>
            </>
          );
        })}
    </ul>
  );
};
