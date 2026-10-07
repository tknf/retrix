import { Input } from "./field";
import type { ElementProps } from "./types";

export type NumberFieldProps = Omit<ElementProps<"input">, "type"> & {
  /** PageUp・PageDownで動かすstepの数。正の整数にする（stepが1なら10ずつ動く）。 */
  pageStep?: number;
};

/** 数の入力。min・max・stepは標準のまま使い、PageUp・PageDownで大きく動かせる。 */
export const NumberField = ({ pageStep = 10, ...attributes }: NumberFieldProps) => (
  <Input
    {...attributes}
    type="number"
    data-controller="number-field"
    data-number-field-page-step-value={pageStep}
  />
);
