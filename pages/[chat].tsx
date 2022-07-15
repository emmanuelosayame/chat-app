import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { auth } from "../firebase/firebase";

const Chats:NextPage = () => {
  const logout = () => {
    auth.signOut();
  };
  return (
    <Flex w="100%" h="100%" justify="center" align="center">
      <Button size="sm" onClick={logout}>
        logout
      </Button>
    </Flex>
  );
  }
export default Chats;