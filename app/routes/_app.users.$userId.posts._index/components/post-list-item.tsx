import { Link } from '@remix-run/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { PostDate } from './post-date';

interface PostListItemProps {
  // TODO: 後で post の型を設定すること。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: any;
}

const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <div className="flex items-center rounded-md border-2 p-4">
      <Link to="" className="flex grow space-x-4">
        <div className="whitespace-nowrap">
          <div className="flex h-20 min-h-20 w-20 min-w-20 items-center justify-center rounded-full bg-background text-5xl">
            <div>{post?.emoji}</div>
          </div>
        </div>
        <div className="flex items-center space-y-2">
          <div>
            <h2 className="overflow-x-hidden text-wrap font-semibold">{post?.title}</h2>
            <div className="flex flex-wrap space-x-2">
              {/* <PostTags post={post} /> */}
              <PostDate post={post} />
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4">
        <BsThreeDotsVertical className="h-6 w-6" />
      </div>
    </div>
  );
};

export { PostListItem };
