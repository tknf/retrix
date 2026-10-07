<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# TaskList

タスクの完了チェックと、担当・期日を並べます。

## 使いどころ

- やることを並べ、終えた項目にチェックを付けていく時に使います。担当や期日を行の終わりに添えられます。
- 設定の選択肢を複数選ぶ時は、`Field` と `CheckboxGroup` を使います。
- 状態ごとの列でタスクを移動して管理する時は `Board` を使います。

## 使い方

`items` の各行を標準のcheckboxで描き、`label` を題名、`detail` を題名の下の補足、`end` を行の終わりに置きます。`end` には担当の `Avatar` や期日の `Badge` を置けます。行は枠で囲まず、罫線も引かずに詰めて並べ、四角いチェックボックスの隣に題名を通常の太さで、`detail` を茶色の小さな文字で書きます。押せる行にホバーすると、行を淡い黄色で塗ります。完了した行はチェックボックスを緑で塗り、題名を灰色にして先頭側からペンで引く線で消します。

各行の `name` と `value` は、囲むフォームで送る名前と値になります。完了の保存は、フォームの送信か、`change` を受ける利用側のcontrollerで行います。標準のcheckboxと同じく、チェックの無い行は送られません。

`title` を渡すと、行の一覧の先頭に一覧の名前を見出し（`h3`）で置きます。

`heading` を渡すと、一覧を開閉できる `details`（最初は開いた状態）で包み、見出しに完了した割合だけ緑で塗る小さな円グラフと「完了数/全体」を添えます。`TaskListController` を `task-list` として登録すると、チェックに合わせて数え直し、全て完了すると円グラフを緑で塗りきって白いチェックを表示し、数を緑にします。この時、渡した `data-controller` と `data-action` は `task-list` のものに追加して付けます。

`add` を渡すと、最後の行に項目を追加する入力欄を、追加のアイコンと青緑の文字で置きます。入力している間は、行を淡い青緑の面にし、アイコンを青緑の丸にします。入力欄は `name` で文字を送るだけで、行を増やす処理は利用側のフォームと応答で行います。一覧の外にあるフォームへ送る時は、`form` にそのフォームのidを渡します。

JavaScriptが無い時も、checkboxとフォームの送信は働きます。見出しの数と円グラフは描画時の値のままです。

## アクセシビリティ

- 行の一覧は `label` を読み上げ名にします。各行は `label` 要素で題名と結んだ標準のcheckboxです。
- 見出しの数は「完了 1/3」のように読み、割合の円グラフは読み上げから外します。
- 追加の入力欄は `placeholder` の文を読み上げ名にします。
- `end` に置く `Avatar` や `Badge` は、それぞれの名前と文言で担当や期日を伝えます。

## API

### TaskList

| 名前            | 型                                                                                                                                | 既定値 | 説明                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| `title`         | `string`                                                                                                                          |        | 行の一覧の上に書く、この一覧の名前。                                   |
| `label`（必須） | `string`                                                                                                                          |        | 行の一覧（ul）の読み上げ名。                                           |
| `heading`       | `string`                                                                                                                          |        | 一覧の外側の見出し。開閉でき、終えた数と進み具合を添える。             |
| `add`           | `{ name: string; placeholder: string; form?: string; }`                                                                           |        | 最後の行に置く、項目を追加する欄。送信と追加は利用側のフォームで扱う。 |
| `items`（必須） | `readonly { name: string; label: string; checked?: boolean; disabled?: boolean; detail?: Child; value?: string; end?: Child; }[]` |        | 行の一覧。各行は標準のcheckbox。                                       |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`task-list`（`TaskListController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/list-frame.css`、`components/field.css`、`components/icon.css`、`components/task-list.css`

#### `add`の項目

| 名前                  | 型       | 既定値 | 説明                                                 |
| --------------------- | -------- | ------ | ---------------------------------------------------- |
| `name`（必須）        | `string` |        | 追加した文を送る名前。                               |
| `placeholder`（必須） | `string` |        | 欄のプレースホルダー。欄の読み上げ名にも使う。       |
| `form`                | `string` |        | 一覧の外にあるフォームのid。欄をそのフォームで送る。 |

