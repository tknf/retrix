import { Avatar, AvatarGroup, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <div class="catalog-person">
        <Avatar name="田中 遥" initials="田" />
        <span>田中 遥</span>
      </div>
      <div class="catalog-person">
        <Avatar name="佐藤 健" initials="佐" size="small" tone="green" />
        <span>佐藤 健</span>
      </div>
      <div class="catalog-person">
        <Avatar name="編集チーム" initials="編" tone="amber" />
        <span>仕事場の案内を担当する編集チーム</span>
      </div>
      <div class="catalog-person">
        <Avatar name="Alex Morgan" initials="AM" tone="coral" />
        <span>Alex Morgan</span>
      </div>
      <div class="catalog-person">
        <Avatar name="田中 遥" initials="田" size="inline" />
        <span>行内の担当者</span>
      </div>
      <div class="catalog-person">
        <Avatar name="プロフィール" initials="編" size="large" tone="green" />
        <span>プロフィール</span>
      </div>
      <div class="catalog-person">
        <Avatar name="山本 彩" initials="山" src="/assets/sample-avatar.svg" />
        <span>画像の読み込み状態</span>
      </div>
    </div>
    <DisclosureGroup label="AvatarGroupで重ねて並べる">
      <Disclosure summary="人数と残りの人数">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健">
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
            </AvatarGroup>
            <span>2人</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健、編集チーム">
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
              <Avatar name="編集チーム" initials="編" tone="amber" />
            </AvatarGroup>
            <span>3人</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="田中 遥、佐藤 健、編集チームほか12名" more={12}>
              <Avatar name="田中 遥" initials="田" />
              <Avatar name="佐藤 健" initials="佐" tone="green" />
              <Avatar name="編集チーム" initials="編" tone="amber" />
            </AvatarGroup>
            <span>並べきれない人数を添える</span>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="大きさと画像の混在">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="森 美咲、佐藤 健ほか2名" more={2} size="small">
              <Avatar name="森 美咲" initials="美" tone="green" size="small" />
              <Avatar name="佐藤 健" initials="健" size="small" />
            </AvatarGroup>
            <span>小さいアバター（一覧の行やスレッドの見出し）</span>
          </div>
          <div class="rx-cluster">
            <AvatarGroup label="Alex Morgan、山本 彩、プロフィール" size="large">
              <Avatar name="Alex Morgan" initials="AM" tone="coral" size="large" />
              <Avatar name="山本 彩" initials="山" src="/assets/sample-avatar.svg" size="large" />
              <Avatar name="プロフィール" initials="編" tone="green" size="large" />
            </AvatarGroup>
            <span>大きいアバターと画像</span>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="名前の文と並べる">
        <p class="rx-cluster">
          <AvatarGroup label="森 美咲、佐藤 健、田中 遥" size="small">
            <Avatar name="森 美咲" initials="美" tone="green" size="small" />
            <Avatar name="佐藤 健" initials="健" size="small" />
            <Avatar name="田中 遥" initials="田" tone="amber" size="small" />
          </AvatarGroup>
          <span>森 美咲、佐藤 健、田中 遥が参加しています</span>
        </p>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar" class="rx-cluster">
          <AvatarGroup label="ليلى، عمر" more={3}>
            <Avatar name="ليلى" initials="ل" tone="coral" />
            <Avatar name="عمر" initials="ع" />
          </AvatarGroup>
          <span>ليلى وعمر وثلاثة آخرون</span>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
