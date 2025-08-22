# ちまうた (Chimauta) - VTuber Song Archive

ちまうた is a Japanese fan website for VTuber Machita Chima (町田ちま) that allows users to search and play her songs from YouTube archives. The site has a vanilla HTML/CSS/JavaScript frontend and a Google Apps Script backend.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap the Repository

- Clone the repository: `git clone https://github.com/Chimachans-Engineer-Group/chimauta.git`

# ちまうた (Chimauta) - VTuber 楽曲アーカイブ

## コミットメッセージについて

- コミットメッセージは必ず日本語で記述してください。
- 例: `手順書を日本語化`、`バグ修正: APIエンドポイントのURL修正` など

ちまうたは、VTuber 町田ちまの楽曲を YouTube アーカイブから検索・再生できる日本語ファンサイトです。フロントエンドはバニラ HTML/CSS/JavaScript、バックエンドは Google Apps Script で構成されています。

まず本手順書を参照し、ここに記載のない情報や想定外の事象のみ検索やコマンド実行で対応してください。

## 効率的な作業のために

### リポジトリの初期化

- リポジトリをクローン: `git clone https://github.com/Chimachans-Engineer-Group/chimauta.git`
- `cd chimauta`
- パッケージインストール不要 - バニラ Web 技術のみ使用

### フロントエンド開発

- ローカルサーバー起動: `cd frontend && python3 -m http.server 8000`（2-3 秒で起動。絶対に中断しないこと）
- ブラウザで `http://localhost:8000` を開く
- フロントエンドは単体で動作するが、バックエンド未接続時は API エラーが表示される
- フロントエンドの主なファイルは `/frontend/`：
  - `index.html` - メイン HTML（YouTube プレイヤー埋込）
  - `css/base.css` - 基本スタイル・CSS 変数
  - `css/detail.css` - コンポーネント・レスポンシブ用スタイル
  - `js/app.js` - アプリ初期化・エントリーポイント
  - `js/constants.js` - 定数定義
  - `js/data.js` - データ取得・管理
  - `js/dom.js` - DOM 操作ユーティリティ
  - `js/player.js` - YouTube プレイヤー制御
  - `js/search.js` - 検索ロジック
  - `js/state.js` - アプリ状態管理
  - `js/ui.js` - UI 描画・更新
  - `img/` - アイコン・画像アセット

### Backend Development (Google Apps Script)

- Install clasp (Google Apps Script CLI): `npm install -g @google/clasp` -- takes 5-10 seconds. NEVER CANCEL.
- Backend files are in `/backend/src/`:
  - `API.js` - Main API endpoint that serves song/video data as JSON
  - `const.js` - Shared constants and spreadsheet sheet proxy
  - `onSheetChange.js` - Trigger functions for spreadsheet changes
  - `util.js` - Duration parsing and formula conversion utilities
  - `appsscript.json` - Apps Script project configuration

### バックエンド開発（Google Apps Script）

- clasp（Google Apps Script CLI）をインストール: `npm install -g @google/clasp`（5-10 秒。絶対に中断しないこと）
- バックエンドの主なファイルは `/backend/src/`：
  - `API.js` - 楽曲・動画データを JSON で返す API エンドポイント
  - `const.js` - 定数・スプレッドシート操作
  - `onSheetChange.js` - シート変更トリガー
  - `util.js` - 時間パース・数式変換ユーティリティ
  - `appsscript.json` - Apps Script プロジェクト設定

### Setting Up Backend (First Time)

- IMPORTANT: Backend deployment requires Google authentication and a valid Google Apps Script project
- Copy `.clasp.json.sample` to `.clasp.json` and add your script ID: `cp backend/.clasp.json.sample backend/.clasp.json`
- Edit `.clasp.json` to include your Google Apps Script project ID
- Login to Google Apps Script: `cd backend && clasp login` (requires browser authentication)
- Push backend code: `cd backend && clasp push` -- takes 5-10 seconds. NEVER CANCEL.
- Deploy as web app: `cd backend && clasp deploy` -- takes 5-10 seconds. NEVER CANCEL.

### バックエンド初期設定

- ※Google 認証と有効な Apps Script プロジェクトが必要
- `.clasp.json.sample` を `.clasp.json` にコピーしスクリプト ID を記入: `cp backend/.clasp.json.sample backend/.clasp.json`
- `.clasp.json` を編集しプロジェクト ID を設定
- Google Apps Script にログイン: `cd backend && clasp login`（ブラウザ認証）
- コードをプッシュ: `cd backend && clasp push`（5-10 秒。絶対に中断しないこと）
- Web アプリとしてデプロイ: `cd backend && clasp deploy`（5-10 秒。絶対に中断しないこと）

