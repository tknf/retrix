import { Button } from "./button";
import { ActionTile } from "./action-tile";
import { InputGroup } from "./input-group";
import { Icon, type IconName } from "./icon";
import { Keycap } from "./keycap";

type CommandLabel = {
  /** 項目の名前。一覧の項目では検索の対象になる。 */
  label: string;
  /**
   * 名前に添える補足。一覧の移動の項目では名前の後に表示し、操作の項目とショートカットのタイルでは
   * 画面に出さずaria-descriptionで読み上げる。一覧の項目では検索の対象になる。
   */
  description?: string;
  /** 名前の前のアイコン。移動の項目とショートカットで省略すると矢印のアイコンになる。操作の項目で省略するとアイコンを出さない。 */
  icon?: IconName;
  /** 画面には出さない検索語。別名や関連語を渡すと、その言葉でも絞り込める。 */
  keywords?: readonly string[];
  /**
   * 選べない状態で表示する。リンクは移動せず、操作は押せず、矢印キーの移動の対象から外す。
   * 理由は名前や補足で伝える。
   */
  disabled?: boolean;
  /** アイコンの色。ショートカットのタイルと、一覧の移動の項目のアイコンに使う。 */
  accent?: "blue" | "green" | "amber" | "coral";
};
export type CommandLink = CommandLabel & {
  /** 移動先のURL。選ぶと通常のリンクとして移動し、パネルを閉じる。 */
  href: string;
  /** 今いる場所。aria-current="page"を付け、一覧では末尾側にチェックマークを出す。 */
  current?: boolean;
};
export type CommandItem =
  | CommandLink
  | (CommandLabel & {
      /** 操作の値。選ぶとcommand-menu:selectイベントを発火し、detail.valueで渡す。実行は利用側が担う。 */
      value: string;
    });
export type CommandGroup = {
  /** グループの見出し（「最近の場所」など）。 */
  label: string;
  /** グループの項目。hrefを持つ項目は移動、valueを持つ項目は操作になる。空のグループは表示しない。 */
  items: readonly CommandItem[];
};
export type CommandMenuProps = {
  /** パネルのid。開くボタンのpopovertargetと、検索欄・結果の各idの元になる。ページ内で一意にする。 */
  id: string;
  /** 開くボタンとパネルの見出しに出す名前（チーム名・アプリ名など）。パネルの読み上げ名にも使う。 */
  label: string;
  /** 検索欄の上にグリッドで並べる主要なショートカット。空にするとショートカットの段を出さない。 */
  shortcuts: readonly CommandLink[];
  /** 検索欄の下に並べる候補のグループ（最近の場所・人・ページ・操作など）。検索でこの中を絞り込む。 */
  groups: readonly CommandGroup[];
  /** ショートカットの段の列数。パネルが狭い時は2列にする。 */
  columns?: 3 | 4;
  /** 開くボタンの名前の前のアイコン。 */
  icon?: IconName;
  /**
   * 開閉のキー。shift+jはShift+J、mod+kはCtrlまたはCmdとKで開閉し、パネルの下にキーの案内を出す。
   * 省略するとキーを登録しない。アプリ全体で一つのCommandMenuだけに指定する。
   */
  shortcut?: "shift+j" | "mod+k";
  /** ルートのdata-action。command-menu:selectを受け取るcontrollerのアクションを書く。 */
  action?: string;
};

const Destination = ({ item }: { item: CommandLink }) => {
  const content = (
    <>
      <span class="icon">
        <Icon name={item.icon ?? "arrow"} fill />
      </span>
      <span class="name">{item.label}</span>
      {item.description && <span class="context">{item.description}</span>}
      {item.current && (
        <span class="current">
          <Icon name="check" />
          <span class="rx-visually-hidden">現在地</span>
        </span>
      )}
    </>
  );
  return item.disabled ? (
    <span class="link" role="link" aria-disabled="true">
      {content}
    </span>
  ) : (
    <a class="link" href={item.href} tabindex={0} aria-current={item.current ? "page" : undefined}>
      {content}
    </a>
  );
};

