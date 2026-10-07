import type { ComponentDoc } from "../reference";

export default {
  id: "optional-fields",
  name: "OptionalFields",
  description: "必要な時だけ追加する入力欄と、追加できる項目のチップです。",
  api: ["OptionalFields"],
  guidance: [
    "予定のリンク・場所・招待・メモ・繰り返しのように、多くの場合は空のままの欄を隠し、必要な時だけ追加してフォームを短く見せる時に使います。",
    '検索の条件を一つずつ追加する列は、`layout="stack"` でチップを縦に並べます。',
    "いつも入力する欄は隠さず `Field` で並べます。見出しの下の詳しい内容をまとめて開閉する時は `Disclosure` を使います。",
  ],
  usage: [
    "`items` の一件ごとに、押すと現れる欄（`field`）とチップを作ります。追加した欄は上に積み、チップは下に並べます。チップを押すとその欄が現れ、チップは消えて、欄の最初の入力へフォーカスが移ります。追加した欄の末尾の「（`label`）を削除」を押すと、欄を隠してチップへ戻し、チップへフォーカスを移します。削除した欄の入力の値は、もう一度追加すると残っています。",
    "値が入っている項目は `open` で最初から欄を出し、チップを出しません。保存した値から `open` を決めるのは利用側です。",
    "欄はそれぞれ `fieldset` で包み、隠れている間は `disabled` にします。隠れた欄の入力は送信せず、`required` でも送信を止めません。送信先は、届かなかった名前を「追加していない項目」として扱います。",
    "`OptionalFieldsController` を `optional-fields` として登録します。欄を追加すると `optional-fields:add`、削除すると `optional-fields:remove` を出します。",
    "JavaScriptが無い時は、全ての欄を最初から出し、チップと削除の操作は出しません。全ての欄の入力を送信します。controllerが接続すると、`open` でない欄をチップへ畳みます。",
  ],
  accessibility: [
    'チップの並びは `role="group"` で、`label` を読み上げ名にします。',
    "チップは `aria-controls` で現れる欄を指し、`aria-expanded` で欄を出したかを伝えます。押した後はチップが消えるので、欄の最初の入力へフォーカスを移します。",
    "削除の操作はアイコンだけのボタンで、「（`label`）を削除」を読み上げ名とツールチップにします。押した後は操作が消えるので、戻ったチップへフォーカスを移します。",
  ],
  events: [
    [
      "optional-fields:add",
      "チップを押して欄を出した後に出します。detailは `id`（追加した項目の `id`）です。取り消せません。",
    ],
    [
      "optional-fields:remove",
      "削除の操作で欄を隠した後に出します。detailは `id`（削除した項目の `id`）です。取り消せません。",
    ],
  ],
} satisfies ComponentDoc;
