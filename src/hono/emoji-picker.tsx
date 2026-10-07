import { Icon } from "./icon";
import { InputGroup } from "./input-group";
import { classes, type ElementProps } from "./types";

export type Emoji = {
  /** グリッドに表示し、選んだ時にemoji-picker:pickイベントで渡す絵文字。 */
  emoji: string;
  /** 読み上げとホバー時の名前。 */
  name: string;
  /** 検索に使う別名。 */
  keywords?: readonly string[];
};
export type EmojiGroup = {
  /** 種類の見出し。グリッドのまとまりの読み上げ名にもなる。 */
  label: string;
  /** この種類に並べる絵文字。並べた順にグリッドへ置く。 */
  emojis: readonly Emoji[];
};

/** 既定の絵文字。リアクションによく使うものだけに絞る。全ての絵文字を並べたい時は利用側でgroupsを渡す。 */
export const defaultEmojiGroups: readonly EmojiGroup[] = [
  {
    label: "よく使う",
    emojis: [
      { emoji: "👍", name: "いいね", keywords: ["good", "賛成", "了解"] },
      { emoji: "🎉", name: "お祝い", keywords: ["party", "おめでとう"] },
      { emoji: "❤️", name: "ハート", keywords: ["heart", "好き"] },
      { emoji: "😄", name: "笑顔", keywords: ["smile", "うれしい"] },
      { emoji: "🙏", name: "お願い", keywords: ["thanks", "ありがとう", "感謝"] },
      { emoji: "👀", name: "見ています", keywords: ["eyes", "確認中"] },
      { emoji: "🚀", name: "ロケット", keywords: ["rocket", "公開", "出発"] },
      { emoji: "✅", name: "完了", keywords: ["done", "チェック", "済み"] },
    ],
  },
  {
    label: "顔",
    emojis: [
      { emoji: "😀", name: "にっこり", keywords: ["grin"] },
      { emoji: "😂", name: "うれし泣き", keywords: ["joy", "笑"] },
      { emoji: "😊", name: "ほほえみ", keywords: ["blush"] },
      { emoji: "😍", name: "目がハート", keywords: ["love"] },
      { emoji: "🤔", name: "考え中", keywords: ["thinking", "うーん"] },
      { emoji: "😮", name: "驚き", keywords: ["wow", "えっ"] },
      { emoji: "😢", name: "悲しい", keywords: ["sad", "涙"] },
      { emoji: "😅", name: "冷や汗", keywords: ["sweat", "苦笑"] },
      { emoji: "😎", name: "サングラス", keywords: ["cool"] },
      { emoji: "🥳", name: "パーティー", keywords: ["party", "お祝い"] },
      { emoji: "😴", name: "眠い", keywords: ["sleep"] },
      { emoji: "🙂", name: "少しほほえみ", keywords: ["slight smile"] },
    ],
  },
  {
    label: "手",
    emojis: [
      { emoji: "👏", name: "拍手", keywords: ["clap", "すごい"] },
      { emoji: "👎", name: "よくない", keywords: ["bad", "反対"] },
      { emoji: "👌", name: "オーケー", keywords: ["ok"] },
      { emoji: "✌️", name: "ピース", keywords: ["peace", "victory"] },
      { emoji: "🙌", name: "ばんざい", keywords: ["hooray", "やった"] },
      { emoji: "👋", name: "手を振る", keywords: ["wave", "こんにちは", "さようなら"] },
      { emoji: "💪", name: "力こぶ", keywords: ["strong", "がんばる"] },
      { emoji: "🤝", name: "握手", keywords: ["handshake", "合意"] },
    ],
  },
  {
    label: "物と記号",
    emojis: [
      { emoji: "🔥", name: "炎", keywords: ["fire", "熱い"] },
      { emoji: "⭐", name: "星", keywords: ["star", "お気に入り"] },
      { emoji: "💡", name: "ひらめき", keywords: ["idea", "電球"] },
      { emoji: "📌", name: "ピン", keywords: ["pin", "固定"] },
      { emoji: "📎", name: "クリップ", keywords: ["clip", "添付"] },
      { emoji: "⏰", name: "時計", keywords: ["alarm", "締め切り"] },
      { emoji: "☕", name: "コーヒー", keywords: ["coffee", "休憩"] },
      { emoji: "🎯", name: "的", keywords: ["target", "目標"] },
      { emoji: "⚠️", name: "注意", keywords: ["warning"] },
      { emoji: "❓", name: "質問", keywords: ["question", "はてな"] },
      { emoji: "❌", name: "バツ", keywords: ["no", "だめ"] },
      { emoji: "💯", name: "満点", keywords: ["100", "完璧"] },
    ],
  },
];

export type EmojiPickerProps = Omit<ElementProps<"div">, "children"> & {
  /** 検索欄と種類の見出しのIDの接頭辞。ページ内で一意にする。 */
  id: string;
  /** 絵文字パネル全体（role="group"）の読み上げ名。 */
  label?: string;
  /** 種類ごとの絵文字。渡さなければリアクションによく使う40個（defaultEmojiGroups）を並べる。 */
  groups?: readonly EmojiGroup[];
  /** 検索欄のプレースホルダー。欄の読み上げ名にも使う。 */
  placeholder?: string;
  /** 検索した言葉に当てはまる絵文字が無い時に出す文。 */
  emptyLabel?: string;
  /** Popoverの中に置く時。開いた時に検索欄へフォーカスを移す。 */
  autofocus?: boolean;
};

/**
 * 絵文字を検索して選ぶ絵文字パネル。上に検索欄、下に種類ごとの絵文字のグリッドを並べる。
 * 選ぶとemoji-picker:pickイベントを発火し、絵文字と名前を渡す。Popoverの中に置いてリアクションを追加する時などに使う。
 * グリッドの中は矢印キーで移動し、Enterかクリックで選ぶ。Tabでグリッドへ入る位置は一か所だけにする。
 */
export const EmojiPicker = ({
  id,
  label = "絵文字を選ぶ",
  groups = defaultEmojiGroups,
  placeholder = "絵文字を探す…",
  emptyLabel = "当てはまる絵文字はありません",
  autofocus = false,
  class: className,
  ...attributes
}: EmojiPickerProps) => (
  <div
    {...attributes}
    class={classes("rx-emoji-picker", className)}
    role="group"
    aria-label={label}
    data-controller="emoji-picker"
  >
    <InputGroup
      id={`${id}-search`}
      type="search"
      prefix={<Icon name="search" />}
      aria-label={placeholder}
      placeholder={placeholder}
      autocomplete="off"
      autofocus={autofocus}
      data-emoji-picker-target="input"
      data-action="input->emoji-picker#filter"
    />
    <div class="groups" data-action="keydown->emoji-picker#move">
      {groups.map((group, groupIndex) => (
        <section
          class="group"
          data-emoji-picker-target="group"
          aria-labelledby={`${id}-group-${groupIndex}`}
        >
          <h3 class="title" id={`${id}-group-${groupIndex}`}>
            {group.label}
          </h3>
          <div class="grid">
            {group.emojis.map((item, index) => (
              <button
                type="button"
                class="emoji"
                tabindex={groupIndex === 0 && index === 0 ? 0 : -1}
                aria-label={item.name}
                title={item.name}
                data-emoji={item.emoji}
                data-search={[item.name, ...(item.keywords ?? [])].join(" ").toLocaleLowerCase()}
                data-emoji-picker-target="emoji"
                data-action="emoji-picker#pick"
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </section>
      ))}
      <p class="empty" data-emoji-picker-target="empty" hidden>
        {emptyLabel}
      </p>
    </div>
  </div>
);
