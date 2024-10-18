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

### パッケージをインストール

```sh
npm i @pothos/core @pothos/plugin-prisma @pothos/plugin-relay graphql-scalars
```

- @pothos/plugin-prisma: prismaの型を利用するために必要
- @pothos/plugin-relay: ページネーションを実装ために必要
- graphql-scalars: DateTime型を利用するために必要

```sh
npm i @pothos/plugin-simple-objects
```

- Pothos GraphQL スキーマビルダー用のプラグインで、単純なオブジェクト型を定義するプラグイン

> ログイン処理のような簡単な Mutation の場合、戻り値は単純なオブジェクトであることが多く、token のような文字列フィールドのみを持つケースが一般的です。
> @pothos/plugin-simple-objects を使うと、そうした単純な構造の型を短いコードで定義できます。

```sh
npm i @pothos/plugin-scope-auth
```

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

コンテキストを準備する。  

`app/lib/graphql/context.ts`

```ts
import { User } from '@prisma/client';
import { type YogaInitialContext } from 'graphql-yoga';

export interface Context extends YogaInitialContext {
  user?: User;
}
```

スキーマビルダーを準備する。  

`app/lib/graphql/builder.ts`

```ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import { Prisma } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from '~/lib/prisma';
// eslint-disable-next-line import/no-named-as-default
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
// eslint-disable-next-line import/no-named-as-default
import PothosSimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import { Context } from './context';

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  // NOTE: 権限設定
  AuthScopes: {
    loggedIn: boolean;
  };
  Connection: {
    totalCount: number | (() => number | Promise<number>);
  };
  PrismaTypes: PrismaTypes;
  // NOTE: ログインユーザー情報のコンテキスト
  Context: Context;
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin, PothosSimpleObjectsPlugin],
  scopeAuth: {
    authorizeOnSubscribe: true,
    authScopes: async (ctx) => ({
      loggedIn: !!ctx.user,
    }),
  },
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

### Postのリゾルバを実装

#### GraphQLモデル（ノード、オブジェクト）を実装

`app/lib/graphql/schema/post/post.model.ts`

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

#### ミューテーションフィールドを実装

DTOを準備する。  

`app/lib/graphql/schema/post/dto/input/create-post-input.dto.ts`  

```ts
import { builder } from '~/lib/graphql/builder';
import { PostStatus } from '../../post.model';

export const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatus, required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
```

`app/lib/graphql/schema/post/dto/input/update-post-input.dto.ts`  

```ts
import { builder } from '~/lib/graphql/builder';
import { PostStatus } from '../../post.model';

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatus, required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
```

`app/lib/graphql/schema/post/dto/input/delete-post-input.dto.ts`  

```ts
import { builder } from '~/lib/graphql/builder';

export const DeletePostInput = builder.inputType('DeletePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
```

ミューテーションフィールドを準備する。  

`app/lib/graphql/schema/post/post.mutation.ts`

```ts
import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/lib/graphql/builder';
import { prisma } from '~/lib/prisma';
import { CreatePostInput } from './dto/input/create-post-input.dto';
import { DeletePostInput } from './dto/input/delete-post-input.dto';
import { UpdatePostInput } from './dto/input/update-post-input.dto';

builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: false,
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      const createdPost = await prisma.post.create({
        ...query,
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          status: input.status,
          authorId: ctx.user.id,
        },
      });

      if (input.tagIds && input.tagIds.length > 0) {
        const postTagsData = input.tagIds.map((tagId) => ({
          postId: createdPost.id,
          tagId,
        }));

        await prisma.postTag.createMany({
          data: postTagsData,
        });
      }

      return createdPost;
    },
  }),
);

builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      const updatedPost = await prisma.post.update({
        ...query,
        where: {
          id: rawId,
        },
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          status: input.status,
        },
      });

      if (input.tagIds) {
        await prisma.postTag.deleteMany({
          where: {
            postId: rawId,
          },
        });

        if (input.tagIds.length > 0) {
          const postTagsData = input.tagIds.map((tagId) => ({
            postId: rawId,
            tagId,
          }));

          await prisma.postTag.createMany({
            data: postTagsData,
          });
        }
      }

      return updatedPost;
    },
  }),
);

builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: DeletePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.post.delete({
        ...query,
        where: { id: rawId },
      });
    },
  }),
);
```

#### import用indexファイルを作成

`app/lib/graphql/schema/post/index.ts`

```ts
import './post.model';
import './post.mutation';
import './post.query';
```

> 上記と同様に、tagとuserのリゾルバも実装しておく。

### GraphQLスキーマを作成

`app/lib/graphql/schema/index.ts`

```ts
import { builder } from '../builder';

import './post';
import './tag';
import './user';

export const schema = builder.toSchema();
```

### GraphQL YogaからGraphQLスキーマを読み込み

`app/routes/api.graphql/route.ts`

```ts
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/lib/graphql/schema';

// NOTE: createYogaで生成したインスタンスはシングルトンとして利用される。
const yoga = createYoga({
  schema, // スキーマとリゾルバーを定義
  graphqlEndpoint: '/api/graphql',
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
```
