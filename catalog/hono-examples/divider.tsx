import { Divider, ActionLink, InlineSelect } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <p>現在の設定</p>
    <Divider label="補足" />
    <p>必要な場合だけ変更してください。</p>
    <Divider />
    <p>ここまでは公開済みの内容です。</p>
    <Divider label="ここから下書き" line="dashed" />
    <p>まだ確定していない内容は、破線の下に置きます。</p>
    <Divider line="dashed" />
    <Divider label="補足と説明を含む長い区切りの見出しは、狭い場所では折り返します" />
    <p>見出しが長い時も、線は残りの幅に引きます。</p>
    <Divider
      label="田中 遥から届いたファイル"
      actions={
        <ActionLink href="/" size="compact">
          すべて見る
        </ActionLink>
      }
    />
    <p>線の終わりには、区切りの後の項目をまとめて扱う操作だけを置きます。</p>
    <Divider
      label={
        <InlineSelect
          label="表示するスレッド"
          name="threads"
          value="all"
          options={[
            { value: "all", label: "田中 遥とのすべてのスレッド" },
            { value: "unread", label: "未読のスレッド" },
          ]}
        />
      }
      actions={
        <ActionLink href="/" size="compact">
          書く
        </ActionLink>
      }
    />
    <p>名前の代わりに文の中の選択を置くと、区切りの後の項目の並べ方を選べます。</p>
    <div dir="rtl" lang="ar" class="rx-stack">
      <Divider label="ملاحظة" />
      <Divider label="مسودة" line="dashed" />
    </div>
  </div>
);
