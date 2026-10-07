import { Input } from "./field";
import type { ElementProps } from "./types";

/** 時刻の入力。標準のtime入力で、値はHH:MM（stepによっては秒も）。変更を取り消せるイベントを追加する。 */
export const TimeField = (attributes: Omit<ElementProps<"input">, "type">) => (
  <Input {...attributes} type="time" data-controller="time-field" />
);
