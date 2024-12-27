import { useFetcher, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Spinner } from '~/components/shared/spinner';
import { useIntersection } from '~/hooks/use-intersection';
import { getPostsByUser } from '~/services/post/get-posts-by-user';
import { PostEdges, PostsPageInfo } from '../types';
import { PostListItem } from './post-list-item';

interface PostListProps {
  posts: PostEdges;
  pageInfo: PostsPageInfo;
}

const PostList = ({ posts, pageInfo }: PostListProps) => {
  const { userId } = useParams<{ userId: string }>();
  const fetcher = useFetcher();

  const [allPosts, setAllPosts] = useState<PostEdges>(posts);
  const [endCursor, setEndCursor] = useState<string | null>(pageInfo.endCursor ?? null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(pageInfo.hasNextPage);

  const [isLoading, setIsLoading] = useState(false);
  const [isIntersecting, ref] = useIntersection();

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isLoading) {
      setIsLoading(true);
      fetcher.load(`/users/${userId}/posts?first=10&after=${endCursor}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting, pageInfo, isLoading, userId]);

  useEffect(() => {
    if (isIntersecting && hasNextPage && fetcher.data) {
      const newData = fetcher.data as Awaited<ReturnType<typeof getPostsByUser>>;
      // console.log('endCursor', newData.data?.pageInfo.endCursor);
      // console.log('hasNextPage', newData.data?.pageInfo.hasNextPage);
      setEndCursor(newData.data?.pageInfo.endCursor ?? null);
      setHasNextPage(newData.data?.pageInfo.hasNextPage ?? false);
      setAllPosts((prevPosts) => {
        if (prevPosts) {
          return [...prevPosts, ...(newData.data?.edges ?? [])] as PostEdges;
        }
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <>
      <div className="grid gap-4 py-8 md:grid-cols-1">
        {allPosts &&
          allPosts.map((post) => post && <PostListItem key={post.node?.id} post={post.node} />)}
      </div>
      <div ref={ref} className="mt-4 flex justify-center">
        {isLoading && <Spinner />}
      </div>
    </>
  );
};

export { PostList };
