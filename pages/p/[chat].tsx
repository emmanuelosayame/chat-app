import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Link,
  Progress,
  SlideFade,
  Text,
  Textarea,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowCircleUpIcon,
  ArrowNarrowUpIcon,
  ChevronLeftIcon,
} from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAt,
  Timestamp,
} from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { MicWaveIcon, SendIcon, StickerIcon } from "../../comps/Icons";
import { auth, db, rdb } from "../../firebase/firebase";
import ReactTimeAgo from "react-time-ago";
import {
  ArrowUpIcon,
  CameraIcon,
  ClockIcon,
  CloudDownloadIcon,
  CloudIcon,
  MicrophoneIcon,
} from "@heroicons/react/outline";
import { Database, ref, DataSnapshot } from "firebase/database";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import PickerInterface from "../../comps/PickerInterface";
import StickerComp from "../../comps/StickerComp";
import prettyBytes from "pretty-bytes";
import { SpinnerDotted, SpinnerInfinity } from "spinners-react";
import Webcam from "react-webcam";
import WebCamComp from "../../comps/WebCamComp";
// import TimeAgo from "timeago-react";

const Chats: NextPage = ({ showStatus, userData }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatId = router.query.chatId;
  const {
    isOpen: pickerIsOpen,
    onOpen: pickerOnOpen,
    onClose: pickerOnClose,
  } = useDisclosure();
  const {
    isOpen: stickerIsOpen,
    onOpen: stickerOnOpen,
    onClose: stickerOnClose,
  } = useDisclosure();

  const keepBottomRef = useRef<any>();
  const messagesRef = collection(db, "chatGroup", `${chatId}`, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("timeSent", "asc"),
    // startAt("timeStamp"),
    limit(20)
  );
  const [messages] = useCollection(messagesQuery);
  const [newMessage, setNewMessage] = useState<string>("");
  const [recStatus] = useObjectVal<{
    lastSeen: number;
    online: DataSnapshot;
  }>(ref(rdb, `status/${router.query.recId}`));

  const [docUploadProgress, setDocUploadProgress] = useState<
    number | undefined
  >(undefined);

  const lastSeen = !!recStatus ? new Date(recStatus.lastSeen) : new Date();

  // console.log(messages?.docs?.map((d) => d.data()));

  const keepBottom = () => {
    keepBottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!!messages) {
      keepBottom();
    }
  }, [router.pathname, messages]);

  const sendMessage = () => {
    if (!(newMessage.length === 0)) {
      addDoc(messagesRef, {
        text: newMessage,
        sender: user?.uid,
        timeSent: serverTimestamp(),
        type: "text",
      });
      // keepBottom();
      setNewMessage("");
    }
  };

  const routeToChats = () => {
    router.push("/");
  };

  return (
    <>
      <Flex
        flexDirection="column"
        w="full"
        h="full"
        bgColor="#ffffffff"
        justify="space-between"
        position={["fixed", "fixed", "unset"]}
        // key={router.query.chatId?.toString()}
      >
        <Flex
          pos="absolute"
          w="full"
          py="1"
          maxH="10"
          bgColor="whiteAlpha.500"
          backdropFilter="auto"
          backdropBlur="md"
          justify="space-between"
          align="center"
          zIndex={1000}
        >
          <Flex mr="-14">
            <IconButton
              display={["block", "block", "none"]}
              aria-label="back-btn"
              size="md"
              icon={<ChevronLeftIcon width={40} height={40} />}
              mr="-4"
              // mb="2"
              onClick={routeToChats}
              _hover={{ bgColor: "transparent" }}
              _active={{ bgColor: "transparent" }}
              bgColor="transparent"
              color="blue.500"
              variant="ghost"
              // alignSelf="center"
            />
            <Flex
              alignSelf="center"
              w="60px"
              fontWeight={600}
              mx="2"
              justifyContent="start"
            >
              {!showStatus ? (
                <Text
                  textAlign="center"
                  fontSize={20}
                  bgColor="transparent"
                  color="#5ac8faff"
                >
                  ...
                </Text>
              ) : !!recStatus?.online ? (
                <Text
                  textAlign="center"
                  bgColor="#5ac8faff"
                  rounded={10}
                  w="full"
                  fontSize={["12", "12", "15"]}
                  color="#f5f5f5"
                >
                  online
                </Text>
              ) : (
                <Text
                  textAlign="center"
                  w="fit-content"
                  color="whiteAlpha.900"
                  bgColor="#5ac8faff"
                  px="1"
                  h="auto"
                  py="0.5"
                  borderRadius={9}
                  fontSize={13}
                >
                  <ReactTimeAgo
                    date={lastSeen}
                    timeStyle="twitter-minute-now"
                  />
                </Text>
                // <TimeAgo datetime={lastSeen} />
              )}
            </Flex>
          </Flex>

          <Box display="flex" flexDir="column" justifyContent="center">
            <Text
              mx="auto"
              fontWeight={700}
              fontSize={[18, 18, 20]}
              lineHeight="1.2"
              color="#000000ff"
            >
              {router.query.name && router.query.name}
            </Text>
            <Text
              mx="auto"
              fontWeight={600}
              fontSize={[11, 11, 13]}
              lineHeight="1"
              color="#3c3c4399"
            >
              {router.query.name && router.query.userName}
            </Text>
          </Box>
          <Box>
            {!!router.query.photoURL && router.query.photoURL !== "null" ? (
              <Box
                borderRadius="50%"
                h="35px"
                w="35px"
                overflow="hidden"
                border="1px solid #3c3c432d"
                mx="2"
              >
                <Image
                  referrerPolicy="no-referrer"
                  loader={() => `${router.query.photoURL}?w=${60}&q=${75}`}
                  src={router.query.photoURL.toString()}
                  width="100%"
                  height="100%"
                />
              </Box>
            ) : (
              <Avatar size="sm" mx="2" />
            )}
          </Box>
        </Flex>
        {/* <Divider/> */}
        <Flex
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
          scrollBehavior="smooth"
          flexDirection="column"
          overflowX="auto"
          px={["3", "4", "6"]}
          h="full"
          pt="14"
        >
          {!!messages &&
            messages?.docs.map((message: DocumentData) => (
              <Message
                key={message.id}
                content={message.data()}
                docUploadProgress={docUploadProgress}
              />
            ))}
          <div ref={keepBottomRef} />
        </Flex>

        {/* {webCam &&  />} */}

        <Flex py="1" align="center">
          <PickerInterface
            isOpen={pickerIsOpen}
            onOpen={pickerOnOpen}
            onClose={pickerOnClose}
            // chatId={chatId}
            colRef={messagesRef}
            user={user}
            setProgress={setDocUploadProgress}
          />
          <WebCamComp colRef={messagesRef} user={user} />
          <Flex
            w="full"
            borderRadius={20}
            borderWidth="2px"
            borderColor="#3c3c4349"
            mr="3"
            position="relative"
          >
            {stickerIsOpen ? (
              <Box
                alignSelf="center"
                mx="1"
                rounded="full"
                aria-label="send"
                color="#007affff"
                fontSize="1.1em"
              >
                <StickerIcon />
              </Box>
            ) : (
              <IconButton
                alignSelf="end"
                m="1"
                isRound
                aria-label="send"
                color="#007affff"
                fontSize="1.1em"
                size="xs"
                icon={<StickerIcon />}
                onClick={stickerOnOpen}
              />
            )}
            <Textarea
              as={ReactTextareaAutosize}
              w="full"
              maxRows={7}
              placeholder="Message"
              _placeholder={{
                fontSize: 20,
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
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            {newMessage.length > 0 ? (
              <IconButton
                isRound
                alignSelf="end"
                aria-label="send"
                bgColor="#007affff"
                fontSize="1.2em"
                size="xs"
                icon={<ArrowUpIcon width={20} color="white" />}
                onClick={sendMessage}
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
        {stickerIsOpen && (
          // <SlideFade in={stickerIsOpen}>
          <StickerComp
            onClose={stickerOnClose}
            chatId={chatId}
            userData={userData}
            // stickerOnClose={stickerOnClose}
          />
          // </SlideFade>
        )}
      </Flex>
    </>
  );
};
export default Chats;

export const Message = ({
  content,
  docUploadProgress,
}: {
  content: DocumentData;
  docUploadProgress: number | undefined;
}) => {
  const user = auth.currentUser;
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  const messageStyle = (userVal: string, recVal: string) => {
    if (content.sender === user?.uid) {
      return userVal;
    }
    return recVal;
  };

  return (
    <>
      {content.type === "sticker" ? (
        <Box alignSelf={messageStyle("end", "start")} maxWidth="100px" m="1">
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
            bgColor={messageStyle("#5ac8faff", "#78788028")}
            color={messageStyle("gray.50", "gray")}
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
          flexDirection="column"
          alignSelf={messageStyle("end", "start")}
          bgColor={messageStyle("#5ac8faff", "#78788028")}
          h="auto"
          borderRadius={12}
          m="1"
          maxW="350px"
        >
          {content.type === "image" ? (
            <Box
              alignSelf={messageStyle("end", "start")}
              mx="1"
              mt="1"
              mb="-1"
            >
              <Image
                referrerPolicy="no-referrer"
                loader={() => `${content.photoURL}?w=${100}&q=${75}`}
                src={content.photoURL}
                width="1280px"
                height="720px"
                style={{
                  // zIndex: -1,
                  backgroundColor: "#000000ff",
                  borderRadius: 10,
                }}
              />
            </Box>
          ) : content.type === "document" ? (
            <Flex
              flexDirection="column"
              align="center"
              color={messageStyle("#f2f2f7ff", "#3c3c4399")}
              m={1.5}
            >
              <Text fontSize={[14, 15, 16]} fontWeight={600}>
                {content.documentName.slice(0, 15)}
              </Text>
              <Text fontSize={13}>{content.documentType}</Text>
              <Text fontSize={13}>{prettyBytes(content.documentSize)}</Text>
              {content.status === "uploading" ? (
                <Box w="50px" opacity={0.5} my="1">
                  <Progress
                    hasStripe
                    rounded="full"
                    value={docUploadProgress}
                    size="xs"
                    colorScheme="gray"
                  />
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
            <Box
              fontSize={[14, 15, 16]}
              fontWeight={600}
              color={messageStyle("#f2f2f7ff", "#3c3c4399")}
              maxW="300px"
              flexDirection="column"
              mx="2"
              my="0.25rem"
              // minW="70px"
              lineHeight={1}
              // display="inline-block"
            >
              {content.text}
              <Box
                h="auto"
                // alignSelf="end"
                ml={1.5}
                pt={1.5}
                float="right"
                w="fit-content"
                fontSize={10}
                fontWeight={500}
                color={messageStyle("gray.50", "gray")}
                // p
                // mb="0"
                // display="inline"
              >
                {content.timeSent ? time : <ClockIcon style={{}} width={10} />}
              </Box>
            </Box>
          )}
          {content.type !== "text" && (
            <Box
              h="auto"
              alignSelf="end"
              mx={1.5}
              pb={0.5}
              // float="right"
              w="fit-content"
              fontSize={11}
              fontWeight={500}
              color={messageStyle("gray.50", "gray")}
              // p
              // mb="0"
              // display="inline"
            >
              {content.timeSent ? time : <ClockIcon style={{}} width={10} />}
            </Box>
          )}
        </Flex>
      )}
    </>
  );
};
