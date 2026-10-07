<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Board

タスクを状態ごとの列に分けて表示します。

## 使いどころ

- 仕事や問い合わせを「これから」「作業中」「完了」のような状態の列に分けて見渡し、列の間で移動する時に使います。
- 項目の属性を列ごとに比べたり並べ替えたりする時は `Table` や `DataList` を使います。
- 一つの一覧の中の完了だけを付ける時は `TaskList` を使います。
- 日付に沿って並べる時は `Calendar` や `Timeline` を使います。

## 使い方

`columns` に列を渡し、各列の `items` へ項目の `id`・`label`・`content` を渡します。`content` には見出し・本文・`TagGroup`・`Progress` など任意の要素を置けます。列の見出しには件数を添えます。

項目の代わりに任意の中身を置く列は、`items` の代わりに `content` と見出しに出す `count` を渡します。この列は移動先になりません。

`tone` で列の色を選びます。色は見出しの文字と、項目のカードを先頭側の下の角から斜めに淡く染める色に出ます。`current` の列は `tone` に関わらず青で染め、`disabled` の列には斜線を引いて移動先から外します。項目に `code` を渡すと、番号などのバッジをカードの上の先頭側の角に列の色の淡い面で置きます。

項目の無い列には `empty` の文を置きます。動かせるBoardでは、受け付ける列の空きを破線の枠で示します。

`movable` を渡すと各項目の上の末尾側の角にハンドルを置き、`BoardController` を `board` として登録すると、列の間の移動と並べ替えができます。ハンドルをドラッグすると、移動先に挿入位置の線を出し、離した所へ項目を移します。Boardの外や受け付けない列で離すと取り消します。ドラッグしている間は、Boardの左右の端でBoardを、画面の上下の端で画面をスクロールします。

ドラッグを離して移動を確定すると、取り消し可能な `board:beforemove` イベントを発火します。取り消すと項目を元の位置へ戻し、取り消さなければ `board:move` イベントを発火します。どちらも項目を新しい位置へ移した後に発火し、位置が変わらなかった時は発火しません。移動の保存と、保存できなかった時の表示の戻しは利用側で行います。

`collapsed` の列は、件数バッジと縦書きの名前を載せた縦長のピルになり、中の項目を隠して移動先から外します。`collapsible` を渡すと、ピルのどこを押しても開き、開いた列の見出しの末尾のボタンでたたみます。開閉には `BoardController` が要ります（`movable` でなくても登録します）。

開閉の時、`BoardController` は表示だけを切り替え、取り消し可能な `board:toggle` イベントを発火します。開閉の状態は保存しないので、残す時は利用側で保存し、次に描画する時の `collapsed` に反映します。

JavaScriptが無い時は、ハンドルは無効のまま置かれ、項目は動かせません。開閉のボタンは `BoardController` が接続するまで出さないので、列は描画した時の開閉のままです。件数は描画した時の数のままです。

## キーボード

| キー          | 動作                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Space / Enter | ハンドルにフォーカスがある時、項目を持ち上げます。移動している間にもう一度押すと、今の位置で確定します。                                                       |
| ↑ / ↓         | 移動中の項目を、同じ列の中で一つ前・一つ後ろへ動かします。                                                                                                     |
| ← / →         | 移動中の項目を、押した矢印の向きの隣の列の同じ順番の位置へ動かします。受け付けない列とたたんだ列は飛ばします。右から左に読む画面でも、画面上の向きに動きます。 |
| Escape        | 移動を取り消し、項目を元の位置へ戻します。                                                                                                                     |
| Tab           | 移動している間に押すと、移動を取り消してからフォーカスを移します。                                                                                             |

## アクセシビリティ

- Board全体は `role="region"` で `label` を名前にし、横にスクロールできるよう `tabindex="0"` を持ちます。
- 列の見出しは `h3` です。各列の項目は `role="list"` の一覧で、列の名前を読み上げ名にします。項目の中身に見出しを置く時は `h4` にします。
- ハンドルは「（`label`）を移動」を読み上げ名にし、キー操作の説明を `aria-describedby` で結びます。
- 持ち上げた・動かした先（列の名前と何番目か）・確定した・取り消したことを、`aria-live="polite"` の領域で読み上げます。
- 移動している間はハンドルにフォーカスを保ち、確定や取り消しの後も移動した項目のハンドルに戻します。
- 開閉のボタンは「（`title`）の列を開閉」を読み上げ名にし、`aria-expanded` で開閉の状態を伝えます。たたんだ列は、ピルを押すほかに、このボタンでも開けます。
- 列の色は見分けの補助です。状態の意味は列の名前で伝えます。

## イベント

| イベント           | 内容                                                                                                                                                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `board:beforemove` | 取り消せます。移動を確定する時に発火します。`detail` は `{ id, fromColumn, toColumn, fromIndex, toIndex }` で、`id` は項目の `id`、列は列の `id`（省略時は並び順の番号）、順番は0から数えます。`preventDefault()` で項目を元の位置へ戻します。 |
| `board:move`       | 移動が確定した時に発火します。`detail` は `board:beforemove` と同じです。                                                                                                                                                                      |
| `board:toggle`     | 取り消せます。列を開閉する時に発火します。`detail` は `{ column, collapsed }` で、`column` は列の `id`、`collapsed` はたたむ時に `true` です。`preventDefault()` で開閉しません。                                                              |

## API

### Board

