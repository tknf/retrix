import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Icon, type IconName } from "./icon";
import { classes, type ElementProps } from "./types";

export type OptionalField = {
  /** 項目のid。欄の置き場は`<id>-slot`になり、optional-fields:addのdetail.idで返る。画面内で一意にする。 */
  id: string;
  /** チップに出す項目名。 */
  label: string;
  /** チップの名前の前に置くアイコン。省略するとplus。 */
  icon?: IconName;
  /** 押した時に現れる欄。隠れている間は中の入力を使えなくし、送信しない。 */
  field: Child;
  /** 最初から出しておく（値が入っている時など）。 */
  open?: boolean;
};
export type OptionalFieldsProps = ElementProps<"div"> & {
  /** チップの並びの読み上げ名（「予定に追加する項目」など）。 */
  label: string;
  /** 追加できる項目。並べた順にチップと欄を置く。 */
  items: readonly OptionalField[];
  /** inlineは予定の入力のようにチップを横に並べ（既定）、stackは検索の条件のように縦に並べる。 */
  layout?: "inline" | "stack";
};

/**
 * 予定のリンク・場所・招待・メモ・繰り返しや検索の条件のように、必要な時だけ追加する欄。
 * 追加できる項目をチップで並べ、押すとその欄が現れてチップは消える。欄の削除操作で元のチップへ戻す。
 * 長いフォームを短く見せる。JavaScriptが無い時は全ての欄を出し、チップと削除操作は出さない。
 */
export const OptionalFields = ({
  label,
  items,
  layout = "inline",
  class: className,
  ...attributes
}: OptionalFieldsProps) => (
  <div
    {...attributes}
    class={classes("rx-optional-fields", className)}
    data-controller="optional-fields"
    data-layout={layout}
  >
    <div class="fields">
      {items.map((item) => (
        <fieldset
          class="field"
          id={`${item.id}-slot`}
          data-open={item.open ? "true" : "false"}
          data-optional-fields-target="field"
        >
          {item.field}
          <Button
            class="remove"
            variant="link"
            data-icon-only="true"
            aria-label={`${item.label}を削除`}
            title={`${item.label}を削除`}
            data-action="optional-fields#remove"
            hidden
          >
            <Icon name="x" />
          </Button>
        </fieldset>
      ))}
    </div>
    <div class="chips" role="group" aria-label={label}>
      {items.map((item) => (
        <Button
          class="chip"
          size="compact"
          aria-controls={`${item.id}-slot`}
          aria-expanded={item.open ? "true" : "false"}
          hidden
          data-action="optional-fields#add"
        >
          <Icon name={item.icon ?? "plus"} />
          {item.label}
        </Button>
      ))}
    </div>
  </div>
);
