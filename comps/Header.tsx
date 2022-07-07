import {
  Avatar,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";

const Header = () => {
  return (
    <Flex w="full" h="auto" p={2}>
      {/* <Avatar position="absolute" top="2" left="2" size="sm" zIndex={1000} /> */}

      <Flex
      justify='space-between'
        h="8"
        position="absolute"
        w="full"
        left={0}
        top={0}
        bgColor="gray.200"
        zIndex={1000}
        px='2'
      >
        <Text fontWeight={600}>
          Edit
        </Text>

        <Text fontWeight={800} textAlign="center">
          ChatApp
        </Text>

        <Flex>
          <PhoneIcon />
        </Flex>
      </Flex>

      <InputGroup mt={10}>
        <InputLeftElement children={<SearchIcon w="3" mb="1" />} />
        <Input
          size="sm"
          variant="filled"
          type="text"
          borderRadius="12"
          placeholder="Search"
          bgColor="whitesmoke"
          _placeholder={{ color: "gray.300" }}
        />
      </InputGroup>
    </Flex>
  );
};

export default Header;
