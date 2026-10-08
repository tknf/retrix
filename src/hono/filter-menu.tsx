import type { ButtonProps } from "./button";
import { Button } from "./button";
import { Icon, type IconName } from "./icon";
import { Keycap } from "./keycap";
import { overlayAnchorName } from "./overlay-content";

export type FilterMenuOption = {
  /** 選んだ時に発火する`filter-menu:select`の`detail.value`に入る値。nameがあれば送信する値にもなる。 */
  value: string;
  /** 候補の名前。絞り込みは、入力した文字をこの名前に含むかで決める（大文字と小文字は区別しない）。 */
  label: string;
  /** 選択マークの代わりに前に置くアイコン。渡すと、選択マークは行の末尾に出す。 */
  icon?: IconName;
  /** 表示用の補助表記。ショートカットの登録は利用側で行う。 */
  shortcut?: string;
  /** 最初から選んでおく。 */
  selected?: boolean;
  /** 選べない候補にする。矢印の移動でも飛ばす。 */
  disabled?: boolean;
};
export type FilterMenuProps = {
  /** パネルと候補のidの元。画面内で一意にする。パネルは`<id>-panel`、候補の一覧は`<id>-list`になる。 */
  id: string;
  /** 開く操作の名前。 */
  label: string;
  /** パネルの見出し（「ラベルを選ぶ」「担当を決める」など）。 */
  title: string;
  /** 候補。 */
  options: readonly FilterMenuOption[];
  /** 複数を選べる時（ラベル・タグ）。一つだけの時（担当）は選ぶと閉じる。 */
  multiple?: boolean;
  /** 渡すと、選んだ値をこの名前の隠し入力で送る。 */
  name?: string;
  /** 絞り込みの欄のプレースホルダー。欄の`aria-label`にもなる。 */
  placeholder?: string;
  /** 渡すと、絞り込みの欄の隣に「新しく作る」を置き、押すとfilter-menu:createイベントを発火して入力した文字を渡す。 */
  createLabel?: string;
  /** 当てはまる候補が無い時に出す文言。 */
  emptyLabel?: string;
  /** 開く操作の文言の前に置くアイコン。 */
  icon?: IconName;
  /** 開く操作をアイコンだけにする。iconが無ければ▾のマークを出す。labelは`aria-label`として読み上げる。 */
  iconOnly?: boolean;
  /** 開く操作の見た目。値の意味はButtonと同じ。 */
  variant?: ButtonProps["variant"];
  /** パネルを開く操作のどちらの端に揃えるか。endは行の末尾側に置いた操作に使う。 */
  align?: "start" | "end";
  /** 開く操作を押せなくする。 */
  disabled?: boolean;
};

/**
 * ラベル付けや担当の割り当てのように、候補を入力して絞り込みながら選ぶ小さなパネル。
 * 見た目はDropdownMenuと同じ白いパネルだが、中に入力欄を持つので、メニューではなく
 * コンボボックス（絞り込みの欄）とリストボックス（候補）の組み合わせにする。
 * 選ぶとfilter-menu:selectイベントを発火し、値と選んだかどうかを渡す。
 */
export const FilterMenu = ({
  id,
  label,
  title,
  options,
  multiple = false,
  name,
  placeholder = "絞り込む…",
  createLabel,
  emptyLabel = "当てはまる候補はありません",
  icon,
  iconOnly = false,
  variant = "secondary",
  align = "start",
  disabled,
}: FilterMenuProps) => {
  const anchor = overlayAnchorName("popover", id);
  return (
    <div
      class="rx-filter-menu"
      data-controller="filter-menu"
      data-filter-menu-multiple-value={multiple ? "true" : "false"}
      data-align={align}
    >
      <Button
        variant={variant}
        disabled={disabled}
        popovertarget={`${id}-panel`}
        style={`anchor-name: ${anchor}`}
        aria-haspopup="dialog"
        aria-controls={`${id}-panel`}
        aria-label={iconOnly ? label : undefined}
        data-icon-only={iconOnly ? "true" : undefined}
        data-filter-menu-target="trigger"
      >
        {icon && <Icon name={icon} />}
        {!iconOnly && label}
        {(!iconOnly || !icon) && <Icon name="caret" />}
      </Button>
      <div
        id={`${id}-panel`}
        popover="auto"
        class="panel rx-overlay"
        data-placement="anchor"
        data-align={align}
        style={`--rx-overlay-anchor: ${anchor}`}
        role="dialog"
        aria-labelledby={`${id}-title`}
        data-filter-menu-target="panel"
        data-action="toggle->filter-menu#opened"
      >
        <div class="search">
          <span class="field">
            <Icon name="search" />
            <input
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-label={placeholder}
              placeholder={placeholder}
              autocomplete="off"
              data-filter-menu-target="input"
              data-action="input->filter-menu#filter keydown->filter-menu#key"
            />
          </span>
          {createLabel && (
            <Button class="create" size="compact" data-action="filter-menu#create">
              <Icon name="plus" />
              {createLabel}
            </Button>
          )}
        </div>
        <p class="title" id={`${id}-title`}>
          {title}
        </p>
        <ul
          class="options"
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-title`}
          aria-multiselectable={multiple ? "true" : undefined}
        >
          {options.map((option, index) => (
            <li
              id={`${id}-option-${index}`}
              class="option"
              role="option"
              aria-selected={option.selected ? "true" : "false"}
              aria-disabled={option.disabled ? "true" : undefined}
              data-selected={option.selected ? "true" : "false"}
              data-disabled={option.disabled ? "true" : undefined}
              data-value={option.value}
              data-label={option.label}
              data-filter-menu-target="option"
              data-action="click->filter-menu#choose"
            >
              <span class="mark" aria-hidden="true">
                {option.icon ? <Icon name={option.icon} /> : <Icon name="check" />}
              </span>
              <span class="label">{option.label}</span>
              {option.shortcut && (
                <Keycap
                  class="shortcut"
                  keys={[option.shortcut]}
                  size="small"
                  inverse
                  aria-hidden="true"
                />
              )}
              {option.icon && (
                <span class="check" aria-hidden="true">
                  <Icon name="check" />
                </span>
              )}
              {name && (
                <input type="hidden" name={name} value={option.value} disabled={!option.selected} />
              )}
            </li>
          ))}
        </ul>
        <p class="empty" data-filter-menu-target="empty" hidden>
          {emptyLabel}
        </p>
      </div>
    </div>
  );
};
