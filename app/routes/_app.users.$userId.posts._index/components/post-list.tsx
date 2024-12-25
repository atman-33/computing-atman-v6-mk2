import { Link } from '@remix-run/react';
import { PostEdges, PostsPageInfo } from '../types';
import { PostListItem } from './post-list-item';

interface PostListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: PostEdges;
  pageInfo: PostsPageInfo;
}

const PostList = ({ posts, pageInfo }: PostListProps) => {
  // const [pagination, setPagination] = useAtom(paginationAtom);

  // posts = filterPublishedPosts(posts);
  // posts = sortPostsByDate(posts);

  // const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  // const displayPosts = posts.slice(
  //   (pagination.currentPage - 1) * POSTS_PER_PAGE,
  //   pagination.currentPage * POSTS_PER_PAGE,
  // );

  // useEffect(() => {
  //   setPagination({
  //     currentPage: 1,
  //     totalPages,
  //     itemsPerPage: POSTS_PER_PAGE,
  //   });
  // }, [totalPages, setPagination]);

  // console.log(posts);
  return (
    <>
      <div className="grid gap-4 py-8 md:grid-cols-1">
        {posts &&
          posts.map((post) => post && <PostListItem key={post.node?.id} post={post.node} />)}
      </div>
      <div className="mt-4 flex justify-center">
        {pageInfo.hasNextPage && (
          <Link to={`?after=${pageInfo.endCursor}`}>
            <button className="btn">次のページ</button>
          </Link>
        )}
      </div>
    </>
  );
};

export { PostList };
