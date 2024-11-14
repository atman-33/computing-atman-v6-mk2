# Remixでダークモード切替を実装する方法

## 参考URL

- How to implement Dark Mode in Remix[https://maanu.dev/posts/how-to-implement-dark-mode-in-remix]

## ステップ

前提として、TailwindCSSを実装していること（htmlタグのクラスに`dark`を付与するとダークモードになる）。  

### Cookieに保持したテーマ情報を取得する関数を準備

`app/utils/theme.server.ts`

```ts
import { createCookie } from '@remix-run/node';

export const themeCookie = createCookie('theme', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
});

export const getThemeFromCookies = async (request: Request): Promise<string> => {
  const theme = await themeCookie.parse(request.headers.get('Cookie'));
  return theme || 'system';
};
```

### root.tsxでテーマを反映するように修正

`app/root.tsx`

- loaderを追加。ここでCookieに取得しているテーマを取得している。
- Layoutでテーマを設定。htmlタグのclassに設定している。

```tsx
import './tailwind.css';

import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useMemo } from 'react';
import { getThemeFromCookies } from './utils/theme.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await getThemeFromCookies(request);
  return json({ theme });
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();

  const htmlProps = useMemo(() => {
    return {
      className: theme === 'system' ? undefined : theme,
    };
  }, [theme]);

  return (
    <html lang="ja" {...htmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

### 変更されたテーマを設定するためのresource routeを準備

`app/routes/preferences.theme.ts`

```ts
import { ActionFunctionArgs } from '@remix-run/node';
import { themeCookie } from '~/utils/theme.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const theme = form.get('theme');

  // Referer ヘッダーから前のページのURLを取得し、フォールバックを設定
  const referer = request.headers.get('Referer');
  const fallbackUrl = '/';

  return new Response(null, {
    status: 302,
    headers: {
      Location: referer || fallbackUrl,
      'Set-Cookie': await themeCookie.serialize(theme),
    },
  });
};
```

### テーマを変更するトグルボタンを準備

`app/routes/_landing/components/toggle-theme-button.tsx`

```tsx
import { Form } from '@remix-run/react';
import { FaMoon, FaSun } from 'react-icons/fa';
const ToggleThemeButton = ({ theme }: { theme: string }) => {
  const themeToToggleTo = theme === 'dark' ? 'light' : 'dark';

  return (
    <Form action="/preferences/theme" method="POST" className="flex items-center">
      <input type="hidden" name="theme" value={themeToToggleTo} />
      {theme === 'dark' ? (
        <button>
          <FaSun className="h-6 w-6" />
        </button>
      ) : (
        <button>
          <FaMoon className="h-6 w-6" />
        </button>
      )}
    </Form>
  );
};

export default ToggleThemeButton;
```
