import { InlineSelect, Disclosure, DisclosureGroup } from "../../src/hono";

const before = [
  { value: "0", label: "予定の時刻に" },
  { value: "10", label: "10分前に" },
  { value: "30", label: "30分前に" },
  { value: "60", label: "1時間前に" },
];

export default () => (
  <div class="rx-stack">
    <p>
      予定の
      <InlineSelect label="知らせる時" name="notify" options={before} value="30" />
      知らせる
    </p>
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="一つの文に二つ" open>
        <p>
          <InlineSelect
            label="ファイルの種類"
            name="kind"
            value="all"
            options={[
              { value: "all", label: "すべてのファイル" },
              { value: "image", label: "画像" },
              { value: "pdf", label: "PDF" },
            ]}
          />
          を
          <InlineSelect
            label="送った人"
            name="sender"
            value="everyone"
            options={[
              { value: "everyone", label: "全員" },
              { value: "me", label: "自分" },
            ]}
          />
          が送ったもの
        </p>
      </Disclosure>
      <Disclosure summary="見出しの下の小さな文">
        <p style="font-size: var(--rx-small)">
          <InlineSelect
            label="並び順"
            name="order"
            value="new"
            options={[
              { value: "new", label: "新しい順" },
              { value: "old", label: "古い順" },
            ]}
          />
          に並べています
        </p>
      </Disclosure>
      <Disclosure summary="使えない時・右から左に読む場合">
        <p>
          予定の
          <InlineSelect
            label="知らせる時"
            name="notify-disabled"
            options={before}
            value="10"
            disabled
          />
          知らせる
        </p>
        <p dir="rtl" lang="ar">
          تذكير{" "}
          <InlineSelect
            label="وقت التذكير"
            name="rtl-notify"
            options={[{ value: "30", label: "قبل 30 دقيقة" }]}
            value="30"
          />
        </p>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
