import { Flex, IconButton, Textarea, useDisclosure } from "@chakra-ui/react";
import { ArrowUpIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ReactTextareaAutosize from "react-textarea-autosize";
import { auth, db } from "../firebase";
import { MicWaveIcon } from "./Icons";
import Message from "./Message";
import PickerInterface from "./PickerInterface";
import WebCamComp from "./WebCamComp";

const Bucket = ({ setBucket }: any) => {
  const user = auth.currentUser;
  const bucketListRef = collection(db, "Users", `${user?.uid}`, "bucket");
  const bucketListQuery = query(bucketListRef, orderBy("timeSent", "asc"));
  const [bucketList] = useCollectionData(bucketListQuery);

  const [bucketMessage, setBucketMessage] = useState<string>("");
  const [docUploadProgress, setDocUploadProgress] = useState<
    number | undefined
  >(undefined);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSendMessage = async () => {
    if (bucketMessage !== null && bucketMessage?.length > 0)
      addDoc(bucketListRef, {
        text: bucketMessage,
        timeSent: serverTimestamp(),
      });
    setBucketMessage("");
  };
  // console.log(bucketList);

  return (
    <Flex
      position="relative"
      w="full"
      flexDirection="column"
      // justify="space-between"
      h="full"
    >
      <Flex
        // h="full"
        py={16}
        flexDirection="column"
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
          zIndex={500}
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
        {bucketList?.map((list) => (
          <Message key={list?.id} content={list} />
        ))}
      </Flex>

      <Flex
        py="1"
        // position="fixed"
        bottom={0}
        right={0}
        left={0}
        bgColor="white"
      >
        <PickerInterface
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          colRef={bucketListRef}
          user={user}
          setProgress={setDocUploadProgress}
        />

        <WebCamComp
          colRef={bucketListRef}
          top={7}
          direction={["column", "column", "column", "row"]}
        />
        <Flex
          w="full"
          borderRadius={20}
          borderWidth="2px"
          borderColor="#3c3c4349"
          mr="3"
          position="relative"
          overflow="hidden"
        >
          <Textarea
            as={ReactTextareaAutosize}
            w="full"
            maxRows={7}
            placeholder="Message"
            _placeholder={{
              fontSize: 20,
              pl: 2,
            }}
            variant="unstyled"
            bgColor="white"
            size="sm"
            rows={1}
            resize="none"
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
            p="1.5"
            value={bucketMessage}
            onChange={(e) => setBucketMessage(e.target.value)}
            fontSize="100%"
          />

          {bucketMessage.length > 0 ? (
            <IconButton
              isRound
              alignSelf="end"
              aria-label="send"
              bgColor="#007affff"
              fontSize="1.2em"
              size="xs"
              icon={<ArrowUpIcon width={20} color="white" />}
              onClick={handleSendMessage}
              m="1"
            />
          ) : (
            <IconButton
              alignSelf="end"
              isRound
              aria-label="send"
              bgColor="#78788033"
              fontSize="1.2em"
              size="xs"
              // icon={<MicrophoneIcon width={25} color="#007affff" />}
              icon={<MicWaveIcon color="#007affff" />}
              // onClick={sendMessage}
              m="1"
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Bucket;
