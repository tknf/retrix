import { ActionTile, Disclosure, DisclosureGroup } from "../../src/hono";
// セルは4〜5.5remで、入る数だけ並べる（文字を大きくした狭い画面では一列になる）。
const grid =
  "display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 4rem), 5.5rem)); gap: 0.5rem";
export default () => (
  <div class="rx-stack">
    <div style={grid}>
      <ActionTile href="/" label="カタログ" icon="grid" accent="green" current />
      <ActionTile href="/components/field" label="入力" icon="pencil" />
      <ActionTile href="/apps/schedule?view=year" label="予定" icon="calendar" accent="amber" />
      <ActionTile href="/components/toast" label="通知" icon="mail" accent="coral" />
    </div>
    <DisclosureGroup label="操作・キーとバッジ・使えない状態・長い名前・右から左">
      <Disclosure summary="ボタンとして押す操作">
        <div style={grid}>
          <ActionTile label="公開する" icon="check" />
          <ActionTile label="複製する" icon="files" accent="amber" />
          <ActionTile label="削除する" icon="trash" accent="coral" />
        </div>
      </Disclosure>
      <Disclosure summary="ショートカットキーの表示と状態バッジを添える">
        <div style={grid}>
          <ActionTile label="今すぐ返信" icon="reply" shortcut="R" badge="下書き" />
          <ActionTile label="あとで返信" icon="clock" shortcut="L" />
          <ActionTile label="取っておく" icon="layers" accent="green" shortcut="A" />
          <ActionTile href="/apps/search" label="検索" icon="search" shortcut="⌘K" />
        </div>
      </Disclosure>
      <Disclosure summary="使えないリンクと操作">
        <div style={grid}>
          <ActionTile href="/apps/search" label="報告" icon="chart" disabled />
          <ActionTile label="書き出す" icon="file" disabled />
        </div>
      </Disclosure>
      <Disclosure summary="名前が長い時は文節で折り返す">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 6rem)); gap: 0.75rem">
          <ActionTile label="下書きに戻す" icon="pencil" />
          <ActionTile label="分類をつける" icon="layers" accent="green" />
          <ActionTile label="ファイルを送る" icon="files" accent="amber" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div style={grid} dir="rtl" lang="ar">
          <ActionTile label="رد" icon="reply" shortcut="R" badge="مسودة" />
          <ActionTile label="لاحقًا" icon="clock" shortcut="L" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