#### `items`の項目

| 名前            | 型        | 既定値 | 説明                                         |
| --------------- | --------- | ------ | -------------------------------------------- |
| `name`（必須）  | `string`  |        | checkboxをフォームで送る名前。               |
| `label`（必須） | `string`  |        | 項目の題名。checkboxのラベルになる。         |
| `checked`       | `boolean` |        | 終えた項目。チェックを付け、題名に線を引く。 |
| `disabled`      | `boolean` |        | 操作できない項目。                           |
| `detail`        | `Child`   |        | 題名の下に添える補足（担当・期日など）。     |
| `value`         | `string`  |        | checkboxの値。省くと標準どおり`on`を送る。   |
| `end`           | `Child`   |        | 行の末尾に置く要素（AvatarやBadgeなど）。    |

## コード

```tsx
import {
  TaskList,
  Avatar,
  AvatarGroup,
  Badge,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <TaskList
      label="公開前の確認"
      heading="チェックリスト"
      title="公開前の確認"
      add={{ name: "new-task", placeholder: "項目を追加する" }}
      items={[
        { name: "proof", label: "本文を校正する", detail: "田中 · 9月12日" },
        { name: "photo", label: "写真を選ぶ", checked: true, detail: "佐藤 · 完了" },
        { name: "approval", label: "管理者の確認", disabled: true },
      ]}
    />
    <DisclosureGroup label="項目の違い">
      <Disclosure summary="担当と期限：行の末尾にアバターと期限のバッジ" open>
        <TaskList
          label="秋の読書会の準備"
          heading="読書会の準備"
          items={[
            {
              name: "venue",
              label: "会場を予約する",
              checked: true,
              end: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
            },
            {
              name: "flyer",
              label: "案内のチラシを作る",
              detail: "A4・両面",
              end: (
                <>
                  <Avatar name="田中 遥" initials="遥" size="small" />
                  <Badge tone="danger">期限切れ 9月20日</Badge>
                </>
              ),
            },
            {
              name: "books",
              label: "課題の本を人数分そろえる",
              end: (
                <>
                  <AvatarGroup label="担当の2人" size="small">
                    <Avatar name="森 美咲" initials="美" size="small" tone="coral" />
                    <Avatar name="高橋 大輔" initials="大" size="small" tone="amber" />
                  </AvatarGroup>
                  <Badge tone="warning">明日まで</Badge>
                </>
              ),
            },
            {
              name: "snack",
              label: "お茶と菓子を用意する",
              end: <Badge>10月3日</Badge>,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="全部終えた一覧：円が緑に塗られ、チェックが付く">
        <TaskList
          label="引っ越しの手続き"
          heading="引っ越しの手続き"
          items={[
            { name: "address", label: "住所の変更を届ける", checked: true },
            { name: "power", label: "電気とガスの開始を申し込む", checked: true },
            { name: "mail", label: "郵便の転送を申し込む", checked: true },
          ]}
        />
      </Disclosure>
      <Disclosure summary="見出しのない一覧：行だけを並べる">
        <TaskList
          label="今日のやること"
          items={[
            { name: "reply", label: "問い合わせに返信する" },
            { name: "invoice", label: "請求書を送る", checked: true },
            { name: "backup", label: "写真を保存する" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="長い題名と狭い場所：題名は折り返し、末尾のバッジは次の行へ">
        <div style="max-inline-size: 22rem">
          <TaskList
            label="長い題名"
            heading="確認すること"
            items={[
              {
                name: "long",
                label:
                  "初めて利用する方に向けた予約方法と当日の受付の流れを、写真付きで分かりやすく書き直す",
                detail: "田中 · 9月30日",
                end: <Badge tone="info">レビュー中</Badge>,
              },
              {
                name: "long-done",
                label: "キャンセルの条件と返金の時期を、料金表の下にまとめて書き足す",
                checked: true,
                end: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="まだ項目がない一覧：追加する欄だけ">
        <TaskList
          label="来月の準備"
          heading="来月の準備"
          add={{ name: "next-task", placeholder: "最初の項目を書く" }}
          items={[]}
        />
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <details
    class="rx-task-list"
    open=""
    data-controller="task-list"
    data-action="change-&gt;task-list#update"
    style="--rx-task-progress: 0.3333333333333333"
  >
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
      ><span class="name">チェックリスト</span
      ><span class="pie" aria-hidden="true"></span
      ><span class="count"
        ><span class="rx-visually-hidden">完了</span
        ><span data-task-list-target="done">1</span>/3</span
      >
    </summary>
    <ul class="sheet" aria-label="公開前の確認">
      <li class="heading"><h3 class="title">公開前の確認</h3></li>
      <li>
        <label class="rx-choice" data-kind="plain"
          ><input name="proof" type="checkbox" /><span
            ><strong>本文を校正する</strong><small>田中 · 9月12日</small></span
          ></label
        >
      </li>
      <li>
        <label class="rx-choice" data-kind="plain"
          ><input name="photo" checked="" type="checkbox" /><span
            ><strong>写真を選ぶ</strong><small>佐藤 · 完了</small></span
          ></label
        >
      </li>
      <li>
        <label class="rx-choice" data-kind="plain"
          ><input name="approval" disabled="" type="checkbox" /><span
            ><strong>管理者の確認</strong></span
          ></label
        >
      </li>
      <li class="add">
        <span class="plus" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-plus"></use></svg></span
        ><input
          class="entry"
          type="text"
          name="new-task"
          placeholder="項目を追加する"
          aria-label="項目を追加する"
          autocomplete="off"
        />
      </li>
    </ul>
  </details>
  <div class="rx-disclosure-group" role="group" aria-label="項目の違い">
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
          ><span class="title">担当と期限：行の末尾にアバターと期限のバッジ</span></span
        >
      </summary>
      <div class="body">
        <details
          class="rx-task-list"
          open=""
          data-controller="task-list"
          data-action="change-&gt;task-list#update"
          style="--rx-task-progress: 0.25"
        >
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
            ><span class="name">読書会の準備</span
            ><span class="pie" aria-hidden="true"></span
            ><span class="count"
              ><span class="rx-visually-hidden">完了</span
              ><span data-task-list-target="done">1</span>/4</span
            >
          </summary>
          <ul class="sheet" aria-label="秋の読書会の準備">
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="venue" checked="" type="checkbox" /><span
                  ><strong>会場を予約する</strong></span
                ></label
              >
              <div class="end">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="green"
                  role="img"
                  aria-label="佐藤 健"
                  ><span class="initials">健</span></span
                >
              </div>
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="flyer" type="checkbox" /><span
                  ><strong>案内のチラシを作る</strong><small>A4・両面</small></span
                ></label
              >
              <div class="end">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="blue"
                  role="img"
                  aria-label="田中 遥"
                  ><span class="initials">遥</span></span
                ><span class="rx-badge" data-tone="danger">期限切れ 9月20日</span>
              </div>
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="books" type="checkbox" /><span
                  ><strong>課題の本を人数分そろえる</strong></span
                ></label
              >
              <div class="end">
                <span
                  class="rx-avatar-group"
                  data-size="small"
                  role="group"
                  aria-label="担当の2人"
                  ><span
                    class="rx-avatar"
                    data-size="small"
                    data-tone="coral"
                    role="img"
                    aria-label="森 美咲"
                    ><span class="initials">美</span></span
                  ><span
                    class="rx-avatar"
                    data-size="small"
                    data-tone="amber"
                    role="img"
                    aria-label="高橋 大輔"
                    ><span class="initials">大</span></span
                  ></span
                ><span class="rx-badge" data-tone="warning">明日まで</span>
              </div>
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="snack" type="checkbox" /><span
                  ><strong>お茶と菓子を用意する</strong></span
                ></label
              >
              <div class="end">
                <span class="rx-badge" data-tone="neutral">10月3日</span>
              </div>
            </li>
          </ul>
        </details>
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
          ><span class="title"
            >全部終えた一覧：円が緑に塗られ、チェックが付く</span
          ></span
        >
      </summary>
      <div class="body">
        <details
          class="rx-task-list"
          open=""
          data-controller="task-list"
          data-action="change-&gt;task-list#update"
          style="--rx-task-progress: 1"
          data-complete="true"
        >
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
            ><span class="name">引っ越しの手続き</span
            ><span class="pie" aria-hidden="true"></span
            ><span class="count"
              ><span class="rx-visually-hidden">完了</span
              ><span data-task-list-target="done">3</span>/3</span
            >
          </summary>
          <ul class="sheet" aria-label="引っ越しの手続き">
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="address" checked="" type="checkbox" /><span
                  ><strong>住所の変更を届ける</strong></span
                ></label
              >
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="power" checked="" type="checkbox" /><span
                  ><strong>電気とガスの開始を申し込む</strong></span
                ></label
              >
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="mail" checked="" type="checkbox" /><span
                  ><strong>郵便の転送を申し込む</strong></span
                ></label
              >
            </li>
          </ul>
        </details>
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
          ><span class="title">見出しのない一覧：行だけを並べる</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-task-list">
          <ul class="sheet" aria-label="今日のやること">
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="reply" type="checkbox" /><span
                  ><strong>問い合わせに返信する</strong></span
                ></label
              >
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="invoice" checked="" type="checkbox" /><span
                  ><strong>請求書を送る</strong></span
                ></label
              >
            </li>
            <li>
              <label class="rx-choice" data-kind="plain"
                ><input name="backup" type="checkbox" /><span
                  ><strong>写真を保存する</strong></span
                ></label
              >
            </li>
          </ul>
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
        ><span class="label"
          ><span class="title"
            >長い題名と狭い場所：題名は折り返し、末尾のバッジは次の行へ</span
          ></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 22rem">
          <details
            class="rx-task-list"
            open=""
            data-controller="task-list"
            data-action="change-&gt;task-list#update"
            style="--rx-task-progress: 0.5"
          >
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
              ><span class="name">確認すること</span
              ><span class="pie" aria-hidden="true"></span
              ><span class="count"
                ><span class="rx-visually-hidden">完了</span
                ><span data-task-list-target="done">1</span>/2</span
              >
            </summary>
            <ul class="sheet" aria-label="長い題名">
              <li>
                <label class="rx-choice" data-kind="plain"
                  ><input name="long" type="checkbox" /><span
                    ><strong
                      >初めて利用する方に向けた予約方法と当日の受付の流れを、写真付きで分かりやすく書き直す</strong
                    ><small>田中 · 9月30日</small></span
                  ></label
                >
                <div class="end">
                  <span class="rx-badge" data-tone="info">レビュー中</span>
                </div>
              </li>
              <li>
                <label class="rx-choice" data-kind="plain"
                  ><input name="long-done" checked="" type="checkbox" /><span
                    ><strong
                      >キャンセルの条件と返金の時期を、料金表の下にまとめて書き足す</strong
                    ></span
                  ></label
                >
                <div class="end">
                  <span
                    class="rx-avatar"
                    data-size="small"
                    data-tone="green"
                    role="img"
                    aria-label="佐藤 健"
                    ><span class="initials">健</span></span
                  >
                </div>
              </li>
            </ul>
          </details>
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
        ><span class="label"
          ><span class="title">まだ項目がない一覧：追加する欄だけ</span></span
        >
      </summary>
      <div class="body">
        <details
          class="rx-task-list"
          open=""
          data-controller="task-list"
          data-action="change-&gt;task-list#update"
          style="--rx-task-progress: 0"
        >
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
            ><span class="name">来月の準備</span
            ><span class="pie" aria-hidden="true"></span
            ><span class="count"
              ><span class="rx-visually-hidden">完了</span
              ><span data-task-list-target="done">0</span>/0</span
            >
          </summary>
          <ul class="sheet" aria-label="来月の準備">
            <li class="add">
              <span class="plus" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-plus"></use></svg></span
              ><input
                class="entry"
                type="text"
                name="next-task"
                placeholder="最初の項目を書く"
                aria-label="最初の項目を書く"
                autocomplete="off"
              />
            </li>
          </ul>
        </details>
      </div>
    </details>
  </div>
</div>
```

</details>
