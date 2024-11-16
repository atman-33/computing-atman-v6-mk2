import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import { authenticator } from './auth/services/auth.server';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/login',
  });

  return user;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: '/auth/login' });
};

export default function Index() {
  const user = useLoaderData<typeof loader>() as { name: string };
  return (
    <>
      <h1>{`Hello ${user.name} さん`}</h1>
      <Form method="POST">
        <Button type="submit" name="action" value="logout">
          Logout
        </Button>
      </Form>
    </>
  );
}
