import { Link } from '@remix-run/react';
import { MdAccountCircle } from 'react-icons/md';
import { Button } from '~/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/shadcn/ui/dropdown-menu';
import { Spinner } from '~/components/shared/spinner';
import { useLogout } from '~/routes/resources.auth.logout/hooks/use-logout';
import { useAuthUser } from '~/routes/resources.auth/hooks/use-auth-user';

export const LoginButton = () => {
  const { user, isLoading: isLoadingAuth } = useAuthUser();
  const { logout, isLoading: isLoadingLogout } = useLogout();

  if (isLoadingAuth) {
    return <Spinner />;
  }

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:!outline-none">
            {user.image ? (
              <img src={user.image} alt={user.name} className="h-10 w-10" />
            ) : (
              <MdAccountCircle className="h-10 w-10 text-primary" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name} さん</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={`users/${user.id}/posts`}>
              <DropdownMenuItem>自分の記事</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} disabled={isLoadingLogout}>
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth/login">
          <Button className="h-8 font-bold">Log in</Button>
        </Link>
      )}
    </>
  );
};
