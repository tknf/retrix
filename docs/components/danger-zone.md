<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# DangerZone

削除や公開の取り消しなど、影響の大きい操作を説明と一緒にまとめます。

## 使いどころ

- 設定画面の末尾などに、削除・公開の停止・所有者の変更のような影響の大きい操作を、通常の保存と分けて置く時に使います。
- 押した後の確認は `Dialog` を `actions` に渡して挟みます。取り消せない操作では、確認に対象の名前や件数を書きます。
- 影響のある操作が並ぶ時は、一つの操作に一つの `DangerZone` を使い、影響の小さい順に並べます。
- 操作を伴わない注意の文は `Notice` を使います。

## 使い方

`title` で操作名、`description` で影響、`actions` で `Button`・`ActionLink`・`Dialog` を渡します。`children` には追加の説明やフォームを入れ、説明と操作の間に置きます。

淡いピンク（`#faeeee`）の面に淡い赤の1pxの枠を付けた、角の無い区画にし、通常の設定と見分けます。題名は本文の大きさ（13px）の赤茶（`#a52a2a`）の太字、説明は12pxの灰色にし、危険の色で塗った `Button` を添えます。`children` が無く幅がある時は題名と説明の末尾側に操作を置き、狭い時や `children` がある時は下の段へ回します。操作は幅が足りなければ折り返します。`children` や `actions` が無い時は、その段を詰めます。

`DangerZone` 自体にcontrollerの登録は要りません。確認に `Dialog` を使う時は `DialogController` を登録します。

削除などの処理・権限の判定・状態の更新は利用側が行います。処理中は操作に `busy` を渡し、失敗した時は `Notice` を `children` に入れて伝えます。

## アクセシビリティ

- 題名は `h2` です。置く場所の見出しの階層に合わせて、画面の構成を確かめます。
- 権限などで押せない時は、理由の文を `children` に置き、操作の `aria-describedby` で結び付けます。
- 強制カラーモードでは面の色を外し、全体を文字の色の枠で囲みます。

## API

### DangerZone

影響の説明と操作をまとめる。確認や実行には利用側のButton・Dialogを渡す。

| 名前          | 型       | 既定値             | 説明                                                                                             |
| ------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `title`       | `string` | `"影響のある操作"` | 操作の名前。`h2`で置く。                                                                         |
| `description` | `string` |                    | 操作の影響。何が消え、元に戻せるかを書く。                                                       |
| `actions`     | `Child`  |                    | 説明の下に並べる操作。ButtonやActionLink、確認を挟む時はDialogを渡す。幅が足りなければ折り返す。 |
| `children`    | `Child`  |                    | 説明と操作の間に置く、追加の説明やフォーム。                                                     |

ほかに、`<section>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/danger-zone.css`

## コード

