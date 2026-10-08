import type { ComponentDoc } from "../reference";

export default {
  id: "avatar",
  name: "Avatar",
  description: "人物やチームを、名前と一緒に示します。",
  api: ["Avatar", "AvatarGroup"],
  guidance: [
    "担当者や参加者など、人やチームを名前と一緒に示す時に使います。",
    "複数の人をまとめて示す時は `AvatarGroup` で並べます。",
    "一人を大きなアバターと名前で見出しにする時は `ProfileHeader` を使います。",
  ],
  usage: [
    "`name` と `initials` を渡します。アバターは枠の無い円で、写真が無い時は塗った円に白い太字の略称を置きます。`tone` が既定の `blue` の時は灰色で塗ります。`green`・`amber`・`coral` を渡した時だけ緑・金茶・赤茶で塗ります。色だけで人を見分けさせず、隣に名前を書きます。",
    "`src` を渡すと写真を円の中に重ねます。縁の線は引きません。`AvatarController` を `avatar` として登録すると、画像を読み込めた時だけ表示し、読み込み中と失敗した時は略称を残します。JavaScriptがない時は略称だけを表示します。",
    "`size` は `inline`（20px、文の中）・`small`（22px、詰めた一覧）・`default`（30px、一覧の行）・`large`（48px）です。略称の文字は `default` で11px、`inline`・`small` で10px、`large` で16pxです。",
    "`AvatarGroup` の中に `Avatar` を並べると、アバターを重ねずに2pxずつ空けて並べ、入らない時は折り返します。並べきれない人数は `more` で「+n」の表示にし、アバターの大きさにかかわらず高さ18pxの担当者のピル（平らな `#eeeeee` に灰色の11pxの文字、通常の太さ）に書いて、アバターの中央にそろえます。`size` は中のAvatarと同じ大きさを渡します。",
  ],
  accessibility: [
    '`Avatar` は `role="img"` で、`name` を名前にします。画像の `alt` は空にし、名前はアバターが持ちます。',
    '`AvatarGroup` は `role="group"` で `label` を名前にします。「+n」の表示は読み上げないので、`label` に「ほか12名」のように残りの人数を含めます。',
  ],
  propNotes: {
    AvatarGroup: { children: "並べる `Avatar`。Avatar以外は置きません。" },
  },
} satisfies ComponentDoc;
