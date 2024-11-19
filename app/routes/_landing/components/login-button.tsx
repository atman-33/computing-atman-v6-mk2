import { Link } from '@remix-run/react';
import { Button } from '~/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
          <DropdownMenuTrigger>
            <div>{`Hello ${user.name} さん`}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>自分の記事</DropdownMenuItem>
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
