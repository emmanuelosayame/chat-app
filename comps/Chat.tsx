import { Avatar, Box, Divider, Flex } from "@chakra-ui/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";

const Chat = ({ uid, data }: DocumentData) => {
  const user = auth.currentUser;
  const router = useRouter();
  console.log("hii");
  //   auth.signOut()
  //   const recDataId = data.USID.filter(
  //     (id: DocumentData | undefined) => id !== user?.uid
  //   );
  //   const recQuery = doc(db, "Users", `${recDataId}`);
  //   const [recData] = useDocument(recQuery);
  // const recInfo  = recData?.data()

  const openChat = () => {
    // router.back()
    router.push(`${uid}`);
  };
  //   console.log(recInfo)
  return (
    <Flex
    onClick={openChat}
      flexDirection="column"
      _hover={{ bgColor: "gray.300" }}
      cursor="pointer"
    >
      <Flex>
        {data?.profileURL ? (
          <Image width={5} src={data?.profileURL} />
        ) : (
          <Avatar alignSelf="center" size="sm" />
        )}
        <Box mx="2" p="1" h={"14"}>
          <Box fontWeight={600}>{data?.name}</Box>
          <Box fontSize={15}>{data?.userName}</Box>
        </Box>
      </Flex>
      <Divider borderColor="gray.300" w="90%" alignSelf="end" />
    </Flex>
  );
};

export default Chat;
