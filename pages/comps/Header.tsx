import {
  Avatar,
  Box,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";

const Header = () => {
  return (
    <Box>
      <Flex position="relative" w="100%" p={2}>
        <Avatar position="absolute" top="2" left="2" size="sm" zIndex={1000} />
        <Container
          display="flex"
          justifyItems="space-between"
          flexWrap={["wrap", "nowrap", "nowrap"]}
        >
          <Text fontWeight={600} mx="auto" pb="4">
            ChatApp
          </Text>
          <InputGroup mx="auto">
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
        </Container>
        <Flex position="absolute" right={2} top="2">
          <PhoneIcon />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
