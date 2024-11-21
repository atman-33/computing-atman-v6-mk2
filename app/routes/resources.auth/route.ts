import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../auth/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    // NOTE: 未認証の場合にリダイレクトする場合はこちらで設定
    // failureRedirect: '/auth/login',
  });
  // console.log(user);
  return user;
};
