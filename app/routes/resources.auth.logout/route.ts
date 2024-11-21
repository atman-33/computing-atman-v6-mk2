import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '../auth/services/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: '/auth/login' });
};
