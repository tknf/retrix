import { Disclosure, Button, Field, Input, Suggestion } from "../../src/hono";

export default () => (
  <form class="rx-stack" aria-label="記事の分類設定">
    <Field id="hono-suggestion-title" label="記事名">
      {(attributes) => <Input {...attributes} value="仕事場だより" />}
    </Field>
    <Suggestion
      id="hono-category"
      name="category"
      label="分類（自由入力可）"
      options={["お知らせ", "暮らし", "仕事場", "仕事の道具", "イベント", "制作ノート"]}
      placeholder="入力または候補から選択"
      help="入力すると候補を絞り込みます。候補にない分類もそのまま使えます。"
    />
    <Disclosure summary="初期値・候補なし・エラー・利用不可">
      <div class="rx-stack">
        <Suggestion label="初期値のある分類" options={["制作", "編集", "運営"]} value="編集" />
        <Suggestion label="新しい分類" options={[]} placeholder="分類を入力" />
        <Suggestion
          label="分類（必須）"
          options={["お知らせ", "暮らし", "仕事場"]}
          error="分類を入力してください。"
          required
        />
        <Suggestion
          label="分類（利用不可）"
          options={["お知らせ", "暮らし"]}
          value="暮らし"
          disabled
        />
        <Suggestion
          label="分類（読み取り専用）"
          options={["お知らせ", "暮らし"]}
          value="お知らせ"
          readonly
        />
        <Suggestion
          label="長い分類名"
          options={[
            "仕事場で使い続けたい道具と日々の小さな工夫について",
            "地域の暮らしと人のつながりを紹介する読みもの",
          ]}
        />
      </div>
    </Disclosure>
    <Button type="reset">初期値に戻す</Button>
  </form>
);
