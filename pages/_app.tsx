import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import {
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Loading from "../comps/Loading";
import Login from "../comps/Login";
import { GlobalContext } from "../context/GlobalContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<DocumentData | undefined>([]);

  useEffect(() => {
    if (user) {
      UpdateUserData();
    }
  }, []);

  // remember to wrap async code in useeffect
  const UpdateUserData = async () => {
    await setDoc(
      doc(db, "Users", `${user?.uid}`),
      {
        // username: user?.displayName,
        emailName: [user?.email, user?.displayName],
        photoURL: user?.photoURL,
        lastseen: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    (async () => {
      const data = await getDoc(doc(db, "Users", `${user?.uid}`));
      setUserData(data.data());
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }
  const values = {
    userData: userData,
  };

  return (
    <GlobalContext.Provider value={values}>
      <ChakraProvider>
        {user ? <Component {...pageProps} /> : <Login />}
      </ChakraProvider>
    </GlobalContext.Provider>
  );
}

// export const useGlobals = () => {
//   return useContext(AppContext);
// };

export default MyApp;
