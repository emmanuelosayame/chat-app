import { Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode; setSelectChat: any }) => {
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
      p="2"
      align="center"
    >
      {children}
    </Flex>
  );
};

export default Header;
