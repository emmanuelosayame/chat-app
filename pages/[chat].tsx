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
} from "@chakra-ui/react";
import { ArrowCircleUpIcon, ChevronLeftIcon } from "@heroicons/react/solid";
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
// import TimeAgo from "react-timeago";
import { StickerIcon } from "../comps/Icons";
import { auth, db } from "../firebase/firebase";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import { ClockIcon } from "@heroicons/react/outline";

const Chats: NextPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const messagesId = router.query.chat;
  const keepBottomRef = useRef<any>();
  const messagesRef = collection(db, "chatGroup", `${messagesId}`, "messages");
  const messagesQuery = query(messagesRef, orderBy("timeSent", "asc"));
  const [messages] = useCollectionData(messagesQuery);
  const statusRef = doc(db, "statuses", `${router.query.userName}`);
  const [recStatus] = useDocumentData(statusRef);
  const date = recStatus?.lastSeen?.toDate();
  const [newMessage, setNewMessage] = useState("");
  // console.log(recStatus);

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

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
  }, []);

  const sendMessage = () => {
    if (!(newMessage.length === 0)) {
      addDoc(messagesRef, {
        content: newMessage,
        sender: user?.uid,
        timeSent: serverTimestamp(),
      });
      keepBottom();
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
              color="orange.500"
            />
            <Box
              fontSize={11}
              borderRadius={10}
              bgColor="orange.200"
              opacity={0.7}
              alignSelf="center"
              py="1"
              px="2"
              fontWeight={600}
              mx="2"
              color="blackAlpha.800"
            >
              {/* <TimeAgo
              formatter={(value, unit) => {
                if (unit === "second") return "online";
                if (unit === "minute") return value + "m";
                if (unit === "hour") return value + "h";
                if (unit === "day") return value + "d";
                if (unit === "week") return value + "w";
                if (unit === "month") return value + "month";
              }}

              date={!!router.query.userName && recStatus?.lastSeen?.toDate()}
            /> */}
              {!!recStatus && <ReactTimeAgo date={date} />}
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
          <div ref={keepBottomRef} />
        </Flex>

        <Box px="2">
          <Divider mb="2" />
          <Flex>
            <IconButton
              aria-label="sticker"
              color="orange.400"
              bgColor="transparent"
              size="md"
              icon={<StickerIcon />}
            />
            <Input
              borderRadius={15}
              borderWidth="1px"
              variant="filled"
              bgColor="white"
              borderColor="gray.200"
              size="sm"
              // placeholder=" yo..."
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton
              aria-label="send"
              color="orange.400"
              bgColor="transparent"
              size="sm"
              icon={<ArrowCircleUpIcon width={25} />}
              onClick={sendMessage}
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
      bgColor={messageStyle("orange.200", "white")}
      h="auto"
      borderRadius={13}
      px="2.5"
      py="0.25rem"
      m="1"
      w="fit-content"
      flexWrap="wrap"
      maxW="330px"
      justify="end"
    >
      <Box
        fontSize={14}
        fontWeight={600}
        color={messageStyle("orange.50", "gray")}
        maxW="300px"
      >
        {content}
      </Box>
      <Box
        mt="3"
        mb="-0.5"
        ml="1.5"
        mr="1"
        alignSelf="end"
        fontSize={8}
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
