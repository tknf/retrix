import type { Child } from "hono/jsx";
import { Choice } from "./field";
import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

export type TaskListProps = ElementProps<"div"> & {
  /** 行の一覧（ul）の読み上げ名。 */
  label: string;
  /** 一覧の外側の見出し。開閉でき、終えた数と進み具合を添える。 */
  heading?: string;
  /** 行の一覧の上に書く、この一覧の名前。 */
  title?: string;
  /** 最後の行に置く、項目を追加する欄。送信と追加は利用側のフォームで扱う。 */
  add?: {
    /** 追加した文を送る名前。 */
    name: string;
    /** 欄のプレースホルダー。欄の読み上げ名にも使う。 */
    placeholder: string;
    /** 一覧の外にあるフォームのid。欄をそのフォームで送る。 */
    form?: string;
  };
  /** 行の一覧。各行は標準のcheckbox。 */
  items: readonly {
    /** checkboxをフォームで送る名前。 */
    name: string;
    /** 項目の題名。checkboxのラベルになる。 */
    label: string;
    /** 終えた項目。チェックを付け、題名と補足を一段小さい灰色の文字にする。 */
    checked?: boolean;
    /** 操作できない項目。 */
    disabled?: boolean;
    /** 題名の後ろに灰色のピルで添える補足（担当・期日など）。 */
    detail?: Child;
    /** checkboxの値。省くと標準どおり`on`を送る。 */
    value?: string;
    /** 行の末尾に置く要素（AvatarやBadgeなど）。 */
    end?: Child;
  }[];
};
export const TaskList = ({
  label,
  heading,
  title,
  add,
  items,
  class: className,
  ...attributes
}: TaskListProps) => {
  const sheet = (
    <ul class="sheet" aria-label={label}>
      {title && (
        <li class="heading">
          <h3 class="title">{title}</h3>
        </li>
      )}
      {items.map((item) => (
        <li>
          <Choice
            name={item.name}
            value={item.value}
            checked={item.checked}
            disabled={item.disabled}
            label={item.label}
            description={item.detail}
          />
          {item.end != null && <div class="end">{item.end}</div>}
        </li>
      ))}
      {add && (
        <li class="add">
          <span class="plus" aria-hidden="true">
            <Icon name="plus" />
          </span>
          <input
            class="entry"
            type="text"
            name={add.name}
            form={add.form}
            placeholder={add.placeholder}
            aria-label={add.placeholder}
            autocomplete="off"
          />
        </li>
      )}
    </ul>
  );
  if (!heading)
    return (
      <div {...attributes} class={classes("rx-task-list", className)}>
        {sheet}
      </div>
    );
  const done = items.filter((item) => item.checked).length;
  const action = ["change->task-list#update", attributes["data-action"]].filter(Boolean).join(" ");
  const controller = ["task-list", attributes["data-controller"]].filter(Boolean).join(" ");
  return (
    <details
      {...attributes}
      class={classes("rx-task-list", className)}
      open
      data-controller={controller}
      data-action={action}
      style={`--rx-task-progress: ${items.length ? done / items.length : 0}`}
      data-complete={items.length > 0 && done === items.length ? "true" : undefined}
    >
      <summary>
        <span class="marker" aria-hidden="true">
          <Icon name="caret" />
        </span>
        <span class="name">{heading}</span>
        {/* 終えた割合だけ塗る円と「終えた数/全体」で進み具合を示す。 */}
        <span class="pie" aria-hidden="true" />
        <span class="count">
          <span class="rx-visually-hidden">完了</span>
          <span data-task-list-target="done">{done}</span>/{items.length}
        </span>
      </summary>
      {sheet}
    </details>
  );
};
