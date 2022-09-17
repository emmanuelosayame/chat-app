import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Flex,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArchiveIcon,
  KeyIcon,
  MoonIcon,
  UserIcon,
} from "@heroicons/react/outline";
import {
  BadgeCheckIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Bucket from "./Bucket";
import DHeader from "./DHeader";
import Profile from "./Profile";

const Settings = ({
  userData,
  isOpen,
  onClose,
  onOpen,
  userNameSet,
  setUserNameSet,
}: any) => {
  const user = auth.currentUser;
  const router = useRouter();
  const [bucket, setBucket] = useState<boolean>(false);

  // const [profileLg, setProfileLg] = useState<boolean>(true);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const {
    isOpen: accountIsOpen,
    onOpen: accountOnOpen,
    onClose: accountOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (!userNameSet) {
      accountOnOpen();
      setProfileOpen(true);
    }
  }, [userNameSet]);

  const logout = () => {
    router.push("/");
    router.reload();
    // terminate(db);
    // clearIndexedDbPersistence(db);
    auth.signOut();
  };

  const SettingsMenu = () => {
    return (
      <Stack mx='0' w='full'>
        <Flex
          borderRadius={15}
          flexDir='column'
          mt='5'
          mb='3'
          p='1'
          bgColor='#74748014'>
          <Button
            onClick={() => {
              accountOnOpen();
              // profileIsOpen && profileOnClose();
            }}
            borderRadius={12}
            justifyContent='space-between'
            variant='ghost'
            bgColor='transparent'
            _active={{ bgColor: "transparent" }}
            _hover={{ bgColor: "transparent" }}
            mt='1'
            px='1'
            size='sm'
            rightIcon={<ChevronRightIcon width={30} color='#3c3c434c' />}>
            <Flex align='center'>
              <Box
                mx='3'
                bgColor='#007bff89'
                borderRadius={12}
                border='1px solid #1068c545'
                p='1.5'>
                <KeyIcon color='black' width={20} />
              </Box>
              Account
            </Flex>
          </Button>
          <Divider w='90%' m='1' alignSelf='end' />
          <Button
            onClick={() => {
              setBucket(true);
            }}
            borderRadius={12}
            justifyContent='space-between'
            variant='ghost'
            bgColor='transparent'
            _active={{ bgColor: "transparent" }}
            _hover={{ bgColor: "transparent" }}
            mb='1'
            px='1'
            size='sm'
            rightIcon={<ChevronRightIcon width={30} color='#3c3c434c' />}>
            <Flex align='center'>
              <Box
                mx='3'
                bgColor='#ffcc00ea'
                borderRadius={12}
                p='1.5'
                border='1px solid #dfb200c3'>
                <ArchiveIcon color='black' width={20} />
              </Box>
              My Bucket
            </Flex>
          </Button>
        </Flex>

        <Flex
          justifyContent='space-between'
          borderRadius={10}
          bgColor='#74748014'
          p='1.5'>
          <Flex px='1'>
            <Flex fontWeight={600} align='center'>
              <Box mx='2' bgColor='#c6c6c8ff' borderRadius={12} p='1.5'>
                <MoonIcon color='black' fill='black' width={20} />
              </Box>
              Dark Mode
            </Flex>
          </Flex>
          <Switch isDisabled alignSelf='center' size='lg' />
        </Flex>
        <Text textAlign='center' fontSize={16} color='#3c3c4399'>
          coming soon
        </Text>
      </Stack>
    );
  };

  const Account = () => {
    return (
      <Flex
        flexDirection='column'
        align='center'
        bgColor='whitesmoke'
        // my='5'
        py={2}
        borderRadius={10}
        display={profileOpen ? ["none", "none", "none", "flex"] : "flex"}
        w={["full", "full", "full", "40%", "35%"]}>
        <Button
          aria-label='close-setting-page'
          display={userNameSet ? "block" : "none"}
          variant='ghost'
          bgColor='transparent'
          _active={{ bgColor: "transparent" }}
          _hover={{ bgColor: "transparent" }}
          onClick={accountOnClose}
          alignSelf='start'
          m='2'
          size='sm'
          color='blue.300'
          borderRadius='15px'>
          Back
        </Button>
        <Stack w='full' px='8'>
          <Button
            display={["flex", "flex", "flex", "none"]}
            w='full'
            my='5'
            bgColor='white'
            p='2'
            borderRadius={12}
            onClick={() => setProfileOpen(true)}
            justifyContent='space-between'
            rightIcon={<ChevronRightIcon width={30} color='#3c3c434c' />}>
            <Flex align='center' fontSize={[14, 15, 17]}>
              <Box mx='2' bgColor='#007bff89' borderRadius={15} p='1.5'>
                <UserIcon fill='black' width={20} />
              </Box>
              Edit Profile
            </Flex>
          </Button>

          <Flex
            display={["none", "none", "none", "flex"]}
            w='full'
            my='5'
            bgColor='#ececece6'
            py='1.5'
            px='3'
            borderRadius={12}
            justifyContent='space-between'>
            <Flex align='center' fontWeight={600}>
              <Box mx='2' bgColor='#007bff89' borderRadius={15} p='1.5'>
                <UserIcon fill='black' width={20} />
              </Box>
              Edit Profile
            </Flex>
          </Flex>
        </Stack>
        <Box px='8' h='full' w='full'>
          <Flex
            fontWeight={600}
            fontSize={[14, 15, 17]}
            p='2'
            bgColor='white'
            borderRadius={10}
            my='2'>
            <Text mx='2'>Email:</Text>
            <Text>{user?.email}</Text>
          </Flex>
          <Text fontSize={12} textAlign='center' color='#3c3c434c'>
            your email is private and not visible to other users
          </Text>
          <Flex
            align='center'
            fontWeight={600}
            p='2'
            bgColor='white'
            borderRadius={10}
            my='2'
            fontSize={[14, 15, 17]}>
            <Text mx='2'>Last SignedIn:</Text>
            <Text>{user?.metadata.lastSignInTime}</Text>
          </Flex>
        </Box>
        <Button
          borderRadius='15px'
          bgColor='white'
          color='#007affff'
          fontSize={18}
          p='2'
          m='3'
          mx='auto'
          size='sm'
          onClick={logout}>
          Logout
        </Button>
      </Flex>
    );
  };

  return (
    <>
      <Button
        variant='ghost'
        bgColor='transparent'
        _active={{ bgColor: "transparent" }}
        _hover={{ bgColor: "transparent" }}
        p={1}
        m={1}
        rounded='full'
        onClick={onOpen}>
        {userData?.photoURL && userData?.photoURL !== "null" ? (
          <Box
            borderRadius='50%'
            w='38px'
            h='38px'
            overflow='hidden'
            border='1px solid #7a7a811f'
            mx='1'>
            <Image
              alt='userProfileImg'
              referrerPolicy='no-referrer'
              loader={() => `${userData?.photoURL}?w=${60}&q=${75}`}
              src={userData?.photoURL}
              width='100%'
              height='100%'
            />
          </Box>
        ) : (
          <Avatar size='sm' />
        )}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onClose}
        size='full'
        closeOnOverlayClick={userNameSet ? true : false}>
        {/* <DrawerOverlay /> */}
        <DrawerContent
          maxW='1440px'
          border='2px solid white #2c2c2eff'
          // pos='fixed'
          borderTopRadius={bucket ? "unset" : 10}
          w={bucket ? "full" : ["full", "99%"]}
          h={bucket ? "full" : ["97.3%", "96.5%"]}
          mx='auto'
          bgColor='#ffffffff'>
          {!bucket && (
            <DrawerHeader
              display={profileOpen ? ["none", "none", "none", "flex"] : "flex"}
              justifyContent='space-between'
              h='auto'
              w='full'
              pt={3}
              px={5}>
              <DHeader
                userData={userData}
                accountOnClose={accountOnClose}
                onClose={onClose}
                userNameSet={userNameSet}
              />
            </DrawerHeader>
          )}
          {bucket ? (
            <Bucket setBucket={setBucket} />
          ) : (
            <DrawerBody
              h='full'
              py={0}
              px={["4", "5", "unset", 20]}
              display='flex'
              flexWrap='wrap-reverse'
              w='full'>
              {accountIsOpen ? (
                <Flex w='full'>
                  <Account />
                  <Profile
                    profileOpen={profileOpen}
                    setProfileOpen={setProfileOpen}
                    userData={userData}
                    userNameSet={userNameSet}
                    setUserNameSet={setUserNameSet}
                    onClose={onClose}
                  />
                </Flex>
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