import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../auth/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // console.log('auth google callback...');
  // console.log(request);
  return await authenticator.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  });
};
