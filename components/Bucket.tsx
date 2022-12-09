import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ReactTextareaAutosize from "react-textarea-autosize";
import { auth, db } from "../lib/firebase";
import { MicWaveIcon } from "./Svgs";
import Message from "./Message";
import PickerInterface from "./PickerInterface";
import WebCamComp from "./WebCamComp";

const Bucket = ({ setBucket }: any) => {
  const user = auth.currentUser;
  const bucketListRef = collection(db, "Users", `${user?.uid}`, "bucket");
  const bucketListQuery = query(bucketListRef, orderBy("timeSent", "asc"));
  const [bucketList] = useCollectionData<any>(bucketListQuery);

  const [bucketMessage, setBucketMessage] = useState<string>("");
  const [docUploadProgress, setDocUploadProgress] = useState<
    number | undefined
  >(undefined);

  const handleSendMessage = async () => {
    if (bucketMessage !== null && bucketMessage?.length > 0)
      addDoc(bucketListRef, {
        text: bucketMessage,
        timeSent: serverTimestamp(),
      });
    setBucketMessage("");
  };
  // console.log(bucketList);

  return <>yoo</>;
};
export default Bucket;
