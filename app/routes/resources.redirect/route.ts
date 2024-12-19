import { ActionFunctionArgs, redirect } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const targetUrl = form.get('targetUrl') as string | null;

  if (!targetUrl) {
    throw new Error('targetUrl is required');
  }

  // NOTE: URLを変更。redirectはreturnしないとURLが変わらないため注意。
  return redirect(targetUrl);
};
