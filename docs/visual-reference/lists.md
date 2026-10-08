# 実測: 一覧・表・小さなしるし（担当 lists）

画素は `rx.py`（PIL で読む。`crops/lists/rx.py`）と共通の `bin/g` で読んだ。切り出しは PIL の `crops/lists/crop.sh` で作り直してある（共通の px.py の crop の不具合の連絡を受けて、全ての切り出しを作り直し、位置がずれていないことを目で確かめた。測定値は画素の読み取りなので影響なし）。

## 倍率の判断

| 画像                                                                                                                                                                                | 倍率                   | 理由                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `basecamp2-official/bc2-tour-2014-05-project-view.jpg`（2562×5603）                                                                                                                 | 2倍                    | To-do の行の間隔が 50 画素。1倍の `bc2-svn-1591-todolist.png` では同じ行が 25px で、ネイティブのチェックボックス（14px）も 28 画素ある |
| `bc2-tour-2014-11-calendar.jpg`・`bc2-tour-2014-12-me.jpg`                                                                                                                          | 2倍                    | 同じ 2014 年のツアー。罫線が 2 画素、ナビの文字の大きさが project-view と同じ                                                          |
| `bc2-svn-1591-todolist.png`・`bc2-svn-1310-calendar.png`・`bc2-features-2012-completedtodos.png`・`bc2-features-progress-timeline.png`・`bc2-features-progress-catch-up.jpg`        | 1倍                    | 行の間隔が 24〜25px、本文の大文字の高さが 10px（14〜15px の文字）                                                                      |
| `bc2-features-get-caught-up-catch-up.jpg`・`bc2-features-timeline-timeline.jpg`・`bc2-features-calendar-calendar.jpg`・`bc2-svn-3129-*.png`・`bc2-features-2012-one-project-x2.jpg` | 縮小（寸法は使わない） | ナビの文字が 7〜9px 相当で、ページ全体を縮めた図。色と構造だけ使った                                                                   |
| `basecamp2-thirdparty/bc2-everyone-people-page-youtube-2015.jpg`                                                                                                                    | 約 1.44 倍（推測）     | 動画。ナビの「Projects」の幅が 70px で、ツアーの 2 倍画像から求めた 48.5px の 1.44 倍                                                  |
| `highrise/highrise-*-2011*.jpg`（900 幅）                                                                                                                                           | 1倍                    | 本文 11〜13px、行の間隔が素直                                                                                                          |
| `highrise/highrise-*-2016*.png`（2000 幅前後）                                                                                                                                      | 2倍                    | 区切り線が 2 画素、サイドバーの項目の間隔が 56 画素（28px）                                                                            |
| `highrise-contacts-bulk-selected-yellow-2015.png`                                                                                                                                   | 2倍（推測）            | 区切りが 2 画素。ただしタグの高さが 2016 年版より大きく、ズームが異なる可能性あり                                                      |
| `37signals-others/classic-permissions-shaded-header-2007.png`・`backpack-new-page-permissions-table-2009.png`                                                                       | 1倍                    | 罫線が 1 画素、本文 11〜12px                                                                                                           |

---

## BC2 議論の一覧（Discussions）

- 根拠: `bc2-tour-2014-05-project-view.jpg` の (364, 630, 1800, 560)。倍率: 2倍。切り出し: crops/lists/bc2pv-disc.png、件数のピル crops/lists/bc2pv-pill.png
- 行: 高さ 55px（画素 110。区切り線の y=752・862・972・1082）。本文 2 行（行の高さ 18px）で、上下の余白はおよそ 9〜10px
- 罫線: 行の下に 1px `#ececec`。左端はアバターの左（x=381）から、日付の右端（x=2061）まで。幅 840px。件数のピルの列は罫線の外（右の余白）に出る
- 列の配置（罫線の左端を 0 とした CSS px）:
  - アバター 0〜30（30px の円。上の罫線から 5px 下）
  - 投稿者 40〜（`#000000`、14px、太さ 400。「Chazz H.」のように名＋頭文字）
  - 題名 109〜（`#1c5c77`、14px、太さ 700、下線あり。下線は 1px で題名と同じ色、ベースラインの約 2px 下）
  - 抜粋（`-` に続けて同じ行に流す）: `#666666`、14px、太さ 400。2 行で切る
  - 添付のアイコン 590〜（PDF などのアイコン 23px 角が 4px 間隔で並ぶ。画像の縮小は 1px `#cccccc` の枠付き、幅 24px）
  - 日付: 右寄せで右端 840。`#ab9c85`（茶色がかった灰色。濃い画素 `#a79b83`）、14px、太さ 400。「Jan 25」「Dec 5」
  - 件数のピル: 851〜872（罫線の右端から 11px 右）
