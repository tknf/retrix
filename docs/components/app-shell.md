<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# AppShell

上部中央のコマンドメニューと中央の作業面を持つ、アプリの基本の画面構成です。

## 使いどころ

- アプリの各画面に共通する画面構成として、上部中央のコマンドメニューと中央の作業面を置く時に使います。
- 画面の端に固定するサイドバーは持ちません。画面全体の移動は`commands`の`CommandMenu`、作業面に付属する補助パネルは`wings`（`Wing`）で扱います。
- `AppShell`を使わない画面で作業面だけを置く時は`Surface`を使います。

## 使い方

`commands`に`CommandMenu`を一つ渡し、`home`・`account`を上部のバーの左右に置きます。バーは画面の上端に留まり、左右の内容の幅に関わらず`commands`を画面の中央に置きます。`home`・`account`を省略すると、その枠を出しません。

`children`は中央の作業面に置きます。作業面は白い面で、幅の上限は`size`で選びます。`default`は`--rx-page`（68rem）、`compact`は本文の行の長さ（`--rx-measure`）に左右の余白を足した46rem、`wide`は112remです。設定画面など入力が中心の画面は`compact`、`Board`や年の予定など横に広い画面は`wide`にします。ほかの幅が必要な時は、ルートの`style`で`--rx-page`を上書きします。作業面の列は作業面の幅に収まるので、広い表などは中身の側で横にスクロールさせます。`Board`・`Table`・`Grid`・`Calendar`は、作業面の左右の余白の分だけ外側に広がり、作業面の端までスクロールします。段組み（`SplitView`など）や、`Card`・`LayerCard`・`Notice`・`ChartFrame`の中では広げません。

`AppShell`の幅が45rem未満では作業面の外側と内側の余白を詰め、28rem未満では`commands`を一段目、`home`・`account`を二段目の左右に置きます。

`wings`に`start`・`end`を渡すと、作業面を`Wing`で包み、左右に開閉できる補助パネルを付けます。開閉の状態を保存する時は`storageKey`・`savedState`も渡し、`WingController`を`wing`として登録します（詳しくは`Wing`のページ）。

`AppShell`自身はcontrollerを使わず、JavaScriptなしでも同じ配置で表示します。

## アクセシビリティ

- 上部のバーは`header`で、`commands`は`aria-label="共通コマンド"`の`nav`に置きます。
- 作業面は`div`で、`main`を持ちません。画面の本文は`children`の中で利用側が`main`で包みます。
- `home`・`account`に文字のないリンクや操作を置く時は、読み上げ名を利用側で付けます。

## API

### AppShell

上部中央の共通コマンドと、中央の作業面を構成する。wingsは作業面の左右に開閉できる補助メニューを付ける。

| 名前               | 型                                                                  | 既定値      | 説明                                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commands`（必須） | `Child`                                                             |             | 上部のバーの中央に置く共通コマンド。通常はCommandMenuを一つ渡す。                                                                                                                                                     |
| `home`             | `Child`                                                             |             | 上部のバーの先頭側に置く、ホームへのリンクなど。省略すると枠ごと出さない。                                                                                                                                            |
| `account`          | `Child`                                                             |             | 上部のバーの末尾側に置く、利用者のAvatarやアカウントへのリンクなど。省略すると枠ごと出さない。                                                                                                                        |
| `wings`            | `Pick<WingProps, "start" \| "end" \| "storageKey" \| "savedState">` |             | 作業面の左右に付ける補助パネル。Wingのstart・end・storageKey・savedStateと同じ値を渡す。省略するとWingを使わず、作業面だけを置く。                                                                                    |
| `size`             | `"compact" \| "default" \| "wide"`                                  | `"default"` | 作業面の幅の上限。compactは46rem（本文の行の長さ--rx-measureに左右の余白を足した幅）、defaultは68rem（--rx-page）、wideは112rem。設定画面など入力が中心の画面はcompact、Boardや年の予定など横に広い画面はwideにする。 |
| `children`         | `Child`                                                             |             | 中央の作業面に置く、画面の中身。                                                                                                                                                                                      |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`wing`（`WingController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/app-shell.css`、`components/wing.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`

#### `WingProps`

[Wing](wing.md)のpropsと同じです。

## コード

```tsx
import {
  AppShell,
  ActionLink,
  Avatar,
  Board,
  Button,
  CommandMenu,
  Field,
  Icon,
  Input,
  PageHeader,
  Switch,
  Table,
} from "@tknf/retrix/hono";

