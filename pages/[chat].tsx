import { ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { ArrowCircleUpIcon, ChevronLeftIcon } from "@heroicons/react/solid";
import {
  collection,
  doc,
  DocumentData,
  FieldValue,
  query,
  serverTimestamp,
  where,
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

const Chats: NextPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const messageId = router.query.chat;
  const [newMessage, setNewMessage] = useState("");
  const keepBottomRef = useRef<any>();
  const messagesQuery = collection(db, "chatGroup", `${messageId}`, "messages");
  const [messages] = useCollectionData(messagesQuery);
  const statusRef = doc(db, "statuses", `${router.query.userName}`);
  const [recStatus] = useDocumentData(statusRef);
  const date = recStatus?.lastSeen?.toDate();
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
          w="full"
          py="2"
          maxH="12"
          justify={["space-between", "space-between", "space-between", "unset"]}
        >
          <Flex>
            <IconButton
              display={["block", "block", "none"]}
              aria-label="back-btn"
              size="sm"
              icon={<ChevronLeftIcon width={30} />}
              mr="-3"
              onClick={routeToChats}
              _hover={{ bgColor: "transparent" }}
              _active={{ bgColor: "green" }}
              bgColor="transparent"
              color="orange.500"
            />
            {!!router.query.photoURL ? (
              <Box>image</Box>
            ) : (
              <Avatar size="sm" mx="2" />
            )}
          </Flex>
          <Box display="flex" flexDir="column">
            <Text mx="auto" fontWeight={600} fontSize={16} lineHeight="1">
              {router.query.name && router.query.name}
            </Text>
            <Text fontWeight={600} fontSize={10} lineHeight="1">
              {router.query.name && router.query.userName}
            </Text>
          </Box>
          <Box fontSize={10} fontWeight={600} mx="2">
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
            {!!recStatus && (
              <ReactTimeAgo timeStyle="twitter-first-minute" date={date} />
            )}
          </Box>
          {/* <IconButton
            aria-label="delete-chat&search"
            size="sm"
            icon={<ChevronDownIcon boxSize={4} />}
          /> */}
        </Flex>
        {/* <Divider/> */}
        <Flex
          scrollBehavior="smooth"
          flexDirection="column"
          overflowX="auto"
          px="1"
          h="full"
        >
          {!!messages &&
            messages?.map((message: DocumentData) => (
              <Message
                key={message.id}
                content={message.content}
                sender={message.sender}
                timeStamp={message.timeStamp}
              />
            ))}
          <div ref={keepBottomRef} />
        </Flex>

        <Box>
          <Divider mb="2" />
          <Flex>
            <IconButton
              aria-label="sticker"
              color="orange.400"
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
  timeStamp,
}: {
  content: string;
  sender: string | undefined;
  timeStamp: FieldValue;
}) => {
  const messageStyle = (userVal: string, recVal: string) => {
    const user = auth.currentUser;
    if (sender === user?.uid) {
      return userVal;
    }
    return recVal;
  };
  return (
    <Box
      alignSelf={messageStyle("end", "start")}
      bgColor={messageStyle("orange.300", "white")}
      h="auto"
      borderRadius={15}
      px="2.5"
      py="1"
      m="1"
      w="fit-content"
    >
      <Box fontSize={14}>{content}</Box>
      {/* <Box>{timeStamp}</Box> */}
    </Box>
  );
};
