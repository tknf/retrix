# ボタンと入力の部品の実測（担当: controls）

画像のパスは `/Users/mast1ff/work/oss/retrix/screenshots/` からの相対パス。切り出しは `ref/crops/controls/` の下にある。座標は元の画像の画素で (x, y, w, h)。CSS の px は倍率で割った値。

## 測り方の注意

- 共通の道具 `px.py` の `crop` は、sips の `--cropOffset` が効かず、画像の中央を切り出してしまう（`pv-top.png` で確認。今は削除済み）。そこで、PIL で切り出す `bin/cr`（crop.py）と、色を測る `bin/g`（g.py、`grid`/`col`/`row`/`dark`）、文字の範囲を測る `bin/ext`（ext.py）を scratchpad の `rx/bin/` に作って使った。読むだけの道具で、画像は書き換えていない。
- 倍率の判断:
  - `bc2-tour-2014-*`（幅 1488〜2562）は **2倍**。理由: 枠が全部 2 画素ずつで描かれている。本文の x-height が 15〜16 画素（CSS で 7.5〜8px）なので、本文は 15〜16px になる。
  - `bc2-help-discussions-09.png` も **2倍**。理由: 枠が 2 画素。太字の名前の cap-height が 22 画素（CSS で 11px）なので、16px 前後の書体になる。
  - `bc2-svn-*`、`bc2-help-projects-101-01.png`、`bc2-help-discussions-02/04.png`、Highrise 2011 の SvN 画像（幅 530 前後）、`highrise-top-bar-jump-search-2011.png`、`highrise-case-page-redesign-2011.jpg`、Classic の 2008〜2012 年の画像は **1倍**。理由: 枠が 1 画素。本文の x-height が 6〜8 画素で、11〜15px の書体になる。
  - `bc2-help-discussions-08.png`、`bc2-help-projects-101-04.png` は**縮小**（約0.55倍と約0.8倍）。理由: 同じ緑のボタンの高さが 33px でなく 18px・26px になっている。寸法には使わず、色だけを使った。
  - `highrise-contacts-index-redesign-2011.jpg`（幅 900）は**約0.85倍に縮小と推測**。理由: 同じ形のピル（`Add a New Deal`）は 1倍で高さ 27px・cap 8px だが、こちらは高さ 22px・cap 7px。
  - `highrise-color-themes-header-2011.jpg` も縮小と推測（倍率は不明）。色の比較にだけ使った。

## 最も重要な発見（先に要点）

1. **BC2（2012〜2014）のフォームの部品は、ほとんどが OS（Mac）の標準の部品のまま**。select、checkbox、radio、フォームの中の副ボタン（「Save changes」「Add this event」「Save and start adding to-dos」）は Aqua の見た目そのもの。Highrise 2011 もノートの textarea、「Add this note」、「Excerpt view」の select、focus の青い輪が標準のまま。独自に作られているのは、①BC2 の控えめな白いボタン、②BC2 の緑の主ボタン、③BC2 の枠の無いタイトル欄（点線の下線）とコメント欄、④Highrise・Classic のグラデーションのピルと、上部の帯のボタンだけ。
2. **BC2 の控えめなボタンは塗りが平らな白**。グラデーションも浮き彫りも無い。枠は 1px #ccc、下に 1px #ddd の影、角丸は 5px、高さ 22px、文字は 11〜12px の黒。2014 年の 4 つのボタンと 2012〜13 年のヘルプの画像で同じだった。
3. **BC2 の主ボタンは平らな緑の #00a264**。枠 1px #016c43、下だけ 2px（枠と影が同じ色）、角丸は約 4px、高さ 33px、文字は白の太字で約 15px。3 枚の画像で色が完全に一致した。
4. **Highrise と Classic のボタンは「グラデーションのピル」**。上は白、下は #e6〜#e8 で、枠は上が明るく（#d6）下が暗い（#b0〜#b4）。下に 1〜2px の影が付く。文字は太字の黒。無効のときは、文字が灰色（#9a9a9a）になるだけで、形は同じ。
5. 文字リンクの「or Cancel」は、2013 年以降の本番では**黒の下線**（`#000`、下線は文字の下 2px）。赤の Cancel（#d00）は没デザイン（SvN 3118）だけ。

