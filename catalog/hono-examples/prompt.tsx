import { Prompt, ActionLink, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <form>
      <Prompt
        question="下のメールはどれに近いですか？"
        name="kind"
        choices={[
          {
            value: "person",
            title: "人からのメール",
            description: "返信するかもしれない、見逃したくない大事なもの（請求など）。",
          },
          {
            value: "newsletter",
            title: "お知らせ",
            description: "読むだけのもの。急がず、届いた時に読めれば十分。",
          },
          {
            value: "receipt",
            title: "領収書や確認",
            description: "注文の確認や、宣伝、手続きのメール。",
          },
        ]}
        dismiss={<ActionLink href="/">今は答えない</ActionLink>}
      />
    </form>
    <DisclosureGroup label="選択肢と置き場所の違い">
      <Disclosure summary="移動のリンクの選択肢・尾なし">
        <Prompt
          question="最初に何をしますか？"
          pointer={false}
          choices={[
            { value: "board", title: "ボードを作る", href: "/" },
            { value: "invite", title: "人を招待する", href: "/" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：選択肢を縦に積む">
        <div style="max-inline-size: 20rem">
          <Prompt
            question="この差出人からのメールを受け取りますか？"
            choices={[
              { value: "yes", title: "受け取る", href: "/" },
              { value: "no", title: "受け取らない", href: "/" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Prompt
            question="كيف تصف هذه الرسالة؟"
            pointer={false}
            choices={[
              { value: "person", title: "من شخص", href: "/" },
              { value: "news", title: "نشرة", href: "/" },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
