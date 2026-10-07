import { Disclosure, DisclosureGroup, Icon, Tabs } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Tabs
      id="hono-tabs"
      label="項目の補足"
      selected="unavailable"
      items={[
        { value: "content", label: "内容", content: <p>最初の有効なパネルを表示します。</p> },
        {
          value: "unavailable",
          label: "受付停止中",
          disabled: true,
          content: <p>選択できません。</p>,
        },
        { value: "settings", label: "設定", content: <p>設定のパネルです。</p> },
      ]}
    />
    <Tabs id="hono-tabs-empty" label="項目がないタブ" items={[]} />
    <Tabs
      id="hono-tabs-unavailable"
      label="利用できないタブ"
      items={[{ value: "locked", label: "利用不可", content: <p>利用不可</p>, disabled: true }]}
    />
    <DisclosureGroup label="中身と置き場所の違い">
      <Disclosure summary="アイコンと件数" open>
        <Tabs
          id="hono-tabs-count"
          label="連絡の分類"
          selected="unread"
          items={[
            {
              value: "all",
              label: "すべて",
              icon: <Icon name="mail" />,
              count: 128,
              content: <p>すべての連絡です。</p>,
            },
            {
              value: "unread",
              label: "未読",
              icon: <Icon name="mail" />,
              count: 3,
              content: <p>まだ読んでいない連絡です。</p>,
            },
            {
              value: "files",
              label: "添付",
              icon: <Icon name="file" />,
              count: 0,
              content: <p>添付ファイルのある連絡です。</p>,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所と長い名前で折り返す">
        <div style="max-inline-size: 20rem">
          <Tabs
            id="hono-tabs-narrow"
            label="資料の分類"
            items={[
              { value: "summary", label: "概要", content: <p>概要のパネルです。</p> },
              {
                value: "long",
                label: "秋の読書会の資料と参加者名簿",
                content: <p>長い名前のパネルです。</p>,
              },
              { value: "history", label: "履歴", content: <p>履歴のパネルです。</p> },
              { value: "settings", label: "設定", content: <p>設定のパネルです。</p> },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Tabs
            id="hono-tabs-rtl"
            label="الأقسام"
            items={[
              { value: "content", label: "المحتوى", count: 4, content: <p>المحتوى</p> },
              { value: "settings", label: "الإعدادات", content: <p>الإعدادات</p> },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
