import { Disclosure, Button, Switch } from "../../src/hono";

export default () => (
  <form class="rx-stack" aria-label="通知と表示の設定">
    <div class="rx-stack" data-space="small">
      <Switch
        id="hono-switch-digest"
        label="週次のまとめ"
        name="digest"
        value="weekly"
        checked
        description="一週間の更新をまとめて受け取ります。"
      />
      <Switch id="hono-switch-completed" label="完了した仕事を表示" name="completed" value="show" />
    </div>
    <Disclosure summary="利用不可・長いラベル">
      <div class="rx-stack">
        <fieldset class="rx-choice-group" disabled>
          <legend>管理者が管理している設定</legend>
          <div class="list">
            <Switch label="お知らせを受け取る" name="locked-news" checked />
            <Switch label="外部への共有を許可" name="locked-sharing" disabled />
          </div>
        </fieldset>
        <Switch
          label="担当するすべてのプロジェクトについて、今週の更新をまとめて受け取る"
          description="毎週月曜日の朝に、各プロジェクトの変更をお知らせします。"
          name="all-projects"
        />
      </div>
    </Disclosure>
    <Button type="reset">初期値に戻す</Button>
    <a href="/apps/settings">設定画面で保存・復元を試す</a>
  </form>
);
