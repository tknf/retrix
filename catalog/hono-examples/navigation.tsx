import { Navigation, Icon, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <div style="max-inline-size: 18rem">
      <Navigation
        label="記事の分類"
        items={[
          { label: "すべての記事", href: "/apps/search", current: true, count: 6 },
          { label: "下書き", href: "/apps/search?state=draft", count: 2 },
          { label: "道具箱へ", href: "/" },
        ]}
      />
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="アイコン付き">
        <div style="max-inline-size: 18rem">
          <Navigation
            label="設定項目"
            items={[
              {
                label: "基本情報",
                href: "#basic",
                icon: <Icon name="pencil" fill />,
                current: true,
              },
              { label: "通知と表示", href: "#display", icon: <Icon name="mail" fill /> },
              { label: "予定", href: "#calendar", icon: <Icon name="calendar" fill />, count: 12 },
              { label: "ファイル", href: "#files", icon: <Icon name="files" fill /> },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="長い名前・狭い場所で折り返す">
        <div style="max-inline-size: 14rem">
          <Navigation
            label="長い名前の分類"
            items={[
              {
                label: "公開前の確認が終わっていない、とても長い名前の記事",
                href: "/apps/search?state=review",
                current: true,
                count: 128,
              },
              { label: "下書き", href: "/apps/search?state=draft", count: 2 },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar" style="max-inline-size: 18rem">
          <Navigation
            label="تصنيف المقالات"
            items={[
              { label: "كل المقالات", href: "/apps/search", current: true, count: 6 },
              {
                label: "المسودات",
                href: "/apps/search?state=draft",
                icon: <Icon name="pencil" fill />,
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
