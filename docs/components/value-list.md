<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ValueList

項目の現在の値を、項目名より目立たせて表示します。

## 使いどころ

- 予約の内容や記事の公開状態のように、一つの対象の属性を「項目名と値」の組で見せる時に使います。
- 複数の項目を同じ列で見比べる時は `Table`、値をその場で書き換えさせる時は `EditableProperty` を使います。
- 名前ごとに一つの操作が付く設定は `SettingList` を使います。

## 使い方

`items` に `label` と `value` を渡します。Highriseの右の列の「Additional info」に合わせ、項目名は灰色の小さな（11px）通常の太さの文字、値は本文と同じ13pxの黒い文字にし、項目の間は罫線を引かずに12px空けます。狭い時は項目名の下に値を置き、幅が22rem以上では項目名と値を横に並べて、値の一行目のベースラインにそろえます。

`value` が `null`・`undefined` の時は淡い「未登録」を出し、`0` や空文字はそのまま出して、値の0と未登録を区別します。数値・日時の書式は利用側で決め、日時は `time` 要素で渡せます。`value` には段落やリンクなどの要素も渡せ、`description` は値の下に淡く添えます。

`icon` にアイコン（塗りつぶしの `Icon` など）を渡すと、項目名の前に面を付けずに小さく添えます。アイコンの色は `accent` で選び、`green` は緑、`amber` は黄土色、`coral` は赤茶で、`blue` と省略した時は項目名と同じ灰色です。

controllerを持たないので、JavaScriptなしでも同じように表示されます。

## アクセシビリティ

- ルートは `dl` で、項目名は `dt`、値は `dd` として読み上げます。
- `icon` のアイコンは読み上げから外します。アイコンに項目名以外の意味を持たせないでください。

## API

### ValueList

| 名前            | 型                     | 既定値 | 説明                                         |
| --------------- | ---------------------- | ------ | -------------------------------------------- |
| `items`（必須） | `readonly ValueItem[]` |        | 並べる項目。一項目を項目名と値の一行にする。 |

ほかに、`<dl>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/value-list.css`

#### `ValueItem`

| 名前            | 型       | 既定値 | 説明                                                                                                                      |
| --------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 項目名。dtに入れる。                                                                                                      |
| `value`（必須） | `Child`  |        | 現在の値。ddに入れる。nullかundefinedの時は淡い「未登録」を出し、0や空文字はそのまま出す。書式は利用側で決める。          |
| `description`   | `string` |        | 値の下に添える淡い補足。                                                                                                  |
| `icon`          | `Child`  |        | 項目名の前に置くアイコン。面を付けずに小さく添える。                                                                      |
| `accent`        | `Accent` |        | アイコンの色。iconを渡した時だけ効く。greenは緑、amberは黄土色、coralは赤茶で、blueと省略した時は項目名と同じ灰色にする。 |

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

## コード

