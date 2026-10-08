<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Tabs

同じ場所で、関連するパネルを切り替えます。

## 使いどころ

- 同じ対象についての関連するパネル（内容・設定・履歴など）を、同じ場所で切り替える時に使います。
- 別のページへ移る切り替えは`Navigation`、一覧の絞り込みの切り替えは`FilterBar`、長い資料の節への移動は`TableOfContents`を使います。
- JavaScriptがないと選んだパネルしか見えないので、利用者が必ず見る情報をタブの中だけに置きません。

## 使い方

`id`・`label`・`items`を渡し、`TabsController`を`tabs`として登録します。`id`と各`value`は一意にします。

Highriseのタブと同じく、タブの並びの下に1pxの淡い灰色の罫線を一本引き、その上に白いタブ（1pxの淡い灰色の枠、上の角だけ角丸3px、高さ21px、12pxの文字）を3pxずつ空けて並べます。選んだタブは文字の太さと色を変えず、下の枠を白にして罫線を切り、下のパネルとつなげます。選んでいないタブはホバーすると名前に下線を引きます。`icon`は名前の前、`count`はHighriseの「3 People」と同じく、名前と同じ色と太さの数字を名前の後ろに出します（ピルにはしません）。無効なタブは形をそのままにし、文字だけを灰色にします。

初めは`selected`のタブを選びます。省略した時や、見つからない・無効なタブの時は、最初の選べるタブを選びます。選べるタブが一つもない時は、タブを出さず「利用可能な項目はありません。」を出します。

タブを押すか矢印キーで移ると、すぐにそのパネルへ切り替えます。無効なタブは表示しますが、選べず、矢印キーでも飛ばします。

切り替えると`tabs:beforechange`・`tabs:change`を発火します。選んだタブをURLなどに残す時は、利用側で行います。

JavaScriptなしでは選んだタブのパネルだけを表示し、タブを押しても切り替わりません。

## キーボード

| キー       | 動作                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| ← / →      | 前・次の選べるタブへ移り、そのパネルを表示します。端では反対の端へ回ります。右から左へ書く言語では向きが逆になります。 |
| Home / End | 最初・最後の選べるタブへ移り、そのパネルを表示します。                                                                 |
| Tab        | 選んでいるタブから、表示中のパネルへ移ります。                                                                         |

## アクセシビリティ

- タブの並びは`label`を読み上げ名に持つ`role="tablist"`、各タブは`role="tab"`のボタン、パネルは`role="tabpanel"`です。タブとパネルを`aria-controls`・`aria-labelledby`で結びます。
- 選んだタブは`aria-selected="true"`で、Tabで入るのは選んだタブだけです。パネルは`tabindex="0"`でフォーカスできます。

## イベント

