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
import {
  endAt,
  onValue,
  orderByKey,
  query,
  ref,
  startAt,
} from "firebase/database";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import Image from "next/image";

const NewChatComp = ({
  newSearch,
  setNewSearch,
  chatsData,
  mappedChats,
  text,
  icon,
  color,
}: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const usersRef = ref(rdb, `Users`);
  const [usersList, setUsersList] = useState<
    | [
        {
          key: string;
          name: string;
          uid: string;
          userName: string;
          photoURL: string;
        }
      ]
    | null
  >(null);
  const [chatUsersList, setChatUsersList] = useState<any>([]);
  const recIds = mappedChats?.map(
    (ids: { recId: string } | undefined) => ids?.recId
  );
  // console.log(usersList)
  useEffect(() => {
    setChatUsersList([]);
  }, [isOpen]);

  const searchUser = debounce(async (e: any) => {
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
  }, 700);
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
    router.push(
      {
        pathname: "/p/[chat]",
        query: {
          chatId: newRef.id,
          recId: uid,
          name: name,
          userName: userName,
        },
      },
      `/p/${userName}`
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
        size="sm"
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={13}
          boxShadow="2xl"
          border="2px solid #74748039"
          px="4"
          bgColor="#f2f2f7ff"
        >
          <ModalHeader
            textAlign="center"
            fontSize="15"
            color="#3c3c4399"
            fontWeight={600}
            p="2"
          >
            Start Chat
          </ModalHeader>
          {/* <ModalCloseButton size="sm" color="blue.400" /> */}

          <ModalBody p={3}>
            <InputGroup
              onClick={() => !newSearch && setNewSearch(true)}
              onFocus={() => setNewSearch(true)}
            >
              <InputLeftElement children={<SearchIcon mb="1" />} />
              <Input
                size="sm"
                variant="filled"
                type="text"
                borderRadius="7"
                placeholder="Search friends"
                bgColor="#74748014"
                _placeholder={{ color: "#3c3c434c" }}
                focusBorderColor="transparent"
                _hover={{ bgColor: "white" }}
                _focus={{ bgColor: "#74748014" }}
                onChange={searchUser}
              />
            </InputGroup>
            <Box>
              <Flex p="2" fontWeight={600}>
                <Avatar size="sm" mr="5" />
                New Group
                <Text fontWeight={500} fontSize="13" ml="5" color="#ddddddcf">
                  coming soon
                </Text>
              </Flex>
              <Divider ml="10" mb="2" w="90%" />

              <Box
                borderRadius="15px"
                overflowY="auto"
                transitionDelay="1s ease-in-out"
              >
                {chatUsersList.length > 0 && (
                  <Text fontSize={13} color="#3c3c434c" m="1">
                    My Chats
                  </Text>
                )}
                {chatUsersList &&
                  chatUsersList.map((user: any) => (
                    <>
                      <Flex
                        onClick={() => {
                          onClose();
                          router.push(
                            {
                              pathname: "/p/[chat]",
                              query: {
                                chatId: user.item.chatId,
                                recId: user.item.recId,
                                name: user.item.name,
                                userName: user.item.userName,
                              },
                            },
                            `/p/${user?.item.userName}`
                          );
                        }}
                        key={user.item.recId}
                        _hover={{ bgColor: "whitesmoke" }}
                        cursor="pointer"
                        // justify="center"
                        h="auto"
                        borderRadius={10}
                        align="center"
                      >
                        {user.item.photoURL ? (
                          <Flex
                            borderRadius="50%"
                            w="40px"
                            h="40px"
                            overflow="hidden"
                            mx="3"
                          >
                            <Image
                              referrerPolicy="no-referrer"
                              loader={() =>
                                `${user.item.photoURL}?w=${40}&q=${75}`
                              }
                              src={user.item.photoURL}
                              width="100%"
                              height="100%"
                            />
                          </Flex>
                        ) : (
                          <Avatar size="sm" mx="2" />
                        )}
                        <Box>
                          <Text fontSize={20} fontWeight="600">
                            {user.item.name}
                          </Text>
                          <Text fontSize={13}>{user.item.userName}</Text>
                        </Box>
                      </Flex>
                      <Divider />
                    </>
                  ))}

                {noChatUsersList && noChatUsersList.length > 0 && (
                  <Text fontSize={13} color="#3c3c434c" m="1">
                    All
                  </Text>
                )}
                {noChatUsersList?.map((user) => (
                  <Flex
                    onClick={() => {
                      handleNewChat(user.uid, user.name, user.userName);
                      onClose();
                    }}
                    key={user.key}
                    _hover={{ bgColor: "whitesmoke" }}
                    cursor="pointer"
                    // justify="center"
                  >
                    {user?.photoURL ? (
                      <Flex
                        borderRadius="50%"
                        w="40px"
                        h="40px"
                        overflow="hidden"
                        mx="2"
                      >
                        <Image
                          referrerPolicy="no-referrer"
                          loader={() => `${user?.photoURL}?w=${40}&q=${75}`}
                          src={user?.photoURL}
                          width="100%"
                          height="100%"
                        />
                      </Flex>
                    ) : (
                      <Avatar alignSelf="center" size="sm" />
                    )}
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