- 件数のピル: 高さ 18px、幅 21px（2 桁）、角丸 9px（丸）、塗り `#e1e8f8`（`#e2e9f9` 前後）、文字 `#1c5c77`、12px（数字の高さ 8.5px）、太さ 400。枠・影なし。コメントのない議論はピルなし
- 文字の大きさ: 題名・投稿者の大文字の高さ 9.5px → 14px と判断
- 別の画像での測定: `bc2-features-2012-one-project-x2.jpg`（2012、縮小）では題名が下線なしの太字の黒、件数のピルは同じ形の淡い青（`#e3e9f7`）。2014 年版で題名が下線付きのリンク色に変わっている。罫線は `#e8e8e8`〜`#e9e9e9`

## BC2 To-do（一覧の中の行）

- 根拠: `bc2-tour-2014-05-project-view.jpg` の (364, 1440, 1000, 340) と (364, 2280, 1000, 140)。倍率: 2倍。切り出し: crops/lists/bc2pv-todo.png・bc2pv-todo2.png・bc2pv-checkbox.png
- 行: 間隔 25px（画素 50）。罫線なし
- リストの題名「Salvaged, up-cycled materials」: `#1c5c77`、太さ 700、下線あり（議論の題名と同じ）
- チェックボックス: 14px 角。Safari（Mac）の既定のチェックボックスそのもの（枠 `#959595`、下 `#898989`、塗り 上 `#ffffff` → 中 `#ececec` → 下 `#f3f3f3`）。左端はリストの題名から 8px 右（x=395 画素）
- 題名: `#000000`、15px（大文字の高さ 10.5px）、太さ 400。チェックボックスとの間 7px（画素 422→437）
- コメント数のピル「40 comments」: 高さ 18px、角丸 9px、塗り `#e1e8f8`（`#e0e7f7`〜`#e2e9f9`）、文字 `#1c5c77`、12px、太さ 400、左右の余白 約 9px（8.5〜10px）。題名から 6〜7px 右。「1 comment」で幅 73px
- 担当者と期日のピル「Chazz Hacking · Fri, Nov 30」: 高さ 18px、角丸 9px、塗り `#eeeeee`（`#efefef`）、文字 `#777777`、12px、太さ 400。区切りは中黒「·」
- 「Add a to-do」: `#1c5c77`、15px、下線 1px。題名の左端（チェックボックスの右）にそろえる
- 「1 completed to-do」（一覧の下）: `#1c5c77`、小さめ（11px 前後、推測）、下線あり
- 別の画像での測定: `bc2-svn-1591-todolist.png`（2012、1倍）
  - 行の間隔 25px、チェックボックス 14px（同じ）
  - コメント数のピル: 高さ 18px（y=62〜79）、塗り `#dbe4f6`、文字 `#1f4962`。担当者のピル: 高さ 18px、塗り `#eaeaea`、文字 `#646464`
  - 「Unassigned」: 白地に 1px `#d5d5d5` の枠、文字 `#878787`。担当者なしの印は枠だけのピル
  - リストの題名・「Add a to-do」: `#1f4962`。2014 年の `#1c5c77` とほぼ同じ
  - ばらつき: 青いピルの塗りは 2012 `#dbe4f6`、2014 `#e1e8f8`。灰色のピルは 2012 `#eaeaea`/`#646464`、2014 `#eeeeee`/`#777777`

