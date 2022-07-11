import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  DocumentData,
  FirestoreError,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Loading from "../comps/Loading";
import Login from "../comps/Login";
import { GlobalContext } from "../context/GlobalContext";
import {
  useCollection,
  useCollectionOnce,
  useDocument,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const dataQuery = doc(db, "Users", `${user?.uid}`);
  const [data, dataLoading, dataError] = useDocument(dataQuery);
  const userData = data?.data();
  const chatQuery = query(
    collection(db, "chatGroup"),
    where("USID", "array-contains", `${user?.uid}`)
  );
  const [chats] = useCollection(chatQuery);
  // console.log(chats)

  useEffect(() => {
    if (user) {
      UpdateUserData();
    }
  }, [user]);
//  auth.signOut()
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
  const values = {
    userData: userData,
    userDataError: dataError,
    chats: chats,
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
