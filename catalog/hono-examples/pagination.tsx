import { Pagination, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack" data-space="small">
    <Pagination
      items={[
        { label: "前へ" },
        { label: "1", current: true, href: "/apps/search" },
        { label: "2", href: "/apps/search?page=2" },
        { label: "3", href: "/apps/search?page=3" },
        { label: "次へ", href: "/apps/search?page=2" },
      ]}
    />
    <DisclosureGroup label="位置と長さの違い">
      <Disclosure summary="途中のページ：前後があり、間を省く">
        <Pagination
          items={[
            { label: "前へ", href: "/apps/search?page=6" },
            { label: "1", href: "/apps/search" },
            { label: "…" },
            { label: "6", href: "/apps/search?page=6" },
            { label: "7", current: true, href: "/apps/search?page=7" },
            { label: "8", href: "/apps/search?page=8" },
            { label: "…" },
            { label: "24", href: "/apps/search?page=24" },
            { label: "次へ", href: "/apps/search?page=8" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="最後のページ：次へは押せない">
        <Pagination
          items={[
            { label: "前へ", href: "/apps/search?page=2" },
            { label: "1", href: "/apps/search" },
            { label: "2", href: "/apps/search?page=2" },
            { label: "3", current: true, href: "/apps/search?page=3" },
            { label: "次へ" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 14rem">
          <Pagination
            items={[
              { label: "前のページへ", href: "/apps/search?page=6" },
              { label: "6", href: "/apps/search?page=6" },
              { label: "7", current: true, href: "/apps/search?page=7" },
              { label: "8", href: "/apps/search?page=8" },
              { label: "次のページへ", href: "/apps/search?page=8" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Pagination
            label="التنقل بين الصفحات"
            items={[
              { label: "السابق" },
              { label: "١", current: true, href: "/apps/search" },
              { label: "٢", href: "/apps/search?page=2" },
              { label: "التالي", href: "/apps/search?page=2" },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
