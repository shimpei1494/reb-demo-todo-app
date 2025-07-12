# アプリ概要
モダンなTODOアプリケーション

## アプリ構成
- **メインページ**: TODO管理画面
- **統計ページ**: 完了率や優先度別統計
- **設定ページ**: アプリ設定

# 技術構成

## フロントエンド
- **TypeScript**: 型安全な開発
- **React 18**: UIライブラリ
- **Mantine v7**: UIコンポーネントライブラリ
- **React Router v6**: ルーティング
- **Tabler Icons**: アイコンライブラリ
- **date-fns**: 日付操作ライブラリ

## 開発環境
- **Vite v7**: ビルドツール・開発サーバー
- **Biome v2**: リンター・フォーマッター
- **Vitest v2**: テストランナー
- **Testing Library**: コンポーネントテスト

## データ管理
- **React Context**: 状態管理
- **Custom Hooks**: ビジネスロジック
- **LocalStorage**: データ永続化

## アーキテクチャ
```
src/
├── components/        # UIコンポーネント
│   ├── Layout.tsx     # 共通レイアウト
│   ├── Navigation.tsx # ナビゲーション
│   └── todo/         # TODO関連コンポーネント
├── context/          # React Context
├── hooks/            # カスタムフック
├── pages/            # ページコンポーネント
├── types/            # TypeScript型定義
└── utils/            # ユーティリティ関数
```
