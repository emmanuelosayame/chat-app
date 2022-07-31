import { Box, Button, Flex, IconButton, Textarea } from "@chakra-ui/react";
import { ClockIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";
import { SendIcon2 } from "./Icons";

const Bucket = ({ setBucket }: any) => {
  const user = auth.currentUser;
  const bucketListRef = collection(db, "Users", `${user?.uid}`, "bucket");
  const bucketListQuery = query(bucketListRef, orderBy("timeSent", "asc"));
  const [bucketList] = useCollectionData(bucketListQuery);

  const [bucketMessage, setBucketMessage] = useState<string>("");

  const handleSendMessage = async () => {
    if (bucketMessage !== null && bucketMessage?.length > 0)
      addDoc(bucketListRef, {
        text: bucketMessage,
        timeSent: serverTimestamp(),
      });
  };
  // console.log(bucketList);

  return (
    <Box
      w="full"
      h="full"
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "4px",
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          backgroundColor: "transparent",
        },
      }}
    >
      <Flex
        w="full"
        position="absolute"
        left={0}
        top={0}
        bgColor="#f2f2f783"
        backdropFilter="auto"
        backdropBlur="md"
        zIndex={1000}
        px="2"
        align="center"
      >
        <IconButton
          aria-label="close-setting-page"
          onClick={() => {
            setBucket(false);
          }}
          icon={<ChevronLeftIcon color="#007affff" width={40} />}
          variant="ghost"
        />
      </Flex>
      <Flex h="full" mt="50" flexDirection="column" align="end">
        {bucketList?.map((list) => (
          <Container key={list?.id} content={list} />
        ))}
      </Flex>

      <Flex position="fixed" left={0} right={0} bottom={0}>
        <Textarea
          rows={1}
          m="2"
          resize="none"
          onChange={(e) => setBucketMessage(e.target.value)}
        />
        <IconButton
          aria-label="send-bucket-message"
          onClick={handleSendMessage}
        >
          <SendIcon2 />
        </IconButton>
      </Flex>
    </Box>
  );
};
export default Bucket;

export const Container = ({ content }: any) => {
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  return (
    <Flex
      h="auto"
      borderRadius={13}
      px="2.5"
      py="0.25rem"
      m="1"
      w="fit-content"
      flexWrap="wrap"
      maxW="320px"
      bgColor="#5ac8faff"
    >
      <Box fontSize={[14, 15, 16]} fontWeight={600} color="white" maxW="300px">
        {content?.text}
      </Box>
      <Box
        mt="2"
        ml="1.5"
        mr="1"
        alignSelf="end"
        fontSize={9}
        fontWeight={500}
        color="gray"
      >
        {content?.timeSent ? (
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
