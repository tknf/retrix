import { FieldGroup, Field, Input } from "../../src/hono";

export default () => (
  <div class="rx-form">
    <FieldGroup legend="連絡先" description="予約に関するご連絡に使います。">
      <Field id="hono-group-name" label="名前">
        {(attributes) => <Input {...attributes} name="name" autocomplete="name" />}
      </Field>
      <Field id="hono-group-email" label="メールアドレス">
        {(attributes) => <Input {...attributes} type="email" name="email" autocomplete="email" />}
      </Field>
    </FieldGroup>
    <FieldGroup
      legend="配送先（受付停止中）"
      description="現在、配送先の変更は受け付けていません。"
      disabled
    >
      <Field id="hono-group-recipient" label="宛名">
        {(attributes) => <Input {...attributes} name="recipient" value="山田 太郎" />}
      </Field>
      <Field id="hono-group-address" label="住所">
        {(attributes) => <Input {...attributes} name="address" value="東京都千代田区" />}
      </Field>
    </FieldGroup>
  </div>
);