## 動作確認

### Frontend Testing

- ALWAYS start the local HTTP server: `cd frontend && python3 -m http.server 8000`
- Verify the website loads at `http://localhost:8000`
- Check that the page structure displays correctly (header, search box, song table placeholder)
- The site will show "読込中..." (Loading...) and then an error message about failing to fetch songList - this is expected without backend connection
- ALWAYS test responsive design by resizing browser window to mobile/tablet sizes

### Backend Testing

- Backend can only be fully tested when deployed to Google Apps Script with proper authentication
- Without deployment, you can syntax-check JavaScript files but cannot test API functionality
- The live API endpoint is hardcoded in `frontend/js/main.js` line 15

### Manual Validation Scenarios

- ALWAYS validate that the HTML structure loads correctly after making frontend changes
- Test search functionality (requires backend connection for full testing)
- Test YouTube player integration (requires valid video data from backend)
- Verify responsive design on mobile/tablet/desktop viewports

## Project Structure

### Key Files and Directories

### フロントエンドテスト

- 必ずローカル HTTP サーバーを起動: `cd frontend && python3 -m http.server 8000`
- `http://localhost:8000` でサイトが表示されることを確認
- ページ構造（ヘッダー、検索ボックス、楽曲テーブルプレースホルダ）が正しく表示されるか確認
- バックエンド未接続時は「読込中...」の後、songList 取得失敗のエラーが出るのが正常
- ブラウザ幅を変えてモバイル/タブレット表示も必ず確認

### バックエンドテスト

- Google Apps Script にデプロイし認証済みでのみ完全なテストが可能
- デプロイ前は JS ファイルの構文チェックのみ可能。API 動作は不可
- API エンドポイント URL は `frontend/js/main.js` の 15 行目にハードコード

### 手動バリデーションシナリオ

- フロントエンド修正後は必ず HTML 構造が正しく表示されるか確認
- 検索機能の動作確認（要バックエンド接続）
- YouTube プレイヤー連携確認（要有効な動画データ）
- モバイル/タブレット/デスクトップでレスポンシブ確認

## プロジェクト構成

### 主なファイル・ディレクトリ

```
├── frontend/           # Static website files
│   ├── index.html      # Main page (single-page application)
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript application logic
│   └── img/           # Icons and images
├── backend/           # Google Apps Script backend
│   ├── src/           # Apps Script source files
│   ├── .clasp.json.sample  # Template for clasp configuration
│   └── .gitignore     # Excludes .clasp.json from git
├── README.md          # Project documentation (in Japanese)
└── LICENSE           # MIT license
├── frontend/           # 静的Webサイト
│   ├── index.html      # メインページ（SPA）
│   ├── css/           # スタイルシート
│   ├── js/            # JavaScriptロジック
│   └── img/           # アイコン・画像
├── backend/           # Google Apps Scriptバックエンド
│   ├── src/           # Apps Scriptソース
│   ├── .clasp.json.sample  # clasp設定テンプレート
│   └── .gitignore     # .clasp.jsonをgit除外
├── README.md          # プロジェクト説明（日本語）
└── LICENSE           # MITライセンス
```

### Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript + YouTube IFrame Player API, Font Awesome (via CDN)
- **Backend**: Google Apps Script, YouTube Data API v3
- **Database**: Google Spreadsheet (tracks and videos sheets)
- **Deployment**: Cloudflare Pages (frontend), Google Apps Script (backend)
- **Development Tools**: clasp, Python HTTP server, Visual Studio Code

### 技術スタック

- **フロントエンド**: バニラ HTML, CSS, JavaScript + YouTube IFrame Player API, Font Awesome（CDN）
- **バックエンド**: Google Apps Script, YouTube Data API v3
- **データベース**: Google スプレッドシート（tracks, videos シート）
- **デプロイ**: Cloudflare Pages（フロント）、Google Apps Script（バック）
- **開発ツール**: clasp, Python HTTP サーバー, Visual Studio Code

## よく使う作業

### Making Frontend Changes

- Edit files in `/frontend/` directory
- Start local server: `cd frontend && python3 -m http.server 8000`
- Test changes at `http://localhost:8000`
- No build process required - changes are immediate

### フロントエンド修正