## BC2 完了した To-do

- 根拠: `bc2-features-2012-completedtodos.png` 全体（1倍）。切り出し: crops/lists/bc2-completed-2012.png。補助: `bc2-features-people-pages-completed-to-dos.png`（同じ見た目）、`bc2-svn-3439-post-competed-todos.jpg`（iPhone アプリ。緑の丸いチェックで Web とは別物なので使わない）、`bc2-features-progress-catch-up.jpg`
- 見出し「Jeffrey completed these to-dos」: `#a52b26`（BC2 の見出しの赤。後述の `#a52a2a`）
- グループの見出し「Signup — BCX: Smooth Claim」: `#999999`、12px 前後、太さ 400
- 行: 間隔 24px。チェックボックスの代わりに「✔」（U+2714）の文字、色 `#757575`
- 題名: `#000000`、15px、取り消し線なし
- 完了日「completed Feb 21」: 題名の後ろに続けて `#999999`、11px 前後
- 「187 more completed to-dos」: `#497a99`（2012 年のリンク色。下線なし）
- Catch up の中の完了（`bc2-features-progress-catch-up.jpg`）: 「✔ Homepage」で題名に取り消し線あり、文字 `#000000`、12px 前後。未完了は「❏」の文字
- 不明: 2014 年版の To-do リストの中で完了した項目（チェック済み）の見た目。画像なし

## BC2 Files のグリッド

- 根拠: `bc2-tour-2014-05-project-view.jpg` の (370, 3280, 620, 420)。倍率: 2倍。切り出し: crops/lists/bc2pv-filecell.png。補助: `bc2-tour-2014-12-me.jpg`
- 枠: 1px `#e9e9e9` の格子（外周も内側も同じ線）。セルの幅 291px、高さ 188px、3 列（全体 873px）
- アイコン: 中央寄せ、約 50×58px（PDF のアイコン画像）
- ファイル名: `#000000`、13px 前後（大文字の高さ 9px）、太さ 700、中央寄せ。長い名前は 2 行に折り返す
- メタ「Added by Chazz H. on Dec 5 · 216 KB」: `#999999`、12px 前後、中央寄せ。区切りは中黒
- コメント数のピル: 高さ 18px、幅 88px（「46 comments」）、塗り `#e2e9f9`、文字 `#1c5c77`（To-do と同じ部品）
- 「Label…」のピル: 高さ 18px、幅 44px、塗り白、枠 1px `#dedede`、角丸 約 3px（丸くない）、文字 `#999999`、11px 前後。コメント数のピルとの間 4px
- 別の画像での測定: `bc2-tour-2014-12-me.jpg`（2倍）で格子 `#e9e9e9`、ピルの形も同じ。2012 年（`bc2-features-2012-one-project-x2.jpg`）は格子ではなく縦の一覧（アイコン＋名前＋「Download or Go to file and discussion」のリンク）

## BC2 黄色のテキスト文書のカード

- 根拠: `bc2-tour-2014-05-project-view.jpg` の (360, 4330, 620, 820)。倍率: 2倍。切り出し: crops/lists/bc2pv-textdoc.png
- 寸法: 幅 273px、高さ 353px（2 枚並べ。間は約 4px＋影）
- 塗り: `#ffffcd`
- 枠と影: 内側から 1 画素ずつ `#e0e0e0` → `#eeeeee` → `#f7f7f7`。1px `#e0e0e0` の枠と、外へ 1px ほどの薄い影（推測: `box-shadow: 0 0 1px rgba(0,0,0,.12)` 程度）
- 罫線（便箋の線）: 横線が 14px ごと、色 `#e8f3d5`（画素 1 本。縮小した文書の見本なので実寸は 0.5px 相当）。左に縦の余白線 1px `#fde3b0`（左端から 19px）
- 中身: 文書の縮小。題は `#000000` の太字
- カードの下: 「Saved by Christa DePoe on Aug 27」`#777777`、12px 前後、中央寄せ。コメントなしは「Comment」の灰色のピル（塗り `#eeeeee`、文字 `#777777`）、あれば「1 comment」の青いピル
- 2012 年版（`bc2-features-2012-one-project-x2.jpg`）は大きなカードではなく、黄色い紙のアイコン＋題名＋「Saved last Tuesday…」の一覧

