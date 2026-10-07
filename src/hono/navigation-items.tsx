import { ActionLink } from "./button";
import type { Child } from "hono/jsx";

export type NavigationItem = {
  /** 項目の名前。 */
  label: string;
  /** 移動先のURL。現在地の項目もリンクのまま出す。 */
  href: string;
  /** 今いる項目。aria-current="page"を付け、見た目でも現在地として示す。 */
  current?: boolean;
  /** 名前の後に出す件数。0も表示し、省略すると出さない。 */
  count?: number;
  /** 名前の前のアイコン（Iconなど）。 */
  icon?: Child;
};

/** 現在地のARIA・状態属性と0件の扱いを、ナビゲーション間で揃える。 */
export const NavigationItems = ({
  items,
  appearance = "plain",
}: {
  items: readonly NavigationItem[];
  appearance?: "plain" | "button";
}) => {
  const Link = appearance === "button" ? ActionLink : "a";
  return (
    <>
      {items.map((item) => (
        <Link
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          data-current={item.current ? "true" : undefined}
        >
          {item.icon != null && <span class="icon">{item.icon}</span>}
          <span>{item.label}</span>
          {item.count !== undefined && <small>{item.count}</small>}
        </Link>
      ))}
    </>
  );
};
