import type { ComponentDoc } from "../reference";

export default {
  id: "profile-header",
  name: "ProfileHeader",
  description: "人物の大きなアバターと名前に、その人に関する設定を並べます。",
  api: ["ProfileHeader"],
  guidance: [
    "人やグループの画面の上部で、名前と、この人に対する設定（通知・振り分け・メモなど）をまとめる時に使います。",
    "人以外の画面の見出しは`PageHeader`を使います。",
  ],
  usage: [
    '`avatar`に`Avatar`の`size="large"`、`name`に名前を渡します。大きなアバター・太字の大きな名前・淡い`detail`を中央に積みます。',
    "`badge`（所属などの小さなバッジ）は先頭側の上の角、`actions`（編集など）は末尾側の上の角に置きます。",
    "`preferences`には、この人への設定の`DropdownMenu`や`Button`を渡します。名前の下の灰色のバーに、面を持たない形で並べ、狭い場所では折り返します。設定の保存は利用側が担います。",
    "名前の見出しのレベルは`headingLevel`で決めます。画面の見出しなら`1`、画面の中の一部として置くなら前後の見出しに合わせて`2`・`3`にします。",
  ],
} satisfies ComponentDoc;
