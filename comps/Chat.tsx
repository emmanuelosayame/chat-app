import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  Fade,
  Flex,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { AtSymbolIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/router";
// import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firebase";

const Chat = ({ selectChat, chatId, recId }: DocumentData) => {
  // const user = auth.currentUser;
  const router = useRouter();
  const recQuery = doc(db, "Users", `${recId}`);
  const [recData] = useDocumentData(recQuery);
  const dp = recData?.photoURL;
  // console.log(chatId)

  const routerToChat = () => {
    if (selectChat) return;
    // if (router.asPath !== `/p/${recData?.userName}`)
    router.push(
      {
        pathname: "/p/[chat]",
        query: {
          chatId: chatId,
          recId: recId,
          name: recData?.name,
          userName: recData?.userName,
          photoURL: recData?.photoURL,
        },
      },
      `/p/${recData?.userName}`
    );
  };

  return (
    <Flex>
      {selectChat && <Checkbox value={chatId} ml="2" size="lg" />}
      <Flex
        w="full"
        flexDirection="column"
        role="group"
        py="1"
        pl="3"
        borderRadius={8}
        overflow="hidden"
        // border="1px solid #5ac7faa2"
        bgColor={
          selectChat
            ? "unset"
            : router.query.chatId === chatId
            ? "#ffffff"
            : "unset"
        }
        // color={router.query.chatId === chatId ? "#000000b7" : "unset"}
        transform={
          selectChat
            ? "unset"
            : router.query.chatId === chatId
            ? "scale(1.1)"
            : "unset"
        }
        mx={
          selectChat ? "unset" : router.query.chatId === chatId ? "5" : "unset"
        }
        my={
          selectChat ? "unset" : router.query.chatId === chatId ? "1" : "unset"
        }
        _hover={{
          bgColor: selectChat
            ? "unset"
            : router.query.chatId === chatId
            ? "#5ac7fa8b"
            : "white",
          transform: selectChat
            ? "unset"
            : router.query.chatId === chatId
            ? "scale(1.15)"
            : "scale(1.05)",
        }}
        cursor="pointer"
        onClick={routerToChat}
      >
        <Flex align="center">
          {!dp || dp === "null" ? (
            <Avatar alignSelf="center" size="sm" />
          ) : (
            <Flex borderRadius="50%" w="40px" h="40px" overflow="hidden">
              <Image
              alt="recProfileImg"
                referrerPolicy="no-referrer"
                loader={() => `${dp}?w=${40}&q=${75}`}
                src={dp}
                width="100%"
                height="100%"
              />
            </Flex>
          )}
          <Box mx="2" py="2" h={"12"}>
            <Text fontSize="17" fontWeight={600} lineHeight="1">
              {recData?.name}
            </Text>
            <Box display="flex">
              <Box my="auto" mx="0.07rem" color="#3c3c434e">
                <AtSymbolIcon width={12} height={12} strokeWidth="3" />
              </Box>
              <Text color="#3c3c4399" fontSize={12} fontWeight={600}>
                {recData?.userName}
              </Text>
              <Box mx="2" pb="1">
                {recData?.verified && (
                  <BadgeCheckIcon fill="#007affff" width={15} />
                )}
              </Box>
            </Box>
          </Box>
        </Flex>
        <Divider
          display={
            selectChat
              ? "block"
              : router.query.chatId === chatId
              ? "none"
              : "block"
          }
          borderColor="#3c3c432d"
          w={["85%", "90%"]}
          alignSelf="end"
          _groupHover={{
            display: selectChat ? "unset" : "none",
          }}
        />
      </Flex>
    </Flex>
  );
};

export default Chat;
