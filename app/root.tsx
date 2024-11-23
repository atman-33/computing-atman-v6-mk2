import './tailwind.css';

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
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
import { getSystemTheme } from './routes/resources.theme/services/system-theme';
import { getThemeFromCookie } from './routes/resources.theme/services/theme.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Computing Atman' },
    {
      name: 'description',
      content: 'A blog about system development and programming related to IT.',
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await getThemeFromCookie(request);
  return json({ theme });
};

export function Layout({ children }: { children: React.ReactNode }) {
  // NOTE: ... || {} はloaderのデータが取得できない場合のエラー回避策
  const { theme } = useLoaderData<typeof loader>() || {};

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
