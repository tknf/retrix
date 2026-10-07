import type { Child } from "hono/jsx";
import { Button, type ButtonProps } from "./button";
import { Input } from "./field";
import { NumberField } from "./number-field";
import { classes, type ElementProps } from "./types";

export type InputGroupAction = Omit<ButtonProps, "children" | "size"> & {
  /** 操作の文言。残りはButtonのpropsとして渡す（送信するならtype: "submit"）。 */
  label: string;
};
export type InputGroupProps = Omit<ElementProps<"input">, "children" | "prefix" | "size"> & {
  /** 入力のid。接頭辞（`<id>-prefix`）と接尾辞（`<id>-suffix`）のidの元になる。 */
  id: string;
  /** 入力の前に置く接頭辞（「¥」「https://」やアイコン）。入力の説明として読み上げる。 */
  prefix?: Child;
  /** 入力の後に置く単位や接尾辞（「人」「.example.jp」など）。入力の説明として読み上げる。 */
  suffix?: Child;
  /** defaultは通常の高さ、largeは高く大きい文字にする。actionのボタンも同じ大きさにそろえる。 */
  size?: "default" | "large";
  /** 枠の外の末尾に並べる操作のボタン。入力がdisabledの時はボタンも使えなくする。 */
  action?: InputGroupAction;
};

/** 接頭辞・単位と入力を一つの枠に並べ、操作のボタンを添える。残りの属性は入力へ渡し、type="number"ならNumberFieldにする。 */
export const InputGroup = ({
  id,
  prefix,
  suffix,
  size = "default",
  action,
  class: className,
  ...attributes
}: InputGroupProps) => {
  const hasPrefix =
    prefix !== undefined && prefix !== null && typeof prefix !== "boolean" && prefix !== "";
  const hasSuffix =
    suffix !== undefined && suffix !== null && typeof suffix !== "boolean" && suffix !== "";
  const describedBy =
    [
      attributes["aria-describedby"],
      hasPrefix ? `${id}-prefix` : undefined,
      hasSuffix ? `${id}-suffix` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const Control = attributes.type === "number" ? NumberField : Input;
  const { label: actionLabel, ...actionAttributes } = action ?? { label: "" };

  return (
    <div class={classes("rx-input-group", className)} dir={attributes.dir}>
      <div class="control" data-size={size}>
        {hasPrefix && (
          <span class="affix" id={`${id}-prefix`}>
            {prefix}
          </span>
        )}
        <Control {...attributes} id={id} data-size={size} aria-describedby={describedBy} />
        {hasSuffix && (
          <span class="affix" id={`${id}-suffix`}>
            {suffix}
          </span>
        )}
      </div>
      {action && (
        <Button {...actionAttributes} size={size} disabled={attributes.disabled || action.disabled}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
