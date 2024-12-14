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

### singleton生成関数を作成

> 後で準備するPrismaClientはシングルトンで利用したいため、シングルトン生成用の関数を準備しておく。

`app/utils/singleton.ts`

```ts
export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
```

### PrismaClientを作成

`app/lib/prisma/index.ts`

```ts
import { PrismaClient } from '@prisma/client';
import { singleton } from '~/utils/singleton';

export const prisma = singleton('prisma', () => new PrismaClient());
```
