import { Button } from "./button";
import { LayerCard } from "./layer-card";
import { useId } from "hono/jsx";
import { Toast } from "./toast";
import { classes, type ElementProps } from "./types";

/** 着色の一区切り。 */
export type CodeToken = {
  /** 区切りの文字列。改行を含めてよい。全てのcontentをつなぐとcodeと同じになるようにする。 */
  content: string;
  /** 文字の色（CSSの色の値）。渡さなければ地の文字の色で書く。空白だけの区切りには色を付けない。 */
  color?: string;
};
export type CodeBlockProps = ElementProps<"figure"> & {
  /** 表示してコピーするコードの全文。改行と字下げをそのまま保ち、HTMLも文字として書く。 */
  code: string;
  /** コードの名前（ファイル名や用途）。見出しの行と、コード領域のaria-labelにする。 */
  label: string;
  /**
   * 着色した区切りの並び。全てのcontentをつないだ文字列がcodeと一致する時だけ使い、
   * 一致しなければ着色せずにcodeを書く。ハイライトは利用側で行う（Shikiの結果などを渡す）。
   */
  tokens?: readonly CodeToken[];
  /**
   * 見出しの行にコピーの操作を置く。クリップボードに書き込める環境でだけ表示し、結果をToastで知らせる。
   * 成功はrole="status"の成功の色、失敗はrole="alert"の危険の色で知らせる。
   * ClipboardController・CodeBlockController・ToastControllerの登録が要る。
   */
  copy?: boolean;
  /** 行の先頭に番号を振る。番号はコピーする内容に含めない。 */
  lineNumbers?: boolean;
  /** 淡い黄色の地で目印にする行（1から数える）。 */
  highlight?: readonly number[];
};

/** トークンも通常の文字としてエスケープし、表示とコピーの内容を一致させる。 */
export const CodeBlock = ({
  code,
  label,
  tokens,
  copy = false,
  lineNumbers = false,
  highlight,
  class: className,
  ...attributes
}: CodeBlockProps) => {
  const highlighted = tokens?.map(({ content }) => content).join("") === code ? tokens : undefined;
  const notificationId = `code-copy-${useId()}`;
  const segments: CodeToken[] = [];
  for (const token of highlighted ?? []) {
    const previous = segments.at(-1);
    if (previous && previous.color === token.color) previous.content += token.content;
    else segments.push({ ...token });
  }
  // 行ごとに分け、改行は各行の末尾に残して、表示とコピーの内容を元のコードと一致させる。
  const lines: CodeToken[][] = [[]];
  for (const segment of highlighted ? segments : [{ content: code }]) {
    segment.content.split("\n").forEach((part, index) => {
      if (index) lines.push([]);
      if (part) lines.at(-1)?.push({ ...segment, content: part });
    });
  }
  return (
    <figure
      {...attributes}
      class={classes("rx-code-block", className)}
      data-line-numbers={lineNumbers ? "true" : undefined}
      data-controller={
        copy
          ? classes("clipboard code-block", attributes["data-controller"])
          : attributes["data-controller"]
      }
    >
      {/* 名前とコピーはLayerCardの層の見出しの行に置き、コードは層の上のカードに書く。 */}
      <LayerCard
        title={label}
        actions={
          copy && (
            <Button
              size="compact"
              aria-label={`${label}をコピー`}
              data-clipboard-target="trigger"
              data-code-block-target="copy"
              hidden
            >
              コピー
            </Button>
          )
        }
      >
        <pre tabindex={0} role="region" aria-label={label}>
          <code data-clipboard-target={copy ? "source" : undefined}>
            {lines.map((line, index) => (
              <span
                class="line"
                data-highlighted={highlight?.includes(index + 1) ? "true" : undefined}
              >
                {line.map(({ content, color }) =>
                  color && content.trim() ? <span style={{ color }}>{content}</span> : content,
                )}
                {index < lines.length - 1 && "\n"}
              </span>
            ))}
          </code>
        </pre>
      </LayerCard>
      {/* 成功は控えめに読み上げ、失敗は直し方を急いで伝えるので、知らせを分けて持つ。 */}
      {copy && (
        <Toast id={`${notificationId}-done`} tone="success" closeLabel="コピー結果の通知を閉じる">
          <span data-code-block-target="status" />
        </Toast>
      )}
      {copy && (
        <Toast
          id={`${notificationId}-failed`}
          tone="danger"
          live="assertive"
          closeLabel="コピー結果の通知を閉じる"
        >
          <span data-code-block-target="status" />
        </Toast>
      )}
    </figure>
  );
};
