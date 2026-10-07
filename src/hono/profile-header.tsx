import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type ProfileHeaderProps = ElementProps<"header"> & {
  /** 人やグループの名前。headingLevelの見出しで出す。 */
  name: string;
  /** 大きなアバター（Avatarのlarge）。 */
  avatar: Child;
  /** 名前の下の灰色の補足（メールアドレスなど）。 */
  detail?: Child;
  /** detailの下に置く小さなバッジ（所属など）。 */
  badge?: Child;
  /** 末尾側の上の角に置く操作（編集など）。 */
  actions?: Child;
  /** 罫線の下に枠と面を持たない形で並べる、この人への設定（通知・振り分けなど）。DropdownMenuやButtonを渡す。 */
  preferences?: Child;
  /** 名前の見出しの段（既定はh1）。 */
  headingLevel?: 1 | 2 | 3;
};

/**
 * 先頭側の四角い大きなアバターの横に名前・補足・バッジを積み、その下の罫線の後ろに、この人への設定を並べる。
 */
export const ProfileHeader = ({
  name,
  avatar,
  detail,
  badge,
  actions,
  preferences,
  headingLevel = 1,
  class: className,
  ...attributes
}: ProfileHeaderProps) => {
  const Heading = `h${headingLevel}` as const;
  return (
    <header {...attributes} class={classes("rx-profile-header", className)}>
      {badge != null && badge !== false && <span class="badge">{badge}</span>}
      {actions != null && actions !== false && <span class="actions">{actions}</span>}
      <span class="avatar">{avatar}</span>
      <Heading class="name">{name}</Heading>
      {detail != null && detail !== false && <p class="detail">{detail}</p>}
      {preferences != null && preferences !== false && <div class="preferences">{preferences}</div>}
    </header>
  );
};
