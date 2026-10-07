import { ErrorSummary, Field, Input, Button, Disclosure, DisclosureGroup } from "../../src/hono";

const manyErrors = [
  "記事名を入力してください",
  "カテゴリを選んでください",
  "公開日を入力してください",
  "公開日は今日以降の日付にしてください",
  "概要を120文字以内にしてください",
  "見出し画像を選んでください",
  "見出し画像の代替テキストを入力してください",
  "担当者を選んでください",
  "連絡先のメールアドレスを確認してください",
  "電話番号の形式を確認してください",
  "タグは5つまでにしてください",
  "利用規約への同意が必要です",
].map((label) => ({ label, href: "#hono-error-title" }));

export default () => (
  <div class="rx-stack">
    <form action="/apps/search" method="get" class="rx-stack">
      <ErrorSummary
        id="hono-errors"
        errors={[
          { label: "記事名を入力してください", href: "#hono-error-title" },
          { label: "連絡先のメールアドレスを確認してください", href: "#hono-error-email" },
        ]}
      />
      <Field id="hono-error-title" label="記事名" error="記事名を入力してください">
        {(attributes) => <Input {...attributes} name="q" required />}
      </Field>
      <Field
        id="hono-error-email"
        label="メールアドレス"
        error="メールアドレスの形式を確認してください"
      >
        {(attributes) => (
          <Input {...attributes} type="email" name="email" value="example" required />
        )}
      </Field>
      <Button type="submit">入力を確認する</Button>
    </form>
    <DisclosureGroup label="件数と置き場所の違い">
      <Disclosure summary="一件だけ" open>
        <ErrorSummary
          id="hono-errors-one"
          title="送信できませんでした"
          errors={[{ label: "記事名を入力してください", href: "#hono-error-title" }]}
        />
      </Disclosure>
      <Disclosure summary="項目が多い">
        <ErrorSummary id="hono-errors-many" errors={manyErrors} />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ErrorSummary
            id="hono-errors-narrow"
            title="公開前に確認が必要な項目があります"
            errors={[
              {
                label: "見出し画像の代替テキストを、画像の内容が分かる文で入力してください",
                href: "#hono-error-title",
              },
              {
                label: "https://example.com/articles/autumn-reading-club-2026 は既に使われています",
                href: "#hono-error-title",
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ErrorSummary
            id="hono-errors-rtl"
            title="تحقق من البيانات المدخلة"
            errors={[
              { label: "أدخل عنوان المقال", href: "#hono-error-title" },
              { label: "تحقق من عنوان البريد الإلكتروني", href: "#hono-error-email" },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
