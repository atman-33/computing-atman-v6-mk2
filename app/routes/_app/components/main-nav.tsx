import { Link } from '@remix-run/react';
import { Logo } from '../../../components/shared/logo';

export function MainNav() {
  return (
    <div className="hidden md:flex">
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );
}
