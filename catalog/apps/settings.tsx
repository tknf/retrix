import {
  Button,
  CopyField,
  DangerZone,
  DatePicker,
  Dialog,
  Field,
  FieldGroup,
  Icon,
  Input,
  PageHeader,
  Range,
  Section,
  Suggestion,
  Switch,
  Toast,
  Toolbar,
} from "../../src/hono";
import { AppFrame } from "./frame";

export const SettingsScreen = () => (
  <AppFrame current="settings" size="compact">
    <PageHeader
      title="設定"
      icon={<Icon name="grid" />}
      description="ワークスペースの名前と通知を変えます。このブラウザに保存して、次回も同じ設定を使います。"
    />
    <form
      class="rx-stack"
      data-controller="settings-demo"
      data-action="submit->settings-demo#save reset->settings-demo#reset invalid->settings-demo#invalid:capture"
    >
      <FieldGroup
        id="settings-basic"
        legend="基本情報"
        description="ワークスペースの名前や分類、作業期間を設定します。"
      >
        <Field id="workspace-name" label="ワークスペースの名前">
          {(attributes) => (
            <Input {...attributes} name="workspace" required value="小さな仕事場" maxlength={80} />
          )}
        </Field>
        <Suggestion
          id="workspace-category"
          name="category"
          label="分類（自由入力可）"
          value="制作"
          options={["制作", "編集", "運営"]}
        />
        <DatePicker
          id="project-period"
          label="作業期間"
          mode="range"
          startName="project-period-start"
          endName="project-period-end"
          start="2026-09-01"
          end="2026-09-30"
          required
        />
      </FieldGroup>
      <FieldGroup
        id="settings-display"
        legend="通知と表示"
        description="受け取る通知と、一覧の表示方法を設定します。"
      >
        <Switch
          label="週次のまとめを表示"
          description="一週間の更新をまとめて表示します。"
          name="digest"
          checked
        />
        <Switch label="完了した仕事も表示" name="completed" />
        <Range
          id="settings-limit"
          label="一覧の表示件数"
          name="limit"
          min={10}
          max={50}
          step={10}
          value={20}
          unit="件ずつ表示"
        />
      </FieldGroup>
      <Toolbar label="設定の保存">
        <Button type="submit" variant="primary" disabled data-toolbar-target="control">
          設定を保存
        </Button>
        <Button type="reset" variant="link" data-toolbar-target="control">
          初期値に戻す
        </Button>
      </Toolbar>
      <p class="rx-save-status" role="status" data-settings-demo-target="status">
        変更後に「設定を保存」を押してください。
      </p>
      <noscript>
        <p>設定の保存にはJavaScriptが必要です。入力コンポーネントはそのまま試せます。</p>
      </noscript>
      <Toast id="settings-result" tone="success">
        設定をこのブラウザに保存しました。
      </Toast>
    </form>
    <Section title="メンバーを招待する">
      <CopyField
        id="settings-invite"
        label="招待リンク"
        value="https://tsumugu.example.com/join/7fQ2-hK9x"
        help="このリンクを知っている人は、誰でもチームに参加できます。7日後に使えなくなります。"
      />
    </Section>
    <DangerZone
      title="ワークスペースを削除する"
      description="プロジェクト・連絡・資料をすべて削除します。削除した内容は元に戻せません。"
      actions={
        <Dialog
          id="settings-delete"
          title="ワークスペースを削除しますか？"
          trigger="ワークスペースを削除"
          triggerVariant="danger"
          closeLabel="やめる"
          actions={
            <Button variant="danger" data-dialog-target="close">
              削除する
            </Button>
          }
        >
          <p>
            「小さな仕事場」のプロジェクト・連絡・資料をすべて削除します。この画面では実際には削除しません。
          </p>
        </Dialog>
      }
    />
  </AppFrame>
);
