import { Disclosure, Button, Field, FileInput, Input } from "../../src/hono";

export default () => (
  <form class="rx-stack" aria-label="ファイルの添付例">
    <Field id="hono-file-title" label="資料名">
      {(attributes) => <Input {...attributes} value="イベントのご案内" />}
    </Field>
    <FileInput
      id="hono-file"
      name="attachments"
      label="添付資料"
      accept=".pdf,application/pdf"
      multiple
      help="PDFを複数選択できます。選び直すと選択内容を入れ替えます。"
    />
    <Disclosure summary="1ファイル・必須・エラー・利用不可">
      <div class="rx-stack">
        <FileInput
          id="hono-file-single"
          name="cover"
          label="表紙画像"
          accept="image/*"
          help="画像を1ファイル選択できます。"
        />
        <FileInput
          id="hono-file-required"
          name="application"
          label="申込書（必須）"
          accept=".pdf"
          required
        />
        <FileInput
          name="reviewed_attachment"
          label="添付資料（エラー）"
          accept=".pdf"
          error="PDF形式のファイルを選び直してください。"
        />
        <FileInput name="unavailable_attachment" label="添付資料（利用不可）" disabled />
        <fieldset class="rx-field-group" disabled>
          <legend>グループ全体が利用不可</legend>
          <FileInput
            id="hono-file-disabled-group"
            name="group_attachment"
            label="グループ内の添付資料"
          />
        </fieldset>
      </div>
    </Disclosure>
    <Button type="reset">選択をリセット</Button>
  </form>
);
