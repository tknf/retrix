import { EmojiPicker, Popover, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <EmojiPicker id="emoji-picker-main" />
    <DisclosureGroup label="置き場所・中身・狭い場所・右から左">
      <Disclosure summary="Popoverで開く（リアクションを追加する時の形）" open>
        <Popover
          id="emoji-picker-popover"
          label="絵文字を選ぶ"
          icon="smiley"
          size="compact"
          initialFocus="content"
        >
          <EmojiPicker id="emoji-picker-in-popover" autofocus />
        </Popover>
      </Disclosure>
      <Disclosure summary="種類を絞った絵文字パネル">
        <EmojiPicker
          id="emoji-picker-status"
          label="状態を選ぶ"
          placeholder="状態を探す…"
          groups={[
            {
              label: "状態",
              emojis: [
                { emoji: "✅", name: "完了", keywords: ["done"] },
                { emoji: "🚧", name: "作業中", keywords: ["wip"] },
                { emoji: "⏸️", name: "保留", keywords: ["pause"] },
                { emoji: "❌", name: "中止", keywords: ["cancel"] },
              ],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：列が減る">
        <div style="max-inline-size: 12rem">
          <EmojiPicker id="emoji-picker-narrow" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EmojiPicker
            id="emoji-picker-rtl"
            label="اختر رمزًا تعبيريًا"
            placeholder="ابحث عن رمز…"
            emptyLabel="لا توجد رموز مطابقة"
            groups={[
              {
                label: "شائع",
                emojis: [
                  { emoji: "👍", name: "إعجاب" },
                  { emoji: "🎉", name: "احتفال" },
                  { emoji: "❤️", name: "قلب" },
                  { emoji: "🙏", name: "شكرًا" },
                ],
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
