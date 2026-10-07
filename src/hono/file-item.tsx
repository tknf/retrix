import type { Child } from "hono/jsx";
import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

export type FileItemProps = ElementProps<"div"> & {
  /** ファイル名。長い名前も省略せずに折り返す。 */
  name: string;
  /** 名前の下に淡い文字で添える形式・サイズ・日付など。エラーの時は直し方を書く。 */
  description: string;
  /** 渡すと名前をリンクにする。開く・ダウンロードするURLは利用側が用意する。 */
  href?: string;
  /**
   * readyは通常の表示。pendingはアイコンを控えめにして説明の前に「待機中 · 」を、
   * errorはアイコンと文言を危険の色にして「送信失敗 · 」を付ける。送信や再送の処理は利用側が持つ。
   */
  state?: "ready" | "pending" | "error";
  /** 行の末尾に置く操作（確認・再送信など）。広い幅では右端、狭い幅では名前の下に積む。 */
  actions?: Child;
  /** 画像やPDFの1ページ目のサムネイル。渡すとファイルのアイコンの代わりに中身を見せる。 */
  preview?: Child;
};
export const FileItem = ({
  name,
  description,
  href,
  state = "ready",
  actions,
  preview,
  class: className,
  ...attributes
}: FileItemProps) => (
  <div {...attributes} class={classes("rx-file-item", className)} data-state={state}>
    {preview != null && preview !== false ? (
      <span class="preview">{preview}</span>
    ) : (
      <span class="icon">
        <Icon name="file" />
      </span>
    )}
    <div class="body">
      <p class="title">{href ? <a href={href}>{name}</a> : <strong>{name}</strong>}</p>
      <p class="description">
        {state === "pending" && <span class="state">待機中 · </span>}
        {state === "error" && <span class="state">送信失敗 · </span>}
        {description}
      </p>
    </div>
    {actions != null && actions !== false && <div class="actions">{actions}</div>}
  </div>
);