/** 主要なショートカットと、仕事・人・ページへの移動を一つの場所へまとめる。 */
export const CommandMenu = ({
  id,
  label,
  shortcuts,
  groups,
  columns = 4,
  icon = "layers",
  shortcut,
  action,
}: CommandMenuProps) => (
  <div
    class="rx-command-menu"
    data-controller="command-menu"
    data-action={action}
    data-command-menu-shortcut={shortcut}
  >
    <Button
      size="large"
      popovertarget={id}
      data-command-menu-target="trigger"
      aria-haspopup="dialog"
      aria-controls={id}
      aria-expanded="false"
      aria-keyshortcuts={
        shortcut === "mod+k" ? "Control+k Meta+k" : shortcut === "shift+j" ? "Shift+j" : undefined
      }
    >
      <Icon name={icon} fill />
      {label}
      <Icon name="caret" />
    </Button>
    <div
      class="panel"
      popover="auto"
      role="dialog"
      id={id}
      aria-label={`${label}のコマンド`}
      data-command-menu-target="panel"
    >
      <header class="heading">
        <span class="name">{label}</span>
        <Button
          size="compact"
          aria-label="コマンドを閉じる"
          popovertarget={id}
          popovertargetaction="hide"
          data-command-menu-target="close"
        >
          閉じる
        </Button>
      </header>
      {shortcuts.length > 0 && (
        <nav class="shortcuts" aria-label="よく使う場所" data-columns={columns}>
          {shortcuts.map((item) => (
            <div class="shortcut">
              {/* ショートカットはActionTile。Tableの一括操作と同じタイルを使う。 */}
              <ActionTile
                label={item.label}
                icon={item.icon ?? "arrow"}
                accent={item.accent}
                href={item.href}
                current={item.current}
                disabled={item.disabled}
                tabindex={0}
                aria-description={item.description}
              />
            </div>
          ))}
        </nav>
      )}
      <div class="search">
        <InputGroup
          id={`${id}-search`}
          size="large"
          type="search"
          role="combobox"
          aria-label="仕事・人・ページを探す"
          aria-haspopup="tree"
          aria-autocomplete="list"
          aria-controls={`${id}-results`}
          aria-expanded="false"
          autocomplete="off"
          autofocus
          placeholder="仕事・人・ページを探す…"
          prefix={<Icon name="search" />}
          data-command-menu-target="search"
        />
      </div>
      <div class="results" id={`${id}-results`} role="tree" aria-label="移動先・操作">
        {groups.map((group, groupIndex) => (
          <section
            class="group"
            role="group"
            aria-labelledby={`${id}-group-${groupIndex}`}
            data-command-menu-target="group"
            hidden={group.items.length === 0}
          >
            <h2 id={`${id}-group-${groupIndex}`}>{group.label}</h2>
            <ul class="list" role="none">
              {group.items.map((item, itemIndex) => (
                <li
                  class="entry"
                  role="treeitem"
                  id={`${id}-entry-${groupIndex}-${itemIndex}`}
                  aria-selected="false"
                  aria-disabled={item.disabled ? "true" : undefined}
                  data-disabled={item.disabled ? "true" : undefined}
                  data-accent={item.accent}
                  data-command-menu-target="entry"
                  data-search={[item.label, item.description, ...(item.keywords ?? [])]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {"href" in item ? (
                    <Destination item={item} />
                  ) : (
                    <Button
                      class="command"
                      variant="link"
                      disabled={item.disabled}
                      data-command-value={item.value}
                      aria-description={item.description}
                    >
                      {item.icon && <Icon name={item.icon} />}
                      {item.label}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p class="empty" data-command-menu-target="empty" hidden>
          見つかりませんでした。別の言葉で探してみてください。
        </p>
      </div>
      <footer class="help" aria-label="キーボード操作">
        <span class="hint">
          <Keycap keys={["↑", "↓"]} />
          選択
        </span>
        <span class="hint">
          <Keycap keys={["Enter"]} />
          実行
        </span>
        <span class="hint">
          <Keycap keys={["Esc"]} />
          閉じる
        </span>
        {shortcut && (
          <span class="hint">
            <Keycap keys={shortcut === "shift+j" ? ["Shift", "J"] : ["Ctrl / Cmd", "K"]} />
            開閉
          </span>
        )}
      </footer>
      <span class="rx-visually-hidden" role="status" data-command-menu-target="status" />
    </div>
  </div>
);
