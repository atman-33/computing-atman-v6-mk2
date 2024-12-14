import { MdOutlineEdit } from 'react-icons/md';
import { formatDate } from '~/utils/date-util';

// NOTE: 後で post の型を設定すること。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PostDate = ({ post }: { post: any }) => {
  return (
    <div className="flex items-center space-x-2 text-xs text-slate-500">
      <div className="flex items-center">
        <MdOutlineEdit className="h-5 w-5" />
        <span>{formatDate(new Date(post.updatedAt), '/')}</span>
      </div>
    </div>
  );
};

export { PostDate };
