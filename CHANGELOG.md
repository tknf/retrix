# 変更履歴

このプロジェクトの利用者に関わる変更を記録します。

書式は[Keep a Changelog](https://keepachangelog.com/ja/1.1.0/)に、版の付け方は[Semantic Versioning](https://semver.org/lang/ja/)に従います。

## [Unreleased]

### Changed

- SurfaceとAppShellの作業面を、内容が短い画面でも下端まで伸ばす。長い内容はページのスクロールで読める高さを保つ。

## [1.0.0] - 2026-10-08

### Changed

- 初期登録用の0.1.0と同じコンポーネント・公開APIを、正式版1.0.0として公開。

## [0.1.0] - 2026-10-08

npmの初期登録用の版です。

### Added

- Basecamp 2・Highriseの画面を手本にした、管理画面・業務システム向けの全91コンポーネントを追加。CSS、Hono JSXのSSRコンポーネント、Stimulus controllerを提供する。
- ヘッダー・作業面・上の階層（trail）・先頭側の列（aside）を中央に揃えるAppShellを追加。
- Tableの並べ替え、行の選択と一括操作、列幅の変更とcookieへの保存、保存した幅でのSSRを追加。
- 色・文字・余白・選択状態を共通トークンにまとめたライトテーマを追加。
- 導入ガイド、コンポーネントリファレンス、カタログ、Retrixを使って画面を組むためのAgent Skillをリポジトリに同梱。
