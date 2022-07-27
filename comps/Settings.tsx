import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/outline";
import {
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  DuplicateIcon,
} from "@heroicons/react/solid";
import {
  clearIndexedDbPersistence,
  DocumentData,
  terminate,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth, db } from "../firebase/firebase";

const Settings = ({
  userData,
}: {
  userData: DocumentData | null | undefined;
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (userData) {
      if (!userData?.userName) {
        onOpen();
      }
    }
  }, [userData]);
  const logout = () => {
    router.push("/");
    terminate(db);
    clearIndexedDbPersistence(db);
    auth.signOut();
  };
  return (
    <>
      <IconButton
        color="#007affff"
        aria-label="settings"
        bgColor="transparent"
        icon={<ChevronDownIcon boxSize={5} />}
        onClick={onOpen}
        size="sm"
      />
      <Drawer isOpen={isOpen} placement="top" onClose={onClose} size="full">
        {/* <DrawerOverlay /> */}
        <DrawerContent pos="fixed">
          <DrawerHeader display="flex" justifyContent="space-between">
            <Flex>
              {userData?.photoURL ? (
                <Box
                  borderRadius="50%"
                  w="60px"
                  h="60px"
                  overflow="hidden"
                  border="1px solid #3c3c432d"
                  mx="2"
                >
                  <Image
                    referrerPolicy="no-referrer"
                    loader={() => userData?.photoURL}
                    src={userData?.photoURL}
                    width="100%"
                    height="100%"
                  />
                </Box>
              ) : (
                <Avatar mr="2" />
              )}
              <Box>
                <Box>{userData?.name}</Box>
                <Box fontWeight="thin" fontSize="sm">
                  {userData?.userName}
                </Box>
              </Box>
              <IconButton
                aria-label="copy-link"
                size="sm"
                bgColor="transparent"
                icon={<DuplicateIcon width={15} />}
              />
            </Flex>
            <Box onClick={onClose} borderRadius="50%" color="#007affff">
              <ChevronUpIcon width={30} height={30} />
              <Text fontSize={12} textAlign="center" mt="-2">
                chats
              </Text>
            </Box>
          </DrawerHeader>
          <Divider borderColor="#007bff81" />
          <DrawerBody h="full">
            <Flex
              mx="auto"
              borderRadius={8}
              flexDir="column"
              justify="start"
              w="90%"
              my="3"
              bgColor="whitesmoke"
            >
              <Button m="2">Account</Button>
              <Button m="2">Data</Button>
            </Flex>
            <Flex
              mx="auto"
              borderRadius={8}
              flexDir="column"
              justify="start"
              w="90%"
              my="3"
              bgColor="whitesmoke"
            >
              <Button m="2">Account</Button>
              <Button m="2">Data</Button>
              <Button m="2">Account</Button>
              <Button m="2">Data</Button>
            </Flex>
            <Button size="sm" onClick={logout}>
              logout
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Settings;
