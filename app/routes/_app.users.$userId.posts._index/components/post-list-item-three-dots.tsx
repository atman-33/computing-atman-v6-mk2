import { Link, useParams } from '@remix-run/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/shadcn/ui/dropdown-menu';
import { PostNode } from '../types';

interface PostListItemThreeDotsProps {
  post: PostNode;
}

export const PostListItemThreeDots = ({ post }: PostListItemThreeDotsProps) => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:!outline-none">
        <BsThreeDotsVertical className="h-6 w-6 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link to={`/users/${userId}/posts/${post?.id}/edit`}>
            <DropdownMenuItem>編集</DropdownMenuItem>
          </Link>
          {/* TODO: ここはstatusに応じて表示を変える */}
          <DropdownMenuItem>下書きに戻す</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>削除</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
