import { ClockIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { limitText } from "@lib/helpers";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { ReactNode } from "react";
import { SpinnerRound } from "spinners-react";
import { auth } from "../lib/firebase";

interface MessageContent {
  type: string;
  sender: string;
  text: string;
  stickerURL: string;
  photoURL: string;
  mediaURL: string;
  documentName: string;
  documentType: string;
  documentSize: number;
  timeSent: Timestamp;
}

interface MessageComponent {
  content: MessageContent;
  time: any;

  senderStyle: boolean;
  children?: ReactNode;
}

const Message = ({
  content,
  docUploadProgress,
}: {
  content: MessageContent;
  docUploadProgress?: number | undefined;
}) => {
  const user = auth.currentUser;
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });

  const senderStyle = !!(!content.sender || content.sender === user?.uid);

  const messageProps = {
    content,
    time,
    senderStyle,
  };

  const renderMessage: { [key: string]: ReactNode } = {
    text: <Text {...messageProps} />,
    document: <Document {...messageProps} />,
    video: <Video {...messageProps} />,
    image: <Picture {...messageProps} />,
    sticker: <Sticker {...messageProps} />,
  };

  return (
    // <>

    //     <div
    //       className={`${sender ? "self-end" : "self-start"} m-1 max-w-[100px]`}
    //       flexDirection='column'
    //       alignSelf={messageStyle("end", "start")}
    //       bgColor={messageStyle("#5ac8faff", "#78788028")}
    //       h='auto'
    //       borderRadius={12}
    //       m='1'
    //       maxW='280px'>
    //       {content.type === "image" ? (
    //         <Box
    //           alignSelf={messageStyle("end", "start")}
    //           mx='1'
    //           mt='1'
    //           mb='1'
    //           w={content.photoURL || content.mediaURL ? "270px" : "fit-content"}
    //           display='block'>
    //           {content.status === "saved" ? (
    //             <>
    //               {(content.photoURL || content.mediaURL) && (

    //               )}
    //             </>
    //           ) : (
    //             <SpinnerRound color='#7676801e' />
    //           )}
    //         </Box>
    //       ) : content.type === "video" ? (
    //         <Box maxW='280px' p='1'>
    //           {content.status === "saved" ? (
    //             <video
    //               controls
    //               src={content.mediaURL}
    //               style={{ borderRadius: 10 }}
    //             />
    //           ) : (
    //             <SpinnerRound
    //               color='#7676801e'
    //               // onClick={() => upload?.resume()}
    //             />
    //           )}
    //         </Box>
    //       )
    //       {content.type !== "text" && content.type && (
    //         <Box
    //           h='auto'
    //           alignSelf='end'
    //           mx={1.5}
    //           pb={1}
    //           // float="right"
    //           w='fit-content'
    //           fontSize={11}
    //           fontWeight={500}
    //           color={messageStyle("gray.50", "gray")}
    //           // p
    //           // mb="0"
    //           // display="inline"
    //         >
    //           {content.timeSent ? time : <ClockIcon width={10} />}
    //         </Box>
    //       )}
    //     </div>
    //   )}
    // </>
    <div
      className={`${senderStyle ? "self-end" : "self-start"} ${
        !senderStyle ? "bg-neutral-300" : "bg-blue-300"
      }  m-1 rounded-xl `}>
      {renderMessage[content.type]}
    </div>
  );
};

const TimeComponent = ({
  time,
  timeSent,
}: {
  time: any;
  timeSent: Timestamp;
}) => {
  return (
    <>
      {timeSent ? (
        <p className='text-[10px] text-end h-fit'>{time}</p>
      ) : (
        <ClockIcon width={11} className='mb-1 text-white' />
      )}
    </>
  );
};

const Text = ({ content, time, senderStyle }: MessageComponent) => {
  return (
    <div
      className={`${
        senderStyle ? "text-[#f2f2f7ff]" : "text-[#3c3c4399]"
      } flex ${
        content.text.length > 20 && "flex-col"
      } text-sm px-2 max-w-xs space-x-2`}>
      <p className='py-1'>{content.text}</p>
      <div className={" flex items-end justify-end"}>
        <TimeComponent time={time} timeSent={content.timeSent} />
      </div>
    </div>
  );
};

const Picture = ({ content, time, senderStyle }: MessageComponent) => {
  return (
    <div
      className={`${
        senderStyle ? "text-[#f2f2f7ff]" : "text-[#3c3c4399]"
      } text-sm px-1 pt-1 max-w-md`}>
      <Image
        referrerPolicy='no-referrer'
        alt='capture-img'
        loader={() => `${content.photoURL || content.mediaURL}`}
        src={content.photoURL || content.mediaURL}
        className='w-52 h-52 rounded-xl bg-black'
        width={1000}
        height={1000}
      />
      <div className={"px-2 mt-1"}>
        <TimeComponent time={time} timeSent={content.timeSent} />
      </div>
    </div>
  );
};

const Video = ({ content, time, senderStyle }: MessageComponent) => {
  return (
    <div
      className={`${
        senderStyle ? "text-[#f2f2f7ff]" : "text-[#3c3c4399]"
      } text-sm px-1 pt-1 max-w-md`}>
      <video controls src={content.mediaURL} style={{ borderRadius: 10 }} />
      <div className={"px-2 mt-1"}>
        <TimeComponent time={time} timeSent={content.timeSent} />
      </div>
    </div>
  );
};

const Document = ({ content, time, senderStyle }: MessageComponent) => {
  return (
    <div
      className={`${
        senderStyle ? "text-[#f2f2f7ff]" : "text-[#3c3c4399]"
      } text-sm p-2 max-w-xs space-x-2`}>
      <p className='text-[14px]'>{limitText(content.documentName, 15)}</p>
      <p>{content.documentType}</p>
      <p className='text-[13px] text-neutral-400'>
        {prettyBytes(content.documentSize)}
      </p>
    </div>
  );
};

const Sticker = ({ content, time, senderStyle }: MessageComponent) => {
  return (
    <div
      className={`${
        senderStyle ? "text-[#f2f2f7ff]" : "text-[#3c3c4399]"
      } text-sm px-1 pt-1 max-w-xs space-x-2`}>
      <Image
        referrerPolicy='no-referrer'
        alt='stickerImg'
        loader={() => `${content.stickerURL}?w=${100}&q=${75}`}
        src={content.stickerURL}
        className='w-28 h-28 rounded-xl bg-black'
        width={100}
        height={100}
      />
      <div className={"flex items-end justify-end px-2 mt-1"}>
        <TimeComponent time={time} timeSent={content.timeSent} />
      </div>
    </div>
  );
};

export default Message;
