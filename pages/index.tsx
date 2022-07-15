import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { auth } from "../firebase/firebase";

const Home: NextPage = () => {
  return (
    <>
      <Flex></Flex>
      <Flex w="full" align='center' h="full">
        <Text fontSize={25} fontWeight={600} mx="auto">
          such empty !!
        </Text>
      </Flex>
    </>
  );
};

export default Home;
