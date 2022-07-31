import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
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
  Stack,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArchiveIcon,
  CheckCircleIcon,
  CheckIcon,
  DatabaseIcon,
  KeyIcon,
  MoonIcon,
  PencilIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import {
  AtSymbolIcon,
  BadgeCheckIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import { clearIndexedDbPersistence, terminate } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import Bucket from "./Bucket";
import Profile from "./Profile";

const Settings = ({ userData, isOpen, onClose, onOpen }: any) => {
  const user = auth.currentUser;
  const router = useRouter();
  const [bucket, setBucket] = useState<boolean>(false);
  const {
    isOpen: profileIsOpen,
    onOpen: profileOnOpen,
    onClose: profileOnClose,
  } = useDisclosure();
  const {
    isOpen: accountIsOpen,
    onOpen: accountOnOpen,
    onClose: accountOnClose,
  } = useDisclosure();

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

  const SettingsMenu = () => {
    return (
      <Stack mx="0" w={["full", "full", "50%", "35%"]}>
        <Flex
          borderRadius={15}
          flexDir="column"
          mt="5"
          mb="3"
          p="1"
          bgColor="#74748014"
        >
          <Button
            onClick={() => {
              accountOnOpen();
              profileIsOpen && profileOnClose();
            }}
            borderRadius={12}
            justifyContent="space-between"
            variant="ghost"
            mt="1"
            px="1"
            size="sm"
            rightIcon={<ChevronRightIcon width={30} color="#3c3c434c" />}
          >
            <Flex align="center">
              <Box
                mx="3"
                bgColor="#007bff89"
                borderRadius={12}
                border="1px solid #1068c545"
                p="1.5"
              >
                <KeyIcon color="black" width={20} />
              </Box>
              Account
            </Flex>
          </Button>
          <Divider w="90%" m="1" alignSelf="end" />
          <Button
            onClick={() => {
              setBucket(true);
            }}
            borderRadius={12}
            justifyContent="space-between"
            variant="ghost"
            mb="1"
            px="1"
            size="sm"
            rightIcon={<ChevronRightIcon width={30} color="#3c3c434c" />}
          >
            <Flex align="center">
              <Box
                mx="3"
                bgColor="#ffcc00ea"
                borderRadius={12}
                p="1.5"
                border="1px solid #dfb200c3"
              >
                <ArchiveIcon color="black" width={20} />
              </Box>
              My Bucket
            </Flex>
          </Button>
        </Flex>

        <Flex
          justifyContent="space-between"
          borderRadius={10}
          bgColor="#74748014"
          p="1.5"
        >
          <Flex px="1">
            <Flex fontWeight={600} align="center">
              <Box mx="2" bgColor="#c6c6c8ff" borderRadius={12} p="1.5">
                <MoonIcon color="black" fill="black" width={20} />
              </Box>
              Dark Mode
            </Flex>
          </Flex>
          <Switch isDisabled alignSelf="center" size="lg" />
        </Flex>
        <Text textAlign="center" fontSize={16} color="#3c3c4399">
          coming soon
        </Text>
      </Stack>
    );
  };

  const Account = () => {
    return (
      <Flex
        flexDirection="column"
        // justify="space-between"
        align="center"
        w={["full", "full", "50%", "65%"]} // h="200px"
        bgColor="whitesmoke"
        my="5"
        borderRadius={10}
      >
        {/* <IconButton
          aria-label="close-setting-page"
          icon={<ChevronLeftIcon width={40} />}
          variant="ghost"
          onClick={accountOnClose}
          alignSelf="start"
          bgColor="white"
          m="2"
          size="sm"
          color="blue.300"
          borderRadius="15px"
        /> */}
        <Button
          aria-label="close-setting-page"
          variant="ghost"
          onClick={accountOnClose}
          alignSelf="start"
          // bgColor="white"
          m="2"
          size="sm"
          color="blue.300"
          borderRadius="15px"
        >
          Back
        </Button>
        <Button
          w="90%"
          my="5"
          bgColor="white"
          p="3"
          borderRadius={12}
          onClick={profileOnOpen}
          justifyContent="space-between"
          rightIcon={<ChevronRightIcon width={30} color="#3c3c434c" />}
        >
          <Flex align="center">
            <Box mx="2" bgColor="#007bff89" borderRadius={15} p="1.5">
              <UserIcon fill="black" width={20} />
            </Box>
            Edit Profile
          </Flex>
        </Button>
        <Container h="full">
          <Flex
            fontWeight={600}
            fontSize={17}
            p="2"
            bgColor="white"
            borderRadius={10}
            m="2"
          >
            <Text mx="2">Email:</Text>
            <Text>{user?.email}</Text>
          </Flex>
          <Text fontSize={12} textAlign="center" color="#3c3c434c">
            your email is private and not visible to other users
          </Text>
          <Flex
            align="center"
            fontWeight={600}
            p="2"
            bgColor="white"
            borderRadius={10}
            m="2"
            fontSize={17}
          >
            <Text mx="2">Last SignedIn:</Text>
            <Text>{user?.metadata.lastSignInTime}</Text>
          </Flex>
        </Container>
        <Button
          borderRadius="15px"
          bgColor="white"
          color="#007affff"
          fontSize={18}
          p="2"
          m="3"
          mx="auto"
          size="sm"
          onClick={logout}
          // color="#007affff"
        >
          Logout
        </Button>
      </Flex>
    );
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
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        {/* <DrawerOverlay /> */}
        <DrawerContent
          border="2px solid white #2c2c2eff"
          // boxShadow="md"
          pos="fixed"
          borderTopRadius={bucket ? "unset" : 10}
          w={bucket ? "full" : ["full", "99%"]}
          h={bucket ? "full" : ["95%", "96.5%"]}
          mx="auto"
        >
          {!(bucket || profileIsOpen) && (
            <DrawerHeader
              display="flex"
              // px="2"
              justifyContent="space-between"
              w="full"
            >
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
                  <Text fontSize="md">{userData?.name}</Text>
                  <Box display="flex">
                    {/* <AtSymbolIcon width={20} /> */}
                    <Text
                      fontWeight="thin"
                      color="#3c3c4399"
                      fontSize="sm"
                      mr="1"
                    >
                      {userData?.userName}
                    </Text>
                    {!userData?.verified && (
                      <BadgeCheckIcon fill="#007affff" width={20} />
                    )}
                  </Box>
                </Box>
              </Flex>
              <Button
                onClick={() => {
                  accountOnClose();
                  onClose();
                }}
                color="#007affff"
                borderRadius={["15px", "19px"]}
                variant="outline"
                fontSize={[12, 16, 17]}
                m="1"
                size={["sm", "md", "md"]}
                display="block"
                textAlign="center"
              >
                <ChevronUpIcon width="100%" height={20} />
                <Text display={["none", "block", "block"]} mx="-2">
                  Chats
                </Text>
              </Button>
            </DrawerHeader>
          )}
          {bucket ? (
            <Bucket setBucket={setBucket} />
          ) : (
            <DrawerBody h="full" display="flex" flexWrap="wrap-reverse">
              {profileIsOpen ? (
                <Profile profileOnClose={profileOnClose} userData={userData} />
              ) : accountIsOpen ? (
                <Account />
              ) : (
                <SettingsMenu />
              )}
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default Settings;
