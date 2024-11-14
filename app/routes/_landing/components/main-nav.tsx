import Link from 'next/link';
import { Logo } from './logo';

export function MainNav() {
  // const pathname = usePathname();

  return (
    <div className="hidden md:flex">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {/* NOTE: リンクを増やす場合は、こちらに追記していく。  */}
        {/* <Link
          href="/docs"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/docs' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Docs
        </Link> */}
        {/* <Link
          href={siteConfig.links.github}
          className={cn(
            'hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block',
          )}
        >
          GitHub
        </Link> */}
      </nav>
    </div>
  );
}
