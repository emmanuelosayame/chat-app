// import { DeleteIcon, PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "../comps/Header";
import SmChats from "../comps/SmChats";
// import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Flex h="100vh" w="100%" bgColor="gray.200" pos="fixed">
      <Box w={["full", "full", "40%", "30%"]} position="relative">
        <Box
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "18px",
              backgroundColor: "teal",
              border: '3px solid red'
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "blue",
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
