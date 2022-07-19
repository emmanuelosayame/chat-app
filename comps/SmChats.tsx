import { SettingsIcon, PhoneIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArchiveIcon } from "@heroicons/react/solid";
import { ReactNode } from "react";

const SmChats = ({ children }: { children: ReactNode }) => {
  return (
    <Box pos="relative" w="100%" h="full">
      {/* <Flex bgColor="gray.300" py="1" mb="1">
        <ArchiveIcon width={23} />
        <Text ml="3">Archived</Text>
      </Flex> */}
      {children}
    </Box>
  );
};

export default SmChats;
