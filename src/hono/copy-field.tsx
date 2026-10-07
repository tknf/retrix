import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Field, Input } from "./field";
import { Icon } from "./icon";

export type CopyFieldProps = {
  /** 欄のid。ラベルと補足の関連付けに使う。 */
  id: string;
  /** 欄のラベル。 */
  label: string;
  /** コピーする値。読み取り専用の欄に出し、送信はしない。 */
  value: string;
  /** 欄の下に出す淡い補足。 */
  help?: string;
  /** コピーボタンの読み上げ名とツールチップ。 */
  copyLabel?: string;
  /** コピーできた時に読み上げる文言。 */
  copiedLabel?: string;
  /** コピーできなかった時に欄の下へ出し、読み上げる文言。欄の値を選んでコピーする方法を含める。 */
  failedLabel?: string;
  /** 欄の末尾に置く操作（リンクを作り直すなど）。 */
  actions?: Child;
};

/**
 * 公開リンクや招待リンクのような、コピーして使う値の欄。コピーは欄の末尾のアイコンだけのコピーボタンで行い、
 * コピーするとチェックに変わり、しばらくして元に戻る。コピーできなかった時は欄の下に`failedLabel`を出す。
 * コピーの処理はClipboardController、結果の表示はCopyFieldControllerが持ち、コピーボタンは接続してから出す。
 */
export const CopyField = ({
  id,
  label,
  value,
  help,
  copyLabel = "コピー",
  copiedLabel = "コピーしました",
  failedLabel = "コピーできませんでした。欄の値を選んでコピーしてください。",
  actions,
}: CopyFieldProps) => (
  <div
    class="rx-copy-field"
    data-controller="clipboard copy-field"
    data-copy-field-copied-value={copiedLabel}
  >
    <Field id={id} label={label} help={help}>
      {(control) => (
        <div class="row">
          <Input
            {...control}
            value={value}
            readonly
            data-clipboard-target="source"
            data-action="focus->copy-field#select"
          />
          <Button
            data-icon-only="true"
            aria-label={copyLabel}
            title={copyLabel}
            data-clipboard-target="trigger"
            data-copy-field-target="trigger"
            hidden
          >
            <Icon name="copy" class="copy" />
            <Icon name="check" class="copied" />
          </Button>
          {actions}
        </div>
      )}
    </Field>
    <p class="failure" data-copy-field-target="failure" hidden>
      <Icon name="x-circle" />
      <span>{failedLabel}</span>
    </p>
    <p class="rx-visually-hidden" role="status" data-copy-field-target="status" />
  </div>
);
