<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# SplitView

一覧と本文、作業と補足を並べて表示します。

## 使いどころ

- 一覧と、その中で選んだ一件の本文を並べる時は`layout="reader"`を使います。
- 作業の本体と、その値や状態の補足を並べる時は`layout="inspector"`を使います。
- 作業面の左右に開閉できる補助パネルを付ける時は`Wing`、同じ場所で中身を切り替える時は`Tabs`を使います。

## 使い方

`primary`・`secondary`を渡します。DOMの読み順は常に`primary`、`secondary`の順です。二つの領域は一枚の面に並べ、境目に罫線を一本引きます。

`SplitView`自身の幅が52rem以上で左右に並べます。`inspector`は`primary`を広く（おおよそ2:1）、`reader`は`primary`を狭く（おおよそ3:5）取ります。52rem未満では`primary`を上、`secondary`を下に積み、境目の罫線は横になります。

`resizable`を指定し、`SplitterController`を`splitter`として登録すると、境目にハンドルを出します。ハンドルのドラッグと矢印キーで、`primary`の幅を全体の20〜80%の間で変えられます。初めの幅は`initialSize`で決めます。幅を変えられるのは左右に並べた時だけです。

利用者が幅を変えると`splitter:beforechange`、続けて`splitter:change`を発火します。ドラッグは離した時に一度だけ発火します。幅を覚えておく時は、`splitter:change`の`detail.value`を利用側で保存し、次の描画で`initialSize`に渡します。

JavaScriptなしではハンドルを出さず、`layout`の比率で並べます。

## キーボード

| キー       | 動作                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| ← / →      | ハンドルで、`primary`の幅を1%ずつ狭く・広くします。右から左へ書く言語では向きが逆になります。 |
| Home / End | ハンドルで、`primary`を最小（20%）・最大（80%）の幅にします。                                 |
| Enter      | ハンドルで、`primary`を最小の幅にします。もう一度押すと元の幅に戻します。                     |

## アクセシビリティ

- ハンドルは`role="separator"`・`aria-orientation="vertical"`で、「領域の幅を調整」という読み上げ名と、`primary`の領域を指す`aria-controls`を持ちます。今の幅はcontrollerが`aria-valuenow`・`aria-valuemin`・`aria-valuemax`で伝えます。
- controllerが使う幅の範囲入力（「主領域の幅」）を、見た目からは隠して置きます。

## イベント

| イベント                | 内容                                                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `splitter:beforechange` | 利用者が幅を変える直前に発火します。`detail`は`value`（新しい幅の%）・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと元の幅に戻します。 |
| `splitter:change`       | 幅を変えた後に発火します。`detail`は`splitter:beforechange`と同じです。                                                                                        |

## API

### SplitView

inspectorは作業＋補足、readerは一覧＋本文。DOMの読み順は常にprimaryが先。

| 名前                | 型                        | 既定値                          | 説明                                                                                                                                                              |
| ------------------- | ------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | `string`                  |                                 | ルートのid。省略すると自動で作り、ハンドルと`primary`の領域、幅の入力の関連付けに使います。                                                                       |
| `primary`（必須）   | `Child`                   |                                 | 先に読む領域。広い配置では先頭側、狭い配置では上に置く。                                                                                                          |
| `secondary`（必須） | `Child`                   |                                 | 後に読む領域。広い配置では末尾側、狭い配置では下に置く。                                                                                                          |
| `layout`            | `"inspector" \| "reader"` | `"inspector"`                   | inspectorはprimaryを広く取る作業＋補足、readerはprimaryを狭く取る一覧＋本文。                                                                                     |
| `resizable`         | `boolean`                 | `false`                         | 境目にハンドルを置き、ドラッグと矢印キーで幅を変えられるようにする。 SplitterControllerをsplitterとして登録した時だけ働き、未接続ではlayoutの固定の比率で並べる。 |
| `initialSize`       | `number`                  | `layout === "reader" ? 38 : 68` | resizableの時のprimaryの幅の初期値。全体に対する百分率で、20〜80の範囲に収める。既定はreaderで38、inspectorで68。                                                 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`splitter`（`SplitterController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/split-view.css`

