import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import { mockPosts } from '~/mock/posts';
import { PostList } from './components/post-list';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  const posts = await mockPosts;
  return json({ userId, posts });
};

const UserPosts = () => {
  const { userId, posts } = useLoaderData<typeof loader>();
  console.log(userId);
  return (
    <>
      <div>
        <Button>新規投稿</Button>
      </div>
      <div>
        <PostList posts={posts} />
      </div>
    </>
  );
};

export default UserPosts;
