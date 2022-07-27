import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

export const fetchUsers = (mappedChats: any) => {
  const [chatUsers, setChatUsers] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let list: any = [];
      mappedChats?.forEach(async (id: any) => {
        const data = await getDoc(doc(db, "Users", `${id.recId}`));
        list.push({ recId: data.id, chatId: id.chatId, ...data.data() });
      });

      setChatUsers(await list);
    })();
  }, []);
  return chatUsers;
};
