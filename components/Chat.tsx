import { Checkbox } from "./Checkbox";
import {
  CameraIcon,
  CheckBadgeIcon,
  DocumentIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { limitText } from "@lib/helpers";
import {
  collection,
  doc,
  DocumentData,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../lib/firebase";
import Avatar from "./radix/Avatar";

interface ChatProps {
  selectedChat: boolean;
  editChats: boolean;
  toggleSelect: () => void;
  chatId: string;
  recId: string;
}

const Chat = ({
  editChats,
  selectedChat,
  toggleSelect,
  chatId,
  recId,
}: ChatProps) => {
  const router = useRouter();
  const recQuery = doc(db, "Users", `${recId}`);
  const [recData] = useDocumentData(recQuery);
  const latestMessageQuery = query(
    collection(db, "chatGroup", `${chatId}`, "messages"),
    orderBy("timeSent", "desc"),
    limit(1)
  );
  const [latestMessage] = useCollectionData(latestMessageQuery);
  const localeTime = (timeSent: Timestamp) =>
    timeSent.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  const dp = recData?.photoURL;
  // console.log(latestMessage && latestMessage[0]);

  const routerToChat = () => {
    if (selectedChat) return;
    router.push(
      {
        pathname: "/p/[chat]",
        query: {
          chatId: chatId,
          recId: recId,
          name: recData?.name,
          userName: recData?.userName,
          photoURL: recData?.photoURL,
        },
      },
      `/p/${recData?.userName}`
    );
  };

  const renderPreview: { [key: string]: ReactNode } = {
    text: (
      <>
        {latestMessage && latestMessage?.length > 0 && (
          <p>{limitText(latestMessage[0].text, 30)}</p>
        )}
      </>
    ),
    document: (
      <>
        <DocumentIcon width={12} />
        <p>document</p>
      </>
    ),
    image: (
      <>
        <CameraIcon width={12} />
        <p>picture</p>
      </>
    ),
    video: (
      <>
        <VideoCameraIcon width={12} />
        <p>video</p>
      </>
    ),
    sticker: (
      <>
        <CameraIcon width={12} />
        <p>sticker</p>
      </>
    ),
  };

  const active = !!(router.query.chatId?.toString() === chatId && !editChats);

  return (
    <div
      className={`flex mb-1 mx-1 items-center  ${
        active ? "bg-white rounded-xl" : "border-b border-neutral-200"
      } ${!editChats && "hover:pl-4 hover:scale-105"}`}>
      {editChats && <Checkbox checked={selectedChat} toggle={toggleSelect} />}
      <div
        className={`flex w-full flex-col group cursor-pointer rounded-md overflow-hidden`}
        onClick={routerToChat}>
        <div className='flex items-center w-full p-1.5 space-x-3'>
          <Avatar className='w-10 rounded-full' />
          <div className=''>
            <div className='flex items-center space-x-2'>
              <p className='text-base font-semibold text-neutral-600'>
                {recData?.name}
              </p>
              {recData?.verified && (
                <CheckBadgeIcon fill='#007affff' width={15} />
              )}
            </div>
            {latestMessage && latestMessage.length > 0 && (
              <div className='flex space-x-2 text-[12px] text-neutral-400'>
                {latestMessage &&
                  latestMessage.length > 0 &&
                  renderPreview[latestMessage[0].type]}
              </div>
            )}
          </div>
        </div>
        {/* <div
          className={`${
            !active ? "border-b border-neutral-200" : ""
          } w-11/12 mx-auto`}
        /> */}
      </div>
    </div>
  );
};

export default Chat;
