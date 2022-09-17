import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { auth, db, rdb } from "../firebase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import Image from "next/image";
import logo from "../public/logo-sign-in.png";
import { GoogleLogoIcon } from "./Svgs";

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

  const signInAnm = () => {
    signInAnonymously(auth)
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
                name: `${user?.displayName || "Someone Special"}`,
                about:
                  "Hi 😃, welcome to my project. Really nice having you here. Hope you have fun chatting 😜 . This is still termed as a work in progress. Hit me up @biglevvi on any platform ",
              },
              { merge: true }
            );

            set(nameRef, {
              uid: user?.uid,
              name: user?.displayName || "Someone Special",
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
        // ...
      });
  };

  return (
    <>
      <Flex
        alignItems='center'
        h='100vh'
        position='fixed'
        right='0'
        left='0'
        top='0'
        bottom='0'
        justify='center'
        bgColor='#f2f2f7ff'>
        <Stack>
          <Button
            size='lg'
            py={8}
            fontSize={21}
            bgColor='blue.400'
            boxShadow='lg'
            color='white'
            rounded='2xl'
            _active={{ bgColor: "transparent" }}
            onClick={signIn}>
            <GoogleLogoIcon boxSize={10} />
            <Text mx={2}>Login</Text>
          </Button>

          <Button
            size='md'
            py={4}
            fontSize={23}
            bgColor='gray'
            boxShadow='lg'
            color='white'
            rounded='2xl'
            _active={{ bgColor: "transparent" }}
            onClick={signInAnm}>
            {/* <GoogleLogoIcon boxSize={10} /> */}
            <Text mx={2}>Guest</Text>
          </Button>
        </Stack>
      </Flex>
    </>
  );
};

export default Login;