| 名前              | 型                        | 既定値  | 説明                                                                                                                                           |
| ----------------- | ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | `string`                  |         | Boardのid。ハンドルの説明文のid（`<id>-help`）にも使います。省略すると自動で付けます。                                                         |
| `style`           | `CSSProperties \| string` |         | 文字列でもオブジェクトでも渡せます。列の幅を決める `--rx-board-tracks` と合わせて出力します。                                                  |
| `label`（必須）   | `string`                  |         | Board全体（role="region"）の読み上げ名。                                                                                                       |
| `columns`（必須） | `readonly Column[]`       |         | 列。渡した順に先頭側から並べる。                                                                                                               |
| `movable`         | `boolean`                 | `false` | 項目にハンドルを置き、列の間の移動と並べ替えを有効にする。BoardControllerをboardとして登録する。ハンドルはcontrollerが接続するまで無効のまま。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`board`（`BoardController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/icon.css`、`components/board.css`、`components/board-item.css`

#### `Column`

itemsを持つ形

| 名前            | 型                      | 既定値 | 説明                                                                                                                                                                                                                                                         |
| --------------- | ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | `string`                |        | 列のid。移動と開閉のイベントで列を指す値になる。省略すると並び順の番号（"0"から）。                                                                                                                                                                          |
| `title`（必須） | `string`                |        | 列の名前。見出しに書き、項目の一覧の読み上げ名にもする。                                                                                                                                                                                                     |
| `tone`          | `Tone`                  |        | 列の役割の色。見出しの文字と、項目のカードの斜めの色付け・角のバッジに出す。neutralは色を付けない。                                                                                                                                                          |
| `current`       | `boolean`               |        | 今の列（今日の担当など）。toneに関わらず青にする。                                                                                                                                                                                                           |
| `empty`         | `Child`                 |        | 項目が無い時に置く文。省略すると、movableなら「ここへ移動できます」（受け付けない列は「この列には移動できません」）、 movableでなければ「項目はありません」を置く。                                                                                          |
| `disabled`      | `boolean`               |        | 項目を受け付けない列。斜線を引き、移動先にしない。                                                                                                                                                                                                           |
| `collapsed`     | `boolean`               |        | たたんだ列。件数と縦書きの名前を載せた縦長のピルになり、中の項目は隠す。移動先にはならない。                                                                                                                                                                 |
| `collapsible`   | `boolean`               |        | 列を押して開閉できるようにする。たたんだピルに「開く」、開いた列の見出しに「たたむ」を置き、押すとBoardControllerが表示を切り替えて、取り消せるboard:toggleイベントを発火する。開閉の保存は利用側が持つ。開閉のボタンは、BoardControllerが接続するまで隠す。 |
| `items`（必須） | `readonly BoardEntry[]` |        | 列の項目。渡した順に上から並べる。件数は項目の数から数える。                                                                                                                                                                                                 |

content・countを持つ形

| 名前              | 型        | 既定値 | 説明                                                                                                                                                                                                                                                         |
| ----------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`              | `string`  |        | 列のid。移動と開閉のイベントで列を指す値になる。省略すると並び順の番号（"0"から）。                                                                                                                                                                          |
| `title`（必須）   | `string`  |        | 列の名前。見出しに書き、項目の一覧の読み上げ名にもする。                                                                                                                                                                                                     |
| `tone`            | `Tone`    |        | 列の役割の色。見出しの文字と、項目のカードの斜めの色付け・角のバッジに出す。neutralは色を付けない。                                                                                                                                                          |
| `current`         | `boolean` |        | 今の列（今日の担当など）。toneに関わらず青にする。                                                                                                                                                                                                           |
| `empty`           | `Child`   |        | 項目が無い時に置く文。省略すると、movableなら「ここへ移動できます」（受け付けない列は「この列には移動できません」）、 movableでなければ「項目はありません」を置く。                                                                                          |
| `disabled`        | `boolean` |        | 項目を受け付けない列。斜線を引き、移動先にしない。                                                                                                                                                                                                           |
| `collapsed`       | `boolean` |        | たたんだ列。件数と縦書きの名前を載せた縦長のピルになり、中の項目は隠す。移動先にはならない。                                                                                                                                                                 |
| `collapsible`     | `boolean` |        | 列を押して開閉できるようにする。たたんだピルに「開く」、開いた列の見出しに「たたむ」を置き、押すとBoardControllerが表示を切り替えて、取り消せるboard:toggleイベントを発火する。開閉の保存は利用側が持つ。開閉のボタンは、BoardControllerが接続するまで隠す。 |
| `content`（必須） | `Child`   |        | 項目の代わりに置く任意の中身。移動先にはならない。                                                                                                                                                                                                           |
| `count`（必須）   | `number`  |        | contentの時に見出しへ添える件数。                                                                                                                                                                                                                            |

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

#### `BoardEntry`

| 名前              | 型        | 既定値 | 説明                                                                             |
| ----------------- | --------- | ------ | -------------------------------------------------------------------------------- |
| `id`（必須）      | `string`  |        | 項目のid。board:beforemoveとboard:moveのdetail.idで返る。Boardの中で一意にする。 |
| `label`（必須）   | `string`  |        | 項目の名前。ハンドルの読み上げ名（「〜を移動」）と、ドラッグ中の読み上げに使う。 |
| `content`（必須） | `Child`   |        | カードに載せる中身。見出し・本文・TagGroup・Progressなど任意の要素を置ける。     |
| `disabled`        | `boolean` |        | 動かせない項目。ハンドルを無効にする。                                           |
| `code`            | `string`  |        | 項目の番号など。バッジにして、カードの上の先頭側の角に列の色で置く。             |

## コード

```tsx
import {
  Board,
  Choice,
  Tag,
  TagGroup,
  FileItem,
  Avatar,
  Progress,
  Disclosure,
  DisclosureGroup,
  ValueList,
} from "@tknf/retrix/hono";

