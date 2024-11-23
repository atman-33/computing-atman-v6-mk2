import { Outlet } from '@remix-run/react';
import { Footer } from './components/footer';
import { Header } from './components/header';

const LandingLayout = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto w-full py-4 md:w-10/12">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default LandingLayout;
