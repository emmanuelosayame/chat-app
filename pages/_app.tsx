import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { auth, db, rdb } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../comps/Login";
import { SpinnerDotted } from "spinners-react";
import App from "../comps/App";
import {
  onDisconnect,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { browserName } from "react-device-detect";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import theme from "../theme";
import Head from "next/head";
// import { useRouter } from "next/router";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ChakraProvider theme={theme}>
      {!user ? (
        <Login />
      ) : (
        <App router={router} Component={Component} pageProps={pageProps} />
      )}
    </ChakraProvider>
  );
}

export default MyApp;

export const Loading = () => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <Flex h="100vh" w="full" align="center" justify="center">
        <SpinnerDotted color="#007affff" />
      </Flex>
    </>
  );
};
