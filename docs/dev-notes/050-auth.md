# Remix Authセットアップ

- Credential認証（メールアドレス・パスワードによる認証）
- Google認証

## 参考URL

- [【Remix v2】remix-auth・remix-auth-googleによる認証機能の実装方法](https://zenn.dev/sc30gsw/articles/f908adb5579795)

## ステップ

### 認証に必要なパッケージをインストール

```sh
npm install remix-auth remix-auth-form remix-auth-google
```

### prisma schemaを設定

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
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
}
```

- schemaファイル作成後、`prisma generate`でprisma clientファイルを生成しておくこと。

### ログイン機能

#### .envにセッションシークレットを設定

- ランダムなシークレットキーを生成する。

```sh
openssl rand -base64 32
```

- .envにシークレットキーを設定する。

`.env`

```sh
SESSION_SECRET='****'
```

#### セッションストレージオブジェクトを作成

`app/routes/auth/services/session.server.ts`

```ts
import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || ''],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
```

#### パスワード暗号化用パッケージをインストール

```sh
npm i bcryptjs
npm i -D @types/bcryptjs
```

#### ログイン画面を作成

##### バリデーションライブラリをインストール

```sh
npm i remix-validated-form
npm i @remix-validated-form/with-zod
```

#### バリデーターを作成

`app/routes/auth.login._index/login-validator.ts`

```ts
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z
    .string()
    .email('メールアドレスを正しい形式で入力してください')
    .max(128, 'メールアドレスは128文字以下で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以下で入力してください')
    .refine(
      (password: string) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'パスワードは半角英数字の両方を含めてください',
    ),
});

export const loginValidator = withZod(loginFormSchema);
```
