<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# コンポーネント

全コンポーネントのリファレンスです。カタログの各ページ（`/components/<id>`）と同じ内容で、見本の表示はカタログで確認できます。

## 作業面と移動

- [AppShell](app-shell.md)：机の上に白いシートを置く、アプリの基本の画面構成です。ヘッダーと作業面を画面の中央に揃えます。
- [CommandMenu](command-menu.md)：ヘッダーの末尾側に置く検索欄から開き、アプリ全体の移動先と操作を名前で探します。
- [SplitView](split-view.md)：一覧と本文、作業と補足を並べて表示します。
- [Wing](wing.md)：中央の作業面の左右に、開閉できる補助パネルを置きます。
- [Section](section.md)：関連する内容を、見出し・件数・操作と一緒にまとめます。
- [Surface](surface.md)：机の上に置く白いシート（作業面）です。AppShellの作業面と同じ見た目で、AppShellを使わない画面で使います。
- [ContextBar](context-bar.md)：現在の位置と、関連する移動・操作を作業面の上部にまとめます。
- [PageHeader](page-header.md)：対象と作業を、大きな見出しで伝えます。
- [ProfileHeader](profile-header.md)：人物の写真と名前に、その人に関する設定を並べます。
- [Breadcrumb](breadcrumb.md)：階層をたどって、上の階層へ戻ります。
- [BackLink](back-link.md)：一つ上の階層へ戻るためのリンクです。
- [Navigation](navigation.md)：同じ領域のページを切り替えます。
- [Tree](tree.md)：作業面の中で、階層を開閉して項目を選択します。
- [TableOfContents](table-of-contents.md)：長い資料の見出しへ移動し、現在の位置を示します。
- [Tabs](tabs.md)：同じ場所で、関連するパネルを切り替えます。
- [Pagination](pagination.md)：分割された一覧のページを移動します。
- [Steps](steps.md)：手順と現在の段階を示します。
- [Divider](divider.md)：内容の区切りに線を引き、見出しや操作を置きます。

## 入力と選択

- [Field](field.md)：ラベル・入力欄・補足・エラーを関連付けます。
- [FieldGroup](field-group.md)：見出し・説明・入力欄を、ひとまとまりのフォームとして配置します。
- [OptionalFields](optional-fields.md)：必要な時だけ追加する入力欄と、追加できる項目のチップです。
- [InputGroup](input-group.md)：入力欄の前後に、単位や接頭辞を並べます。
- [CopyField](copy-field.md)：コピーして使う値を表示する欄と、コピーボタンです。
- [Switch](switch.md)：オン・オフの設定を切り替えます。
- [ToggleGroup](toggle-group.md)：関連する状態を、一つまたは複数切り替えます。
- [Range](range.md)：スライダーで、数値や範囲を調整します。
- [Dial](dial.md)：つまみの周りに並べた選択肢から、一つを選びます。
- [Suggestion](suggestion.md)：自由に入力できる欄に、候補を表示します。
- [Picker](picker.md)：検索して、候補から値を選びます。
- [EmojiPicker](emoji-picker.md)：絵文字を検索して選ぶパネルです。
- [InlineSelect](inline-select.md)：文中の語をクリックして、選択肢から選びます。
- [ColorPicker](color-picker.md)：色相・彩度・明度・不透明度を、見本を確認しながら選びます。
- [TagInput](tag-input.md)：入力した文字をタグとして追加・解除します。
- [DatePicker](date-picker.md)：日付や期間を、一つの入力欄で選びます。
- [DateTimeRange](date-time-range.md)：開始と終了の日時を並べて入力します。
- [FileInput](file-input.md)：ファイルを選択し、添付する内容を確認します。
- [ImageCropper](image-cropper.md)：画像の切り抜く範囲を、画像の上の操作と数値の両方で調整します。
- [Composer](composer.md)：本文・添付・送信の操作を、一つの入力エリアにまとめます。
- [TextEditor](text-editor.md)：書式ツールを並べた入力エリアです。
- [FilterBar](filter-bar.md)：一覧の絞り込み条件を、リンクで切り替えます。

## 操作と補足