- `/frontend/` 内のファイルを編集
- ローカルサーバー起動: `cd frontend && python3 -m http.server 8000`
- `http://localhost:8000` で動作確認
- ビルド不要 - 変更は即時反映

### Making Backend Changes

- Edit files in `/backend/src/` directory
- Test syntax: `cd backend && clasp status` (requires valid .clasp.json)
- Deploy changes: `cd backend && clasp push && clasp deploy` -- each command takes 5-10 seconds. NEVER CANCEL.

### バックエンド修正

- `/backend/src/` 内のファイルを編集
- 構文チェック: `cd backend && clasp status`（.clasp.json 必須）
- デプロイ: `cd backend && clasp push && clasp deploy`（各 5-10 秒。絶対に中断しないこと）

### Deployment

- **Frontend**: Automatically deployed via Cloudflare Pages when pushed to main branch
- **Backend**: Manual deployment via `clasp deploy` command
- The frontend fetches data from the deployed Google Apps Script web app URL

### デプロイ

- **フロント**: main ブランチ push で Cloudflare Pages 自動デプロイ
- **バック**: `clasp deploy`コマンドで手動デプロイ
- フロントはデプロイ済み Google Apps Script の Web アプリ URL からデータ取得

## 注意事項

### Timing Expectations

- Frontend server startup: 2-3 seconds
- clasp installation: 5-10 seconds
- clasp push/deploy: 5-10 seconds each
- NEVER CANCEL these operations - they complete quickly

### 所要時間目安

- フロントサーバー起動: 2-3 秒
- clasp インストール: 5-10 秒
- clasp push/deploy: 各 5-10 秒
- これらの操作は絶対に中断しないこと - すぐ終わります

### Limitations in Sandboxed Environments

- External CDN resources (fonts, icons) may be blocked
- Google Apps Script authentication requires browser access
- YouTube API requires valid API keys and deployed backend
- Full functionality testing requires live deployment

### サンドボックス環境での制限

- 外部 CDN リソース（フォント・アイコン等）がブロックされる場合あり
- Google Apps Script 認証はブラウザ必須
- YouTube API は有効な API キーとデプロイ済みバックエンドが必要
- 全機能テストには Google サービスへのアクセスが必要

### File Locations to Remember

- Main application logic: `frontend/js/main.js`
- API endpoint code: `backend/src/API.js`
- Styles: `frontend/css/base.css` and `frontend/css/detail.css`
- Configuration: `backend/src/appsscript.json`

### 重要ファイルの場所

- メインロジック: `frontend/js/main.js`
- API エンドポイント: `backend/src/API.js`
- スタイル: `frontend/css/base.css`, `frontend/css/detail.css`
- 設定: `backend/src/appsscript.json`

### 主な出力例

#### Repository Root

#### リポジトリルート

```
$ ls -la
LICENSE
README.md
README.md
backend/
frontend/
```

#### Frontend Directory

#### フロントエンドディレクトリ

```
$ ls frontend/
css/
img/
img/
index.html
js/
```

#### Backend Source Directory

#### バックエンドソースディレクトリ

```
$ ls backend/src/
API.js
appsscript.json
const.js
onSheetChange.js
util.js
```

## トラブルシューティング

### Frontend Issues

- If website doesn't load: Ensure HTTP server is running on port 8000
- If styles are missing: Check that CSS files exist in `frontend/css/`
- If JavaScript errors occur: Check browser console for specific error messages

### フロントエンドの問題

- サイトが表示されない: HTTP サーバーが 8000 番で起動しているか確認
- スタイルが反映されない: `frontend/css/`に CSS ファイルがあるか確認
- JavaScript エラー: ブラウザのコンソールでエラー内容を確認

### Backend Issues

- If clasp commands fail: Ensure you're authenticated with `clasp login`
- If push fails: Check that `.clasp.json` has valid script ID
- If API returns errors: Verify Google Apps Script deployment is active

### バックエンドの問題

- clasp コマンド失敗: `clasp login`で認証済みか確認
- push 失敗: `.clasp.json`に有効なスクリプト ID があるか確認
- API エラー: Google Apps Script のデプロイ状況を確認

### External Dependencies

- The site uses external CDNs that may be blocked in restricted environments
- YouTube API functionality requires backend deployment with valid API credentials
- Full testing requires access to Google Services

### 外部依存

- 外部 CDN は制限環境でブロックされる場合あり
- YouTube API は有効なバックエンドと API キーが必要
- 全機能テストには Google サービスへのアクセスが必要
