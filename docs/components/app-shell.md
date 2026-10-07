<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# AppShell

机の上に白いシートを置く、アプリの基本の画面構成です。ヘッダーと作業面を画面の中央に揃えます。

## 使いどころ

- アプリの各画面に共通する画面構成として、ヘッダー（アプリの名前・主な移動先・検索）と中央のシート（作業面）を置く時に使います。
- 画面の幅いっぱいには広げず、ヘッダー・先頭側の列・作業面を同じ幅の中に収めて中央に揃えます。画面の端に固定するサイドバーは持ちません。
- 上の階層は`trail`の背後に重ねたシートで、分類ごとの移動先や最近見た項目は`aside`の列で示します。作業面に付属する開閉式の補助パネルは`wings`（`Wing`）で扱います。
- `AppShell`を使わない画面で作業面だけを置く時は`Surface`を使います。

## 使い方

`home`にアプリの名前やロゴのリンク、`navigation`に主な移動先、`commands`に検索や`CommandMenu`を渡します。ヘッダーは背景を持たず、机の地の上にそのまま並びます。`navigation`の今いる項目は`current`にすると、黒い太字で示し、`aria-current="page"`を付けます。

`account`はヘッダーの上の行の末尾側に、小さな文字で置きます。利用者の名前・アカウントの設定・ログアウトへのリンクなどを並べます。

`children`は中央のシートに置きます。シートの幅の上限は`size`で選びます。`default`は`--rx-page`（61.25rem）、`compact`は本文の行の長さ（`--rx-measure`）に左右の余白を足した46rem、`wide`は90remです。ほかの幅が必要な時は、ルートの`style`で`--rx-page`を上書きします。`Board`・`Table`・`Grid`・`Calendar`は、シートの左右の余白の分だけ外側に広がり、シートの端までスクロールします。

`trail`に上の階層を上から順に渡すと、シートの背後に淡い灰色のシートを重ね、その見出しを上の階層へのリンクにします。奥のシートほど幅を狭くし、今のページのシートを一番手前に置きます。

`aside`を渡すと、シートの先頭側に13remの列を置きます。列はシートの外の机の上に置き、列とシートを合わせて中央に揃えます。幅が52rem未満ではシートの上へ移ります。

`footer`はシートの下に、小さな灰色の文字で置きます。

`AppShell`の幅が45rem未満では、ヘッダーを「名前と検索」「主な移動先」の二段にし、シートの外側と内側の余白を詰めます。

`wings`に`start`・`end`を渡すと、シートを`Wing`で包み、左右に開閉できる補助パネルを付けます。開閉の状態を保存する時は`storageKey`・`savedState`も渡し、`WingController`を`wing`として登録します（詳しくは`Wing`のページ）。

`AppShell`自身はcontrollerを使わず、JavaScriptなしでも同じ配置で表示します。

## アクセシビリティ

- ヘッダーは`header`で、`navigation`は`aria-label`を付けた`nav`に置きます。読み上げ名は`navigationLabel`で変えられ、省略すると「アプリの移動」です。
- `trail`は`aria-label="上の階層"`の`nav`の中の`ol`です。
- シートは`div`で、`main`を持ちません。画面の本文は`children`の中で利用側が`main`で包みます。
- `home`・`account`・`commands`に文字のないリンクや操作を置く時は、読み上げ名を利用側で付けます。

## API

### AppShell

机の上に白いシートを置く画面構成。ヘッダーにアプリの名前・主な移動先・検索を並べ、その下の中央に作業面を置く。 trailは上の階層を作業面の背後に重ねたシートで示し、asideは作業面の先頭側に移動先の列を置く。

