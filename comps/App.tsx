import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";

import Header from "../comps/Header";
import NewChatComp from "../comps/NewChat";
import { SearchIcon } from "@chakra-ui/icons";
import { PencilAltIcon } from "@heroicons/react/outline";
import { Suspense, useEffect, useState } from "react";
import { auth, db, rdb } from "../pages/firebase";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  orderBy,
  query,
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
import {
  onDisconnect,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import Fuse from "fuse.js";
import { AppProps } from "next/app";
import { browserName } from "react-device-detect";
import { debounce } from "lodash";
// import RecordVN from "./RecordVN";

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
  const [userData, userDataLoading, userDataError] = useDocumentData(userRef);

  const [chatsData, setChatsData] = useState<any>(null);
  const [chatList, setChatList] = useState<any>(null);
  const [search, setSearch] = useState<boolean>(false);
  const [newSearch, setNewSearch] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userNameSet, setUserNameSet] = useState<boolean>(true);
  const [selectChat, setSelectChat] = useBoolean(false);

  const onlineRef = ref(rdb, `status/${user?.uid}/online`);
  const lastSeenRef = ref(rdb, `status/${user?.uid}/lastSeen`);
  const statusRef = ref(rdb, ".info/connected");
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [deleteChats, setDeleteChats] = useState<(string | number)[]>([]);
  // console.log(deleteChats)

  useEffect(() => {
    router.push("/");
  }, []);

  useEffect(() => {
    if (user) {
      onValue(statusRef, (snap) => {
        if (snap.val() === true) {
          setShowStatus(true);
          const con = push(onlineRef);

          onDisconnect(con).set(null);

          set(con, browserName);

          onDisconnect(lastSeenRef).set(serverTimestamp());
        } else setShowStatus(false);
      });
    }
  }, [user]);

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

  // console.log(userData, userDataLoading);
  useEffect(() => {
    if (!userDataLoading && !userDataError && !userData?.userName) {
      setUserNameSet(false);
      onOpen();
    } else {
      setUserNameSet(true);
    }
  }, [userDataLoading, userDataError]);

  const searchChat = debounce(async (e: any) => {
    const input = e.target.value.toLowerCase();
    if (!chatsData) return;
    const fuse = new Fuse(chatsData, {
      keys: ["name", "userName"],
    });
    setChatList(fuse.search(`${input}`));
  }, 500);

  const responsiveLayout = (chatPage: string, noChatPage: string) => {
    if (!!router.query?.chat) return chatPage;
    else return noChatPage;
  };

  // const handleDeleteChats=()=>{
  //   if(deleteChats.length >0)
  //   deleteChats.map(id=>{
  //     deleteDoc()
  //   })
  // };

  // if (userDataLoading) return <Loading />;

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
        <Box
          display={[
            responsiveLayout("none", "block"),
            responsiveLayout("none", "block"),
            "block",
          ]}
          w={["full", "full", "45%", "40%", "30%"]}
          position="relative"
        >
          {selectChat && (
            <Box
              borderRadius={15}
              position="absolute"
              bottom={10}
              left="auto"
              right="auto"
              w="full"
              mx="auto"
            >
              {deleteChats && deleteChats.length > 0 ? (
                <Text
                  py="1"
                  px="2"
                  border="1px solid #ebebebc8"
                  borderRadius={10}
                  fontSize={15}
                  fontWeight={600}
                  bgColor="white"
                  w="fit-content"
                  mx="auto"
                  cursor="pointer"
                  display="flex"
                  alignContent="center"
                  // onClick={handleDeleteChats}
                >
                  delete
                  <Text fontSize={10}>{deleteChats.length}</Text>
                </Text>
              ) : (
                <Text
                  py="1"
                  px="2"
                  border="1px solid #ebebebc8"
                  borderRadius={10}
                  fontSize={15}
                  fontWeight={600}
                  bgColor="white"
                  w="fit-content"
                  mx="auto"
                  opacity={0.5}
                >
                  delete
                </Text>
              )}
            </Box>
          )}
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
              <Header setSelectChat={setSelectChat}>
                <Settings
                  userData={userData}
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={onClose}
                  userNameSet={userNameSet}
                  setUserNameSet={setUserNameSet}
                />
                <Text fontWeight={800} textAlign="center">
                  ChatApp
                </Text>
                <Flex align="center">
                  <NewChatComp
                    newSearch={newSearch}
                    setNewSearch={setNewSearch}
                    mappedChats={mappedChats}
                    chatsData={chatsData}
                    icon={<PencilAltIcon width={22} />}
                    color="#007affff"
                  />
                  <Text
                    onClick={setSelectChat.toggle}
                    fontWeight={600}
                    fontSize={15}
                    color="#007affff"
                    cursor="pointer"
                    ml="2"
                  >
                    Edit
                  </Text>
                </Flex>
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
                  fontSize="100%"
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
                    router.push(
                      {
                        pathname: "/p/[chat]",
                        query: {
                          chatId: user.item.chatId,
                          recId: user.item.recId,
                          name: user.item.name,
                          userName: user.item.userName,
                          photoURL: user.item.photoURL,
                        },
                      },
                      `/p/${user.item.userName}`
                    );
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
                <CheckboxGroup
                  onChange={(e: (string | number)[]) => setDeleteChats(e)}
                >
                  <Box pt="3" />
                  {mappedChats?.map((chat: DocumentData | undefined) => {
                    return (
                      <Chat
                        key={chat?.chatId}
                        selectChat={selectChat}
                        chatId={chat?.chatId}
                        recId={chat?.recId}
                      />
                    );
                  })}
                </CheckboxGroup>
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
            display={search ? "block" : "none"}
            w="full"
            h="full"
            bgImage="url('https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/profilePhoto%2Fpexels-abdullah-ghatasheh-1631677.jpg?alt=media&token=b2aadf0a-372e-4d69-a3bb-77ed7bf32bf8')"
            // bgPos=""
            bgSize="cover"
            bgRepeat="no-repeat"
            filter="blur(2px)"
          />
          <Box h="full" w="full" display={search ? "none" : "block"}>
            <Component
              showStatus={showStatus}
              userData={userData}
              {...pageProps}
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default View;