## BC2 Progress（日付ごとの活動）

- 根拠: `bc2-features-progress-timeline.png`（1倍）。補助: `bc2-features-timeline-timeline.jpg`・`bc2-svn-3129-progress.png`（縮小、構造のみ）
- 地: カードではなくページの背景（ベージュの地 `#f5f1e7` 前後）の上に直接描く
- 中央の縦線: 幅 7px、`#dcd9d2`
- 日付の丸: 外径 約 112px、輪 7px `#dcd9d2`、中は白。日付「Feb 15」`#497a99`、太字、15px 前後。曜日「Wednesday」`#bbbabc`、11px 前後
- プロジェクトの見出し「BCX: Building BCX」: `#000000`、太字、14px 前後。下に 7px の帯 `#dcd9d2`（縦線と同じ色で横に伸びる）
- 時刻「12:18am」: `#aa9d83`（議論の日付と同じ系統の茶色がかった灰色）、11px 前後
- 項目: アバター（円）＋「Jonas D. commented on」太字の黒＋リンク（`#497a99`）
- 左右交互: 時刻は縦線の側に寄せる

## BC2 Catch up

- 根拠: `bc2-features-progress-catch-up.jpg`（1倍）。補助: `bc2-features-get-caught-up-catch-up.jpg`（縮小）。切り出し: crops/lists/bc2-catchup-top.png
- 見出し「Catch up on Thursday, 12 January」: `#000000`、太字、中央寄せ、2 行
- 前後の日への矢印: 直径 32px の灰色の円（上 `#c4c4c4` → 下 `#b9b9b9`）に白い矢印。横に日付 `#999999` 前後
- 区分の見出し「15 people contributed」「3 to-dos were started…」: `#a2967e`（茶色がかった灰色）、太字、11px 前後
- 寄与した人: 直径 22px の円いアバターを 2px 前後の間隔で横に並べる
- 小見出し（To-do リスト名）: `#000000`、太字。完了は「✔」＋取り消し線、未完了は「❏」
- 「By-the-minute log」: 時刻と文の 1 行ずつの一覧、灰色（縮小画像で `#5d6065` 前後。実際の色は不明）

## BC2 Everyone

- 根拠: `bc2-everyone-people-page-youtube-2015.jpg`（約 1.44 倍、推測）。補助: `bc2-svn-3129-everyone.png`・`bc2-features-one-page-project-everyone.png`（縮小）
- 区分の見出し「RECENTLY ACTIVE PEOPLE」: 大文字、字間を広げる、`#a29e93` 前後（ページ背景の上）、小さい文字
- アバター: 円、枠なし、直径 約 138px（199 画素 ÷ 1.44。推測）。4 列
- 名前: アバターの下に中央寄せ、太字、下線付きのリンク（暗い青緑。にじみで `#355665` 前後、`#1c5c77` 系と判断）
- 地: ページ背景 `#f2eee3`（動画の圧縮あり）。カードなし
- 通知の帯「Invitations were emailed to 2 people.」: 塗り `#fefdc7`、角丸、下に淡い影

## BC2 カレンダー

