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
  doc,
  DocumentData,
  getDoc,
  getDocFromCache,
  getDocs,
  // query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import Fuse from "fuse.js";

const NewChatComp = ({ chatsData, mappedChats, text, icon, color }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const usersRef = ref(rdb, `Users`);
  const [usersList, setUsersList] = useState<
    [{ key: string; name: string; uid: string; userName: string }] | null
  >(null);
  const [chatUsersList, setChatUsersList] = useState<any>([]);
  const recIds = mappedChats?.map(
    (ids: { recId: string } | undefined) => ids?.recId
  );
  const searchUser = (e: any) => {
    const input = e.target.value.toLowerCase();
    if (!chatsData) return;
    const fuse = new Fuse(chatsData, {
      keys: ["name", "userName"],
    });
    setChatUsersList(fuse.search(`${input}`));

    const searchQuery = query(
      usersRef,
      orderByKey(),
      startAt(input),
      endAt(`${input}\uf8ff`)
    );
    onValue(
      searchQuery,
      (snapshot) => {
        let list: any = [];
        snapshot.forEach((data) => {
          const key = data.key;
          const val = data.val();
          list.push({ key, ...val });
        });
        setUsersList(list);
      },
      { onlyOnce: true }
    );
  };
  // console.log(chatsData)

  const noChatUsersList = usersList?.filter(
    (list) => !recIds.includes(list.uid) && list.uid !== user?.uid
  );
  // console.log(chatUsersList);

  const handleNewChat = async (uid: any, name: any, userName: any) => {
    const newRef = await addDoc(collection(db, "chatGroup"), {
      USID: [user?.uid, uid],
      timeStamp: serverTimestamp(),
    });
    router.push({
      pathname: newRef.id,
      query: {
        recId: uid,
        name: name,
        userName: userName,
      },
    });
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
        size="sm"
      >
        <ModalOverlay />
        <ModalContent borderRadius={15} px="4" bgColor="white">
          <ModalHeader textAlign="center" fontSize="13">
            Start Chat
          </ModalHeader>
          <ModalCloseButton size="sm" color="blue.400" />

          <ModalBody p={3}>
            <InputGroup>
              <InputLeftElement children={<SearchIcon mb="1" />} />
              <Input
                ref={inputRef}
                size="sm"
                variant="filled"
                type="text"
                borderRadius="12"
                placeholder="Search"
                bgColor="whitesmoke"
                _placeholder={{ color: "gray" }}
                onChange={searchUser}
              />
            </InputGroup>
            <Box>
              <Flex p="2">
                <Avatar size="sm" mr="5" />
                New Group
              </Flex>
              <Divider ml="10" w="90%" />

              <Text fontSize={13} fontWeight={600} my="3">
                All
              </Text>
              <Box
                bgColor="whitesmoke"
                borderRadius="15px"
                overflowY="auto"
                maxH="300px"
                transitionDelay="1s ease-in-out"
                key="local"
              >
                {chatUsersList &&
                  chatUsersList.map((user: any) => (
                    <Flex
                      onClick={() => {
                        onClose();
                        router.push({
                          pathname: user.item.chatId,
                          query: {
                            recId: user.item.recId,
                            name: user.item.name,
                            userName: user.item.userName,
                          },
                        });
                      }}
                      key={user.item.recId}
                      _hover={{ bgColor: "whitesmoke" }}
                      cursor="pointer"
                      justify="center"
                    >
                      <Box>
                        <Text fontSize={20} color="red" fontWeight="600">
                          {user.item.name}
                        </Text>
                        <Text fontSize={13}>{user.item.userName}</Text>
                      </Box>
                    </Flex>
                  ))}
              </Box>
              <Box
                bgColor="whitesmoke"
                borderRadius="15px"
                overflowY="auto"
                maxH="300px"
                transitionDelay="1s ease-in-out"
                key="server"
              >
                {usersList &&
                  noChatUsersList?.map((user) => (
                    <Flex
                      onClick={() => {
                        handleNewChat(user.uid, user.name, user.userName);
                        onClose();
                      }}
                      key={user.key}
                      _hover={{ bgColor: "whitesmoke" }}
                      cursor="pointer"
                      justify="center"
                    >
                      <Box>
                        <Text fontSize={20} fontWeight="600">
                          {user.name}
                        </Text>
                        <Text fontSize={13}>{user.userName}</Text>
                      </Box>
                    </Flex>
                  ))}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChatComp;
