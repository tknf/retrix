import { Toolbar, Button, ActionLink, Field, Input, Disclosure } from "../../src/hono";

export default ({ id = "hono-toolbar" }: { id?: string } = {}) => (
  <div class="rx-stack">
    <form class="rx-stack" action="/apps/search" method="get">
      <Field id={`${id}-query`} label="記事のキーワード">
        {(attributes) => <Input {...attributes} name="q" value="案内" />}
      </Field>
      <Toolbar id={`${id}-search`} label="検索の操作" aria-describedby={`${id}-help`}>
        <Button type="submit" variant="primary" data-toolbar-target="control">
          検索する
        </Button>
        <Button type="reset" data-toolbar-target="control">
          初期値に戻す
        </Button>
        <ActionLink href="/apps/search" data-toolbar-target="control">
          記事一覧
        </ActionLink>
      </Toolbar>
      <p id={`${id}-help`}>検索結果へ移動します。リセットはキーワードを「案内」に戻します。</p>
    </form>
    <Disclosure summary="移動リンク・利用できない操作との組み合わせ">
      <Toolbar label="記事の操作">
        <ActionLink href="/apps/docs" data-toolbar-target="control">
          編集
        </ActionLink>
        <ActionLink href="/apps/docs" data-toolbar-target="control">
          比較
        </ActionLink>
        <Button disabled data-toolbar-target="control">
          変更なし
        </Button>
      </Toolbar>
    </Disclosure>
    <Disclosure summary="長いラベル・サイズ違い・右から左の配置">
      <div class="rx-stack">
        <Toolbar label="公開前の確認">
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            公開前に文章と設定の変更内容を確認する
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            編集画面へ戻って内容を修正する
          </ActionLink>
        </Toolbar>
        <Toolbar label="サイズ違いの操作">
          <ActionLink href="/apps/docs" size="compact" data-toolbar-target="control">
            編集
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            比較
          </ActionLink>
          <ActionLink href="/apps/search" size="large" data-toolbar-target="control">
            記事一覧
          </ActionLink>
        </Toolbar>
        <Toolbar label="右から左に並ぶ操作" dir="rtl">
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            編集
          </ActionLink>
          <ActionLink href="/apps/docs" data-toolbar-target="control">
            比較
          </ActionLink>
          <Button disabled data-toolbar-target="control">
            変更なし
          </Button>
        </Toolbar>
      </div>
    </Disclosure>
  </div>
);