- 根拠: `bc2-tour-2014-11-calendar.jpg`（2倍）。切り出し: crops/lists/bc2-cal-today.png。補助: `bc2-svn-1310-calendar.png`（2013、1倍）、`bc2-features-calendar-calendar.jpg`（縮小、色のみ）
- 罫線: 1px `#dcd9d2`（暖かい灰色）。横線は左右の端まで、縦線は列の間だけ（外周の縦線なし）
- 列の幅 128px、行の高さ 101px（「Next 6 weeks」表示、リスト表示中）
- 曜日の見出し「Sun」…: `#666666`、11px（大文字の高さ 7.5px）、中央寄せ。塗りなし、下に罫線
- 日付の数字: 右上、右寄せ、セルの右端から 8px、`#666666`、11〜12px。月の初日は「November 1」と月名を付ける。2013 年版では前月の日（「30」）は淡い灰色
- 今日: セル全体の塗り `#ffffcb`。数字は「Today 21」で太字、`#333333`
- 複数日の予定の帯: 高さ 16px、角丸 8px（両端が丸い）、塗り `#2b84c6`（カレンダーの色）、文字は白の太字 12〜13px、左の余白 9px。左端は罫線に重ね、週をまたぐ側は縮小画像で角が四角（推測）
- 1 日の予定: 「• Install dressing room doors」中黒付き、文字の色はカレンダーの色（`#2a81c4`）、太さ 400。時刻を付ける場合は灰色（`#bbbbbb` 前後）
- カレンダーの色（`bc2-features-calendar-calendar.jpg`、2012）: 青 `#4288c3`、紺 `#012794`、緑 `#489201`、橙 `#f39e33`、黒 `#000000`、赤（文字のみ、`#8b463f` 前後）。2013 年版の緑の予定の文字 `#479029`
- 予定の中の To-do: 「1 To-do」の小見出し＋ 1px の罫線＋チェックボックス付きの項目（`bc2-svn-1310-calendar.png`）

## BC2 の見出しの赤と Me のページ

- 根拠: `bc2-tour-2014-12-me.jpg`（2倍）
- 区分の見出し「Chazz's open to-dos」「Chazz shared these files」: `#a52a2a`（CSS の `brown` と一致）。2012 年の画像でも `#a52b26`
- Me の頭の帯: 塗り `#f5f5f5`、下に 1px `#ebebeb`。アバターは直径 90px の円、枠なし
- 「Last active Thursday at 1:24am」: `#999999`

---

## Highrise 連絡先一覧（2011）

- 根拠: `highrise-contacts-index-redesign-2011.jpg`（1倍）。切り出し: crops/lists/hr2011-contact-row.png・hr2011-tag.png
- 行: 間隔 75px（タグ 1 段のとき）。区切り 1px `#f5f5f5`〜`#f6f6f6`（ごく淡い）
- チェックボックス: 左端。ネイティブ（枠 `#ababab`〜`#bdbdbd`、塗り `#e8e8e8`）、12px 前後
- アバター: 四角。外寸 48px（1px の枠 `#ebebe9` 前後＋白の余白 1px＋写真 44px）。角丸なし
- 名前: `#000000`、太字、15px 前後
- 肩書き・メールと電話: `#838383` 前後（JPEG で淡くなる。`#808080` 程度と判断）、11px、行の高さ 12px
- タグ（2011、丸いピル）: 高さ 12px、角丸 6px（丸）、塗り `#efefef`、下の縁だけ 1px `#e3e3e3`（浮き出し風の下線）、文字 `#333333` 前後、10〜11px、左右の余白 4px、タグの間 4px
- 見出しの帯「All people & companies」: 塗り `#f6f9fe`（淡い青）、下に 1px `#edeef2`。題 `#091f46`（濃紺）、16px 前後。「Change view」`#999999`、小さい
- 「Find contacts by name title city…」のリンク: `#436a91`、太字、下線
- 右のタグ索引: 頭文字 `#4170a6`、タグは同じ丸いピル。グループの間に 1px `#f4f4f4` の区切り
- 「Select all | Select contacts to add tags…」: 左が下線のリンク（`#5e655d` 前後）、右が `#888888`
- サイドバーの選択中の項目: 塗り `#e6e3de`。件数「~60 people」は灰色の小さい文字（`#888888` 前後、推測）