---

## 1. BC2 の控えめなボタン（「Post a new message」「Add a to-do list」「Add files」「Create a text document」）

- 根拠: `basecamp2-official/bc2-tour-2014-05-project-view.jpg`。倍率: 2倍。
  - 「Post a new message」(599, 579, 260, 46) → CSS 130×22 + 影。切り出し: `crops/controls/pv-post-btn.png`
  - 「Add a to-do list」(571, 1371, 約210, 46)
  - 「Add files」(485, 3212, 138, 46) → CSS 69×22
  - 「Create a text document」(665, 4272, 約300, 46)
- 寸法: 高さ **22px**（枠を含む。y=579〜622 の 44 画素）。左右の余白は、枠の内側から文字まで **11px**（左 22 画素、右 22〜24 画素）。角丸は **5px**（角の弧が縦横 10〜11 画素。`grid` で確認）。
- 枠: **1px #cccccc**。上・横・下とも同じ色。
- 塗り: **平らな #ffffff**。グラデーションは無い（列 x=845 は、上の枠と下の枠の間が全部 #ffffff）。
- 影: 下に **1px #dddddd**（y=623〜624 の 2 画素）。ぼかしは無い。`box-shadow: 0 1px 0 #ddd` に相当する。
- 文字: 黒 **#000000**（一番濃い画素）。cap-height 8px（16 画素）、x-height 6px（12 画素）なので **11〜12px**。太さ 400。書体は Lucida Grande 系に見える（推測）。浮き彫りは無い。
- 見出しとの間: 見出し「Discussions」「Files」の文字の右端から、ボタンの左の枠まで約 **17px**（34〜35 画素）。
- 状態: ホバー・押下・無効は画像に無い。不明。
- 別の画像での測定:
  - `bc2-tour-2014-11-calendar.jpg`「Hide calendar list」(66, 62, 約258, 46)、2倍: 高さ 22px、枠 #cccccc、影 #dddddd、文字 #000。cap 8.5px・x-height 6px。**完全に一致**。切り出し: `crops/controls/cal-hide.png`
  - `bc2-help-discussions-02.png`「Post a new message」(155, 72, 129, 23)、1倍、2012〜13 年: 高さ **22px**、枠 **#c1c1c1**、影 **#d5d5d5**、角丸は約 4px、塗りは平らな白、文字は黒で cap 8px。2014 年より枠が少し濃い（#c1 と #cc）。描画の違いか版の違いかは不明。
  - 大きい版: `bc2-tour-2014-13-text-doc.jpg`「Edit this document」(1819, 569, 360, 78)、2倍: 高さ **38px**、幅 180px（サイドバーの幅いっぱい）、枠 #cccccc、影 #dddddd、角丸 5px、文字は黒で cap 11px・x-height 7.5px なので **15〜16px**（本文と同じ大きさ）。文字は中央寄せ。切り出し: `crops/controls/td-edit.png`

## 2. BC2 の没デザインのピル型の送信ボタン（「Save changes」SvN 3118）

- 根拠: `basecamp2-official/bc2-svn-3118-edit-form.png` (42, 124, 104, 25)。倍率: 1倍。切り出し: `crops/controls/editform.png`
- 寸法: 高さ **24px**（y=124〜147）、幅 104px。角丸は**ピル**（左の弧が縦の全部、12px）。左右の余白は約 13px。
- 枠: 1px #cccccc（弧のところは #cf〜#d2 のにじみ）。
- 塗り: 平らな #ffffff。
- 影: 下に 1px #dddddd。
- 文字: 黒 #000、cap 9px・x-height 7px なので約 **12px**。太さ 400。Lucida Grande に見える（推測）。
- 注意: SvN 3118 は「没デザイン集」。本番の 2014 年版は角丸 5px の長方形（1 章）なので、これは参考にとどめる。

