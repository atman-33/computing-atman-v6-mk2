# Render.com にデプロイする方法

## Render.com Web URL

[Render.Com](https://dashboard.render.com/)

## ステップ

### 1. package.json にデプロイ用のスクリプトを準備

 `package.json`

```json
  "scripts": {
    ...
    "--- CD SECTION ---": "--- --- --- --- ---",
    "cd:build": "npm run build",
    "cd:start": "npm run start"
  },
```

### 2. デプロイ時のNode ver. を指定

Node ver. を指定していない場合は、追記しておく。  

e.g. v20.0.0以上を指定する場合  

`package.json`

```json
  ...,
  "engines": {
    "node": ">=20.0.0"
  }
  ...
```

### 3. デプロイ用設定（Render.com）

#### Build Command

##### Prismaを利用しない場合  

```bash
npm cache verify && rm -rf node_modules && node --version && npm install --force && npm run cd:build
```

##### Prismaを利用する場合  

```bash
npm cache verify && rm -rf node_modules && node --version && npm install --force && npx prisma generate && npm run cd:build
```

#### Start Command  

```bash
npm run cd:start
```

#### Environment Variables

デプロイ環境に必要な環境変数を設定する。  

e.g.  

```sh
PORT=3000

DATABASE_URL='mongodb://monty:pass@localhost:27017/mongo_dev?authSource=admin&directConnection=true'

# API GraphQL URL
API_GQL_URL='http://localhost:3000/api/graphql'

# セッション暗号化キー
SESSION_SECRET='****'

# Google認証
CLIENT_URL='http://localhost:3000'
GOOGLE_CLIENT_ID='****'
GOOGLE_CLIENT_SECRET='****'
```

> Render.comは`PORT: 10000`を設定すること（**PORTを設定していなければ、画面が空白になってしまうため注意！**）