## Highrise 連絡先一覧（2015〜2016、選択中は黄色）

- 根拠: `highrise-contacts-list-selected-2016.png`（2倍）。補助: `highrise-contacts-bulk-selected-yellow-2015.png`（2倍、推測）。切り出し: crops/lists/hr2015-bulk.png
- 選択中の行: 一覧全体の塗り `#ffffcc`（2015 は `#fffecc`）。行ごとの区切り線なし
- チェックボックス: macOS のネイティブ（チェック時は青 `#008dec`）
- アバター: 写真のない人は円 45px、塗り `#868684` 前後の灰色に白い人型と頭文字（「JH」）。2015 年版は写真の円に 1px `#dedede` の枠
- 名前: `#0047b3`〜`#0048b4`（明るい青）、20px 前後、太さ 400、下線なし
- メタ: `#777777` 前後（2015: `#666666`）
- タグ（2016、四角）: 高さ 16.5〜20px、角丸 約 1.5px、塗りなし（行の地が透ける）、枠 1px `#dddddd`、文字 `#666666`。絞り込みに使っているタグは塗り `#848484`〜`#858887`、文字白
- 一括操作のタブ「Tag Untag Permissions Delete Email」: 塗り `#dbdbdb`、角は四角、文字 `#000000`
- 「29 contacts are selected」: 黒の太字
- 見出しの帯「Your Contacts」: 塗り `#f1f5f9`
- サイドバー: 選択中 `#e9e7e5`、件数「~100 people」は黒で小さい、「RECENTLY VIEWED」`#999999` の大文字

## Highrise Deals・Cases の一覧（2016）

- 根拠: `highrise-deals-list-sidebar-2016.png`・`highrise-cases-list-sidebar-2016.png`（2倍）
- 区分の見出し「Pending deals — 1,537 worth $2,838,288」: 黒の太字＋細字。下に 2px の黒い線
- 行の区切り: 1px `#dfdfdf`
- Deal のアバター: 円 42px、塗り `#fccc02`（黄）、白の豚の貯金箱と頭文字
- Case のアバター: 円 55px、塗り `#7d7c78`（灰）、白の鞄と頭文字
- 題名「01: Scranton Hotels」: `#0047b3`、18px 前後。「with Michael Scott」`#666666`
- 抜粋・担当「Lynette Kontny is responsible」: `#888888`
- 金額: 黒の太字
- 色付きのタグ「Hotels」: 塗り `#c50000`、文字白、高さ 22px、角丸 約 1.5px
- 絞り込みのリンク「all deals we created」: `#0047b3`、太字、点線の下線

## Highrise タグの比較

| 年                                                                                                          | 形   | 塗り      | 枠                   | 文字           | 高さ       | 角丸      |
| ----------------------------------------------------------------------------------------------------------- | ---- | --------- | -------------------- | -------------- | ---------- | --------- |
| 2011（`highrise-contacts-index-redesign-2011.jpg`）                                                         | ピル | `#efefef` | 下だけ 1px `#e3e3e3` | `#333333` 前後 | 12px       | 6px（丸） |
| 2015〜2016（`highrise-contacts-bulk-selected-yellow-2015.png`・`highrise-contacts-list-selected-2016.png`） | 四角 | なし      | 1px `#dddddd`        | `#666666`      | 16.5〜20px | 約 1.5px  |
| 2016 絞り込み中                                                                                             | 四角 | `#848484` | なし                 | 白             | 同上       | 同上      |
| 2016 色付き（Deals）                                                                                        | 四角 | `#c50000` | なし                 | 白             | 22px       | 約 1.5px  |

## Highrise Latest activity（2011）

