import { Box, Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login: NextPage = () => {
  const provider = new GoogleAuthProvider();

  const signIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      // .then((result) => {
      //   // This gives you a Google Access Token. You can use it to access the Google API.
      //   const credential = GoogleAuthProvider.credentialFromResult(result);
      //   const token = credential?.accessToken;
      //   // The signed-in user info.
      //   const user = result.user;
      // })
      // .catch((error) => {
      //   // Handle Errors here.
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      //   // The email of the user's account used.
      //   const email = error.customData?.email;
      //   // The AuthCredential type that was used.
      //   const credential = GoogleAuthProvider.credentialFromError(error);
      //   // ...
      // });
  };

  return (
    <Flex alignItems="center" h="100vh" justify="center">
      <Button onClick={signIn}>Login</Button>
    </Flex>
  );
};

export default Login;
