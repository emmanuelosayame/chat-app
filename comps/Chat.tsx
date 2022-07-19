import { Avatar, Box, Divider, Flex } from "@chakra-ui/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";
import TimeAgo from "timeago-react";

const Chat = ({ chatId, recId }: DocumentData) => {
  const user = auth.currentUser;
  // const router = useRouter();
  const recQuery = doc(db, "Users", `${recId}`);
  const [recData] = useDocumentData(recQuery);
  const dp = recData?.photoURL;
  // console.log(status)

  return (
    <Link
      href={{
        pathname: chatId,
        query: {
          // rec: recId,
          name: recData?.name,
          userName: recData?.userName,
        },
      }}
      scroll={false}
    >
      <Flex
        // onClick={openChat}
        flexDirection="column"
        _hover={{ bgColor: "gray.300" }}
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
          <Box mx="2" p="1" h={"14"}>
            <Box fontWeight={600}>{recData?.name}</Box>
            <Box fontSize={15}>{recData?.userName}</Box>
          </Box>
        </Flex>
        <Divider borderColor="gray.300" w={["78%", "90%"]} alignSelf="end" />
      </Flex>
    </Link>
  );
};

export default Chat;
