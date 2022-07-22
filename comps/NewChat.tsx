import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Toast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  // query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { auth, db, rdb } from "../firebase/firebase";
import algoliasearch from "algoliasearch/lite";
import {
  Hits,
  HitsProps,
  InstantSearch,
  SearchBox,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch-hooks-web";
import {
  useList,
  useListKeys,
  useListVals,
  useObject,
  useObjectVal,
} from "react-firebase-hooks/database";
import {
  child,
  endAt,
  limitToLast,
  onValue,
  orderByChild,
  orderByKey,
  orderByValue,
  Query,
  query,
  ref,
  startAt,
} from "firebase/database";

const NewChatComp = ({ userData, chats, text, icon, color }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const usersRef = ref(rdb, `Users`);
  const [searchRef, setSearchRef] = useState<Query | null>(null);
  const [usersDat] = useListVals<{
    uid: string | undefined;
    name: string | undefined;
    userName: string | undefined;
  }>(searchRef,{});
  // console.log(usersDat?.find(dat=>dat)?.name);

  const searchUser = (e: any) => {
    const input = e.target.value;
    setSearchRef(
      query(usersRef, orderByKey(), startAt(input), endAt(`${input}\uf8ff`))
    );
  };

  return (
    <>
      <Button
        aria-label="create-chat-button"
        variant="ghost"
        size="sm"
        mr={-3}
        leftIcon={icon}
        iconSpacing={0}
        onClick={onOpen}
        color={color}
      >
        {text}
      </Button>
      <Modal
        onClose={onClose}
        initialFocusRef={inputRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderRadius={15} px="4" bgColor="whitesmoke">
          <ModalHeader textAlign="center" fontSize="13">
            Start Chat
          </ModalHeader>
          <ModalCloseButton size="sm" color="blue.400" />

          <ModalBody>
            <InputGroup>
              <InputLeftElement children={<SearchIcon mb="1" ml="10" />} />
              <Input
                ref={inputRef}
                size="sm"
                variant="filled"
                type="text"
                borderRadius="12"
                placeholder="Search"
                bgColor="white"
                _placeholder={{ color: "gray" }}
                onChange={searchUser}
                // onKeyDown={searchUser}
              />
            </InputGroup>
            <Box>
              <Flex p="1">
                <Avatar size="sm" mr="5" />
                New Group
              </Flex>
              <Divider ml="10" w="90%" />
              <Flex p="1" cursor="pointer">
                <Avatar size="sm" mr="5" />
                Private Chat
              </Flex>
              <Flex fontSize={13} fontWeight={600} mt="3">
                All
              </Flex>
              <Divider />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChatComp;
