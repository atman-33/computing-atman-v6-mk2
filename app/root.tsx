import tailwind from './tailwind.css?url';

import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { CustomToaster } from './components/shadcn/custom/custom-toaster';
import { getSystemTheme } from './routes/resources.theme/services/system-theme';
import { getThemeFromCookie } from './routes/resources.theme/services/theme.server';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicons/favicon.ico', type: 'image/png' },
  { rel: 'stylesheet', href: tailwind },
];

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
  const [currentTheme, setCurrentTheme] = useState('');

  useEffect(() => {
    setCurrentTheme(theme === 'system' ? getSystemTheme() : theme);
  }, [theme]);

  return (
    <html lang="ja" className={currentTheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <CustomToaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
