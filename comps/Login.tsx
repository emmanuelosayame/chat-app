import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useState } from "react";

const Login: NextPage = () => {

  // const [token,setToken] = useState<string | undefined>("")
  const toast = useToast();
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

  // console.log(token)
  // auth.signOut()

  return (
    <>
      <Flex alignItems="center" h="100vh" justify="center">
        <Button onClick={signIn}>Login</Button>
      </Flex>
      <Button
        size="sm"
        onClick={() =>
          toast({
            position: "bottom-right",
            duration: 1200,
            render: () => (
              <Box
                color="white"
                p={3}
                bg="orange.300"
                w="200px"
                h="70px"
                borderRadius={20}
              >
                <Text>{}</Text>
              </Box>
            ),
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
};

export default Login;