## 3. BC2 の主ボタン（緑。「Start the project」「Post this message」「Upload」）

- 根拠: `basecamp2-official/bc2-help-projects-101-01.png`「Start the project」(60, 452, 151, 33)。倍率: 1倍。切り出し: `crops/controls/p101-01-bottom.png`
- 寸法: 高さ **33px**（y=452〜484）、幅 151px。左右の余白は **約 20px**（文字は x=82〜190。左 21px、右 19px）。角丸は **約 4px**（弧が 4〜5 画素）。
- 枠: 1px **#016c43**（上・横）。下は **2px #016c43**（y=483〜484）。
- 塗り: **平らな #00a264**。グラデーションは無い（y=453〜482 が全部 #00a264）。
- 影: 下の 2px 目が影の役をしている（枠と同じ色）。それより外にぼかしは無い。
- 文字: 白 **#ffffff**、**太字**。cap 約 11px なので **約 15px**（推測）。浮き彫りは無い（文字の上下に暗い影の画素は無い）。
- 状態: 不明。
- 別の画像での測定:
  - `bc2-help-discussions-08.png`「Post this message」(49, 366, 約92, 18)、約0.55倍に縮小: 塗りは **#00a264**、下の枠は #00653b（縮小のにじみ）。色は一致。切り出し: `crops/controls/d08.png`
  - `bc2-help-projects-101-04.png`「Upload」(41, 413, 約66, 26)、約0.8倍に縮小: 塗りは **#00a264**、枠は **#016c43**、下の枠は **2 画素**（y=437〜438）。**完全に一致**。切り出し: `crops/controls/p101-04-upload.png`
- 青の主ボタン: BC2 の画像には見つからなかった。不明。

## 4. BC2 のフォームの副ボタン（OS の標準のボタン。「Save changes」「Add this event」）

- 根拠: `basecamp2-official/bc2-svn-3148-text-input-no-access.png`「Add this event」(150, 249, 94, 19)。倍率: 1倍。切り出し: `crops/controls/addthisevent.png`
- 寸法: 高さ **18px**（y=249〜266）、幅 94px、左右の余白は約 8px、角丸は約 3px。
- 枠: 上 **#a6a6a6**、横 **#9c9c9c**、下 **#9c9c9c**。
- 塗り: 縦のグラデーション。上半分は白（y=250〜253 #ffffff → y=254 #fdfdfd）。中ほどで段が付いて #ececec（y=257〜263）、下の端は #f2f2f2（y=265）。Mac OS X 10.7〜10.8 の標準のボタンそのもの。
- 影: 下に 1px #f0f0f0。
- 文字: 黒 #000、cap 8px なので約 11〜12px。Lucida Grande（OS の書体）。
- 別の画像での測定:
  - `bc2-help-discussions-04.png`「Save changes」(34, 272, 89, 19)、1倍: 高さ 18px、枠は上 #a6a6a6・横と下 #9c9c9c、塗りは #ffffff → #fdfdfd → #ededed → #f3f3f3、影は #f0f0f0。**完全に一致**。切り出し: `crops/controls/d04.png`
  - `bc2-help-to-do-lists-05.png`「Save and start adding to-dos」も、見た目は同じ標準のボタン（目視だけで、画素は測っていない）。
- 判断: BC2 の本番は、フォームの副ボタンに独自の装飾をしていない。Retrix で作り直すなら、OS の見た目を真似るか、1 章の控えめなボタンにそろえるかを決める必要がある。

## 5. ボタンの横の文字リンク（「or Cancel」「or Close」）

