import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { CogIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import { auth } from "../firebase/firebase";

const Home: NextPage = ({ userData }: any) => {
  // console.log(userData)
  return (
    <Box
      bgColor="whiteAlpha.500"
      backdropFilter="auto"
      backdropBlur="md"
      w="full"
      h="full"
    >
      <Flex h="8" justify="space-between">
        <Text>...</Text>
        
      </Flex>
      <Flex w="full" align="center" h="full">
        <Text fontSize={25} opacity={0.7} fontWeight={600} mx="auto">
          such empty !!
        </Text>
      </Flex>
    </Box>
  );
};

export default Home;
