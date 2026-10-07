<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ProfileHeader

人物の大きなアバターと名前に、その人に関する設定を並べます。

## 使いどころ

- 人やグループの画面の上部で、名前と、この人に対する設定（通知・振り分け・メモなど）をまとめる時に使います。
- 人以外の画面の見出しは`PageHeader`を使います。

## 使い方

`avatar`に`Avatar`の`size="large"`、`name`に名前を渡します。大きなアバター・太字の大きな名前・淡い`detail`を中央に積みます。

`badge`（所属などの小さなバッジ）は先頭側の上の角、`actions`（編集など）は末尾側の上の角に置きます。

`preferences`には、この人への設定の`DropdownMenu`や`Button`を渡します。名前の下の灰色のバーに、面を持たない形で並べ、狭い場所では折り返します。設定の保存は利用側が担います。

名前の見出しのレベルは`headingLevel`で決めます。画面の見出しなら`1`、画面の中の一部として置くなら前後の見出しに合わせて`2`・`3`にします。

## API

### ProfileHeader

大きなアバターと名前を中央に据え、その下に、この人への設定を灰色の領域にまとめて並べる。

| 名前             | 型            | 既定値 | 説明                                                                                 |
| ---------------- | ------------- | ------ | ------------------------------------------------------------------------------------ |
| `name`（必須）   | `string`      |        | 人やグループの名前。headingLevelの見出しで出す。                                     |
| `avatar`（必須） | `Child`       |        | 大きなアバター（Avatarのlarge）。                                                    |
| `detail`         | `Child`       |        | 名前の下の淡い補足（メールアドレスなど）。                                           |
| `badge`          | `Child`       |        | 先頭側の上の角に置く小さなバッジ（所属など）。                                       |
| `actions`        | `Child`       |        | 末尾側の上の角に置く操作（編集など）。                                               |
| `preferences`    | `Child`       |        | 名前の下に並べる、この人への設定（通知・振り分けなど）。DropdownMenuやButtonを渡す。 |
| `headingLevel`   | `1 \| 2 \| 3` | `1`    | 名前の見出しの段（既定はh1）。                                                       |

ほかに、`<header>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/profile-header.css`

## コード

