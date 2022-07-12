import { Flex } from "@chakra-ui/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";

const Chat = ({ uid, data }: DocumentData) => {
  const user = auth.currentUser;
  const router = useRouter();
  //   const recDataId = data.USID.filter(
  //     (id: DocumentData | undefined) => id !== user?.uid
  //   );
  //   const recQuery = doc(db, "Users", `${recDataId}`);
  //   const [recData] = useDocument(recQuery);
  // const recInfo  = recData?.data()

  const openChat = () => {
    router.push(`${uid}`);
  };
  //   console.log(recInfo)
  return <Flex p="1">{data?.name}</Flex>;
};

export default Chat;
