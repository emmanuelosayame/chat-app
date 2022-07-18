import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { auth, db} from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Login from "../comps/Login";
import { SpinnerDotted } from "spinners-react";
import App from "../comps/App";
// import { FuegoProvider } from "swr-firestore-v9";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      UpdateUserData();
    }
  }, [user]);
  // remember to wrap async code in useeffect
  const UpdateUserData = async () => {
    setDoc(
      doc(db, "Users", `${user?.uid}`),
      {
        Uid: [`${user?.displayName}`, `${user?.email}`],
        userName: `${user?.email}`,
        name: `${user?.displayName}`,
        photoURL: user?.photoURL,
        lastseen: serverTimestamp(),
      },
      { merge: true }
    );
  };
  if (loading) {
    return <Loading />;
  }

  return (
    // <FuegoProvider fuego={fuego}>
      <ChakraProvider>
        {!user ? (
          <Login />
        ) : (
          <App>
            <Component {...pageProps} />
          </App>
        )}
      </ChakraProvider>
    // </FuegoProvider>
  );
}

export default MyApp;

export const Loading = () => {
  return (
    <Flex h="100vh" w="full" align="center" justify="center">
      <SpinnerDotted color="orange" />
    </Flex>
  );
};
