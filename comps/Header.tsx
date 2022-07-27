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

const Header = ({
  children,
  mappedChats,
}: {
  children: ReactNode;
  mappedChats: any;
}) => {
  // console.log(chatUsersList);

  return (
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
      align="center"
    >
      <Text fontWeight={600} fontSize={17} color="#007affff">
        Edit
      </Text>

      <Text fontWeight={800} textAlign="center">
        ChatApp
      </Text>

      <Flex align="center">{children}</Flex>
    </Flex>
  );
};

export default Header;
