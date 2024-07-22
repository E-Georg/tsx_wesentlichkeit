import { Outlet, useLoaderData, useSubmit } from 'react-router-dom';
import MainNavigation from '../MainNavigation/MainNavigation';
import { useEffect } from 'react';
import { getTokenDuration } from '../../utils/auth';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './RootLayout.css';

const RootLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  }, [token, submit]);
  return (
    <>
      <MainNavigation />
      <Header />
      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default RootLayout;
