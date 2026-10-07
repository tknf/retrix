<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# LayerCard

見出しを淡い青の層に置き、内容を白いカードに載せます。

## 使いどころ

- 一覧や属性のまとまりに見出しを付ける時に使います。見出しをカードの外に置くので、題名が中身と同じ面で競いません。
- 一件の物として題名・本文・補足を見せる時は `Card`、作業面の中を区切るだけの時は `Section` を使います。
- `DataList`・`ActionList`・`ValueList` を一つだけ載せる置き場所に向いています。コードを見せる時は、この形を内側で使う `CodeBlock` を使います。

## 使い方

`title` は淡い青の沈んだ層に濃い色の太字の `h3` で置き、`children` は層の上に載せた白いカードに入れます。`actions` には `ActionLink` や `Button` を渡し、見出しの行の末尾側に置きます。

題名が折り返しても操作は一行目に残り、題名の幅が8remを割る時（狭い層や大きな文字）だけ操作を次の行へ送ります。操作の有無でカードの位置は変わりません。幅が24rem未満の層では、カードの内側と題名の書き始めを一緒に詰めます。

カードの端に接する行の `DataList`・`ActionList` は、始まりと終わりの罫線をカードの端に任せ、カードの上下の余白も狭めます。一覧だけを載せた時は行の題名を層の見出しと同じ書き始めにそろえます。コードを載せる時は `CodeBlock` を使います（`CodeBlock` は内側でLayerCardを使い、カードの余白とスクロールをコードの面に任せます）。タイルに並べた `ActionList`（`layout="grid"`）は対象外です。

controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。

## アクセシビリティ

- ルートは `section`、題名は `h3` です。`section` は名前を持たないので、ランドマークとして扱わせたい時は、利用側で `aria-label` を渡してください。
- 中身に一覧を載せる時は、一覧自身にも名前（`aria-label` など）を付けてください。

## API

### LayerCard

見出しを淡い背景の層に置き、中身を一段上の白いカードに載せる。見出しをカードの中に書かないので、題名が中身と競わない。

| 名前            | 型       | 既定値 | 説明                                                                                                                         |
| --------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `title`（必須） | `string` |        | 淡い層に置く見出し（h3）の文字。濃い色の太字にする。                                                                         |
| `actions`       | `Child`  |        | 見出しの行の末尾側に置く操作（ActionLinkやButton）。題名が折り返しても一行目に残し、題名の幅が8remを割る時だけ次の行へ送る。 |
| `children`      | `Child`  |        | カードに載せる中身。一覧・属性・段落など任意の内容を渡せる。                                                                 |

ほかに、`<section>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/layer-card.css`

## コード

