import { useFetcher, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Spinner } from '~/components/shared/spinner';
import { useIntersection } from '~/hooks/use-intersection';
import { getPostsByUser } from '~/services/post/get-posts-by-user';
import { POST_LIMIT } from '../route';
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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimeout = 5000; // 5秒

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isLoading) {
      // console.log('Fetching more posts...');
      setIsLoading(true);
      fetcher.load(`/users/${userId}/posts?first=${POST_LIMIT}&after=${endCursor}`);
      // console.log('fetcher state 1: ', fetcher.state);
    }

    // NOTE:
    // fetcher.loadが正常に終了せず、isLoadingがfalseのまま終わらない場合があるため、
    // タイマーを設定して、指定秒数後にリトライする。
    const timeoutId = setTimeout(() => {
      // console.log('fetcher state 2: ', fetcher.state);
      if (isLoading && retryCount <= maxRetries) {
        // console.log('Retrying fetch due to timeout...');
        setIsLoading(false); // 再試行のためにisLoadingをリセット
        setRetryCount((prevCount) => prevCount + 1);
      }
    }, retryTimeout);
    // console.log('timeoutId', timeoutId);

    return () => {
      // console.log(`${timeoutId} clean up...`);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting, pageInfo, isLoading, userId]);

  useEffect(() => {
    // console.log('fetcher.data updated...');
    if (fetcher.data) {
      // console.log('New data fetched:', fetcher.data);
      const newData = fetcher.data as Awaited<ReturnType<typeof getPostsByUser>>;
      setEndCursor(newData.data?.pageInfo.endCursor ?? null);
      setHasNextPage(newData.data?.pageInfo.hasNextPage ?? false);
      setAllPosts((prevPosts) => {
        return [...prevPosts!, ...(newData.data?.edges ?? [])] as PostEdges;
      });
      setIsLoading(false);
    }
  }, [fetcher.data]);

  return (
    <>
      <div className="grid gap-4 py-8 md:grid-cols-1">
        {allPosts?.map((post) => post && <PostListItem key={post.node?.id} post={post.node} />)}
      </div>
      <div ref={ref} className="mt-4 flex justify-center">
        {isLoading && <Spinner />}
      </div>
    </>
  );
};

export { PostList };
