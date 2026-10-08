<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Wing

中央の作業面の左右に、開閉できる補助パネルを置きます。

## 使いどころ

- はじめの操作や最近の動きなど、中央の作業面に付属する補助の内容を、作業面の左右に開閉できる形で添える時に使います。
- 画面の端に固定する常設のナビゲーションではありません。アプリ全体の移動は`AppShell`のヘッダーの`navigation`、分類ごとの移動先は`AppShell`の`aside`の列、名前で探す移動は`CommandMenu`を使います。
- 作業面の中で一覧と本文を並べる時は`SplitView`を使います。
- `AppShell`の作業面に付ける時は、`Wing`で包まず`AppShell`の`wings`に同じ`start`・`end`を渡します。

## 使い方

`children`に作業面を、`start`・`end`に左右のパネルを渡します。作業面には`Surface`など背景を持つ面を置きます。各パネルは`label`・`content`と、任意の`icon`・`open`を受け取ります。`open`の既定は展開です。

開閉は`details`/`summary`で動くので、controllerを登録しなくても開閉できます。

パネルは作業面の後ろに重ねる物なので、`AppShell`の`trail`の背後のシートと同じく、淡い灰色（`#f9f9f9`）の面に1px `#e5e5e5` の枠を引いた、影の無い角丸3pxのパネルです。見出しは13pxの黒い太字です。ハンドルはアイコンだけのButtonと同じ形で、閉じている間は控えめな白いボタン、開いている間はチェックボックスの選んだ状態と同じ淡い青の縦の塗りに紺の縁と紺のアイコンにします。アイコンを渡さない時は開閉の向きを示す矢印を出します。

`Wing`の幅が56rem以上では、14remのパネルを作業面の後ろへ差し込みます。閉じると作業面の縁からパネルを少しだけのぞかせ、ハンドルをパネルの外側の縁にまたがせて置きます。名前はハンドルにホバーした時のツールチップで示します。開くとパネルが外側へ出て、上端にハンドルと名前の見出しが並びます。見出しの行は帯の塗りを持たず、下にパネルの枠と同じ1pxの罫線を引きます。開閉はその場で切り替え、動きは付けません。左右の列は開閉に関わらず幅を確保するので、作業面は動きません。パネルは作業面より上下24pxずつ短く、中身はパネルの中でスクロールします。

56rem未満では、パネルを作業面の下へ`start`、`end`の順に積み、見出しの行で開閉します。右から左へ書く言語では、左右の配置と開閉のアイコンの向きを反転します。

`storageKey`を指定し、`WingController`を`wing`として登録すると、左右の開閉状態をcookieへ保存します。cookieの名前は`wingCookieName(storageKey)`、有効期間は1年です。サーバーでこのcookieを読んで`savedState`へ渡すと、保存した状態のまま描画するので、読み込み時にちらつきません。`savedState`を渡さない場合も、接続時にcookieから復元します。`storageKey`はサイト内で一意にします。

## アクセシビリティ

- ハンドルは`summary`で、読み上げ名はパネルの`label`です。ハンドルのボタンの見た目とツールチップは読み上げません。
- DOMの読み順は作業面、`start`、`end`です。補助のパネルは作業面の後に読まれます。

## API

### Wing

中央の作業面の後ろへ、左右から開閉できる補助パネルを差し込む。開閉はdetails/summaryだけで動く。 Wingは補足なので、DOMの読み順と狭い配置の表示順は作業面・start・endとする。

| 名前         | 型          | 既定値 | 説明                                                                             |
| ------------ | ----------- | ------ | -------------------------------------------------------------------------------- |
| `start`      | `WingPanel` |        | 作業面の先頭側（左から右へ書く言語では左）のパネル。省略するとその側を出さない。 |
| `end`        | `WingPanel` |        | 作業面の末尾側（左から右へ書く言語では右）のパネル。省略するとその側を出さない。 |
| `storageKey` | `string`    |        | 指定するとWingControllerが開閉状態をcookieへ保存する。サイト内で一意にする。     |
| `savedState` | `string`    |        | wingCookieName(storageKey)のcookieの値。渡すと保存した開閉状態でSSRする。        |
| `children`   | `Child`     |        | 中央の作業面。背景を持つ`Surface`などを渡します。                                |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`wing`（`WingController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/wing.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`

