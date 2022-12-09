import {
  ArrowLongRightIcon,
  CameraIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { User } from "firebase/auth";
import {
  addDoc,
  CollectionReference,
  deleteDoc,
  DocumentData,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { storage } from "../lib/firebase";

const WebCamCompLg = ({
  colRef,
  user,
  top,
  direction,
}: {
  colRef: CollectionReference<DocumentData>;
  user?: User | null;
  top: number;
  direction: any;
}) => {
  const webCamRef = useRef<any>(null);
  const webCamRefSm = useRef<any>(null);
  const [webCam, setWebCam] = useState(false);
  const [mode, setMode] = useState<string>("photo");
  const [imgSrc, setImgSrc] = useState<{ data: string; width: string } | null>(
    null
  );
  const [vid, setVid] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const [expandPhoto, setExpandPhoto] = useState(false);

  const videoConstraintsSm = {
    width: 720,
    height: 1280,
    facingMode: "user",
  };
  // console.log(imgSrc);
  const dataURItoFile = (dataURI: string, fileName: string) => {
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = Buffer.from(dataURI.split(",")[1], "base64");
    const file = new File([ab], fileName, { type: mimeString });
    return file;
  };

  //   console.log(imgSrc && dataURItoFile(imgSrc, "namee"));

  const capture = useCallback(() => {
    setImgSrc({ data: webCamRef.current.getScreenshot(), width: "lg" });
  }, [webCamRef]);

  const captureSm = useCallback(() => {
    setImgSrc({ data: webCamRefSm.current.getScreenshot(), width: "sm" });
  }, [webCamRefSm]);

  const sendMedia = async () => {
    if (imgSrc)
      if (mode === "video") {
        return;
      } else {
        const file = dataURItoFile(imgSrc.data, "imagefile");
        const messageRef = await addDoc(colRef, {
          type: "image",
          status: "uploading",
          sender: user?.uid,
          timeSent: serverTimestamp(),
          imageSize: file.size,
          imageType: file.type,
          imageWidth: imgSrc.width,
        });
        const photosRef = sref(storage, `captures/${messageRef.id}`);
        setWebCam(false);
        uploadBytes(photosRef, file, {
          cacheControl: "private,max-age=345600,immutable",
          contentDisposition: `attachment; filename=${file.name}`,
        })
          .then((snap) => {
            setImgSrc(null);
            setVid(null);
            getDownloadURL(snap.ref).then((URL) => {
              updateDoc(messageRef, {
                status: "saved",
                photoURL: URL,
              });
            });
          })
          .catch(() => deleteDoc(messageRef));
      }
  };

  return <>yoo</>;
};

export default WebCamCompLg;
