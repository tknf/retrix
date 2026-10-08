<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Timeline

出来事を時系列で表示します。

## 使いどころ

- 変更の履歴や対応の記録など、起きた出来事を時系列で読ませる時に使います。
- 計画の節目の、終えた・今・これからを示す時は `variant="milestones"` にします。
- 入力の手順と今の段階を示す時は `Steps`、人と人のやり取りを読ませる時は `Message` を使います。
- 日付の枠に沿って予定を見渡す時は `Calendar` を使います。

## 使い方

`items` を渡した順に上から並べます。時系列の順序は利用側でそろえます。各出来事に表示用の `time` と機械可読の `datetime` を付け、題名の下に `content` で本文や添付を置きます。

出来事はBasecamp 2のProgressと同じく、暖かい灰色（#dcd9d2）の2pxの縦の線に沿って並べ、白い小さな丸に線と同じ色の2pxの輪を付けたマーカーで示します。時刻は茶色の11pxの文字、題名は12pxの黒い太字です。`avatar` を渡すと、マーカーの代わりに起こした人のアバターを線の上に置きます。`actor` を渡すと、題名の前に名前を太字で書き、題名は普通の太さにします。

`day` を渡すと、その出来事の前に日の区切りを置きます。Basecamp 2のProgressのプロジェクトの見出しと同じく、黒い太字の名前（13px）の下に、縦の線から横へ伸びる同じ色の帯を引きます。

`kind="system"` は移動や自動で閉じたなどのシステムの出来事で、マーカーと縦の線を置かずに、角の無い淡い灰色の平らな帯の中央に、時刻と題名を通常の太さで書きます。`kind="gap"` は何もなかった期間で、線を破線にし、時刻を出さずに灰色の小さな題名だけを書きます。

`variant="milestones"` は節目の一覧で、`state` を描き分けます。`complete` は緑の丸に白いチェックのマーカー、`current` はBasecamp ClassicのMilestonesの「Today」と同じ橙がかった茶色で塗った丸のマーカーにし、時刻を黒い太字にして `Calendar` の今日と同じ黄色のハイライトを角の無い面で敷きます。`upcoming` はマーカーを白い丸に淡い灰色の輪にし、そこから先の線を破線にします。

`variant="compact"` は行の間を詰め、題名を普通の太さにします。

幅が28rem以上ある時は時刻を左の列に、狭い時は題名の上に置きます。JavaScriptは使いません。

## アクセシビリティ

- 一覧は `ol` で、`label` を読み上げ名にします。時刻は `time` 要素で `datetime` を持ちます。
- `state` を渡すと、題名の前に「完了：」「進行中：」「予定：」を読み上げ用に添えます。`variant` に関わらず添えます。
- 点のマーカーは読み上げから外します。`avatar` のアバターは、`Avatar` の名前で読み上げます。
- 日の区切りも一覧の行の一つで、その日の出来事の前に日の名前を読み上げます。

## API

### Timeline

| 名前            | 型                                                                                                                                                                                                                 | 既定値       | 説明                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                                                                                                                                                                                                           |              | 一覧（ol）の読み上げ名。                                                                                                            |
| `variant`       | `"activity" \| "milestones" \| "compact"`                                                                                                                                                                          | `"activity"` | activityは出来事の記録。milestonesは節目で、stateの違いをマーカーと線で描き分ける。 compactは行の間を詰め、題名を普通の太さにする。 |
| `items`（必須） | `readonly { datetime: string; time: string; title: string; content?: Child; state?: "complete" \| "current" \| "upcoming"; avatar?: Child; actor?: string; day?: string; kind?: "event" \| "system" \| "gap"; }[]` |              | 出来事。渡した順に並べるので、時系列の順は利用側でそろえる。                                                                        |

ほかに、`<ol>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/timeline.css`、`components/divider.css`

#### `items`の項目

