<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# SettingList

設定の名前と、行の末尾の操作を罫線で区切って並べた一覧です。

## 使いどころ

- 公開範囲・通知・人の役割のように、名前ごとに一つの操作が付く設定を並べる時に使います。
- 値を読ませるだけの属性は `ValueList`、操作が名前ではなく一件の項目に付く一覧は `DataList` を使います。

## 使い方

`items` に `label` と `control` を渡します。名前（太字）と灰色の小さな `description` を先頭側に、`control` の操作（`Switch`・チェックマーク・`Button` など）を末尾側に置きます。名前と操作の間は空けておき、線は引きません。`leading` にアバターやアイコンを渡すと名前の前に置きます。

行の間には罫線を引いて区切ります。名前と操作が一行に入らない時は、操作を次の行の末尾側へ回します。

SettingListは並べ方だけを持ち、設定の値・送信・保存は `control` に渡したコンポーネントと利用側が持ちます。controllerを持たないので、JavaScriptなしでも渡した操作の振る舞いのまま表示されます。

## アクセシビリティ

- ルートは `label` を名前に持つ `ul` です。名前と操作の間を空ける要素は読み上げから外します。
- `control` の操作には、どの名前の設定か分かる名前を付けてください（例：`Switch` の `label`、アイコンだけの `Button` の `aria-label`）。行の名前は操作に自動では結び付きません。
- チェックマークのように状態を形だけで示す `control` は読み上げでは伝わらないので、必要なら読み上げ用の文を添えてください。

## API

### SettingList

設定の名前と行の末尾の操作を並べ、行の間を罫線で区切る設定の一覧。名前と操作の間は空けておき、線は引かない。

| 名前            | 型                           | 既定値 | 説明                                 |
| --------------- | ---------------------------- | ------ | ------------------------------------ |
| `label`（必須） | `string`                     |        | 一覧の名前。ulのaria-labelに入れる。 |
| `items`（必須） | `readonly SettingListItem[]` |        | 並べる設定の行。                     |

ほかに、`<ul>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/setting-list.css`

#### `SettingListItem`

| 名前              | 型       | 既定値 | 説明                                                                            |
| ----------------- | -------- | ------ | ------------------------------------------------------------------------------- |
| `label`（必須）   | `string` |        | 設定の名前。太字にする。操作の名前（aria-labelなど）は利用側がcontrolに付ける。 |
| `description`     | `Child`  |        | 名前の下に添える淡い補足（メールアドレスなど）。                                |
| `leading`         | `Child`  |        | 名前の前に置くアバターやアイコン。                                              |
| `control`（必須） | `Child`  |        | 行の末尾に置く操作（Switch・チェックマーク・Buttonなど）。                      |

## コード

