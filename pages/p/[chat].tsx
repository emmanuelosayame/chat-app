import {
  Avatar,
  Box,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowCircleUpIcon,
  ArrowNarrowUpIcon,
  ChevronLeftIcon,
} from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAt,
  Timestamp,
} from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { SendIcon, StickerIcon } from "../../comps/Icons";
import { auth, db, rdb } from "../../firebase/firebase";
import ReactTimeAgo from "react-time-ago";
import {
  ArrowUpIcon,
  CameraIcon,
  ClockIcon,
  MicrophoneIcon,
} from "@heroicons/react/outline";
import { Database, ref, DataSnapshot } from "firebase/database";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import PickerInterface from "../../comps/PickerInterface";
import StickerComp from "../../comps/StickerComp";
// import TimeAgo from "timeago-react";

const Chats: NextPage = ({ showStatus }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatId = router.query.chatId;
  const {
    isOpen: pickerIsOpen,
    onOpen: pickerOnOpen,
    onClose: pickerOnClose,
  } = useDisclosure();
  const {
    isOpen: stickerIsOpen,
    onOpen: stickerOnOpen,
    onClose: stickerOnClose,
  } = useDisclosure();
  const keepBottomRef = useRef<any>();
  const messagesRef = collection(db, "chatGroup", `${chatId}`, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("timeSent", "asc"),
    // startAt("timeStamp"),
    limit(20)
  );
  const [messages] = useCollection(messagesQuery);
  const [newMessage, setNewMessage] = useState<string>("");
  const [recStatus] = useObjectVal<{
    lastSeen: number;
    online: DataSnapshot;
  }>(ref(rdb, `status/${router.query.recId}`));

  const lastSeen = !!recStatus ? new Date(recStatus.lastSeen) : new Date();

  const keepBottom = () => {
    keepBottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!!messages) {
      keepBottom();
    }
  }, [router.pathname, messages]);

  const sendMessage = () => {
    if (!(newMessage.length === 0)) {
      addDoc(messagesRef, {
        content: newMessage,
        sender: user?.uid,
        timeSent: serverTimestamp(),
      });
      // keepBottom();
      setNewMessage("");
    }
  };

  const routeToChats = () => {
    router.push("/");
  };

  return (
    <>
      <Flex
        flexDirection="column"
        w="full"
        h="full"
        bgColor="#ffffffff"
        justify="space-between"
        position={["fixed", "fixed", "unset"]}
        // key={router.query.chatId?.toString()}
      >
        <Flex
          pos="absolute"
          w="full"
          py="1"
          maxH="10"
          bgColor="whiteAlpha.500"
          backdropFilter="auto"
          backdropBlur="lg"
          justify="space-between"
          align="center"
        >
          <Flex mr="-14">
            <IconButton
              display={["block", "block", "none"]}
              aria-label="back-btn"
              size="md"
              icon={<ChevronLeftIcon width={40} height={40} />}
              mr="-4"
              // mb="2"
              onClick={routeToChats}
              _hover={{ bgColor: "transparent" }}
              _active={{ bgColor: "transparent" }}
              bgColor="transparent"
              color="blue.500"
              variant="ghost"
              // alignSelf="center"
            />
            <Flex
              alignSelf="center"
              w="60px"
              fontWeight={600}
              mx="2"
              justifyContent="start"
            >
              {!showStatus ? (
                <Text
                  textAlign="center"
                  fontSize={20}
                  bgColor="transparent"
                  color="#5ac8faff"
                >
                  ...
                </Text>
              ) : !!recStatus?.online ? (
                <Text textAlign="center" w="full" fontSize={["12", "12", "15"]}>
                  online
                </Text>
              ) : (
                <Text
                  textAlign="center"
                  w="fit-content"
                  color="whiteAlpha.900"
                  bgColor="#5ac8faff"
                  px="1"
                  h="auto"
                  py="0.5"
                  borderRadius={9}
                  fontSize={13}
                >
                  <ReactTimeAgo
                    date={lastSeen}
                    timeStyle="twitter-minute-now"
                  />
                </Text>
                // <TimeAgo datetime={lastSeen} />
              )}
            </Flex>
          </Flex>

          <Box display="flex" flexDir="column" justifyContent="center">
            <Text
              mx="auto"
              fontWeight={700}
              fontSize={[18, 18, 20]}
              lineHeight="1.2"
              color="#000000ff"
            >
              {router.query.name && router.query.name}
            </Text>
            <Text
              mx="auto"
              fontWeight={600}
              fontSize={[11, 11, 13]}
              lineHeight="1"
              color="#3c3c4399"
            >
              {router.query.name && router.query.userName}
            </Text>
          </Box>
          <Box>
            {!!router.query.photoURL && router.query.photoURL !== "null" ? (
              <Box
                borderRadius="50%"
                h="35px"
                w="35px"
                overflow="hidden"
                border="1px solid #3c3c432d"
                mx="2"
              >
                <Image
                  referrerPolicy="no-referrer"
                  loader={() => `${router.query.photoURL}?w=${60}&q=${75}`}
                  src={router.query.photoURL.toString()}
                  width="100%"
                  height="100%"
                />
              </Box>
            ) : (
              <Avatar size="sm" mx="2" />
            )}
          </Box>
        </Flex>
        {/* <Divider/> */}
        <Flex
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
          scrollBehavior="smooth"
          flexDirection="column"
          overflowX="auto"
          px={["3", "4", "6"]}
          h="full"
          pt="14"
        >
          {!!messages &&
            messages?.docs.map((message: DocumentData) => (
              <Message key={message.id} content={message.data()} />
            ))}
          <div ref={keepBottomRef} />
        </Flex>

        <Flex position="relative" py="1" align="center">
          <PickerInterface
            isOpen={pickerIsOpen}
            onOpen={pickerOnOpen}
            onClose={pickerOnClose}
            chatId={chatId}
            user={user}
          />
          <IconButton
            isRound
            aria-label="sticker"
            color="blue.400"
            bgColor="transparent"
            size="sm"
            icon={<CameraIcon width={30} />}
            mx="0.5"
          />
          <Flex
            w="full"
            borderRadius={20}
            borderWidth="2px"
            borderColor="#3c3c4349"
            mr="3"
            position="relative"
          >
            {stickerIsOpen ? (
              <IconButton
                aria-label=".../"
                size="sm"
                variant="ghost"
                rounded="full"
              />
            ) : (
              <IconButton
                alignSelf="end"
                m="1"
                isRound
                aria-label="send"
                color="#007affff"
                fontSize="1.1em"
                size="xs"
                icon={<StickerIcon />}
                onClick={stickerOnOpen}
              />
            )}
            <Textarea
              as={ReactTextareaAutosize}
              w="full"
              maxRows={7}
              placeholder="Message"
              _placeholder={{
                fontSize: 20,
              }}
              variant="unstyled"
              bgColor="white"
              size="sm"
              rows={1}
              resize="none"
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
              p="1.5"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            {newMessage.length > 0 ? (
              <IconButton
                isRound
                alignSelf="end"
                aria-label="send"
                bgColor="#007affff"
                fontSize="1.2em"
                size="xs"
                icon={<ArrowUpIcon width={20} color="white" />}
                onClick={sendMessage}
                m="1"
              />
            ) : (
              <IconButton
                alignSelf="end"
                isRound
                aria-label="send"
                bgColor=""
                fontSize="1.2em"
                size="xs"
                icon={<MicrophoneIcon width={25} color="#007affff" />}
                // onClick={sendMessage}
                m="1"
              />
            )}
          </Flex>
        </Flex>
        {stickerIsOpen && (
          // <SlideFade in={stickerIsOpen}>
          <StickerComp onClose={stickerOnClose} />
          // </SlideFade>
        )}
      </Flex>
    </>
  );
};
export default Chats;

export const Message = ({ content }: { content: DocumentData }) => {
  const user = auth.currentUser;
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  const messageStyle = (userVal: string, recVal: string) => {
    if (content.sender === user?.uid) {
      return userVal;
    }
    return recVal;
  };

  return (
    <Flex
      alignSelf={messageStyle("end", "start")}
      bgColor={messageStyle("#5ac8faff", "#78788028")}
      h="auto"
      borderRadius={13}
      px="2.5"
      py="0.25rem"
      m="1"
      w="fit-content"
      flexWrap="wrap"
      maxW="320px"
      justify="end"
    >
      <Box
        fontSize={[14, 15, 16]}
        fontWeight={600}
        color={messageStyle("orange.50", "3c3c4399")}
        maxW="300px"
      >
        {content.content}
      </Box>
      <Box
        mt="2"
        ml="1.5"
        mr="1"
        alignSelf="end"
        fontSize={9}
        fontWeight={500}
        color={messageStyle("gray.50", "gray")}
      >
        {content.timeSent ? (
          time
        ) : (
          <Box mb="1" mt="-1">
            <ClockIcon width={10} />
          </Box>
        )}
      </Box>
    </Flex>
  );
};
