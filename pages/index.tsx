import type { NextPage } from "next";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";

import Header from "../comps/Header";
import SmChats from "../comps/SmChats";
import Loading from "../comps/Loading";
import Login from "../comps/Login";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const [user, loading] = useAuthState(auth);

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
