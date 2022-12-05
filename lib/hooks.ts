import { User } from "firebase/auth";
import { DocumentReference, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { ChatData, UserData } from "../types";
import { chatsQuery, userRef } from "./queries";

export const useFetchChats = (user: User | undefined | null) => {
  // const setChatData = useStore((state) => state.setChats);
  const [chats, setChats] = useState<ChatData[]>([]);
  useEffect(() => {
    if (!user) return;
    const listener = onSnapshot(chatsQuery(user), (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        recId: doc.data().USID.find((id) => id !== user.uid) || "",
        timeStamp: doc.data().timeStamp,
      }));
      setChats(chats);
    });

    return () => {
      listener();
    };
  }, [user]);
  return chats;
};

export const fetchUserData = (user: User | undefined | null) => {
  const setUserData = useStore((state) => state.setUserData);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await getDoc(userRef(user));
      const withId = { id: data.id, ...data.data() };
      data && setUserData(withId);
    })();
  }, [user]);
};
