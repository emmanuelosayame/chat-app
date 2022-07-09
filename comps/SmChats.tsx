import { DeleteIcon, PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
// import ChatDrawer from "./ChatDrawer";
import ChatModal from "./ChatModal";
import { auth } from "../firebase/firebase";
import { ArchiveIcon } from "@heroicons/react/solid";

const SmChats = () => {
  const user = auth.currentUser;

  

  return (
    <Box pos="relative" w="100%" h="full">
      <Flex bgColor="gray.300" py="1">
        <ArchiveIcon width={23} />
        <Text ml="3">Archived</Text>
      </Flex>
      <Flex flexDirection="column" pos="absolute" right={2} bottom={5}>
        <IconButton
          aria-label="a"
          size="sm"
          rounded="full"
          icon={<PhoneIcon />}
        />
        <IconButton
          aria-label="b"
          size="sm"
          rounded="full"
          icon={<SettingsIcon />}
          my="2"
        />
      </Flex>
      <Flex>hii</Flex>
      <Flex h="full" justify="center" align="center">
        <ChatModal text="Start Chat" />
        {/* <Button aria-label="modal-button" mt={1} size="sm" variant="link" >
          Start Chat
        </Button> */}
      </Flex>
    </Box>
  );
};

export default SmChats;
