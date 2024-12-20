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
  name: string;
  label: string;
  type?: ComponentProps<'input'>['type'];
  errorMessage?: string;
}>;

export const TextField: FC<TextFieldProps> = ({ name, label, type, errorMessage }) => {
  // NOTE: useFieldはValidatedForm内でのみ利用可能
  const { error } = useField(name);

  return (
    <div className="flex w-full flex-col">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
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
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">Login</h2>
        <ValidatedForm validator={loginValidator} method="POST">
          <div className="flex flex-col gap-y-2">
            <TextField name="email" label="Email" />
            <TextField name="password" type="password" label="Password" />
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

### Google認証

#### Google認証情報の取得

以下の記事の「Google Developer Consoleにアクセス」の部分から「認証情報の取得」の取得までの設定を行い、環境変数に値を定義する。  

- [NextAuth.jsでNext.js13にGoogle認証機能を実装](https://zenn.dev/hayato94087/articles/91179fbbe1cad4)

#### envにGoogle認証用の設定を追加

`.env`

```sh
# Google認証
CLIENT_URL='http://localhost:3000'
GOOGLE_CLIENT_ID='****'
GOOGLE_CLIENT_SECRET='****'
```

`app/config/env.ts`

```ts
export const env = {
  SESSION_SECRET: process.env['SESSION_SECRET'] as string,
  CLIENT_URL: process.env['CLIENT_URL'] as string,
  GOOGLE_CLIENT_ID: process.env['GOOGLE_CLIENT_ID'] as string,
  GOOGLE_CLIENT_SECRET: process.env['GOOGLE_CLIENT_SECRET'] as string,
};
```

`app/routes/auth/services/auth.server.ts`

- Googleストラテジーを追加

```ts
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { GoogleStrategy } from 'remix-auth-google';
import { env } from '~/config/env';
import { prisma } from '~/lib/prisma';
import { sessionStorage } from './session.server';

const SESSION_SECRET = env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined');
}

const authenticator = new Authenticator<Omit<User, 'password'>>(sessionStorage);

// --- FormStrategy
// ...

// NOTE: フォームストラテジーには「user-pass」の名称を設定
authenticator.use(formStrategy, 'user-pass');

// --- GoogleStrategy
if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.CLIENT_URL)) {
  throw new Error('GOOGLE_CLIENT_ID、GOOGLE_CLIENT_SECRET、CLIENT_URLが設定されていません。');
}

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID: env.GOOGLE_CLIENT_ID || '',
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${env.CLIENT_URL}/api/auth/google/callback`,
  },
  async ({ profile }) => {
    const user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (user) {
      return user;
    }

    const newUser = await prisma.user.create({
      data: {
        // id: profile.id,
        email: profile.emails[0].value || '',
        password: '',
        name: profile.displayName,
        image: profile.photos[0].value || '',
        provider: 'google',
      },
    });
    return newUser;
  },
);

authenticator.use(googleStrategy); // name: 'google'

export { authenticator };
```

#### react-iconsをインストール

```sh
npm i react-icons
```

#### Google認証フォームを作成

`app/routes/auth.login._index/google-form.tsx`

```tsx
import { Form } from '@remix-run/react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleForm = () => {
  return (
    <Form method="POST" className="my-4">
      <button
        type="submit"
        name="_action"
        value="Sign In Google"
        className="mt-2 w-full rounded-xl border border-gray-600 bg-white px-3 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-gray-200"
      >
        <div className="flex justify-center">
          <FcGoogle size={22} className="mr-2" />
          <span className="text-gray-700">Sign in with Google</span>
        </div>
      </button>
    </Form>
  );
};
```

#### ログインページにGoogle認証フォームを追加

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
import { GoogleForm } from './google-form';
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
  // NOTE:
  // cloneせずに値を取得すると、action関数とremix-authで2回リクエスト本文（formData）にアクセスすることになってしまいエラーとなる。
  // Remixではリクエストには1回しかアクセスできないため、リクエストのクローンを作成して、そのクローンをリクエストとして読み取る必要がある。
  const formData = await request.clone().formData();
  const action = String(formData.get('_action'));

  try {
    switch (action) {
      case 'Sign In':
        return await authenticator.authenticate('user-pass', request, {
          successRedirect: '/',
          // failureRedirect: '/auth/login',
        });

      case 'Sign In Google':
        return await authenticator.authenticate('google', request);

      default:
        return null;
    }
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
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">Login</h2>
        <ValidatedForm validator={loginValidator} method="POST">
          <div className="flex flex-col gap-y-2">
            <TextField name="email" label="Email" />
            <TextField name="password" type="password" label="Password" />
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
        <GoogleForm />
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

#### リダイレクト先（callbackURL）のページを追加

`app/routes/api.auth.google.callback/route.tsx`

```tsx
import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../auth/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('auth google callback...');
  // console.log(request);
  return await authenticator.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  });
};
```

### サインアップ機能

#### ユーザー登録機能を作成

`app/routes/auth/services/signup.server.ts`

```ts
import bcrypt from 'bcryptjs';
import { prisma } from '~/lib/prisma';

export const createUser = async (data: Record<'name' | 'email' | 'password', string>) => {
  const { name, email, password } = data;

  if (!(name && email && password)) {
    throw new Error('Invalid input');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: { message: 'メールアドレスは既に登録済みです' } };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, image: '' },
  });

  return { id: newUser.id, email: newUser.email, name: newUser.name };
};
```

#### バリデータを作成

`app/routes/auth.signup._index/sign-up-validator.ts`

```ts
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(1, 'ユーザー名は必須入力です')
    .max(64, 'ユーザー名は64文字以下で入力してください'),
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

