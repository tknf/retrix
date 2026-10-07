import { Popover, Dialog, Disclosure, Button, ActionLink, Field, Input } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Popover id="hono-popover" label="共有範囲">
      <p>この案件に参加しているメンバーが閲覧できます。</p>
      <a href="/apps/settings">設定を開く</a>
    </Popover>
    <Disclosure summary="説明だけ・アイコンのみのトリガー">
      <div class="rx-cluster">
        <Popover
          id="popover-note"
          label="公開範囲について"
          size="compact"
          description="公開すると、リンクを知っている人が閲覧できます。"
        />
        <Popover
          id="popover-icon"
          label="閲覧権限について"
          title="閲覧できる人"
          icon="info"
          iconOnly
          size="compact"
        >
          <p>招待されたメンバーだけが閲覧できます。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="関連リンク・操作欄">
      <Popover
        id="popover-links"
        label="関連するページ"
        title="案件の管理"
        actions={
          <ActionLink href="/apps/settings" variant="primary">
            設定を開く
          </ActionLink>
        }
      >
        <a href="/apps/project">案件の状況を見る</a>
        <a href="/apps/schedule">予定を見る</a>
      </Popover>
    </Disclosure>
    <Disclosure summary="短い入力・必須入力の検証">
      <Popover
        id="popover-search"
        label="記事を検索"
        title="キーワードで探す"
        actions={
          <Button type="submit" form="popover-search-form" variant="primary">
            検索する
          </Button>
        }
      >
        <form id="popover-search-form" action="/apps/search" method="get">
          <Field id="popover-query" label="キーワード" help="必須項目です。">
            {(attributes) => <Input {...attributes} name="q" required placeholder="例：案内" />}
          </Field>
        </form>
      </Popover>
    </Disclosure>
    <Disclosure summary="右寄せ・右から左の配置">
      <div class="rx-stack" data-space="small">
        <Popover id="popover-end" label="右端の補足" align="end">
          <p>末端に揃え、画面に収まらない場合は位置を調整します。</p>
        </Popover>
        <Popover id="popover-rtl" label="右から左の補足" dir="rtl">
          <p>文字の方向に合わせて、配置の始端と末端を切り替えます。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="長い見出し・長文・スクロール">
      <Popover
        id="popover-long"
        label="公開前の補足を読む"
        size="wide"
        title="公開前に文章と添付ファイルと共有設定をまとめて確認してください"
      >
        {Array.from({ length: 10 }, (_, index) => (
          <p>
            確認事項 {index + 1}
            ：文章やリンク先、添付ファイルに誤りがないことを確認してください。長い内容は本文領域でスクロールできます。
          </p>
        ))}
      </Popover>
    </Disclosure>
    <Disclosure summary="処理中・エラー・無効状態">
      <div class="rx-cluster">
        <Popover
          id="popover-loading"
          label="取得中の例"
          title="共有情報を取得しています"
          actions={
            <Button busy busyLabel="取得中…">
              再取得
            </Button>
          }
        >
          <p>この例は表示の確認用で、状態は自動では変わりません。</p>
        </Popover>
        <Popover id="popover-error" label="エラーの例" title="共有情報を取得できませんでした">
          <p>時間をおいて、もう一度開いてください。この例では通信を行いません。</p>
        </Popover>
        <Popover id="popover-disabled" label="権限のない補足" disabled>
          <p>この補足は開けません。</p>
        </Popover>
      </div>
    </Disclosure>
    <Disclosure summary="Popover内の補足・Dialog内の補足">
      <div class="rx-cluster">
        <Popover id="popover-parent" label="公開設定の補足">
          <p>公開する範囲を確認してください。</p>
          <Popover id="popover-child" label="リンク共有について" size="compact">
            <p>リンクを知っている人が閲覧できます。閉じると元の補足へ戻ります。</p>
          </Popover>
        </Popover>
        <Dialog id="popover-in-dialog" title="共有設定の確認" trigger="Dialog内で確認する">
          <p>補足を閉じても、この確認画面は開いたままです。</p>
          <Popover id="popover-dialog-help" label="共有範囲の補足" size="compact">
            <p>招待されたメンバーだけが閲覧できます。</p>
          </Popover>
        </Dialog>
      </div>
    </Disclosure>
  </div>
);
