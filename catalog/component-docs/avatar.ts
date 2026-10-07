import type { ComponentDoc } from "../reference";

export default {
  id: "avatar",
  name: "Avatar",
  description: "人物やチームを、名前と一緒に示します。",
  api: ["Avatar", "AvatarGroup"],
  guidance: [
    "担当者や参加者など、人やチームを名前と一緒に示す時に使います。",
    "複数の人をまとめて示す時は `AvatarGroup` で重ねて並べます。",
    "一人を大きなアバターと名前で見出しにする時は `ProfileHeader` を使います。",
  ],
  usage: [
    "`name` と `initials` を渡します。アバターには略称を書き、`tone` で塗りを変えます。色だけで人を見分けさせず、隣に名前を書きます。",
    "`src` を渡すと画像を重ねます。`AvatarController` を `avatar` として登録すると、画像を読み込めた時だけ表示し、読み込み中と失敗した時は略称を残します。JavaScriptがない時は略称だけを表示します。",
    "`size` は `inline`（20px、文の中）・`small`（28px、一覧の行）・`default`（36px）・`large`（48px）です。",
    "`AvatarGroup` の中に `Avatar` を並べると、アバターを6pxずつ重ね、後のアバターを手前にして作業面の色の輪で切り分けます。並べきれない人数は `more` で「+n」の表示にします。`size` は中のAvatarと同じ大きさを渡します。",
  ],
  accessibility: [
    '`Avatar` は `role="img"` で、`name` を名前にします。画像の `alt` は空にし、名前はアバターが持ちます。',
    '`AvatarGroup` は `role="group"` で `label` を名前にします。「+n」の表示は読み上げないので、`label` に「ほか12名」のように残りの人数を含めます。',
  ],
  propNotes: {
    AvatarGroup: { children: "並べる `Avatar`。Avatar以外は置きません。" },
  },
} satisfies ComponentDoc;
