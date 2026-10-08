<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Avatar

人物やチームを、名前と一緒に示します。

## 使いどころ

- 担当者や参加者など、人やチームを名前と一緒に示す時に使います。
- 複数の人をまとめて示す時は `AvatarGroup` で並べます。
- 一人を大きなアバターと名前で見出しにする時は `ProfileHeader` を使います。

## 使い方

`name` と `initials` を渡します。アバターは枠の無い円で、写真が無い時は塗った円に白い太字の略称を置きます。`tone` が既定の `blue` の時は灰色で塗ります。`green`・`amber`・`coral` を渡した時だけ緑・金茶・赤茶で塗ります。色だけで人を見分けさせず、隣に名前を書きます。

`src` を渡すと写真を円の中に重ねます。縁の線は引きません。`AvatarController` を `avatar` として登録すると、画像を読み込めた時だけ表示し、読み込み中と失敗した時は略称を残します。JavaScriptがない時は略称だけを表示します。

`size` は `inline`（20px、文の中）・`small`（22px、詰めた一覧）・`default`（30px、一覧の行）・`large`（48px）です。略称の文字は `default` で11px、`inline`・`small` で10px、`large` で16pxです。

`AvatarGroup` の中に `Avatar` を並べると、アバターを重ねずに2pxずつ空けて並べ、入らない時は折り返します。並べきれない人数は `more` で「+n」の表示にし、アバターの大きさにかかわらず高さ18pxの担当者のピル（平らな `#eeeeee` に灰色の11pxの文字、通常の太さ）に書いて、アバターの中央にそろえます。`size` は中のAvatarと同じ大きさを渡します。

## アクセシビリティ

- `Avatar` は `role="img"` で、`name` を名前にします。画像の `alt` は空にし、名前はアバターが持ちます。
- `AvatarGroup` は `role="group"` で `label` を名前にします。「+n」の表示は読み上げないので、`label` に「ほか12名」のように残りの人数を含めます。

## API

### Avatar

| 名前               | 型                                            | 既定値      | 説明                                                                                        |
| ------------------ | --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `name`（必須）     | `string`                                      |             | 人やチームの名前。アバターの読み上げの名前（role="img"のaria-label）にする。                |
| `initials`（必須） | `string`                                      |             | 画像がない時と読み込めない時にアバターに書く略称。一、二文字にする。                        |
| `src`              | `string`                                      |             | 顔写真などのURL。AvatarControllerが読み込めたと確かめてから表示し、それまでは略称を見せる。 |
| `size`             | `"inline" \| "small" \| "default" \| "large"` | `"default"` | アバターの大きさ。inlineは20px、smallは22px、defaultは30px、largeは48px。                   |
| `tone`             | `Accent`                                      | `"blue"`    | 略称のアバターの塗り。人を見分ける補助で、名前の代わりにはしない。                          |

ほかに、`<span>`へ標準のHTML属性を渡せます。

登録するcontroller：`avatar`（`AvatarController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/avatar.css`

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

### AvatarGroup

アバターを重ねずに少し空けて並べる。childrenにはAvatarだけを置く。

| 名前            | 型                                | 既定値      | 説明                                                                 |
| --------------- | --------------------------------- | ----------- | -------------------------------------------------------------------- |
| `label`（必須） | `string`                          |             | まとまりの名前。読み上げで「誰と誰か」を伝える。                     |
| `more`          | `number`                          |             | 並べきれない残りの人数。最後に「+n」の灰色のピルで示す。             |
| `size`          | `"small" \| "default" \| "large"` | `"default"` | 並べるAvatarと同じ大きさ。残りの人数のピルの高さをこの大きさにする。 |
| `children`      | `Child`                           |             | 並べる `Avatar`。Avatar以外は置きません。                            |

ほかに、`<span>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/avatar-group.css`

## コード