- [Button](button.md)：操作の主従、無効、処理中を表します。
- [SplitButton](split-button.md)：主な操作のボタンと、別の方法を選ぶ▾のボタンをつなげて並べます。
- [ActionTile](action-tile.md)：塗りつぶしのアイコンと名前を縦に並べたタイルです。リンクや操作をグリッドに並べます。
- [Toolbar](toolbar.md)：対象に対する複数の操作をまとめます。
- [ActionDock](action-dock.md)：画面の下に表示する操作バーです。アイコン・名前・ショートカットキーを並べます。
- [DropdownMenu](dropdown-menu.md)：現在の対象に関する補助の操作をまとめます。
- [FilterMenu](filter-menu.md)：文字を入力して候補を絞り込み、選択する小さなパネルです。
- [Dialog](dialog.md)：今の画面を離れずに、操作の影響や内容を確認します。
- [Popover](popover.md)：補足の説明や小さな操作を、必要な時に開いて表示します。
- [Tooltip](tooltip.md)：操作に添える短い補足を、ホバーとフォーカスで表示します。
- [HoverCard](hover-card.md)：対象の概要と関連する操作を、近くに表示します。
- [Disclosure](disclosure.md)：補足の内容を、HTMLの標準の要素で開閉します。
- [DangerZone](danger-zone.md)：削除や公開の取り消しなど、影響の大きい操作を説明と一緒にまとめます。
- [Keycap](keycap.md)：キーボードのキーの表記をそろえて表示します。

## 内容と一覧

- [Card](card.md)：関連する内容と操作を一つにまとめます。
- [LayerCard](layer-card.md)：上端の見出しの帯と、その下の中身を一つのカードにまとめます。
- [Message](message.md)：投稿者・時刻・本文を、決まった順序で表示します。
- [MessageList](message-list.md)：差出人・件名・本文の冒頭・時刻を並べた受信の一覧です。
- [SearchResults](search-results.md)：題名・抜粋・補足を並べ、一致した語を強調した検索結果です。
- [Table](table.md)：数値・短い状態・長い文章を、列の役割に合わせて表示します。
- [Grid](grid.md)：行と列の見出しを見ながら、縦横に並んだセルを確認・選択する表です。
- [Treegrid](treegrid.md)：階層のある行を、列をそろえて表示します。
- [ValueList](value-list.md)：項目の現在の値を、項目名より目立たせて表示します。
- [SettingList](setting-list.md)：設定の名前と、行の末尾の操作を罫線で区切って並べた一覧です。
- [EditableProperty](editable-property.md)：値をその場で編集し、確定と取り消しの操作をそろえます。
- [DataList](data-list.md)：主な情報・補足・状態を行ごとに並べて比較します。
- [ActionList](action-list.md)：作業へのリンクを、一覧や内容の見えるカードで示します。
- [FileItem](file-item.md)：既存のファイルの名前と状態を示します。
- [ImageFrame](image-frame.md)：縦横比を保って画像を表示します。
- [Carousel](carousel.md)：関連する内容を1件ずつ表示し、前後に切り替えます。
- [Comparison](comparison.md)：変更前と変更後を並べて確認します。
- [ChartFrame](chart-frame.md)：グラフと数値の表を並べて表示します。
- [Avatar](avatar.md)：人物やチームを、名前と一緒に示します。
- [Tag](tag.md)：分類や選択した条件を短く示します。
- [Reactions](reactions.md)：同じ絵文字ごとに、付けた人数を添えてリアクションを表示します。
- [Icon](icon.md)：操作や用途を表す文言に添えるアイコンです。
- [CodeBlock](code-block.md)：設定や短いコードを、改行を保って表示します。

## 仕事と予定

- [TaskList](task-list.md)：タスクの完了チェックと、担当・期日を並べます。
- [Timeline](timeline.md)：出来事を時系列で表示します。
- [Calendar](calendar.md)：月・週・年の表示を切り替えて、日付と予定を確認します。
- [Board](board.md)：タスクを状態ごとの列に分けて表示します。
- [Statistic](statistic.md)：集計値と単位をまとめて表示します。
- [Countdown](countdown.md)：期限や残りの数を、大きな数字の丸いマークで示します。

## 状態と結果

- [Badge](badge.md)：短い状態を、文言と役割の色で示します。
- [Notice](notice.md)：事実・影響・次の操作を、画面に残る形で示します。
- [Prompt](prompt.md)：質問をカードの見出しの帯に置き、回答の選択肢を行に並べます。
- [ErrorSummary](error-summary.md)：送信時のエラーと、修正する欄へのリンクをまとめます。
- [EmptyState](empty-state.md)：表示する情報がない理由と、次の操作を示します。
- [Progress](progress.md)：処理の進み具合を示します。終わりが分からない処理にも使えます。
- [Loading](loading.md)：読み込み中の処理を、文言とインジケーターで示します。
- [Toast](toast.md)：操作の結果を、閉じるまで読める通知として表示します。

## controllerの登録名

`@tknf/retrix/controllers`のcontrollerを、次の登録名でStimulusのApplicationへ登録します。登録の仕方は[controller](../controllers.md)を参照してください。

