import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog/dist";
import { addDoc, collection, serverTimestamp, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { auth, db, rdb } from "../lib/firebase";
import {
  endAt,
  onValue,
  orderByKey,
  query,
  ref,
  startAt,
} from "firebase/database";
import Fuse from "fuse.js";
import debounce from "lodash/debounce";
import Image from "next/image";
import { useStore } from "../store";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChatData } from "types";
import Avatar from "./radix/Avatar";

interface ChatList {
  key: string;
  name: string;
  uid: string;
  userName: string;
  photoURL: string;
}

const NewChatComp = ({ chats }: { chats: ChatData[] }) => {
  const router = useRouter();
  const user = auth.currentUser;
  const usersRef = ref(rdb, `Users`);
  const [list, setList] = useState<ChatList[] | null>(null);

  const recIds = chats?.map((ids) => ids.recId);

  const searchUser = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();

    const searchQuery = query(
      usersRef,
      orderByKey(),
      startAt(input),
      endAt(`${input}\uf8ff`)
    );
    onValue(
      searchQuery,
      (snapshot) => {
        let list: any = [];
        snapshot.forEach((data) => {
          const key = data.key;
          const val = data.val();
          list.push({ key, ...val });
        });
        setList(list);
      },
      { onlyOnce: true }
    );
  }, 300);

  const chatList = list?.filter(
    (search) => recIds.includes(search.uid) && search.uid !== user?.uid
  );

  const noChatList = list?.filter(
    (search) => !recIds.includes(search.uid) && search.uid !== user?.uid
  );

  // console.log(list);

  const handleNewChat = async (uid: any, name: any, userName: any) => {
    const newRef = await addDoc(collection(db, "chatGroup"), {
      USID: [user?.uid, uid],
      timeStamp: serverTimestamp(),
    });
    router.push(
      {
        pathname: "/p/[chat]",
        query: {
          chatId: newRef.id,
          recId: uid,
          name: name,
          userName: userName,
        },
      },
      `/p/${userName}`
    );
  };

  const isOpen = useStore((state) => state.newChatModal.open);
  const toggle = useStore((state) => state.toggleNCM);

  return (
    <Root open={isOpen} onOpenChange={toggle}>
      <Portal>
        <Overlay className='fixed bg-gray-800 opacity-60 z-30 inset-0 ' />
        <Content
          className='pointer-events-auto fixed z-40 md:-translate-x-1/2 w-96 
          md:top-20 md:left-1/2 bg-white rounded-lg p-4 shadow-lg'>
          <div className='relative'>
            <MagnifyingGlassIcon
              className='absolute top-1 left-2 text-blue-500'
              width={23}
            />
            <input
              autoFocus
              placeholder='search user'
              className='rounded-lg py-1 pl-9 pr-4 bg-neutral-100 w-full'
              onChange={searchUser}
            />
            {/* no chat users */}
            <div className='overflow-y-auto h-full max-h-[400px]'>
              <div className='pt-5'>
                <p className='font-semibold text-neutral-400 mb-1'>My chats</p>
                {chatList?.map((chatUser) => (
                  <div
                    key={chatUser.uid}
                    className='flex border-t border-neutral-100 p-0.5 items-center cursor-pointer 
                    hover:opacity-70'
                    onClick={() => {
                      router.push(
                        {
                          pathname: "/p/[chat]",
                          query: {
                            chatId: chats.find(
                              (user) => user.recId === chatUser.uid
                            )?.id,
                            recId: chatUser.uid,
                            name: chatUser.name,
                            userName: chatUser.userName,
                            photoURL: chatUser.photoURL,
                          },
                        },
                        `/p/${chatUser.userName}`
                      );
                      toggle();
                    }}>
                    <Avatar
                      alt='profile'
                      src={chatUser.photoURL}
                      fallback={chatUser.name}
                      className='w-10 h-10 rounded-full'
                    />
                    <div className='ml-3'>
                      <p>{chatUser.name}</p>
                      <p className='text-sm text-neutral-500'>
                        {chatUser.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {noChatList && noChatList.length > 1 && (
                <>
                  <p className='font-semibold text-neutral-400 mb-1'>All</p>
                  {noChatList?.map((chatUser) => (
                    <div
                      key={chatUser.uid}
                      className='flex border-t border-neutral-100 p-0.5 items-center'>
                      <Avatar
                        alt='profile'
                        src={chatUser.photoURL}
                        fallback={chatUser.name}
                        className='w-10 h-10 rounded-full'
                      />
                      <div className='ml-3'>
                        <p>{chatUser.name}</p>
                        <p className='text-sm text-neutral-500'>
                          {chatUser.userName}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default NewChatComp;
