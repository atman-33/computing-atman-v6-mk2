# Prismaセットアップ

## ステップ

### 開発用DB（MongoDB）構築

`tools/database-local/setup-docker-mongo-single-replica.md`を参考にMongoDBを構築する。  

### Prismaをインストール

```sh
npm i -D prisma
npx prisma init
```

### shcemaをMongoDB用に設定

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// 以下、Model定義...
```
