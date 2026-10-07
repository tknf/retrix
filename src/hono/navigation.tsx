import { NavigationItems, type NavigationItem } from "./navigation-items";

export type { NavigationItem } from "./navigation-items";
export type NavigationProps = {
  /** navの読み上げ名（「設定項目」など）。同じ画面に複数のnavがある時の区別にもなる。 */
  label: string;
  /** 並べるページ。上から順に一行ずつ出す。 */
  items: readonly NavigationItem[];
};
export const Navigation = ({ label, items }: NavigationProps) => (
  <nav class="rx-navigation" aria-label={label}>
    <NavigationItems items={items} />
  </nav>
);
