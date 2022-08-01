import { Avatar, Box, Divider, Fade, Flex, Text } from "@chakra-ui/react";
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
  // console.log("rendered")

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
      shallow={true}
      scroll={false}
    >
      <Box>
        <Flex
          flexDirection="column"
          borderRadius={8}
          overflow="hidden"
          // border="1px solid #5ac7faa2"
          mx="4"
          // justify=
          // onClick={openChat}
          bgColor={router.query.chat === chatId ? "#5ac7faa2" : "unset"}
          color={router.query.chat === chatId ? "whitesmoke" : "unset"}
          transform={router.query.chat === chatId ? "scale(1.1)" : "unset"}
          // pl={router.query.chat === chatId ? "4" : "unset"}
          _hover={{
            bgColor: router.query.chat === chatId ? "#5ac8faff" : "white",
            transform: "scale(1.15)",
            // pl: [4, 10, 4, 4, 6],
          }}
          cursor="pointer"
        >
          <Flex px="2" align="center">
            {!dp ? (
              <Avatar alignSelf="center" size="sm" />
            ) : (
              <Flex borderRadius="50%" w="40px" h="40px" overflow="hidden">
                <Image
                  referrerPolicy="no-referrer"
                  loader={() => `${dp}?w=${40}&q=${75}`}
                  src={dp}
                  width="100%"
                  height="100%"
                />
              </Flex>
            )}
            <Box mx="2" p="1" h={"12"}>
              <Box fontWeight={600} fontSize="20" lineHeight="1">
                {recData?.name}
              </Box>
              <Text color="#3c3c4399" fontSize={15}>
                {recData?.userName}
              </Text>
            </Box>
          </Flex>
          <Divider
            display={router.query.chat === chatId ? "none" : "block"}
            borderColor="#3c3c432d"
            w={["85%", "90%"]}
            alignSelf="end"
          />
        </Flex>
      </Box>
    </Link>
  );
};

export default Chat;
