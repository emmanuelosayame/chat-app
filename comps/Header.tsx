import { Flex, Text } from "@chakra-ui/react";
import { Dispatch, ReactNode } from "react";

const Header = ({
  children,
  setSelectChat,
}: {
  children: ReactNode;
  setSelectChat: any;
}) => {
  return (
    <Flex
      justify="space-between"
      h="9"
      position="absolute"
      w="full"
      left={0}
      top={0}
      bgColor="#f2f2f783"
      backdropFilter="auto"
      backdropBlur="md"
      zIndex={1000}
      px="2"
      align="center"
    >
      <Text
        onClick={setSelectChat.toggle}
        fontWeight={600}
        fontSize={17}
        color="#007affff"
        cursor="pointer"
      >
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
