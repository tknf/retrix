# 浮かぶパネル・タブ・案内（overlays）の実測

担当: overlays。手本の画像から画素を読み取った値をまとめる。座標は元画像の画素で、(x, y, w, h) の形で書く。切り出し画像は `crops/overlays/` にある（coordinator の指摘を受けて、すべて `rx/bin/cr`（PIL）で作り直した。寸法と色は `px.py` の at・row・col で読んだもので、切り出し画像には頼っていない）。

## 倍率の判断（共通）

- **1倍**: `bc2-help-*`（BC2 公式ヘルプの図の大半）、`bc2-svn-*`、`highrise-*-2010/2011`、`classic-*`。本文が 13〜14px（大文字の高さが 9〜10px）で、アバターも 30px 前後になるため。
- `bc2-todolist-assign-due-date-popover-getapp-2014.png` は **1倍** と判断した。To-do の本文の行の間隔が 21px で、BC2 の 15px 本文に合うため。
- **2倍**: `bc2-tour-2014-*`、`highrise-contacts-list-selected-2016.png`、`highrise-deals-filter-menu-2014.png`（「All deals」の大文字の高さが約 20px と、1倍の約2倍あるため）、`bc2-help-login-troubleshooting-04.png`。
- `bc2-client-visibility-confirm-dialog-youtube-2013.jpg` は YouTube の 1280×720 のフレームで、拡大率が不明。比率と色だけを参考にする。

---

## 1. BC2 のポップオーバー（共通の枠）

すべての BC2 ポップオーバーは同じ作りになっている。白い箱、細い灰色の枠、ふんわりした影、吹き出しのしっぽ（三角）の4つ。

### 1a. 担当者と期日のパネル「Assign this to-do to: / Set the due date: / No due date」

- 根拠: `basecamp2-thirdparty/bc2-todolist-assign-due-date-popover-getapp-2014.png` の (559, 99, 190, 351)。倍率: 1倍。切り出し: `crops/overlays/bc2-assign-popover.png`
- 寸法: 幅 190px、高さ 351px（カレンダー込み）。角丸は約 5px（左の辺は y=103 から真っすぐになり、上の辺は x=564 から真っすぐになる）
- 枠: 1px #bcbcbc（上・左・右）。下は影と重なって #c3c3c3
- 影: 四方に約 8px のぼかし。外へ向かって #e3e3e3 → #fbfbfb。下側だけ少し濃い（#cfcfcf, #dddddd が続く）→ `0 1px 8px rgba(0,0,0,.15)` 前後（推測の換算）
- しっぽ: 左向き。先端は箱の辺から 11px 外。付け根の幅は約 26px（y=125〜151）。辺は約 45°。しっぽの縁も同じ灰色（中間調で #c3〜#c9）。中は白
- 見出し「Assign this to-do to:」「Set the due date:」: 太字、黒 #000（大文字の高さ 10px → 約 14px）
- 説明文「The person you select will be notified by email」: 約 12px、行の間隔 16px、灰色 #5d5d5d 前後
- 区切りの線（「Set the due date:」の下）: 1px #d3d3d3
- 月の見出し「January 2014」: 黒。左右の矢印 ← → は黒 #0e0d0e
- 曜日（S M T W T F S）: 灰色 #777〜#888、約 11px
- 日付のマス: 塗り #e3ebf8（淡い青）。マスの高さ 24px、行と行の間に白い隙間 2px（行の間隔 26px）。列の間に隙間はない。マスの幅は約 23px（7列で 162px）。数字は濃い紺 #15223b〜#1e1e1e
- 当日（今日）: 塗り #ffe582（黄）
- 前の月・次の月の日付: 塗りなし、灰色 #888888〜#96a0aa
- 「No due date」: リンク色 #155673〜#336f89（一番濃い画素 #003d5e）、下線あり、中央寄せ
- 担当者の選択: ブラウザの標準のセレクト（Mac のフォーカスの輪 #71a4d3）
- 起点: 行の右にある黒い丸薬形「Unassigned」（塗り #000、白い字）の右にしっぽが付く
- 別の画像での測定: `basecamp2-official/classic-todo-assign-date-picker-dribbble.png`（Jason Zimdars による 2010 年の案）は 枠 #999999、角丸 約 8px、影 約 6px、しっぽ 深さ 13px・幅 約 20px で、右上に丸い閉じるボタン（×）が付く。BC2 本番（2014）は枠が薄く（#bcbcbc）、角丸が小さく（5px）なり、閉じるボタンがない。切り出し: `crops/overlays/bc2-assign-popover-zimdars.png`

