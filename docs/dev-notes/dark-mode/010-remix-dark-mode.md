# Remixでダークモード切替を実装する方法

## 参考URL

- How to implement Dark Mode in Remix[https://maanu.dev/posts/how-to-implement-dark-mode-in-remix]

## ステップ

前提として、TailwindCSSを実装していること（htmlタグのクラスに`dark`を付与するとダークモードになる）。  

### Cookieに保持したテーマ情報を取得する関数を準備

`app/routes/resources.theme/services/theme.server.ts`

```ts
import { createCookie } from '@remix-run/node';

export const themeCookie = createCookie('theme', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
});

export const getThemeFromCookie = async (request: Request): Promise<string> => {
  const theme = await themeCookie.parse(request.headers.get('Cookie'));
  return theme || 'system';
};
```

### OSのシステムテーマを取得する関数を準備

`app/routes/resources.theme/services/system-theme.client.ts`

```ts
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
```

### root.tsxでテーマを反映するように修正

`app/root.tsx`

- loaderを追加。ここでCookieに取得しているテーマを取得している。
- Layoutでテーマを設定。htmlタグのclassにテーマを設定している。

```tsx
import './tailwind.css';

import type { LoaderFunctionArgs } from '@remix-run/node';
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
import { getSystemTheme } from './routes/resources.theme/services/system-theme.client';
import { getThemeFromCookie } from './routes/resources.theme/services/theme.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await getThemeFromCookie(request);
  return json({ theme });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();

  const htmlProps = useMemo(() => {
    let currentTheme = theme;
    if (theme === 'system') {
      currentTheme = getSystemTheme();
    }

    return {
      className: currentTheme,
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

`app/routes/resources.theme/route.ts`

```ts
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { getThemeFromCookie, themeCookie } from '~/routes/resources.theme/services/theme.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentTheme = await getThemeFromCookie(request);
  return json({ currentTheme });
};

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

### テーマを変更するドロップダウンメニューを準備

`app/routes/_landing/components/theme-dropdown.tsx`

```tsx
import { useFetcher } from '@remix-run/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '~/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/shadcn/ui/dropdown-menu';

const ThemeDropdown = () => {
  const fetcher = useFetcher();

  const handleThemeChange = (newTheme: string) => {
    fetcher.submit({ theme: newTheme }, { method: 'post', action: '/resources/theme' });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange('light')}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('dark')}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ThemeDropdown;
```