| 名前              | 型                                                                  | 既定値           | 説明                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`            | `Child`                                                             |                  | ヘッダーの先頭側に置く、アプリの名前やロゴとホームへのリンク。省略すると枠ごと出さない。                                                                                                                                |
| `navigation`      | `readonly NavigationItem[]`                                         |                  | ヘッダーで`home`の後に並べる、アプリの主な移動先。今いる項目は`current`にする。                                                                                                                                         |
| `navigationLabel` | `string`                                                            | `"アプリの移動"` | `navigation`のnavの読み上げ名。省略すると「アプリの移動」。                                                                                                                                                             |
| `commands`        | `Child`                                                             |                  | ヘッダーの末尾側に置く、検索やCommandMenu。省略すると枠ごと出さない。                                                                                                                                                   |
| `account`         | `Child`                                                             |                  | ヘッダーの上の行の末尾側に小さく置く、アカウントやログアウトへのリンク。省略すると行ごと出さない。                                                                                                                      |
| `aside`           | `Child`                                                             |                  | 作業面の先頭側に置く列。Highriseのように、分類ごとの移動先や最近見た項目を置く。作業面の外に置き、列と作業面を合わせて画面の中央に揃える。狭い画面では作業面の上へ移る。                                                |
| `trail`           | `readonly AppShellTrailItem[]`                                      |                  | 作業面の背後に重ねるシート。上の階層から順に並べる。各シートの見出しは上の階層へのリンクになり、今のページの作業面はその手前に置く。                                                                                    |
| `footer`          | `Child`                                                             |                  | 作業面の下に置く、小さな補足のリンクなど。省略すると出さない。                                                                                                                                                          |
| `wings`           | `Pick<WingProps, "start" \| "end" \| "storageKey" \| "savedState">` |                  | 作業面の左右に付ける補助パネル。Wingのstart・end・storageKey・savedStateと同じ値を渡す。省略するとWingを使わず、作業面だけを置く。                                                                                      |
| `size`            | `"compact" \| "default" \| "wide"`                                  | `"default"`      | 作業面の幅の上限。compactは46rem（本文の行の長さ--rx-measureに左右の余白を足した幅）、defaultは61.25rem（--rx-page）、wideは90rem。設定画面など入力が中心の画面はcompact、Boardや年の予定など横に広い画面はwideにする。 |
| `children`        | `Child`                                                             |                  | 中央のシートに置く、画面の中身。                                                                                                                                                                                        |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`wing`（`WingController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/app-shell.css`、`components/wing.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`

#### `NavigationItem`

| 名前            | 型        | 既定値 | 説明                                                                |
| --------------- | --------- | ------ | ------------------------------------------------------------------- |
| `label`（必須） | `string`  |        | 項目の名前。                                                        |
| `href`（必須）  | `string`  |        | 移動先のURL。現在地の項目もリンクのまま出す。                       |
| `current`       | `boolean` |        | 今いる項目。aria-current="page"を付け、見た目でも現在地として示す。 |
| `count`         | `number`  |        | 名前の後に出す件数。0も表示し、省略すると出さない。                 |
| `icon`          | `Child`   |        | 名前の前のアイコン（Iconなど）。                                    |

#### `AppShellTrailItem`

作業面の背後に重ねる、上の階層のページ。

| 名前            | 型       | 既定値 | 説明                                                     |
| --------------- | -------- | ------ | -------------------------------------------------------- |
| `label`（必須） | `string` |        | 上の階層のページの名前。背後のシートの見出しとして出す。 |
| `href`（必須）  | `string` |        | 上の階層のページのURL。                                  |

#### `WingProps`

[Wing](wing.md)のpropsと同じです。

## コード

```tsx
import {
  AppShell,
  Avatar,
  Board,
  Button,
  CommandMenu,
  Field,
  Icon,
  Input,
  Navigation,
  PageHeader,
  Section,
  Switch,
  Table,
} from "@tknf/retrix/hono";

/** 見本ごとにidを変えるため、検索のCommandMenuは関数で作る。 */
const commands = (id: string) => (
  <CommandMenu
    id={id}
    label="取引先・案件・担当者を探す"
    icon="search"
    shortcuts={[
      { label: "取引先", href: "/apps/people", icon: "user", accent: "green" },
      { label: "案件", href: "/apps/sales", icon: "chart", accent: "coral" },
    ]}
    groups={[
      {
        label: "移動",
        items: [
          { label: "取引先", href: "/apps/people", icon: "user" },
          { label: "案件", href: "/apps/sales", icon: "chart" },
        ],
      },
    ]}
  />
);

const home = <a href="/apps/project">つむぐ商会</a>;

const navigation = [
  { label: "ホーム", href: "/apps/project" },
  { label: "取引先", href: "/apps/people", current: true },
  { label: "案件", href: "/apps/sales" },
  { label: "予定", href: "/apps/schedule" },
  { label: "設定", href: "/apps/settings" },
];

const account = (
  <>
    <Avatar name="田中 遥" initials="遥" size="small" tone="coral" />
    <a href="/apps/settings">田中 遥</a>
    <a href="/">ログアウト</a>
  </>
);