- 根拠: `highrise-latest-activity-redesign-2011.jpg`（1倍）。切り出し: crops/lists/hr2011-activity.png・hr2011-tasklabels.png。補助: `highrise-deals-page-redesign-2011.jpg`
- 項目の区切り: 1px `#f0f0f0`〜`#f9f9f9`（ごく淡い）
- アバター: 四角、外寸 約 42px（1px `#f2f2f0` 前後の枠＋余白）。写真のない種類（Deal など）はアイコン
- 名前「Jordan Chang」: `#000000`、太字、13px 前後。「from」は灰色、会社名は黒の細字
- 日付「Tuesday, March 2, 2010」: `#666666` 前後、11px
- 「Regarding:」の項目名 `#888888` 前後、値は黒。「Private note」は暗い赤（`#742b3e` 前後）、太字
- 本文: `#000000`、13px 前後、行の高さ 18px
- 状態の帯（「WON」）: 帯の塗り `#f0f7eb`（淡い緑）、高さ 22px 前後。左のバッジ「WON」は塗り `#51913b`、文字白の太字、40×16px、角丸 2px 前後。帯の文は `#666666` 前後、リンクは灰色の下線
- 作業の種類のラベル（Your upcoming tasks）: 高さ 12px、角は四角、文字白、9〜10px、左右の余白 3〜4px。色: Email `#de6523` 前後、Lunch `#000000`、Ship `#3a8a0c` 前後、Follow-up `#4a87be`
- 見出しの帯「Latest activity」: `#f6f9fe`、題 `#244b74` 前後

## Highrise Latest activity（2016）

- 根拠: `highrise-latest-activity-feed-sidebar-2016.png`（2倍）
- システムの出来事（作成・完了）: 帯の塗り `#f8f8f8`、枠なし
- バッジ「CREATED」: 塗り `#323232`、文字白の太字の大文字、角丸 3px、高さ 約 21px
- 完了した作業: 大きな「✔」＋作業名に取り消し線
- 項目の区切り: 1px `#eeeeee`
- 本文・リンク: `#323232`。リンクは同じ色で下線
- 日付「Nov 7」: `#999999`、右寄せ

---

## Basecamp Classic の表

- 根拠: `classic-permissions-shaded-header-2007.png`（1倍）
- グループの見出しの帯「Coudal Partners」: 塗り `#e9e9e9`、高さ 23px、文字 `#000000` の太字 14px 前後。右にリンク「Remove company」（`#ff0000`、下線）
- 行: 間隔 25px、区切り 1px `#efefef`（見出しの直後は `#e9e9e9`）
- 名前: `#201f1f` 前後の太字、12px
- 選択中の選択肢の強調: 塗り `#ffffcf`（ラジオと文字を囲む）
- リンク「Add a new person」: `#ff0000`、下線
- 頭の帯「People on this project | Change access and permissions」: 塗り `#edf3fe`
- ページの地 `#e5e5e5`。カードの右に 6px の影（`#bababa` → `#e5e5e5` の段）

## Backpack の表

- 根拠: `backpack-new-page-permissions-table-2009.png`（1倍）。切り出し: crops/lists/backpack-table.png
- 頭の帯（ページ名の入力）: 塗り `#fffcc1`
- 行: 間隔 15px、横の区切り線なし
- 列: 名前の列と選択肢の列の間に縦の線 1px `#f2f2f2`
- 列の見出し「All can make changes」「All can only view」: 灰色（`#888888` 前後）の小さい文字に下線（列全体を切り替えるリンク）
- 名前: 黒、12px。選択肢「Can change the page」: `#837f83` 前後、10px
- 「Cancel」: 赤（`#f15546` 前後）の下線

---

## 黄色のハイライトの正確な色

