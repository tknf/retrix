import type { Child, PropsWithChildren } from "hono/jsx";
import { NavigationItems, type NavigationItem } from "./navigation-items";
import { classes, type ElementProps } from "./types";
import { Wing, type WingProps } from "./wing";

/** 作業面の背後に重ねる、上の階層のページ。 */
export type AppShellTrailItem = {
  /** 上の階層のページの名前。背後のシートの見出しとして出す。 */
  label: string;
  /** 上の階層のページのURL。 */
  href: string;
};

export type AppShellProps = PropsWithChildren<
  ElementProps<"div"> & {
    /** ヘッダーの先頭側に置く、アプリの名前やロゴとホームへのリンク。省略すると枠ごと出さない。 */
    home?: Child;
    /** ヘッダーで`home`の後に並べる、アプリの主な移動先。今いる項目は`current`にする。 */
    navigation?: readonly NavigationItem[];
    /** `navigation`のnavの読み上げ名。省略すると「アプリの移動」。 */
    navigationLabel?: string;
    /** ヘッダーの末尾側に置く、検索やCommandMenu。省略すると枠ごと出さない。 */
    commands?: Child;
    /** ヘッダーの上の行の末尾側に小さく置く、アカウントやログアウトへのリンク。省略すると行ごと出さない。 */
    account?: Child;
    /**
     * 作業面の先頭側に置く列。Highriseのように、分類ごとの移動先や最近見た項目を置く。
     * 作業面の外に置き、列と作業面を合わせて画面の中央に揃える。狭い画面では作業面の上へ移る。
     */
    aside?: Child;
    /**
     * 作業面の背後に重ねるシート。上の階層から順に並べる。
     * 各シートの見出しは上の階層へのリンクになり、今のページの作業面はその手前に置く。
     */
    trail?: readonly AppShellTrailItem[];
    /** 作業面の下に置く、小さな補足のリンクなど。省略すると出さない。 */
    footer?: Child;
    /**
     * 作業面の左右に付ける補助パネル。Wingのstart・end・storageKey・savedStateと同じ値を渡す。
     * 省略するとWingを使わず、作業面だけを置く。
     */
    wings?: Pick<WingProps, "start" | "end" | "storageKey" | "savedState">;
    /**
     * 作業面の幅の上限。compactは46rem（本文の行の長さ--rx-measureに左右の余白を足した幅）、defaultは60rem（--rx-page）、wideは90rem。
     * 設定画面など入力が中心の画面はcompact、Boardや年の予定など横に広い画面はwideにする。
     */
    size?: "compact" | "default" | "wide";
  }
>;

/**
 * 机の上に白いシートを置く画面構成。ヘッダーにアプリの名前・主な移動先・検索を並べ、その下の中央に作業面を置く。
 * trailは上の階層を作業面の背後に重ねたシートで示し、asideは作業面の先頭側に移動先の列を置く。
 */
export const AppShell = ({
  home,
  navigation,
  navigationLabel = "アプリの移動",
  commands,
  account,
  aside,
  trail,
  footer,
  wings,
  size = "default",
  children,
  class: className,
  ...attributes
}: AppShellProps) => {
  const workspace = <div class="workspace">{children}</div>;
  const depth = trail?.length ?? 0;
  return (
    <div {...attributes} class={classes("rx-app-shell", className)} data-size={size}>
      <header class="bar">
        {account != null && <div class="account">{account}</div>}
        {home != null && <div class="start">{home}</div>}
        {navigation && navigation.length > 0 && (
          <nav class="navigation" aria-label={navigationLabel}>
            <NavigationItems items={navigation} />
          </nav>
        )}
        {commands != null && <div class="commands">{commands}</div>}
      </header>
      <div class="body" data-aside={aside != null ? "true" : undefined}>
        {aside != null && <div class="aside">{aside}</div>}
        <div class="main" style={depth > 0 ? `--rx-trail-count: ${depth}` : undefined}>
          {depth > 0 && trail && (
            <nav class="trail" aria-label="上の階層">
              <ol>
                {trail.map((item, index) => (
                  <li style={`--rx-trail-depth: ${depth - index}`}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {wings ? <Wing {...wings}>{workspace}</Wing> : workspace}
          {footer != null && <footer class="footer">{footer}</footer>}
        </div>
      </div>
    </div>
  );
};
