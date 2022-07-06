import { DeleteIcon, PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Header from "./comps/Header";
import SmChats from "./comps/SmChats";
// import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Box h="100vh" w='100%' bgColor="gray.200">
      <Header />
      <Flex >
        <SmChats />
        {/* next */}
        <Box w="250%" display={["none","none","block"]}>
          hii
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
