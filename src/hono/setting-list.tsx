import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type SettingListItem = {
  /** 設定の名前。太字にする。操作の名前（aria-labelなど）は利用側がcontrolに付ける。 */
  label: string;
  /** 名前の下に添える淡い補足（メールアドレスなど）。 */
  description?: Child;
  /** 名前の前に置くアバターやアイコン。 */
  leading?: Child;
  /** 行の末尾に置く操作（Switch・チェック・役割の丸など）。 */
  control: Child;
};
export type SettingListProps = ElementProps<"ul"> & {
  /** 一覧の名前。ulのaria-labelに入れる。 */
  label: string;
  /** 並べる設定の行。 */
  items: readonly SettingListItem[];
};

/**
 * 名前と行の末尾の操作を点線でつなぐ設定の行。
 * 「Everyone ……… スイッチ」「人の名前 ……… ✓」のように、どの名前にどの操作が付くかを目でたどれるようにする。
 */
export const SettingList = ({
  label,
  items,
  class: className,
  ...attributes
}: SettingListProps) => (
  <ul {...attributes} class={classes("rx-setting-list", className)} aria-label={label}>
    {items.map((item) => (
      <li>
        {item.leading != null && item.leading !== false && (
          <span class="leading">{item.leading}</span>
        )}
        <span class="text">
          <span class="name">{item.label}</span>
          {item.description != null && item.description !== false && (
            <small class="description">{item.description}</small>
          )}
        </span>
        <span class="leader" aria-hidden="true" />
        <span class="control">{item.control}</span>
      </li>
    ))}
  </ul>
);
