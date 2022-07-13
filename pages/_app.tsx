import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
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
import Login from "../comps/Login";
import { GlobalContext } from "../context/GlobalContext";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { SpinnerDotted } from "spinners-react";
import App from "../comps/App"

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

  const [chatsData, setChatsData] = useState<DocumentData>();

  const getChatsData = async () => {
    if (!chats) return;
    const chatsUsersData = chats?.docs.map(
      async (rec: DocumentData | undefined) => {
        return {
          data: (
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
          ).data(),
          id: rec?.id,
        };
      }
    );
    const data = await Promise.all<any>(chatsUsersData);
    setChatsData(data);
  };

  // auth.signOut()
  useEffect(() => {
    if (user) {
      getChatsData();
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
    chatsData: chatsData,
  };

  return (
    <GlobalContext.Provider value={values}>
      <ChakraProvider>
        {user ? (
          <App>
            <Component {...pageProps} />{" "}
          </App>
        ) : (
          <Login />
        )}
      </ChakraProvider>
    </GlobalContext.Provider>
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