#### `WingPanel`

| 名前              | 型         | 既定値 | 説明                                                                                                                                       |
| ----------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`（必須）   | `string`   |        | パネルの名前。ハンドルの読み上げ名になり、開くと上端の見出しに出す。広い配置で閉じている間は、ハンドルにホバーした時のツールチップで示す。 |
| `content`（必須） | `Child`    |        | パネルの中身。パネルの中でスクロールする。                                                                                                 |
| `icon`            | `IconName` |        | ハンドルのアイコン。省略すると開閉の向きを示すアイコンを出す。                                                                             |
| `open`            | `boolean`  |        | 初期状態。既定は展開。savedStateやcookieに保存した状態があれば、そちらを優先する。                                                         |

#### `IconName`

値：docs/icons.mdの「使えるアイコン」の名前

## コード

```tsx
import {
  Wing,
  wingCookieName,
  ActionLink,
  Card,
  Surface,
  Timeline,
} from "@tknf/retrix/hono";

const actions = (
  <>
    <ActionLink href="/apps/project">新しいプロジェクト</ActionLink>
    <ActionLink href="/apps/people">メンバーを招待</ActionLink>
    <ActionLink href="/apps/settings" variant="link">
      アカウントの管理
    </ActionLink>
  </>
);

const activity = (
  <Timeline
    label="最近の動き"
    variant="compact"
    items={[
      {
        datetime: "2026-09-25T10:00:00+09:00",
        time: "9月25日 10:00",
        title: "田中さんが資料を移動",
      },
      {
        datetime: "2026-09-24T15:30:00+09:00",
        time: "9月24日 15:30",
        title: "佐藤さんが予定を追加",
      },
    ]}
  />
);

const sheet = (
  <Surface>
    <div class="rx-stack">
      <Card
        title="秋の読書会"
        href="/apps/schedule"
        footer={<span>3人 · 9月25日更新</span>}
      >
        <p>最近読んだ本を持ち寄る会の準備です。</p>
      </Card>
      <Card
        title="仕事場の案内"
        href="/apps/docs"
        footer={<span>2人 · 9月24日更新</span>}
      >
        <p>利用時間とキャンセル条件を見直します。</p>
      </Card>
    </div>
  </Surface>
);

