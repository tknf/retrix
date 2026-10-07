import { useId } from "hono/jsx";
import { Button } from "./button";
import { Icon } from "./icon";

export type TreeItem = {
  /**
   * 項目を識別する値。tree:changeのdetail.valueで渡す。
   * 空白だけの値と、全階層を通じて二つ目以降に現れた値の項目は、子ごと出さない。
   */
  value: string;
  /** 項目の名前。空白だけの時はvalueを名前にする。 */
  label: string;
  /**
   * 名前をリンクにする時のURL。名前を押すか、フォーカスしてEnterを押すと、選ぶと同時にリンク先へ移る。
   * 無効な項目ではリンクにしない。
   */
  href?: string;
  /** 選べない項目。開閉のボタンも押せず、矢印キーの移動の対象から外す。 */
  disabled?: boolean;
  /** 子の項目。一件以上あると、開閉のボタンを付けた親になる。 */
  children?: readonly TreeItem[];
};

export type TreeProps = {
  /** ルートのid。省略すると自動で作る。各項目のidの元になる。 */
  id?: string;
  /** treeの読み上げ名。空白だけの時は「項目一覧」にする。 */
  label: string;
  /** 最上位の項目。重複や空の値を除いて一件も残らない時は、「項目はありません。」の状態文を出す。 */
  items: readonly TreeItem[];
  /** 初めに選んでおく項目のvalue。見つからない値は選択なしとして扱う。 */
  value?: string;
  /** 初めに開いておく親の項目のvalue。子を持たない値は無視する。 */
  expanded?: readonly string[];
};

const uniqueItems = (items: readonly TreeItem[], seen: Set<string>): TreeItem[] =>
  items.flatMap((item) => {
    if (item.value.trim() === "" || seen.has(item.value)) return [];
    seen.add(item.value);
    return [{ ...item, children: uniqueItems(item.children ?? [], seen) }];
  });

const renderItem = (item: TreeItem, path: string, rootId: string) => {
  const children = item.children ?? [];
  const itemLabel = item.label.trim() || item.value;
  const itemId = `${rootId}-item-${path}`;
  return (
    <li
      id={itemId}
      role="treeitem"
      // 開閉のボタンの名前を項目の名前に混ぜないよう、名前は見出しの文字だけから取る。
      aria-labelledby={`${itemId}-label`}
      data-tree-target="item"
      data-tree-value={item.value}
      aria-disabled={item.disabled ? "true" : undefined}
    >
      <div class="row">
        {children.length > 0 ? (
          <Button
            class="toggle"
            variant="link"
            type="button"
            data-icon-only="true"
            data-tree-target="toggle"
            aria-label={`${itemLabel}を開閉`}
            disabled={item.disabled}
          >
            <Icon name="caret" />
          </Button>
        ) : (
          <span class="spacer" aria-hidden="true" />
        )}
        {item.href && !item.disabled ? (
          <a id={`${itemId}-label`} href={item.href}>
            {itemLabel}
          </a>
        ) : (
          <span id={`${itemId}-label`} class="label">
            {itemLabel}
          </span>
        )}
      </div>
      {children.length > 0 && (
        <ul role="group">
          {children.map((child, index) => renderItem(child, `${path}-${index}`, rootId))}
        </ul>
      )}
    </li>
  );
};

/** 中央の作業面で階層を選ぶ。全体移動はCommandMenuが担う。 */
export const Tree = ({ id, label, items, value = "", expanded = [] }: TreeProps) => {
  const generatedId = useId();
  const treeId = id?.trim() ? id : `rx-tree-${generatedId}`;
  const accessibleLabel = label.trim() || "項目一覧";
  const renderedItems = uniqueItems(items, new Set());
  if (renderedItems.length === 0)
    return (
      <div id={treeId} class="rx-tree" data-empty="true" role="status" aria-label={accessibleLabel}>
        項目はありません。
      </div>
    );
  return (
    <ul
      id={treeId}
      class="rx-tree"
      role="tree"
      aria-label={accessibleLabel}
      tabindex={0}
      data-controller="tree tree-presentation"
      data-tree-value-value={value}
      data-tree-expanded-value={JSON.stringify(expanded)}
    >
      {renderedItems.map((item, index) => renderItem(item, String(index), treeId))}
    </ul>
  );
};
