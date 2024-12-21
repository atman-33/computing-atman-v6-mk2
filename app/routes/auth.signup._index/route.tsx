import { getFormProps } from '@conform-to/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '~/components/shadcn/ui/alert';
import { Button } from '~/components/shadcn/ui/button';
import LabelInput from '~/components/shared/conform/label-input';
import { GoogleForm } from '../auth.login._index/google-form';
import { authenticator } from '../auth/services/auth.server';
import { createUser } from '../auth/services/signup.server';
import { useSignUpForm } from './hooks/use-sign-up-form';

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
  const [form, { name, email, password }] = useSignUpForm();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5">
      <div className="w-[420px] rounded-2xl bg-white p-6">
        <h2 className="text-black-600 mb-5 text-center text-3xl font-extrabold">
          Create an account
        </h2>
        <Form method="POST" {...getFormProps(form)}>
          <div className="flex flex-col">
            <LabelInput metadata={name} options={{ type: 'text' }} label="Name" />
            <LabelInput metadata={email} options={{ type: 'email' }} label="Email" />
            <LabelInput metadata={password} options={{ type: 'password' }} label="Password" />
            <Button
              variant="default"
              type="submit"
              name="_action"
              value="Sign Up"
              className="mt-4 self-center"
            >
              Create an account
            </Button>
            {errors?.email && (
              <Alert variant="destructive" className="my-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors?.email}</AlertDescription>
              </Alert>
            )}
          </div>
        </Form>
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