```tsx
import { Avatar, AvatarGroup, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <div class="catalog-person">
        <Avatar name="田中 遥" initials="田" />
        <span>田中 遥</span>
      </div>
      <div class="catalog-person">
        <Avatar name="佐藤 健" initials="佐" size="small" tone="green" />
        <span>佐藤 健</span>
      </div>
      <div class="catalog-person">
        <Avatar name="編集チーム" initials="編" tone="amber" />
        <span>仕事場の案内を担当する編集チーム</span>
      </div>
      <div class="catalog-person">
        <Avatar name="Alex Morgan" initials="AM" tone="coral" />
        <span>Alex Morgan</span>
      </div>
      <div class="catalog-person">
        <Avatar name="田中 遥" initials="田" size="inline" />
        <span>行内の担当者</span>
      </div>
      <div class="catalog-person">
        <Avatar name="プロフィール" initials="編" size="large" tone="green" />
        <span>プロフィール</span>
      </div>
      <div class="catalog-person">
        <Avatar name="山本 彩" initials="山" src="/assets/sample-avatar.svg" />
        <span>画像の読み込み状態</span>
      </div>
    </div>
    <DisclosureGroup label="AvatarGroupで重ねて並べる">
      <Disclosure summary="人数と残りの人数">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健">
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
            </AvatarGroup>
            <span>2人</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健、編集チーム">
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
              <Avatar name="編集チーム" initials="編" tone="amber" />
            </AvatarGroup>
            <span>3人</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健、編集チームほか12名" more={12}>
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
              <Avatar name="編集チーム" initials="編" tone="amber" />
            </AvatarGroup>
            <span>並べきれない人数を添える</span>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="大きさと画像の混在">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="森 美咲、佐藤 健ほか2名" more={2} size="small">
              <Avatar name="森 美咲" initials="美" tone="green" size="small" />
              <Avatar name="佐藤 健" initials="健" size="small" />
            </AvatarGroup>
            <span>小さいアバター（一覧の行やスレッドの見出し）</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="Alex Morgan、山本 彩、プロフィール" size="large">
              <Avatar name="Alex Morgan" initials="AM" tone="coral" size="large" />
              <Avatar
                name="山本 彩"
                initials="山"
                src="/assets/sample-avatar.svg"
                size="large"
              />
              <Avatar name="プロフィール" initials="編" tone="green" size="large" />
            </AvatarGroup>
            <span>大きいアバターと画像</span>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="名前の文と並べる">
        <p class="rx-cluster">
          <AvatarGroup label="森 美咲、佐藤 健、田中 遥" size="small">
            <Avatar name="森 美咲" initials="美" tone="green" size="small" />
            <Avatar name="佐藤 健" initials="健" size="small" />
            <Avatar name="田中 遥" initials="田" tone="amber" size="small" />
          </AvatarGroup>
          <span>森 美咲、佐藤 健、田中 遥が参加しています</span>
        </p>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar" class="rx-cluster">
          <AvatarGroup label="ليلى، عمر" more={3}>
            <Avatar name="ليلى" initials="ل" tone="coral" />
            <Avatar name="عمر" initials="ع" />
          </AvatarGroup>
          <span>ليلى وعمر وثلاثة آخرون</span>
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
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="default"
        data-tone="blue"
        role="img"
        aria-label="田中 遥"
        ><span class="initials">田</span></span
      ><span>田中 遥</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="small"
        data-tone="green"
        role="img"
        aria-label="佐藤 健"
        ><span class="initials">佐</span></span
      ><span>佐藤 健</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="default"
        data-tone="amber"
        role="img"
        aria-label="編集チーム"
        ><span class="initials">編</span></span
      ><span>仕事場の案内を担当する編集チーム</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="default"
        data-tone="coral"
        role="img"
        aria-label="Alex Morgan"
        ><span class="initials">AM</span></span
      ><span>Alex Morgan</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="inline"
        data-tone="blue"
        role="img"
        aria-label="田中 遥"
        ><span class="initials">田</span></span
      ><span>行内の担当者</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="large"
        data-tone="green"
        role="img"
        aria-label="プロフィール"
        ><span class="initials">編</span></span
      ><span>プロフィール</span>
    </div>
    <div class="catalog-person">
      <span
        class="rx-avatar"
        data-size="default"
        data-tone="blue"
        data-controller="avatar"
        role="img"
        aria-label="山本 彩"
        ><img
          src="/assets/sample-avatar.svg"
          alt=""
          loading="lazy"
          data-avatar-target="image"
        /><span class="initials" data-avatar-target="fallback">山</span></span
      ><span>画像の読み込み状態</span>
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="AvatarGroupで重ねて並べる">
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
        ><span class="label"><span class="title">人数と残りの人数</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack">
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="default"
              role="group"
              aria-label="田中 遥、佐藤 健"
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="blue"
                role="img"
                aria-label="田中 遥"
                ><span class="initials">田</span></span
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="green"
                role="img"
                aria-label="佐藤 健"
                ><span class="initials">佐</span></span
              ></span
            ><span>2人</span>
          </div>
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="default"
              role="group"
              aria-label="田中 遥、佐藤 健、編集チーム"
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="blue"
                role="img"
                aria-label="田中 遥"
                ><span class="initials">田</span></span
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="green"
                role="img"
                aria-label="佐藤 健"
                ><span class="initials">佐</span></span
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="amber"
                role="img"
                aria-label="編集チーム"
                ><span class="initials">編</span></span
              ></span
            ><span>3人</span>
          </div>
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="default"
              role="group"
              aria-label="田中 遥、佐藤 健、編集チームほか12名"
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="blue"
                role="img"
                aria-label="田中 遥"
                ><span class="initials">田</span></span
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="green"
                role="img"
                aria-label="佐藤 健"
                ><span class="initials">佐</span></span
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="amber"
                role="img"
                aria-label="編集チーム"
                ><span class="initials">編</span></span
              ><span class="more" aria-hidden="true">+12</span></span
            ><span>並べきれない人数を添える</span>
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
        ><span class="label"><span class="title">大きさと画像の混在</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack">
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="small"
              role="group"
              aria-label="森 美咲、佐藤 健ほか2名"
              ><span
                class="rx-avatar"
                data-size="small"
                data-tone="green"
                role="img"
                aria-label="森 美咲"
                ><span class="initials">美</span></span
              ><span
                class="rx-avatar"
                data-size="small"
                data-tone="blue"
                role="img"
                aria-label="佐藤 健"
                ><span class="initials">健</span></span
              ><span class="more" aria-hidden="true">+2</span></span
            ><span>小さいアバター（一覧の行やスレッドの見出し）</span>
          </div>
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="large"
              role="group"
              aria-label="Alex Morgan、山本 彩、プロフィール"
              ><span
                class="rx-avatar"
                data-size="large"
                data-tone="coral"
                role="img"
                aria-label="Alex Morgan"
                ><span class="initials">AM</span></span
              ><span
                class="rx-avatar"
                data-size="large"
                data-tone="blue"
                data-controller="avatar"
                role="img"
                aria-label="山本 彩"
                ><img
                  src="/assets/sample-avatar.svg"
                  alt=""
                  loading="lazy"
                  data-avatar-target="image"
                /><span class="initials" data-avatar-target="fallback">山</span></span
              ><span
                class="rx-avatar"
                data-size="large"
                data-tone="green"
                role="img"
                aria-label="プロフィール"
                ><span class="initials">編</span></span
              ></span
            ><span>大きいアバターと画像</span>
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
        ><span class="label"><span class="title">名前の文と並べる</span></span>
      </summary>
      <div class="body">
        <p class="rx-cluster">
          <span
            class="rx-avatar-group"
            data-size="small"
            role="group"
            aria-label="森 美咲、佐藤 健、田中 遥"
            ><span
              class="rx-avatar"
              data-size="small"
              data-tone="green"
              role="img"
              aria-label="森 美咲"
              ><span class="initials">美</span></span
            ><span
              class="rx-avatar"
              data-size="small"
              data-tone="blue"
              role="img"
              aria-label="佐藤 健"
              ><span class="initials">健</span></span
            ><span
              class="rx-avatar"
              data-size="small"
              data-tone="amber"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">田</span></span
            ></span
          ><span>森 美咲、佐藤 健、田中 遥が参加しています</span>
        </p>
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
        <div dir="rtl" lang="ar" class="rx-cluster">
          <span
            class="rx-avatar-group"
            data-size="default"
            role="group"
            aria-label="ليلى، عمر"
            ><span
              class="rx-avatar"
              data-size="default"
              data-tone="coral"
              role="img"
              aria-label="ليلى"
              ><span class="initials">ل</span></span
            ><span
              class="rx-avatar"
              data-size="default"
              data-tone="blue"
              role="img"
              aria-label="عمر"
              ><span class="initials">ع</span></span
            ><span class="more" aria-hidden="true">+3</span></span
          ><span>ليلى وعمر وثلاثة آخرون</span>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
