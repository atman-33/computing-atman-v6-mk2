import { Outlet } from '@remix-run/react';
import { Footer } from './components/footer';
import { Header } from './components/header';

const LandingLayout = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto w-full px-2 py-4 md:w-11/12 md:px-0">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default LandingLayout;