| 用途                            | 色                          | 根拠                                                          |
| ------------------------------- | --------------------------- | ------------------------------------------------------------- |
| BC2 カレンダーの今日            | `#ffffcb`                   | `bc2-tour-2014-11-calendar.jpg`（9709 画素の最頻値）          |
| BC2 テキスト文書のカード        | `#ffffcd`                   | `bc2-tour-2014-05-project-view.jpg`                           |
| BC2 通知の帯                    | `#fefdc7`（動画の圧縮あり） | `bc2-everyone-people-page-youtube-2015.jpg`                   |
| BC2 2012 カレンダーの今日       | `#fffdcd`（縮小 JPEG）      | `bc2-features-calendar-calendar.jpg`                          |
| Highrise 2016 選択中の行        | `#ffffcc`                   | `highrise-contacts-list-selected-2016.png`（PNG、全画素一致） |
| Highrise 2015 選択中の行        | `#fffecc`                   | `highrise-contacts-bulk-selected-yellow-2015.png`             |
| Classic 選択中の選択肢          | `#ffffcf`                   | `classic-permissions-shaded-header-2007.png`                  |
| Backpack の頭の帯               | `#fffcc1`                   | `backpack-new-page-permissions-table-2009.png`                |
| Classic の Yellow Fade の始まり | `#ffff9c`                   | `classic-yellow-fade-step3-2005.gif`（GIF の色数制限あり）    |

いずれも `#ffffcc` から ±3 の範囲（Yellow Fade と Backpack を除く）。`#ffffcc` が一つの値として扱える。

---

## Retrix への提案

- 色
  - `--rx-list-rule: #ececec`（BC2 の一覧の罫線）、`--rx-grid-rule: #e9e9e9`（Files の格子・Classic の見出しの帯）、`--rx-calendar-rule: #dcd9d2`（カレンダー・Progress の線。暖かい灰色）
  - `--rx-link: #1c5c77`（2014 の題名・リンク。2012 は `#1f4962`/`#497a99`）、`--rx-text-meta: #999999`、`--rx-text-muted: #666666`、`--rx-text-date: #ab9c85`（議論の日付・Progress の時刻）、`--rx-heading-red: #a52a2a`、`--rx-catchup-label: #a2967e`
  - `--rx-pill-blue-bg: #e1e8f8` / `--rx-pill-blue-fg: #1c5c77`、`--rx-pill-grey-bg: #eeeeee` / `--rx-pill-grey-fg: #777777`、`--rx-pill-outline-border: #dedede`（Label…）/ `#d5d5d5`（Unassigned）
  - `--rx-highlight: #ffffcc`（今日・選択・テキスト文書をこの一つで）、`--rx-note-paper: #ffffcd` は別名にしてもよい
  - Highrise 系: `--rx-hr-tag-bg: #efefef`・`--rx-hr-tag-edge: #e3e3e3`（2011）、`--rx-hr-tag-border: #dddddd`（2016）、`--rx-hr-band: #f6f9fe`（見出しの帯）、`--rx-hr-won: #51913b`
- 寸法
  - `--rx-pill-height: 18px`、`--rx-pill-radius: 9px`、`--rx-pill-pad-x: 9px`、`--rx-pill-font: 12px`（BC2 のピルは全て同じ寸法。数だけのピルは幅 21px の丸に近い形）
  - `--rx-row-discussion: 55px`（2 行の抜粋込み）、`--rx-row-todo: 25px`、`--rx-row-table: 25px`（Classic）
  - アバター: 一覧 30px（円）、Catch up 22px、Me 90px、Everyone 約 138px（推測）。Highrise 2011 は四角 48px（枠 1px＋余白 1px）
  - カレンダー: 帯の高さ 16px・角丸 8px、日付の数字の右の余白 8px
- 角丸
  - BC2 のピルは丸（高さの半分）、「Label…」だけ 3px。Highrise 2011 のタグは丸、2016 のタグ・バッジは 1.5〜3px
- 影・塗り
  - BC2 の一覧とピルには影もグラデーションもない（平らな塗り）。テキスト文書のカードだけ 1px `#e0e0e0` の枠＋外へ 1px の淡い影
  - Highrise 2011 のタグは下の縁 1px だけ濃くする（`border-bottom: 1px solid #e3e3e3`）
- チェックボックス: BC2 も Highrise もブラウザの既定のもの（14px）。Retrix で独自に描く場合は既定の見た目に合わせる
