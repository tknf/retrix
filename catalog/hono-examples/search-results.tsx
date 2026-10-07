import {
  SearchResults,
  OptionalFields,
  Avatar,
  Icon,
  Field,
  Input,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

const results = [
  {
    title: "秋の読書会のお知らせ",
    href: "/",
    excerpt: "今年の秋の読書会は10月3日です。読書会の課題の本は受付で貸し出します。",
    meta: "田中 遥 · 9月20日",
  },
  {
    title: "読書会の会場の予約",
    href: "/",
    excerpt: "第二会議室を18時から21時まで予約しました。",
    meta: "佐藤 健 · 9月18日",
  },
];

export default () => (
  <div class="rx-stack">
    <SearchResults label="「読書会」の検索の結果" query="読書会" results={results} />
    <DisclosureGroup label="並べ方の違い">
      <Disclosure summary="アバターを添える" open>
        <SearchResults
          label="アバターを添えた結果"
          query="案内"
          results={[
            {
              title: "仕事場の案内を更新しました",
              href: "/",
              excerpt: "料金とキャンセル条件の案内を書き足しました。",
              meta: "ヘルプセンター · 12月8日",
              leading: <Avatar name="田中 遥" initials="遥" />,
            },
            {
              title: "案内のPDF",
              href: "/",
              meta: "PDF · 2.4 MB",
              leading: <Icon name="file" />,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="条件を追加する列と並べる">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr)); gap: var(--rx-space-6)">
          <OptionalFields
            label="結果を絞る"
            layout="stack"
            items={[
              {
                id: "refine-from",
                label: "差出人",
                icon: "user",
                field: (
                  <Field id="refine-from" label="差出人">
                    {(control) => <Input {...control} name="from" />}
                  </Field>
                ),
              },
              {
                id: "refine-attach",
                label: "添付がある",
                icon: "attach",
                field: (
                  <Field id="refine-attach" label="添付の種類">
                    {(control) => <Input {...control} name="attach" />}
                  </Field>
                ),
              },
            ]}
          />
          <SearchResults label="絞った結果" query="読書会" results={results} />
        </div>
      </Disclosure>
      <Disclosure summary="長い題名と抜粋：抜粋は二行まで">
        <SearchResults
          label="長い結果"
          query="予約"
          results={[
            {
              title:
                "初めて利用する方に向けた予約方法と当日の受付の流れを、写真付きで分かりやすく書き直しました",
              href: "/",
              excerpt:
                "予約はウェブから受け付けます。予約の取り消しは前日まで無料です。当日の受付では予約の番号を伝えてください。予約がない方も空きがあれば利用できます。",
              meta: "ヘルプセンター · 12月8日",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SearchResults
            label="نتائج البحث"
            query="نادي"
            results={[
              {
                title: "نادي القراءة في الخريف",
                href: "/",
                excerpt: "يجتمع نادي القراءة في أكتوبر.",
                meta: "هارو · 20 سبتمبر",
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
