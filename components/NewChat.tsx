
import { addDoc, collection, serverTimestamp, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import { debounce } from "lodash";
import Image from "next/image";
import { useStore } from "../store";

const NewChatComp = ({
  newSearch,
  setNewSearch,
  chatsData,
  mappedChats,
  text,
  icon,
  color,
  onClose,
}: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const inputRef = useRef<HTMLInputElement>(null);
  const usersRef = ref(rdb, `Users`);
  const [usersList, setUsersList] = useState<
    | [
        {
          key: string;
          name: string;
          uid: string;
          userName: string;
          photoURL: string;
        }
      ]
    | null
  >(null);
  const [chatUsersList, setChatUsersList] = useState<any>([]);
  const recIds = mappedChats?.map(
    (ids: { recId: string } | undefined) => ids?.recId
  );

  const searchUser = debounce(async (e: any) => {
    const input = e.target.value.toLowerCase();
    if (!chatsData) return;
    const fuse = new Fuse(chatsData, {
      keys: ["name", "userName"],
    });
    setChatUsersList(fuse.search(`${input}`));

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
        setUsersList(list);
      },
      { onlyOnce: true }
    );
  }, 700);

  const noChatUsersList = usersList?.filter(
    (list) => !recIds.includes(list.uid) && list.uid !== user?.uid
  );
  // console.log(chatUsersList);

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

  return <>{isOpen && <>yoo/</>}</>;
};

export default NewChatComp;
