import { EmojiPicker, type EmojiGroup } from "./emoji-picker";
import { InputGroup } from "./input-group";
import { Popover } from "./popover";
import { classes, type ElementProps } from "./types";

export type Reaction = {
  /** 絵文字や短い言葉。同じ内容のリアクションは一つにまとめる。 */
  content: string;
  /** 読み上げの名前（絵文字の名前など）。渡さなければcontentを読む。 */
  name?: string;
  /** 付けた人の名前。数はこの人数で、ホバー時と読み上げで誰が付けたかを伝える。 */
  by: readonly string[];
  /** 自分も付けているもの。 */
  mine?: boolean;
};
export type ReactionsProps = ElementProps<"div"> & {
  /** リアクションの一覧の名前。リアクションの並びのaria-labelにする。画面には出さない。 */
  label: string;
  /** リアクションごとに一件。付けた人（by）が空のリアクションは描かない。 */
  items: readonly Reaction[];
  /**
   * 渡すと、リアクションを押して自分のリアクションを付け外しでき、末尾にリアクションを追加する操作を置く。
   * 追加のパネルはEmojiPickerと、短い言葉でリアクションする欄（16文字まで）を持つ。
   * 付け外しは書き換える前にreactions:beforetoggle（取り消せる）、後にreactions:toggleイベントを発火する。
   * 保存は利用側が持ち、失敗した時はReactionsControllerのsetReactionでリアクションを戻す。
   */
  add?: {
    /** 追加のパネル（Popover）のid。ページ内で一意にする。言葉の欄と絵文字パネルのidにも使う。 */
    id: string;
    /** 自分の名前。付け外しでbyに追加・削除する名前で、itemsのbyと同じ書き方にする。既定は「自分」。 */
    me?: string;
    /** 追加の操作の名前。Tooltipとパネルの見出し（読み上げだけ）に使う。既定は「リアクションを追加」。 */
    label?: string;
    /** EmojiPickerに並べる絵文字。渡さなければEmojiPickerの既定の絵文字を使う。 */
    groups?: readonly EmojiGroup[];
    /** 言葉の欄の名前。placeholderは末尾に「…」を付けて使う。既定は「リアクションを入力」。 */
    textLabel?: string;
    /** 言葉の欄の確定ボタンの文言。既定は「追加」。 */
    submitLabel?: string;
  };
};

const who = (by: readonly string[]) => by.join("、");

/**
 * 項目に付いたリアクション。同じ絵文字や言葉は一つのリアクションにまとめ、付けた人数を添える。
 * 別々の人が同じ絵文字を付けると数が増え、自分が付けているリアクションは淡い青にする。自分のリアクションを押すと外し、
 * 他の人のリアクションを押すと自分も同じリアクションを付ける。新しいリアクションはEmojiPickerから選ぶか、短い言葉を入力して追加する。
 */
export const Reactions = ({
  label,
  items,
  add,
  class: className,
  ...attributes
}: ReactionsProps) => {
  const me = add?.me ?? "自分";
  return (
    <div
      {...attributes}
      class={classes("rx-reactions", className)}
      data-controller={add ? "reactions" : undefined}
      data-reactions-me-value={add ? me : undefined}
      data-action={add ? "emoji-picker:pick->reactions#pick" : undefined}
    >
      <ul aria-label={label} data-reactions-target="list">
        {items
          .filter((item) => item.by.length > 0)
          .map((item) => (
            <li>
              {add ? (
                <button
                  type="button"
                  class="reaction"
                  aria-pressed={item.mine ? "true" : "false"}
                  data-mine={item.mine ? "true" : "false"}
                  aria-label={`${item.name ?? item.content}：${who(item.by)}`}
                  title={who(item.by)}
                  data-content={item.content}
                  data-name={item.name}
                  data-by={JSON.stringify(item.by)}
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">
                    {item.content}
                  </span>
                  <span class="count" aria-hidden="true">
                    {item.by.length}
                  </span>
                </button>
              ) : (
                <span
                  class="reaction"
                  data-mine={item.mine ? "true" : undefined}
                  title={who(item.by)}
                >
                  <span class="content" aria-hidden="true">
                    {item.content}
                  </span>
                  <span class="count" aria-hidden="true">
                    {item.by.length}
                  </span>
                  <span class="rx-visually-hidden">
                    {item.name ?? item.content}：{who(item.by)}
                  </span>
                </span>
              )}
            </li>
          ))}
      </ul>
      {add && (
        <Popover
          id={add.id}
          label={add.label ?? "リアクションを追加"}
          title={add.label ?? "リアクションを追加"}
          titleHidden
          icon="smiley"
          iconOnly
          triggerVariant="link"
          initialFocus="content"
          tooltip
        >
          <div class="add">
            {/* 開いた時は言葉の欄へフォーカスを移す。確定は日本語入力の変換中のEnterを除き、Enterか「追加」で行う。 */}
            <InputGroup
              id={`${add.id}-text`}
              class="text"
              maxlength={16}
              autocomplete="off"
              autofocus
              aria-label={add.textLabel ?? "リアクションを入力"}
              placeholder={add.textLabel ? `${add.textLabel}…` : "リアクションを入力…"}
              data-reactions-target="text"
              data-action="keydown.enter->reactions#addText"
              action={{ label: add.submitLabel ?? "追加", "data-action": "reactions#addText" }}
            />
            <EmojiPicker id={`${add.id}-picker`} groups={add.groups} />
          </div>
        </Popover>
      )}
    </div>
  );
};