```tsx
import {
  LayerCard,
  Card,
  ValueList,
  DataList,
  Badge,
  ActionLink,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-split">
      <LayerCard
        title="今週の予約"
        actions={<ActionLink href="/apps/schedule">すべて見る</ActionLink>}
      >
        <DataList
          aria-label="今週の予約"
          items={[
            {
              title: "秋の読書会",
              href: "/apps/schedule",
              meta: "9月25日 18:00 · 8名",
              end: <Badge tone="success">確定</Badge>,
            },
            {
              title: "仕事場の見学",
              href: "/apps/schedule",
              meta: "9月26日 10:00 · 2名",
              end: <Badge tone="info">確認待ち</Badge>,
            },
          ]}
        />
      </LayerCard>
      <LayerCard title="予約の内容">
        <ValueList
          items={[
            { label: "部屋", value: "中会議室" },
            {
              label: "日時",
              value: (
                <time datetime="2026-09-25T18:00:00+09:00">9月25日 18:00〜20:00</time>
              ),
            },
            { label: "人数", value: "8名" },
          ]}
        />
      </LayerCard>
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="Cardと並べる">
        <div class="rx-split">
          <Card title="次にすること">
            <p>
              見出しをカードの中に書くと、題名と中身が同じ面に並び、区別しにくくなります。
            </p>
          </Card>
          <LayerCard title="次にすること">
            <p>見出しを層に置くと、カードの中は中身だけになります。</p>
          </LayerCard>
        </div>
      </Disclosure>
      <Disclosure summary="本文の段落・長い見出し">
        <LayerCard title="初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内">
          <p>予約内容を確認してから、受付へお越しください。</p>
          <p>公開前に担当者の確認が必要です。</p>
        </LayerCard>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <LayerCard
            title="https://example.com/articles/autumn-reading-club-2026 の公開前確認"
            actions={<ActionLink href="/apps/docs">開く</ActionLink>}
          >
            <p>公開前に担当者と管理者の確認が必要です。</p>
          </LayerCard>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <LayerCard
            title="نادي القراءة في الخريف"
            actions={<ActionLink href="/apps/schedule">عرض الكل</ActionLink>}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </LayerCard>
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
  <div class="rx-split">
    <section class="rx-layer-card">
      <header class="heading">
        <h3 class="title">今週の予約</h3>
        <div class="actions">
          <a
            href="/apps/schedule"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            >すべて見る</a
          >
        </div>
      </header>
      <div class="body">
        <ul aria-label="今週の予約" class="rx-data-list">
          <li>
            <div class="body">
              <a class="title" href="/apps/schedule">秋の読書会</a>
              <div class="meta">9月25日 18:00 · 8名</div>
            </div>
            <div class="end">
              <span class="rx-badge" data-tone="success">確定</span>
            </div>
          </li>
          <li>
            <div class="body">
              <a class="title" href="/apps/schedule">仕事場の見学</a>
              <div class="meta">9月26日 10:00 · 2名</div>
            </div>
            <div class="end">
              <span class="rx-badge" data-tone="info">確認待ち</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="rx-layer-card">
      <header class="heading"><h3 class="title">予約の内容</h3></header>
      <div class="body">
        <dl class="rx-value-list">
          <div>
            <dt>部屋</dt>
            <dd>中会議室</dd>
          </div>
          <div>
            <dt>日時</dt>
            <dd>
              <time datetime="2026-09-25T18:00:00+09:00">9月25日 18:00〜20:00</time>
            </dd>
          </div>
          <div>
            <dt>人数</dt>
            <dd>8名</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="内容と置き場所の違い">
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
        ><span class="label"><span class="title">Cardと並べる</span></span>
      </summary>
      <div class="body">
        <div class="rx-split">
          <article class="rx-card">
            <h3 class="title">次にすること</h3>
            <div class="body">
              <p>
                見出しをカードの中に書くと、題名と中身が同じ面に並び、区別しにくくなります。
              </p>
            </div>
          </article>
          <section class="rx-layer-card">
            <header class="heading"><h3 class="title">次にすること</h3></header>
            <div class="body">
              <p>見出しを層に置くと、カードの中は中身だけになります。</p>
            </div>
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
        ><span class="label"><span class="title">本文の段落・長い見出し</span></span>
      </summary>
      <div class="body">
        <section class="rx-layer-card">
          <header class="heading">
            <h3 class="title">
              初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内
            </h3>
          </header>
          <div class="body">
            <p>予約内容を確認してから、受付へお越しください。</p>
            <p>公開前に担当者の確認が必要です。</p>
          </div>
        </section>
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
          <section class="rx-layer-card">
            <header class="heading">
              <h3 class="title">
                https://example.com/articles/autumn-reading-club-2026 の公開前確認
              </h3>
              <div class="actions">
                <a
                  href="/apps/docs"
                  class="rx-button"
                  data-variant="secondary"
                  data-size="default"
                  >開く</a
                >
              </div>
            </header>
            <div class="body"><p>公開前に担当者と管理者の確認が必要です。</p></div>
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <section class="rx-layer-card">
            <header class="heading">
              <h3 class="title">نادي القراءة في الخريف</h3>
              <div class="actions">
                <a
                  href="/apps/schedule"
                  class="rx-button"
                  data-variant="secondary"
                  data-size="default"
                  >عرض الكل</a
                >
              </div>
            </header>
            <div class="body"><p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p></div>
          </section>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
