import { Link, Outlet } from '@remix-run/react';
import { Logo } from '~/components/shared/logo';
import { siteConfig } from '~/config/site-config';

const AuthLayout = () => {
  return (
    <>
      <div className="m-4 flex justify-center">
        <Link to="/" className="flex items-center gap-2 text-nowrap">
          <Logo />
          <span className="ml-2 text-nowrap text-lg font-bold md:text-xl">{siteConfig.name}</span>
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export default AuthLayout;
