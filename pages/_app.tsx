import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { auth, db, rdb } from "../firebase/firebase";
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
import { useEffect } from "react";
import { browserName } from "react-device-detect";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
// import { useRouter } from "next/router";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const onlineRef = ref(rdb, `status/${user?.uid}/online`);
  const lastSeenRef = ref(rdb, `status/${user?.uid}/lastSeen`);
  const statusRef = ref(rdb, ".info/connected");

  useEffect(() => {
    router.push("/");
    TimeAgo.addDefaultLocale(en);
  }, []);

  useEffect(() => {
    if (user) {
      onValue(statusRef, (snap) => {
        if (snap.val() === true) {
          const con = push(onlineRef);

          onDisconnect(con).remove();

          set(con, browserName);

          onDisconnect(lastSeenRef).set(serverTimestamp());
        }
      });
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ChakraProvider>
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
    <Flex h="100vh" w="full" align="center" justify="center">
      <SpinnerDotted color="#007affff" />
    </Flex>
  );
};
