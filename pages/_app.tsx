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
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Loading from "../comps/Loading";
import Login from "../comps/Login";
import { GlobalContext } from "../context/GlobalContext";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { promises } from "stream";

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

  const [recData, setRecData] = useState<any>();

  const getRecData = async () => {
    if (!chats) return;
    const chatsUsersData = chats?.docs.map(
      async (rec: DocumentData | undefined) =>
        await getDoc(
          doc(
            db,
            "Users",
            `${rec
              ?.data()
              .USID.filter(
                (arr: string | null | undefined) => arr !== user?.uid
              )}`
          )
        )
    );
    const data = await Promise.all<any>(chatsUsersData);
    const recsData = data.map((rec: DocumentData | undefined) => {
      return { id: rec?.id, data: rec?.data() };
    });
    setRecData(recsData);
  };

  console.log(recData);

  // auth.signOut()
  useEffect(() => {
    if (user) {
      getRecData();
    }
  }, [chats]); 

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
  const values = {
    userData: userData,
    userDataError: dataError,
    chats: chats,
    recData: recData,
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