- 根拠: `basecamp2-official/bc2-help-projects-101-01.png`「or Cancel」(217, 462, 約66, 13)。倍率: 1倍。
  - 色: 「or」も「Cancel」も **#000000**。「Cancel」に **1px の下線**。下線は文字の下の線（ベースライン）から 2px 下（y=474。ベースラインは 472）。
  - 文字: cap 11px・x-height 8px なので約 15px（本文と同じ）。
  - ボタンとの間: ボタンの右端（x=210）から「or」まで約 6px（空白 1 文字分）。
- 別の画像での測定:
  - `bc2-svn-3148-text-input-no-access.png`「or Cancel」: 黒、下線 1px #000（y=263）、ボタンとの間 4px。
  - `bc2-help-discussions-04.png`「or Close」: 黒の下線（目視）。
  - `bc2-svn-3118-edit-form.png`（没デザイン）: 「or」は黒、「Cancel」は **赤 #d00100**（≒ #d00）で下線 1px（y=142。ベースライン 140 の 2px 下）。ボタンとの間 5px。
  - Classic `classic-todo-time-entry-form-2010.png` の「or Cancel」は赤の下線（目視だけ）。赤は Classic 時代のなごりと判断する（推測）。

## 6. 一行の入力欄

### 6a. BC2 の標準の入力欄（日付など。2012〜13 年）

- 根拠: `basecamp2-official/bc2-svn-3148-radio-buttons.png`「January 23, 2012」(150, 127, 180, 24)。倍率: 1倍。切り出し: `crops/controls/radio-3148.png`（周辺）
- 寸法: 高さ **24px**、角丸は約 2px（角の 1 画素だけが #ededed/#e1e1e1）。左の余白は約 6px（枠の内側から「J」まで）。
- 枠: **1px #dedede**。上・横・下とも同じ色。
- 内側の影: **無い**（枠のすぐ内側が #ffffff）。
- 塗り: #ffffff。
- 文字: 黒 #000、cap 8px・x-height 6px なので約 11〜12px。
- プレースホルダー: 「any time」は **#aaaaaa**（同じ画像の (345, 127, 64, 24)。この欄も枠 #dedede）。
- 別の画像での測定: `bc2-help-discussions-04.png`「January 18, 2013」(34, 136, 約180, 24)、1倍: 枠 **#dedede**、高さ **24px**（y=136〜159）。**一致**。

### 6b. BC2 2014 の枠の無いタイトル欄・説明欄（点線の下線）

- 根拠: `basecamp2-official/bc2-tour-2014-01-name-project.jpg`。倍率: 2倍。
- 寸法: 一行の高さは **33px**（下線の間が 66 画素。y=177 → y=243）。
- 枠: 上と横には無い。下に **1px の点線 #cccccc**（2 画素描いて 2 画素空ける。CSS の 1px dotted）。
- 塗り: 透明（背景の #ffffff）。
- タイトルの文字: 黒 #000、太字。cap 約 13〜14px なので約 20px（推測）。
- プレースホルダー「Add a description or extra details (optional)」: **#a7a7a7**（≒ #aaa）。cap 11px・x-height 8px なので約 **16px**。
- 別の画像での測定: `bc2-tour-2014-02-invite-people.jpg`、2倍: 点線は **#bbbbbb**、一行の高さは **30px**（下線の間が 60 画素）。点線の色が #ccc と #bbb で少し違う。切り出し: `crops/controls/invite.png`
- 2012 年の没デザインの箱型: `bc2-svn-3118-edit-form.png` (42, 40, 約420, 79)、1倍: タイトル欄と説明欄を 1 つの箱にまとめ、外の枠は 1px #cccccc、角丸は約 5px、中の区切りは 1px #cccccc（y=83）。下の端は #cccccc が 2 行（枠と影）。説明の文字は 16px 前後の黒（cap 12px）。

### 6c. Highrise 2011 の入力欄（Safari の標準）

