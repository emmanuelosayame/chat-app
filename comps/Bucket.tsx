import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowUpIcon,
  ClockIcon,
  CloudDownloadIcon,
} from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import ReactTextareaAutosize from "react-textarea-autosize";
import { auth, db } from "../firebase/firebase";
import { MicWaveIcon } from "./Icons";
import PickerInterface from "./PickerInterface";

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

      <Box position="absolute" bottom={0} right={0} left={0}>
        <Flex position="relative" py="1" align="center">
          <PickerInterface
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            colRef={bucketListRef}
            user={user}
            setProgress={setDocUploadProgress}
          />
          {/* <IconButton
          isRound
          aria-label="sticker"
          color="blue.400"
          bgColor="transparent"
          size="sm"
          icon={<CameraIcon width={30} />}
          mx="0.5"
        /> */}
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
      </Box>
    </Box>
  );
};
export default Bucket;

export const Container = ({ content }: any) => {
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  return (
    <>
      {content.type === "sticker" ? (
        <Box alignSelf="end" maxWidth="100px" m="1">
          <Image
            referrerPolicy="no-referrer"
            loader={() => `${content.stickerURL}?w=${100}&q=${75}`}
            src={content.stickerURL}
            width="100px"
            height="100px"
            style={{
              // zIndex: -1,
              backgroundColor: "#000000ff",
              borderRadius: 20,
            }}
          />
          <Box
            // mt="0.5"
            p="1"
            rounded="lg"
            w="fit-content"
            mx="auto"
            alignSelf="end"
            fontSize={9}
            fontWeight={500}
            bgColor="#5ac8faff"
            color="gray"
          >
            {content.timeSent ? (
              time
            ) : (
              <Box>
                <ClockIcon width={10} />
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Flex
          // alignSelf={messageStyle("end", "start")}
          bgColor="#5ac8faff"
          h="auto"
          borderRadius={13}
          px="2.5"
          py="0.25rem"
          m="1"
          w="fit-content"
          flexWrap="wrap"
          maxW="320px"
          justify="end"
        >
          {content.type === "document" ? (
            <Flex
              flexDirection="column"
              maxW="300px"
              align="center"
              color="#f2f2f7ff"
            >
              <Text fontSize={[14, 15, 16]} fontWeight={600}>
                {content.documentName.slice(0, 15)}
              </Text>
              <Text fontSize={13}>{content.documentType}</Text>
              <Text fontSize={13}>{prettyBytes(content.documentSize)}</Text>
              {content.status === "uploading" ? (
                <Box w="50px" opacity={0.5} my="1">
                  {/* <Progress
                    hasStripe
                    rounded="full"
                    value={docUploadProgress}
                    size="xs"
                    colorScheme="gray"
                  /> */}
                </Box>
              ) : (
                <Link
                  href={content.documentURL}
                  _hover={{ bgColor: "transparent", opacity: 0.5 }}
                >
                  <CloudDownloadIcon width={30} />
                </Link>
              )}
            </Flex>
          ) : (
            <Text
              fontSize={[14, 15, 16]}
              fontWeight={600}
              color="#f2f2f7ff"
              maxW="300px"
            >
              {content.text}
            </Text>
          )}
          <Box
            mt="2"
            ml="1.5"
            mr="1"
            alignSelf="end"
            fontSize={9}
            fontWeight={500}
            color="gray.50"
          >
            {content.timeSent ? (
              time
            ) : (
              <Box mb="1" mt="-1">
                <ClockIcon width={10} />
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </>
  );
};