| 名前               | 型                                      | 既定値 | 説明                                                                                                                                                                                                                            |
| ------------------ | --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `datetime`（必須） | `string`                                |        | 機械可読の日時。time要素のdatetimeに入れる。                                                                                                                                                                                    |
| `time`（必須）     | `string`                                |        | 表示する時刻や日付の文。                                                                                                                                                                                                        |
| `title`（必須）    | `string`                                |        | 題名。                                                                                                                                                                                                                          |
| `content`          | `Child`                                 |        | 題名の下に置く中身（本文・添付など）。                                                                                                                                                                                          |
| `state`            | `"complete" \| "current" \| "upcoming"` |        | 節目の状態。`complete`は終えたもの、`current`は今のもの、`upcoming`はこれから。読み上げでは題名の前に「完了：」「進行中：」「予定：」を添え、マーカーと線の描き分けはmilestonesの時だけ行う。                                   |
| `avatar`           | `Child`                                 |        | 出来事を起こした人。線の上のマーカーの代わりにアバターを置く。                                                                                                                                                                  |
| `actor`            | `string`                                |        | 起こした人の名前。題名の前に太字で置き、題名は普通の太さにする。                                                                                                                                                                |
| `day`              | `string`                                |        | この出来事から始まる日の名前（「今日」「9月14日（月）」など）。黒い太字の名前と、縦の線から横へ伸びる帯で日を区切る（中身はDivider）。                                                                                          |
| `kind`             | `"event" \| "system" \| "gap"`          |        | 出来事の種類。`event`は人の出来事。`system`は移動・自動で閉じたなどのシステムの出来事で、淡い灰色の帯の中央に書く。 `gap`は何もなかった期間で、線を破線にし、時刻を出さずに淡い文だけを置く（「60日間、出来事はありません」）。 |

## コード

