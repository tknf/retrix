<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Card

関連する内容と操作を一つにまとめます。

## 使いどころ

- 予定・記事・依頼のように、一件の項目を題名・本文・補足と一緒にカードにまとめて表示する時に使います。
- 見出しの帯を持つカードに一覧や属性のまとまりを載せる時は `LayerCard`、作業面の中を区切るだけの時は `Section` を使います。
- 一覧の中の一件を行で見せる時は `DataList` を使います。

## 使い方

`title` は見出しの `h3` になります。`href` を渡すと見出しだけをリンクにし、カード全体をクリック対象にはしません。本文や `footer` に置いたリンク・ボタン・フォームは、見出しのリンクと独立して操作できます。題名は黒い太字で、リンクの題名もふだんは黒いまま置き、ホバーした時だけ赤茶の文字と下線にします。このとき、カードの影も少し遠くまで落とします。

中身は上から `preview`（画像や図）、`eyebrow`（小さな補足）、`title`、本文（`children`）、`footer` の順に積みます。`preview`・`eyebrow`・`footer` は渡した時だけ表示します。カードは1pxの輪郭と浅い影を持つ白いカードで、内側の余白は上下16px・左右20pxです。`eyebrow` は字間を空けた小さな灰色の文字、本文は灰色の文字です。`footer` は小さな茶色の文字で、並べた子の間を点（·）で区切ります（「田中 遥 · 9月15日」）。ボタンと入力欄の前には点を置かず、`class="end"` を付けた子は末尾側へ寄せます。

ルートの `article` に `data-density="compact"` を付けるとカードの余白を上下12px・左右16pxに詰めます。`data-state="complete"` は完了を淡い成功色の背景で示し、`data-state="new"` は現れた時に黄色の太い枠を一度だけ表示して消します（動きを減らす設定では表示しません）。

長い題名や URL はカードの幅で折り返し、カードからはみ出しません。controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。

## アクセシビリティ

- ルートは `article`、題名は `h3` です。ページの見出しの階層に合わない場合は、配置する側で見出しの構成を調整してください。
- リンクは見出しだけに付くので、読み上げではリンクの名前が題名になります。
- `preview` に画像を渡す時は、意味のある画像なら `alt` を、飾りなら空の `alt` を利用側で付けてください。

## API

### Card

リンクは見出しに限定し、本文や末尾のフォーム操作と競合させない。

| 名前            | 型       | 既定値 | 説明                                                                                                                                  |
| --------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `title`（必須） | `string` |        | 見出し（h3）の文字。カードでいちばん強い字にする。                                                                                    |
| `href`          | `string` |        | 見出しをリンクにする移動先。リンクは見出しだけに付け、カード全体や本文の操作には広げない。                                            |
| `footer`        | `Child`  |        | 本文の下に添えるメタ情報（担当者・日付など）や操作。footerとして描き、並べた子は縦の罫線で区切る。`class="end"`の子は末尾側へ寄せる。 |
| `preview`       | `Child`  |        | 見出しの上に置く画像や図。角を丸めて切り取り、imgとsvgは幅いっぱいに広げる。                                                          |
| `eyebrow`       | `Child`  |        | 見出しのすぐ上に置く小さな補足（種類・分類など）。                                                                                    |
| `children`      | `Child`  |        | 本文。段落・Badge・ボタンなど任意の内容を渡せ、題名の下に積む。                                                                       |

ほかに、`<article>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/section.css`、`components/card.css`

## コード

