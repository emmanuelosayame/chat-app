import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RepeatClockIcon,
  RepeatIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
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
  orderBy,
  query,
  serverTimestamp,
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
import { SendIcon, StickerIcon } from "../comps/Icons";
import { auth, db, rdb } from "../firebase/firebase";
import ReactTimeAgo from "react-time-ago";
import { ClockIcon } from "@heroicons/react/outline";
import { Database, ref, DataSnapshot } from "firebase/database";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
// import TimeAgo from "timeago-react";

const Chats: NextPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const messagesId = router.query.chat;
  // const keepBottomRef = useRef<any>();
  const messagesRef = collection(db, "chatGroup", `${messagesId}`, "messages");
  const messagesQuery = query(messagesRef, orderBy("timeSent", "asc"));
  const [messages] = useCollectionData(messagesQuery);
  const [newMessage, setNewMessage] = useState("");
  const [recStatus] = useObjectVal<{ lastSeen: number; online: DataSnapshot }>(
    ref(rdb, `status/${router.query.recId}`)
  );
  const lastSeen = !!recStatus ? new Date(recStatus.lastSeen) : new Date();

  // const keepBottom = () => {
  //   keepBottomRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  // useEffect(() => {
  //   if (!!messages) {
  //     keepBottom();
  //   }
  // }, []);

  const sendMessage = () => {
    if (!(newMessage.length === 0)) {
      addDoc(messagesRef, {
        content: newMessage,
        sender: user?.uid,
        timeSent: serverTimestamp(),
      });
      // keepBottom();
    }
    return;
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
        // bgColor="red"
        justify="space-between"
        position={["fixed", "fixed", "unset"]}
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
        >
          <Flex mr="-14">
            <IconButton
              display={["block", "block", "none"]}
              aria-label="back-btn"
              size="sm"
              icon={<ChevronLeftIcon width={30} />}
              mr="-3"
              onClick={routeToChats}
              _hover={{ bgColor: "transparent" }}
              _active={{ bgColor: "transparent" }}
              bgColor="transparent"
              color="blue.500"
            />
            <Box
              fontSize={14}
              borderRadius={12}
              bgColor="blue.300"
              opacity={0.7}
              alignSelf="center"
              py="1"
              px="2"
              fontWeight={600}
              mx="2"
              color="white"
            >
              {!!recStatus?.online ? (
                <Box>Active now</Box>
              ) : (
                <ReactTimeAgo date={lastSeen} timeStyle="twitter-minute-now" />
                // <TimeAgo datetime={lastSeen} />
              )}
            </Box>
          </Flex>

          <Box display="flex" flexDir="column">
            <Text
              mx="auto"
              fontWeight={600}
              fontSize={16}
              lineHeight="1.2"
              color="blackAlpha.800"
            >
              {router.query.name && router.query.name}
            </Text>
            <Text
              fontWeight={600}
              fontSize={10}
              lineHeight="1"
              color="blackAlpha.800"
            >
              {router.query.name && router.query.userName}
            </Text>
          </Box>
          <Box>
            {!!router.query.photoURL ? (
              <Box>image</Box>
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
              backgroundColor: "blue.50",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "18px",
              backgroundColor: "blue.100",
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
            messages?.map((message: DocumentData) => (
              <Message
                key={message.id}
                content={message.content}
                sender={message.sender}
                timeSent={message.timeSent}
              />
            ))}
          {/* <div ref={keepBottomRef} /> */}
        </Flex>

        <Box px="5">
          <Divider mb="2" />
          <Flex>
            <IconButton
              aria-label="sticker"
              color="blue.400"
              bgColor="transparent"
              size="md"
              icon={<StickerIcon />}
            />
            <Textarea
              borderRadius={15}
              borderWidth="1px"
              variant="filled"
              bgColor="white"
              borderColor="gray.200"
              size="md"
              h="auto"
              rows={3}
              p="1.5"
              // maxH='14'
              // placeholder=" yo..."
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton
              isRound
              aria-label="send"
              // color="blue.500"
              bgColor="blue.400"
              // colorScheme="twitter"
              size="md"
              p="1"
              icon={<SendIcon boxSize={7} stroke="white" strokeWidth="15" />}
              onClick={sendMessage}
              ml="3"
              // alignSelf="center"
              mr="5"
            />
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
export default Chats;

export const Message = ({
  content,
  sender,
  timeSent,
}: {
  content: string;
  sender: string | undefined;
  timeSent: Timestamp;
}) => {
  const user = auth.currentUser;
  const time =
    !!timeSent &&
    timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  // console.log(time);
  const messageStyle = (userVal: string, recVal: string) => {
    if (sender === user?.uid) {
      return userVal;
    }
    return recVal;
  };

  return (
    <Flex
      alignSelf={messageStyle("end", "start")}
      bgColor={messageStyle("blue.200", "whitesmoke")}
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
        fontSize={13}
        fontWeight={600}
        color={messageStyle("orange.50", "blackAlpha.700")}
        maxW="300px"
      >
        {content}
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
        {timeSent ? (
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
