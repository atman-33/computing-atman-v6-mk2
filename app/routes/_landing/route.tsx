import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getThemeFromCookies } from '~/utils/theme.server';
import { Footer } from './components/footer';
import { Header } from './components/header';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentTheme = await getThemeFromCookies(request);
  return json({ currentTheme });
};

const LandingLayout = () => {
  const { currentTheme } = useLoaderData<typeof loader>();

  return (
    <>
      <Header theme={currentTheme} />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingLayout;