- 根拠: `highrise/highrise-custom-fields-edit-panel-2011.png`「Customer ID」(100, 40, 159, 21)。倍率: 1倍。切り出し: `crops/controls/hr-cf-panel.png`（周辺）
- 寸法: 高さ **21px**、角丸 **0**、左の余白は約 5px。
- 枠: 上 **#878787**、横 **#d0d0d0** / #cacaca、下 **#e9e9e9**。
- 内側の影: 上の枠のすぐ内側に 1px の **#cbcbcb**（古い Safari の「へこんだ」入力欄）。
- 文字: 黒、cap 8px なので約 11〜12px。
- 別の画像での測定: `highrise/highrise-edit-person-custom-fields-2011.png`、1倍: 横の枠は #d4d4d4 / #d1d1d2。同じ系統。

## 7. 複数行の入力欄

### 7a. BC2 のコメント欄（2013 年）

- 根拠: `basecamp2-official/bc2-help-discussions-09.png`「Add a comment or upload a file…」(214, 320, 約900, 86)。倍率: 2倍。切り出し: `crops/controls/d09.png`
- 寸法: 高さ **43px**（閉じた状態。86 画素）、角丸 **5px**（弧が 10 画素）、左の余白 **14px**（枠の内側からプレースホルダーまで 28 画素）。
- 枠: **1px #c1c1c1**。上・横・下とも同じ色。
- 内側の影・外の影: 無い。
- プレースホルダー: **#999999**。cap 11px・x-height 8px なので約 **16px**。
- 別の画像での測定: 2014 年の tour には開いたコメント欄が無かった。2 枚目は見つけられていない。枠の色（#c1c1c1）は、2012〜13 年の控えめなボタンの枠（`bc2-help-discussions-02.png` の #c1c1c1）と同じだった。

### 7b. Highrise 2011 のノート欄（Safari の標準の textarea）

- 根拠: `highrise/highrise-case-page-redesign-2011.jpg` (264, 243, 556, 68)。倍率: 1倍。切り出し: `crops/controls/hr-case-noteform.png`
- 寸法: 高さ 68px、角丸 0、右下にサイズを変えるつまみ。
- 枠: 上 **#7c7c7c**、横 **#c2c2c2**、下 **#dcdcdc**。
- 内側の影: 上の枠のすぐ内側に 1px の **#cdcdcd**。
- 別の画像での測定: 6c の Highrise の入力欄（上 #878787 + 内側 #cbcbcb）と同じ構造。

## 8. 選択欄（select）

- 根拠: `basecamp2-official/bc2-svn-3148-radio-buttons.png`「Calendar: General」(150, 96, 260, 18)。倍率: 1倍。
- 寸法: 高さ **18px**（y=96〜113）、角丸は約 3〜4px、右に上下の矢印（OS の標準）。
- 枠: 上 **#a6a6a6**、横 **#9c9c9c**、下 **#9c9c9c**。
- 塗り: #ffffff → #fdfdfd → #f5f5f5 → **#ececec**（中ほどで段）→ 下の端 #f2f2f2。
- 影: 下に 1px #f0f0f0。
- 判断: 4 章の標準のボタンと同じ部品（Mac の popup ボタン）。
- 別の画像での測定:
  - `bc2-help-discussions-04.png`「Travels」(34, 108, 約260, 18)、1倍: 上 #a6a6a6、下 #9c9c9c、塗り #fdfdfd → #ededed → #f3f3f3、影 #f0f0f0。**一致**。
  - Highrise「Excerpt view」`highrise/highrise-case-page-redesign-2011.jpg` (713, 201, 107, 15)、1倍: 小さい版の標準の popup。高さ **15px**、枠は上 #989399・下 #7e808c、右の矢印の部分は Aqua の青（#67a0cb〜#6cb3f1、縁 #26559b）。
  - Highrise「Work」`highrise/highrise-edit-person-custom-fields-2011.png` (約303, 225, 47, 15)、1倍: 小さい版。枠は上 #b8b9b9・下 #868789、塗りは #ffffff → #ececed。
  - Classic「Anyone」`classic-tour-todos-2008.png`: Aqua の青い矢印の付いた標準の select（目視だけ）。