### 1b. カレンダーの予定のパネル（見出しの帯付き）

- 根拠: `basecamp2-official/bc2-help-add-and-edit-events-03.png` の (6, 7, 322, 325)。倍率: 1倍。切り出し: `crops/overlays/bc2-event-popover.png`
- 寸法: 幅 322px。角丸は約 6px（左の辺は y=12〜13 から真っすぐになる）
- 枠: 1px #bbbbbb
- 影: 約 7px。#e3e3e3 → #fcfcfc。下だけ少し濃い（#d6d6d6 が続く）
- 見出しの帯: 塗り #f7f7f7、高さ 83px（y=8〜90）。下に 1px #dedede の区切り。帯の中に題名（太字・黒、大文字の高さ 13px → 約 18〜19px）と「Add an optional note」（プレースホルダー #a9a9a9）
- 本文: 白。ラベル「Calendar:」「When:」は黒、約 13px
- リンク「Lasts multiple days or repeats…」: #1c5c76、下線
- しっぽ: 右向き、帯の高さの位置（y=33〜55、付け根 22px、深さ 約 11px）。しっぽの中は帯の色 #f7f7f7。縁は #cccccc
- 同じ部品の別の画像: `bc2-help-recurring-events-*`、`bc2-help-wb-calendar-*`、`bc2-svn-3148-*` に同じ形が多数ある（目で見て確認した。数値は測っていない）

### 1c. 絞り込みのメニュー（「All matches / Comments / Messages」、「last updated / oldest」）

- 根拠: `basecamp2-official/bc2-help-searching-in-03.png` の (24, 95, 129, 137)。倍率: 1倍。切り出し: `crops/overlays/bc2-filter-menu.png`
- 枠: 1px #adadad
- 影: 約 9px。#d5d5d5 → #fcfcfc（1a・1b より少し濃い）
- しっぽ: 上向き。起点の丸薬形の真下に付く（丸薬形の下端から枠まで 11px）
- 項目: 黒、約 14px。項目の間隔 28px
- 選んだ項目: 丸薬形（両端が完全に丸い）で、塗り #dde4f5、字 #244960 の太字、高さ 21px
- 件数（「7」「1」）: 淡い青 #7f9dd2
- 別の画像での測定: `bc2-help-discussions-07.png` は枠 #adadad、影 約 8px、選んだ項目の塗り #dbe3f7・字 #154964、項目の間隔 約 27px で、ほぼ同じ
- 起点（引き金）の丸薬形: 黒 #000 の塗り、白い太字、高さ 23〜24px、両端が丸い（「All files」「last updated」「All matches」）。並ぶ「date (newest)」「anyone」は塗り #e2e9f8・字 #1c5c76 の太字、高さ 24px

### 1d. ラベルの選択のパネル

- 根拠: `basecamp2-official/bc2-help-file-labels-06.png`、ポップオーバー (60, 124, ?, 142)。倍率: 1倍。切り出し: `crops/overlays/bc2-label-filter-popover.png`
- 枠: 1px #bbbbbb、影 約 9px（#dddddd → #fdfdfd）
- しっぽ: 上向き、先端 (75, 113)、付け根は y=124 の x=63〜85（幅 22px、深さ 11px）。縁 #cccccc
- 見出し「Files labeled:」: #a9a9a9、約 12px
- ラベルの札: 上に黄色の帯 5px（#fff050、縁 #f7e84d）。下は白で、1px #dedede の枠。字は等幅で #333333。高さ 27px
- 札の小メニュー（「Rename this label / Delete this label」）: 枠 1px #aaaaaa、角丸なし（推測）、項目の高さ 約 28px、項目の間に 1px #dddddd、字 #666666・約 12〜13px。影は下と左に約 6px（下が濃い: #b8b8b8 → #fefefe）
- 別の画像: `bc2-help-file-labels-02.png` は、ラベル名の入力欄と候補「contracts」と緑のボタン「Add label」を持つ上向きのしっぽのパネル（目で見て確認した）