| イベント            | 内容                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabs:beforechange` | 利用者がタブを切り替える直前に発火します。`detail`は`value`・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと切り替えません。 |
| `tabs:change`       | 切り替えた後に発火します。`detail`は`tabs:beforechange`と同じです。                                                                                 |

## API

### Tabs

| 名前            | 型                   | 既定値 | 説明                                                                                                |
| --------------- | -------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `id`（必須）    | `string`             |        | タブとパネルのidの元。ページ内で一意にする。                                                        |
| `label`（必須） | `string`             |        | tablistの読み上げ名。                                                                               |
| `items`（必須） | `readonly TabItem[]` |        | 並べるタブとパネル。選べるタブが一つもない時は「利用可能な項目はありません。」を出す。              |
| `selected`      | `string`             |        | 最初に選んでおくタブのvalue。省略した時、見つからない時、無効なタブの時は、最初の選べるタブにする。 |

登録するcontroller：`tabs`（`TabsController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/tabs.css`

#### `TabItem`

| 名前              | 型        | 既定値 | 説明                                                                                |
| ----------------- | --------- | ------ | ----------------------------------------------------------------------------------- |
| `value`（必須）   | `string`  |        | タブを識別する値。Tabsの中で一意にする。selectedとtabs:changeのdetail.valueに使う。 |
| `label`（必須）   | `string`  |        | タブの名前。パネルの読み上げ名にもなる。                                            |
| `content`（必須） | `Child`   |        | タブを選んだ時に出すパネルの中身。                                                  |
| `disabled`        | `boolean` |        | 選べないタブ。表示はするが押せず、矢印キーの移動でも飛ばす。                        |
| `icon`            | `Child`   |        | 名前の前のアイコン（Iconなど）。                                                    |
| `count`           | `number`  |        | 名前の後に出す件数。0も表示し、省略すると出さない。                                 |

## コード

```tsx
import { Disclosure, DisclosureGroup, Icon, Tabs } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Tabs
      id="hono-tabs"
      label="項目の補足"
      selected="unavailable"
      items={[
        {
          value: "content",
          label: "内容",
          content: <p>最初の有効なパネルを表示します。</p>,
        },
        {
          value: "unavailable",
          label: "受付停止中",
          disabled: true,
          content: <p>選択できません。</p>,
        },
        { value: "settings", label: "設定", content: <p>設定のパネルです。</p> },
      ]}
    />
    <Tabs id="hono-tabs-empty" label="項目がないタブ" items={[]} />
    <Tabs
      id="hono-tabs-unavailable"
      label="利用できないタブ"
      items={[
        {
          value: "locked",
          label: "利用不可",
          content: <p>利用不可</p>,
          disabled: true,
        },
      ]}
    />
    <DisclosureGroup label="中身と置き場所の違い">
      <Disclosure summary="アイコンと件数" open>
        <Tabs
          id="hono-tabs-count"
          label="連絡の分類"
          selected="unread"
          items={[
            {
              value: "all",
              label: "すべて",
              icon: <Icon name="mail" />,
              count: 128,
              content: <p>すべての連絡です。</p>,
            },
            {
              value: "unread",
              label: "未読",
              icon: <Icon name="mail" />,
              count: 3,
              content: <p>まだ読んでいない連絡です。</p>,
            },
            {
              value: "files",
              label: "添付",
              icon: <Icon name="file" />,
              count: 0,
              content: <p>添付ファイルのある連絡です。</p>,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所と長い名前で折り返す">
        <div style="max-inline-size: 20rem">
          <Tabs
            id="hono-tabs-narrow"
            label="資料の分類"
            items={[
              { value: "summary", label: "概要", content: <p>概要のパネルです。</p> },
              {
                value: "long",
                label: "秋の読書会の資料と参加者名簿",
                content: <p>長い名前のパネルです。</p>,
              },
              { value: "history", label: "履歴", content: <p>履歴のパネルです。</p> },
              { value: "settings", label: "設定", content: <p>設定のパネルです。</p> },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Tabs
            id="hono-tabs-rtl"
            label="الأقسام"
            items={[
              { value: "content", label: "المحتوى", count: 4, content: <p>المحتوى</p> },
              { value: "settings", label: "الإعدادات", content: <p>الإعدادات</p> },
            ]}
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
  <div class="rx-tabs" data-controller="tabs" data-tabs-value-value="content">
    <div class="list" role="tablist" aria-label="項目の補足" data-tabs-target="tablist">
      <button
        id="hono-tabs-tab-0"
        type="button"
        role="tab"
        data-tabs-target="tab"
        data-tabs-value="content"
        data-state="active"
        aria-selected="true"
        aria-controls="hono-tabs-panel-0"
        tabindex="0"
      >
        内容</button
      ><button
        id="hono-tabs-tab-1"
        type="button"
        role="tab"
        data-tabs-target="tab"
        data-tabs-value="unavailable"
        data-state="inactive"
        aria-selected="false"
        aria-controls="hono-tabs-panel-1"
        disabled=""
        tabindex="-1"
      >
        受付停止中</button
      ><button
        id="hono-tabs-tab-2"
        type="button"
        role="tab"
        data-tabs-target="tab"
        data-tabs-value="settings"
        data-state="inactive"
        aria-selected="false"
        aria-controls="hono-tabs-panel-2"
        tabindex="-1"
      >
        設定
      </button>
    </div>
    <section
      id="hono-tabs-panel-0"
      class="panel"
      role="tabpanel"
      data-tabs-target="tabpanel"
      data-tabs-value="content"
      data-state="active"
      aria-labelledby="hono-tabs-tab-0"
      tabindex="0"
    >
      <p>最初の有効なパネルを表示します。</p>
    </section>
    <section
      id="hono-tabs-panel-1"
      class="panel"
      role="tabpanel"
      data-tabs-target="tabpanel"
      data-tabs-value="unavailable"
      data-state="inactive"
      aria-labelledby="hono-tabs-tab-1"
      hidden=""
      tabindex="0"
    >
      <p>選択できません。</p>
    </section>
    <section
      id="hono-tabs-panel-2"
      class="panel"
      role="tabpanel"
      data-tabs-target="tabpanel"
      data-tabs-value="settings"
      data-state="inactive"
      aria-labelledby="hono-tabs-tab-2"
      hidden=""
      tabindex="0"
    >
      <p>設定のパネルです。</p>
    </section>
  </div>
  <div class="rx-tabs"><p>利用可能な項目はありません。</p></div>
  <div class="rx-tabs"><p>利用可能な項目はありません。</p></div>
  <div class="rx-disclosure-group" role="group" aria-label="中身と置き場所の違い">
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
        ><span class="label"><span class="title">アイコンと件数</span></span>
      </summary>
      <div class="body">
        <div class="rx-tabs" data-controller="tabs" data-tabs-value-value="unread">
          <div
            class="list"
            role="tablist"
            aria-label="連絡の分類"
            data-tabs-target="tablist"
          >
            <button
              id="hono-tabs-count-tab-0"
              type="button"
              role="tab"
              data-tabs-target="tab"
              data-tabs-value="all"
              data-state="inactive"
              aria-selected="false"
              aria-controls="hono-tabs-count-panel-0"
              tabindex="-1"
            >
              <span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
              >すべて<span class="count">128</span></button
            ><button
              id="hono-tabs-count-tab-1"
              type="button"
              role="tab"
              data-tabs-target="tab"
              data-tabs-value="unread"
              data-state="active"
              aria-selected="true"
              aria-controls="hono-tabs-count-panel-1"
              tabindex="0"
            >
              <span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
              >未読<span class="count">3</span></button
            ><button
              id="hono-tabs-count-tab-2"
              type="button"
              role="tab"
              data-tabs-target="tab"
              data-tabs-value="files"
              data-state="inactive"
              aria-selected="false"
              aria-controls="hono-tabs-count-panel-2"
              tabindex="-1"
            >
              <span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-file"></use></svg></span
              >添付<span class="count">0</span>
            </button>
          </div>
          <section
            id="hono-tabs-count-panel-0"
            class="panel"
            role="tabpanel"
            data-tabs-target="tabpanel"
            data-tabs-value="all"
            data-state="inactive"
            aria-labelledby="hono-tabs-count-tab-0"
            hidden=""
            tabindex="0"
          >
            <p>すべての連絡です。</p>
          </section>
          <section
            id="hono-tabs-count-panel-1"
            class="panel"
            role="tabpanel"
            data-tabs-target="tabpanel"
            data-tabs-value="unread"
            data-state="active"
            aria-labelledby="hono-tabs-count-tab-1"
            tabindex="0"
          >
            <p>まだ読んでいない連絡です。</p>
          </section>
          <section
            id="hono-tabs-count-panel-2"
            class="panel"
            role="tabpanel"
            data-tabs-target="tabpanel"
            data-tabs-value="files"
            data-state="inactive"
            aria-labelledby="hono-tabs-count-tab-2"
            hidden=""
            tabindex="0"
          >
            <p>添付ファイルのある連絡です。</p>
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
        ><span class="label"
          ><span class="title">狭い場所と長い名前で折り返す</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 20rem">
          <div class="rx-tabs" data-controller="tabs" data-tabs-value-value="summary">
            <div
              class="list"
              role="tablist"
              aria-label="資料の分類"
              data-tabs-target="tablist"
            >
              <button
                id="hono-tabs-narrow-tab-0"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="summary"
                data-state="active"
                aria-selected="true"
                aria-controls="hono-tabs-narrow-panel-0"
                tabindex="0"
              >
                概要</button
              ><button
                id="hono-tabs-narrow-tab-1"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="long"
                data-state="inactive"
                aria-selected="false"
                aria-controls="hono-tabs-narrow-panel-1"
                tabindex="-1"
              >
                秋の読書会の資料と参加者名簿</button
              ><button
                id="hono-tabs-narrow-tab-2"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="history"
                data-state="inactive"
                aria-selected="false"
                aria-controls="hono-tabs-narrow-panel-2"
                tabindex="-1"
              >
                履歴</button
              ><button
                id="hono-tabs-narrow-tab-3"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="settings"
                data-state="inactive"
                aria-selected="false"
                aria-controls="hono-tabs-narrow-panel-3"
                tabindex="-1"
              >
                設定
              </button>
            </div>
            <section
              id="hono-tabs-narrow-panel-0"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="summary"
              data-state="active"
              aria-labelledby="hono-tabs-narrow-tab-0"
              tabindex="0"
            >
              <p>概要のパネルです。</p>
            </section>
            <section
              id="hono-tabs-narrow-panel-1"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="long"
              data-state="inactive"
              aria-labelledby="hono-tabs-narrow-tab-1"
              hidden=""
              tabindex="0"
            >
              <p>長い名前のパネルです。</p>
            </section>
            <section
              id="hono-tabs-narrow-panel-2"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="history"
              data-state="inactive"
              aria-labelledby="hono-tabs-narrow-tab-2"
              hidden=""
              tabindex="0"
            >
              <p>履歴のパネルです。</p>
            </section>
            <section
              id="hono-tabs-narrow-panel-3"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="settings"
              data-state="inactive"
              aria-labelledby="hono-tabs-narrow-tab-3"
              hidden=""
              tabindex="0"
            >
              <p>設定のパネルです。</p>
            </section>
          </div>
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
          <div class="rx-tabs" data-controller="tabs" data-tabs-value-value="content">
            <div
              class="list"
              role="tablist"
              aria-label="الأقسام"
              data-tabs-target="tablist"
            >
              <button
                id="hono-tabs-rtl-tab-0"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="content"
                data-state="active"
                aria-selected="true"
                aria-controls="hono-tabs-rtl-panel-0"
                tabindex="0"
              >
                المحتوى<span class="count">4</span></button
              ><button
                id="hono-tabs-rtl-tab-1"
                type="button"
                role="tab"
                data-tabs-target="tab"
                data-tabs-value="settings"
                data-state="inactive"
                aria-selected="false"
                aria-controls="hono-tabs-rtl-panel-1"
                tabindex="-1"
              >
                الإعدادات
              </button>
            </div>
            <section
              id="hono-tabs-rtl-panel-0"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="content"
              data-state="active"
              aria-labelledby="hono-tabs-rtl-tab-0"
              tabindex="0"
            >
              <p>المحتوى</p>
            </section>
            <section
              id="hono-tabs-rtl-panel-1"
              class="panel"
              role="tabpanel"
              data-tabs-target="tabpanel"
              data-tabs-value="settings"
              data-state="inactive"
              aria-labelledby="hono-tabs-rtl-tab-1"
              hidden=""
              tabindex="0"
            >
              <p>الإعدادات</p>
            </section>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
