import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
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
import { DuplicateIcon } from "@heroicons/react/solid";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../firebase/firebase";

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
    auth.signOut();
  };
  return (
    <>
      <IconButton
        color="blue.400"
        aria-label="settings"
        bgColor="transparent"
        icon={<ChevronDownIcon boxSize={4} />}
        onClick={onOpen}
        size="sm"
      />
      <Drawer isOpen={isOpen} placement="top" onClose={onClose} size="full">
        {/* <DrawerOverlay /> */}
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader display="flex">
            <Avatar mr="2" />
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
          </DrawerHeader>

          <DrawerBody pt="100">
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

          <DrawerFooter>
            <Button
              variant="outline"
              borderRadius={20}
              mr={3}
              onClick={onClose}
              size="lg"
            >
              Cancel
            </Button>
            <Button colorScheme="orange" borderRadius={20} size="sm">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Settings;
