# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code (claude.ai/code)にガイダンスを提供します。

## 開発コマンド

### 基本開発
- `npm run dev` - http://localhost:5173 で開発サーバーを起動
- `npm run build` - 本番用にビルド
- `npm run preview` - 本番ビルドをプレビュー

### テスト
- `npm run test` - すべてのテストを実行
- `npm run test:watch` - ウォッチモードでテストを実行
- `npm run test:coverage` - カバレッジレポートを生成
- `vitest run src/components/todo/TodoItem.test.tsx` - 特定のテストファイルを実行

### コード品質
- `npm run lint` - Biome linterを実行
- `npm run format` - Biomeでコードをフォーマット
- `npm run type-check` - TypeScriptの型チェックを実行

## アーキテクチャ概要

### 技術スタック
- **フロントエンド**: React 18 with TypeScript
- **UIフレームワーク**: Mantine v7 with Tabler Icons
- **ビルドツール**: Vite v7
- **テスト**: Vitest with React Testing Library
- **リンティング/フォーマット**: Biome v2
- **ルーティング**: React Router v6
- **データ永続化**: LocalStorage

### 主要アーキテクチャパターン

#### 状態管理
- **中央フック**: `useTodos` フックがすべてのTODO状態と操作を管理
- **LocalStorage統合**: localStorageとの自動同期
- **イミュータブル更新**: すべての状態更新で新しいオブジェクト/配列を作成

#### コンポーネントアーキテクチャ
- **レイアウトパターン**: `Layout` コンポーネントがナビゲーションを含むすべてのページをラップ
- **ページコンポーネント**: 各ルートに専用のページコンポーネント (TodoPage, StatsPage, SettingsPage)
- **機能コンポーネント**: TODO固有のコンポーネントを `components/todo/` でグループ化

#### データフロー
1. `useTodos` フックがマウント時にlocalStorageからデータを読み込み
2. すべてのCRUD操作はフックメソッドを通じて実行
3. 状態変更が自動的にlocalStorageに永続化
4. コンポーネントはフック経由でデータとコールバックを受信

#### 型システム
- **コア型**: `Todo`, `TodoFilter`, `TodoStats` がデータ構造を定義
- **アクション型**: 将来のreducerパターンのための `TodoAction` ユニオン型
- **厳密な型付け**: すべてのコンポーネントとフックが完全に型付け

### 重要な実装詳細

#### TODOデータモデル
```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags?: string[];
}
```

#### ストレージ戦略
- **キー**: localStorageの `'todos'`
- **シリアライゼーション**: 読み込み/保存時にDateを変換するJSON
- **エラーハンドリング**: パース エラー時に空配列へのグレースフル フォールバック

#### ソートロジック
TODOは以下の順序でソート:
1. 完了状態 (未完了を先頭)
2. 優先度 (高 → 中 → 低)
3. 作成日時 (新しい順)

### テスト戦略
- **ユニットテスト**: 各コンポーネント、フック、ユーティリティに対応する `.test.ts/.tsx` ファイル
- **統合テスト**: `tests/integration/` のフルユーザーフロー
- **テストユーティリティ**: `src/test-utils/render.tsx` のすべてのプロバイダーを含むカスタムレンダー関数
- **モック**: `src/test-utils/mocks.ts` の事前定義されたモックデータ

### ファイル構成
- **型**: `src/types/` で中央管理
- **フック**: カスタムフックは `src/hooks/` 内
- **ユーティリティ**: 純粋関数は `src/utils/` 内
- **コンポーネント**: UIコンポーネントとテストを併置
- **ページ**: ルートコンポーネントは `src/pages/` 内
- **テストユーティリティ**: 共有テストユーティリティは `src/test-utils/` 内

# 重要な指示リマインダー
求められたことを実行する；それ以上でも以下でもない。
目標達成に絶対必要でない限り、ファイルを作成しない。
新しいファイルを作成するよりも、既存のファイルを編集することを常に優先する。
ユーザーに明示的に要求されない限り、ドキュメントファイル（*.md）やREADMEファイルを積極的に作成しない。