### 1e. 通知する人を選ぶ欄（「Email this comment to people on the project」）

- 根拠: `basecamp2-official/bc2-help-notifications-01.png` の (84, 0, 621, 359)。倍率: 1倍。切り出し: `crops/overlays/bc2-notify-box.png`
- 浮かぶパネルではなく、フォームの下に置く灰色の箱
- 塗り: #f9f9f9。枠: 1px #dfdfdf。角丸: 約 8px
- 左右を分ける縦の線: 1px #d5d5d5
- 見出し: 太字、黒、約 13px。「Select all | Select none」: #6d6d6d、約 12px
- チェックの行: 間隔 25px、2列
- グループの丸薬形（「37signals」「Designers」）: 枠 1px #d5d5d5、塗りは箱と同じ、字 #366785、高さ 20px
- 選んだグループ（「Support」）: 塗り #366785、白い字、高さ 約 18px
- 「Loop-in someone…」のリンク: #366785

### 1f. ジャンプ（検索）の候補

- 根拠: `basecamp2-official/bc2-help-searching-in-07.png` の (42, 25, 320, 146)。倍率: 1倍。切り出し: `crops/overlays/bc2-jump-suggest.png`
- 検索欄の真下に続けて開く（しっぽはない）。欄と候補の間に 1px #e1e1e1
- 外側: 濃い枠はなく、縁が #c0bdb6 で、外へ約 10px の影（背景のクリーム色 #f5f1e8 へなじむ）
- 左の列（分類名「People」）: 幅 約 73px、#888888 の太字、約 12px、右寄せ。列の境は 1px #f5f5f5
- 候補の行: 高さ 25px（選んだ行は 24px）。字は黒、約 14px
- 選んだ候補: 塗り #ddeefe（右の列だけ）
- 最後の行「Search messages, to-dos, comments…」: 上に 1px #f5f5f5、高さ 37px、黒、約 14px
- 上の小さなリンク「New features · Account · Upgrades · Sign out」: #7d7a75、約 12px
- 別の画像: `bc2-help-searching-in-06.png`・`-08.png`（分類「Projects」「Labels」でも同じ形）、`bc2-help-files-01.gif`

### 1g. プロジェクトの切り替え

- BC2 には専用の切り替えメニューは見つからなかった。ジャンプの候補（1f）で切り替える（`bc2-help-searching-in-06.png` の「Projects / Book Club」）。
- `bc2-svn-1295-in-app-switcher.png` の黒いメニュー（production / rollout / beta1…）は 37signals 社内の環境の切り替えで、製品の部品ではない。対象外とする。
- Classic の切り替え（補助）: `basecamp2-official/classic-svn-262-project-switcher.png`。倍率: 1倍。切り出し: `crops/overlays/classic-project-switcher.png`
  - 白いタブ「Switch to a different project」が白いパネルとつながる（タブとパネルの間に線がない）。左に約 5px の影（#d8d9dd 前後）、下の辺は #6c6c6c
  - 小見出し（「Last projects you've accessed」）: 暗い赤（#8c0513 前後）
  - ホバーした行: 塗り #f1ebeb（赤みの灰色）、2行で高さ 37px。プロジェクト名は黒の太字・約 15px、会社名は #7e787a・約 10px

---

## 2. 確認のダイアログ・モーダル

### 2a. ポップオーバーで確認する（繰り返す予定の変更）

