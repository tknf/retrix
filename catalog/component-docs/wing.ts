import type { ComponentDoc } from "../reference";

export default {
  id: "wing",
  name: "Wing",
  description: "中央の作業面の左右に、開閉できる補助パネルを置きます。",
  api: ["Wing"],
  guidance: [
    "はじめの操作や最近の動きなど、中央の作業面に付属する補助の内容を、作業面の左右に開閉できる形で添える時に使います。",
    "画面の端に固定する常設のナビゲーションではありません。画面全体の移動は`CommandMenu`を使います。",
    "作業面の中で一覧と本文を並べる時は`SplitView`を使います。",
    "`AppShell`の作業面に付ける時は、`Wing`で包まず`AppShell`の`wings`に同じ`start`・`end`を渡します。",
  ],
  usage: [
    "`children`に作業面を、`start`・`end`に左右のパネルを渡します。作業面には`Surface`など背景を持つ面を置きます。各パネルは`label`・`content`と、任意の`icon`・`open`を受け取ります。`open`の既定は展開です。",
    "開閉は`details`/`summary`で動くので、controllerを登録しなくても開閉できます。",
    "`Wing`の幅が56rem以上では、パネルを作業面の後ろへ差し込みます。閉じると作業面の縁からハンドルだけを出し、名前はハンドルにホバーした時のツールチップで示します。開くとパネルが外側へ出て、上端にハンドルと名前の見出しが並びます。開く時はDialog・Popoverと同じく少し行き過ぎてから戻り、閉じる時は減速して止まります。左右の列は開閉に関わらず幅を確保するので、作業面は動きません。パネルは作業面より上下24pxずつ短く、中身はパネルの中でスクロールします。",
    "56rem未満では、パネルを作業面の下へ`start`、`end`の順に積み、見出しの行で開閉します。右から左へ書く言語では、左右の配置と開閉のアイコンの向きを反転します。",
    "`storageKey`を指定し、`WingController`を`wing`として登録すると、左右の開閉状態をcookieへ保存します。cookieの名前は`wingCookieName(storageKey)`、有効期間は1年です。サーバーでこのcookieを読んで`savedState`へ渡すと、保存した状態のまま描画するので、読み込み時にちらつきません。`savedState`を渡さない場合も、接続時にcookieから復元します。`storageKey`はサイト内で一意にします。",
  ],
  accessibility: [
    "ハンドルは`summary`で、読み上げ名はパネルの`label`です。ハンドルのボタンの見た目とツールチップは読み上げません。",
    "DOMの読み順は作業面、`start`、`end`です。補助のパネルは作業面の後に読まれます。",
  ],
  propNotes: {
    Wing: {
      children: "中央の作業面。背景を持つ`Surface`などを渡します。",
    },
  },
} satisfies ComponentDoc;
