import {
  Disclosure,
  Field,
  Input,
  Textarea,
  Select,
  Choice,
  Button,
  CountedTextarea,
  PasswordField,
  NumberField,
  DateField,
  TimeField,
  Combobox,
  CheckboxGroup,
} from "../../src/hono";

export default () => (
  <div class="rx-split">
    <Field id="hono-error" label="名前" help="一覧に表示します。" error="名前を入力してください。">
      {(attributes) => <Input {...attributes} required name="name" />}
    </Field>
    <Field id="hono-readonly" label="現在の名前">
      {(attributes) => <Input {...attributes} readonly value="現在の値" />}
    </Field>
    <Field id="hono-disabled" label="利用できない入力">
      {(attributes) => <Input {...attributes} disabled value="受付停止中" />}
    </Field>
    <Field id="hono-description" label="説明">
      {(attributes) => (
        <Textarea {...attributes} rows={3}>
          長い説明を入力できます。
        </Textarea>
      )}
    </Field>
    <Field id="hono-select" label="表示状態">
      {(attributes) => (
        <Select {...attributes}>
          <option>表示する</option>
          <option>非表示</option>
        </Select>
      )}
    </Field>
    <Disclosure summary="入力・選択のほかの状態">
      <div class="rx-stack">
        <Field id="hono-description-error" label="説明（エラー）" error="説明を入力してください。">
          {(attributes) => <Textarea {...attributes} rows={3} required />}
        </Field>
        <Field id="hono-description-readonly" label="説明（閲覧専用）">
          {(attributes) => (
            <Textarea {...attributes} rows={3} readonly>
              公開済みの説明です。
            </Textarea>
          )}
        </Field>
        <Field id="hono-description-disabled" label="説明（利用不可）">
          {(attributes) => (
            <Textarea {...attributes} rows={3} disabled>
              受付停止中です。
            </Textarea>
          )}
        </Field>
        <Field id="hono-select-error" label="表示状態（エラー）" error="表示状態を選んでください。">
          {(attributes) => (
            <Select {...attributes} required>
              <option value="">選んでください</option>
              <option value="visible">表示する</option>
              <option value="hidden">非表示</option>
            </Select>
          )}
        </Field>
        <Field id="hono-select-disabled" label="表示状態（利用不可）">
          {(attributes) => (
            <Select {...attributes} disabled>
              <option>非表示</option>
            </Select>
          )}
        </Field>
      </div>
    </Disclosure>
    <Field id="hono-counted-description" label="紹介文（文字数表示）">
      {(attributes) => <CountedTextarea {...attributes} rows={3} limit={40} />}
    </Field>
    <Field id="hono-password" label="パスワード（表示切替）">
      {(attributes) => (
        <PasswordField {...attributes} autocomplete="new-password" value="Retrix-demo-123" />
      )}
    </Field>
    <form
      class="rx-stack"
      data-controller="field-demo"
      data-action="number-field:change->field-demo#record date-field:change->field-demo#record time-field:change->field-demo#record reset->field-demo#reset"
    >
      <Field
        id="hono-number"
        label="部数"
        help="1〜100部。PageUp・PageDownで10部ずつ変更できます。"
      >
        {(attributes) => (
          <NumberField
            {...attributes}
            name="copies"
            min={1}
            max={100}
            step={1}
            value={10}
            pageStep={10}
          />
        )}
      </Field>
      <Field id="hono-date" label="利用日" help="2026年の日付を選べます。">
        {(attributes) => (
          <DateField
            {...attributes}
            name="date"
            min="2026-01-01"
            max="2026-12-31"
            value="2026-09-11"
          />
        )}
      </Field>
      <Field id="hono-time" label="開始時刻" help="9:00〜18:00、30分単位です。">
        {(attributes) => (
          <TimeField
            {...attributes}
            name="time"
            min="09:00"
            max="18:00"
            step={1800}
            value="10:00"
          />
        )}
      </Field>
      <output class="rx-save-status" aria-live="polite">
        値を変更すると、確定した値をここに表示します。
      </output>
      <Button type="reset">日時と部数を戻す</Button>
    </form>
    <Field
      id="hono-combobox"
      label="担当部署（候補選択）"
      help="入力欄か右の矢印を押すと候補が開きます。候補を押して選べます。"
    >
      {(attributes) => (
        <Combobox
          {...attributes}
          toggleLabel="担当部署の候補を開閉"
          listLabel="担当部署の候補"
          options={[
            { value: "編集部", label: "編集部" },
            { value: "営業部", label: "営業部" },
            { value: "制作部", label: "制作部" },
          ]}
        />
      )}
    </Field>
    <Field id="hono-combobox-readonly" label="確定済みの担当部署">
      {(attributes) => (
        <Combobox
          {...attributes}
          readonly
          value="編集部"
          options={[
            { value: "編集部", label: "編集部" },
            { value: "営業部", label: "営業部" },
          ]}
        />
      )}
    </Field>
    <fieldset class="rx-choice-group">
      <legend>チェックの状態</legend>
      <div class="list">
        <Choice label="条件を確認しました" />
        <Choice label="メールで知らせる" checked />
        <Choice label="利用できない項目" disabled />
        <Choice label="選択済みの停止項目" disabled checked />
      </div>
    </fieldset>
    <form class="rx-stack">
      <CheckboxGroup
        legend="複数選択・全選択"
        name="notifications"
        selected={["articles", "required"]}
        options={[
          { value: "articles", label: "新しい記事" },
          { value: "comments", label: "コメント" },
          { value: "updates", label: "更新のお知らせ" },
          { value: "unavailable", label: "利用できない通知", disabled: true },
          { value: "required", label: "常に受け取る通知", disabled: true },
        ]}
      />
      <Button type="reset">選択を戻す</Button>
    </form>
    <CheckboxGroup legend="項目がない設定" name="empty-options" options={[]} />
    <CheckboxGroup
      legend="重複した候補の整理"
      name="unique-options"
      options={[
        { value: "notice", label: "お知らせ" },
        { value: "notice", label: "重複したお知らせ" },
        { value: "", label: "空の値" },
        { value: "digest", label: "週次まとめ" },
      ]}
    />
    <fieldset class="rx-choice-group">
      <legend>連絡方法</legend>
      <div class="list">
        <Choice type="radio" name="contact" label="メール" value="email" checked />
        <Choice type="radio" name="contact" label="電話" value="phone" />
        <Choice type="radio" name="contact" label="郵送（利用不可）" value="post" disabled />
      </div>
    </fieldset>
    <fieldset class="rx-choice-group" disabled>
      <legend>変更できない連絡方法</legend>
      <div class="list">
        <Choice type="radio" name="locked-contact" label="メール（固定）" checked />
        <Choice type="radio" name="locked-contact" label="電話（利用不可）" />
      </div>
    </fieldset>
    <fieldset class="rx-choice-group">
      <legend>利用場所</legend>
      <div class="list">
        <Choice
          type="radio"
          name="hono-choice"
          label="標準"
          description="打ち合わせと共同作業に使えます。"
          kind="option"
          checked
        />
        <Choice
          type="radio"
          name="hono-choice"
          label="静かな部屋"
          description="会話を伴わない作業向けです。"
          kind="option"
        />
      </div>
    </fieldset>
  </div>
);
