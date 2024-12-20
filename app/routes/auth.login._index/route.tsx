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
        // console.log('Sign In...');
        return await authenticator.authenticate('user-pass', request, {
          successRedirect: '/',
          // failureRedirect: '/auth/login',
        });

      case 'Sign In Google':
        // console.log('Sign In Google...');
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
