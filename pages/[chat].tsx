import { Avatar, Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { NextPage } from "next";
import { auth } from "../firebase/firebase";

const Chats: NextPage = () => {
  const logout = () => {
    auth.signOut();
  };
  return (
    <>
      <Flex w="full">
        <IconButton
          display={["block", "block", "none"]}
          aria-label="back-btn"
          size="sm"
          icon={<ChevronLeftIcon />}
        />
        <Avatar size="sm" alignSelf="center" mx="2" />
        <Box>
          <Text fontWeight={600} fontSize={20}>
            Recipient
          </Text>
          online
        </Box>
      </Flex>
      <Flex w="100%" h="100%" justify="center" align="center">
        <Button size="sm" onClick={logout}>
          logout
        </Button>
      </Flex>
    </>
  );
};
export default Chats;
