import { classes, type ElementProps } from "./types";
import { Icon } from "./icon";

export type ErrorSummaryProps = ElementProps<"aside"> & {
  /** 見出しに太字で書く題名。読み上げ名（aria-label）にもする。 */
  title?: string;
  /**
   * 直すところの一覧。labelは直し方の文、hrefは直す欄へのリンク（欄のidを指す`#id`）。
   * 空の配列を渡すと何も描かない。
   */
  errors: readonly {
    /** 直し方の文。リンクの文字になる。 */
    label: string;
    /** 直す欄へのリンク。欄のidを指す`#id`にする。 */
    href: string;
  }[];
};
/**
 * 直すところを、各欄へ移るリンクの一覧にまとめる。形はNoticeの危険の役割（アイコンと太字の見出し）で、色はBC2のログインの画面のエラーの箱
 * （淡い黄色の面、1pxの黄色の枠、赤い見出し）。ErrorSummaryが持つのは色と直す欄への一覧。
 * tabindex="-1"を持つので、送信後に再描画したページではautofocusを渡すと、読み込んだ時にフォーカスが移る。
 */
export const ErrorSummary = ({
  title = "入力内容を確認してください",
  errors,
  class: className,
  ...attributes
}: ErrorSummaryProps) =>
  errors.length === 0 ? null : (
    <aside
      {...attributes}
      class={classes("rx-notice rx-error-summary", className)}
      data-tone="danger"
      aria-label={title}
      tabindex={-1}
    >
      <div class="heading">
        <span class="symbol" aria-hidden="true">
          <Icon name="x" />
        </span>
        <h2 class="title">{title}</h2>
      </div>
      <div class="body">
        <ul>
          {errors.map((error) => (
            <li>
              <a href={error.href}>{error.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
