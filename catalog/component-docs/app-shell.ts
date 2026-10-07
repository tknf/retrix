import type { ComponentDoc } from "../reference";

export default {
  id: "app-shell",
  name: "AppShell",
  description:
    "机の上に白いシートを置く、アプリの基本の画面構成です。ヘッダーと作業面を画面の中央に揃えます。",
  api: ["AppShell"],
  guidance: [
    "アプリの各画面に共通する画面構成として、ヘッダー（アプリの名前・主な移動先・検索）と中央のシート（作業面）を置く時に使います。",
    "画面の幅いっぱいには広げず、ヘッダー・先頭側の列・作業面を同じ幅の中に収めて中央に揃えます。画面の端に固定するサイドバーは持ちません。",
    "上の階層は`trail`の背後に重ねたシートで、分類ごとの移動先や最近見た項目は`aside`の列で示します。作業面に付属する開閉式の補助パネルは`wings`（`Wing`）で扱います。",
    "`AppShell`を使わない画面で作業面だけを置く時は`Surface`を使います。",
  ],
  usage: [
    '`home`にアプリの名前やロゴのリンク、`navigation`に主な移動先、`commands`に検索や`CommandMenu`を渡します。ヘッダーは背景を持たず、机の地の上にそのまま並びます。`navigation`の今いる項目は`current`にすると、黒い太字で示し、`aria-current="page"`を付けます。',
    "`account`はヘッダーの上の行の末尾側に、小さな文字で置きます。利用者の名前・アカウントの設定・ログアウトへのリンクなどを並べます。",
    "`children`は中央のシートに置きます。シートの幅の上限は`size`で選びます。`default`は`--rx-page`（61.25rem）、`compact`は本文の行の長さ（`--rx-measure`）に左右の余白を足した46rem、`wide`は90remです。ほかの幅が必要な時は、ルートの`style`で`--rx-page`を上書きします。`Board`・`Table`・`Grid`・`Calendar`は、シートの左右の余白の分だけ外側に広がり、シートの端までスクロールします。",
    "`trail`に上の階層を上から順に渡すと、シートの背後に淡い灰色のシートを重ね、その見出しを上の階層へのリンクにします。奥のシートほど幅を狭くし、今のページのシートを一番手前に置きます。",
    "`aside`を渡すと、シートの先頭側に13remの列を置きます。列はシートの外の机の上に置き、列とシートを合わせて中央に揃えます。幅が52rem未満ではシートの上へ移ります。",
    "`footer`はシートの下に、小さな灰色の文字で置きます。",
    "`AppShell`の幅が45rem未満では、ヘッダーを「名前と検索」「主な移動先」の二段にし、シートの外側と内側の余白を詰めます。",
    "`wings`に`start`・`end`を渡すと、シートを`Wing`で包み、左右に開閉できる補助パネルを付けます。開閉の状態を保存する時は`storageKey`・`savedState`も渡し、`WingController`を`wing`として登録します（詳しくは`Wing`のページ）。",
    "`AppShell`自身はcontrollerを使わず、JavaScriptなしでも同じ配置で表示します。",
  ],
  accessibility: [
    "ヘッダーは`header`で、`navigation`は`aria-label`を付けた`nav`に置きます。読み上げ名は`navigationLabel`で変えられ、省略すると「アプリの移動」です。",
    '`trail`は`aria-label="上の階層"`の`nav`の中の`ol`です。',
    "シートは`div`で、`main`を持ちません。画面の本文は`children`の中で利用側が`main`で包みます。",
    "`home`・`account`・`commands`に文字のないリンクや操作を置く時は、読み上げ名を利用側で付けます。",
  ],
  propNotes: {
    AppShell: {
      children: "中央のシートに置く、画面の中身。",
    },
  },
} satisfies ComponentDoc;
