<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Carousel

関連する内容を1件ずつ表示し、前後に切り替えます。

## 使いどころ

- お知らせや特集など、関連する少数の内容を同じ場所で一枚ずつ読ませる時に使います。
- 全件を見比べる必要がある内容は、隠さずに `Card` を並べるか一覧にします。

## 使い方

`slides` に一枚ずつ `title` と `content` を渡します。各スライドは `Card` として描き、`preview`・`eyebrow`・`footer`・`href` はCardの同じ名前の欄に渡ります。見出しの上には「1 / 3」のように位置を茶色の小さな文字で書きます。

スライドが2件以上ある時だけ前後の操作を置きます。`CarouselController` を `carousel` として登録すると前後へ移れ、最後と最初はつながります。1件では操作を置かず、0件では「表示する項目はありません」の空状態を示します。

`interval` に正のミリ秒を渡すと「自動再生」の操作を置きます。自動送りは利用者がこの操作を押した時だけ始まり、「一時停止」を押すか、中へフォーカスが入ると止まります。

スライドは同じ場所に重ね、枠の高さを一番高いスライドにそろえるので、切り替えても下の内容は動きません。新しいスライドは少し横から滑りながら現れます。前後の操作はアイコンだけの`Button`（31pxの正方形）で、カードの左右の縁をまたいで重なり、配置先の幅が27rem未満ではカードの下に並びます。

JavaScriptがない時は `initialIndex` のスライドだけを表示し、前後の操作は働きません。

## キーボード

| キー          | 動作                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Tab           | 前後の操作・自動再生の操作・スライドの中のリンクへ移ります。中へフォーカスが入ると自動送りを止めます。 |
| Enter / Space | 「前のスライド」「次のスライド」で前後へ移り、「自動再生」「一時停止」で自動送りを切り替えます。       |

## アクセシビリティ

- ルートは `role="group"`・`aria-roledescription="carousel"` で、`label` を名前にします。各スライドは `aria-roledescription="slide"` のまとまりで、「1 / 3: 題名」を名前に持ちます。
- 見えていないスライドは `hidden` にし、読み上げとフォーカスから外します。
- 前後の操作は「前のスライド」「次のスライド」を名前に持つ、アイコンだけのボタンです。
- 自動送りは利用者が選ぶまで始めず、フォーカスが中へ入ると止めます。

## イベント

| イベント                | 内容                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `carousel:beforechange` | 利用者の操作か自動送りでスライドが変わる前に発火します。取り消せます。detailは `index`（移る先）・`previousIndex`・`reason`（`pointer`・`keyboard`・`timer`）です。 |
| `carousel:change`       | スライドが変わった後に、同じdetailで発火します。                                                                                                                    |

## API

### Carousel

見た目はCardへ、切り替えと再生は上流CarouselControllerへ委ねる。

| 名前             | 型                         | 既定値 | 説明                                                                                  |
| ---------------- | -------------------------- | ------ | ------------------------------------------------------------------------------------- |
| `label`（必須）  | `string`                   |        | まとまりの名前。ルートのaria-labelにする。                                            |
| `slides`（必須） | `readonly CarouselSlide[]` |        | 並べるスライド。2件以上で前後の操作を置き、1件では操作を置かず、0件では空状態を示す。 |
| `initialIndex`   | `number`                   | `0`    | 最初に見せるスライドの位置（0から数える）。範囲外や整数でない値は0として扱う。        |
| `interval`       | `number`                   | `0`    | 0は自動送り操作なし。正の値では利用者が再生を選ぶまで停止する。                       |

ほかに、`<section>`へ標準のHTML属性を渡せます。

登録するcontroller：`carousel`（`CarouselController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/empty-state.css`、`components/carousel.css`、`components/icon.css`、`components/card.css`

#### `CarouselSlide`

一枚のスライド。Cardとして描く。

| 名前              | 型       | 既定値 | 説明                                                                |
| ----------------- | -------- | ------ | ------------------------------------------------------------------- |
| `title`（必須）   | `string` |        | スライドの見出し。読み上げのスライド名「n / 全件: title」にも使う。 |
| `content`（必須） | `Child`  |        | スライドの本文。                                                    |
| `preview`         | `Child`  |        | 本文の横に置く画像など。狭い幅では本文の上に積む。                  |
| `eyebrow`         | `Child`  |        | 見出しの上の小さな行。「n / 全件」の位置の後ろに並べる。            |
| `footer`          | `Child`  |        | 本文の下に淡い文字で添える日付などの補足。                          |
| `href`            | `string` |        | 渡すと見出しをリンクにする。                                        |

## コード

