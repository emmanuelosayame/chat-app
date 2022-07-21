import { Avatar, Box, Divider, Fade, Flex } from "@chakra-ui/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
// import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase/firebase";

const Chat = ({ chatId, recId }: DocumentData) => {
  // const user = auth.currentUser;
  const router = useRouter();
  const recQuery = doc(db, "Users", `${recId}`);
  const [recData] = useDocumentData(recQuery);
  const dp = recData?.photoURL;
  // console.log(router.query.chat)

  return (
    <Link
      href={{
        pathname: chatId,
        query: {
          recId: recId,
          name: recData?.name,
          userName: recData?.userName,
        },
      }}
      scroll={false}
    >
      <Flex
        // onClick={openChat}
        bgColor={router.query.chat === chatId ? "whiteAlpha.800" : "unset"}
        color={router.query.chat === chatId ? "gray.200" : "unset"}
        border={router.query.chat === chatId ? "2px" : "unset"}
        transform={router.query.chat === chatId ? "scale(1.1)" : "unset"}
        pl={router.query.chat === chatId ? "2" : "unset"}
        ml={router.query.chat === chatId ? "5" : "unset"}
        // my={router.query.chat === chatId ? "0" : "unset"}
        boxShadow={router.query.chat === chatId ? "sm" : "unset"}
        borderLeftRadius={router.query.chat === chatId ? "12" : "unset"}
        flexDirection="column"
        _hover={{
          bgColor: "white",
          transform: "scale(1.2)",
          my: "1",
          pl: router.query.chat === chatId ? "2" : "3",
        }}
        cursor="pointer"
      >
        <Flex py="1" px="2">
          {!dp ? (
            <Avatar alignSelf="center" size="md" />
          ) : (
            <Flex borderRadius="50%" w="50px" h="50px" overflow="hidden">
              <Image
                referrerPolicy="no-referrer"
                loader={() => dp}
                src={dp}
                width="100%"
                height="100%"
              />
            </Flex>
          )}
          <Box mx="2" p="1" h={"14"} color="gray.900">
            <Box fontWeight={600}>{recData?.name}</Box>
            <Box fontSize={15}>{recData?.userName}</Box>
          </Box>
        </Flex>
        <Divider
          display={router.query.chat === chatId ? "none" : "block"}
          borderColor="blackAlpha.200"
          w={["78%", "90%"]}
          alignSelf="end"
        />
      </Flex>
    </Link>
  );
};

export default Chat;