```tsx
import { Timeline, ActionLink, Avatar } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <section class="rx-stack" data-space="small">
      <h3>変更履歴</h3>
      <Timeline
        label="記事の変更履歴"
        items={[
          {
            datetime: "2026-09-15T11:30:00+09:00",
            time: "11:30",
            day: "今日",
            actor: "森 美咲",
            title: "公開の日を9月28日に決めました",
            avatar: <Avatar name="森 美咲" initials="美" tone="coral" />,
          },
          {
            datetime: "2026-09-15T10:00:00+09:00",
            time: "10:00",
            actor: "田中 遥",
            title: "案内文を更新しました",
            avatar: <Avatar name="田中 遥" initials="遥" />,
            content: <p>利用時間とキャンセル条件を追記しました。</p>,
          },
          {
            datetime: "2026-09-14T15:30:00+09:00",
            time: "15:30",
            day: "9月14日（月）",
            actor: "佐藤 誠",
            title: "添付資料を確認しました",
            avatar: <Avatar name="佐藤 誠" initials="誠" tone="green" />,
            content: <ActionLink href="/apps/files">資料を開く</ActionLink>,
          },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>公開までの節目</h3>
      <Timeline
        label="公開までの節目"
        variant="milestones"
        items={[
          {
            datetime: "2026-09-12",
            time: "9月12日",
            title: "原稿を作成",
            state: "complete",
          },
          {
            datetime: "2026-09-24",
            time: "今日",
            title: "内容を確認",
            state: "current",
          },
          {
            datetime: "2026-09-28",
            time: "9月28日",
            title: "公開する",
            state: "upcoming",
          },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>システムの出来事と何もなかった期間</h3>
      <Timeline
        label="カードの履歴"
        items={[
          {
            datetime: "2026-09-29T09:00:00+09:00",
            time: "9月29日 9:00",
            actor: "田中 遥",
            title: "説明を書き直しました",
            avatar: <Avatar name="田中 遥" initials="遥" />,
          },
          {
            datetime: "2026-07-12",
            time: "7月12日〜9月28日",
            title: "78日間、出来事はありません",
            kind: "gap",
          },
          {
            datetime: "2026-07-11T12:13:00+09:00",
            time: "7月11日 12:13",
            actor: "佐藤 健",
            title: "が「完了」へ移しました",
            kind: "system",
          },
        ]}
      />
    </section>
    <section class="rx-stack" data-space="small">
      <h3>短い変更履歴</h3>
      <Timeline
        label="短い変更履歴"
        variant="compact"
        items={[
          {
            datetime: "2026-09-24T10:00:00+09:00",
            time: "9月24日 10:00",
            title: "本文を更新",
          },
          {
            datetime: "2026-09-24T14:00:00+09:00",
            time: "9月24日 14:00",
            title: "添付資料を差し替え",
          },
        ]}
      />
    </section>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section class="rx-stack" data-space="small">
    <h3>変更履歴</h3>
    <ol
      class="rx-timeline"
      aria-label="記事の変更履歴"
      data-variant="activity"
      data-avatars="true"
    >
      <li class="day">
        <div class="rx-divider"><span>今日</span></div>
      </li>
      <li data-actor="true">
        <span class="marker"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="coral"
            role="img"
            aria-label="森 美咲"
            ><span class="initials">美</span></span
          ></span
        ><time datetime="2026-09-15T11:30:00+09:00">11:30</time>
        <div class="body">
          <p class="title">
            <strong class="actor">森 美咲</strong>公開の日を9月28日に決めました
          </p>
        </div>
      </li>
      <li data-actor="true">
        <span class="marker"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="blue"
            role="img"
            aria-label="田中 遥"
            ><span class="initials">遥</span></span
          ></span
        ><time datetime="2026-09-15T10:00:00+09:00">10:00</time>
        <div class="body">
          <p class="title">
            <strong class="actor">田中 遥</strong>案内文を更新しました
          </p>
          <p>利用時間とキャンセル条件を追記しました。</p>
        </div>
      </li>
      <li class="day">
        <div class="rx-divider"><span>9月14日（月）</span></div>
      </li>
      <li data-actor="true">
        <span class="marker"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="green"
            role="img"
            aria-label="佐藤 誠"
            ><span class="initials">誠</span></span
          ></span
        ><time datetime="2026-09-14T15:30:00+09:00">15:30</time>
        <div class="body">
          <p class="title">
            <strong class="actor">佐藤 誠</strong>添付資料を確認しました
          </p>
          <a
            href="/apps/files"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >資料を開く</a
          >
        </div>
      </li>
    </ol>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>公開までの節目</h3>
    <ol class="rx-timeline" aria-label="公開までの節目" data-variant="milestones">
      <li data-state="complete">
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-09-12">9月12日</time>
        <div class="body">
          <p class="title"><span class="rx-visually-hidden">完了：</span>原稿を作成</p>
        </div>
      </li>
      <li data-state="current">
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-09-24">今日</time>
        <div class="body">
          <p class="title">
            <span class="rx-visually-hidden">進行中：</span>内容を確認
          </p>
        </div>
      </li>
      <li data-state="upcoming">
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-09-28">9月28日</time>
        <div class="body">
          <p class="title"><span class="rx-visually-hidden">予定：</span>公開する</p>
        </div>
      </li>
    </ol>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>システムの出来事と何もなかった期間</h3>
    <ol
      class="rx-timeline"
      aria-label="カードの履歴"
      data-variant="activity"
      data-avatars="true"
    >
      <li data-actor="true">
        <span class="marker"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="blue"
            role="img"
            aria-label="田中 遥"
            ><span class="initials">遥</span></span
          ></span
        ><time datetime="2026-09-29T09:00:00+09:00">9月29日 9:00</time>
        <div class="body">
          <p class="title">
            <strong class="actor">田中 遥</strong>説明を書き直しました
          </p>
        </div>
      </li>
      <li data-kind="gap">
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-07-12">7月12日〜9月28日</time>
        <div class="body"><p class="title">78日間、出来事はありません</p></div>
      </li>
      <li data-actor="true" data-kind="system">
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-07-11T12:13:00+09:00">7月11日 12:13</time>
        <div class="body">
          <p class="title">
            <strong class="actor">佐藤 健</strong>が「完了」へ移しました
          </p>
        </div>
      </li>
    </ol>
  </section>
  <section class="rx-stack" data-space="small">
    <h3>短い変更履歴</h3>
    <ol class="rx-timeline" aria-label="短い変更履歴" data-variant="compact">
      <li>
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-09-24T10:00:00+09:00">9月24日 10:00</time>
        <div class="body"><p class="title">本文を更新</p></div>
      </li>
      <li>
        <span class="marker" aria-hidden="true"></span
        ><time datetime="2026-09-24T14:00:00+09:00">9月24日 14:00</time>
        <div class="body"><p class="title">添付資料を差し替え</p></div>
      </li>
    </ol>
  </section>
</div>
```

</details>
