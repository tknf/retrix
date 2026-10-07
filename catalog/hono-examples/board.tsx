import {
  Board,
  Choice,
  Tag,
  TagGroup,
  FileItem,
  Avatar,
  Progress,
  Disclosure,
  DisclosureGroup,
  ValueList,
} from "../../src/hono";

const card = (id: string, title: string, body?: string) => ({
  id,
  label: title,
  content: (
    <>
      <h4>{title}</h4>
      {body && <p>{body}</p>}
    </>
  ),
});

export default () => (
  <div class="rx-stack">
    <Board
      label="制作の進行"
      movable
      columns={[
        {
          id: "todo",
          title: "これから",
          items: [
            {
              id: "guide",
              code: "No. 12",
              label: "仕事場の案内を更新する",
              content: (
                <>
                  <h4>仕事場の案内を更新する</h4>
                  <p>料金とキャンセル条件を確認します。</p>
                  <TagGroup label="分類">
                    <Tag label="案内" accent="blue" />
                    <Tag label="Web" />
                  </TagGroup>
                </>
              ),
            },
            {
              id: "estimate",
              code: "No. 15",
              label: "見積内容の確認",
              content: (
                <>
                  <h4>見積内容の確認</h4>
                  <Choice label="見積金額を確認" />
                  <ValueList
                    items={[
                      { label: "金額", value: "128,000円" },
                      { label: "回答期限", value: "9月22日" },
                    ]}
                  />
                </>
              ),
            },
          ],
        },
        {
          id: "doing",
          title: "作業中",
          tone: "info",
          items: [
            {
              id: "reading",
              code: "No. 9",
              label: "秋の読書会のお知らせ",
              content: (
                <>
                  <h4>秋の読書会のお知らせ</h4>
                  <p class="rx-cluster">
                    <Avatar name="田中 遥" initials="遥" />
                    <span>田中 遥 · 9月20日</span>
                  </p>
                  <Progress label="原稿" value={60} />
                </>
              ),
            },
            {
              id: "document",
              code: "No. 10",
              label: "仕事場の案内.pdf",
              content: <FileItem name="仕事場の案内.pdf" description="PDF · 2.4 MB" />,
            },
          ],
        },
        {
          id: "done",
          title: "完了",
          tone: "success",
          items: [],
          empty: "終わった項目をここへ",
        },
      ]}
    />
    <p class="catalog-footnote">
      右上のハンドルで移動します。Space → 矢印キー →
      Enterでも操作できます。Escapeで元へ戻します。移動した項目は、置いた列の色に変わります。
    </p>
    <DisclosureGroup label="列と項目の違い">
      <Disclosure summary="列の色：状態ごとの見出しと項目の色、今の列" open>
        <Board
          label="問い合わせの対応"
          columns={[
            { id: "new", title: "受付", items: [card("q1", "予約の変更について")] },
            {
              id: "active",
              title: "対応中",
              current: true,
              items: [card("q2", "領収書の再発行", "今日の担当の列です。")],
            },
            {
              id: "hold",
              title: "保留",
              tone: "warning",
              items: [card("q3", "駐車場の利用", "管理会社の回答待ち。")],
            },
            {
              id: "returned",
              title: "差し戻し",
              tone: "danger",
              items: [card("q4", "請求先の住所", "番地が抜けています。")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="完了の列：移動すると置いた列の色に変わる">
        <Board
          label="原稿の承認"
          movable
          columns={[
            {
              id: "draft",
              title: "下書き",
              items: [card("d1", "10月の利用案内"), card("d2", "年末年始の営業")],
            },
            {
              id: "approved",
              title: "承認済み",
              tone: "success",
              items: [card("d3", "9月の利用案内", "森 美咲が承認しました。")],
            },
            {
              id: "rejected",
              title: "見送り",
              tone: "danger",
              items: [card("d4", "夏の特別料金")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="たたんだ列：件数と縦書きの名前のピル、押すと開いてたためる">
        <Board
          label="採用の進行"
          columns={[
            {
              id: "backlog",
              title: "応募",
              collapsed: true,
              collapsible: true,
              items: [card("a1", "応募1")],
            },
            {
              id: "interview",
              title: "面接",
              tone: "info",
              collapsible: true,
              items: [card("a2", "山本 さくら", "10月2日 14時"), card("a3", "高橋 大輔")],
            },
            {
              id: "offer",
              title: "内定",
              tone: "success",
              collapsible: true,
              items: [card("a4", "伊藤 蓮")],
            },
            {
              id: "closed",
              title: "見送り",
              tone: "danger",
              collapsed: true,
              collapsible: true,
              items: [card("a5", "応募5"), card("a6", "応募6"), card("a7", "応募7")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="項目の中身：担当者・分類・期限・チェック・進捗・ファイル">
        <Board
          label="イベントの準備"
          columns={[
            {
              id: "prep",
              title: "準備",
              tone: "info",
              items: [
                {
                  id: "venue",
                  label: "会場の手配",
                  content: (
                    <>
                      <h4>会場の手配</h4>
                      <p class="rx-cluster">
                        <Avatar name="佐藤 健" initials="健" tone="blue" />
                        <span>佐藤 健 · 期限 10月1日</span>
                      </p>
                      <TagGroup label="分類">
                        <Tag label="会場" accent="green" />
                        <Tag label="急ぎ" accent="coral" />
                      </TagGroup>
                    </>
                  ),
                },
                {
                  id: "checklist",
                  label: "当日の持ち物",
                  content: (
                    <>
                      <h4>当日の持ち物</h4>
                      <Choice label="名札" checked />
                      <Choice label="延長コード" />
                      <Progress label="準備" value={1} max={2} />
                    </>
                  ),
                },
                {
                  id: "floor",
                  label: "会場の見取り図.png",
                  content: <FileItem name="会場の見取り図.png" description="PNG · 820 KB" />,
                },
              ],
            },
            {
              id: "notice",
              title: "告知",
              items: [card("n1", "案内メールの文面", "参加者への案内を書きます。")],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="たくさんの項目と長い文">
        <Board
          label="修正の依頼"
          columns={[
            {
              id: "many",
              title: "受付",
              items: [
                card("m1", "見出しの誤字"),
                card("m2", "リンク切れ"),
                card("m3", "画像の代替文"),
                card("m4", "表の列幅"),
                card("m5", "日付の表記"),
                card("m6", "フッターの住所"),
              ],
            },
            {
              id: "long",
              title: "海外拠点から届いた、とても長い名前の列の見出し",
              items: [
                card(
                  "l1",
                  "海外拠点から届いた、2026年度秋の利用方法と受付変更に関する詳しい資料",
                  "review-abcdefghijklmnopqrstuvwxyz0123456789",
                ),
              ],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="移動不可の項目・空の列・受付終了の列">
        <Board
          label="確認の進行"
          movable
          columns={[
            {
              id: "waiting",
              title: "確認待ち",
              items: [
                {
                  id: "locked",
                  label: "確認が完了した資料",
                  disabled: true,
                  content: (
                    <>
                      <h4>確認が完了した資料</h4>
                      <p>この項目は移動できません。</p>
                    </>
                  ),
                },
                card("free", "動かせる資料"),
              ],
            },
            { id: "review", title: "レビュー", items: [] },
            {
              id: "locked-column",
              title: "受付終了",
              disabled: true,
              items: [],
              empty: "この列へは移動できません",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：列が縦に積まれる">
        <div style="max-inline-size: 28rem">
          <Board
            label="狭い場所の進行"
            columns={[
              { id: "s1", title: "これから", items: [card("s1a", "原稿を書く")] },
              { id: "s2", title: "作業中", tone: "info", items: [card("s2a", "写真を選ぶ")] },
              {
                id: "s3",
                title: "完了",
                tone: "success",
                collapsed: true,
                items: [card("s3a", "取材")],
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <Board
            label="تقدم العمل"
            movable
            columns={[
              {
                id: "rtl-todo",
                title: "للقيام",
                items: [card("r1", "تحديث دليل المكان", "مراجعة الأسعار وشروط الإلغاء.")],
              },
              {
                id: "rtl-doing",
                title: "قيد التنفيذ",
                tone: "info",
                items: [card("r2", "اختيار الصور")],
              },
              {
                id: "rtl-done",
                title: "مكتمل",
                tone: "success",
                collapsed: true,
                items: [card("r3", "المقابلة")],
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
