import { Dialog, Button, Disclosure, Field, Input, DropdownMenu } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Dialog
      id="hono-dialog"
      title="内容を確認する"
      trigger="確認画面を開く"
      description="データは変更しません。"
      size="compact"
    >
      <p>見出しと本文を確認してから、閉じるボタン・Escape・背景のクリックで戻れます。</p>
    </Dialog>
    <Disclosure summary="確認・キャンセル・主要操作">
      <Dialog
        id="dialog-confirm"
        title="下書きを公開しますか？"
        trigger="公開の確認"
        description="この例では実際の公開は行いません。"
        size="compact"
        closeLabel="キャンセル"
        actions={
          <Button variant="primary" data-dialog-target="close">
            公開する
          </Button>
        }
      >
        <p>公開すると、記事が一覧に表示されます。</p>
      </Dialog>
    </Disclosure>
    <Disclosure summary="危険操作・長い操作ラベル">
      <Dialog
        id="dialog-danger"
        title="記事を削除しますか？"
        trigger="削除の確認"
        triggerVariant="danger"
        closeLabel="削除しない"
        size="compact"
        actions={
          <Button variant="danger" data-dialog-target="close">
            記事と添付ファイルを削除する
          </Button>
        }
      >
        <p>この操作を取り消すことはできません。</p>
        <p>この例では確認画面を閉じるだけで、データは削除しません。</p>
      </Dialog>
    </Disclosure>
    <Disclosure summary="フォーム・必須入力・入力欄への初期フォーカス">
      <Dialog
        id="dialog-form"
        title="担当者を登録する"
        trigger="登録フォームを開く"
        description="保存は行わず、入力が有効なら画面を閉じます。"
        initialFocus="content"
        closeLabel="キャンセル"
        actions={
          <Button type="submit" form="dialog-person-form" variant="primary">
            登録する
          </Button>
        }
      >
        <form id="dialog-person-form" method="dialog" class="rx-stack" data-space="small">
          <Field id="dialog-person-name" label="名前" help="必須項目です。">
            {(attributes) => (
              <Input {...attributes} name="name" required autocomplete="name" autofocus />
            )}
          </Field>
          <Field id="dialog-person-email" label="メールアドレス">
            {(attributes) => (
              <Input {...attributes} name="email" type="email" autocomplete="email" />
            )}
          </Field>
        </form>
      </Dialog>
    </Disclosure>
    <Disclosure summary="エラー・処理中・無効な操作">
      <div class="rx-stack" data-space="small">
        <Dialog
          id="dialog-error"
          title="保存できませんでした"
          trigger="エラーの例"
          closeLabel="編集に戻る"
          actions={
            <Button variant="primary" data-dialog-target="close">
              もう一度試す
            </Button>
          }
        >
          <p>通信を確認してから、もう一度お試しください。入力内容は保持されています。</p>
          <p>この例は表示の確認用です。通信処理は行いません。</p>
        </Dialog>
        <Dialog
          id="dialog-busy"
          title="処理中の表示"
          trigger="処理中の例"
          actions={
            <Button variant="primary" busy busyLabel="保存しています…">
              保存する
            </Button>
          }
        >
          <p>主要操作の処理中表示を確認できます。この例の状態は自動では変わりません。</p>
        </Dialog>
        <Dialog
          id="dialog-disabled"
          title="利用できない操作"
          trigger="権限がない場合"
          triggerDisabled
        >
          <p>この画面は開けません。</p>
        </Dialog>
      </div>
    </Disclosure>
    <Disclosure summary="長文・本文スクロール・広いダイアログ">
      <Dialog id="dialog-long" title="公開前の確認事項" trigger="長文の例を開く" size="wide">
        {Array.from({ length: 12 }, (_, index) => (
          <section class="rx-stack" data-space="small">
            <h3>確認事項 {index + 1}</h3>
            <p>
              本文が長い場合は、この領域をスクロールして確認します。見出しの閉じる操作から戻れます。
            </p>
          </section>
        ))}
      </Dialog>
    </Disclosure>
    <Disclosure summary="タイトルと説明のみ・長い見出し">
      <Dialog
        id="dialog-title"
        title="公開前に記事の文章と添付ファイルと公開設定をまとめて確認してください"
        trigger="長い見出しの例"
        description="本文がない場合でも、説明と閉じる操作を表示します。"
        size="compact"
      />
    </Disclosure>
    <Disclosure summary="ダイアログ内のDropdownMenu">
      <Dialog id="dialog-menu" title="添付ファイルの操作" trigger="内側のメニューを確認">
        <p>メニューを閉じても、このダイアログは開いたままです。</p>
        <DropdownMenu
          id="dialog-file-menu"
          label="ファイルの操作"
          items={[
            { label: "確認する", value: "inspect", icon: "eye" },
            {
              kind: "submenu",
              label: "書き出す",
              items: [
                { label: "PDF", value: "pdf" },
                { label: "画像", value: "image" },
              ],
            },
          ]}
        />
      </Dialog>
    </Disclosure>
  </div>
);