- 根拠: `basecamp2-official/bc2-help-recurring-events-08.png`。倍率: 1倍。切り出し: `crops/overlays/bc2-confirm-popover.png`
- 枠 1px #bbbbbb、影 約 8px（1a と同じ）。しっぽは左向き
- 問いの文: **#a52a2a**（CSS の brown と同じ色）の太字、約 15px、行の間隔 18〜19px
- 選ぶボタン（全幅）: 白、枠 1px #cccccc、下に 1px #dddddd、角丸 約 4px、高さ 30px、字は黒・約 13px・中央寄せ
- 別の画像: `bc2-help-recurring-events-09.png`、`bc2-help-wb-calendar-recurring-change-prompt.png`（3択でも同じ形）

### 2b. 画面全体を覆うモーダル（お客さんに見せる確認）

- 根拠: `basecamp2-thirdparty/bc2-client-visibility-confirm-dialog-youtube-2013.jpg` の箱 (390, 231, 約 535, 236)。倍率: 不明（動画）。切り出し: `crops/overlays/bc2-client-confirm-modal.png`
- 覆い: #323136（白いページの上で rgba(0,0,0,.8) 前後に当たる。推測の換算）
- 箱: 塗り #faeeee（淡いピンク）、縁は 1px の暗い線（動画の圧縮で #a9a5a6 にじむ）、影は見えない、角丸なし（見た目）
- 題: 赤の太字（動画の圧縮で #8c4f54 前後。2a と同じ #a52a2a 系だと推測）
- 本文: 黒
- ボタン: 白、枠 #c7c7c7 前後、小さい角丸。「Nevermind」は下線付きのリンク
- 箱はお客さん向けの注意の色（ピンク #faeeee）。BC2 の「The client can't see…」の赤の系統と同じ

### 2c. その場で確認する（「Delete this to-do list? Nevermind」）

- 根拠: `basecamp2-thirdparty/bc2-todolist-delete-confirm-menu-littlebigdetails-2012.jpg`。倍率: 1倍。切り出し: `crops/overlays/bc2-inline-delete-confirm.png`
- 右の操作の一覧（Edit / Delete… / Move…）: 項目の間隔 31px、項目の間に 1px #e5e5e5
- 操作のリンク: 青 #4f7a97 前後（JPEG）
- 「Delete…」を押すと、その行が「**Delete this to-do list?**」（赤 #c5301c 前後、下線）と「Nevermind」（灰 #7b8084、小さい字、下線）に変わる。ダイアログは出さない

### 2d. 新しいプロジェクトのシート（閉じるボタンと上限の帯）

- 根拠: `basecamp2-official/bc2-help-wb-account-limit-almost.png`。倍率: 1倍。切り出し: `crops/overlays/bc2-limit-banner-sheet.png`
- シート: 白、枠の線はなく、縁 #d2cfc8 → 外へ約 8px の影（背景のクリーム色へなじむ）
- 上の帯: 塗り **#d78d4b**（オレンジ）、高さ 31px、シートの縁から 2px 内側。白い太字、約 13px、リンクは白の下線
- 閉じるボタン: 直径 16px の丸、塗り #b3b3b3、白い ×

### 2e. Highrise（補助）

- `highrise/highrise-delete-contact-confirm-2016.png`・`highrise-permissions-confirm-before-save-2016.png` は 2016 年（優先度が低い）。数値は測っていない。

---

## 3. タブ

### 3a. Basecamp Classic のタブ（黒いヘッダー）

- 根拠: `37signals-others/classic-todos-black-header-2008.jpg` の (0, 61, 400, 18)。倍率: 1倍。切り出し: `crops/overlays/classic-tabs-black.png`
- 寸法: 高さ 約 18px（y=61〜78）、タブの間に 1〜2px の黒い隙間。角丸は小さい（約 2px、推測）
- 選んでいないタブ: 塗り #797979（上端 1px #252525、その下に #717171、ハイライトの #818181、その下は #797979 の平ら）。字は白の太字、約 11px
- 選んだタブ（To-Do）: 上端 #b6b6b6、塗りは上 #ffffff → 下 #eeeeee の縦のグラデーション。字は黒の太字。下の線はなく、下の灰色の帯 #eaeaea にそのままつながる
- 別の画像: `basecamp2-official/classic-bc-account-red-tabs.png`（赤いヘッダー、同じ仕組み）、`classic-dashboard-black-header-2008.png`（オレンジのタブ）。目で見て確認した

