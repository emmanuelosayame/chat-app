import {
  Avatar,
  Box,
  Divider,
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
import { MicWaveIcon, SendIcon, StickerIcon } from "../../components/Svgs";
import { auth, db, rdb } from "../../firebase";
import ReactTimeAgo from "react-time-ago";
import { ArrowUpIcon } from "@heroicons/react/outline";
import { ref, DataSnapshot } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import PickerInterface from "../../components/PickerInterface";
import StickerComp from "../../components/StickerComp";

import Message from "../../components/Message";
import WebCamComp from "../../components/WebCamComp";
import { UploadTask } from "firebase/storage";
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
        flexDirection='column'
        w='full'
        h='full'
        bgColor='#ffffffff'
        justify='space-between'
        position={["fixed", "fixed", "unset"]}
        // key={router.query.chatId?.toString()}
      >
        <Flex
          pos='absolute'
          w='full'
          py='1'
          maxH='10'
          bgColor='whiteAlpha.500'
          backdropFilter='auto'
          backdropBlur='md'
          justify='space-between'
          align='center'
          zIndex={1000}>
          <Flex mr='-14'>
            <IconButton
              display={["block", "block", "none"]}
              aria-label='back-btn'
              size='md'
              icon={<ChevronLeftIcon width={40} height={50} />}
              mr='-4'
              // mb="2"
              onClick={routeToChats}
              _hover={{ bgColor: "transparent" }}
              _active={{ bgColor: "transparent" }}
              bgColor='transparent'
              color='blue.500'
              variant='ghost'
              // alignSelf="center"
            />
            <Flex
              alignSelf='center'
              w='60px'
              fontWeight={600}
              mx='2'
              justifyContent='start'
              align='center'>
              {!showStatus ? (
                <Text
                  textAlign='center'
                  w='fit-content'
                  color='whiteAlpha.900'
                  bgColor='#5ac8faff'
                  px='1'
                  h='auto'
                  py='0.5'
                  borderRadius={9}
                  fontSize={10}
                  opacity={0.15}>
                  ~
                </Text>
              ) : recStatus?.online && showStatus ? (
                <Text
                  textAlign='center'
                  bgColor='#5ac8faff'
                  rounded={10}
                  w='fit-content'
                  px='1'
                  py={0.5}
                  fontSize={["12", "12", "15"]}
                  color='#f5f5f5'>
                  online
                </Text>
              ) : (
                <Text
                  textAlign='center'
                  w='fit-content'
                  color='whiteAlpha.900'
                  bgColor='#5ac8faff'
                  px='1'
                  h='auto'
                  py='0.5'
                  borderRadius={9}
                  fontSize={13}>
                  <ReactTimeAgo
                    date={lastSeen}
                    timeStyle='twitter-minute-now'
                  />
                </Text>
                // <TimeAgo datetime={lastSeen} />
              )}
            </Flex>
          </Flex>

          <Box display='flex' flexDir='column' justifyContent='center'>
            <Text
              mx='auto'
              fontWeight={700}
              fontSize={[15, 15, 16]}
              lineHeight='1.2'
              color='#000000da'>
              {router.query.name && router.query.name}
            </Text>
            <Text
              mx='auto'
              fontWeight={600}
              fontSize={[12, 12, 14]}
              lineHeight='1'
              color='#3c3c4399'>
              {router.query.name && router.query.userName}
            </Text>
          </Box>
          <Box>
            {!!router.query.photoURL && router.query.photoURL !== "null" ? (
              <Box
                borderRadius='50%'
                h='35px'
                w='35px'
                overflow='hidden'
                border='1px solid #3c3c432d'
                mx='2'>
                <Image
                  alt='recProfile'
                  referrerPolicy='no-referrer'
                  loader={() => `${router.query.photoURL}?w=${60}&q=${75}`}
                  src={router.query.photoURL.toString()}
                  width='100%'
                  height='100%'
                />
              </Box>
            ) : (
              <Avatar size='sm' mx='2' />
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
          scrollBehavior='smooth'
          flexDirection='column'
          overflowX='auto'
          px={["3", "4", "6"]}
          h='full'
          pt='14'>
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
        <Divider />
        <Flex py='1' align='center' bgColor='#f2f2f7ff'>
          <PickerInterface
            isOpen={pickerIsOpen}
            onOpen={pickerOnOpen}
            onClose={pickerOnClose}
            // chatId={chatId}
            colRef={messagesRef}
            user={user}
            setProgress={setDocUploadProgress}
          />
          <WebCamComp
            colRef={messagesRef}
            user={user}
            top={9}
            direction={["column", "column", "column", "column"]}
          />
          <Flex
            w='full'
            borderRadius={20}
            borderWidth='1px'
            bgColor='#ffffffff'
            borderColor='#74748014'
            mr='3'
            position='relative'
            align='center'
            h='fit-content'>
            {stickerIsOpen ? (
              <Box
                alignSelf='center'
                my='1'
                mx='1.5'
                rounded='full'
                aria-label='send'
                color='#007affff'
                fontSize='1.1em'>
                <StickerIcon />
              </Box>
            ) : (
              <IconButton
                alignSelf='end'
                my='1'
                mx='1.5'
                isRound
                aria-label='send'
                color='#007affff'
                fontSize='1.1em'
                size='xs'
                icon={<StickerIcon />}
                onClick={stickerOnOpen}
              />
            )}
            <Textarea
              as={ReactTextareaAutosize}
              w='full'
              maxRows={7}
              placeholder='Message'
              _placeholder={{
                fontSize: 20,
                h: "full",
              }}
              variant='unstyled'
              size='sm'
              rows={1}
              resize='none'
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
              p='1.5'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fontSize='100%'
              h='full'
            />

            {newMessage.length > 0 ? (
              <IconButton
                isRound
                alignSelf='end'
                aria-label='send'
                bgColor='#007affff'
                fontSize='1.2em'
                size='xs'
                icon={<ArrowUpIcon width={20} color='white' />}
                onClick={sendMessage}
                m='1'
              />
            ) : (
              <IconButton
                alignSelf='end'
                isRound
                aria-label='send'
                bgColor='#74748014'
                fontSize='1.2em'
                size='xs'
                // icon={<MicrophoneIcon width={25} color="#007affff" />}
                icon={<MicWaveIcon color='#007affff' />}
                // onClick={sendMessage}
                m='1'
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