## 9. チェックボックス

- 根拠: `basecamp2-official/bc2-help-projects-101-01.png` (60, 394, 14, 14)。倍率: 1倍。切り出し: `crops/controls/p101-01-bottom.png`
- 寸法: **14×14px**、角丸は約 2px。
- 枠: 上 **#a6a6a6**、横 **#9c9c9c**、下 **#9c9c9c**。
- 塗り: #ffffff（上）→ #fdfdfd → #f5f5f5 → **#ececec**（中ほど）→ #f2f2f2（下）。
- 影: 下に 1px #f0f0f0。
- チェックした状態: `bc2-svn-3148-radio-buttons.png` (150, 190, 14, 14)。Aqua の青のグラデーション（#e4faff → #bcddfa → #a1cff9）、縁 #5e64b3 / #545773、チェックの印は濃い紺 #001831。
- 別の画像での測定:
  - `bc2-tour-2014-05-project-view.jpg` の to-do (396, 1519, 26, 26)、2倍: **13×13px**、枠は上 #9f9f9f・横 #959595・下 #898989、塗りは #ffffff → #ececec → #f3f3f3、影 #c7c7c7。Retina の標準のチェックボックス。切り出し: `crops/controls/pv-checkbox.png`
  - `bc2-svn-3148-radio-buttons.png`（チェックした状態。上に書いた）。
- 判断: 独自の装飾は無い。OS の標準の部品。

## 10. ラジオボタン

- 根拠: `basecamp2-official/bc2-svn-3148-radio-buttons.png`。倍率: 1倍。切り出し: `crops/controls/radio-3148.png`
  - 選んでいない状態 (168, 247, 14, 14): **直径 14px**、枠 **#939393**（上は #9c9c9c）、塗り #fdfdfd → **#ececec** → #e8e8e8、影は下に #f1f1f1。
  - 選んだ状態「Me」(168, 228, 14, 14): Aqua の青のグラデーション（#d9edf8 → #addeff）、縁 #63679c / #5e6179、中の点は **#001831** で直径約 4px。
- 別の画像での測定: `highrise/highrise-custom-fields-edit-panel-2011.png`「Everyone / Just me …」、1倍: 同じ標準のラジオ（目視。選んだ状態は青）。`bc2-help-discussions-08.png` の 3 つの選択肢も同じ（縮小。目視だけ）。

## 11. フォーカスの見た目

- 根拠: `highrise/highrise-custom-field-search-2011.png`「375-1037」(381, 141, 約165, 29)。倍率: 1倍。切り出し: `crops/controls/hr-focus-find.png`
- Safari の標準の focus の輪。外側から **#d3e5f5 → #a8caeb → #7cb0e2** の 3px の青いにじみ。そのすぐ内側が入力欄の枠（#6b8dae / #8cadcf）。
- BC2 の focus は画像に無い。不明（`bc2-svn-3118-edit-form.png` は文字を入れるカーソルがあるだけで、輪は描かれていない）。

## 12. Highrise の上部の帯のボタン（「Add Contact」「New Task」）

- 根拠: `highrise/highrise-top-bar-jump-search-2011.png`「Add Contact」(17, 26, 97, 30)。倍率: 1倍。切り出し: `crops/controls/hr-topbar-btn.png`
- 寸法: 高さ **30px**、幅 97px、角丸は約 3px。左の余白は 10px（ここに緑の＋の丸い印 12×11px）。印と文字の間は約 5px。右の余白は約 9px。
- 枠: 1px の濃い緑 **#103c00**（上）/ **#0d3200**（下）。帯の色 #175800 より暗い。
- 塗り: 縦のグラデーション。y=27 **#8aa880**（上の端の光）→ y=29〜33 #6c915f → #688c5b → y=44 #50... → y=54 **#47673c**。帯の色の上に白を半透明で重ねた見た目。
- 影: 外には無い（推測）。
- 文字: **白、太字**、cap 8px なので約 **11px**。文字の下に 1px の暗い影（y=45 が #31452a）があるので、**浮き彫り（暗い影）あり**（`text-shadow: 0 -1px 0` ではなく `0 1px 0` の暗い影）。
- 別の画像での測定:
  - `highrise/highrise-color-themes-header-2011.jpg`（縮小、倍率は不明）: 帯が青のとき、枠は上 #2b5877・下 #39617b、塗りは #81a4ba → #4f748e。帯が明るい緑のとき、枠は上 #a6b39f・下 #8c9e86、塗りは #e4f1dd → #afbcab、文字は濃い色（目視）。**帯の色に合わせて、半透明の白と黒を重ねる作り**と判断した。切り出し: `crops/controls/hr-header-btns.png`
  - `highrise/highrise-case-page-redesign-2011.jpg` の上部（目視）: 青の帯の上で同じ形。

