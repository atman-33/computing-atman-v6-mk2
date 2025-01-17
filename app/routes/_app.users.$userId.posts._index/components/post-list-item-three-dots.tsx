import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { Link, useFetcher, useParams } from '@remix-run/react';
import { useCallback } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/shadcn/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/shadcn/ui/dropdown-menu';
import { useAllPostsStore } from '../stores/all-posts-store';
import { PostNode } from '../types';

interface PostListItemThreeDotsProps {
  post: PostNode;
}

export const PostListItemThreeDots = ({ post }: PostListItemThreeDotsProps) => {
  const { userId } = useParams<{ userId: string }>();
  const fetcher = useFetcher();

  const removePost = useAllPostsStore((state) => state.removePost);

  const handleDeleteClick = useCallback(() => {
    fetcher.submit(
      {
        _action: 'delete',
        postId: post?.id ?? '',
      },
      { method: 'post', action: '/resources/post' },
    );
    removePost(post?.id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  // NOTE: [shadcn/uiのドロップダウンメニューの中にアラートダイアログを使うときの注意](https://zenn.dev/miyabitti256/articles/7002672f5b0ea7)

  return (
    <AlertDialog>
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
            <AlertDialogTrigger className="w-full">
              <DropdownMenuItem>削除</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除してよろしいですか？</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteClick()}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
