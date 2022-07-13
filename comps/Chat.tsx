import { Avatar, Box, Divider, Flex } from "@chakra-ui/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";

const Chat = ({ uid, data }: DocumentData) => {
  const user = auth.currentUser;
  const router = useRouter();
  const recDataId = data.USID.filter(
    (id: DocumentData | undefined) => id !== user?.uid
  );
  const recQuery = doc(db, "Users", `${recDataId}`);
  const [recData] = useDocumentData(recQuery);

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
        {recData?.profileURL ? (
          <Image width={5} src={recData?.profileURL} />
        ) : (
          <Avatar alignSelf="center" size="sm" />
        )}
        <Box mx="2" p="1" h={"14"}>
          <Box fontWeight={600}>{recData?.name}</Box>
          <Box fontSize={15}>{recData?.userName}</Box>
        </Box>
      </Flex>
      <Divider borderColor="gray.300" w="90%" alignSelf="end" />
    </Flex>
  );
};

export default Chat;