```tsx
import {
  ProfileHeader,
  Avatar,
  Tag,
  ActionLink,
  DropdownMenu,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <ProfileHeader
      headingLevel={3}
      name="田中 遥"
      avatar={<Avatar name="田中 遥" initials="遥" size="large" />}
      detail="haruka@example.com"
      badge={<Tag label="@example.com" />}
      actions={<ActionLink href="/">編集</ActionLink>}
      preferences={
        <>
          <DropdownMenu
            id="profile-notify"
            label="通知しない"
            icon="bell"
            items={[
              {
                kind: "radio",
                name: "notify",
                value: "off",
                label: "通知しない",
                checked: true,
              },
              { kind: "radio", name: "notify", value: "on", label: "通知する" },
            ]}
          />
          <DropdownMenu
            id="profile-deliver"
            label="受信トレイに届ける"
            icon="mail"
            items={[
              {
                kind: "radio",
                name: "deliver",
                value: "inbox",
                label: "受信トレイ",
                checked: true,
              },
              { kind: "radio", name: "deliver", value: "feed", label: "お知らせ" },
            ]}
          />
          <DropdownMenu
            id="profile-note"
            label="メモを書く"
            icon="pencil"
            items={[{ value: "note", label: "メモを書く" }]}
          />
        </>
      }
    />
    <DisclosureGroup label="内容の違い">
      <Disclosure summary="名前だけ">
        <ProfileHeader
          headingLevel={3}
          name="佐藤 健"
          avatar={<Avatar name="佐藤 健" initials="健" size="large" tone="green" />}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：長い名前と設定のバーを折り返す">
        <div style="max-inline-size: 18rem">
          <ProfileHeader
            headingLevel={3}
            name="秋の読書会の実行委員会"
            avatar={
              <Avatar name="秋の読書会" initials="秋" size="large" tone="amber" />
            }
            detail="reading-club-committee@example.com"
            preferences={
              <>
                <DropdownMenu
                  id="narrow-notify"
                  label="通知しない"
                  icon="bell"
                  items={[{ value: "on", label: "通知する" }]}
                />
                <DropdownMenu
                  id="narrow-deliver"
                  label="受信トレイに届ける"
                  icon="mail"
                  items={[{ value: "feed", label: "お知らせ" }]}
                />
              </>
            }
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ProfileHeader
            headingLevel={3}
            name="هارو تاناكا"
            avatar={<Avatar name="هارو" initials="ه" size="large" />}
            detail="haruka@example.com"
            actions={<ActionLink href="/">تعديل</ActionLink>}
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
  <header class="rx-profile-header">
    <span class="badge"><span class="rx-tag">@example.com</span></span
    ><span class="actions"
      ><a href="/" class="rx-button" data-variant="secondary" data-size="default"
        >編集</a
      ></span
    ><span class="avatar"
      ><span
        class="rx-avatar"
        data-size="large"
        data-tone="blue"
        role="img"
        aria-label="田中 遥"
        ><span class="initials">遥</span></span
      ></span
    >
    <h3 class="name">田中 遥</h3>
    <p class="detail">haruka@example.com</p>
    <div class="preferences">
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="profile-notify-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="profile-notify"
          aria-haspopup="menu"
          aria-expanded="false"
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
            <use href="/assets/rx-icons.svg#rx-bell"></use></svg
          >通知しない<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use>
          </svg>
        </button>
        <div
          class="shield"
          data-dropdown-menu-target="shield"
          popover="manual"
          tabindex="-1"
          hidden=""
        ></div>
        <menu
          id="profile-notify"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="profile-notify-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="profile-notify-0-item"
              role="menuitemradio"
              aria-label="通知しない"
              data-menu-kind="radio"
              data-menu-label="通知しない"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="off"
              data-menu-group="notify"
              aria-checked="true"
              data-checked="true"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content" data-leading="true"
                ><span class="heading"
                  ><span class="mark" aria-hidden="true"><span class="dot"></span></span
                  ><span class="text"><span>通知しない</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="profile-notify-1-item"
              role="menuitemradio"
              aria-label="通知する"
              data-menu-kind="radio"
              data-menu-label="通知する"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="on"
              data-menu-group="notify"
              aria-checked="false"
              data-checked="false"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content" data-leading="true"
                ><span class="heading"
                  ><span class="mark" aria-hidden="true"><span class="dot"></span></span
                  ><span class="text"><span>通知する</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="profile-deliver-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="profile-deliver"
          aria-haspopup="menu"
          aria-expanded="false"
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
            <use href="/assets/rx-icons.svg#rx-mail"></use></svg
          >受信トレイに届ける<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use>
          </svg>
        </button>
        <div
          class="shield"
          data-dropdown-menu-target="shield"
          popover="manual"
          tabindex="-1"
          hidden=""
        ></div>
        <menu
          id="profile-deliver"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="profile-deliver-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="profile-deliver-0-item"
              role="menuitemradio"
              aria-label="受信トレイ"
              data-menu-kind="radio"
              data-menu-label="受信トレイ"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="inbox"
              data-menu-group="deliver"
              aria-checked="true"
              data-checked="true"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content" data-leading="true"
                ><span class="heading"
                  ><span class="mark" aria-hidden="true"><span class="dot"></span></span
                  ><span class="text"><span>受信トレイ</span></span></span
                ></span
              >
            </button>
          </li>
          <li role="none">
            <button
              id="profile-deliver-1-item"
              role="menuitemradio"
              aria-label="お知らせ"
              data-menu-kind="radio"
              data-menu-label="お知らせ"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="feed"
              data-menu-group="deliver"
              aria-checked="false"
              data-checked="false"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content" data-leading="true"
                ><span class="heading"
                  ><span class="mark" aria-hidden="true"><span class="dot"></span></span
                  ><span class="text"><span>お知らせ</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
      <div
        class="rx-dropdown-menu"
        data-controller="dropdown-menu"
        data-state="closed"
        data-align="start"
      >
        <button
          id="profile-note-trigger"
          data-dropdown-menu-target="trigger"
          aria-controls="profile-note"
          aria-haspopup="menu"
          aria-expanded="false"
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
            <use href="/assets/rx-icons.svg#rx-pencil"></use></svg
          >メモを書く<svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-caret"></use>
          </svg>
        </button>
        <div
          class="shield"
          data-dropdown-menu-target="shield"
          popover="manual"
          tabindex="-1"
          hidden=""
        ></div>
        <menu
          id="profile-note"
          class="rx-menu"
          data-dropdown-menu-target="menu"
          data-menu-panel="root"
          role="menu"
          popover="manual"
          aria-labelledby="profile-note-trigger"
          tabindex="-1"
          hidden=""
        >
          <li role="none">
            <button
              id="profile-note-0-item"
              role="menuitem"
              aria-label="メモを書く"
              data-menu-kind="action"
              data-menu-label="メモを書く"
              tabindex="-1"
              data-dropdown-menu-target="item"
              data-dropdown-menu-value="note"
              class="rx-button item"
              type="button"
              data-variant="secondary"
              data-size="default"
            >
              <span class="content"
                ><span class="heading"
                  ><span class="text"><span>メモを書く</span></span></span
                ></span
              >
            </button>
          </li>
        </menu>
      </div>
    </div>
  </header>
  <div class="rx-disclosure-group" role="group" aria-label="内容の違い">
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
        ><span class="label"><span class="title">名前だけ</span></span>
      </summary>
      <div class="body">
        <header class="rx-profile-header">
          <span class="avatar"
            ><span
              class="rx-avatar"
              data-size="large"
              data-tone="green"
              role="img"
              aria-label="佐藤 健"
              ><span class="initials">健</span></span
            ></span
          >
          <h3 class="name">佐藤 健</h3>
        </header>
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
          ><span class="title">狭い場所：長い名前と設定のバーを折り返す</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 18rem">
          <header class="rx-profile-header">
            <span class="avatar"
              ><span
                class="rx-avatar"
                data-size="large"
                data-tone="amber"
                role="img"
                aria-label="秋の読書会"
                ><span class="initials">秋</span></span
              ></span
            >
            <h3 class="name">秋の読書会の実行委員会</h3>
            <p class="detail">reading-club-committee@example.com</p>
            <div class="preferences">
              <div
                class="rx-dropdown-menu"
                data-controller="dropdown-menu"
                data-state="closed"
                data-align="start"
              >
                <button
                  id="narrow-notify-trigger"
                  data-dropdown-menu-target="trigger"
                  aria-controls="narrow-notify"
                  aria-haspopup="menu"
                  aria-expanded="false"
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
                    <use href="/assets/rx-icons.svg#rx-bell"></use></svg
                  >通知しない<svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-caret"></use>
                  </svg>
                </button>
                <div
                  class="shield"
                  data-dropdown-menu-target="shield"
                  popover="manual"
                  tabindex="-1"
                  hidden=""
                ></div>
                <menu
                  id="narrow-notify"
                  class="rx-menu"
                  data-dropdown-menu-target="menu"
                  data-menu-panel="root"
                  role="menu"
                  popover="manual"
                  aria-labelledby="narrow-notify-trigger"
                  tabindex="-1"
                  hidden=""
                >
                  <li role="none">
                    <button
                      id="narrow-notify-0-item"
                      role="menuitem"
                      aria-label="通知する"
                      data-menu-kind="action"
                      data-menu-label="通知する"
                      tabindex="-1"
                      data-dropdown-menu-target="item"
                      data-dropdown-menu-value="on"
                      class="rx-button item"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      <span class="content"
                        ><span class="heading"
                          ><span class="text"><span>通知する</span></span></span
                        ></span
                      >
                    </button>
                  </li>
                </menu>
              </div>
              <div
                class="rx-dropdown-menu"
                data-controller="dropdown-menu"
                data-state="closed"
                data-align="start"
              >
                <button
                  id="narrow-deliver-trigger"
                  data-dropdown-menu-target="trigger"
                  aria-controls="narrow-deliver"
                  aria-haspopup="menu"
                  aria-expanded="false"
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
                    <use href="/assets/rx-icons.svg#rx-mail"></use></svg
                  >受信トレイに届ける<svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-caret"></use>
                  </svg>
                </button>
                <div
                  class="shield"
                  data-dropdown-menu-target="shield"
                  popover="manual"
                  tabindex="-1"
                  hidden=""
                ></div>
                <menu
                  id="narrow-deliver"
                  class="rx-menu"
                  data-dropdown-menu-target="menu"
                  data-menu-panel="root"
                  role="menu"
                  popover="manual"
                  aria-labelledby="narrow-deliver-trigger"
                  tabindex="-1"
                  hidden=""
                >
                  <li role="none">
                    <button
                      id="narrow-deliver-0-item"
                      role="menuitem"
                      aria-label="お知らせ"
                      data-menu-kind="action"
                      data-menu-label="お知らせ"
                      tabindex="-1"
                      data-dropdown-menu-target="item"
                      data-dropdown-menu-value="feed"
                      class="rx-button item"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      <span class="content"
                        ><span class="heading"
                          ><span class="text"><span>お知らせ</span></span></span
                        ></span
                      >
                    </button>
                  </li>
                </menu>
              </div>
            </div>
          </header>
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
          <header class="rx-profile-header">
            <span class="actions"
              ><a
                href="/"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >تعديل</a
              ></span
            ><span class="avatar"
              ><span
                class="rx-avatar"
                data-size="large"
                data-tone="blue"
                role="img"
                aria-label="هارو"
                ><span class="initials">ه</span></span
              ></span
            >
            <h3 class="name">هارو تاناكا</h3>
            <p class="detail">haruka@example.com</p>
          </header>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