```tsx
import { Carousel, ImageFrame, Tag } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Carousel
      label="編集部からのお知らせ"
      interval={5000}
      slides={[
        {
          title: "暮らしの記録を公開しました",
          eyebrow: <Tag label="新着" accent="blue" />,
          preview: (
            <ImageFrame src="/assets/sample-cover.svg" alt="暮らしの記録 2026の表紙" />
          ),
          content: <p>日々の仕事と暮らしを記録した、新しい読み物を公開しました。</p>,
          footer: <span>2026年9月24日</span>,
        },
        {
          title: "公開までの準備について",
          content: (
            <p>
              読み手が必要な情報に迷わずたどり着けるよう、原稿、関連資料、公開日時を順に確認します。
              画像がない場合でも見出しと本文の関係が崩れない構成です。
            </p>
          ),
          footer: <span>原稿・資料・日時</span>,
        },
        {
          title: "次の更新予定",
          content: <p>次回の更新に向けて、寄せられた意見を整理しています。</p>,
        },
      ]}
    />
    <Carousel
      label="お知らせが一件の例"
      slides={[
        {
          title: "公開準備中",
          content: <p>項目が一件のときは切り替え操作を表示しません。</p>,
        },
      ]}
    />
    <Carousel label="お知らせがない例" slides={[]} />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section
    class="rx-carousel"
    role="group"
    aria-roledescription="carousel"
    aria-label="編集部からのお知らせ"
    data-controller="carousel"
    data-carousel-index-value="0"
    data-carousel-interval-value="5000"
    data-state="paused"
  >
    <div class="viewport">
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="1 / 3: 暮らしの記録を公開しました"
        data-carousel-target="slide"
        data-state="active"
      >
        <article class="rx-card">
          <div class="preview">
            <figure class="rx-image-frame" data-shape="portrait" data-fit="contain">
              <div class="image">
                <img
                  src="/assets/sample-cover.svg"
                  alt="暮らしの記録 2026の表紙"
                  loading="lazy"
                />
              </div>
            </figure>
          </div>
          <div class="eyebrow">
            <span class="position">1 / 3</span
            ><span class="rx-tag" data-accent="blue">新着</span>
          </div>
          <h3 class="title">暮らしの記録を公開しました</h3>
          <div class="body">
            <p>日々の仕事と暮らしを記録した、新しい読み物を公開しました。</p>
          </div>
          <footer class="meta"><span>2026年9月24日</span></footer>
        </article>
      </div>
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="2 / 3: 公開までの準備について"
        data-carousel-target="slide"
        data-state="inactive"
        hidden=""
      >
        <article class="rx-card">
          <div class="eyebrow"><span class="position">2 / 3</span></div>
          <h3 class="title">公開までの準備について</h3>
          <div class="body">
            <p>
              読み手が必要な情報に迷わずたどり着けるよう、原稿、関連資料、公開日時を順に確認します。
              画像がない場合でも見出しと本文の関係が崩れない構成です。
            </p>
          </div>
          <footer class="meta"><span>原稿・資料・日時</span></footer>
        </article>
      </div>
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="3 / 3: 次の更新予定"
        data-carousel-target="slide"
        data-state="inactive"
        hidden=""
      >
        <article class="rx-card">
          <div class="eyebrow"><span class="position">3 / 3</span></div>
          <h3 class="title">次の更新予定</h3>
          <div class="body">
            <p>次回の更新に向けて、寄せられた意見を整理しています。</p>
          </div>
        </article>
      </div>
    </div>
    <div class="controls" role="group" aria-label="スライド操作">
      <span class="step previous"
        ><button
          aria-label="前のスライド"
          data-icon-only="true"
          data-carousel-target="previous"
          class="rx-button previous"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use>
          </svg></button></span
      ><span class="step next"
        ><button
          aria-label="次のスライド"
          data-icon-only="true"
          data-carousel-target="next"
          class="rx-button next"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-arrow"></use>
          </svg></button></span
      ><button
        data-carousel-target="play"
        data-state="paused"
        class="rx-button rotation"
        type="button"
        data-variant="secondary"
        data-size="default"
      >
        <span class="play-label">自動再生</span
        ><span class="pause-label">一時停止</span>
      </button>
    </div>
  </section>
  <section class="rx-carousel" role="group" aria-label="お知らせが一件の例">
    <div class="viewport">
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="1 / 1: 公開準備中"
        data-state="active"
      >
        <article class="rx-card">
          <div class="eyebrow"><span class="position">1 / 1</span></div>
          <h3 class="title">公開準備中</h3>
          <div class="body"><p>項目が一件のときは切り替え操作を表示しません。</p></div>
        </article>
      </div>
    </div>
  </section>
  <section class="rx-carousel" role="group" aria-label="お知らせがない例">
    <section class="rx-empty-state" data-kind="empty">
      <div class="slip">
        <h3 class="title">表示する項目はありません</h3>
        <div class="body"></div>
      </div>
    </section>
  </section>
</div>
```

</details>
