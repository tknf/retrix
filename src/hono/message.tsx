import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type MessageProps = PropsWithChildren<
  ElementProps<"article"> & {
    /** 投稿者の名前。見出しの行に太字で置く。 */
    author: string;
    /**
     * 見せ方。conversationは本文を淡い吹き出しにし、documentは一通を一枚のカードにして日付を見出しの行の末尾に寄せる。
     * documentを続けて置くと、カードを少し重ねてひとまとまりに見せる。
     */
    layout?: "conversation" | "document";
    /** 投稿者のアバター（Avatarなど）。名前の行の横に置き、読み上げからは外す（名前はauthorで読む）。 */
    avatar?: Child;
    /** 見出しの行に出す時刻の文字。書式は利用側で決める。 */
    time: string;
    /** timeに対応する機械可読の日時。time要素のdatetime属性に入れる。 */
    datetime: string;
    /** 本文の下に並べる操作（返信・リンクのコピーなど）。footerとして描く。 */
    actions?: Child;
    /** 返信のMessage。本文の下に積み、avatarがある時はアバターから下ろした線でつなぐ。 */
    replies?: Child;
  }
>;
export const Message = ({
  author,
  layout = "conversation",
  avatar,
  time,
  datetime,
  actions,
  replies,
  children,
  class: className,
  ...attributes
}: MessageProps) => (
  <article {...attributes} class={classes("rx-message", className)} data-layout={layout}>
    {avatar != null && avatar !== false && (
      <div class="avatar" aria-hidden="true">
        {avatar}
      </div>
    )}
    <header class="heading">
      <strong>{author}</strong>
      <time datetime={datetime}>{time}</time>
    </header>
    <div class="body">{children}</div>
    {actions != null && actions !== false && <footer class="actions">{actions}</footer>}
    {replies != null && replies !== false && <div class="replies">{replies}</div>}
  </article>
);
