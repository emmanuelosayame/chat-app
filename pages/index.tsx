import type { NextPage } from "next";
import { Box, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import Header from "../comps/Header";
import NewChatComp from "../comps/NewChat";
import { PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { ArchiveIcon } from "@heroicons/react/solid";

const Home: NextPage = () => {
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
          <Box pos="relative" w="100%" h="full">
            <Flex bgColor="gray.300" py="1">
              <ArchiveIcon width={23} />
              <Text ml="3">Archived</Text>
            </Flex>
            <Flex flexDirection="column" pos="absolute" right={2} bottom={5}>
              <IconButton
                aria-label="a"
                size="sm"
                rounded="full"
                icon={<PhoneIcon />}
              />
              <IconButton
                aria-label="b"
                size="sm"
                rounded="full"
                icon={<SettingsIcon />}
                my="2"
              />
            </Flex>
            <Flex>hii</Flex>
            <Flex h="full" justify="center" align="center">
              <NewChatComp text="Start Chat" />
              {/* <Button aria-label="modal-button" mt={1} size="sm" variant="link" >
          Start Chat
        </Button> */}
            </Flex>
          </Box>
        </Box>
      </Box>
      {/* next */}
      <Box display={["none", "none", "block"]}>hii</Box>
    </Flex>
  );
};

export default Home;
