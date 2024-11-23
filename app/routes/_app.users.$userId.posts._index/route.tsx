import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  return json({ userId });
};

const UserPosts = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>UserPosts ページ</div>
      <div>{data.userId}</div>
    </>
  );
};

export default UserPosts;
