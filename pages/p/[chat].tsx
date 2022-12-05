import {
  Box,
  Divider,
  Flex,
  IconButton,
  Text,
  Textarea,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  DocumentData,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { MicWaveIcon, SendIcon, StickerIcon } from "../../components/Svgs";
import { auth, db, rdb } from "../../firebase";
import ReactTimeAgo from "react-time-ago";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { ref, DataSnapshot } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import ReactTextareaAutosize from "react-textarea-autosize";
import PickerInterface from "../../components/PickerInterface";
import StickerComp from "../../components/StickerComp";
import Avatar from "@components/radix/Avatar";
import Message from "../../components/Message";
import WebCamComp from "../../components/WebCamComp";
// import TimeAgo from "timeago-react";

const ChatPage: NextPage = ({ showStatus, userData }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatId = router.query.chatId?.toString();

  const keepBottomRef = useRef<any>();
  const messagesRef = collection(db, "chatGroup", `${chatId}`, "messages");
  const messagesQuery = query(
    messagesRef,
    orderBy("timeSent", "asc"),
    // startAt("timeStamp"),
    limit(20)
  );
  const [messages] = useCollection(messagesQuery);

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

  const routeToChats = () => {
    router.push("/");
  };

  // console.log(router?.query?.photoURL);

  return (
    <>
      <div className='w-full h-full bg-[#ffffffff] fixed inset-x-0 md:relative flex flex-col justify-between'>
        <div
          className='flex absolute bg-white bg-opacity-50 w-full py-1 backdrop-blur-md justify-between max-h-12
         items-center z-20'>
          <div className=''>
            <button
              aria-label='back-btn'
              className='text-blue-500 md:hidden'
              onClick={routeToChats}>
              <ChevronLeftIcon width={40} height={50} />
            </button>
            <div className='flex w-16 items-center mx-2'>
              {!showStatus ? (
                <p className='w-fit px-1 h-auto py-05 rounded-sm text-base text-gray-900 text-center'>
                  ~
                </p>
              ) : recStatus?.online && showStatus ? (
                <p className='text-center bg-[#5ac8faff] w-fit px-1 py-0.5 text-sm md:text-base text-[#f5f5f5]'>
                  online
                </p>
              ) : (
                <p className='w-fit text-center px-1 rounded-md py-0.5 bg-[#5ac8faff] text-gray-900 text-sm'>
                  <ReactTimeAgo
                    date={lastSeen}
                    timeStyle='twitter-minute-now'
                  />
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col text-center justify-center'>
            <p className=' text-base text-[#000000da]'>
              {router.query.name && router.query.name}
            </p>
            <p className='text-[12px] text-[#3c3c4399] md:text-sm'>
              {router.query.name && router.query.userName}
            </p>
          </div>

          <div>
            <Avatar
              className='w-9 h-9 rounded-full mx-3'
              // src={router?.query?.photoURL?.toString()}
            />
          </div>
        </div>

        <div className='overflow-y-auto scroll-smooth flex flex-col px-2 md:flex-6 h-full pt-16'>
          {!!messages &&
            messages?.docs.map((message: DocumentData) => (
              <Message
                key={message.id}
                content={message.data()}
                docUploadProgress={docUploadProgress}
              />
            ))}
          <div ref={keepBottomRef} />
        </div>

        <div className='divider border-neutral-200' />

        <InputArea />
      </div>
    </>
  );
};

export const InputArea = ({
  messagesRef,
  user,
  setDocUploadProgress,
  chatId,
  userData,
}: any) => {
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

  const [newMessage, setNewMessage] = useState<string>("");

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

  return (
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
      <div className='flex py-1 items-center bg-[#f2f2f7ff]'>
        <PickerInterface
          isOpen={pickerIsOpen}
          onOpen={pickerOnOpen}
          onClose={pickerOnClose}
          // chatId={chatId}
          colRef={messagesRef}
          user={user}
          setProgress={setDocUploadProgress}
        />
        {/* <WebCamComp
            colRef={messagesRef}
            user={user}
            top={9}
            direction={["column", "column", "column", "column"]}
          /> */}
      </div>
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
      {/* {webCam &&  />} */}
    </Flex>
  );
};

export default ChatPage;
