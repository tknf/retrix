import type { Child } from "hono/jsx";

export type DividerProps = {
  /** 線の先頭に置く名前。文字のほか、選択（InlineSelectなど）も置ける。 */
  label?: Child;
  /** solidは確定した区切り、dashedは破線（ここから先はまだ確定していない）。 */
  line?: "solid" | "dashed";
  /**
   * 線の末尾に置く操作（ActionLinkなど）。「最近のファイル ——— ［すべて見る］」のように、
   * 区切りの後の項目をまとめて扱う操作だけを置く。
   */
  actions?: Child;
};

export const Divider = ({ label, line = "solid", actions }: DividerProps) => {
  const kind = line === "solid" ? undefined : line;
  const hasActions = actions != null && actions !== false;
  return label != null && label !== false ? (
    <div class="rx-divider" data-line={kind}>
      <span>{label}</span>
      {hasActions && <span class="actions">{actions}</span>}
    </div>
  ) : hasActions ? (
    <div class="rx-divider" data-line={kind} data-bare="true">
      <span class="actions">{actions}</span>
    </div>
  ) : (
    <hr class="rx-divider" data-line={kind} />
  );
};