```tsx
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
} from "@tknf/retrix/hono";

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
          <p>
            「9月のお知らせ」と添付ファイル2件が対象です。この操作は取り消せません。
          </p>
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
                {(attributes) => (
                  <Input {...attributes} name="project-name" autocomplete="off" />
                )}
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
              <p>
                「9月のお知らせ」と添付ファイル2件を削除します。この操作は取り消せません。
              </p>
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
            <p>
              必要な添付ファイルを保存してから進んでください。削除したデータは復元できません。
            </p>
            <p>
              対象：autumn-editorial-project-2026-abcdefghijklmnopqrstuvwxyz0123456789
            </p>
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
            <Button
              variant="danger"
              disabled
              aria-describedby="danger-zone-permission-rtl"
            >
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
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section id="hono-danger-zone" class="rx-danger-zone">
    <header class="heading">
      <h2>記事を削除する</h2>
      <p>この記事と添付ファイルを削除します。削除した内容は元に戻せません。</p>
    </header>
    <div class="body"></div>
    <div class="actions">
      <div class="rx-dialog" data-controller="dialog" data-state="closed">
        <button
          data-dialog-target="trigger"
          aria-controls="danger-zone-delete"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
          class="rx-button"
          type="button"
          data-variant="danger"
          data-size="default"
        >
          削除の確認
        </button>
        <dialog
          id="danger-zone-delete"
          class="panel rx-overlay"
          closedby="any"
          data-dialog-target="dialog"
          data-state="closed"
          data-size="compact"
          aria-labelledby="danger-zone-delete-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h2
                id="danger-zone-delete-title"
                data-dialog-target="title"
                tabindex="-1"
                autofocus=""
              >
                記事を削除しますか？
              </h2>
              <span class="close"
                ><button
                  data-dialog-target="close"
                  data-icon-only="true"
                  aria-label="キャンセル"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="default"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x"></use>
                  </svg></button
              ></span>
            </div>
          </header>
          <div class="body">
            <p>
              「9月のお知らせ」と添付ファイル2件が対象です。この操作は取り消せません。
            </p>
            <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
          </div>
          <footer class="actions">
            <button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              キャンセル</button
            ><button
              data-dialog-target="close"
              class="rx-button"
              type="button"
              data-variant="danger"
              data-size="default"
            >
              記事を削除する
            </button>
          </footer>
        </dialog>
      </div>
    </div>
  </section>
  <div class="rx-disclosure-group" role="group" aria-label="状態と置き場所の違い">
    <details open="" class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"
          ><span class="title">設定画面に並べる：影響の小さい順に積む</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack">
          <section class="rx-danger-zone">
            <header class="heading">
              <h2>公開を停止する</h2>
              <p>
                記事は下書きに戻り、共有済みのリンクからは読めなくなります。後で再公開できます。
              </p>
            </header>
            <div class="body"></div>
            <div class="actions">
              <button
                class="rx-button"
                type="button"
                data-variant="danger"
                data-size="default"
              >
                公開を停止する
              </button>
            </div>
          </section>
          <section class="rx-danger-zone">
            <header class="heading">
              <h2>所有者を変更する</h2>
              <p>
                所有者だけが記事の削除と公開範囲の変更をできます。変更後、あなたは編集者になります。
              </p>
            </header>
            <div class="body"></div>
            <div class="actions">
              <button
                class="rx-button"
                type="button"
                data-variant="danger"
                data-size="default"
              >
                所有者を選ぶ
              </button>
            </div>
          </section>
          <section class="rx-danger-zone">
            <header class="heading">
              <h2>記事を削除する</h2>
              <p>この記事と添付ファイルを削除します。削除した内容は元に戻せません。</p>
            </header>
            <div class="body"></div>
            <div class="actions">
              <button
                class="rx-button"
                type="button"
                data-variant="danger"
                data-size="default"
              >
                削除の確認
              </button>
            </div>
          </section>
        </div>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"><span class="title">名前を入力して確認する</span></span>
      </summary>
      <div class="body">
        <section class="rx-danger-zone">
          <header class="heading">
            <h2>プロジェクトを削除する</h2>
            <p>プロジェクト内の記事・ファイル・コメントをすべて削除します。</p>
          </header>
          <div class="body"></div>
          <div class="actions">
            <div class="rx-dialog" data-controller="dialog" data-state="closed">
              <button
                data-dialog-target="trigger"
                aria-controls="danger-zone-typed"
                aria-haspopup="dialog"
                aria-expanded="false"
                data-state="closed"
                class="rx-button"
                type="button"
                data-variant="danger"
                data-size="default"
              >
                削除の確認
              </button>
              <dialog
                id="danger-zone-typed"
                class="panel rx-overlay"
                closedby="any"
                data-dialog-target="dialog"
                data-state="closed"
                data-size="compact"
                aria-labelledby="danger-zone-typed-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h2
                      id="danger-zone-typed-title"
                      data-dialog-target="title"
                      tabindex="-1"
                      autofocus=""
                    >
                      プロジェクトを削除しますか？
                    </h2>
                    <span class="close"
                      ><button
                        data-dialog-target="close"
                        data-icon-only="true"
                        aria-label="キャンセル"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
                        data-size="default"
                      >
                        <svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-x"></use>
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <p>確認のため、プロジェクト名「秋の特集」を入力してください。</p>
                  <div class="rx-field">
                    <div class="heading">
                      <label for="danger-zone-typed-name">プロジェクト名</label>
                    </div>
                    <input
                      id="danger-zone-typed-name"
                      name="project-name"
                      autocomplete="off"
                      class="rx-input"
                    />
                  </div>
                </div>
                <footer class="actions">
                  <button
                    data-dialog-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    キャンセル</button
                  ><button
                    data-dialog-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="danger"
                    data-size="default"
                  >
                    プロジェクトを削除する
                  </button>
                </footer>
              </dialog>
            </div>
          </div>
        </section>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"><span class="title">操作できない場合</span></span>
      </summary>
      <div class="body">
        <section class="rx-danger-zone">
          <header class="heading">
            <h2>プロジェクトを削除する</h2>
            <p>プロジェクト内の記事・ファイル・コメントをすべて削除します。</p>
          </header>
          <div class="body">
            <p id="danger-zone-permission">
              削除できるのは管理者のみです。管理者に依頼してください。
            </p>
          </div>
          <div class="actions">
            <button
              aria-describedby="danger-zone-permission"
              class="rx-button"
              type="button"
              data-variant="danger"
              data-size="default"
              disabled=""
            >
              削除の確認
            </button>
          </div>
        </section>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"><span class="title">処理中</span></span>
      </summary>
      <div class="body">
        <section class="rx-danger-zone">
          <header class="heading">
            <h2>記事を削除する</h2>
            <p>この記事と添付ファイルを削除しています。完了するまでお待ちください。</p>
          </header>
          <div class="body"></div>
          <div class="actions">
            <button
              class="rx-button"
              type="button"
              data-variant="danger"
              data-size="default"
              data-busy="true"
              disabled=""
              aria-busy="true"
            >
              削除しています…
            </button>
          </div>
        </section>
        <p>処理中の表示例です。この作例の状態は自動では変わりません。</p>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"><span class="title">失敗した場合</span></span>
      </summary>
      <div class="body">
        <section class="rx-danger-zone">
          <header class="heading">
            <h2>記事を削除する</h2>
            <p>この記事と添付ファイルを削除します。削除した内容は元に戻せません。</p>
          </header>
          <div class="body">
            <aside
              class="rx-notice"
              data-tone="danger"
              aria-label="削除できませんでした"
            >
              <div class="heading">
                <span class="symbol" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x"></use></svg
                ></span>
                <p class="title">削除できませんでした</p>
              </div>
              <div class="body">
                <p>
                  通信に失敗しました。記事は削除されていません。接続を確認してからやり直してください。
                </p>
              </div>
            </aside>
          </div>
          <div class="actions">
            <div class="rx-dialog" data-controller="dialog" data-state="closed">
              <button
                data-dialog-target="trigger"
                aria-controls="danger-zone-retry"
                aria-haspopup="dialog"
                aria-expanded="false"
                data-state="closed"
                class="rx-button"
                type="button"
                data-variant="danger"
                data-size="default"
              >
                もう一度確認する
              </button>
              <dialog
                id="danger-zone-retry"
                class="panel rx-overlay"
                closedby="any"
                data-dialog-target="dialog"
                data-state="closed"
                data-size="compact"
                aria-labelledby="danger-zone-retry-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h2
                      id="danger-zone-retry-title"
                      data-dialog-target="title"
                      tabindex="-1"
                      autofocus=""
                    >
                      削除する内容を確認
                    </h2>
                    <span class="close"
                      ><button
                        data-dialog-target="close"
                        data-icon-only="true"
                        aria-label="キャンセル"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
                        data-size="default"
                      >
                        <svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-x"></use>
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <p>
                    「9月のお知らせ」と添付ファイル2件を削除します。この操作は取り消せません。
                  </p>
                  <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
                </div>
                <footer class="actions">
                  <button
                    data-dialog-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    キャンセル</button
                  ><button
                    data-dialog-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="danger"
                    data-size="default"
                  >
                    記事を削除する
                  </button>
                </footer>
              </dialog>
            </div>
          </div>
        </section>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"
          ><span class="title">長い説明・複数の操作・狭い領域</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-split">
          <section class="rx-danger-zone">
            <header class="heading">
              <h2>プロジェクトと関連するすべてのデータを削除する</h2>
              <p>
                このプロジェクトの記事、添付ファイル、コメントを削除します。参加しているメンバー全員が閲覧できなくなり、共有済みのリンクからもアクセスできなくなります。
              </p>
            </header>
            <div class="body">
              <p>
                必要な添付ファイルを保存してから進んでください。削除したデータは復元できません。
              </p>
              <p>
                対象：autumn-editorial-project-2026-abcdefghijklmnopqrstuvwxyz0123456789
              </p>
            </div>
            <div class="actions">
              <a
                href="/apps/files"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >添付ファイルを確認する</a
              >
              <div class="rx-dialog" data-controller="dialog" data-state="closed">
                <button
                  data-dialog-target="trigger"
                  aria-controls="danger-zone-project"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  data-state="closed"
                  class="rx-button"
                  type="button"
                  data-variant="danger"
                  data-size="default"
                >
                  プロジェクトと関連データの削除を確認する
                </button>
                <dialog
                  id="danger-zone-project"
                  class="panel rx-overlay"
                  closedby="any"
                  data-dialog-target="dialog"
                  data-state="closed"
                  data-size="compact"
                  aria-labelledby="danger-zone-project-title"
                >
                  <header class="heading">
                    <div class="heading-row">
                      <h2
                        id="danger-zone-project-title"
                        data-dialog-target="title"
                        tabindex="-1"
                        autofocus=""
                      >
                        プロジェクトを削除しますか？
                      </h2>
                      <span class="close"
                        ><button
                          data-dialog-target="close"
                          data-icon-only="true"
                          aria-label="キャンセル"
                          class="rx-button"
                          type="button"
                          data-variant="primary"
                          data-size="default"
                        >
                          <svg
                            class="rx-icon"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <use href="/assets/rx-icons.svg#rx-x"></use>
                          </svg></button
                      ></span>
                    </div>
                  </header>
                  <div class="body">
                    <p>
                      プロジェクト「秋の特集」の記事12件、添付ファイル8件、コメント32件を削除します。
                    </p>
                    <p>この作例では確認画面を閉じるだけで、データは削除しません。</p>
                  </div>
                  <footer class="actions">
                    <button
                      data-dialog-target="close"
                      class="rx-button"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      キャンセル</button
                    ><button
                      data-dialog-target="close"
                      class="rx-button"
                      type="button"
                      data-variant="danger"
                      data-size="default"
                    >
                      プロジェクトと関連データをすべて削除する
                    </button>
                  </footer>
                </dialog>
              </div>
            </div>
          </section>
          <p>
            この作例では隣に本文を置き、コンポーネントの幅が狭くなった場合の折り返しを確認できます。
          </p>
        </div>
      </div>
    </details>
    <details class="rx-disclosure">
      <summary>
        <span class="marker" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <section lang="ar" dir="rtl" class="rx-danger-zone">
          <header class="heading">
            <h2>حذف المشروع</h2>
            <p>
              سيتم حذف المشروع والملفات المرتبطة به. لا يمكن التراجع عن هذا الإجراء.
            </p>
          </header>
          <div class="body">
            <p id="danger-zone-permission-rtl">يمكن للمسؤول فقط حذف المشروع.</p>
          </div>
          <div class="actions">
            <button
              aria-describedby="danger-zone-permission-rtl"
              class="rx-button"
              type="button"
              data-variant="danger"
              data-size="default"
              disabled=""
            >
              حذف المشروع
            </button>
          </div>
        </section>
      </div>
    </details>
  </div>
</div>
```

</details>
