import { ArrowUpIcon, ChevronUpIcon } from "@chakra-ui/icons";
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
import TimeAgo from "timeago-react";
import { StickerIcon } from "../comps/Icons";
import { auth, db } from "../firebase/firebase";

const Chats: NextPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const messageId = router.query.chat;
  const [newMessage, setNewMessage] = useState("");
  const keepBottomRef = useRef<any>();
  const messagesQuery = collection(db, "chatGroup", `${messageId}`, "messages");
  const [messages] = useCollectionData(messagesQuery);
  // const recQuery = query(
  //   collection(db, "Users"),
  //   where("name", "==", `${router.query.rec}`)
  // );
  const recRef = doc(db,"Users",`${router.query.rec}`)

  const [recData] = useDocumentData(recRef);
  // console.log(recData);

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
        <Flex w="full" py="2" maxH="12">
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
          {recData?.photoURL ?<Box>image</Box>: <Avatar size="sm" mx="2" />}
          <Box>
            <Text fontWeight={600} fontSize={18} lineHeight="1">
              {recData && recData.name}
            </Text>
            <TimeAgo datetime={!!recData && recData.lastseen.toDate()} />
            {/* <Text fontSize={15} lineHeight="1.5">
              online
            </Text> */}
          </Box>
        </Flex>
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
