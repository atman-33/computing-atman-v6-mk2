import { Outlet } from '@remix-run/react';
import { Footer } from './components/footer';
import { Header } from './components/header';

const LandingLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingLayout;
