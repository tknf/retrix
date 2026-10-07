import {
  DangerZone,
  Button,
  Dialog,
  Disclosure,
  DisclosureGroup,
  ActionLink,
  Notice,
  Field,
  Input,
} from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <DangerZone
      id="hono-danger-zone"
      title="記事を削除する"
      description="この記事と添付ファイルを削除します。削除した内容は元に戻せません。"
      actions={
        <Dialog
          id="danger-zone-delete"
          title="記事を削除しますか？"
          trigger="削除の確認"
          triggerVariant="danger"
          closeLabel="キャンセル"
          size="compact"
          actions={
            <Button variant="danger" data-dialog-target="close">
              記事を削除する
            </Button>
          }
        >
          <p>「9月のお知らせ」と添付ファイル2件が対象です。この操作は取り消せません。</p>
          <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
        </Dialog>
      }
    />
    <DisclosureGroup label="状態と置き場所の違い">
      <Disclosure summary="設定画面に並べる：影響の小さい順に積む" open>
        <div class="rx-stack">
          <DangerZone
            title="公開を停止する"
            description="記事は下書きに戻り、共有済みのリンクからは読めなくなります。後で再公開できます。"
            actions={<Button variant="danger">公開を停止する</Button>}
          />
          <DangerZone
            title="所有者を変更する"
            description="所有者だけが記事の削除と公開範囲の変更をできます。変更後、あなたは編集者になります。"
            actions={<Button variant="danger">所有者を選ぶ</Button>}
          />
          <DangerZone
            title="記事を削除する"
            description="この記事と添付ファイルを削除します。削除した内容は元に戻せません。"
            actions={<Button variant="danger">削除の確認</Button>}
          />
        </div>
      </Disclosure>
      <Disclosure summary="名前を入力して確認する">
        <DangerZone
          title="プロジェクトを削除する"
          description="プロジェクト内の記事・ファイル・コメントをすべて削除します。"
          actions={
            <Dialog
              id="danger-zone-typed"
              title="プロジェクトを削除しますか？"
              trigger="削除の確認"
              triggerVariant="danger"
              closeLabel="キャンセル"
              size="compact"
              actions={
                <Button variant="danger" data-dialog-target="close">
                  プロジェクトを削除する
                </Button>
              }
            >
              <p>確認のため、プロジェクト名「秋の特集」を入力してください。</p>
              <Field id="danger-zone-typed-name" label="プロジェクト名">
                {(attributes) => <Input {...attributes} name="project-name" autocomplete="off" />}
              </Field>
            </Dialog>
          }
        />
      </Disclosure>
      <Disclosure summary="操作できない場合">
        <DangerZone
          title="プロジェクトを削除する"
          description="プロジェクト内の記事・ファイル・コメントをすべて削除します。"
          actions={
            <Button variant="danger" disabled aria-describedby="danger-zone-permission">
              削除の確認
            </Button>
          }
        >
          <p id="danger-zone-permission">
            削除できるのは管理者のみです。管理者に依頼してください。
          </p>
        </DangerZone>
      </Disclosure>
      <Disclosure summary="処理中">
        <DangerZone
          title="記事を削除する"
          description="この記事と添付ファイルを削除しています。完了するまでお待ちください。"
          actions={
            <Button variant="danger" busy busyLabel="削除しています…">
              記事を削除する
            </Button>
          }
        />
        <p>処理中の表示例です。この作例の状態は自動では変わりません。</p>
      </Disclosure>
      <Disclosure summary="失敗した場合">
        <DangerZone
          title="記事を削除する"
          description="この記事と添付ファイルを削除します。削除した内容は元に戻せません。"
          actions={
            <Dialog
              id="danger-zone-retry"
              title="削除する内容を確認"
              trigger="もう一度確認する"
              triggerVariant="danger"
              closeLabel="キャンセル"
              size="compact"
              actions={
                <Button variant="danger" data-dialog-target="close">
                  記事を削除する
                </Button>
              }
            >
              <p>「9月のお知らせ」と添付ファイル2件を削除します。この操作は取り消せません。</p>
              <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
            </Dialog>
          }
        >
          <Notice tone="danger" label="削除できませんでした">
            <p>
              通信に失敗しました。記事は削除されていません。接続を確認してからやり直してください。
            </p>
          </Notice>
        </DangerZone>
      </Disclosure>
      <Disclosure summary="長い説明・複数の操作・狭い領域">
        <div class="rx-split">
          <DangerZone
            title="プロジェクトと関連するすべてのデータを削除する"
            description="このプロジェクトの記事、添付ファイル、コメントを削除します。参加しているメンバー全員が閲覧できなくなり、共有済みのリンクからもアクセスできなくなります。"
            actions={
              <>
                <ActionLink href="/apps/files">添付ファイルを確認する</ActionLink>
                <Dialog
                  id="danger-zone-project"
                  title="プロジェクトを削除しますか？"
                  trigger="プロジェクトと関連データの削除を確認する"
                  triggerVariant="danger"
                  closeLabel="キャンセル"
                  size="compact"
                  actions={
                    <Button variant="danger" data-dialog-target="close">
                      プロジェクトと関連データをすべて削除する
                    </Button>
                  }
                >
                  <p>
                    プロジェクト「秋の特集」の記事12件、添付ファイル8件、コメント32件を削除します。
                  </p>
                  <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
                </Dialog>
              </>
            }
          >
            <p>必要な添付ファイルを保存してから進んでください。削除したデータは復元できません。</p>
            <p>対象：autumn-editorial-project-2026-abcdefghijklmnopqrstuvwxyz0123456789</p>
          </DangerZone>
          <p>
            この作例では隣に本文を置き、コンポーネントの幅が狭くなった場合の折り返しを確認できます。
          </p>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <DangerZone
          lang="ar"
          dir="rtl"
          title="حذف المشروع"
          description="سيتم حذف المشروع والملفات المرتبطة به. لا يمكن التراجع عن هذا الإجراء."
          actions={
            <Button variant="danger" disabled aria-describedby="danger-zone-permission-rtl">
              حذف المشروع
            </Button>
          }
        >
          <p id="danger-zone-permission-rtl">يمكن للمسؤول فقط حذف المشروع.</p>
        </DangerZone>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
