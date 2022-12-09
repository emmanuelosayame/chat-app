import type { AppProps } from "next/app";
import "../styles/globals.css";
import { auth, db, rdb } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../components/Login";
import App from "../components/App";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Head from "next/head";
import { Loading } from "../components/Loading";
import font from "@next/font/local";

const poppins = font({
  src: [
    {
      path: "../public/fonts/Poppins-Regular.ttf",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-poppins",
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0'
        />
      </Head>

      <main className={` ${poppins.variable} font-poppins`}>
        {!user ? (
          <Login />
        ) : (
          <App>
            <Component {...pageProps} />
          </App>
        )}
      </main>
    </>
  );
}

export default MyApp;