const customers = [
  {
    code: "C-0012",
    name: "株式会社みなと製作所",
    owner: "田中 遥",
    deals: 3,
    updated: "9月25日",
  },
  {
    code: "C-0031",
    name: "ひかり書房",
    owner: "佐藤 健",
    deals: 1,
    updated: "9月24日",
  },
  {
    code: "C-0047",
    name: "合同会社あおば農園",
    owner: "森 美咲",
    deals: 0,
    updated: "9月22日",
  },
];

const CustomerTable = () => (
  <Table caption="取引先の一覧">
    <thead>
      <tr>
        <th scope="col">コード</th>
        <th scope="col">取引先</th>
        <th scope="col">担当</th>
        <th scope="col" data-cell="numeric">
          進行中の案件
        </th>
        <th scope="col">更新日</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((customer) => (
        <tr>
          <td data-cell="short">{customer.code}</td>
          <th scope="row" data-cell="text">
            <a href="/apps/people">{customer.name}</a>
          </th>
          <td data-cell="short">{customer.owner}</td>
          <td data-cell="numeric">{customer.deals}</td>
          <td data-cell="short">{customer.updated}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const job = (id: string, code: string, title: string) => ({
  id,
  code,
  label: title,
  content: <h4>{title}</h4>,
});

/* 見本のAppShellは高さを決めた枠の中でスクロールさせる。 */
const frame = "block-size: 34rem; overflow: auto; isolation: isolate";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>既定の幅（default）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          navigation={navigation}
          commands={commands("shell-default")}
          account={account}
          footer={<span>つむぐ商会 · 顧客管理</span>}
        >
          <PageHeader
            title="取引先"
            description="取引のある会社と、担当者・進行中の案件を管理します。"
            actions={<Button variant="primary">取引先を追加</Button>}
          />
          <CustomerTable />
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>上の階層を背後に重ねる（trail）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          navigation={navigation}
          commands={commands("shell-trail")}
          account={account}
          trail={[{ label: "株式会社みなと製作所", href: "/apps/people" }]}
        >
          <PageHeader
            title="展示会の什器の見積もり"
            description="案件 · 担当 田中 遥 · 9月30日まで"
            actions={<Button>編集</Button>}
          />
          <Section
            title="やること"
            count={2}
            actions={<Button size="compact">追加</Button>}
          >
            <p>見積書の数量を確かめ、来週の打ち合わせまでに送ります。</p>
          </Section>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>先頭側の列を置く（aside）</h3>
      <div style={frame}>
        <AppShell
          home={home}
          commands={commands("shell-aside")}
          account={account}
          aside={
            <Navigation
              label="取引先の分類"
              items={[
                {
                  label: "すべての取引先",
                  href: "/apps/people",
                  current: true,
                  count: 128,
                },
                { label: "見込み", href: "/apps/people", count: 24 },
                { label: "取引中", href: "/apps/people", count: 87 },
                { label: "休眠", href: "/apps/people", count: 17 },
              ]}
            />
          }
        >
          <PageHeader title="すべての取引先" description="128件の取引先" />
          <CustomerTable />
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>入力が中心の画面（compact）</h3>
      <div style={frame}>
        <AppShell size="compact" home={home} navigation={navigation} account={account}>
          <PageHeader title="設定" description="会社の名前と通知を変えます。" />
          <form class="rx-stack" aria-label="会社の設定">
            <Field id="shell-workspace-name" label="会社の名前">
              {(attributes) => <Input {...attributes} name="name" value="つむぐ商会" />}
            </Field>
            <Switch
              id="shell-digest"
              label="週次のまとめを受け取る"
              name="digest"
              value="weekly"
              checked
            />
            <div>
              <Button type="submit" variant="primary">
                保存
              </Button>
            </div>
          </form>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>横に広い画面（wide）</h3>
      <div style={frame}>
        <AppShell size="wide" home={home} navigation={navigation} account={account}>
          <PageHeader title="案件の進み具合" icon={<Icon name="grid" />} />
          <Board
            label="案件"
            columns={[
              {
                id: "lead",
                title: "見込み",
                items: [job("fair", "No. 21", "展示会の什器の見積もり")],
              },
              {
                id: "proposal",
                title: "提案中",
                tone: "info",
                items: [job("catalog", "No. 18", "秋のカタログの印刷")],
              },
              {
                id: "won",
                title: "受注",
                tone: "success",
                collapsible: true,
                items: [job("sign", "No. 11", "店舗の看板の交換")],
              },
            ]}
          />
        </AppShell>
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
    <h3>既定の幅（default）</h3>
    <div style="block-size: 34rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="default">
        <header class="bar">
          <div class="account">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            ><a href="/apps/settings">田中 遥</a><a href="/">ログアウト</a>
          </div>
          <div class="start"><a href="/apps/project">つむぐ商会</a></div>
          <nav class="navigation" aria-label="アプリの移動">
            <a href="/apps/project"><span>ホーム</span></a
            ><a href="/apps/people" aria-current="page" data-current="true"
              ><span>取引先</span></a
            ><a href="/apps/sales"><span>案件</span></a
            ><a href="/apps/schedule"><span>予定</span></a
            ><a href="/apps/settings"><span>設定</span></a>
          </nav>
          <div class="commands">
            <div class="rx-command-menu" data-controller="command-menu">
              <button
                popovertarget="shell-default"
                data-command-menu-target="trigger"
                aria-haspopup="dialog"
                aria-controls="shell-default"
                aria-expanded="false"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="large"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-search-fill"></use></svg
                >取引先・案件・担当者を探す<svg
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
                class="panel"
                popover="auto"
                role="dialog"
                id="shell-default"
                aria-label="取引先・案件・担当者を探すのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">取引先・案件・担当者を探す</span
                  ><button
                    aria-label="コマンドを閉じる"
                    popovertarget="shell-default"
                    popovertargetaction="hide"
                    data-command-menu-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="compact"
                  >
                    閉じる
                  </button>
                </header>
                <nav class="shortcuts" aria-label="よく使う場所" data-columns="4">
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="green"
                      href="/apps/people"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-user-fill"
                          ></use></svg></span
                      ><span class="name">取引先</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="coral"
                      href="/apps/sales"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-chart-fill"
                          ></use></svg></span
                      ><span class="name">案件</span></a
                    >
                  </div>
                </nav>
                <div class="search">
                  <div class="rx-input-group">
                    <div class="control" data-size="large">
                      <span class="affix" id="shell-default-search-prefix"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
                      ><input
                        type="search"
                        role="combobox"
                        aria-label="仕事・人・ページを探す"
                        aria-haspopup="tree"
                        aria-autocomplete="list"
                        aria-controls="shell-default-results"
                        aria-expanded="false"
                        autocomplete="off"
                        autofocus=""
                        placeholder="仕事・人・ページを探す…"
                        data-command-menu-target="search"
                        id="shell-default-search"
                        data-size="large"
                        aria-describedby="shell-default-search-prefix"
                        class="rx-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="results"
                  id="shell-default-results"
                  role="tree"
                  aria-label="移動先・操作"
                >
                  <section
                    class="group"
                    role="group"
                    aria-labelledby="shell-default-group-0"
                    data-command-menu-target="group"
                  >
                    <h2 id="shell-default-group-0">移動</h2>
                    <ul class="list" role="none">
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-default-entry-0-0"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="取引先"
                      >
                        <a class="link" href="/apps/people" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-user-fill"
                              ></use></svg></span
                          ><span class="name">取引先</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-default-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="案件"
                      >
                        <a class="link" href="/apps/sales" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-chart-fill"
                              ></use></svg></span
                          ><span class="name">案件</span></a
                        >
                      </li>
                    </ul>
                  </section>
                  <p class="empty" data-command-menu-target="empty" hidden="">
                    見つかりませんでした。別の言葉で探してみてください。
                  </p>
                </div>
                <footer class="help" aria-label="キーボード操作">
                  <span class="hint"
                    ><span class="rx-keycap"><kbd>↑</kbd><kbd>↓</kbd></span
                    >選択</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Enter</kbd></span
                    >実行</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Esc</kbd></span
                    >閉じる</span
                  >
                </footer>
                <span
                  class="rx-visually-hidden"
                  role="status"
                  data-command-menu-target="status"
                ></span>
              </div>
            </div>
          </div>
        </header>
        <div class="body">
          <div class="main">
            <div class="workspace">
              <header class="rx-page-header" data-align="start">
                <hgroup class="heading">
                  <h1>取引先</h1>
                  <p>取引のある会社と、担当者・進行中の案件を管理します。</p>
                </hgroup>
                <div class="actions">
                  <button
                    class="rx-button"
                    type="button"
                    data-variant="primary"
                    data-size="default"
                  >
                    取引先を追加
                  </button>
                </div>
              </header>
              <div
                class="rx-table"
                role="region"
                aria-label="取引先の一覧"
                tabindex="0"
                data-state="ready"
              >
                <table data-controller="" data-density="compact" class="table">
                  <caption>
                    取引先の一覧
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">コード</th>
                      <th scope="col">取引先</th>
                      <th scope="col">担当</th>
                      <th scope="col" data-cell="numeric">進行中の案件</th>
                      <th scope="col">更新日</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-cell="short">C-0012</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">株式会社みなと製作所</a>
                      </th>
                      <td data-cell="short">田中 遥</td>
                      <td data-cell="numeric">3</td>
                      <td data-cell="short">9月25日</td>
                    </tr>
                    <tr>
                      <td data-cell="short">C-0031</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">ひかり書房</a>
                      </th>
                      <td data-cell="short">佐藤 健</td>
                      <td data-cell="numeric">1</td>
                      <td data-cell="short">9月24日</td>
                    </tr>
                    <tr>
                      <td data-cell="short">C-0047</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">合同会社あおば農園</a>
                      </th>
                      <td data-cell="short">森 美咲</td>
                      <td data-cell="numeric">0</td>
                      <td data-cell="short">9月22日</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <footer class="footer"><span>つむぐ商会 · 顧客管理</span></footer>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>上の階層を背後に重ねる（trail）</h3>
    <div style="block-size: 34rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="default">
        <header class="bar">
          <div class="account">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            ><a href="/apps/settings">田中 遥</a><a href="/">ログアウト</a>
          </div>
          <div class="start"><a href="/apps/project">つむぐ商会</a></div>
          <nav class="navigation" aria-label="アプリの移動">
            <a href="/apps/project"><span>ホーム</span></a
            ><a href="/apps/people" aria-current="page" data-current="true"
              ><span>取引先</span></a
            ><a href="/apps/sales"><span>案件</span></a
            ><a href="/apps/schedule"><span>予定</span></a
            ><a href="/apps/settings"><span>設定</span></a>
          </nav>
          <div class="commands">
            <div class="rx-command-menu" data-controller="command-menu">
              <button
                popovertarget="shell-trail"
                data-command-menu-target="trigger"
                aria-haspopup="dialog"
                aria-controls="shell-trail"
                aria-expanded="false"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="large"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-search-fill"></use></svg
                >取引先・案件・担当者を探す<svg
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
                class="panel"
                popover="auto"
                role="dialog"
                id="shell-trail"
                aria-label="取引先・案件・担当者を探すのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">取引先・案件・担当者を探す</span
                  ><button
                    aria-label="コマンドを閉じる"
                    popovertarget="shell-trail"
                    popovertargetaction="hide"
                    data-command-menu-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="compact"
                  >
                    閉じる
                  </button>
                </header>
                <nav class="shortcuts" aria-label="よく使う場所" data-columns="4">
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="green"
                      href="/apps/people"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-user-fill"
                          ></use></svg></span
                      ><span class="name">取引先</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="coral"
                      href="/apps/sales"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-chart-fill"
                          ></use></svg></span
                      ><span class="name">案件</span></a
                    >
                  </div>
                </nav>
                <div class="search">
                  <div class="rx-input-group">
                    <div class="control" data-size="large">
                      <span class="affix" id="shell-trail-search-prefix"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
                      ><input
                        type="search"
                        role="combobox"
                        aria-label="仕事・人・ページを探す"
                        aria-haspopup="tree"
                        aria-autocomplete="list"
                        aria-controls="shell-trail-results"
                        aria-expanded="false"
                        autocomplete="off"
                        autofocus=""
                        placeholder="仕事・人・ページを探す…"
                        data-command-menu-target="search"
                        id="shell-trail-search"
                        data-size="large"
                        aria-describedby="shell-trail-search-prefix"
                        class="rx-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="results"
                  id="shell-trail-results"
                  role="tree"
                  aria-label="移動先・操作"
                >
                  <section
                    class="group"
                    role="group"
                    aria-labelledby="shell-trail-group-0"
                    data-command-menu-target="group"
                  >
                    <h2 id="shell-trail-group-0">移動</h2>
                    <ul class="list" role="none">
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-trail-entry-0-0"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="取引先"
                      >
                        <a class="link" href="/apps/people" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-user-fill"
                              ></use></svg></span
                          ><span class="name">取引先</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-trail-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="案件"
                      >
                        <a class="link" href="/apps/sales" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-chart-fill"
                              ></use></svg></span
                          ><span class="name">案件</span></a
                        >
                      </li>
                    </ul>
                  </section>
                  <p class="empty" data-command-menu-target="empty" hidden="">
                    見つかりませんでした。別の言葉で探してみてください。
                  </p>
                </div>
                <footer class="help" aria-label="キーボード操作">
                  <span class="hint"
                    ><span class="rx-keycap"><kbd>↑</kbd><kbd>↓</kbd></span
                    >選択</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Enter</kbd></span
                    >実行</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Esc</kbd></span
                    >閉じる</span
                  >
                </footer>
                <span
                  class="rx-visually-hidden"
                  role="status"
                  data-command-menu-target="status"
                ></span>
              </div>
            </div>
          </div>
        </header>
        <div class="body">
          <div class="main">
            <nav class="trail" aria-label="上の階層">
              <ol>
                <li style="--rx-trail-depth: 1">
                  <a href="/apps/people">株式会社みなと製作所</a>
                </li>
              </ol>
            </nav>
            <div class="workspace">
              <header class="rx-page-header" data-align="start">
                <hgroup class="heading">
                  <h1>展示会の什器の見積もり</h1>
                  <p>案件 · 担当 田中 遥 · 9月30日まで</p>
                </hgroup>
                <div class="actions">
                  <button
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="default"
                  >
                    編集
                  </button>
                </div>
              </header>
              <section class="rx-section" data-tone="neutral">
                <header class="heading">
                  <h2>やること</h2>
                  <span class="count">2</span>
                  <div class="actions">
                    <button
                      class="rx-button"
                      type="button"
                      data-variant="secondary"
                      data-size="compact"
                    >
                      追加
                    </button>
                  </div>
                </header>
                <p>見積書の数量を確かめ、来週の打ち合わせまでに送ります。</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>先頭側の列を置く（aside）</h3>
    <div style="block-size: 34rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="default">
        <header class="bar">
          <div class="account">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            ><a href="/apps/settings">田中 遥</a><a href="/">ログアウト</a>
          </div>
          <div class="start"><a href="/apps/project">つむぐ商会</a></div>
          <div class="commands">
            <div class="rx-command-menu" data-controller="command-menu">
              <button
                popovertarget="shell-aside"
                data-command-menu-target="trigger"
                aria-haspopup="dialog"
                aria-controls="shell-aside"
                aria-expanded="false"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="large"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-search-fill"></use></svg
                >取引先・案件・担当者を探す<svg
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
                class="panel"
                popover="auto"
                role="dialog"
                id="shell-aside"
                aria-label="取引先・案件・担当者を探すのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">取引先・案件・担当者を探す</span
                  ><button
                    aria-label="コマンドを閉じる"
                    popovertarget="shell-aside"
                    popovertargetaction="hide"
                    data-command-menu-target="close"
                    class="rx-button"
                    type="button"
                    data-variant="secondary"
                    data-size="compact"
                  >
                    閉じる
                  </button>
                </header>
                <nav class="shortcuts" aria-label="よく使う場所" data-columns="4">
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="green"
                      href="/apps/people"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-user-fill"
                          ></use></svg></span
                      ><span class="name">取引先</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="coral"
                      href="/apps/sales"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-chart-fill"
                          ></use></svg></span
                      ><span class="name">案件</span></a
                    >
                  </div>
                </nav>
                <div class="search">
                  <div class="rx-input-group">
                    <div class="control" data-size="large">
                      <span class="affix" id="shell-aside-search-prefix"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
                      ><input
                        type="search"
                        role="combobox"
                        aria-label="仕事・人・ページを探す"
                        aria-haspopup="tree"
                        aria-autocomplete="list"
                        aria-controls="shell-aside-results"
                        aria-expanded="false"
                        autocomplete="off"
                        autofocus=""
                        placeholder="仕事・人・ページを探す…"
                        data-command-menu-target="search"
                        id="shell-aside-search"
                        data-size="large"
                        aria-describedby="shell-aside-search-prefix"
                        class="rx-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="results"
                  id="shell-aside-results"
                  role="tree"
                  aria-label="移動先・操作"
                >
                  <section
                    class="group"
                    role="group"
                    aria-labelledby="shell-aside-group-0"
                    data-command-menu-target="group"
                  >
                    <h2 id="shell-aside-group-0">移動</h2>
                    <ul class="list" role="none">
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-aside-entry-0-0"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="取引先"
                      >
                        <a class="link" href="/apps/people" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-user-fill"
                              ></use></svg></span
                          ><span class="name">取引先</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-aside-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="案件"
                      >
                        <a class="link" href="/apps/sales" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-chart-fill"
                              ></use></svg></span
                          ><span class="name">案件</span></a
                        >
                      </li>
                    </ul>
                  </section>
                  <p class="empty" data-command-menu-target="empty" hidden="">
                    見つかりませんでした。別の言葉で探してみてください。
                  </p>
                </div>
                <footer class="help" aria-label="キーボード操作">
                  <span class="hint"
                    ><span class="rx-keycap"><kbd>↑</kbd><kbd>↓</kbd></span
                    >選択</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Enter</kbd></span
                    >実行</span
                  ><span class="hint"
                    ><span class="rx-keycap"><kbd>Esc</kbd></span
                    >閉じる</span
                  >
                </footer>
                <span
                  class="rx-visually-hidden"
                  role="status"
                  data-command-menu-target="status"
                ></span>
              </div>
            </div>
          </div>
        </header>
        <div class="body" data-aside="true">
          <div class="aside">
            <nav class="rx-navigation" aria-label="取引先の分類">
              <a href="/apps/people" aria-current="page" data-current="true"
                ><span>すべての取引先</span><small>128</small></a
              ><a href="/apps/people"><span>見込み</span><small>24</small></a
              ><a href="/apps/people"><span>取引中</span><small>87</small></a
              ><a href="/apps/people"><span>休眠</span><small>17</small></a>
            </nav>
          </div>
          <div class="main">
            <div class="workspace">
              <header class="rx-page-header" data-align="start">
                <hgroup class="heading">
                  <h1>すべての取引先</h1>
                  <p>128件の取引先</p>
                </hgroup>
              </header>
              <div
                class="rx-table"
                role="region"
                aria-label="取引先の一覧"
                tabindex="0"
                data-state="ready"
              >
                <table data-controller="" data-density="compact" class="table">
                  <caption>
                    取引先の一覧
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">コード</th>
                      <th scope="col">取引先</th>
                      <th scope="col">担当</th>
                      <th scope="col" data-cell="numeric">進行中の案件</th>
                      <th scope="col">更新日</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-cell="short">C-0012</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">株式会社みなと製作所</a>
                      </th>
                      <td data-cell="short">田中 遥</td>
                      <td data-cell="numeric">3</td>
                      <td data-cell="short">9月25日</td>
                    </tr>
                    <tr>
                      <td data-cell="short">C-0031</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">ひかり書房</a>
                      </th>
                      <td data-cell="short">佐藤 健</td>
                      <td data-cell="numeric">1</td>
                      <td data-cell="short">9月24日</td>
                    </tr>
                    <tr>
                      <td data-cell="short">C-0047</td>
                      <th scope="row" data-cell="text">
                        <a href="/apps/people">合同会社あおば農園</a>
                      </th>
                      <td data-cell="short">森 美咲</td>
                      <td data-cell="numeric">0</td>
                      <td data-cell="short">9月22日</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>入力が中心の画面（compact）</h3>
    <div style="block-size: 34rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="compact">
        <header class="bar">
          <div class="account">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            ><a href="/apps/settings">田中 遥</a><a href="/">ログアウト</a>
          </div>
          <div class="start"><a href="/apps/project">つむぐ商会</a></div>
          <nav class="navigation" aria-label="アプリの移動">
            <a href="/apps/project"><span>ホーム</span></a
            ><a href="/apps/people" aria-current="page" data-current="true"
              ><span>取引先</span></a
            ><a href="/apps/sales"><span>案件</span></a
            ><a href="/apps/schedule"><span>予定</span></a
            ><a href="/apps/settings"><span>設定</span></a>
          </nav>
        </header>
        <div class="body">
          <div class="main">
            <div class="workspace">
              <header class="rx-page-header" data-align="start">
                <hgroup class="heading">
                  <h1>設定</h1>
                  <p>会社の名前と通知を変えます。</p>
                </hgroup>
              </header>
              <form class="rx-stack" aria-label="会社の設定">
                <div class="rx-field">
                  <div class="heading">
                    <label for="shell-workspace-name">会社の名前</label>
                  </div>
                  <input
                    id="shell-workspace-name"
                    name="name"
                    value="つむぐ商会"
                    class="rx-input"
                  />
                </div>
                <label class="rx-switch" for="shell-digest"
                  ><input
                    name="digest"
                    value="weekly"
                    checked=""
                    id="shell-digest"
                    type="checkbox"
                    role="switch"
                    aria-labelledby="shell-digest-label"
                  /><span
                    ><span id="shell-digest-label">週次のまとめを受け取る</span></span
                  ></label
                >
                <div>
                  <button
                    class="rx-button"
                    type="submit"
                    data-variant="primary"
                    data-size="default"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>横に広い画面（wide）</h3>
    <div style="block-size: 34rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="wide">
        <header class="bar">
          <div class="account">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            ><a href="/apps/settings">田中 遥</a><a href="/">ログアウト</a>
          </div>
          <div class="start"><a href="/apps/project">つむぐ商会</a></div>
          <nav class="navigation" aria-label="アプリの移動">
            <a href="/apps/project"><span>ホーム</span></a
            ><a href="/apps/people" aria-current="page" data-current="true"
              ><span>取引先</span></a
            ><a href="/apps/sales"><span>案件</span></a
            ><a href="/apps/schedule"><span>予定</span></a
            ><a href="/apps/settings"><span>設定</span></a>
          </nav>
        </header>
        <div class="body">
          <div class="main">
            <div class="workspace">
              <header class="rx-page-header" data-align="start">
                <span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grid"></use></svg
                ></span>
                <hgroup class="heading"><h1>案件の進み具合</h1></hgroup>
              </header>
              <div
                id="board-:r1:"
                class="rx-board"
                style="
                  --rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr)
                    minmax(auto, 1fr);
                "
                role="region"
                aria-label="案件"
                tabindex="0"
                data-controller="board"
              >
                <section data-column-id="lead" data-tone="neutral">
                  <h3 class="title">
                    <span class="label">見込み</span><small>1</small>
                  </h3>
                  <div class="items" role="list" aria-label="見込み">
                    <article
                      class="rx-board-item"
                      role="listitem"
                      data-board-id="fair"
                      data-board-label="展示会の什器の見積もり"
                    >
                      <span class="code">No. 21</span>
                      <div class="body"><h4>展示会の什器の見積もり</h4></div>
                    </article>
                  </div>
                  <div class="empty">項目はありません</div>
                </section>
                <section data-column-id="proposal" data-tone="info">
                  <h3 class="title">
                    <span class="label">提案中</span><small>1</small>
                  </h3>
                  <div class="items" role="list" aria-label="提案中">
                    <article
                      class="rx-board-item"
                      role="listitem"
                      data-board-id="catalog"
                      data-board-label="秋のカタログの印刷"
                    >
                      <span class="code">No. 18</span>
                      <div class="body"><h4>秋のカタログの印刷</h4></div>
                    </article>
                  </div>
                  <div class="empty">項目はありません</div>
                </section>
                <section data-column-id="won" data-tone="success">
                  <h3 class="title">
                    <span class="label">受注</span><small>1</small
                    ><button
                      data-icon-only="true"
                      data-action="board#toggle"
                      data-board-toggle="true"
                      hidden=""
                      aria-expanded="true"
                      aria-label="「受注」の列を開閉"
                      class="rx-button toggle"
                      type="button"
                      data-variant="link"
                      data-size="default"
                    >
                      <svg
                        class="rx-icon expand"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-expand"></use></svg
                      ><svg
                        class="rx-icon collapse"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-collapse"></use>
                      </svg>
                    </button>
                  </h3>
                  <div class="items" role="list" aria-label="受注">
                    <article
                      class="rx-board-item"
                      role="listitem"
                      data-board-id="sign"
                      data-board-label="店舗の看板の交換"
                    >
                      <span class="code">No. 11</span>
                      <div class="body"><h4>店舗の看板の交換</h4></div>
                    </article>
                  </div>
                  <div class="empty">項目はありません</div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
```

</details>