### 3b. Highrise 2011 のタブ（Notes & Emails / People / Deals）

- 根拠: `highrise/highrise-company-page-deals-tab-2011.png` の (16, 27, 225, 21)。倍率: 1倍。切り出し: `crops/overlays/hr-tabs-2011.png`
- 寸法: 高さ 21px、タブの間の隙間 約 3px、角丸 約 3px（上だけ）
- 塗り: 白。枠: 1px #e2e2e2〜#e5e5e5（内側に #f5f5f5 の柔らかい縁）
- 下の線: 1px #e7e7e7。選んだタブの下だけ線がなく、本文の白とつながる
- 字: 黒、約 12px。選んでいても太さは変わらない
- 別の画像: `highrise-person-page-tabs-old-style-2014.png`（同じ形）

### 3c. Highrise の一括操作のタブ（Tag / Untag / Permissions / Delete / Email）

- 根拠: `highrise/highrise-contacts-list-selected-2016.png` の (457, 442, 455, 38)。倍率: 2倍（CSS の値に直した）。切り出し: `crops/overlays/hr-bulk-tabs-2016.png`
- 寸法: 高さ 19px、タブの間 約 3px、角丸 上 約 2px
- 塗り: #dfdfdf の平ら。枠なし。字: 黒、約 11〜12px
- 選んだ連絡先の帯: 塗り #ffffcc。タブの下の辺はこの帯にそのまま乗る
- タグの札: 枠 1px #d2d2e0 前後、塗りなし。今のフィルターのタグは塗り #848484 で白い字
- 2016 年の画像なので、優先度は低い

### 3d. BC2 の切り替え

- BC2 では、タブではなく、**黒い丸薬形と淡い青の丸薬形を組み合わせた文**（「All files sorted by date (newest)」「Searching for … All matches by anyone in all projects」）で切り替える（1c を参照）。
- Progress などの上部のナビゲーションで今いる場所の印は、`bc2-help-keeping-current-05.png` の赤い四角（ヘルプの注釈）しか見つからなかった。製品の印の色・形は不明（ヘッダーの担当者に任せる）。

---

## 4. 案内・通知

### 4a. 黄色の案内の箱（BC2）

- 根拠: `basecamp2-official/bc2-help-adding-storage-01.png` の (76, 105, 680, 135)。倍率: 1倍。切り出し: `crops/overlays/bc2-yellow-notice.png`
- 塗り: **#ffffcc**
- 枠: 1px #eac73b（上・左・右）、**下だけ 3px #eac73b**
- 角丸: 約 4px
- 字: 黒、約 13px。1行目は太字、2行目は標準の太さ。中央寄せ
- 置き場所: ページの背景のクリーム色 #f6f2e9 の上
- 別の画像: `bc2-help-annual-subscription-plan-01.png`、`bc2-help-keeping-basecamp-2-or-classic-for-free-*.png`（同じ黄色の箱。目で見て確認した）

### 4b. 削除済みの赤い帯（ゴミ箱の中の項目）

- 根拠: `basecamp2-official/bc2-help-deleting-and-restoring-project-items-01.gif` の (10, 51, 620, 41)。倍率: 1倍。切り出し: `crops/overlays/bc2-trash-banner.png`
- 塗り: **#ba3027**、高さ 41px、シートの幅いっぱい
- 字: 白、約 13px。「Bring it back」「permanently delete it」は白の太字で下線
- 別の画像: `bc2-features-kickoff-message.png`（「This message was deleted by … Bring it back」。目で見て同じ色を確認した）

### 4c. 保存した後の黄色の通知（Highrise）

