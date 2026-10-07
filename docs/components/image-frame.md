<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ImageFrame

縦横比を保って画像を表示します。

## 使いどころ

- ファイルの縮小や表紙など、比率をそろえて画像を並べる時に使います。
- 画像を名前と状態のある一件として示す時は `FileItem`、切り抜く範囲を調整させる時は `ImageCropper`、人の写真は `Avatar` を使います。

## 使い方

`src` と `alt` を渡します。`caption` に名前、`meta` に大きさや日付を渡すと、画像の下に中央そろえで書きます。名前は12pxの黒い太字、`meta` は11pxの灰色の文字です。

`shape` で枠の比率を決めます。`portrait` は5:7、`square` は1:1で、どちらも幅8remまで、`landscape` は16:9で幅16remまで広がります。比率の枠は並べた時の位置をそろえるためだけに使い、色を持ちません。

画像は1px `#cccccc` の枠で囲み、影は付けません。`fit="contain"` は画像全体を枠の中央に置き、枠を画像そのものに沿わせます。`fit="cover"` は枠いっぱいに切り抜き、枠も比率の枠に沿わせます。角丸は付けません。

`src` が無い時は、罫線の輪郭を付けた淡い灰色の面に `missingLabel` を11pxの灰色の文字で書いて、画像の場所を示します。

画像は `loading="lazy"` で読み込みます。JavaScriptは使いません。

## アクセシビリティ

- ルートは `figure` で、`caption` と `meta` は `figcaption` になります。
- `alt` は画像の代替テキストです。画像が無い時は「`alt`：`missingLabel`」を `role="img"` の名前として読み上げます。

## API

### ImageFrame

| 名前           | 型                                      | 既定値       | 説明                                                                                         |
| -------------- | --------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `src`          | `string`                                |              | 画像のURL。渡さなければ淡い背景にmissingLabelを置いて、画像がないことを示す。                |
| `alt`（必須）  | `string`                                |              | 画像の代替テキスト。画像がない時は「alt：missingLabel」を読み上げる。                        |
| `shape`        | `"portrait" \| "square" \| "landscape"` | `"portrait"` | 枠の比率。portraitは5:7で幅8remまで、squareは1:1で幅8remまで、landscapeは16:9で幅16remまで。 |
| `fit`          | `"contain" \| "cover"`                  | `"contain"`  | containは画像全体を枠の中央に収め、coverは枠いっぱいに切り抜く。                             |
| `missingLabel` | `string`                                | `"画像なし"` | 画像がない時に枠に書く文言。                                                                 |
| `caption`      | `string`                                |              | 画像の下に中央そろえで書く名前（ファイル名など）。                                           |
| `meta`         | `string`                                |              | 名前の下に灰色の小さな文字で添えるサイズや日付。                                             |

ほかに、`<figure>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/image-frame.css`

## コード

