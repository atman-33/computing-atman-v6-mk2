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
