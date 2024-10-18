# Pothosセットアップ（GraphQLスキーマビルダー）

## 参考URL

- [PrismaとPothosでコード生成を使いながら効率よくGraphQLサーバーを作ってみる](https://zenn.dev/poyochan/articles/9f22799853784d#pothos%E3%81%AE%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E%E3%83%93%E3%83%AB%E3%83%80)

## ステップ

### Prismaスキーマ修正

`prisma/schema.prisma`

- PostStatusを追加
- Postを追加
- Tagを追加
- PostTagを追加

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

enum PostStatus {
  DRAFT
  PUBLIC
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String
  image     String?
  provider  String   @default("Credentials")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  Post Post[]
}

model Post {
  id      String     @id @default(auto()) @map("_id") @db.ObjectId
  title   String
  emoji   String
  content String
  tags    PostTag[]
  status  PostStatus @default(DRAFT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
}

model Tag {
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  name  String  @unique
  image String?

  // Postとのリレーション
  posts PostTag[]
}

model PostTag {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  postId String @db.ObjectId
  tagId  String @db.ObjectId

  // Postとのリレーション
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  // Tagとのリレーション
  tag Tag @relation(fields: [tagId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  // 複合主キーを設定
  @@unique(fields: [postId, tagId])
}
```

### 必要なパッケージをインストール

```sh
npm i @pothos/core @pothos/plugin-prisma @pothos/plugin-relay graphql-scalars
```

- @pothos/plugin-prisma: prismaの型を利用するために必要
- @pothos/plugin-relay: ページネーションを実装ために必要
- graphql-scalars: DateTime型を利用するために必要

### prisma.schemaの設定を変更

`prisma/schema.prisma`

- prisma-pothos-types の設定を追加

```s
generator pothos {
  provider     = "prisma-pothos-types"
}
```

- 追加した設定を反映する時は、`prisma generate`を実行する。

```sh
npx prisma generate
```

### スキーマビルダーを実装

`app/lib/graphql/builder.ts`

```ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import { Prisma } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from '~/lib/prisma';

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Connection: {
    totalCount: number | (() => number | Promise<number>);
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relay: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
```

### Postのオペレーションを実装

#### GraphQLノードを実装

`app/lib/graphql/schema/post/post.node.ts`

```ts
import { builder } from '~/lib/graphql/builder';

const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLIC'] as const,
});

// NOTE: prismaNodeのPostで、tagのリレーションを利用するために必要
builder.prismaObject('PostTag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    post: t.relation('post'),
    tag: t.relation('tag'),
  }),
});

builder.prismaNode('Post', {
  id: { field: 'id' },
  findUnique: (id) => ({ id }),
  fields: (t) => ({
    title: t.exposeString('title'),
    emoji: t.exposeString('emoji'),
    content: t.exposeString('content'),
    status: t.expose('status', { type: PostStatus }),
    author: t.relation('author'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    tags: t.relation('tags'),
  }),
});
```

#### クエリフィールドを実装

クエリ用のDTOを作成する。  

`app/lib/graphql/schema/post/dto/args/get-post-args.dto.ts`

```ts
import { builder } from '~/lib/graphql/builder';

export const GetPostArgs = builder.inputType('GetPostArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
```

クエリフィールドを作成する。  

`app/lib/graphql/schema/post/post.query.ts`

```ts
import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/lib/graphql/builder';
import { prisma } from '~/lib/prisma';
import { GetPostArgs } from './dto/args/get-post-args.dto';

builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      args: t.arg({
        type: GetPostArgs,
        required: true,
      }),
    },
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id);
      return await prisma.post.findUnique({
        ...query,
        where: { id: rawId },
      });
    },
  }),
);

builder.queryField('posts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query) => prisma.post.findMany({ ...query }),
    totalCount: () => prisma.post.count(),
  }),
);
```