## コード

```tsx
import {
  SplitView,
  Section,
  Tag,
  Badge,
  ValueList,
  MessageList,
  Avatar,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const draft = (
  <Section title="公開案内の原稿">
    <p>新しい利用案内を公開します。本文、リンク先、添付資料を確認してください。</p>
    <p>内容を確定した後、公開日時を設定します。</p>
  </Section>
);

const status = (
  <Section title="確認状況">
    <div class="rx-cluster">
      <Tag label="確認中" accent="amber" />
      <span>担当：田中 遥</span>
    </div>
    <p>添付資料：2件</p>
  </Section>
);

export default () => (
  <div class="rx-stack">
    <SplitView layout="inspector" resizable primary={draft} secondary={status} />
    <DisclosureGroup label="配置と中身の違い">
      <Disclosure summary="一覧と本文（reader）：左の一覧を読みながら右で開く" open>
        <SplitView
          layout="reader"
          resizable
          primary={
            <MessageList
              label="受信した連絡"
              items={[
                {
                  id: "split-categories",
                  sender: "森 美咲",
                  title: "カテゴリ案をまとめました",
                  preview: "5つのカテゴリに整理しました。",
                  href: "/apps/inbox/categories",
                  time: "10:24",
                  unread: true,
                  current: true,
                  avatar: (
                    <Avatar name="森 美咲" initials="美" tone="green" size="small" />
                  ),
                },
                {
                  id: "split-meeting",
                  sender: "佐藤 健",
                  title: "来週の打ち合わせについて",
                  preview: "火曜日14時からはいかがでしょうか。",
                  href: "/apps/inbox/meeting",
                  time: "9:42",
                  avatar: (
                    <Avatar name="佐藤 健" initials="健" tone="blue" size="small" />
                  ),
                },
              ]}
            />
          }
          secondary={
            <Section title="カテゴリ案をまとめました">
              <p>
                5つのカテゴリに整理しました。実際の記事を入れて試してみませんか。一覧で選んだ連絡は、右の面で開きます。
              </p>
            </Section>
          }
        />
      </Disclosure>
      <Disclosure summary="幅を変えない：作業と、その値の一覧">
        <SplitView
          layout="inspector"
          primary={draft}
          secondary={
            <ValueList
              items={[
                { label: "公開状態", value: <Badge tone="info">確認待ち</Badge> },
                { label: "担当者", value: "田中 遥" },
                { label: "公開予定", value: "9月30日" },
              ]}
            />
          }
        />
      </Disclosure>
      <Disclosure summary="長い本文：面の高さは長い側にそろう">
        <SplitView
          layout="inspector"
          resizable
          initialSize={60}
          primary={
            <Section title="利用規約の改訂">
              <p>
                予約の取り消しは前日までを無料とし、当日の変更は受付で相談できるようにします。会議室の利用時間は、予約した時間の5分前から鍵をお渡しします。
              </p>
              <p>
                初めての方は入口右手の窓口で名前をお伝えください。長期利用の方は、月初めに利用票を提出してください。利用票は受付と、このページの添付資料から受け取れます。
              </p>
              <p>
                改訂は10月1日から適用します。それまでに受け付けた予約は、改訂前の条件のまま扱います。
              </p>
            </Section>
          }
          secondary={status}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：上下に積み、境目の罫線は横になる">
        <div style="max-inline-size: 28rem">
          <SplitView layout="inspector" resizable primary={draft} secondary={status} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <SplitView
            layout="inspector"
            resizable
            primary={
              <Section title="المسودة">
                <p>راجع النص والروابط والمرفقات قبل النشر.</p>
              </Section>
            }
            secondary={
              <Section title="الحالة">
                <p>قيد المراجعة</p>
              </Section>
            }
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
    id="rx-split-view-:r2:"
    class="rx-split-view"
    data-layout="inspector"
    data-resizable="true"
    data-controller="splitter"
    data-splitter-value-value="68"
    data-splitter-min-value="20"
    data-splitter-max-value="80"
    data-splitter-orientation-value="vertical"
  >
    <div class="panes">
      <div
        class="primary"
        id="rx-split-view-:r2:-primary"
        data-splitter-target="primary"
      >
        <section class="rx-section" data-tone="neutral">
          <header class="heading"><h2>公開案内の原稿</h2></header>
          <p>
            新しい利用案内を公開します。本文、リンク先、添付資料を確認してください。
          </p>
          <p>内容を確定した後、公開日時を設定します。</p>
        </section>
      </div>
      <div
        class="handle"
        role="separator"
        tabindex="0"
        aria-label="領域の幅を調整"
        aria-controls="rx-split-view-:r2:-primary"
        aria-orientation="vertical"
        data-splitter-target="handle"
      >
        <span class="grip" aria-hidden="true"></span>
      </div>
      <div class="secondary">
        <section class="rx-section" data-tone="neutral">
          <header class="heading"><h2>確認状況</h2></header>
          <div class="rx-cluster">
            <span class="rx-tag" data-accent="amber">確認中</span
            ><span>担当：田中 遥</span>
          </div>
          <p>添付資料：2件</p>
        </section>
      </div>
    </div>
    <div class="size-control rx-visually-hidden">
      <label for="rx-split-view-:r2:-size">主領域の幅</label
      ><input
        id="rx-split-view-:r2:-size"
        type="range"
        min="20"
        max="80"
        value="68"
        data-splitter-target="range"
      />
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="配置と中身の違い">
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
          ><span class="title"
            >一覧と本文（reader）：左の一覧を読みながら右で開く</span
          ></span
        >
      </summary>
      <div class="body">
        <div
          id="rx-split-view-:r3:"
          class="rx-split-view"
          data-layout="reader"
          data-resizable="true"
          data-controller="splitter"
          data-splitter-value-value="38"
          data-splitter-min-value="20"
          data-splitter-max-value="80"
          data-splitter-orientation-value="vertical"
        >
          <div class="panes">
            <div
              class="primary"
              id="rx-split-view-:r3:-primary"
              data-splitter-target="primary"
            >
              <ul
                class="rx-message-list"
                aria-label="受信した連絡"
                data-state="ready"
                data-avatars="true"
                data-preview-lines="1"
              >
                <li class="state" data-empty="true">
                  <div role="status">
                    <section class="rx-empty-state" data-kind="empty">
                      <div class="slip">
                        <h3 class="title">連絡はまだありません</h3>
                        <div class="body"></div>
                      </div>
                    </section>
                  </div>
                </li>
                <li
                  data-message-id="split-categories"
                  data-unread="true"
                  data-current="true"
                >
                  <a class="row" href="/apps/inbox/categories" aria-current="page"
                    ><span class="avatar" aria-hidden="true"
                      ><span
                        class="rx-avatar"
                        data-size="small"
                        data-tone="green"
                        role="img"
                        aria-label="森 美咲"
                        ><span class="initials">美</span></span
                      ></span
                    ><span class="body"
                      ><strong class="title"
                        ><span class="subject">カテゴリ案をまとめました</span></strong
                      ><span class="summary"
                        ><span class="sender">森 美咲</span
                        ><span class="preview"
                          >5つのカテゴリに整理しました。</span
                        ></span
                      ></span
                    ><span class="meta"
                      ><span>10:24</span
                      ><span class="unread"
                        ><span class="rx-visually-hidden">未読</span></span
                      ></span
                    ></a
                  >
                </li>
                <li data-message-id="split-meeting" data-unread="false">
                  <a class="row" href="/apps/inbox/meeting"
                    ><span class="avatar" aria-hidden="true"
                      ><span
                        class="rx-avatar"
                        data-size="small"
                        data-tone="blue"
                        role="img"
                        aria-label="佐藤 健"
                        ><span class="initials">健</span></span
                      ></span
                    ><span class="body"
                      ><strong class="title"
                        ><span class="subject">来週の打ち合わせについて</span></strong
                      ><span class="summary"
                        ><span class="sender">佐藤 健</span
                        ><span class="preview"
                          >火曜日14時からはいかがでしょうか。</span
                        ></span
                      ></span
                    ><span class="meta"
                      ><span>9:42</span
                      ><span class="unread" hidden=""
                        ><span class="rx-visually-hidden">未読</span></span
                      ></span
                    ></a
                  >
                </li>
              </ul>
            </div>
            <div
              class="handle"
              role="separator"
              tabindex="0"
              aria-label="領域の幅を調整"
              aria-controls="rx-split-view-:r3:-primary"
              aria-orientation="vertical"
              data-splitter-target="handle"
            >
              <span class="grip" aria-hidden="true"></span>
            </div>
            <div class="secondary">
              <section class="rx-section" data-tone="neutral">
                <header class="heading"><h2>カテゴリ案をまとめました</h2></header>
                <p>
                  5つのカテゴリに整理しました。実際の記事を入れて試してみませんか。一覧で選んだ連絡は、右の面で開きます。
                </p>
              </section>
            </div>
          </div>
          <div class="size-control rx-visually-hidden">
            <label for="rx-split-view-:r3:-size">主領域の幅</label
            ><input
              id="rx-split-view-:r3:-size"
              type="range"
              min="20"
              max="80"
              value="38"
              data-splitter-target="range"
            />
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
        ><span class="label"
          ><span class="title">幅を変えない：作業と、その値の一覧</span></span
        >
      </summary>
      <div class="body">
        <div id="rx-split-view-:r4:" class="rx-split-view" data-layout="inspector">
          <div class="panes">
            <div class="primary" id="rx-split-view-:r4:-primary">
              <section class="rx-section" data-tone="neutral">
                <header class="heading"><h2>公開案内の原稿</h2></header>
                <p>
                  新しい利用案内を公開します。本文、リンク先、添付資料を確認してください。
                </p>
                <p>内容を確定した後、公開日時を設定します。</p>
              </section>
            </div>
            <div class="secondary">
              <dl class="rx-value-list">
                <div>
                  <dt>公開状態</dt>
                  <dd><span class="rx-badge" data-tone="info">確認待ち</span></dd>
                </div>
                <div>
                  <dt>担当者</dt>
                  <dd>田中 遥</dd>
                </div>
                <div>
                  <dt>公開予定</dt>
                  <dd>9月30日</dd>
                </div>
              </dl>
            </div>
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
        ><span class="label"
          ><span class="title">長い本文：面の高さは長い側にそろう</span></span
        >
      </summary>
      <div class="body">
        <div
          id="rx-split-view-:r5:"
          class="rx-split-view"
          data-layout="inspector"
          data-resizable="true"
          data-controller="splitter"
          data-splitter-value-value="60"
          data-splitter-min-value="20"
          data-splitter-max-value="80"
          data-splitter-orientation-value="vertical"
        >
          <div class="panes">
            <div
              class="primary"
              id="rx-split-view-:r5:-primary"
              data-splitter-target="primary"
            >
              <section class="rx-section" data-tone="neutral">
                <header class="heading"><h2>利用規約の改訂</h2></header>
                <p>
                  予約の取り消しは前日までを無料とし、当日の変更は受付で相談できるようにします。会議室の利用時間は、予約した時間の5分前から鍵をお渡しします。
                </p>
                <p>
                  初めての方は入口右手の窓口で名前をお伝えください。長期利用の方は、月初めに利用票を提出してください。利用票は受付と、このページの添付資料から受け取れます。
                </p>
                <p>
                  改訂は10月1日から適用します。それまでに受け付けた予約は、改訂前の条件のまま扱います。
                </p>
              </section>
            </div>
            <div
              class="handle"
              role="separator"
              tabindex="0"
              aria-label="領域の幅を調整"
              aria-controls="rx-split-view-:r5:-primary"
              aria-orientation="vertical"
              data-splitter-target="handle"
            >
              <span class="grip" aria-hidden="true"></span>
            </div>
            <div class="secondary">
              <section class="rx-section" data-tone="neutral">
                <header class="heading"><h2>確認状況</h2></header>
                <div class="rx-cluster">
                  <span class="rx-tag" data-accent="amber">確認中</span
                  ><span>担当：田中 遥</span>
                </div>
                <p>添付資料：2件</p>
              </section>
            </div>
          </div>
          <div class="size-control rx-visually-hidden">
            <label for="rx-split-view-:r5:-size">主領域の幅</label
            ><input
              id="rx-split-view-:r5:-size"
              type="range"
              min="20"
              max="80"
              value="60"
              data-splitter-target="range"
            />
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
        ><span class="label"
          ><span class="title">狭い場所：上下に積み、境目の罫線は横になる</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 28rem">
          <div
            id="rx-split-view-:r6:"
            class="rx-split-view"
            data-layout="inspector"
            data-resizable="true"
            data-controller="splitter"
            data-splitter-value-value="68"
            data-splitter-min-value="20"
            data-splitter-max-value="80"
            data-splitter-orientation-value="vertical"
          >
            <div class="panes">
              <div
                class="primary"
                id="rx-split-view-:r6:-primary"
                data-splitter-target="primary"
              >
                <section class="rx-section" data-tone="neutral">
                  <header class="heading"><h2>公開案内の原稿</h2></header>
                  <p>
                    新しい利用案内を公開します。本文、リンク先、添付資料を確認してください。
                  </p>
                  <p>内容を確定した後、公開日時を設定します。</p>
                </section>
              </div>
              <div
                class="handle"
                role="separator"
                tabindex="0"
                aria-label="領域の幅を調整"
                aria-controls="rx-split-view-:r6:-primary"
                aria-orientation="vertical"
                data-splitter-target="handle"
              >
                <span class="grip" aria-hidden="true"></span>
              </div>
              <div class="secondary">
                <section class="rx-section" data-tone="neutral">
                  <header class="heading"><h2>確認状況</h2></header>
                  <div class="rx-cluster">
                    <span class="rx-tag" data-accent="amber">確認中</span
                    ><span>担当：田中 遥</span>
                  </div>
                  <p>添付資料：2件</p>
                </section>
              </div>
            </div>
            <div class="size-control rx-visually-hidden">
              <label for="rx-split-view-:r6:-size">主領域の幅</label
              ><input
                id="rx-split-view-:r6:-size"
                type="range"
                min="20"
                max="80"
                value="68"
                data-splitter-target="range"
              />
            </div>
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
            id="rx-split-view-:r7:"
            class="rx-split-view"
            data-layout="inspector"
            data-resizable="true"
            data-controller="splitter"
            data-splitter-value-value="68"
            data-splitter-min-value="20"
            data-splitter-max-value="80"
            data-splitter-orientation-value="vertical"
          >
            <div class="panes">
              <div
                class="primary"
                id="rx-split-view-:r7:-primary"
                data-splitter-target="primary"
              >
                <section class="rx-section" data-tone="neutral">
                  <header class="heading"><h2>المسودة</h2></header>
                  <p>راجع النص والروابط والمرفقات قبل النشر.</p>
                </section>
              </div>
              <div
                class="handle"
                role="separator"
                tabindex="0"
                aria-label="領域の幅を調整"
                aria-controls="rx-split-view-:r7:-primary"
                aria-orientation="vertical"
                data-splitter-target="handle"
              >
                <span class="grip" aria-hidden="true"></span>
              </div>
              <div class="secondary">
                <section class="rx-section" data-tone="neutral">
                  <header class="heading"><h2>الحالة</h2></header>
                  <p>قيد المراجعة</p>
                </section>
              </div>
            </div>
            <div class="size-control rx-visually-hidden">
              <label for="rx-split-view-:r7:-size">主領域の幅</label
              ><input
                id="rx-split-view-:r7:-size"
                type="range"
                min="20"
                max="80"
                value="68"
                data-splitter-target="range"
              />
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