- 根拠: `highrise/highrise-bulk-import-delete-2014.png` の (0, 26, 620, 54)。倍率: 1倍
- 塗り: #ffffcc。**上に 1px #ffa500**（オレンジ）、下に 1px #efefef、横の枠なし
- 字: #222222、約 13px、中央寄せ。補足の小さい字は #666666、約 11px
- リンク: #0033cc（Highrise の青）
- BC2 の保存後のフラッシュ（その場で消える通知）は、画像では見つからなかった。Classic の Yellow Fade（`classic-yellow-fade-step3-2005.gif`）は黄色のハイライトで、帯ではない

### 4d. フォームのエラー

- `basecamp2-official/bc2-help-login-troubleshooting-04.png`（2倍、2015 年以降のログイン画面。優先度は低い）: 塗り #fffae6、下に 1px #ffea9e、見出しは赤 #e3533d の太字
- `bc2-help-login-troubleshooting-01.png`: 黒い丸薬形「Sorry, we don't recognize that email or username」（目で見て確認した。数値は測っていない）
- BC2 のプロジェクト内のフォームのエラー（入力欄の下に出る赤い字など）は見つからなかった。不明

### 4e. お客さんに見えない印・注意の赤

- 「The client can't see this comment」: 錠前のアイコン付きの暗い赤の字（`bc2-help-searching-in-03.png`、`bc2-help-discussions-07.png`）。色は 2a の #a52a2a 系（推測。字が小さく正確には測れない）

### 4f. 空の状態の案内

- Highrise 2007: `highrise/highrise-contacts-empty-state-2007-genbeta.webp`（425×196 と小さい）。黄色の帯（#feffcd 前後、細い枠）に大きな太字「Build your contacts: Add a person」（後半がリンク）、その下に小さな説明の字。数値は概略
- BC2: `bc2-help-projects-101-03.png` のオレンジの筆の模様の吹き出し「Welcome to your project」（画像の飾り。CSS の部品ではない）
- 「New features」: ヘッダーの右上の小さなリンク（1f の #7d7a75）だけを確認した。専用の案内の箱は見つからなかった

---

## 5. ページ送り・パンくず

### 5a. ページ送り（Highrise「First / Page 1 / Next →」）

- 根拠: `highrise/highrise-contacts-index-redesign-2011.jpg` の (212, 913, 143, 25)。倍率: 1倍。切り出し: `crops/overlays/hr-pagination.png`
- ボタン: 丸薬形（両端が完全に丸い）、高さ 約 24px
- 枠: 上 #dddddd、下 #b8b8b8（下ほど濃い）
- 塗り: 上半分 白 → 下半分 #e5e5e5〜#e8e8e8 の縦のグラデーション
- 字: 「Next →」は黒の太字、約 11px。使えない「First」は灰色 #b3b3b3
- 「Page 1」: ボタンの間に置く黒の太字、約 11px
- Classic（補助）: `37signals-others/classic-comments-pagination-mock-2009.png` は「These are the last 50 comments out of 160 total — Show 50 more」という文の形で、ボタンはない

### 5b. パンくず（BC2 の背後のシート・「From the to-do list:」）

- 根拠: `basecamp2-official/bc2-tour-2014-06-to-do-lists.jpg`。倍率: 2倍（CSS の値に直した）。切り出し: `crops/overlays/bc2-tour-todo-full.png`
- 背後のシート: 塗り #f9f9f9、上の辺 1px #e6e6e6。プロジェクト名のリンク（#195c77、太字、下線、大きい字）が親の見出しになる
- 手前のシート: 白。背後のシートに重なり、上と左に約 5px の影（#f7f7f7 → #dcdcdc）
- 「From the to-do list:」: #777777、約 12px。続くリスト名はリンク #195c77、下線あり

---

## 6. ツールチップ

- 製品のツールチップは見つからなかった。`bc2-help-deleting-and-restoring-project-items-06.png` の濃い灰色の角丸の箱（「Delete the entire message」）と、`bc2-help-wb-calendar-edit-event-click.png` の「Hold 'Shift' and click here」は、ヘルプの書き手が描いた注釈で、製品の画面ではない。BC2 はブラウザの標準の title だけを使っていたと推測する（推測）。

