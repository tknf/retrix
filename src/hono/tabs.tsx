import type { Child } from "hono/jsx";

export type TabItem = {
  /** タブを識別する値。Tabsの中で一意にする。selectedとtabs:changeのdetail.valueに使う。 */
  value: string;
  /** タブの名前。パネルの読み上げ名にもなる。 */
  label: string;
  /** タブを選んだ時に出すパネルの中身。 */
  content: Child;
  /** 選べないタブ。表示はするが押せず、矢印キーの移動でも飛ばす。 */
  disabled?: boolean;
  /** 名前の前のアイコン（Iconなど）。 */
  icon?: Child;
  /** 名前の後に出す件数。0も表示し、省略すると出さない。 */
  count?: number;
};
export const Tabs = ({
  id,
  label,
  items,
  selected,
}: {
  /** タブとパネルのidの元。ページ内で一意にする。 */
  id: string;
  /** tablistの読み上げ名。 */
  label: string;
  /** 並べるタブとパネル。選べるタブが一つもない時は「利用可能な項目はありません。」を出す。 */
  items: readonly TabItem[];
  /** 最初に選んでおくタブのvalue。省略した時、見つからない時、無効なタブの時は、最初の選べるタブにする。 */
  selected?: string;
}) => {
  const active =
    items.find((item) => item.value === selected && !item.disabled)?.value ??
    items.find((item) => !item.disabled)?.value;
  if (active === undefined) {
    return (
      <div class="rx-tabs">
        <p>利用可能な項目はありません。</p>
      </div>
    );
  }
  return (
    <div class="rx-tabs" data-controller="tabs" data-tabs-value-value={active}>
      <div class="list" role="tablist" aria-label={label} data-tabs-target="tablist">
        {items.map((item, index) => (
          <button
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            data-tabs-target="tab"
            data-tabs-value={item.value}
            data-state={item.value === active ? "active" : "inactive"}
            aria-selected={item.value === active ? "true" : "false"}
            aria-controls={`${id}-panel-${index}`}
            disabled={item.disabled}
            tabindex={item.value === active ? 0 : -1}
          >
            {item.icon != null && item.icon !== false && <span class="icon">{item.icon}</span>}
            {item.label}
            {item.count !== undefined && <span class="count">{item.count}</span>}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <section
          id={`${id}-panel-${index}`}
          class="panel"
          role="tabpanel"
          data-tabs-target="tabpanel"
          data-tabs-value={item.value}
          data-state={item.value === active ? "active" : "inactive"}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={item.value !== active}
          tabindex={0}
        >
          {item.content}
        </section>
      ))}
    </div>
  );
};