const card = (id: string, title: string, body?: string) => ({
  id,
  label: title,
  content: (
    <>
      <h4>{title}</h4>
      {body && <p>{body}</p>}
    </>
  ),
});

export default () => (
  <div class="rx-stack">
    <Board
      label="制作の進行"
      movable
      columns={[
        {
          id: "todo",
          title: "これから",
          items: [
            {
              id: "guide",
              code: "No. 12",
              label: "仕事場の案内を更新する",
              content: (
                <>
                  <h4>仕事場の案内を更新する</h4>
                  <p>料金とキャンセル条件を確認します。</p>
                  <TagGroup label="分類">
                    <Tag label="案内" accent="blue" />
                    <Tag label="Web" />
                  </TagGroup>
                </>
              ),
            },
            {
              id: "estimate",
              code: "No. 15",
              label: "見積内容の確認",
              content: (
                <>
                  <h4>見積内容の確認</h4>
                  <Choice label="見積金額を確認" />
                  <ValueList
                    items={[
                      { label: "金額", value: "128,000円" },
                      { label: "回答期限", value: "9月22日" },
                    ]}
                  />
                </>
              ),
            },
          ],
        },
        {
          id: "doing",
          title: "作業中",
          tone: "info",
          items: [
            {
              id: "reading",
              code: "No. 9",
              label: "秋の読書会のお知らせ",
              content: (
                <>
                  <h4>秋の読書会のお知らせ</h4>
                  <p class="rx-cluster">
                    <Avatar name="田中 遥" initials="遥" />
                    <span>田中 遥 · 9月20日</span>
                  </p>
                  <Progress label="原稿" value={60} />
                </>
              ),
            },
            {
              id: "document",
              code: "No. 10",
              label: "仕事場の案内.pdf",
              content: <FileItem name="仕事場の案内.pdf" description="PDF · 2.4 MB" />,
            },
          ],
        },
        {
          id: "done",
          title: "完了",
          tone: "success",
          items: [],
          empty: "終わった項目をここへ",
        },
      ]}
    />
    <p class="catalog-footnote">
      右上のハンドルで移動します。Space → 矢印キー →
      Enterでも操作できます。Escapeで元へ戻します。移動した項目は、置いた列の色に変わります。
    </p>
    <DisclosureGroup label="列と項目の違い">
      <Disclosure summary="列の色：状態ごとの見出しと項目の色、今の列" open>
        <Board
          label="問い合わせの対応"
          columns={[
            { id: "new", title: "受付", items: [card("q1", "予約の変更について")] },
            {
              id: "active",
              title: "対応中",
              current: true,
              items: [card("q2", "領収書の再発行", "今日の担当の列です。")],
            },
            {
              id: "hold",
              title: "保留",
              tone: "warning",
              items: [card("q3", "駐車場の利用", "管理会社の回答待ち。")],
            },
            {
              id: "returned",
              title: "差し戻し",
              tone: "danger",
              items: [card("q4", "請求先の住所", "番地が抜けています。")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="完了の列：移動すると置いた列の色に変わる">
        <Board
          label="原稿の承認"
          movable
          columns={[
            {
              id: "draft",
              title: "下書き",
              items: [card("d1", "10月の利用案内"), card("d2", "年末年始の営業")],
            },
            {
              id: "approved",
              title: "承認済み",
              tone: "success",
              items: [card("d3", "9月の利用案内", "森 美咲が承認しました。")],
            },
            {
              id: "rejected",
              title: "見送り",
              tone: "danger",
              items: [card("d4", "夏の特別料金")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="たたんだ列：件数と縦書きの名前のピル、押すと開いてたためる">
        <Board
          label="採用の進行"
          columns={[
            {
              id: "backlog",
              title: "応募",
              collapsed: true,
              collapsible: true,
              items: [card("a1", "応募1")],
            },
            {
              id: "interview",
              title: "面接",
              tone: "info",
              collapsible: true,
              items: [
                card("a2", "山本 さくら", "10月2日 14時"),
                card("a3", "高橋 大輔"),
              ],
            },
            {
              id: "offer",
              title: "内定",
              tone: "success",
              collapsible: true,
              items: [card("a4", "伊藤 蓮")],
            },
            {
              id: "closed",
              title: "見送り",
              tone: "danger",
              collapsed: true,
              collapsible: true,
              items: [card("a5", "応募5"), card("a6", "応募6"), card("a7", "応募7")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="項目の中身：担当者・分類・期限・チェック・進捗・ファイル">
        <Board
          label="イベントの準備"
          columns={[
            {
              id: "prep",
              title: "準備",
              tone: "info",
              items: [
                {
                  id: "venue",
                  label: "会場の手配",
                  content: (
                    <>
                      <h4>会場の手配</h4>
                      <p class="rx-cluster">
                        <Avatar name="佐藤 健" initials="健" tone="blue" />
                        <span>佐藤 健 · 期限 10月1日</span>
                      </p>
                      <TagGroup label="分類">
                        <Tag label="会場" accent="green" />
                        <Tag label="急ぎ" accent="coral" />
                      </TagGroup>
                    </>
                  ),
                },
                {
                  id: "checklist",
                  label: "当日の持ち物",
                  content: (
                    <>
                      <h4>当日の持ち物</h4>
                      <Choice label="名札" checked />
                      <Choice label="延長コード" />
                      <Progress label="準備" value={1} max={2} />
                    </>
                  ),
                },
                {
                  id: "floor",
                  label: "会場の見取り図.png",
                  content: (
                    <FileItem name="会場の見取り図.png" description="PNG · 820 KB" />
                  ),
                },
              ],
            },
            {
              id: "notice",
              title: "告知",
              items: [card("n1", "案内メールの文面", "参加者への案内を書きます。")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="たくさんの項目と長い文">
        <Board
          label="修正の依頼"
          columns={[
            {
              id: "many",
              title: "受付",
              items: [
                card("m1", "見出しの誤字"),
                card("m2", "リンク切れ"),
                card("m3", "画像の代替文"),
                card("m4", "表の列幅"),
                card("m5", "日付の表記"),
                card("m6", "フッターの住所"),
              ],
            },
            {
              id: "long",
              title: "海外拠点から届いた、とても長い名前の列の見出し",
              items: [
                card(
                  "l1",
                  "海外拠点から届いた、2026年度秋の利用方法と受付変更に関する詳しい資料",
                  "review-abcdefghijklmnopqrstuvwxyz0123456789",
                ),
              ],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="移動不可の項目・空の列・受付終了の列">
        <Board
          label="確認の進行"
          movable
          columns={[
            {
              id: "waiting",
              title: "確認待ち",
              items: [
                {
                  id: "locked",
                  label: "確認が完了した資料",
                  disabled: true,
                  content: (
                    <>
                      <h4>確認が完了した資料</h4>
                      <p>この項目は移動できません。</p>
                    </>
                  ),
                },
                card("free", "動かせる資料"),
              ],
            },
            { id: "review", title: "レビュー", items: [] },
            {
              id: "locked-column",
              title: "受付終了",
              disabled: true,
              items: [],
              empty: "この列へは移動できません",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：列が縦に積まれる">
        <div style="max-inline-size: 28rem">
          <Board
            label="狭い場所の進行"
            columns={[
              { id: "s1", title: "これから", items: [card("s1a", "原稿を書く")] },
              {
                id: "s2",
                title: "作業中",
                tone: "info",
                items: [card("s2a", "写真を選ぶ")],
              },
              {
                id: "s3",
                title: "完了",
                tone: "success",
                collapsed: true,
                items: [card("s3a", "取材")],
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <Board
            label="تقدم العمل"
            movable
            columns={[
              {
                id: "rtl-todo",
                title: "للقيام",
                items: [
                  card("r1", "تحديث دليل المكان", "مراجعة الأسعار وشروط الإلغاء."),
                ],
              },
              {
                id: "rtl-doing",
                title: "قيد التنفيذ",
                tone: "info",
                items: [card("r2", "اختيار الصور")],
              },
              {
                id: "rtl-done",
                title: "مكتمل",
                tone: "success",
                collapsed: true,
                items: [card("r3", "المقابلة")],
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
  <div
    id="board-:r2l:"
    class="rx-board"
    style="--rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr)"
    role="region"
    aria-label="制作の進行"
    tabindex="0"
    data-controller="board"
    data-movable="true"
  >
    <section data-column-id="todo" data-tone="neutral">
      <h3 class="title"><span class="label">これから</span><small>2</small></h3>
      <div class="items" role="list" aria-label="これから">
        <article
          class="rx-board-item"
          role="listitem"
          data-board-id="guide"
          data-board-label="仕事場の案内を更新する"
        >
          <span class="code">No. 12</span>
          <div class="body">
            <h4>仕事場の案内を更新する</h4>
            <p>料金とキャンセル条件を確認します。</p>
            <div class="rx-tag-group" role="group" aria-label="分類">
              <span class="rx-tag" data-accent="blue">案内</span
              ><span class="rx-tag">Web</span>
            </div>
          </div>
          <button
            data-icon-only="true"
            data-board-handle="true"
            aria-label="「仕事場の案内を更新する」を移動"
            aria-describedby="board-:r2l:-help"
            class="rx-button handle"
            type="button"
            data-variant="link"
            data-size="default"
            disabled=""
          >
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-grip"></use>
            </svg>
          </button>
        </article>
        <article
          class="rx-board-item"
          role="listitem"
          data-board-id="estimate"
          data-board-label="見積内容の確認"
        >
          <span class="code">No. 15</span>
          <div class="body">
            <h4>見積内容の確認</h4>
            <label class="rx-choice" data-kind="plain"
              ><input type="checkbox" /><span
                ><strong>見積金額を確認</strong></span
              ></label
            >
            <dl class="rx-value-list">
              <div>
                <dt>金額</dt>
                <dd>128,000円</dd>
              </div>
              <div>
                <dt>回答期限</dt>
                <dd>9月22日</dd>
              </div>
            </dl>
          </div>
          <button
            data-icon-only="true"
            data-board-handle="true"
            aria-label="「見積内容の確認」を移動"
            aria-describedby="board-:r2l:-help"
            class="rx-button handle"
            type="button"
            data-variant="link"
            data-size="default"
            disabled=""
          >
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-grip"></use>
            </svg>
          </button>
        </article>
      </div>
      <div class="empty">ここへ移動できます</div>
    </section>
    <section data-column-id="doing" data-tone="info">
      <h3 class="title"><span class="label">作業中</span><small>2</small></h3>
      <div class="items" role="list" aria-label="作業中">
        <article
          class="rx-board-item"
          role="listitem"
          data-board-id="reading"
          data-board-label="秋の読書会のお知らせ"
        >
          <span class="code">No. 9</span>
          <div class="body">
            <h4>秋の読書会のお知らせ</h4>
            <p class="rx-cluster">
              <span
                class="rx-avatar"
                data-size="default"
                data-tone="blue"
                role="img"
                aria-label="田中 遥"
                ><span class="initials">遥</span></span
              ><span>田中 遥 · 9月20日</span>
            </p>
            <label class="rx-progress"
              ><span class="heading"
                ><span>原稿</span
                ><span class="value" aria-hidden="true">60%</span></span
              ><span class="track" data-state="determinate" aria-hidden="true"
                ><span class="fill" style="inline-size: 60%"></span></span
              ><progress class="rx-visually-hidden" value="60" max="100">
                60%
              </progress></label
            >
          </div>
          <button
            data-icon-only="true"
            data-board-handle="true"
            aria-label="「秋の読書会のお知らせ」を移動"
            aria-describedby="board-:r2l:-help"
            class="rx-button handle"
            type="button"
            data-variant="link"
            data-size="default"
            disabled=""
          >
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-grip"></use>
            </svg>
          </button>
        </article>
        <article
          class="rx-board-item"
          role="listitem"
          data-board-id="document"
          data-board-label="仕事場の案内.pdf"
        >
          <span class="code">No. 10</span>
          <div class="body">
            <div class="rx-file-item" data-state="ready">
              <span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-file"></use></svg
              ></span>
              <div class="body">
                <p class="title"><strong>仕事場の案内.pdf</strong></p>
                <p class="description">PDF · 2.4 MB</p>
              </div>
            </div>
          </div>
          <button
            data-icon-only="true"
            data-board-handle="true"
            aria-label="「仕事場の案内.pdf」を移動"
            aria-describedby="board-:r2l:-help"
            class="rx-button handle"
            type="button"
            data-variant="link"
            data-size="default"
            disabled=""
          >
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-grip"></use>
            </svg>
          </button>
        </article>
      </div>
      <div class="empty">ここへ移動できます</div>
    </section>
    <section data-column-id="done" data-tone="success">
      <h3 class="title"><span class="label">完了</span><small>0</small></h3>
      <div class="items" role="list" aria-label="完了"></div>
      <div class="empty">終わった項目をここへ</div>
    </section>
    <p id="board-:r2l:-help" class="rx-visually-hidden">
      移動ボタンをドラッグします。キーボードではSpaceで持ち上げ、左右矢印で列、上下矢印で位置を選び、Enterで確定、Escapeで取り消します。
    </p>
    <p
      class="rx-visually-hidden"
      role="status"
      data-board-announcement="true"
      aria-live="polite"
    ></p>
  </div>
  <p class="catalog-footnote">
    右上のハンドルで移動します。Space → 矢印キー →
    Enterでも操作できます。Escapeで元へ戻します。移動した項目は、置いた列の色に変わります。
  </p>
  <div class="rx-disclosure-group" role="group" aria-label="列と項目の違い">
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
          ><span class="title">列の色：状態ごとの見出しと項目の色、今の列</span></span
        >
      </summary>
      <div class="body">
        <div
          id="board-:r2m:"
          class="rx-board"
          style="
            --rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr)
              minmax(auto, 1fr);
          "
          role="region"
          aria-label="問い合わせの対応"
          tabindex="0"
        >
          <section data-column-id="new" data-tone="neutral">
            <h3 class="title"><span class="label">受付</span><small>1</small></h3>
            <div class="items" role="list" aria-label="受付">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="q1"
                data-board-label="予約の変更について"
              >
                <div class="body"><h4>予約の変更について</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="active" data-current="true" data-tone="neutral">
            <h3 class="title"><span class="label">対応中</span><small>1</small></h3>
            <div class="items" role="list" aria-label="対応中">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="q2"
                data-board-label="領収書の再発行"
              >
                <div class="body">
                  <h4>領収書の再発行</h4>
                  <p>今日の担当の列です。</p>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="hold" data-tone="warning">
            <h3 class="title"><span class="label">保留</span><small>1</small></h3>
            <div class="items" role="list" aria-label="保留">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="q3"
                data-board-label="駐車場の利用"
              >
                <div class="body">
                  <h4>駐車場の利用</h4>
                  <p>管理会社の回答待ち。</p>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="returned" data-tone="danger">
            <h3 class="title"><span class="label">差し戻し</span><small>1</small></h3>
            <div class="items" role="list" aria-label="差し戻し">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="q4"
                data-board-label="請求先の住所"
              >
                <div class="body">
                  <h4>請求先の住所</h4>
                  <p>番地が抜けています。</p>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
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
          ><span class="title">完了の列：移動すると置いた列の色に変わる</span></span
        >
      </summary>
      <div class="body">
        <div
          id="board-:r2n:"
          class="rx-board"
          style="
            --rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr);
          "
          role="region"
          aria-label="原稿の承認"
          tabindex="0"
          data-controller="board"
          data-movable="true"
        >
          <section data-column-id="draft" data-tone="neutral">
            <h3 class="title"><span class="label">下書き</span><small>2</small></h3>
            <div class="items" role="list" aria-label="下書き">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="d1"
                data-board-label="10月の利用案内"
              >
                <div class="body"><h4>10月の利用案内</h4></div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「10月の利用案内」を移動"
                  aria-describedby="board-:r2n:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="d2"
                data-board-label="年末年始の営業"
              >
                <div class="body"><h4>年末年始の営業</h4></div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「年末年始の営業」を移動"
                  aria-describedby="board-:r2n:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
            </div>
            <div class="empty">ここへ移動できます</div>
          </section>
          <section data-column-id="approved" data-tone="success">
            <h3 class="title"><span class="label">承認済み</span><small>1</small></h3>
            <div class="items" role="list" aria-label="承認済み">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="d3"
                data-board-label="9月の利用案内"
              >
                <div class="body">
                  <h4>9月の利用案内</h4>
                  <p>森 美咲が承認しました。</p>
                </div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「9月の利用案内」を移動"
                  aria-describedby="board-:r2n:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
            </div>
            <div class="empty">ここへ移動できます</div>
          </section>
          <section data-column-id="rejected" data-tone="danger">
            <h3 class="title"><span class="label">見送り</span><small>1</small></h3>
            <div class="items" role="list" aria-label="見送り">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="d4"
                data-board-label="夏の特別料金"
              >
                <div class="body"><h4>夏の特別料金</h4></div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「夏の特別料金」を移動"
                  aria-describedby="board-:r2n:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
            </div>
            <div class="empty">ここへ移動できます</div>
          </section>
          <p id="board-:r2n:-help" class="rx-visually-hidden">
            移動ボタンをドラッグします。キーボードではSpaceで持ち上げ、左右矢印で列、上下矢印で位置を選び、Enterで確定、Escapeで取り消します。
          </p>
          <p
            class="rx-visually-hidden"
            role="status"
            data-board-announcement="true"
            aria-live="polite"
          ></p>
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
            >たたんだ列：件数と縦書きの名前のピル、押すと開いてたためる</span
          ></span
        >
      </summary>
      <div class="body">
        <div
          id="board-:r2o:"
          class="rx-board"
          style="--rx-board-tracks: auto minmax(auto, 1fr) minmax(auto, 1fr) auto"
          role="region"
          aria-label="採用の進行"
          tabindex="0"
          data-controller="board"
        >
          <section
            data-column-id="backlog"
            data-drop-disabled="true"
            data-collapsed="true"
            data-tone="neutral"
          >
            <h3 class="title">
              <span class="label">応募</span><small>1</small
              ><button
                data-icon-only="true"
                data-action="board#toggle"
                data-board-toggle="true"
                hidden=""
                aria-expanded="false"
                aria-label="「応募」の列を開閉"
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
            <div class="items" role="list" aria-label="応募">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a1"
                data-board-label="応募1"
              >
                <div class="body"><h4>応募1</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="interview" data-tone="info">
            <h3 class="title">
              <span class="label">面接</span><small>2</small
              ><button
                data-icon-only="true"
                data-action="board#toggle"
                data-board-toggle="true"
                hidden=""
                aria-expanded="true"
                aria-label="「面接」の列を開閉"
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
            <div class="items" role="list" aria-label="面接">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a2"
                data-board-label="山本 さくら"
              >
                <div class="body">
                  <h4>山本 さくら</h4>
                  <p>10月2日 14時</p>
                </div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a3"
                data-board-label="高橋 大輔"
              >
                <div class="body"><h4>高橋 大輔</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="offer" data-tone="success">
            <h3 class="title">
              <span class="label">内定</span><small>1</small
              ><button
                data-icon-only="true"
                data-action="board#toggle"
                data-board-toggle="true"
                hidden=""
                aria-expanded="true"
                aria-label="「内定」の列を開閉"
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
            <div class="items" role="list" aria-label="内定">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a4"
                data-board-label="伊藤 蓮"
              >
                <div class="body"><h4>伊藤 蓮</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section
            data-column-id="closed"
            data-drop-disabled="true"
            data-collapsed="true"
            data-tone="danger"
          >
            <h3 class="title">
              <span class="label">見送り</span><small>3</small
              ><button
                data-icon-only="true"
                data-action="board#toggle"
                data-board-toggle="true"
                hidden=""
                aria-expanded="false"
                aria-label="「見送り」の列を開閉"
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
            <div class="items" role="list" aria-label="見送り">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a5"
                data-board-label="応募5"
              >
                <div class="body"><h4>応募5</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a6"
                data-board-label="応募6"
              >
                <div class="body"><h4>応募6</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="a7"
                data-board-label="応募7"
              >
                <div class="body"><h4>応募7</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
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
          ><span class="title"
            >項目の中身：担当者・分類・期限・チェック・進捗・ファイル</span
          ></span
        >
      </summary>
      <div class="body">
        <div
          id="board-:r2p:"
          class="rx-board"
          style="--rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr)"
          role="region"
          aria-label="イベントの準備"
          tabindex="0"
        >
          <section data-column-id="prep" data-tone="info">
            <h3 class="title"><span class="label">準備</span><small>3</small></h3>
            <div class="items" role="list" aria-label="準備">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="venue"
                data-board-label="会場の手配"
              >
                <div class="body">
                  <h4>会場の手配</h4>
                  <p class="rx-cluster">
                    <span
                      class="rx-avatar"
                      data-size="default"
                      data-tone="blue"
                      role="img"
                      aria-label="佐藤 健"
                      ><span class="initials">健</span></span
                    ><span>佐藤 健 · 期限 10月1日</span>
                  </p>
                  <div class="rx-tag-group" role="group" aria-label="分類">
                    <span class="rx-tag" data-accent="green">会場</span
                    ><span class="rx-tag" data-accent="coral">急ぎ</span>
                  </div>
                </div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="checklist"
                data-board-label="当日の持ち物"
              >
                <div class="body">
                  <h4>当日の持ち物</h4>
                  <label class="rx-choice" data-kind="plain"
                    ><input checked="" type="checkbox" /><span
                      ><strong>名札</strong></span
                    ></label
                  ><label class="rx-choice" data-kind="plain"
                    ><input type="checkbox" /><span
                      ><strong>延長コード</strong></span
                    ></label
                  ><label class="rx-progress"
                    ><span class="heading"
                      ><span>準備</span
                      ><span class="value" aria-hidden="true">50%</span></span
                    ><span class="track" data-state="determinate" aria-hidden="true"
                      ><span class="fill" style="inline-size: 50%"></span></span
                    ><progress class="rx-visually-hidden" value="1" max="2">
                      50%
                    </progress></label
                  >
                </div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="floor"
                data-board-label="会場の見取り図.png"
              >
                <div class="body">
                  <div class="rx-file-item" data-state="ready">
                    <span class="icon"
                      ><svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-file"></use></svg
                    ></span>
                    <div class="body">
                      <p class="title"><strong>会場の見取り図.png</strong></p>
                      <p class="description">PNG · 820 KB</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="notice" data-tone="neutral">
            <h3 class="title"><span class="label">告知</span><small>1</small></h3>
            <div class="items" role="list" aria-label="告知">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="n1"
                data-board-label="案内メールの文面"
              >
                <div class="body">
                  <h4>案内メールの文面</h4>
                  <p>参加者への案内を書きます。</p>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
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
        ><span class="label"><span class="title">たくさんの項目と長い文</span></span>
      </summary>
      <div class="body">
        <div
          id="board-:r2q:"
          class="rx-board"
          style="--rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr)"
          role="region"
          aria-label="修正の依頼"
          tabindex="0"
        >
          <section data-column-id="many" data-tone="neutral">
            <h3 class="title"><span class="label">受付</span><small>6</small></h3>
            <div class="items" role="list" aria-label="受付">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m1"
                data-board-label="見出しの誤字"
              >
                <div class="body"><h4>見出しの誤字</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m2"
                data-board-label="リンク切れ"
              >
                <div class="body"><h4>リンク切れ</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m3"
                data-board-label="画像の代替文"
              >
                <div class="body"><h4>画像の代替文</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m4"
                data-board-label="表の列幅"
              >
                <div class="body"><h4>表の列幅</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m5"
                data-board-label="日付の表記"
              >
                <div class="body"><h4>日付の表記</h4></div>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="m6"
                data-board-label="フッターの住所"
              >
                <div class="body"><h4>フッターの住所</h4></div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
          </section>
          <section data-column-id="long" data-tone="neutral">
            <h3 class="title">
              <span class="label">海外拠点から届いた、とても長い名前の列の見出し</span
              ><small>1</small>
            </h3>
            <div
              class="items"
              role="list"
              aria-label="海外拠点から届いた、とても長い名前の列の見出し"
            >
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="l1"
                data-board-label="海外拠点から届いた、2026年度秋の利用方法と受付変更に関する詳しい資料"
              >
                <div class="body">
                  <h4>
                    海外拠点から届いた、2026年度秋の利用方法と受付変更に関する詳しい資料
                  </h4>
                  <p>review-abcdefghijklmnopqrstuvwxyz0123456789</p>
                </div>
              </article>
            </div>
            <div class="empty">項目はありません</div>
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
          ><span class="title">移動不可の項目・空の列・受付終了の列</span></span
        >
      </summary>
      <div class="body">
        <div
          id="board-:r2r:"
          class="rx-board"
          style="
            --rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr);
          "
          role="region"
          aria-label="確認の進行"
          tabindex="0"
          data-controller="board"
          data-movable="true"
        >
          <section data-column-id="waiting" data-tone="neutral">
            <h3 class="title"><span class="label">確認待ち</span><small>2</small></h3>
            <div class="items" role="list" aria-label="確認待ち">
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="locked"
                data-board-label="確認が完了した資料"
                data-disabled="true"
              >
                <div class="body">
                  <h4>確認が完了した資料</h4>
                  <p>この項目は移動できません。</p>
                </div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「確認が完了した資料」を移動"
                  aria-describedby="board-:r2r:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
              <article
                class="rx-board-item"
                role="listitem"
                data-board-id="free"
                data-board-label="動かせる資料"
              >
                <div class="body"><h4>動かせる資料</h4></div>
                <button
                  data-icon-only="true"
                  data-board-handle="true"
                  aria-label="「動かせる資料」を移動"
                  aria-describedby="board-:r2r:-help"
                  class="rx-button handle"
                  type="button"
                  data-variant="link"
                  data-size="default"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-grip"></use>
                  </svg>
                </button>
              </article>
            </div>
            <div class="empty">ここへ移動できます</div>
          </section>
          <section data-column-id="review" data-tone="neutral">
            <h3 class="title"><span class="label">レビュー</span><small>0</small></h3>
            <div class="items" role="list" aria-label="レビュー"></div>
            <div class="empty">ここへ移動できます</div>
          </section>
          <section
            data-column-id="locked-column"
            data-drop-disabled="true"
            data-disabled="true"
            data-tone="neutral"
          >
            <h3 class="title"><span class="label">受付終了</span><small>0</small></h3>
            <div class="items" role="list" aria-label="受付終了"></div>
            <div class="empty">この列へは移動できません</div>
          </section>
          <p id="board-:r2r:-help" class="rx-visually-hidden">
            移動ボタンをドラッグします。キーボードではSpaceで持ち上げ、左右矢印で列、上下矢印で位置を選び、Enterで確定、Escapeで取り消します。
          </p>
          <p
            class="rx-visually-hidden"
            role="status"
            data-board-announcement="true"
            aria-live="polite"
          ></p>
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
          ><span class="title">狭い場所：列が縦に積まれる</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 28rem">
          <div
            id="board-:r2s:"
            class="rx-board"
            style="--rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) auto"
            role="region"
            aria-label="狭い場所の進行"
            tabindex="0"
          >
            <section data-column-id="s1" data-tone="neutral">
              <h3 class="title"><span class="label">これから</span><small>1</small></h3>
              <div class="items" role="list" aria-label="これから">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="s1a"
                  data-board-label="原稿を書く"
                >
                  <div class="body"><h4>原稿を書く</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
            <section data-column-id="s2" data-tone="info">
              <h3 class="title"><span class="label">作業中</span><small>1</small></h3>
              <div class="items" role="list" aria-label="作業中">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="s2a"
                  data-board-label="写真を選ぶ"
                >
                  <div class="body"><h4>写真を選ぶ</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
            </section>
            <section
              data-column-id="s3"
              data-drop-disabled="true"
              data-collapsed="true"
              data-tone="success"
            >
              <h3 class="title"><span class="label">完了</span><small>1</small></h3>
              <div class="items" role="list" aria-label="完了">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="s3a"
                  data-board-label="取材"
                >
                  <div class="body"><h4>取材</h4></div>
                </article>
              </div>
              <div class="empty">項目はありません</div>
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
        ><span class="label"><span class="title">右から左へ書く言語</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <div
            id="board-:r2t:"
            class="rx-board"
            style="--rx-board-tracks: minmax(auto, 1fr) minmax(auto, 1fr) auto"
            role="region"
            aria-label="تقدم العمل"
            tabindex="0"
            data-controller="board"
            data-movable="true"
          >
            <section data-column-id="rtl-todo" data-tone="neutral">
              <h3 class="title"><span class="label">للقيام</span><small>1</small></h3>
              <div class="items" role="list" aria-label="للقيام">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="r1"
                  data-board-label="تحديث دليل المكان"
                >
                  <div class="body">
                    <h4>تحديث دليل المكان</h4>
                    <p>مراجعة الأسعار وشروط الإلغاء.</p>
                  </div>
                  <button
                    data-icon-only="true"
                    data-board-handle="true"
                    aria-label="「تحديث دليل المكان」を移動"
                    aria-describedby="board-:r2t:-help"
                    class="rx-button handle"
                    type="button"
                    data-variant="link"
                    data-size="default"
                    disabled=""
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-grip"></use>
                    </svg>
                  </button>
                </article>
              </div>
              <div class="empty">ここへ移動できます</div>
            </section>
            <section data-column-id="rtl-doing" data-tone="info">
              <h3 class="title">
                <span class="label">قيد التنفيذ</span><small>1</small>
              </h3>
              <div class="items" role="list" aria-label="قيد التنفيذ">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="r2"
                  data-board-label="اختيار الصور"
                >
                  <div class="body"><h4>اختيار الصور</h4></div>
                  <button
                    data-icon-only="true"
                    data-board-handle="true"
                    aria-label="「اختيار الصور」を移動"
                    aria-describedby="board-:r2t:-help"
                    class="rx-button handle"
                    type="button"
                    data-variant="link"
                    data-size="default"
                    disabled=""
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-grip"></use>
                    </svg>
                  </button>
                </article>
              </div>
              <div class="empty">ここへ移動できます</div>
            </section>
            <section
              data-column-id="rtl-done"
              data-drop-disabled="true"
              data-collapsed="true"
              data-tone="success"
            >
              <h3 class="title"><span class="label">مكتمل</span><small>1</small></h3>
              <div class="items" role="list" aria-label="مكتمل">
                <article
                  class="rx-board-item"
                  role="listitem"
                  data-board-id="r3"
                  data-board-label="المقابلة"
                >
                  <div class="body"><h4>المقابلة</h4></div>
                  <button
                    data-icon-only="true"
                    data-board-handle="true"
                    aria-label="「المقابلة」を移動"
                    aria-describedby="board-:r2t:-help"
                    class="rx-button handle"
                    type="button"
                    data-variant="link"
                    data-size="default"
                    disabled=""
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-grip"></use>
                    </svg>
                  </button>
                </article>
              </div>
              <div class="empty">ここへ移動できます</div>
            </section>
            <p id="board-:r2t:-help" class="rx-visually-hidden">
              移動ボタンをドラッグします。キーボードではSpaceで持ち上げ、左右矢印で列、上下矢印で位置を選び、Enterで確定、Escapeで取り消します。
            </p>
            <p
              class="rx-visually-hidden"
              role="status"
              data-board-announcement="true"
              aria-live="polite"
            ></p>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