## 13. Highrise・Classic のグラデーションのピル（「Add a New Deal」「New to-do list」「Upload a file」、ページ送り）

- 根拠: `highrise/highrise-company-page-deals-tab-2011.png`「Add a New Deal」(25, 66, 131, 29)。倍率: 1倍。切り出し: `crops/controls/hr-deals-tab.png`
- 寸法: 高さ **27px**（y=66〜92）、幅 131px、角丸は**ピル**。左の余白は約 6px（ここに緑の＋の印 10px）。
- 枠: 上 **#d6d6d6**、横 **#d8d8d8** / #cccccc、下 **#b4b4b4**。
- 塗り: 縦のグラデーション。y=68 #ffffff → y=76 #fffdfc → y=80 #fcfaf9 → y=84 #efeff0 → y=89 **#e8e8e8**。
- 影: 下に 2px（y=93 #c6c6c6、y=94 #dadada）。
- 文字: **黒、太字**、cap 8px なので約 11〜12px（Lucida Grande Bold と推測）。浮き彫りは無い。
- 別の画像での測定:
  - Classic `37signals-others/classic-tour-todos-2008.png`「New to-do list」(513, 86, 116, 25)、1倍、灰色のサイドバー #e7e7e7 の上: 高さ **25px**。枠は上 #cbcbcc・横 #b9b9b9 / #cbcbcc・下 **#b9b9b9（2 行）**。塗りは上半分が #ffffff（y=88〜98）、**中ほどで段**が付いて #f7f7f7 → #efefef → #e7e7e7。影は #cbcbcc。文字は黒の太字で cap 8〜9px。切り出し: `crops/controls/classic-newtodo.png`
  - Classic `37signals-others/classic-files-big-2012.jpg`「Upload a file」(約700, 91, 約135, 26)、1倍: 高さ **25px**、枠は上 #bcbcbc・下 #a7a7a7、塗りは #ffffff → #f7f7f7 → #e9e9e9 →（段）→ #e8e8e8、影は #c5c5c5 / #cdcdcd の 2px。文字は黒の太字で cap 8px。切り出し: `crops/controls/classic-files-upload.png`
- **ページ送り「First」「Next →」**: `highrise/highrise-contacts-index-redesign-2011.jpg`（約0.85倍に縮小と推測）。切り出し: `crops/controls/hr-pagination.png`
  - 「First」(212, 913, 46, 25) と「Next →」(297, 913, 58, 25)。形は上と同じピル。枠は上 #dedede / #dadada、横 #d5d5d5 / #cecece、下 **#b0b0b0 / #bcbcbc**。塗りは #ffffff → #fbfbfb → #f2f2f2 → #e6e6e6。影は下に #d1d1d1 / #e1e1e1。
  - 「Next →」の文字は **黒 #000 の太字**。
  - **無効の「First」**: 文字が **#9a9a9a**（一番濃い画素）。枠・塗り・影は「Next →」とほぼ同じ（差は 1〜2 段の JPEG のにじみの範囲）。**無効は文字の色だけで表す**。
  - 「Page 1」は太字の黒で、ボタンの外に置かれる。

