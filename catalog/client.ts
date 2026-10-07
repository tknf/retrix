import { TableDemoController } from "./controllers/table-demo";
import { CommandDemoController } from "./controllers/command-demo";
import { CodeExampleController } from "./controllers/code-example";
import { InboxDemoController } from "./controllers/inbox-demo";
import { ProjectDemoController } from "./controllers/project-demo";
import { SettingsDemoController } from "./controllers/settings-demo";
import { FieldDemoController } from "./controllers/field-demo";
import { Application } from "@hotwired/stimulus";
import "@hotwired/turbo";
import {
  ClipboardController,
  CodeBlockController,
  WingController,
  CalendarScrollController,
  TaskListController,
  CommandMenuController,
  TableController,
  TableSortController,
  TableSelectController,
  BoardController,
  ToastStackController,
  CalendarController,
  CarouselController,
  ColorPickerController,
  ImageCropperController,
  GridController,
  TreegridController,
  CharacterCountController,
  CheckboxGroupController,
  ComboboxController,
  DateFieldController,
  DatePickerController,
  DialogController,
  DropdownMenuController,
  FileDropController,
  FileInputController,
  NumberFieldController,
  PasswordFieldController,
  PopoverController,
  RangeController,
  SuggestionController,
  TabsController,
  TooltipController,
  ToolbarController,
  ToastController,
  EditableController,
  EditablePropertyController,
  PickerController,
  TagFieldController,
  TagInputController,
  SplitterController,
  TreeController,
  TreePresentationController,
  TableOfContentsController,
  AvatarController,
  HoverCardController,
  ToggleGroupController,
  TimeFieldController,
  FilterMenuController,
  CopyFieldController,
  OptionalFieldsController,
  ReactionsController,
  EmojiPickerController,
} from "../src/controllers";

const application = Application.start();
application.register("clipboard", ClipboardController);
application.register("code-block", CodeBlockController);
application.register("wing", WingController);
application.register("calendar-scroll", CalendarScrollController);
application.register("task-list", TaskListController);
application.register("board", BoardController);
application.register("calendar", CalendarController);
application.register("carousel", CarouselController);
application.register("color-picker", ColorPickerController);
application.register("image-cropper", ImageCropperController);
application.register("grid", GridController);
application.register("treegrid", TreegridController);
application.register("table-demo", TableDemoController);
application.register("table", TableController);
application.register("table-sort", TableSortController);
application.register("table-select", TableSelectController);
application.register("inbox-demo", InboxDemoController);
application.register("command-menu", CommandMenuController);
application.register("command-demo", CommandDemoController);
application.register("code-example", CodeExampleController);
application.register("character-count", CharacterCountController);
application.register("checkbox-group", CheckboxGroupController);
application.register("combobox", ComboboxController);
application.register("date-field", DateFieldController);
application.register("date-picker", DatePickerController);
application.register("number-field", NumberFieldController);
application.register("password-field", PasswordFieldController);
application.register("range", RangeController);
application.register("suggestion", SuggestionController);
application.register("time-field", TimeFieldController);
application.register("field-demo", FieldDemoController);
application.register("project-demo", ProjectDemoController);
application.register("settings-demo", SettingsDemoController);
application.register("dialog", DialogController);
application.register("popover", PopoverController);
application.register("dropdown-menu", DropdownMenuController);
application.register("file-drop", FileDropController);
application.register("file-input", FileInputController);
application.register("tabs", TabsController);
application.register("tooltip", TooltipController);
application.register("toolbar", ToolbarController);
application.register("toast", ToastController);
application.register("toast-stack", ToastStackController);
application.register("editable", EditableController);
application.register("editable-property", EditablePropertyController);
application.register("picker", PickerController);
application.register("tag-input", TagInputController);
application.register("tag-field", TagFieldController);
application.register("splitter", SplitterController);
application.register("tree", TreeController);
application.register("tree-presentation", TreePresentationController);
application.register("table-of-contents", TableOfContentsController);
application.register("avatar", AvatarController);
application.register("hover-card", HoverCardController);
application.register("toggle-group", ToggleGroupController);
application.register("filter-menu", FilterMenuController);
application.register("copy-field", CopyFieldController);
application.register("reactions", ReactionsController);
application.register("optional-fields", OptionalFieldsController);
application.register("emoji-picker", EmojiPickerController);

// 開発時の更新でApplicationとイベント登録を重複させない。
if (import.meta.hot) import.meta.hot.dispose(() => application.stop());
