export type BreadcrumbItem = {
  /** 階層の名前。 */
  label: string;
  /** 戻り先のURL。最後の項目（現在地）では渡してもリンクにしない。省略するとリンクのない文字になる。 */
  href?: string;
};
export type BreadcrumbProps = {
  /** navの読み上げ名。 */
  label?: string;
  /** 上位から現在地までの階層。最後の項目を現在地としてaria-current="page"を付ける。 */
  items: readonly BreadcrumbItem[];
};
export const Breadcrumb = ({ label = "現在の位置", items }: BreadcrumbProps) => (
  <nav class="rx-breadcrumb" aria-label={label}>
    <ol>
      {items.map((item, index) => (
        <li>
          {item.href && index < items.length - 1 ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
