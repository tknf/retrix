import { Input } from "./field";
import type { ElementProps } from "./types";

/** 日付の入力。標準のdate入力で、値はYYYY-MM-DD。変更を取り消せるイベントを追加する。 */
export const DateField = (attributes: Omit<ElementProps<"input">, "type">) => (
  <Input {...attributes} type="date" data-controller="date-field" />
);