```tsx
import {
  Card,
  Badge,
  Button,
  ActionLink,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-split">
      <Card
        title="仕事場の案内を更新する"
        href="/apps/docs"
        footer={<span>田中 遥 · 9月15日</span>}
      >
        <p>利用時間とキャンセル条件を見直します。</p>
        <Badge tone="info">確認待ち</Badge>
      </Card>
      <Card
        title="秋の読書会"
        href="/apps/schedule"
        eyebrow={<span>イベント</span>}
        footer={<span>9月25日 18:00 · あと4席</span>}
      >
        <p>最近読んだ本を一冊持ち寄って、小さな感想を交換する会です。</p>
        <Badge tone="success">受付中</Badge>
      </Card>
    </div>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="複数段落・内側の操作・長い見出し">
        <Card
          title="初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内"
          href="/apps/docs"
          footer={
            <div class="rx-cluster">
              <ActionLink href="/apps/docs">編集する</ActionLink>
              <Button disabled>公開する</Button>
            </div>
          }
        >
          <p>予約内容を確認してから、受付へお越しください。</p>
          <p>
            公開前に担当者の確認が必要です。内側の操作は見出しリンクと独立しています。
          </p>
        </Card>
      </Disclosure>
      <Disclosure summary="題名だけ・詰めた密度">
        <div class="rx-split">
          <Card title="会議室の鍵を返却する" />
          <Card
            title="備品の貸し出し記録を確認する"
            data-density="compact"
            footer={
              <>
                <span>森 美咲</span>
                <span>9月12日</span>
              </>
            }
          />
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <Card
            title="https://example.com/articles/autumn-reading-club-2026 の公開前確認"
            eyebrow={<span>読書会・お知らせ</span>}
            footer={
              <>
                <span>佐藤 健</span>
                <span>9月14日</span>
              </>
            }
          >
            <p>公開前に担当者と管理者の確認が必要です。</p>
          </Card>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Card
            title="نادي القراءة في الخريف"
            href="/apps/schedule"
            eyebrow={<span>فعالية</span>}
            footer={<span>٢٥ سبتمبر · ٤ مقاعد متبقية</span>}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </Card>
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
    <article class="rx-card">
      <h3 class="title"><a href="/apps/docs">仕事場の案内を更新する</a></h3>
      <div class="body">
        <p>利用時間とキャンセル条件を見直します。</p>
        <span class="rx-badge" data-tone="info">確認待ち</span>
      </div>
      <footer class="meta"><span>田中 遥 · 9月15日</span></footer>
    </article>
    <article class="rx-card">
      <div class="eyebrow"><span>イベント</span></div>
      <h3 class="title"><a href="/apps/schedule">秋の読書会</a></h3>
      <div class="body">
        <p>最近読んだ本を一冊持ち寄って、小さな感想を交換する会です。</p>
        <span class="rx-badge" data-tone="success">受付中</span>
      </div>
      <footer class="meta"><span>9月25日 18:00 · あと4席</span></footer>
    </article>
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
        ><span class="label"
          ><span class="title">複数段落・内側の操作・長い見出し</span></span
        >
      </summary>
      <div class="body">
        <article class="rx-card">
          <h3 class="title">
            <a href="/apps/docs"
              >初めて利用する方に向けた仕事場の予約方法と当日の受付についてのご案内</a
            >
          </h3>
          <div class="body">
            <p>予約内容を確認してから、受付へお越しください。</p>
            <p>
              公開前に担当者の確認が必要です。内側の操作は見出しリンクと独立しています。
            </p>
          </div>
          <footer class="meta">
            <div class="rx-cluster">
              <a
                href="/apps/docs"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >編集する</a
              ><button
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                公開する
              </button>
            </div>
          </footer>
        </article>
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
        ><span class="label"><span class="title">題名だけ・詰めた密度</span></span>
      </summary>
      <div class="body">
        <div class="rx-split">
          <article class="rx-card">
            <h3 class="title">会議室の鍵を返却する</h3>
            <div class="body"></div>
          </article>
          <article data-density="compact" class="rx-card">
            <h3 class="title">備品の貸し出し記録を確認する</h3>
            <div class="body"></div>
            <footer class="meta"><span>森 美咲</span><span>9月12日</span></footer>
          </article>
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 16rem">
          <article class="rx-card">
            <div class="eyebrow"><span>読書会・お知らせ</span></div>
            <h3 class="title">
              https://example.com/articles/autumn-reading-club-2026 の公開前確認
            </h3>
            <div class="body"><p>公開前に担当者と管理者の確認が必要です。</p></div>
            <footer class="meta"><span>佐藤 健</span><span>9月14日</span></footer>
          </article>
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
          <article class="rx-card">
            <div class="eyebrow"><span>فعالية</span></div>
            <h3 class="title"><a href="/apps/schedule">نادي القراءة في الخريف</a></h3>
            <div class="body"><p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p></div>
            <footer class="meta"><span>٢٥ سبتمبر · ٤ مقاعد متبقية</span></footer>
          </article>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
