import type { NextPage } from "next";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";

import Header from "../comps/Header";
import NewChatComp from "../comps/NewChat";
import { SearchIcon } from "@chakra-ui/icons";
import { PencilAltIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { auth, db, rdb } from "../firebase/firebase";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocFromCache,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";
import Settings from "./Settings";
import {
  useCollectionData,
  useDocumentData,
  useCollection,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { ref, set } from "firebase/database";
import Fuse from "fuse.js";
import { AppProps } from "next/app";

const View = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatsQuery = query(
    collection(db, "chatGroup"),
    where("USID", "array-contains", `${user?.uid}`),
    orderBy("timeStamp", "desc")
  );
  const userRef = doc(db, "Users", `${user?.uid}`);
  const [chats] = useCollection(chatsQuery);
  const mappedChats = chats?.docs.map((chat: DocumentData | undefined) => {
    const [recId] = chat
      ?.data()
      .USID.filter((id: DocumentData | undefined) => id !== user?.uid);
    return { chatId: chat?.id, recId };
  });
  const [userData] = useDocumentData(userRef);
  // const usersRef = ref(rdb, `Users/${user?.displayName?.toLowerCase()}`);

  const [chatsData, setChatsData] = useState<any>(null);
  const [chatList, setChatList] = useState<any>(null);
  const [search, setSearch] = useState<boolean>(false);
  const [newSearch, setNewSearch] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchRecsData = async () => {
    if (!chats) return;
    const recPromise = chats?.docs.map(async (r) => {
      const recIds = r.data().USID.filter((r: any) => user?.uid !== r);
      const chatId = r.id;
      const data = await getDoc(doc(db, "Users", `${recIds}`));
      return { recId: data.id, ...data.data(), chatId };
    });
    if (!recPromise) return;
    const res = [];
    for (const resolved of recPromise) {
      res.push(await resolved);
    }
    setChatsData(res);
    // console.log("i fetchd");
  };

  useEffect(() => {
    search && fetchRecsData();
    newSearch && fetchRecsData();
  }, [search, newSearch]);

  const nameRef = ref(
    rdb,
    `Users/${
      user?.displayName ? user?.displayName?.toLowerCase() + user?.uid : "user"
    }`
  );

  useEffect(() => {
    if (userData === undefined) return;
    if (!userData?.name) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        name: `${user?.displayName}`,
      });

      set(nameRef, {
        uid: user?.uid,
        name: user?.displayName,
      }); 
    }
    if (!userData?.photoURL) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        photoURL: `${user?.photoURL}`,
      });
    }
  }, [userData]);

  const searchChat = async (e: any) => {
    const input = e.target.value.toLowerCase();
    if (!chatsData) return;
    const fuse = new Fuse(chatsData, {
      keys: ["name", "userName"],
    });
    setChatList(fuse.search(`${input}`));
  };

  const responsiveLayout = (chatPage: string, noChatPage: string) => {
    if (!!router.query?.chat) return chatPage;
    else return noChatPage;
  };

  return (
    <Flex bgColor="#000000" pt={isOpen ? "4" : "unset"}>
      <Flex
        h="100vh"
        w={isOpen ? ["95%", "96%"] : "full"}
        borderTopRadius={isOpen ? "10" : "unset"}
        overflow="hidden"
        zIndex={1000}
        bgColor="#f2f2f7ff"
        mx="auto"
        transitionDelay="2s ease-in"
      >
        {router.pathname !== "/bucket" && (
          <Box
            display={[
              responsiveLayout("none", "block"),
              responsiveLayout("none", "block"),
              "block",
            ]}
            w={["full", "full", "45%", "45%", "32%"]}
            position="relative"
          >
            <Box
              sx={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                },
              }}
              w="full"
              h="full"
              overflowY="scroll"
            >
              {!search && (
                <Header>
                  <NewChatComp
                    newSearch={newSearch}
                    setNewSearch={setNewSearch}
                    mappedChats={mappedChats}
                    chatsData={chatsData}
                    icon={<PencilAltIcon width={22} />}
                    color="#007affff"
                  />
                  <Settings
                    userData={userData}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                  />
                </Header>
              )}
              <Flex
                w="full"
                mt={search ? 5 : 12}
                h="auto"
                px={2}
                pb="3"
                position="relative"
              >
                <InputGroup
                  onClick={() => {
                    setSearch(true);
                  }}
                >
                  <InputLeftElement children={<SearchIcon w="4" mb="1.5" />} />
                  <Input
                    size="sm"
                    variant="filled"
                    type="text"
                    borderRadius="7"
                    placeholder="Search"
                    bgColor="#74748014"
                    _placeholder={{ color: "	#3c3c434c	" }}
                    focusBorderColor="transparent"
                    _hover={{ bgColor: "white" }}
                    _focus={{ bgColor: "white" }}
                    onChange={searchChat}
                  />
                </InputGroup>
                {search && (
                  <Button
                    size="xs"
                    onClick={() => {
                      setSearch(false);
                    }}
                    color="#007affff"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                )}
              </Flex>
              <Divider />
              {chatList &&
                search &&
                chatList.map((user: any) => (
                  <Flex
                    onClick={() => {
                      setSearch(false);
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
                    _hover={{ bgColor: "white" }}
                    cursor="pointer"
                    // justify="center"
                    py="1"
                    px="4"
                  >
                    <Box>
                      <Text fontSize={20} color="#007affff" fontWeight="600">
                        {user.item.name}
                      </Text>
                      <Text fontSize={13}>{user.item.userName}</Text>
                    </Box>
                  </Flex>
                ))}

              <Box
                pos="relative"
                pt="2"
                w="100%"
                h="full"
                display={search ? "none" : "unset"}
              >
                {!chats?.empty ? (
                  <Box pt="2">
                    {mappedChats?.map((chat: DocumentData | undefined) => {
                      return (
                        <Chat
                          key={chat?.chatId}
                          chatId={chat?.chatId}
                          recId={chat?.recId}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Flex h="full" justify="center" align="center">
                    <NewChatComp
                      newSearch={newSearch}
                      setNewSearch={setNewSearch}
                      mappedChats={mappedChats}
                      chatsData={chatsData}
                      text="Start Chat"
                    />
                  </Flex>
                )}
              </Box>
            </Box>
          </Box>
        )}
        {/* next */}
        <Box
          h="full"
          bgColor="whiteAlpha.700"
          w="full"
          display={[
            responsiveLayout("block", "none"),
            responsiveLayout("block", "none"),
            "block",
          ]}
          pos="relative"
        >
          {/* {search ? ( */}
          <Box
            w="full"
            h="full"
            bgColor="#ffffffff	"
            opacity={0.6}
            filter="blur(20px)"
            display={search ? "block" : "none"}
          />
          <Box h="full" w="full" display={search ? "none" : "block"}>
            <Component userData={userData} {...pageProps} />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default View;