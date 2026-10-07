import {
  ActionLink,
  Button,
  ButtonGroup,
  ContextBar,
  Dialog,
  Disclosure,
  DropdownMenu,
  Field,
  Icon,
  Input,
  Surface,
  Toolbar,
} from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small" aria-label="現在地だけ">
      <h3>現在地だけ</h3>
      <ContextBar items={[{ label: "資料", href: "/apps/files" }, { label: "仕事場の案内" }]} />
    </section>
    <section class="rx-stack" data-space="small" aria-label="一つの主要操作">
      <h3>一つの主要操作</h3>
      <ContextBar items={[{ label: "記事", href: "/apps/search" }, { label: "記事一覧" }]}>
        <ActionLink href="/apps/docs" variant="primary">
          <Icon name="pencil" />
          記事を書く
        </ActionLink>
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="補助操作と主要操作">
      <h3>補助操作と主要操作</h3>
      <ContextBar items={[{ label: "記事", href: "/apps/search" }, { label: "仕事場の案内" }]}>
        <Dialog
          id="context-article-preview"
          title="仕事場の案内"
          trigger="プレビュー"
          size="compact"
        >
          <p>初めて利用する方へ。予約方法と、当日の受付についてご案内します。</p>
          <p>利用する部屋と時間を選び、受付で予約名をお伝えください。</p>
        </Dialog>
        <ActionLink href="/apps/docs" variant="primary">
          <Icon name="pencil" />
          編集する
        </ActionLink>
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="離れたフォームの送信とリセット">
      <h3>離れたフォームの送信とリセット</h3>
      <ContextBar items={[{ label: "記事", href: "/apps/search" }, { label: "検索条件" }]}>
        <Button type="reset" form="context-search-form">
          元に戻す
        </Button>
        <Button type="submit" form="context-search-form" variant="primary">
          <Icon name="search" />
          検索する
        </Button>
      </ContextBar>
      <form id="context-search-form" action="/apps/search" method="get">
        <Field
          id="context-search-query"
          label="キーワード"
          help="検索ボタンはフォームの外側にあります。"
        >
          {(attributes) => <Input {...attributes} name="q" type="search" value="暮らし" required />}
        </Field>
      </form>
    </section>
    <section class="rx-stack" data-space="small" aria-label="主操作とメニューを接続">
      <h3>主操作とメニューを接続</h3>
      <ContextBar items={[{ label: "資料", href: "/apps/files" }, { label: "記事の準備" }]}>
        <ButtonGroup label="記事の準備を始める">
          <ActionLink href="/apps/docs" variant="primary">
            記事を書く
          </ActionLink>
          <DropdownMenu
            id="context-create-menu"
            label="関連する作業を選ぶ"
            iconOnly
            variant="primary"
            align="end"
            items={[
              { kind: "link", label: "記事一覧から選ぶ", href: "/apps/search", icon: "pencil" },
              { kind: "link", label: "使う資料を探す", href: "/apps/files", icon: "files" },
            ]}
          />
        </ButtonGroup>
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="前後の移動と追加操作">
      <h3>前後の移動と追加操作</h3>
      <ContextBar
        items={[
          { label: "受信トレイ", href: "/apps/inbox" },
          { label: "来週の打ち合わせについて" },
        ]}
      >
        <Toolbar label="連絡を移動">
          <ActionLink href="/apps/inbox/categories" size="compact" data-toolbar-target="control">
            前へ
          </ActionLink>
          <ActionLink href="/apps/inbox/review" size="compact" data-toolbar-target="control">
            次へ
          </ActionLink>
        </Toolbar>
        <DropdownMenu
          id="context-message-menu"
          label="その他"
          align="end"
          items={[
            { kind: "link", label: "受信トレイを開く", href: "/apps/inbox", icon: "mail" },
            { kind: "separator" },
            {
              label: "連絡を削除する",
              value: "delete",
              icon: "trash",
              danger: true,
              disabled: true,
              description: "閲覧専用のため削除できません。",
            },
          ]}
        />
      </ContextBar>
    </section>
    <section class="rx-stack" data-space="small" aria-label="処理中と閲覧専用">
      <h3>処理中と閲覧専用</h3>
      <ContextBar items={[{ label: "記事", href: "/apps/search" }, { label: "保存中の記事" }]}>
        <Button busy busyLabel="保存中…" variant="primary">
          保存する
        </Button>
      </ContextBar>
      <ContextBar items={[{ label: "共有資料", href: "/apps/files" }, { label: "閲覧専用の資料" }]}>
        <Button disabled aria-describedby="context-readonly-reason">
          編集する
        </Button>
        <DropdownMenu id="context-locked-menu" label="共有設定" items={[]} disabled />
      </ContextBar>
      <p id="context-readonly-reason">閲覧権限のみの場合は、操作できない理由を本文にも示します。</p>
    </section>
    <section class="rx-stack" data-space="small" aria-label="狭い作業面と長い現在地">
      <h3>狭い作業面と長い現在地</h3>
      <p>同じ画面内の小さな作業面でも、現在地と操作を省略せずに折り返します。</p>
      <div class="rx-split">
        <Surface
          context={
            <ContextBar
              items={[
                { label: "資料", href: "/apps/files" },
                { label: "仕事場の利用案内と申込手順・2026年秋の改訂版" },
              ]}
            >
              <ActionLink href="/assets/sample-cover.svg" download="仕事場の表紙.svg">
                ダウンロード
              </ActionLink>
            </ContextBar>
          }
        >
          <p>本文とContextBarを、同じ作業面の中で組み合わせた例です。</p>
        </Surface>
        <Surface
          context={
            <ContextBar
              items={[
                { label: "プロジェクト", href: "/apps/project" },
                { label: "2026-autumn-editorial-project-abcdefghijklmnopqrstuvwxyz0123456789" },
              ]}
            >
              <ActionLink href="/apps/project">プロジェクトを開く</ActionLink>
            </ContextBar>
          }
        >
          <p>空白のない識別子が届いても、操作を横へ押し出しません。</p>
        </Surface>
      </div>
    </section>
    <Disclosure summary="右から左へ書く言語">
      <ContextBar
        dir="rtl"
        label="الموقع الحالي"
        items={[{ label: "المستندات", href: "/apps/files" }, { label: "دليل استخدام مساحة العمل" }]}
      >
        <ActionLink href="/apps/docs" variant="primary">
          تحرير
        </ActionLink>
      </ContextBar>
    </Disclosure>
  </div>
);
