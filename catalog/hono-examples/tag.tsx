import { Tag, TagGroup, Button, Disclosure, DisclosureGroup } from "../../src/hono";

const removeButton = (label: string) => (
  <Button
    class="remove"
    variant="link"
    size="tag"
    type="button"
    data-icon-only="true"
    aria-label={`${label}を解除`}
  />
);

export default () => (
  <div class="rx-stack">
    <TagGroup label="記事の分類">
      <Tag label="暮らし" />
      <Tag label="読書会" accent="blue" />
      <Tag label="仕事場の記事" href="/apps/search?q=仕事場" />
      <Tag label="公開済み" accent="green" />
      <Tag label="確認中" accent="amber" />
    </TagGroup>
    <DisclosureGroup label="色と置き場所の違い">
      <Disclosure summary="色ごとのタグ" open>
        <TagGroup label="色ごとの分類">
          <Tag label="分類なし" />
          <Tag label="読書会" accent="blue" />
          <Tag label="公開済み" accent="green" />
          <Tag label="確認中" accent="amber" />
          <Tag label="要対応" accent="coral" />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="分類へ移動するタグ" open>
        <TagGroup label="分類から探す">
          <Tag label="仕事場の記事" href="/apps/search?q=仕事場" />
          <Tag label="読書会" accent="blue" href="/apps/search?q=読書会" />
          <Tag label="イベント" accent="green" href="/apps/search?q=イベント" />
          <Tag label="お知らせ" accent="amber" href="/apps/search?q=お知らせ" />
          <Tag label="締め切り" accent="coral" href="/apps/search?q=締め切り" />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="解除できるタグ">
        <TagGroup label="選んだ分類">
          <Tag label="暮らし" removeButton={removeButton("暮らし")} />
          <Tag label="読書会" accent="blue" removeButton={removeButton("読書会")} />
          <Tag label="要対応" accent="coral" removeButton={removeButton("要対応")} />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 12rem">
          <TagGroup label="長い分類">
            <Tag label="初めて仕事場を利用する方へのご案内" accent="blue" />
            <Tag label="https://example.com/articles/autumn-reading-club-2026" />
            <Tag label="秋の読書会の参加者向け" href="/apps/search?q=読書会" />
          </TagGroup>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <TagGroup label="التصنيفات">
            <Tag label="الحياة" />
            <Tag label="نادي القراءة" accent="blue" />
            <Tag label="الفعاليات" accent="green" href="/apps/search?q=events" />
            <Tag label="قيد المراجعة" accent="amber" removeButton={removeButton("قيد المراجعة")} />
          </TagGroup>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