/** 見本ごとにidを変えるため、共通コマンドは関数で作る。 */
const commands = (id: string) => (
  <CommandMenu
    id={id}
    label="つむぐチーム"
    shortcuts={[
      { label: "プロジェクト", href: "/apps/project", icon: "layers", accent: "green" },
      { label: "受信トレイ", href: "/apps/inbox", icon: "mail", accent: "blue" },
      { label: "資料", href: "/apps/files", icon: "file", accent: "amber" },
      { label: "売上", href: "/apps/sales", icon: "chart", accent: "coral" },
    ]}
    groups={[
      {
        label: "移動",
        items: [
          { label: "プロジェクト", href: "/apps/project", icon: "layers" },
          { label: "受信トレイ", href: "/apps/inbox", icon: "mail" },
        ],
      },
    ]}
  />
);

const home = (
  <ActionLink href="/apps/project" variant="link">
    ホーム
  </ActionLink>
);

const account = <Avatar name="田中 遥" initials="遥" size="small" tone="coral" />;

const records = [
  {
    title: "ヘルプセンターの目次を見直す",
    owner: "田中 遥",
    reviewer: "佐藤 健",
    updated: "2026年9月25日 10:00",
    due: "2026年9月30日",
    status: "確認待ち",
    place: "ヘルプセンター（日本語）",
    priority: "高",
    comments: "3件",
  },
  {
    title: "料金とキャンセル条件を更新する",
    owner: "佐藤 健",
    reviewer: "森 美咲",
    updated: "2026年9月24日 15:30",
    due: "2026年10月3日",
    status: "進行中",
    place: "料金ページ",
    priority: "中",
    comments: "1件",
  },
  {
    title: "よくある質問を集める",
    owner: "森 美咲",
    reviewer: "田中 遥",
    updated: "2026年9月22日 9:00",
    due: "2026年10月10日",
    status: "これから",
    place: "ヘルプセンター（英語）",
    priority: "低",
    comments: "0件",
  },
];

const job = (id: string, code: string, title: string) => ({
  id,
  code,
  label: title,
  content: <h4>{title}</h4>,
});

