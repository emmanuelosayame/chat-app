import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserData } from "../types";

interface ChatData {
  USID: [string, string];
  timeStamp: Timestamp;
}

export const chatsQuery = (user: User | undefined | null) =>
  query(
    collection(db, "chatGroup") as CollectionReference<ChatData>,
    where("USID", "array-contains", `${user?.uid}`),
    orderBy("timeStamp", "desc")
  );
export const userRef = (user: User | undefined | null) =>
  doc(db, "Users", `${user?.uid}`) as DocumentReference<Omit<UserData, "id">>;
