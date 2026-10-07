/** 利用例のアプリ「つむぐ」のサンプルデータ。チームはヘルプセンターを作り直し、9月30日に公開する。 */

export const members = [
  {
    id: "haruka",
    name: "田中 遥",
    initials: "遥",
    tone: "coral",
    role: "編集",
    email: "haruka@tsumugu.example.com",
    hours: "平日 9:30〜18:00",
  },
  {
    id: "ken",
    name: "佐藤 健",
    initials: "健",
    tone: "blue",
    role: "デザイン",
    email: "ken@tsumugu.example.com",
    hours: "平日 10:00〜19:00",
  },
  {
    id: "misaki",
    name: "森 美咲",
    initials: "美",
    tone: "green",
    role: "サポート",
    email: "misaki@tsumugu.example.com",
    hours: "平日 10:00〜17:00",
  },
] as const;

export type Member = (typeof members)[number];

export const articles = [
  {
    id: "first-steps",
    title: "はじめての方へ：登録から使い始めるまで",
    category: "はじめての方へ",
    state: "公開中",
    owner: 0,
    updated: "9月12日",
    excerpt: "アカウントを作り、チームを招待して、最初のプロジェクトを作るまでを順に案内します。",
  },
  {
    id: "invite",
    title: "メンバーを招待する",
    category: "設定",
    state: "公開中",
    owner: 2,
    updated: "9月11日",
    excerpt:
      "招待リンクを送ると、受け取った人はすぐにチームへ参加できます。リンクは7日で切れます。",
  },
  {
    id: "notifications",
    title: "通知の受け取り方を変える",
    category: "設定",
    state: "下書き",
    owner: 0,
    updated: "9月15日",
    excerpt: "メールで受け取る通知と、まとめて受け取る週次のお知らせを選べます。",
  },
  {
    id: "billing",
    title: "お支払い方法と請求書",
    category: "お支払い",
    state: "下書き",
    owner: 1,
    updated: "9月14日",
    excerpt: "クレジットカードと請求書払いに対応しています。請求書は毎月1日に発行します。",
  },
  {
    id: "trouble-login",
    title: "ログインできないとき",
    category: "困ったとき",
    state: "公開中",
    owner: 2,
    updated: "9月9日",
    excerpt: "パスワードを忘れた場合は、ログイン画面の「パスワードを忘れた」から作り直せます。",
  },
  {
    id: "export",
    title: "データを書き出す",
    category: "使い方",
    state: "確認待ち",
    owner: 1,
    updated: "9月13日",
    excerpt: "プロジェクトの仕事と会話を、CSVとPDFで書き出せます。書き出しには数分かかります。",
  },
] as const;

export const files = [
  {
    name: "ヘルプセンターの構成案.pdf",
    kind: "PDF",
    size: "2.4 MB",
    updated: "9月14日",
    owner: 0,
  },
  {
    name: "カテゴリの見出し画像.png",
    kind: "画像",
    size: "840 KB",
    updated: "9月13日",
    owner: 1,
  },
  {
    name: "よくある質問の集計.csv",
    kind: "表",
    size: "96 KB",
    updated: "9月11日",
    owner: 2,
  },
  {
    name: "公開前チェックリスト.pdf",
    kind: "PDF",
    size: "180 KB",
    updated: "9月10日",
    owner: 2,
  },
  {
    name: "スマートフォンの画面の見本.png",
    kind: "画像",
    size: "1.2 MB",
    updated: "9月8日",
    owner: 1,
  },
] as const;
