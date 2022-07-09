import type { NextPage } from "next";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";

import Header from "../comps/Header";
import SmChats from "../comps/SmChats";
import Loading from "../comps/Loading";
import Login from "../comps/Login";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import {people} from '@googleapis/people'

const Home: NextPage = () => {
  // const modalState = useDisclosure()
  // const { user, loading } = useGlobals();

  // const getContact = ()=>{
  //     const contact = people({
  //       version: "v1",
  //       auth: "AIzaSyBU_Ee-_PCNHsUlyV80GNoXCz0g1pT1Lrg",
  //     });
  // }
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      UpdateUserData();
    }
  }, [user]);

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

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Flex h="100vh" w="100%" bgColor="gray.200" pos="fixed">
      <Box w={["full", "full", "40%", "30%"]} position="relative">
        <Box
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
              backgroundColor: "blue.500",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "18px",
              backgroundColor: "teal.400",
            },
          }}
          w="full"
          h="full"
          overflowY="scroll"
          borderRight={["none", "none", "2px"]}
        >
          <Header />

          <SmChats />
        </Box>
      </Box>
      {/* next */}
      <Box display={["none", "none", "block"]}>hii</Box>
    </Flex>
  );
};

export default Home;