---

## 7. Highrise のメニュー（補助）

- 2010 年のクイック検索（`highrise/highrise-quick-find-autocomplete-2010.png`、1倍）: 白、左の辺に枠なし、右と下に約 6px のずれた影（#b3b3b3 → #e5e5e5）。候補の行 約 21〜23px、選んだ行は塗り #bcd6fc で上に 1px #99badc。字 #222222・約 13px、種類（「Case」「Deal」）は暖かい灰色
- 2010 年のタグ追加のポップオーバー（`highrise-bulk-add-tag-2010.png`、1倍）: 線の枠はなく、縁 #a5a5a5 から外へ約 7px の濃い影、角丸 約 8px。BC2 より影が濃い
- 2014 年の Deals の絞り込み（`highrise-deals-filter-menu-2014.png`、2倍を CSS に直した）: 枠 1px #bbbbbb、角丸 約 3px、影 約 4〜5px、上向きのしっぽ。ホバー・選んだ行は角丸の四角で塗り #efefef、行の間隔 約 29px。項目のリンク #0043b6

---

## Retrix への提案

- **ポップオーバー**: `--rx-popover-bg: #fff`、`--rx-popover-border: 1px solid #bbbbbb`（1a〜1d は #adadad〜#bcbcbc に収まるので #bbb に揃える）、`--rx-popover-radius: 5px`、`--rx-popover-shadow: 0 1px 8px rgba(0,0,0,.18)`（外へ 8〜9px で #e3 → #fb になる影の換算。推測）。しっぽは深さ 11px・付け根 22px の 45° の三角とし、枠と同じ色の縁を付け、中は接する面の色（白、または見出しの帯の #f7f7f7）にする。
- **ポップオーバーの見出しの帯**: `--rx-popover-header-bg: #f7f7f7`、区切り `1px solid #dedede`。
- **メニューの項目**: 間隔 28px。選んだ項目は丸薬形（塗り #dde4f5、字 #244960 の太字、高さ 21px）。ジャンプの候補だけは長方形の選び色 #ddeefe で、行 25px。
- **切り替えの丸薬形**: 選んだ側は塗り #000 で白い太字、その他は塗り #e2e9f8 で字 #1c5c76 の太字。高さ 24px、`border-radius: 999px`。
- **日付の選択**: マスの塗り #e3ebf8、24×23px、行の隙間 2px、今日 #ffe582、月の外は #888。
- **確認**: 問いの文 `--rx-confirm-text: #a52a2a`（太字）、選ぶボタンは白・枠 #ccc・下 #ddd・角丸 4px・高さ 30px。削除はダイアログより、その場で切り替える確認（赤 #c5301c の問い ＋ 灰色の「Nevermind」）を基本にする。モーダルの覆いは rgba(0,0,0,.8)、注意の箱は #faeeee。
- **案内**: 黄色の箱は `#ffffcc` ＋ 枠 `#eac73b`（下だけ 3px）＋ 角丸 4px。削除済みの帯は `#ba3027` に白い字。上限の帯は `#d78d4b`。Highrise 風の帯は `#ffffcc` ＋ 上 1px `#ffa500`。
- **タブ**: Classic 風は、選んでいないタブを #797979 に白い太字、選んだタブを #fff → #eee のグラデーションにして下の帯 #eaeaea とつなげる。Highrise 風は白・枠 #e2e2e2・角丸 3px・高さ 21px で、選んだタブの下の線を消す。
- **ページ送り**: 丸薬形 24px、塗り #fff → #e5e5e5、枠 上 #ddd・下 #b8b8b8。使えないボタンの字は #b3b3b3。
- **リンクの色**: BC2 の画像では #195c77〜#1c5c76 が繰り返し出る（パンくず・予定のパネル・丸薬形の字）。リンクのトークンの候補として共有する。
