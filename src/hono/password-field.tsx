import { Input } from "./field";
import { Icon } from "./icon";
import type { ElementProps } from "./types";

export type PasswordFieldProps = Omit<ElementProps<"input">, "type"> & {
  /** 入力のid。表示を切り替える操作のaria-controlsが指す。 */
  id: string;
  /** 隠している間の切り替え操作の読み上げ名。 */
  showLabel?: string;
  /** 見せている間の切り替え操作の読み上げ名。 */
  hideLabel?: string;
};

/** 表示と非表示を切り替えられるパスワードの入力。残りの属性はinputへ渡す。 */
export const PasswordField = ({
  id,
  showLabel = "パスワードを表示",
  hideLabel = "パスワードを隠す",
  ...attributes
}: PasswordFieldProps) => (
  <div
    class="rx-password"
    data-controller="password-field"
    data-password-field-show-label-value={showLabel}
    data-password-field-hide-label-value={hideLabel}
  >
    <Input {...attributes} id={id} type="password" data-password-field-target="input" />
    <button
      class="toggle"
      type="button"
      disabled={attributes.disabled}
      data-password-field-target="toggle"
      data-state="hidden"
      aria-controls={id}
    >
      <span class="show">
        <Icon name="eye" />
      </span>
      <span class="hide">
        <Icon name="eye-slash" />
      </span>
    </button>
  </div>
);
