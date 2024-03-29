import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  CollectionReference,
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
import { auth, db, rdb } from "@lib/firebase";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { ref, DataSnapshot } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import ReactTextareaAutosize from "react-textarea-autosize";
import PickerInterface from "../../components/PickerInterface";
import Stickers from "../../components/Stickers";
import Avatar from "@components/radix/Avatar";
import Message from "../../components/Message";
import { User } from "firebase/auth";
import { useStore } from "store";
import { UserData } from "types";
// import TimeAgo from "timeago-react";

const ChatPage: NextPage = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatId = router.query.chatId?.toString();

  const userdata = useStore((state) => state.userdata);

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
      <div className='w-full h-screen bg-[#ffffffff] inset-x-0 relative flex flex-col justify-between'>
        <div
          className='flex absolute bg-white bg-opacity-70 w-full py-1 backdrop-blur-lg justify-between max-h-12
         items-center z-20'>
          <div className=''>
            <button
              aria-label='back-btn'
              className='text-blue-500 md:hidden stroke-blue-500'
              onClick={routeToChats}>
              <ChevronLeftIcon width={30} />
            </button>
            {/* <div className='flex w-16 items-center mx-2'>
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
            </div> */}
          </div>

          <div className='flex flex-col text-center justify-center'>
            <p className=' text-base leading-5 text-[#000000da]'>
              {router.query.name && router.query.name}
            </p>
            <p className='text-[12px] leading-4 md:leading-4 text-[#3c3c4399] md:text-sm'>
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

        <div className='overflow-y-auto scroll-smooth h-full flex flex-col px-2 md:flex-6 pt-16 pb-16'>
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

        <InputArea
          messagesRef={messagesRef}
          user={user}
          userdata={userdata}
          chatId={chatId}
        />
      </div>
    </>
  );
};

interface InputAreaProps {
  messagesRef: CollectionReference<DocumentData>;
  user?: User | null;
  userdata?: UserData;
  chatId?: string;
}

export const InputArea = ({
  messagesRef,
  user,
  userdata,
  chatId,
}: InputAreaProps) => {
  const [picker, setPicker] = useState(false);

  const togglePicker = (state: boolean) => {
    setPicker(state);
  };

  const [stickerOpen, setStickerOpen] = useState(false);

  const toggleSticker = (state: boolean) => setStickerOpen(state);

  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    if (message.length < 1) return;
    addDoc(messagesRef, {
      text: message,
      sender: user?.uid,
      timeSent: serverTimestamp(),
      type: "text",
    });
    // keepBottom();
    setMessage("");
  };

  return (
    <div className=''>
      <div
        className=' pb-2 pt-1 px-2 items-end bg-white flex border-t
     border-neutral-200'>
        <div>
          {stickerOpen ? (
            <StickerIcon className='w-7 h-7 text-blue-400' />
          ) : (
            <button onClick={() => toggleSticker(true)}>
              <StickerIcon className='w-7 h-7 text-blue-400 drop-shadow-md' />
            </button>
          )}
        </div>
        <div className='relative h-full flex flex-col w-full'>
          <ReactTextareaAutosize
            className='w-full rounded-xl text-base ring-1 ring-neutral-200 bg-white mx-2 py-2 pl-4
          pr-10 placeholder:pl-1 resize-none'
            maxRows={7}
            placeholder='Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className='absolute right-0 inset-y-0 h-full pb-1.5 flex flex-col justify-end'>
            {message.length > 0 ? (
              <button
                className='bg-amber-400 rounded-full p-1 drop-shadow-lg'
                onClick={sendMessage}>
                <ArrowUpIcon width={20} color='white' />
              </button>
            ) : (
              <button className='bg-blue-400 rounded-full p-1 drop-shadow-lg'>
                <MicWaveIcon className='w-5 text-white drop-shadow-lg' />
              </button>
            )}
          </div>
        </div>

        <PickerInterface
          isOpen={picker}
          toggle={togglePicker}
          colRef={messagesRef}
          user={user}
        />
      </div>
      <>
        <Stickers
          toggle={toggleSticker}
          open={stickerOpen}
          chatId={chatId}
          userdata={userdata}
          // stickerOnClose={stickerOnClose}
        />
      </>
    </div>
  );
};

export default ChatPage;
