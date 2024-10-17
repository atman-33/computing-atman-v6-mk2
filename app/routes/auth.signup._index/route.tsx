import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import { Button } from '~/components/shadcn/ui/button';
import { GoogleForm } from '../auth.login._index/google-form';
import { TextField } from '../auth/components/text-field';
import { authenticator } from '../auth/services/auth.server';
import { createUser } from '../auth/services/signup.server';
import { signUpValidator } from './sign-up-validator';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const action = String(formData.get('_action'));

  switch (action) {
    case 'Sign Up': {
      const name = String(formData.get('name'));
      const email = String(formData.get('email'));
      const password = String(formData.get('password'));
      const errors: { [key: string]: string } = {};

      if (
        typeof action !== 'string' ||
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return json({ error: 'Invalid Form Data', form: action }, { status: 400 });
      }

      const result = await createUser({ name, email, password });

      if (result.error) {
        errors.email = result.error.message;
      }

      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      return await authenticator.authenticate('user-pass', request, {
        successRedirect: '/',
        failureRedirect: '/auth/signup',
        context: { formData },
      });
    }

    case 'Sign In Google':
      return authenticator.authenticate('google', request);

    default:
      return null;
  }
};

const SignUpPage = () => {
  const actionData = useActionData<typeof action>();
  const errors = (actionData as { errors?: { [key: string]: string } })?.errors;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5">
      <div className="w-[420px] rounded-2xl bg-white p-6">
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">
          Create an account
        </h2>
        <ValidatedForm validator={signUpValidator} method="POST">
          <TextField htmlFor="name" type="name" label="Name" />
          <TextField htmlFor="email" label="Email" errorMessage={errors?.email} />
          <TextField htmlFor="password" type="password" label="Password" />
          <div className="mt-5 text-center">
            <Button variant="default" type="submit" name="_action" value="Sign Up">
              Create an account
            </Button>
          </div>
        </ValidatedForm>
        <GoogleForm />
      </div>
      <p className="text-gray-600">
        {`Already have an account? `}
        <Link to="/auth/login">
          <span className="px-2 text-primary hover:underline">Sign In</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