| 登録名              | controller                   | 使うコンポーネント                                                        |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `avatar`            | `AvatarController`           | [Avatar](avatar.md)                                                       |
| `board`             | `BoardController`            | [Board](board.md)                                                         |
| `calendar`          | `CalendarController`         | [Calendar](calendar.md)                                                   |
| `calendar-scroll`   | `CalendarScrollController`   | [Calendar](calendar.md)                                                   |
| `carousel`          | `CarouselController`         | [Carousel](carousel.md)                                                   |
| `character-count`   | `CharacterCountController`   | [CountedTextarea](field.md)                                               |
| `checkbox-group`    | `CheckboxGroupController`    | [CheckboxGroup](field.md)                                                 |
| `clipboard`         | `ClipboardController`        | [CopyField](copy-field.md)、[CodeBlock](code-block.md)                    |
| `code-block`        | `CodeBlockController`        | [CodeBlock](code-block.md)                                                |
| `color-picker`      | `ColorPickerController`      | [ColorPicker](color-picker.md)                                            |
| `combobox`          | `ComboboxController`         | [Combobox](field.md)、[Picker](picker.md)                                 |
| `command-menu`      | `CommandMenuController`      | [CommandMenu](command-menu.md)                                            |
| `copy-field`        | `CopyFieldController`        | [CopyField](copy-field.md)                                                |
| `date-field`        | `DateFieldController`        | [DateField](field.md)、[DateTimeRange](date-time-range.md)                |
| `date-picker`       | `DatePickerController`       | [DatePicker](date-picker.md)                                              |
| `dialog`            | `DialogController`           | [Dialog](dialog.md)                                                       |
| `dropdown-menu`     | `DropdownMenuController`     | [SplitButton](split-button.md)、[DropdownMenu](dropdown-menu.md)          |
| `editable`          | `EditableController`         | [EditableProperty](editable-property.md)                                  |
| `editable-property` | `EditablePropertyController` | [EditableProperty](editable-property.md)                                  |
| `emoji-picker`      | `EmojiPickerController`      | [EmojiPicker](emoji-picker.md)、[Reactions](reactions.md)                 |
| `file-input`        | `FileInputController`        | [FileInput](file-input.md)                                                |
| `filter-menu`       | `FilterMenuController`       | [FilterMenu](filter-menu.md)                                              |
| `grid`              | `GridController`             | [Grid](grid.md)                                                           |
| `hover-card`        | `HoverCardController`        | [HoverCard](hover-card.md)                                                |
| `image-cropper`     | `ImageCropperController`     | [ImageCropper](image-cropper.md)                                          |
| `number-field`      | `NumberFieldController`      | [NumberField](field.md)                                                   |
| `optional-fields`   | `OptionalFieldsController`   | [OptionalFields](optional-fields.md)                                      |
| `password-field`    | `PasswordFieldController`    | [PasswordField](field.md)                                                 |
| `picker`            | `PickerController`           | [Picker](picker.md)                                                       |
| `popover`           | `PopoverController`          | [Popover](popover.md)、[Reactions](reactions.md)、[Calendar](calendar.md) |
| `reactions`         | `ReactionsController`        | [Reactions](reactions.md)                                                 |
| `splitter`          | `SplitterController`         | [SplitView](split-view.md)                                                |
| `suggestion`        | `SuggestionController`       | [Suggestion](suggestion.md)                                               |
| `table`             | `TableController`            | [Table](table.md)                                                         |
| `table-of-contents` | `TableOfContentsController`  | [TableOfContents](table-of-contents.md)                                   |
| `table-resize`      | `TableResizeController`      | [Table](table.md)                                                         |
| `table-select`      | `TableSelectController`      | [Table](table.md)                                                         |
| `table-sort`        | `TableSortController`        | [Table](table.md)                                                         |
| `tabs`              | `TabsController`             | [Tabs](tabs.md)                                                           |
| `tag-field`         | `TagFieldController`         | [TagInput](tag-input.md)                                                  |
| `tag-input`         | `TagInputController`         | [TagInput](tag-input.md)                                                  |
| `task-list`         | `TaskListController`         | [TaskList](task-list.md)                                                  |
| `time-field`        | `TimeFieldController`        | [TimeField](field.md)、[DateTimeRange](date-time-range.md)                |
| `toast`             | `ToastController`            | [CodeBlock](code-block.md)、[Toast](toast.md)                             |
| `toast-stack`       | `ToastStackController`       | [ToastStack](toast.md)                                                    |
| `toggle-group`      | `ToggleGroupController`      | [ToggleGroup](toggle-group.md)                                            |
| `toolbar`           | `ToolbarController`          | [TextEditor](text-editor.md)、[Toolbar](toolbar.md)                       |
| `tooltip`           | `TooltipController`          | [Popover](popover.md)、[Tooltip](tooltip.md)、[Reactions](reactions.md)   |
| `tree`              | `TreeController`             | [Tree](tree.md)                                                           |
| `tree-presentation` | `TreePresentationController` | [Tree](tree.md)                                                           |
| `treegrid`          | `TreegridController`         | [Treegrid](treegrid.md)                                                   |
| `wing`              | `WingController`             | [AppShell](app-shell.md)、[Wing](wing.md)                                 |
