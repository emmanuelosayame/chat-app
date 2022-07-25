import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        // setToken(token);
        // The signed-in user info.
        // const user = result.user;
        // setSignedUser(user);
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

  // auth.signOut()
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
