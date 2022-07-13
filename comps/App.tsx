import type { NextPage } from "next";
import { Box, Flex, IconButton, Text, useMediaQuery } from "@chakra-ui/react";
import Header from "../comps/Header";
import NewChatComp from "../comps/NewChat";
import { PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { ArchiveIcon } from "@heroicons/react/solid";
import SmChats from "../comps/SmChats";
import { ReactNode } from "react";

const View = ({ children }:{children:ReactNode}) => {
  // console.log("hii")
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
      <Box display={["none", "none", "block"]}>{children}</Box>
    </Flex>
  );
};

export default View;
