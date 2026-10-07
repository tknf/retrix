import { ActionList, Icon, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <ActionList
      aria-label="よく使うツール"
      items={[
        {
          title: "記事を書く",
          href: "/apps/docs",
          description: "途中まで書いて、下書きとして保存できます。",
          icon: <Icon name="pencil" fill />,
        },
        {
          title: "予約を確認する",
          href: "/apps/schedule",
          description: "日時と人数、利用する部屋を確認します。",
          icon: <Icon name="calendar" fill />,
          accent: "green",
        },
        {
          title: "資料をまとめる",
          href: "/apps/files",
          icon: <Icon name="files" fill />,
          accent: "amber",
        },
        { title: "すべての添付ファイルと過去に公開した資料を確認する", href: "/apps/files" },
      ]}
    />
    <DisclosureGroup label="並べ方と置き場所の違い">
      <Disclosure summary="対応が必要な行" open>
        <ActionList
          aria-label="ログインと確認"
          items={[
            { title: "パスワードを変える", href: "/apps/docs", icon: <Icon name="pencil" fill /> },
            {
              title: "予備のメールアドレス",
              href: "/apps/docs",
              description: "予備のメールアドレスをまだ確かめていません",
              icon: <Icon name="mail" fill />,
              attention: true,
            },
            {
              title: "二段階認証",
              href: "/apps/docs",
              description: "まだ設定していません",
              icon: <Icon name="info" fill />,
              attention: true,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="タイルに並べる">
        <ActionList
          layout="grid"
          aria-label="ツールへのショートカット"
          items={[
            {
              title: "記事",
              href: "/apps/search",
              icon: <Icon name="pencil" fill />,
              accent: "amber",
            },
            {
              title: "予定",
              href: "/apps/schedule",
              icon: <Icon name="calendar" fill />,
              accent: "green",
            },
            { title: "資料", href: "/apps/files", icon: <Icon name="files" fill /> },
            {
              title: "問い合わせ",
              href: "/apps/docs",
              icon: <Icon name="chat" fill />,
              accent: "coral",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="中身の見えるタイル">
        <ActionList
          layout="grid"
          aria-label="内容の見えるツールへのショートカット"
          items={[
            {
              title: "記事",
              href: "/apps/search",
              icon: <Icon name="pencil" fill />,
              accent: "amber",
              description: "下書き2件 · 公開中4件",
              preview: (
                <>
                  <p>仕事場の案内</p>
                  <p>秋の読書会のお知らせ</p>
                </>
              ),
            },
            {
              title: "予定",
              href: "/apps/schedule",
              icon: <Icon name="calendar" fill />,
              accent: "green",
              description: "今週2件",
              preview: (
                <>
                  <p>
                    <time datetime="2026-09-25">9月25日</time>　読書会
                  </p>
                  <p>
                    <time datetime="2026-09-28">9月28日</time>　編集会議
                  </p>
                </>
              ),
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ActionList
            aria-label="狭い場所のツール"
            items={[
              {
                title: "初めて利用する方への案内を書く",
                href: "/apps/docs",
                description: "https://example.com/articles/autumn-reading-club-2026",
                icon: <Icon name="pencil" fill />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ActionList
            aria-label="الأدوات"
            items={[
              {
                title: "كتابة مقال",
                href: "/apps/docs",
                description: "احفظ المسودة وأكملها لاحقًا.",
                icon: <Icon name="pencil" fill />,
              },
              {
                title: "مراجعة الحجز",
                href: "/apps/schedule",
                icon: <Icon name="calendar" fill />,
                accent: "green",
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
