import { Link } from '@remix-run/react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { siteConfig } from '~/config/site-config';
import { MainNav } from './main-nav';
import ToggleThemeButton from './toggle-theme-button';

export const Header = ({ theme }: { theme: string }) => {
  return (
    <header className="top-0 z-50 mx-auto flex justify-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex h-14 w-full items-center justify-center md:container md:w-10/12">
        <MainNav />
        {/* <MobileNav docsConfig={docsConfig} /> */}
        <Link to="/">
          <span className="ml-2 text-nowrap text-lg font-bold md:text-xl">{siteConfig.name}</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* <CommandMenu /> */}</div>
          <nav className="hidden items-center sm:flex sm:gap-4">
            <Link to={siteConfig.links.github} target="_blank" rel="noreferrer">
              <FaGithub className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link to={siteConfig.links.twitter} target="_blank" rel="noreferrer">
              <FaTwitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <ToggleThemeButton theme={theme} />
          </nav>
          <div className="flex items-center space-x-2">{/* <LoginButton /> */}</div>
        </div>
      </div>
    </header>
  );
};