export const signUpValidator = withZod(signUpFormSchema);
```

#### サインアップページを作成

`app/routes/auth.signup._index/route.tsx`

```tsx
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import { Button } from '~/components/shadcn/ui/button';
import { GoogleForm } from '../auth.login._index/google-form';
import { TextField } from '../auth/components/text-field';
import { authenticator } from '../auth/services/auth.server';
import { createUser } from '../auth/services/signup.server';
import { signUpValidator } from './sign-up-validator';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const action = String(formData.get('_action'));

  switch (action) {
    case 'Sign Up': {
      const name = String(formData.get('name'));
      const email = String(formData.get('email'));
      const password = String(formData.get('password'));
      const errors: { [key: string]: string } = {};

      if (
        typeof action !== 'string' ||
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return json({ error: 'Invalid Form Data', form: action }, { status: 400 });
      }

      const result = await createUser({ name, email, password });

      if (result.error) {
        errors.email = result.error.message;
      }

      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      return await authenticator.authenticate('user-pass', request, {
        successRedirect: '/',
        failureRedirect: '/auth/signup',
        context: { formData },
      });
    }

    case 'Sign In Google':
      return authenticator.authenticate('google', request);

    default:
      return null;
  }
};

const SignUpPage = () => {
  const actionData = useActionData<typeof action>();
  const errors = (actionData as { errors?: { [key: string]: string } })?.errors;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5">
      <div className="w-[420px] rounded-2xl bg-white p-6">
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">
          Create an account
        </h2>
        <ValidatedForm validator={signUpValidator} method="POST">
          <TextField name="name" type="name" label="Name" />
          <TextField name="email" label="Email" errorMessage={errors?.email} />
          <TextField name="password" type="password" label="Password" />
          <div className="mt-5 text-center">
            <Button variant="default" type="submit" name="_action" value="Sign Up">
              Create an account
            </Button>
          </div>
        </ValidatedForm>
        <GoogleForm />
      </div>
      <p className="text-gray-600">
        {`Already have an account? `}
        <Link to="/auth/login">
          <span className="px-2 text-primary hover:underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
```

## Remix validated formではなく、Comformを利用する場合

### Confromをインストール

```sh
npm i @conform-to/react @conform-to/zod
```

### バリデーションスキーマを組み込んだFormを返すフックを作成

`app/routes/auth.login._index/hooks/use-login-form.ts`

```ts
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useEffect } from 'react';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須入力です' })
    .email('メールアドレスを正しい形式で入力してください')
    .max(128, 'メールアドレスは128文字以下で入力してください'),
  password: z
    .string({ required_error: 'パスワードは必須入力です' })
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以下で入力してください')
    .refine(
      (password: string) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'パスワードは半角英数字の両方を含めてください',
    ),
});

const useLoginForm = () => {
  const form = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginFormSchema });
    },
  });

  useEffect(() => {
    form[0].reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return form;
};

export { useLoginForm };
```

### Conformに対応したラベル付きインプットコンポーネントを作成

`app/components/shared/conform/label-input.tsx`

```tsx
import { FieldMetadata, getInputProps } from '@conform-to/react';
import { Input } from '~/components/shadcn/ui/input';
import { Label } from '~/components/shadcn/ui/label';

interface LabelInputProps<Schema> {
  metadata: FieldMetadata<Schema>;
  options: {
    type:
      | 'number'
      | 'search'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'month'
      | 'password'
      | 'range'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week';
    value?: boolean | undefined;
  };
  label: string;
  placeholder?: string;
}

/**
 * Conformに対応したラベル付きインプット
 * @param param0
 * @returns
 */
const LabelInput = <Schema,>({
  metadata,
  options,
  label,
  placeholder,
}: LabelInputProps<Schema>) => {
  const inputProps = getInputProps(metadata, options);
  return (
    <div className="flex w-full flex-col">
      <Label htmlFor={inputProps.id}>{label}</Label>
      <Input
        {...inputProps}
        placeholder={placeholder}
        className={`my-2 w-full rounded-xl border border-gray-300 p-2 outline-none ${!!metadata.errors && 'border-red-500'}`}
      />
      {metadata.errors && (
        <div>
          {metadata.errors.map((e, index) => (
            <p key={index} className="mb-2 text-red-500">
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelInput;
```

### ページコンポーネントにバリデーションFormとインプットコンポーネントを適用

`app/routes/auth.login._index/route.tsx`

```tsx
import { getFormProps } from '@conform-to/react';
import { ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { AlertCircle } from 'lucide-react';
import { AuthorizationError } from 'remix-auth';
import { Alert, AlertDescription, AlertTitle } from '~/components/shadcn/ui/alert';
import { Button } from '~/components/shadcn/ui/button';
import LabelInput from '~/components/shared/conform/label-input';
import { authenticator } from '../auth/services/auth.server';
import { GoogleForm } from './google-form';
import { useLoginForm } from './hooks/use-login-form';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App login' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // ...
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // ...
};

const LoginPage = () => {
  const data = useActionData<typeof action>() as { message?: string };
  const [form, { email, password }] = useLoginForm();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5">
      <div className="w-[420px] rounded-2xl bg-white p-6">
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">Login</h2>
        <Form method="POST" {...getFormProps(form)}>
          <div className="flex flex-col">
            <LabelInput metadata={email} options={{ type: 'email' }} label="Email" />
            <LabelInput metadata={password} options={{ type: 'password' }} label="Password" />
            <Button
              variant="default"
              type="submit"
              name="_action"
              value="Sign In"
              className="mt-4 self-center"
            >
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
        </Form>
        <GoogleForm />
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
