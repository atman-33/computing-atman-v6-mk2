import { PostListItem } from './post-list-item';

/**
 * ページ毎の表示件数（ポスト数）
 */
const POSTS_PER_PAGE = 20;

interface PostListProps {
  // TODO: 後で post の型を設定すること。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any;
}

const PostList = ({ posts }: PostListProps) => {
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
      <div className="grid gap-x-12 md:grid-cols-1">
        {posts.map((post) => (
          <div className="my-4" key={post.title}>
            <PostListItem key={post.title} post={post} />
          </div>
        ))}
      </div>
      {/* <PostPagination /> */}
    </>
  );
};

export { PostList };