/*
  見本のAppShellは高さを決めた枠の中でスクロールさせ、上端に留まるバーを見せる。
  isolationで、見本のバーがカタログ自身のバーに重ならないようにする。
*/
const frame = "block-size: 32rem; overflow: auto; isolation: isolate";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>既定の幅（default）</h3>
      <div style={frame}>
        <AppShell home={home} commands={commands("shell-default")} account={account}>
          <PageHeader
            title="今日の仕事"
            description="上部中央のコマンドメニューから移動し、中央の作業面で仕事を進めます。横に広い表は作業面の端までスクロールします。"
            icon={<Icon name="layers" />}
            actions={<Button variant="primary">仕事を追加</Button>}
          />
          <Table caption="担当している仕事">
            <thead>
              <tr>
                <th scope="col">仕事</th>
                <th scope="col">担当</th>
                <th scope="col">確認者</th>
                <th scope="col">更新日時</th>
                <th scope="col">期限</th>
                <th scope="col">状態</th>
                <th scope="col">公開先</th>
                <th scope="col">優先度</th>
                <th scope="col" data-cell="numeric">
                  コメント
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr>
                  <th scope="row" data-cell="text">
                    {record.title}
                  </th>
                  <td data-cell="short">{record.owner}</td>
                  <td data-cell="short">{record.reviewer}</td>
                  <td data-cell="short">{record.updated}</td>
                  <td data-cell="short">{record.due}</td>
                  <td data-cell="short">{record.status}</td>
                  <td data-cell="short">{record.place}</td>
                  <td data-cell="short">{record.priority}</td>
                  <td data-cell="numeric">{record.comments}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AppShell>
      </div>
    </section>
    <section class="rx-stack" data-space="small">
      <h3>入力が中心の画面（compact）</h3>
      <div style={frame}>
        <AppShell
          size="compact"
          home={home}
          commands={commands("shell-compact")}
          account={account}
        >
          <PageHeader
            title="設定"
            description="ワークスペースの名前と通知を変えます。"
          />
          <form class="rx-stack" aria-label="ワークスペースの設定">
            <Field id="shell-workspace-name" label="ワークスペースの名前">
              {(attributes) => (
                <Input {...attributes} name="name" value="小さな仕事場" />
              )}
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
        <AppShell
          size="wide"
          home={home}
          commands={commands("shell-wide")}
          account={account}
        >
          <PageHeader
            title="ヘルプセンターのリニューアル"
            icon={<Icon name="grid" />}
          />
          <Board
            label="ヘルプセンターの仕事"
            columns={[
              {
                id: "todo",
                title: "これから",
                items: [job("faq", "No. 21", "よくある質問を集める")],
              },
              {
                id: "doing",
                title: "進めている",
                tone: "info",
                items: [job("guide", "No. 18", "はじめての方向けガイド")],
              },
              {
                id: "review",
                title: "確認待ち",
                tone: "warning",
                items: [job("export", "No. 16", "データの書き出しの記事")],
              },
              {
                id: "done",
                title: "できた！",
                tone: "success",
                collapsible: true,
                items: [job("goal", "No. 11", "チームでゴールを揃える")],
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
    <div style="block-size: 32rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="default">
        <header class="bar">
          <div class="start">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="link"
              data-size="default"
              >ホーム</a
            >
          </div>
          <nav class="commands" aria-label="共通コマンド">
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
                  <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg
                >つむぐチーム<svg
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
                aria-label="つむぐチームのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">つむぐチーム</span
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
                      href="/apps/project"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-layers-fill"
                          ></use></svg></span
                      ><span class="name">プロジェクト</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="blue"
                      href="/apps/inbox"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-mail-fill"
                          ></use></svg></span
                      ><span class="name">受信トレイ</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="amber"
                      href="/apps/files"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-file-fill"
                          ></use></svg></span
                      ><span class="name">資料</span></a
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
                      ><span class="name">売上</span></a
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
                        data-search="プロジェクト"
                      >
                        <a class="link" href="/apps/project" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-layers-fill"
                              ></use></svg></span
                          ><span class="name">プロジェクト</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-default-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="受信トレイ"
                      >
                        <a class="link" href="/apps/inbox" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-mail-fill"
                              ></use></svg></span
                          ><span class="name">受信トレイ</span></a
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
          </nav>
          <div class="end">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            >
          </div>
        </header>
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
                <use href="/assets/rx-icons.svg#rx-layers"></use></svg
            ></span>
            <hgroup class="heading">
              <h1>今日の仕事</h1>
              <p>
                上部中央のコマンドメニューから移動し、中央の作業面で仕事を進めます。横に広い表は作業面の端までスクロールします。
              </p>
            </hgroup>
            <div class="actions">
              <button
                class="rx-button"
                type="button"
                data-variant="primary"
                data-size="default"
              >
                仕事を追加
              </button>
            </div>
          </header>
          <div
            class="rx-table"
            role="region"
            aria-label="担当している仕事"
            tabindex="0"
            data-state="ready"
          >
            <table data-controller="" data-density="compact" class="table">
              <caption>
                担当している仕事
              </caption>
              <thead>
                <tr>
                  <th scope="col">仕事</th>
                  <th scope="col">担当</th>
                  <th scope="col">確認者</th>
                  <th scope="col">更新日時</th>
                  <th scope="col">期限</th>
                  <th scope="col">状態</th>
                  <th scope="col">公開先</th>
                  <th scope="col">優先度</th>
                  <th scope="col" data-cell="numeric">コメント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" data-cell="text">ヘルプセンターの目次を見直す</th>
                  <td data-cell="short">田中 遥</td>
                  <td data-cell="short">佐藤 健</td>
                  <td data-cell="short">2026年9月25日 10:00</td>
                  <td data-cell="short">2026年9月30日</td>
                  <td data-cell="short">確認待ち</td>
                  <td data-cell="short">ヘルプセンター（日本語）</td>
                  <td data-cell="short">高</td>
                  <td data-cell="numeric">3件</td>
                </tr>
                <tr>
                  <th scope="row" data-cell="text">料金とキャンセル条件を更新する</th>
                  <td data-cell="short">佐藤 健</td>
                  <td data-cell="short">森 美咲</td>
                  <td data-cell="short">2026年9月24日 15:30</td>
                  <td data-cell="short">2026年10月3日</td>
                  <td data-cell="short">進行中</td>
                  <td data-cell="short">料金ページ</td>
                  <td data-cell="short">中</td>
                  <td data-cell="numeric">1件</td>
                </tr>
                <tr>
                  <th scope="row" data-cell="text">よくある質問を集める</th>
                  <td data-cell="short">森 美咲</td>
                  <td data-cell="short">田中 遥</td>
                  <td data-cell="short">2026年9月22日 9:00</td>
                  <td data-cell="short">2026年10月10日</td>
                  <td data-cell="short">これから</td>
                  <td data-cell="short">ヘルプセンター（英語）</td>
                  <td data-cell="short">低</td>
                  <td data-cell="numeric">0件</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>入力が中心の画面（compact）</h3>
    <div style="block-size: 32rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="compact">
        <header class="bar">
          <div class="start">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="link"
              data-size="default"
              >ホーム</a
            >
          </div>
          <nav class="commands" aria-label="共通コマンド">
            <div class="rx-command-menu" data-controller="command-menu">
              <button
                popovertarget="shell-compact"
                data-command-menu-target="trigger"
                aria-haspopup="dialog"
                aria-controls="shell-compact"
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
                  <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg
                >つむぐチーム<svg
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
                id="shell-compact"
                aria-label="つむぐチームのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">つむぐチーム</span
                  ><button
                    aria-label="コマンドを閉じる"
                    popovertarget="shell-compact"
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
                      href="/apps/project"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-layers-fill"
                          ></use></svg></span
                      ><span class="name">プロジェクト</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="blue"
                      href="/apps/inbox"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-mail-fill"
                          ></use></svg></span
                      ><span class="name">受信トレイ</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="amber"
                      href="/apps/files"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-file-fill"
                          ></use></svg></span
                      ><span class="name">資料</span></a
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
                      ><span class="name">売上</span></a
                    >
                  </div>
                </nav>
                <div class="search">
                  <div class="rx-input-group">
                    <div class="control" data-size="large">
                      <span class="affix" id="shell-compact-search-prefix"
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
                        aria-controls="shell-compact-results"
                        aria-expanded="false"
                        autocomplete="off"
                        autofocus=""
                        placeholder="仕事・人・ページを探す…"
                        data-command-menu-target="search"
                        id="shell-compact-search"
                        data-size="large"
                        aria-describedby="shell-compact-search-prefix"
                        class="rx-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="results"
                  id="shell-compact-results"
                  role="tree"
                  aria-label="移動先・操作"
                >
                  <section
                    class="group"
                    role="group"
                    aria-labelledby="shell-compact-group-0"
                    data-command-menu-target="group"
                  >
                    <h2 id="shell-compact-group-0">移動</h2>
                    <ul class="list" role="none">
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-compact-entry-0-0"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="プロジェクト"
                      >
                        <a class="link" href="/apps/project" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-layers-fill"
                              ></use></svg></span
                          ><span class="name">プロジェクト</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-compact-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="受信トレイ"
                      >
                        <a class="link" href="/apps/inbox" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-mail-fill"
                              ></use></svg></span
                          ><span class="name">受信トレイ</span></a
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
          </nav>
          <div class="end">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            >
          </div>
        </header>
        <div class="workspace">
          <header class="rx-page-header" data-align="start">
            <hgroup class="heading">
              <h1>設定</h1>
              <p>ワークスペースの名前と通知を変えます。</p>
            </hgroup>
          </header>
          <form class="rx-stack" aria-label="ワークスペースの設定">
            <div class="rx-field">
              <div class="heading">
                <label for="shell-workspace-name">ワークスペースの名前</label>
              </div>
              <input
                id="shell-workspace-name"
                name="name"
                value="小さな仕事場"
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
  </section>
  <section class="rx-stack" data-space="small">
    <h3>横に広い画面（wide）</h3>
    <div style="block-size: 32rem; overflow: auto; isolation: isolate">
      <div class="rx-app-shell" data-size="wide">
        <header class="bar">
          <div class="start">
            <a
              href="/apps/project"
              class="rx-button"
              data-variant="link"
              data-size="default"
              >ホーム</a
            >
          </div>
          <nav class="commands" aria-label="共通コマンド">
            <div class="rx-command-menu" data-controller="command-menu">
              <button
                popovertarget="shell-wide"
                data-command-menu-target="trigger"
                aria-haspopup="dialog"
                aria-controls="shell-wide"
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
                  <use href="/assets/rx-icons.svg#rx-layers-fill"></use></svg
                >つむぐチーム<svg
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
                id="shell-wide"
                aria-label="つむぐチームのコマンド"
                data-command-menu-target="panel"
              >
                <header class="heading">
                  <span class="name">つむぐチーム</span
                  ><button
                    aria-label="コマンドを閉じる"
                    popovertarget="shell-wide"
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
                      href="/apps/project"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-layers-fill"
                          ></use></svg></span
                      ><span class="name">プロジェクト</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="blue"
                      href="/apps/inbox"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-mail-fill"
                          ></use></svg></span
                      ><span class="name">受信トレイ</span></a
                    >
                  </div>
                  <div class="shortcut">
                    <a
                      tabindex="0"
                      class="rx-action-tile"
                      data-accent="amber"
                      href="/apps/files"
                      ><span class="icon"
                        ><svg
                          class="rx-icon"
                          viewBox="0 0 256 256"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <use
                            href="/assets/rx-icons.svg#rx-file-fill"
                          ></use></svg></span
                      ><span class="name">資料</span></a
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
                      ><span class="name">売上</span></a
                    >
                  </div>
                </nav>
                <div class="search">
                  <div class="rx-input-group">
                    <div class="control" data-size="large">
                      <span class="affix" id="shell-wide-search-prefix"
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
                        aria-controls="shell-wide-results"
                        aria-expanded="false"
                        autocomplete="off"
                        autofocus=""
                        placeholder="仕事・人・ページを探す…"
                        data-command-menu-target="search"
                        id="shell-wide-search"
                        data-size="large"
                        aria-describedby="shell-wide-search-prefix"
                        class="rx-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="results"
                  id="shell-wide-results"
                  role="tree"
                  aria-label="移動先・操作"
                >
                  <section
                    class="group"
                    role="group"
                    aria-labelledby="shell-wide-group-0"
                    data-command-menu-target="group"
                  >
                    <h2 id="shell-wide-group-0">移動</h2>
                    <ul class="list" role="none">
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-wide-entry-0-0"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="プロジェクト"
                      >
                        <a class="link" href="/apps/project" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-layers-fill"
                              ></use></svg></span
                          ><span class="name">プロジェクト</span></a
                        >
                      </li>
                      <li
                        class="entry"
                        role="treeitem"
                        id="shell-wide-entry-0-1"
                        aria-selected="false"
                        data-command-menu-target="entry"
                        data-search="受信トレイ"
                      >
                        <a class="link" href="/apps/inbox" tabindex="0"
                          ><span class="icon"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-mail-fill"
                              ></use></svg></span
                          ><span class="name">受信トレイ</span></a
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
          </nav>
          <div class="end">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="coral"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">遥</span></span
            >
          </div>
        </header>
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
            <hgroup class="heading"><h1>ヘルプセンターのリニューアル</h1></hgroup>
          </header>
          <div
            id="board-:r1:"
            class="rx-board"
            style="
              --rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr)
                minmax(auto, 1fr);
            "
            role="region"
            aria-label="ヘルプセンターの仕事"
            tabindex="0"
            data-controller="board"
          >
            <section data-column-id="todo" data-tone="neutral">
              <h3 class="title"><span class="label">これから</span><small>1</small></h3>
              <div class="items" role="list" aria-label="これから">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="faq"
                  data-board-label="よくある質問を集める"
                >
                  <span class="code">No. 21</span>
                  <div class="body"><h4>よくある質問を集める</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
            <section data-column-id="doing" data-tone="info">
              <h3 class="title">
                <span class="label">進めている</span><small>1</small>
              </h3>
              <div class="items" role="list" aria-label="進めている">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="guide"
                  data-board-label="はじめての方向けガイド"
                >
                  <span class="code">No. 18</span>
                  <div class="body"><h4>はじめての方向けガイド</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
            <section data-column-id="review" data-tone="warning">
              <h3 class="title"><span class="label">確認待ち</span><small>1</small></h3>
              <div class="items" role="list" aria-label="確認待ち">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="export"
                  data-board-label="データの書き出しの記事"
                >
                  <span class="code">No. 16</span>
                  <div class="body"><h4>データの書き出しの記事</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
            <section data-column-id="done" data-tone="success">
              <h3 class="title">
                <span class="label">できた！</span><small>1</small
                ><button
                  data-icon-only="true"
                  data-action="board#toggle"
                  data-board-toggle="true"
                  hidden=""
                  aria-expanded="true"
                  aria-label="「できた！」の列を開閉"
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
              <div class="items" role="list" aria-label="できた！">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="goal"
                  data-board-label="チームでゴールを揃える"
                >
                  <span class="code">No. 11</span>
                  <div class="body"><h4>チームでゴールを揃える</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
```

</details>
