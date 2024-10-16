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

#### フォームストラテジー（Credential認証）を追加

`app/routes/auth/services/auth.server.ts`

```ts
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { env } from '~/config/env';
import { prisma } from '~/lib/prisma';
import { sessionStorage } from './session.server';

const SESSION_SECRET = env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined');
}

const authenticator = new Authenticator<Omit<User, 'password'>>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email');
  const password = form.get('password');

  if (!(email && password)) {
    throw new Error('Invalid Request');
  }

  const user = await prisma.user.findUnique({ where: { email: String(email) } });

  if (!user) {
    console.log(`${email} ユーザーが存在しません`);
    throw new AuthorizationError(`${email} ユーザーが存在しません`);
  }

  const passwordsMatch = await bcrypt.compare(String(password), user.password);

  if (!passwordsMatch) {
    console.log(`パスワードが一致しません`);
    throw new AuthorizationError(`パスワードが一致しません`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
});

// NOTE: フォームストラテジーには「user-pass」の名称を設定
authenticator.use(formStrategy, 'user-pass');

export { authenticator };
```

#### バリデーションライブラリをインストール

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

#### テキストフィールドを作成

`app/routes/auth/components/text-field.tsx`

```tsx
import { ComponentProps, FC } from 'react';
import { useField } from 'remix-validated-form';
import { Input } from '~/components/shadcn/ui/input';
import { Label } from '~/components/shadcn/ui/label';

type TextFieldProps = Readonly<{
  htmlFor: string;
  label: string;
  type?: ComponentProps<'input'>['type'];
  errorMessage?: string;
}>;

export const TextField: FC<TextFieldProps> = ({ htmlFor, label, type, errorMessage }) => {
  // NOTE: useFieldはValidatedForm内でのみ利用可能
  const { error } = useField(htmlFor);

  return (
    <div className="flex w-full flex-col">
      <Label>{label}</Label>
      <Input
        type={type}
        id={htmlFor}
        name={htmlFor}
        className={`my-2 w-full rounded-xl border border-gray-300 p-2 outline-none ${!!error && 'border-red-500'}`}
      />
      {error && <span className="mb-2 text-red-500">{error}</span>}
      {errorMessage && <span className="mb-2 text-red-500">{errorMessage}</span>}
    </div>
  );
};
```

#### ログインページを作成

`app/routes/auth.login._index/route.tsx`

```tsx
import { ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { AlertCircle } from 'lucide-react';
import { AuthorizationError } from 'remix-auth';
import { ValidatedForm } from 'remix-validated-form';
import { Alert, AlertDescription, AlertTitle } from '~/components/shadcn/ui/alert';
import { Button } from '~/components/shadcn/ui/button';
import { TextField } from '../auth/components/text-field';
import { authenticator } from '../auth/services/auth.server';
import { loginValidator } from './login-validator';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App login' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return user;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      // failureRedirect: '/auth/login',
    });
  } catch (e) {
    // NOTE: この記述がないと成功時にリダイレクトできない
    if (e instanceof Response) {
      return e;
    }

    // 認証失敗時にthrowしたエラー
    if (e instanceof Error) {
      return json({ message: e.message }, { status: 401 });
    }

    if (e instanceof AuthorizationError) {
      return json({ message: e.message }, { status: 401 });
    }

    return json({ message: '認証に失敗しました' }, { status: 401 });
  }
};

const LoginPage = () => {
  const data = useActionData<typeof action>() as { message?: string };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5">
      <div className="w-[420px] rounded-2xl bg-white p-6">
        <ValidatedForm validator={loginValidator} method="POST">
          <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">Login</h2>
          <div className="flex flex-col gap-y-2">
            <TextField htmlFor="email" label="Email" />
            <TextField htmlFor="password" type="password" label="Password" />
            <Button variant="default" type="submit" name="_action" value="Sign In">
              Login
            </Button>
            {data?.message && (
              <Alert variant="destructive" className="my-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{data.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </ValidatedForm>
      </div>
      <p className="text-gray-600">
        {`Don't have an account? `}
        <Link to="/auth/signup">
          <span className="px-2 text-primary hover:underline">Sign Up</span>
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
```

### ログアウト機能

#### ログアウトページを作成

`app/routes/_index.tsx`

```tsx
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import { authenticator } from './auth/services/auth.server';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/login',
  });

  return user;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: '/auth/login' });
};

export default function Index() {
  const user = useLoaderData<typeof loader>() as { name: string };
  return (
    <>
      <h1>{`Hello ${user.name} さん`}</h1>
      <Form method="POST">
        <Button type="submit" name="action" value="logout">
          Logout
        </Button>
      </Form>
    </>
  );
}
```
