# controller

開閉・選択・キーボード操作などが必要なコンポーネントは、`@tknf/retrix/controllers`のcontrollerを利用側のStimulus Applicationへ登録して使います。

```ts
import { Application } from "@hotwired/stimulus";
import { DropdownMenuController, DialogController } from "@tknf/retrix/controllers";

const application = Application.start(); // 既存のApplicationがあればそれを使う
application.register("dropdown-menu", DropdownMenuController);
application.register("dialog", DialogController);
```

## 登録の決まり

- controllerは自動で起動・登録しません。使うコンポーネントのcontrollerだけを登録します。
- 登録名は決まっています。Honoのコンポーネントはその登録名を`data-controller`に出力するので、別の名前で登録すると動きません。コンポーネントごとの登録名は各コンポーネントのページの「API」、全ての登録名は[controllerの登録名](components/README.md#controllerの登録名)にあります。
- 一つのコンポーネントが複数のcontrollerを使うことがあります（Tableの`table`・`table-sort`・`table-select`など）。全て登録してください。
- `@tknf/stimulus-ui`と`@hotwired/stimulus`をpeer dependencyとして使います。一部のcontrollerは`@tknf/stimulus-ui`のものをそのまま再exportし、Retrix固有の配置と操作が要るものは継承・拡張しています。
- `FileDropController`は`FileInputController`が継承しているので、FileInputのために別に登録する必要はありません。独自のドロップ先を作る場合だけ`file-drop`として登録します。

## イベント

controllerは、選択・移動・変更のたびにカスタムイベントを発火します。各コンポーネントが発火するイベントとdetailの中身は、各コンポーネントのページの「イベント」にあります。

- イベント名は原則として`<登録名>:<出来事>`です（`dropdown-menu:select`、`board:move`など）。上流のcontrollerを継承するコンポーネントは上流の名前を使うことがあります（Rangeは`slider:change`）。
- 出来事が`before`で始まるイベント（`board:beforemove`など）と、各コンポーネントのページで取り消せると書いたイベント（`board:toggle`など）は、`preventDefault()`で取り消せます。取り消すと、その操作は画面に反映されません。
- DatePicker・Suggestionのように、送信する値をcontrollerが書き換えるコンポーネントは、カスタムイベントに加えて、送信するフィールドで標準の`input`・`change`も発火します。
- 保存・通信・権限の確認は、利用側でイベントを受けて行います。controllerは画面の状態だけを変えます。

```ts
document.addEventListener("board:beforemove", (event) => {
  if (!(event instanceof CustomEvent)) return;
  if (event.detail.toColumn === "done" && !canClose()) event.preventDefault();
});
```

## JavaScriptなしの時

通常のフォーム、リンク、`details`はcontrollerなしでも動きます。controllerを登録しない、またはJavaScriptが無効な環境での振る舞いは、各コンポーネントのページの「使い方」にあります。