```tsx
import {
  ValueList,
  Badge,
  ActionLink,
  Icon,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <ValueList
      items={[
        {
          label: "公開状態",
          value: <Badge tone="success">公開中</Badge>,
          icon: <Icon name="eye" fill />,
          accent: "green",
        },
        {
          label: "公開日時",
          value: <time datetime="2026-09-15T10:00:00+09:00">2026年9月15日 10:00</time>,
          icon: <Icon name="calendar" fill />,
        },
        {
          label: "予約件数",
          value: 0,
          description: "今月の受付分です。",
          icon: <Icon name="chart" fill />,
          accent: "amber",
        },
        {
          label: "担当者",
          value: null,
          icon: <Icon name="info" fill />,
          accent: "coral",
        },
        {
          label: "利用規約とキャンセル条件",
          value: (
            <>
              <p>前日までのキャンセルは無料です。当日の変更は受付にご相談ください。</p>
              <ActionLink href="/apps/schedule">予約内容を確認する</ActionLink>
            </>
          ),
          icon: <Icon name="file" fill />,
        },
        {
          label: "管理番号",
          value: "workspace-autumn-2026-abcdefghijklmnopqrstuvwxyz0123456789",
          icon: <Icon name="grid" fill />,
        },
      ]}
    />
    <DisclosureGroup label="アイコンの有無と置き場所の違い">
      <Disclosure summary="アイコンなし">
        <ValueList
          items={[
            { label: "部屋", value: "中会議室" },
            { label: "人数", value: "8名" },
            { label: "担当者", value: null },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ValueList
            items={[
              {
                label: "共有リンク",
                value: "https://example.com/articles/autumn-reading-club-2026",
                icon: <Icon name="mail" fill />,
              },
              {
                label: "人数",
                value: "8名",
                icon: <Icon name="chat" fill />,
                accent: "green",
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ValueList
            items={[
              {
                label: "الغرفة",
                value: "قاعة الاجتماعات",
                icon: <Icon name="grid" fill />,
              },
              {
                label: "التاريخ",
                value: "١٥ سبتمبر",
                icon: <Icon name="calendar" fill />,
                accent: "amber",
              },
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
  <dl class="rx-value-list">
    <div data-accent="green">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-eye-fill"></use></svg></span
        >公開状態
      </dt>
      <dd><span class="rx-badge" data-tone="success">公開中</span></dd>
    </div>
    <div data-accent="blue">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
        >公開日時
      </dt>
      <dd><time datetime="2026-09-15T10:00:00+09:00">2026年9月15日 10:00</time></dd>
    </div>
    <div data-accent="amber">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-chart-fill"></use></svg></span
        >予約件数
      </dt>
      <dd>
        0
        <p class="description">今月の受付分です。</p>
      </dd>
    </div>
    <div data-accent="coral">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg></span
        >担当者
      </dt>
      <dd data-empty="true">未登録</dd>
    </div>
    <div data-accent="blue">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-file-fill"></use></svg></span
        >利用規約とキャンセル条件
      </dt>
      <dd>
        <p>前日までのキャンセルは無料です。当日の変更は受付にご相談ください。</p>
        <a
          href="/apps/schedule"
          class="rx-button"
          data-variant="secondary"
          data-size="default"
          >予約内容を確認する</a
        >
      </dd>
    </div>
    <div data-accent="blue">
      <dt>
        <span class="icon" aria-hidden="true"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-grid-fill"></use></svg></span
        >管理番号
      </dt>
      <dd>workspace-autumn-2026-abcdefghijklmnopqrstuvwxyz0123456789</dd>
    </div>
  </dl>
  <div
    class="rx-disclosure-group"
    role="group"
    aria-label="アイコンの有無と置き場所の違い"
  >
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
        ><span class="label"><span class="title">アイコンなし</span></span>
      </summary>
      <div class="body">
        <dl class="rx-value-list">
          <div>
            <dt>部屋</dt>
            <dd>中会議室</dd>
          </div>
          <div>
            <dt>人数</dt>
            <dd>8名</dd>
          </div>
          <div>
            <dt>担当者</dt>
            <dd data-empty="true">未登録</dd>
          </div>
        </dl>
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 16rem">
          <dl class="rx-value-list">
            <div data-accent="blue">
              <dt>
                <span class="icon" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg></span
                >共有リンク
              </dt>
              <dd>https://example.com/articles/autumn-reading-club-2026</dd>
            </div>
            <div data-accent="green">
              <dt>
                <span class="icon" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-chat-fill"></use></svg></span
                >人数
              </dt>
              <dd>8名</dd>
            </div>
          </dl>
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
          <dl class="rx-value-list">
            <div data-accent="blue">
              <dt>
                <span class="icon" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grid-fill"></use></svg></span
                >الغرفة
              </dt>
              <dd>قاعة الاجتماعات</dd>
            </div>
            <div data-accent="amber">
              <dt>
                <span class="icon" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
                >التاريخ
              </dt>
              <dd>١٥ سبتمبر</dd>
            </div>
          </dl>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
