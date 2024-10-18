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