```tsx
import { ImageFrame, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <ImageFrame
        src="/assets/sample-photo.svg"
        alt="窓辺の机の写真"
        shape="square"
        caption="窓辺の机.jpg"
        meta="552 KB · 9月26日"
      />
      <ImageFrame
        src="/assets/sample-cover.svg"
        alt="暮らしの記録の表紙"
        shape="square"
        caption="暮らしの記録.pdf"
        meta="1.2 MB · 9月15日"
      />
      <ImageFrame
        alt="会場の見取り図"
        shape="square"
        caption="見取り図.png"
        meta="未登録"
      />
    </div>
    <DisclosureGroup label="形・収め方・長い名前の違い">
      {(["portrait", "square", "landscape"] as const).map((shape) => (
        <Disclosure summary={`${shape}の枠に収める`}>
          <div class="rx-cluster">
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt={`${shape}の枠に全体を表示した横長の写真`}
              shape={shape}
              caption="全体を表示（横長）"
            />
            <ImageFrame
              src="/assets/sample-cover.svg"
              alt={`${shape}の枠に全体を表示した縦長の表紙`}
              shape={shape}
              caption="全体を表示（縦長）"
            />
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt={`${shape}の枠に切り抜いた写真`}
              shape={shape}
              fit="cover"
              caption="切り抜いて表示"
            />
            <ImageFrame alt={`${shape}の未登録画像`} shape={shape} caption="未登録" />
          </div>
        </Disclosure>
      ))}
      <Disclosure summary="長い名前・右から左に読む場合">
        <div class="rx-cluster">
          <ImageFrame
            src="/assets/sample-photo.svg"
            alt="秋の読書会の会場の写真"
            shape="square"
            caption="autumn-reading-club-2026-venue-photo-original.jpg"
            meta="3.4 MB · 9月20日"
          />
          <div dir="rtl" lang="ar">
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt="صورة المكتب"
              shape="square"
              caption="المكتب.jpg"
              meta="٥٥٢ كيلوبايت"
            />
          </div>
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
  <div class="rx-cluster">
    <figure class="rx-image-frame" data-shape="square" data-fit="contain">
      <div class="image">
        <img src="/assets/sample-photo.svg" alt="窓辺の机の写真" loading="lazy" />
      </div>
      <figcaption>
        <span class="name">窓辺の机.jpg</span><span class="meta">552 KB · 9月26日</span>
      </figcaption>
    </figure>
    <figure class="rx-image-frame" data-shape="square" data-fit="contain">
      <div class="image">
        <img src="/assets/sample-cover.svg" alt="暮らしの記録の表紙" loading="lazy" />
      </div>
      <figcaption>
        <span class="name">暮らしの記録.pdf</span
        ><span class="meta">1.2 MB · 9月15日</span>
      </figcaption>
    </figure>
    <figure class="rx-image-frame" data-shape="square" data-fit="contain">
      <div class="image">
        <span role="img" aria-label="会場の見取り図：画像なし">画像なし</span>
      </div>
      <figcaption>
        <span class="name">見取り図.png</span><span class="meta">未登録</span>
      </figcaption>
    </figure>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="形・収め方・長い名前の違い">
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
        ><span class="label"><span class="title">portraitの枠に収める</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <figure class="rx-image-frame" data-shape="portrait" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="portraitの枠に全体を表示した横長の写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（横長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="portrait" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-cover.svg"
                alt="portraitの枠に全体を表示した縦長の表紙"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（縦長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="portrait" data-fit="cover">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="portraitの枠に切り抜いた写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">切り抜いて表示</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="portrait" data-fit="contain">
            <div class="image">
              <span role="img" aria-label="portraitの未登録画像：画像なし"
                >画像なし</span
              >
            </div>
            <figcaption><span class="name">未登録</span></figcaption>
          </figure>
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
        ><span class="label"><span class="title">squareの枠に収める</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <figure class="rx-image-frame" data-shape="square" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="squareの枠に全体を表示した横長の写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（横長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="square" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-cover.svg"
                alt="squareの枠に全体を表示した縦長の表紙"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（縦長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="square" data-fit="cover">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="squareの枠に切り抜いた写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">切り抜いて表示</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="square" data-fit="contain">
            <div class="image">
              <span role="img" aria-label="squareの未登録画像：画像なし">画像なし</span>
            </div>
            <figcaption><span class="name">未登録</span></figcaption>
          </figure>
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
        ><span class="label"><span class="title">landscapeの枠に収める</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <figure class="rx-image-frame" data-shape="landscape" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="landscapeの枠に全体を表示した横長の写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（横長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="landscape" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-cover.svg"
                alt="landscapeの枠に全体を表示した縦長の表紙"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">全体を表示（縦長）</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="landscape" data-fit="cover">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="landscapeの枠に切り抜いた写真"
                loading="lazy"
              />
            </div>
            <figcaption><span class="name">切り抜いて表示</span></figcaption>
          </figure>
          <figure class="rx-image-frame" data-shape="landscape" data-fit="contain">
            <div class="image">
              <span role="img" aria-label="landscapeの未登録画像：画像なし"
                >画像なし</span
              >
            </div>
            <figcaption><span class="name">未登録</span></figcaption>
          </figure>
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
          ><span class="title">長い名前・右から左に読む場合</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <figure class="rx-image-frame" data-shape="square" data-fit="contain">
            <div class="image">
              <img
                src="/assets/sample-photo.svg"
                alt="秋の読書会の会場の写真"
                loading="lazy"
              />
            </div>
            <figcaption>
              <span class="name">autumn-reading-club-2026-venue-photo-original.jpg</span
              ><span class="meta">3.4 MB · 9月20日</span>
            </figcaption>
          </figure>
          <div dir="rtl" lang="ar">
            <figure class="rx-image-frame" data-shape="square" data-fit="contain">
              <div class="image">
                <img src="/assets/sample-photo.svg" alt="صورة المكتب" loading="lazy" />
              </div>
              <figcaption>
                <span class="name">المكتب.jpg</span
                ><span class="meta">٥٥٢ كيلوبايت</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
