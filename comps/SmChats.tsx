import { SettingsIcon, PhoneIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { ArchiveIcon } from "@heroicons/react/solid";
import { collection, DocumentData, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useGlobal } from "../context/GlobalContext";
import { auth, db } from "../firebase/firebase";
import Chat from "./Chat";
import NewChatComp from "./NewChat";

const SmChats = () => {
  const { recData } = useGlobal();

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
      {!!recData?.empty ? (
        <Flex h="full" justify="center" align="center">
          <NewChatComp text="Start Chat" />
        </Flex>
      ) : (
        <Box>
          {recData?.map((user: DocumentData | undefined) => (
            <Chat key={user?.id} uid={user?.id} data={user?.data} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SmChats;
