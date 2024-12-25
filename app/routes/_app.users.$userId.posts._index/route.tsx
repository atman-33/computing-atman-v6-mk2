import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import { getPostsByUser } from '~/services/post/get-posts-by-user';
import { PostList } from './components/post-list';

/** ページ毎の表示件数（ポスト数）*/
const POSTS_PER_PAGE = 2;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const userId = params.userId;
  const first = parseInt(url.searchParams.get('first') || POSTS_PER_PAGE.toString(), 10);
  const after = url.searchParams.get('after') ?? undefined;

  if (userId) {
    const data = await getPostsByUser({ userId }, first, after, request);
    return json(data);
  }

  throw new Error('ユーザーIDが指定されていません');
};

const UserPosts = () => {
  const loaderData = useLoaderData<typeof loader>();
  loaderData.data?.edges;
  // console.log(userId);
  return (
    <>
      <div>
        <Link to="./new/edit">
          <Button variant="ghost">新規投稿</Button>
        </Link>
      </div>
      <div>
        {loaderData.data?.pageInfo && (
          <PostList posts={loaderData.data?.edges} pageInfo={loaderData.data.pageInfo} />
        )}
      </div>
    </>
  );
};

export default UserPosts;
