import { EmptyState, ActionLink, Disclosure, DisclosureGroup, Icon } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <EmptyState
      title="条件に合う記事が見つかりませんでした"
      actions={<ActionLink href="/apps/search">条件をクリアする</ActionLink>}
    >
      <p>キーワードを短くするか、公開状態の絞り込みを外してみてください。</p>
    </EmptyState>
    <DisclosureGroup label="場面と置き場所の違い">
      <Disclosure summary="初めて使うとき" open>
        <EmptyState
          kind="start"
          title="最初の記事を書いてみましょう"
          actions={
            <ActionLink href="/apps/docs" variant="primary">
              記事を書く
            </ActionLink>
          }
        >
          <p>
            お知らせや日々の記録を、ここにまとめられます。途中まで書いて、下書きとして残すこともできます。
          </p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="作業が終わったとき" open>
        <EmptyState kind="complete" title="今日の確認はすべて終わりました">
          <p>新しく確認する記事が届いたら、ここに表示します。</p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="アイコンを差し替える・操作が二つ">
        <EmptyState
          title="予約はまだありません"
          icon={<Icon name="calendar" />}
          actions={
            <>
              <ActionLink href="/apps/docs" variant="primary">
                予約を入れる
              </ActionLink>
              <ActionLink href="/apps/docs">予約の受け方を読む</ActionLink>
            </>
          }
        >
          <p>会議室や備品の予約が入ると、日付の順に並びます。</p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="題名だけ">
        <EmptyState title="通知はありません" />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 20rem">
          <EmptyState
            kind="start"
            title="このフォルダにはまだ資料がありません。最初の資料を追加しましょう"
            actions={<ActionLink href="/apps/docs">資料を追加する</ActionLink>}
          >
            <p>PDF・画像・表計算のファイルを置けます。</p>
          </EmptyState>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EmptyState kind="complete" title="اكتملت جميع المراجعات لهذا اليوم">
            <p>ستظهر المقالات الجديدة هنا عند وصولها.</p>
          </EmptyState>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
