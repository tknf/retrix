import { Reactions, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Reactions
      label="このカードへのリアクション"
      items={[
        { content: "👍", name: "いいね", by: ["田中 遥", "佐藤 健", "自分"], mine: true },
        { content: "🚀", name: "ロケット", by: ["田中 遥"] },
        { content: "👀", name: "見ています", by: ["森 美咲", "佐藤 健"] },
      ]}
      add={{ id: "reactions-main" }}
    />
    <DisclosureGroup label="人数・内容・狭い場所・右から左">
      <Disclosure summary="別々の人が同じ絵文字を付けた時（数が増える）" open>
        <Reactions
          label="大勢のリアクション"
          items={[
            {
              content: "🎉",
              name: "お祝い",
              by: ["田中 遥", "佐藤 健", "森 美咲", "山本 誠", "小林 葵", "加藤 蓮", "自分"],
              mine: true,
            },
            {
              content: "👏",
              name: "拍手",
              by: Array.from({ length: 128 }, (_, index) => `参加者${index + 1}`),
            },
          ]}
          add={{ id: "reactions-many" }}
        />
      </Disclosure>
      <Disclosure summary="短い言葉のリアクション・まだリアクションがない">
        <div class="rx-stack" data-space="small">
          <Reactions
            label="言葉のリアクション"
            items={[
              { content: "助かります", by: ["佐藤 健", "田中 遥"] },
              { content: "了解です", by: ["自分"], mine: true },
            ]}
            add={{ id: "reactions-words" }}
          />
          <Reactions label="まだないリアクション" items={[]} add={{ id: "reactions-empty" }} />
        </div>
      </Disclosure>
      <Disclosure summary="読むだけ（押せないリアクション）">
        <Reactions
          label="読むだけのリアクション"
          items={[
            { content: "👍", name: "いいね", by: ["田中 遥", "自分"], mine: true },
            { content: "🎉", name: "お祝い", by: ["佐藤 健"] },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：折り返す">
        <div style="max-inline-size: 12rem">
          <Reactions
            label="狭い場所のリアクション"
            items={[
              { content: "とても助かりました、ありがとうございます", by: ["田中 遥"] },
              { content: "🚀", name: "ロケット", by: ["佐藤 健"] },
              { content: "👍", name: "いいね", by: ["森 美咲"] },
            ]}
            add={{ id: "reactions-narrow" }}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Reactions
            label="التفاعلات"
            items={[
              { content: "👍", name: "إعجاب", by: ["هارو", "أنا"], mine: true },
              { content: "رائع", by: ["سارة"] },
            ]}
            add={{ id: "reactions-rtl", me: "أنا", label: "إضافة تفاعل" }}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
