import type { ComponentDoc } from "../reference";

export default {
  id: "range",
  name: "Range",
  description: "スライダーで、数値や範囲を調整します。",
  api: ["Range"],
  guidance: [
    "表示倍率や音量のように、正確な数よりも位置の感覚で決める数値に使います。`value` に[下限, 上限]を渡すと、予算のような範囲を選べます。",
    "正確な数を打ち込ませる時は `NumberField`、3〜8個の決まった値から選ぶ時は `Dial` を使います。",
  ],
  usage: [
    "`value` に数値を渡すと単一値、[下限, 上限]を渡すと範囲指定になります。`min`・`max` はスライダーの両端に灰色の小さな数で出します。溝は細い線で、進んだ側（範囲指定では下限から上限まで）を青緑で塗り、つまみはボタンと同じ白から淡い灰色への塗りに濃い灰色の枠を付けた小さな丸です。フォーカスするとつまみの縁を青にし、外に淡い青の輪を広げます。`disabled` では溝の塗りを灰色にします。`step` などの残りの属性は標準の `range` 入力へ渡します。",
    "単一値は `name` で値を送信し、名前の行の終わりに現在値を `unit` を添えて出します。範囲指定は `<name>-start`・`<name>-end` の二つの名前で送信し、スライダーの下に下限・上限の数の入力を `unit` を添えて並べます。数の入力は送信しません。",
    "範囲指定では、下限が上限を越えないように、動かした側をもう一方の値で止めます。数の入力で確定した値も同じように止めてスライダーへ移します。",
    "`RangeController` を `range` として登録します。上流の `SliderController` の状態管理と上下限の制約に、現在値の表示と数の入力の同期を加えたものです。値はcontrollerの `value`（単一値）、`start`・`end`（範囲指定）で読み書きでき、書いた値は表示にも移します。範囲指定の数の入力は `NumberField` で、`NumberFieldController` を `number-field` として登録すると PageUp・PageDown でも動かせます。",
    "操作で値が確定すると `slider:beforechange` と `slider:change` を出します。標準の `input`・`change` もそのまま受け取れます。数の入力の確定は、その入力の標準の `change` で受け取れます。フォームのリセットでは表示も初期値に戻します。",
    "JavaScriptが無い時は、単一値は現在値の表示の無いスライダーになります。範囲指定は「下限」「上限」のラベルが付いた独立した2本のスライダーになり、下限が上限を越えても止めません。受け取った値の前後関係は送信先でも確かめます。",
  ],
  keyboard: [
    ["矢印キー", "stepだけ増減します（標準の操作）。"],
    ["Home / End", "`min`・`max` にします（標準の操作）。"],
  ],
  accessibility: [
    "単一値のスライダーはラベルを読み上げ名にします。範囲指定は `fieldset` の `legend` に `label` を置き、2本のスライダーと数の入力を「予算（円） 下限」のように名前と下限・上限で読み上げます。",
    "スライダーは数だけを読み上げ、`unit` や両端の数は読み上げません。単位は `label` にも「表示倍率（%）」のように含めます。範囲指定の数の入力では、`unit` を入力の説明として読み上げます。",
    '現在値の表示は `aria-live="off"` で、動かすたびに重ねて読み上げません。値はスライダー自体が伝えます。',
  ],
  events: [
    [
      "slider:beforechange",
      "ポインターかキーボードの操作で値が確定する前に出します。取り消すと値を操作の前に戻します。detailは `value`・`previousValue`・`reason`（`pointer` か `keyboard`）と、範囲指定では `thumb`（`start` か `end`）です。",
    ],
    ["slider:change", "値が確定した後に出します。detailは `slider:beforechange` と同じです。"],
  ],
} satisfies ComponentDoc;
