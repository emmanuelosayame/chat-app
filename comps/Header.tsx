import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { PencilAltIcon } from "@heroicons/react/solid";
import NewChatComp from "./NewChat";
import { ReactNode } from "react";

const Header = ({children}:{children:ReactNode}) => {
  
  return (
    <Flex w="full" h="auto" p={2}>
      {/* <Avatar position="absolute" top="2" left="2" size="sm" zIndex={1000} /> */}

      <Flex
        justify="space-between"
        h="9"
        position="absolute"
        w="full"
        left={0}
        top={0}
        bgColor="whiteAlpha.500"
        backdropFilter="auto"
        backdropBlur="md"
        zIndex={1000}
        px="2"
        align='center'
      >
        <Text fontWeight={600} color="orange.300" >Edit</Text>

        <Text fontWeight={800} textAlign="center">
          ChatApp
        </Text>

        <Flex align='center' >{children}</Flex>
      </Flex>

      <InputGroup mt={10}>
        <InputLeftElement children={<SearchIcon w="3" mb="1.5" />} />
        <Input
          size="sm"
          variant="filled"
          type="text"
          borderRadius="12"
          placeholder="Search"
          bgColor="whitesmoke"
          _placeholder={{ color: "gray.300" }}
          focusBorderColor="gray.200"
          _hover={{ bgColor: "white" }}
          _focus={{ bgColor: "white" }}
        />
      </InputGroup>
    </Flex>
  );
};

export default Header;
