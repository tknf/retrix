import type { ComponentDoc } from "../reference";

export default {
  id: "notice",
  name: "Notice",
  description: "事実・影響・次の操作を、画面に残る形で示します。",
  api: ["Notice"],
  guidance: [
    "公開期限や保存の条件など、その場所で読み続けてほしい事実と、その影響・次の操作を本文のそばに示す時に使います。",
    "今した操作の結果を一時的に知らせる時は `Toast` を使います。",
    "送信で直すところを欄へのリンクでまとめる時は `ErrorSummary` を使います。",
    "対象の状態を短い言葉だけで示す時は `Badge` を使います。",
  ],
  usage: [
    "`label` を題名として、アイコンと一緒に役割の色で塗ったピルに書き、childrenの本文と操作（`ActionLink` など）をその下に置きます。childrenを省くと題名だけの知らせになります。",
    "`tone` で役割を選びます（`info`・`success`・`warning`・`danger`）。白いカードの上側をその色でうっすら染め、ピルのアイコンは `success` でチェック、`danger` でバツ、他はiにします。",
    "ピルはカードの上端にまたがるので、Noticeは自分の上にピルの半分の高さの余白を取ります。Noticeの中にNoticeを入れ子にもできます。",
    "`heading` を渡すと題名を `h2` で書き、ページの節の見出しとして読ませます。",
    "Noticeは描いた時の内容を示すだけで、自動では消えません。動的に出す時の読み上げや、いつ消すかは利用側で扱い、重大なエラーは自動で消しません。JavaScriptは使いません。",
  ],
  accessibility: [
    "`aside` で、`label` を読み上げ名にします。アイコンは読み上げから外します。",
    '`role` は付けません。画面を開いた後に出す時は、利用側で `role="status"` や `role="alert"` を付けて読み上げさせます。',
    "役割の色とアイコンの形は補助です。何が起きたかは題名と本文で伝えます。",
  ],
  propNotes: {
    Notice: { children: "題名の下に置く本文と操作。" },
  },
} satisfies ComponentDoc;