## 14. Highrise の「Add this note」（Safari の標準の丸いボタン）

- 根拠: `highrise/highrise-case-page-redesign-2011.jpg` (731, 319, 89, 18)。倍率: 1倍。切り出し: `crops/controls/hr-case-noteform.png`
- 寸法: 高さ **18px**、ピル。
- 枠: 上 **#5a5a5a**、下 **#6a6a6a**（濃い灰色）。
- 塗り: #f7f6f4 → #fdfeff →（中ほどで段）→ #ecf0f3 〜 #dae1e7 → #f2f5fc。Mac OS X 10.6 の「丸いボタン」。
- 文字: 黒、Lucida Grande 約 11px。
- 別の画像での測定: `highrise/highrise-custom-field-search-2011.png`「Find」(約547, 147, 約40, 18)、1倍: 同じ標準の丸いボタン（目視）。
- 判断: Highrise 2011 のページの中の送信ボタンは、独自の装飾が無い。

## 15. 無効の操作

- Highrise のページ送りの「First」: 文字 **#9a9a9a**。形・枠・塗りは有効のときと同じ（13 章）。
- BC2: 無効のボタンは画像に見つからなかった。不明。

---

## Retrix への提案

- **色のトークン**
  - `--control-border: #cccccc`（BC2 2014 の控えめなボタン・点線）、`--control-border-strong: #c1c1c1`（コメント欄、2013 年のボタン）、`--control-shadow: #dddddd`、`--input-border: #dedede`（一行の入力欄）
  - `--placeholder: #aaaaaa`（入力欄の中。#a7〜#aa）と `--placeholder-large: #999999`（コメント欄）。分けたくなければ #999 か #aaa の 1 つにそろえる
  - `--primary: #00a264`、`--primary-border: #016c43`
  - `--link-cancel: #000000`（下線あり）
  - `--disabled-text: #9a9a9a`
- **寸法のトークン**
  - 控えめなボタン: 高さ 22px、左右の余白 11px、文字 12px（11px でもよい）、角丸 5px。大きい版は高さ 38px、文字 16px
  - 主ボタン: 高さ 33px、左右の余白 20px、文字 15px の太字、角丸 4px
  - 一行の入力欄: 高さ 24px、左の余白 6px、角丸 2px
  - コメント欄: 閉じた高さ 43px、左の余白 14px、角丸 5px、文字 16px
  - 点線の欄: 一行 30〜33px
  - チェックボックスとラジオ: 13〜14px
- **影と塗り**
  - BC2 の作り方を基本にする。塗りは平ら、影は `0 1px 0 var(--control-shadow)` だけで、ぼかしは使わない
  - 主ボタンは `border: 1px solid #016c43; border-bottom-width: 2px`
  - グラデーションは「Highrise・Classic 風」の別の型として持つ。`linear-gradient(#fff, #fff 50%, #efefef 50%, #e7e7e7)` の段付き、または `linear-gradient(#fff, #e8e8e8)`。枠は上 #d6d6d6・下 #b4b4b4、影は `0 1px 1px rgba(0,0,0,.15)` 程度（推測）
- **select・checkbox・radio**
  - 手本は OS の標準の部品そのもの。Retrix では `appearance: auto` のまま使うのが、いちばん忠実で、作る量も少ない
  - 見た目を独自にそろえる場合は、枠を上 #a6a6a6・横と下 #9c9c9c、塗りを `linear-gradient(#fff, #fff 30%, #ececec 60%, #f2f2f2)`、高さ 18px にすると Aqua に近くなる
- **focus**
  - BC2 の手本は無い。Highrise の Safari の輪（#7cb0e2 の 3px のにじみ）を参考に、`box-shadow: 0 0 0 3px rgba(124,176,226,.6)` 程度にする（推測）
- **無効**
  - 形はそのままにして、文字の色を `--disabled-text` にするだけにする（Highrise の「First」と同じ）