```tsx
import {
  SettingList,
  Switch,
  Avatar,
  Icon,
  Button,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <SettingList
      label="ボードを見られる人"
      items={[
        {
          label: "全員",
          leading: <Icon name="user" />,
          control: <Switch label="全員に見せる" checked />,
        },
        {
          label: "田中 遥",
          description: "haruka@example.com",
          leading: <Avatar name="田中 遥" initials="遥" size="small" />,
          control: <Icon name="check" />,
        },
        {
          label: "佐藤 健",
          description: "ken@example.com",
          leading: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
          control: <Icon name="check" />,
        },
      ]}
    />
    <DisclosureGroup label="操作の違い">
      <Disclosure summary="操作がボタン：通知の設定・人の役割">
        <SettingList
          label="通知"
          items={[
            {
              label: "秋の読書会",
              control: (
                <Button
                  variant="primary"
                  data-icon-only="true"
                  aria-label="通知を止める"
                >
                  <Icon name="bell" />
                </Button>
              ),
            },
            {
              label: "問い合わせの対応",
              control: (
                <Button data-icon-only="true" aria-label="通知を受け取る">
                  <Icon name="bell" />
                </Button>
              ),
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="長い名前と狭い場所：点線は1.5remだけ残す">
        <div style="max-inline-size: 18rem">
          <SettingList
            label="長い名前"
            items={[
              {
                label: "初めて利用する方に向けた予約方法と当日の受付",
                description: "説明会の案内",
                control: <Switch label="公開する" />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SettingList
            label="الإشعارات"
            items={[{ label: "الجميع", control: <Switch label="مشاركة" checked /> }]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <ul class="rx-setting-list" aria-label="ボードを見られる人">
    <li>
      <span class="leading"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-user"></use></svg></span
      ><span class="text"><span class="name">全員</span></span
      ><span class="leader" aria-hidden="true"></span
      ><span class="control"
        ><label class="rx-switch" for="rx-switch-:r2a:"
          ><input
            checked=""
            id="rx-switch-:r2a:"
            type="checkbox"
            role="switch"
            aria-labelledby="rx-switch-:r2a:-label"
          /><span><span id="rx-switch-:r2a:-label">全員に見せる</span></span></label
        ></span
      >
    </li>
    <li>
      <span class="leading"
        ><span
          class="rx-avatar"
          data-size="small"
          data-tone="blue"
          role="img"
          aria-label="田中 遥"
          ><span class="initials">遥</span></span
        ></span
      ><span class="text"
        ><span class="name">田中 遥</span
        ><small class="description">haruka@example.com</small></span
      ><span class="leader" aria-hidden="true"></span
      ><span class="control"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-check"></use></svg
      ></span>
    </li>
    <li>
      <span class="leading"
        ><span
          class="rx-avatar"
          data-size="small"
          data-tone="green"
          role="img"
          aria-label="佐藤 健"
          ><span class="initials">健</span></span
        ></span
      ><span class="text"
        ><span class="name">佐藤 健</span
        ><small class="description">ken@example.com</small></span
      ><span class="leader" aria-hidden="true"></span
      ><span class="control"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-check"></use></svg
      ></span>
    </li>
  </ul>
  <div class="rx-disclosure-group" role="group" aria-label="操作の違い">
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
          ><span class="title">操作がボタン：通知の設定・人の役割</span></span
        >
      </summary>
      <div class="body">
        <ul class="rx-setting-list" aria-label="通知">
          <li>
            <span class="text"><span class="name">秋の読書会</span></span
            ><span class="leader" aria-hidden="true"></span
            ><span class="control"
              ><button
                data-icon-only="true"
                aria-label="通知を止める"
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
                  <use href="/assets/rx-icons.svg#rx-bell"></use>
                </svg></button
            ></span>
          </li>
          <li>
            <span class="text"><span class="name">問い合わせの対応</span></span
            ><span class="leader" aria-hidden="true"></span
            ><span class="control"
              ><button
                data-icon-only="true"
                aria-label="通知を受け取る"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-bell"></use>
                </svg></button
            ></span>
          </li>
        </ul>
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
          ><span class="title">長い名前と狭い場所：点線は1.5remだけ残す</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 18rem">
          <ul class="rx-setting-list" aria-label="長い名前">
            <li>
              <span class="text"
                ><span class="name">初めて利用する方に向けた予約方法と当日の受付</span
                ><small class="description">説明会の案内</small></span
              ><span class="leader" aria-hidden="true"></span
              ><span class="control"
                ><label class="rx-switch" for="rx-switch-:r2b:"
                  ><input
                    id="rx-switch-:r2b:"
                    type="checkbox"
                    role="switch"
                    aria-labelledby="rx-switch-:r2b:-label"
                  /><span><span id="rx-switch-:r2b:-label">公開する</span></span></label
                ></span
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <ul class="rx-setting-list" aria-label="الإشعارات">
            <li>
              <span class="text"><span class="name">الجميع</span></span
              ><span class="leader" aria-hidden="true"></span
              ><span class="control"
                ><label class="rx-switch" for="rx-switch-:r2c:"
                  ><input
                    checked=""
                    id="rx-switch-:r2c:"
                    type="checkbox"
                    role="switch"
                    aria-labelledby="rx-switch-:r2c:-label"
                  /><span><span id="rx-switch-:r2c:-label">مشاركة</span></span></label
                ></span
              >
            </li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
