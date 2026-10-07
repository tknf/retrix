import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";
import { Wing, type WingProps } from "./wing";

export type AppShellProps = PropsWithChildren<
  ElementProps<"div"> & {
    /** 上部のバーの中央に置く共通コマンド。通常はCommandMenuを一つ渡す。 */
    commands: Child;
    /** 上部のバーの先頭側に置く、ホームへのリンクなど。省略すると枠ごと出さない。 */
    home?: Child;
    /** 上部のバーの末尾側に置く、利用者のAvatarやアカウントへのリンクなど。省略すると枠ごと出さない。 */
    account?: Child;
    /**
     * 作業面の左右に付ける補助パネル。Wingのstart・end・storageKey・savedStateと同じ値を渡す。
     * 省略するとWingを使わず、作業面だけを置く。
     */
    wings?: Pick<WingProps, "start" | "end" | "storageKey" | "savedState">;
    /**
     * 作業面の幅の上限。compactは46rem（本文の行の長さ--rx-measureに左右の余白を足した幅）、defaultは68rem（--rx-page）、wideは112rem。
     * 設定画面など入力が中心の画面はcompact、Boardや年の予定など横に広い画面はwideにする。
     */
    size?: "compact" | "default" | "wide";
  }
>;

/** 上部中央の共通コマンドと、中央の作業面を構成する。wingsは作業面の左右に開閉できる補助メニューを付ける。 */
export const AppShell = ({
  commands,
  home,
  account,
  wings,
  size = "default",
  children,
  class: className,
  ...attributes
}: AppShellProps) => {
  const workspace = <div class="workspace">{children}</div>;
  return (
    <div {...attributes} class={classes("rx-app-shell", className)} data-size={size}>
      <header class="bar">
        <div class="start">{home}</div>
        <nav class="commands" aria-label="共通コマンド">
          {commands}
        </nav>
        <div class="end">{account}</div>
      </header>
      {wings ? <Wing {...wings}>{workspace}</Wing> : workspace}
    </div>
  );
};
