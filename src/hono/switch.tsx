import { useId } from "hono/jsx";
import type { ElementProps } from "./types";
export type SwitchProps = Omit<ElementProps<"input">, "type"> & {
  /** 設定の名前。スイッチの読み上げ名になる（aria-labelかaria-labelledbyを渡すとそちらを使う）。 */
  label: string;
  /** 名前の下に添える淡い説明。スイッチの説明として読み上げる。 */
  description?: string;
};
/** 標準のcheckboxにrole="switch"を付けた、オン・オフの切り替え。残りの属性はinputへ渡す。 */
export const Switch = ({ id, label, description, ...attributes }: SwitchProps) => {
  const generatedId = useId();
  const inputId = id ?? `rx-switch-${generatedId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const describedBy =
    [attributes["aria-describedby"], descriptionId].filter(Boolean).join(" ") || undefined;

  return (
    <label class="rx-switch" for={inputId} dir={attributes.dir}>
      <input
        {...attributes}
        id={inputId}
        type="checkbox"
        role="switch"
        aria-labelledby={
          attributes["aria-labelledby"] ?? (attributes["aria-label"] ? undefined : labelId)
        }
        aria-describedby={describedBy}
      />
      <span>
        <span id={labelId}>{label}</span>
        {description && <small id={descriptionId}>{description}</small>}
      </span>
    </label>
  );
};
