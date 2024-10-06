import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { ValidatedForm } from 'remix-validated-form';
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
  return authenticator.authenticate('user-pass', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  });
};

const LoginPage = () => {
  return (
    <div>
      <ValidatedForm validator={loginValidator} method="POST">
        <h2>Login</h2>
        {/* TODO: ココから */}
      </ValidatedForm>
    </div>
  );
};

export default LoginPage;