/** cookiesはサーバーが受け取ったcookie。HonoではgetCookie(c)を渡す。 */
export default ({ cookies }: { cookies: Record<string, string> }) => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>開閉を保存する</h3>
      <Wing
        storageKey="catalog-wing"
        savedState={cookies[wingCookieName("catalog-wing")]}
        start={{ label: "はじめる", icon: "pencil", content: actions }}
        end={{ label: "最近の動き", icon: "layers", content: activity, open: false }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small" lang="en">
      <h3>英語の見出し</h3>
      <Wing
        start={{
          label: "Get started",
          icon: "pencil",
          content: <p>Create a project.</p>,
        }}
        end={{
          label: "Recent activity",
          icon: "layers",
          content: <p>Nothing new today.</p>,
          open: false,
        }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>長い見出しとアイコンなし</h3>
      <Wing
        start={{ label: "プロジェクトとメンバーの管理", content: actions, open: false }}
        end={{
          label: "Notifications and recent activity",
          content: activity,
          open: false,
        }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>片側だけ</h3>
      <Wing end={{ label: "最近の動き", icon: "layers", content: activity }}>
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small" dir="rtl" lang="ar">
      <h3>右から左へ書く言語</h3>
      <Wing
        start={{ label: "ابدأ", icon: "pencil", content: <p>أنشئ مشروعًا.</p> }}
        end={{ label: "النشاط الأخير", icon: "layers", content: <p>لا جديد اليوم.</p> }}
      >
        {sheet}
      </Wing>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>狭い幅</h3>
      <div style="max-inline-size: 24rem">
        <Wing
          start={{ label: "はじめる", icon: "pencil", content: actions }}
          end={{ label: "最近の動き", icon: "layers", content: activity, open: false }}
        >
          {sheet}
        </Wing>
      </div>
    </section>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section class="rx-stack" data-space="small">
    <h3>開閉を保存する</h3>
    <div
      class="rx-wing"
      data-controller="wing"
      data-wing-storage-key-value="catalog-wing"
    >
      <div class="layout">
        <div class="main">
          <div class="rx-surface" data-layout="standard">
            <div class="body">
              <div class="rx-stack">
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                  <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                  <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                </article>
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                  <div class="body"><p>利用時間とキャンセル条件を見直します。</p></div>
                  <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                </article>
              </div>
            </div>
          </div>
        </div>
        <details class="start" open="" data-wing-target="panel">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil"></use></svg></span
            ><span class="label">はじめる</span
            ><span class="tip rx-overlay" aria-hidden="true">はじめる</span>
          </summary>
          <div class="body">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >新しいプロジェクト</a
            ><a
              href="/apps/people"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >メンバーを招待</a
            ><a
              href="/apps/settings"
              class="rx-button"
              data-variant="link"
              data-size="default"
              >アカウントの管理</a
            >
          </div>
        </details>
        <details class="end" data-wing-target="panel">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg></span
            ><span class="label">最近の動き</span
            ><span class="tip rx-overlay" aria-hidden="true">最近の動き</span>
          </summary>
          <div class="body">
            <ol class="rx-timeline" aria-label="最近の動き" data-variant="compact">
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-25T10:00:00+09:00">9月25日 10:00</time>
                <div class="body"><p class="title">田中さんが資料を移動</p></div>
              </li>
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-24T15:30:00+09:00">9月24日 15:30</time>
                <div class="body"><p class="title">佐藤さんが予定を追加</p></div>
              </li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small" lang="en">
    <h3>英語の見出し</h3>
    <div class="rx-wing">
      <div class="layout">
        <div class="main">
          <div class="rx-surface" data-layout="standard">
            <div class="body">
              <div class="rx-stack">
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                  <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                  <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                </article>
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                  <div class="body"><p>利用時間とキャンセル条件を見直します。</p></div>
                  <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                </article>
              </div>
            </div>
          </div>
        </div>
        <details class="start" open="">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil"></use></svg></span
            ><span class="label">Get started</span
            ><span class="tip rx-overlay" aria-hidden="true">Get started</span>
          </summary>
          <div class="body"><p>Create a project.</p></div>
        </details>
        <details class="end">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg></span
            ><span class="label">Recent activity</span
            ><span class="tip rx-overlay" aria-hidden="true">Recent activity</span>
          </summary>
          <div class="body"><p>Nothing new today.</p></div>
        </details>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>長い見出しとアイコンなし</h3>
    <div class="rx-wing">
      <div class="layout">
        <div class="main">
          <div class="rx-surface" data-layout="standard">
            <div class="body">
              <div class="rx-stack">
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                  <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                  <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                </article>
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                  <div class="body"><p>利用時間とキャンセル条件を見直します。</p></div>
                  <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                </article>
              </div>
            </div>
          </div>
        </div>
        <details class="start">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              data-fallback="caret"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
            ><span class="label">プロジェクトとメンバーの管理</span
            ><span class="tip rx-overlay" aria-hidden="true"
              >プロジェクトとメンバーの管理</span
            >
          </summary>
          <div class="body">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >新しいプロジェクト</a
            ><a
              href="/apps/people"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >メンバーを招待</a
            ><a
              href="/apps/settings"
              class="rx-button"
              data-variant="link"
              data-size="default"
              >アカウントの管理</a
            >
          </div>
        </details>
        <details class="end">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              data-fallback="caret"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
            ><span class="label">Notifications and recent activity</span
            ><span class="tip rx-overlay" aria-hidden="true"
              >Notifications and recent activity</span
            >
          </summary>
          <div class="body">
            <ol class="rx-timeline" aria-label="最近の動き" data-variant="compact">
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-25T10:00:00+09:00">9月25日 10:00</time>
                <div class="body"><p class="title">田中さんが資料を移動</p></div>
              </li>
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-24T15:30:00+09:00">9月24日 15:30</time>
                <div class="body"><p class="title">佐藤さんが予定を追加</p></div>
              </li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>片側だけ</h3>
    <div class="rx-wing">
      <div class="layout">
        <div class="main">
          <div class="rx-surface" data-layout="standard">
            <div class="body">
              <div class="rx-stack">
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                  <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                  <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                </article>
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                  <div class="body"><p>利用時間とキャンセル条件を見直します。</p></div>
                  <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                </article>
              </div>
            </div>
          </div>
        </div>
        <details class="end" open="">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg></span
            ><span class="label">最近の動き</span
            ><span class="tip rx-overlay" aria-hidden="true">最近の動き</span>
          </summary>
          <div class="body">
            <ol class="rx-timeline" aria-label="最近の動き" data-variant="compact">
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-25T10:00:00+09:00">9月25日 10:00</time>
                <div class="body"><p class="title">田中さんが資料を移動</p></div>
              </li>
              <li>
                <span class="marker" aria-hidden="true"></span
                ><time datetime="2026-09-24T15:30:00+09:00">9月24日 15:30</time>
                <div class="body"><p class="title">佐藤さんが予定を追加</p></div>
              </li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small" dir="rtl" lang="ar">
    <h3>右から左へ書く言語</h3>
    <div class="rx-wing">
      <div class="layout">
        <div class="main">
          <div class="rx-surface" data-layout="standard">
            <div class="body">
              <div class="rx-stack">
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                  <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                  <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                </article>
                <article class="rx-card">
                  <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                  <div class="body"><p>利用時間とキャンセル条件を見直します。</p></div>
                  <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                </article>
              </div>
            </div>
          </div>
        </div>
        <details class="start" open="">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-pencil"></use></svg></span
            ><span class="label">ابدأ</span
            ><span class="tip rx-overlay" aria-hidden="true">ابدأ</span>
          </summary>
          <div class="body"><p>أنشئ مشروعًا.</p></div>
        </details>
        <details class="end" open="">
          <summary>
            <span
              class="handle rx-button"
              data-variant="primary"
              data-icon-only="true"
              aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg></span
            ><span class="label">النشاط الأخير</span
            ><span class="tip rx-overlay" aria-hidden="true">النشاط الأخير</span>
          </summary>
          <div class="body"><p>لا جديد اليوم.</p></div>
        </details>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>狭い幅</h3>
    <div style="max-inline-size: 24rem">
      <div class="rx-wing">
        <div class="layout">
          <div class="main">
            <div class="rx-surface" data-layout="standard">
              <div class="body">
                <div class="rx-stack">
                  <article class="rx-card">
                    <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
                    <div class="body"><p>最近読んだ本を持ち寄る会の準備です。</p></div>
                    <footer class="meta"><span>3人 · 9月25日更新</span></footer>
                  </article>
                  <article class="rx-card">
                    <h3 class="title"><a href="/apps/docs">仕事場の案内</a></h3>
                    <div class="body">
                      <p>利用時間とキャンセル条件を見直します。</p>
                    </div>
                    <footer class="meta"><span>2人 · 9月24日更新</span></footer>
                  </article>
                </div>
              </div>
            </div>
          </div>
          <details class="start" open="">
            <summary>
              <span
                class="handle rx-button"
                data-variant="primary"
                data-icon-only="true"
                aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil"></use></svg></span
              ><span class="label">はじめる</span
              ><span class="tip rx-overlay" aria-hidden="true">はじめる</span>
            </summary>
            <div class="body">
              <a
                href="/apps/project"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >新しいプロジェクト</a
              ><a
                href="/apps/people"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >メンバーを招待</a
              ><a
                href="/apps/settings"
                class="rx-button"
                data-variant="link"
                data-size="default"
                >アカウントの管理</a
              >
            </div>
          </details>
          <details class="end">
            <summary>
              <span
                class="handle rx-button"
                data-variant="primary"
                data-icon-only="true"
                aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-layers"></use></svg></span
              ><span class="label">最近の動き</span
              ><span class="tip rx-overlay" aria-hidden="true">最近の動き</span>
            </summary>
            <div class="body">
              <ol class="rx-timeline" aria-label="最近の動き" data-variant="compact">
                <li>
                  <span class="marker" aria-hidden="true"></span
                  ><time datetime="2026-09-25T10:00:00+09:00">9月25日 10:00</time>
                  <div class="body"><p class="title">田中さんが資料を移動</p></div>
                </li>
                <li>
                  <span class="marker" aria-hidden="true"></span
                  ><time datetime="2026-09-24T15:30:00+09:00">9月24日 15:30</time>
                  <div class="body"><p class="title">佐藤さんが予定を追加</p></div>
                </li>
              </ol>
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</div>
```

</details>
