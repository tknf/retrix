import type { ComponentDoc } from "../reference";

export default {
  id: "profile-header",
  name: "ProfileHeader",
  description: "人物の写真と名前に、その人に関する設定を並べます。",
  api: ["ProfileHeader"],
  guidance: [
    "人やグループの画面の上部で、名前と、この人に対する設定（通知・振り分け・メモなど）をまとめる時に使います。",
    "人以外の画面の見出しは`PageHeader`を使います。",
  ],
  usage: [
    '`avatar`に`Avatar`の`size="large"`、`name`に名前を渡します。アバターは先頭側に置き、Basecamp 2のMeのページと同じく、枠も影も無い64pxの円にします。その右に20px空けて、18px（`--rx-title`）の黒い太字の名前、12pxの灰色（`#767773`）の`detail`、`badge`を上から積みます。幅が24rem未満では、アバターを48pxにし、名前をまとまりの見出しの大きさ（15px）まで下げます。',
    "`badge`（所属などの小さなバッジ）は`detail`の下、`actions`（編集など）は末尾側の上に置きます。",
    "`preferences`には、この人への設定の`DropdownMenu`や`Button`を渡します。1px `#ebebeb` の罫線の下に、枠と面を持たない形で並べ、ホバーした時だけ淡い灰色の面を出します。狭い場所では折り返します。設定の保存は利用側が担います。",
    "名前の見出しのレベルは`headingLevel`で決めます。画面の見出しなら`1`、画面の中の一部として置くなら前後の見出しに合わせて`2`・`3`にします。",
  ],
} satisfies ComponentDoc;
