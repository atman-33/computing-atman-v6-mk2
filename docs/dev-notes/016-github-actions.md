# GitHub Actions を設定

## 参考URL

[GitHub Actionsでメタデータファイル(action.yml)を作成してワークフローを共通化しよう！](https://qiita.com/shun198/items/e7b7a3d9d3b86aec4813)

## package.jsonにCI用コマンドを追加

`package.json`

```json
  "scripts": {
    // ...
    "---- CI SECTION ----": "---- ---- ---- ---- ----",
    "ci:lint": "npm run lint",
    "ci:build": "npx env-cmd -f .env.example npm run build",
    "ci:test": "npm run test",
  }
```

## アクションファイル

`.github/workflows/on-pr.yml`

```yml
name: CI
on:
  push:
    branches:
      - main
  pull_request:

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - run: npm ci # 正確なバージョンのパッケージをインストール

      - run: npm run ci:lint
      - run: npm run ci:build
      - run: npm run ci:test
```

実行内容は下記  

- **lint**
- **build** - 各プロジェクトのCI用ビルドでは、`.env.example`を利用する。
- **test**
