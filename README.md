# TODO App

TypeScript + Mantine v7 + Vite v7 + Biome v2 + Vitestを使用したモダンなTODOアプリケーション

## 特徴

- **TypeScript**: 型安全なコード開発
- **Mantine v7**: モダンなUIコンポーネント
- **Vite v7**: 高速ビルドツール
- **Biome v2**: 高速リンター・フォーマッター
- **Vitest**: 高速テストランナー
- **React Router**: 複数ページ対応
- **ローカルストレージ**: データ永続化

## 機能

- ✅ TODO項目の追加・削除・完了状態切り替え
- ✅ 優先度設定（高・中・低）
- ✅ 期限設定
- ✅ 説明文追加
- ✅ フィルタリング（全て/未完了/完了済み）
- ✅ 統計ページ（完了率、項目数など）
- ✅ 設定ページ（データ管理）
- ✅ レスポンシブデザイン

## 技術スタック

- **フロントエンド**: React 18, TypeScript
- **UI**: Mantine v7, Tabler Icons
- **ルーティング**: React Router v6
- **ビルド**: Vite v7
- **テスト**: Vitest, React Testing Library
- **リンター・フォーマッター**: Biome v2
- **データ管理**: LocalStorage

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ブラウザで `http://localhost:5173` を開く

## 利用可能なスクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run preview` - ビルド結果のプレビュー
- `npm run test` - テスト実行
- `npm run test:watch` - テストウォッチモード
- `npm run test:coverage` - カバレッジレポート生成
- `npm run lint` - Biomeでのリント
- `npm run format` - Biomeでのフォーマット
- `npm run type-check` - TypeScript型チェック

## プロジェクト構造

```
src/
├── components/          # UIコンポーネント
│   ├── Layout.tsx      # レイアウト
│   ├── Navigation.tsx  # ナビゲーション
│   └── todo/           # TODO関連コンポーネント
├── pages/              # ページコンポーネント
│   ├── TodoPage.tsx    # TODOメインページ
│   ├── StatsPage.tsx   # 統計ページ
│   └── SettingsPage.tsx # 設定ページ
├── hooks/              # カスタムフック
│   └── useTodos.ts     # TODO管理フック
├── utils/              # ユーティリティ
│   └── storage.ts      # ストレージ管理
├── types/              # TypeScript型定義
│   └── todo.ts         # TODO型定義
└── test-utils/         # テストユーティリティ
```

## テスト

- **単体テスト**: コンポーネント、フック、ユーティリティ
- **統合テスト**: 複数コンポーネント間の連携
- **カバレッジ**: 自動生成されるカバレッジレポート

テスト実行:
```bash
npm run test
```

カバレッジレポート生成:
```bash
npm run test:coverage
```

## ライセンス

MIT License