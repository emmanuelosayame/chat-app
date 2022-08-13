import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db, rdb } from "../pages/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useDocumentData } from "react-firebase-hooks/firestore";

const Login: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  // const [token,setToken] = useState<string | undefined>("")
  // const toast = useToast();
  // const [signedUser, setSignedUser] = useState<any | null>(null);
  const provider = new GoogleAuthProvider();

  const signIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const nameRef = ref(
          rdb,
          `Users/${
            user?.displayName
              ? user?.displayName?.toLowerCase() + user?.uid
              : "user"
          }`
        );
        getDoc(doc(db, "Users", `${user.uid}`)).then((snapshot) => {
          const userData = snapshot.data();
          if (!userData?.name) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                name: `${user?.displayName}`,
              },
              { merge: true }
            );

            set(nameRef, {
              uid: user?.uid,
              name: user?.displayName,
              photoURL: `${user?.photoURL && user?.photoURL}`,
            });
          }

          if (!userData?.photoURL) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                photoURL: `${user?.photoURL && user?.photoURL}`,
              },
              { merge: true }
            );
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <>
      <Flex
        alignItems="center"
        h="100vh"
        position="fixed"
        right="0"
        left="0"
        top="0"
        bottom="0"
        justify="center"
      >
        <Button onClick={signIn}>Login</Button>
      </Flex>
    </>
  );
};

export default Login;
