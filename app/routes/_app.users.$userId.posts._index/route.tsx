import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import { mockPosts } from '~/mock/posts';
import { PostList } from './components/post-list';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: any = await mockPosts;
  return json({ userId, posts });
};

const UserPosts = () => {
  const { posts } = useLoaderData<typeof loader>();
  // console.log(userId);
  return (
    <>
      <div>
        <Link to="./new/edit">
          <Button variant="ghost">新規投稿</Button>
        </Link>
      </div>
      <div>
        <PostList posts={posts} />
      </div>
    </>
  );
};

export default UserPosts;
