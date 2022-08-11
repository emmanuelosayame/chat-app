import {
  AspectRatio,
  Box,
  Button,
  Flex,
  IconButton,
  useBoolean,
} from "@chakra-ui/react";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/outline";
import { ArrowsExpandIcon } from "@heroicons/react/solid";
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
import { storage } from "../firebase/firebase";

const WebCamComp = ({
  colRef,
  user,
}: {
  colRef: CollectionReference<DocumentData>;
  user?: User | null;
}) => {
  const webCamRef = useRef<any>(null);
  const [webCam, setWebCam] = useBoolean(false);
  const [mode, setMode] = useState<string>("photo");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [vid, setVid] = useState<string | null>(null);
  const [expandPhoto, setExpandPhoto] = useBoolean(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const dataURItoFile = (dataURI: string, fileName: string) => {
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = Buffer.from(dataURI.split(",")[1], "base64");
    const file = new File([ab], fileName, { type: mimeString });
    return file;
  };

  //   console.log(imgSrc && dataURItoFile(imgSrc, "namee"));

  const capture = useCallback(() => {
    setImgSrc(webCamRef.current.getScreenshot());
  }, [webCamRef]);

  const sendMedia = async () => {
    if (imgSrc)
      if (mode === "video") {
        return;
      } else {
        const file = dataURItoFile(imgSrc, "imagefile");
        const messageRef = await addDoc(colRef, {
          type: "image",
          status: "uploading",
          sender: user?.uid,
          timeSent: serverTimestamp(),
          imageSize: file.size,
          imageType: file.type,
        });
        const photosRef = sref(storage, `ChatDocuments/${messageRef.id}`);
        uploadBytes(photosRef, file)
          .then((snap) =>
            getDownloadURL(snap.ref).then((URL) => {
              updateDoc(messageRef, {
                status: "saved",
                photoURL: URL,
              });
            })
          )
          .catch(() => deleteDoc(messageRef));
      }
  };

  return (
    <>
      <IconButton
        isRound
        aria-label="sticker"
        color="blue.400"
        bgColor="transparent"
        size="sm"
        icon={<CameraIcon width={30} />}
        mx="0.5"
        onClick={setWebCam.on}
      />
      {webCam && (
        <Box
          w="full"
          h="full"
          bgColor="white"
          position="absolute"
          bottom={0}
          top={9}
          zIndex={100}
        >
          {vid && mode === "video" ? (
            <AspectRatio>
              <iframe />
            </AspectRatio>
          ) : imgSrc && mode === "photo" ? (
            <>
              {expandPhoto ? (
                <Box
                  position="fixed"
                  top={10}
                  bottom={0}
                  right={0}
                  left={0}
                  w="full"
                  h="full"
                  //   zIndex={5000}
                >
                  <Image
                    src={imgSrc}
                    width="1200px"
                    height="720px"
                    loader={() => imgSrc}
                    style={{ transform: "rotateY(180deg)" }}
                  />
                  <Button
                    size="sm"
                    rounded="xl"
                    onClick={() => setExpandPhoto.off()}
                    mx="auto"
                  >
                    back
                  </Button>
                </Box>
              ) : (
                <Box position="relative">
                  <Image
                    src={imgSrc}
                    width="1280px"
                    height="720px"
                    loader={() => imgSrc}
                    style={{ transform: "rotateY(180deg)" }}
                  />
                  <IconButton
                    position="absolute"
                    bottom={2}
                    right={0}
                    left={0}
                    w="fit-content"
                    mx="auto"
                    aria-label="expand-photo"
                    icon={<ArrowsExpandIcon color="#007affff" width={20} />}
                    onClick={setExpandPhoto.on}
                    variant="ghost"
                    size="xs"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box position="relative" borderRadius={10} m="1" overflow="hidden">
              <Webcam
                audio={false}
                screenshotFormat="image/webp"
                videoConstraints={videoConstraints}
                ref={webCamRef}
                style={{
                  transform: "rotateY(180deg)",
                }}
              />
              <Box
                position="absolute"
                bottom={2}
                right={0}
                left={0}
                w="fit-content"
                mx="auto"
              >
                {mode === "video" ? (
                  <>
                    <IconButton
                      aria-label="record"
                      size="sm"
                      rounded="xl"
                      onClick={capture}
                      icon={<VideoCameraIcon color="#007affff" width={30} />}
                      bgColor="#0000006c"
                    />
                  </>
                ) : (
                  <>
                    {imgSrc ? (
                      <Button
                        size="sm"
                        rounded="xl"
                        onClick={() => setImgSrc(null)}
                      >
                        retake
                      </Button>
                    ) : (
                      <IconButton
                        aria-label="capture"
                        size="sm"
                        rounded="xl"
                        onClick={capture}
                        icon={<CameraIcon color="#007affff" width={30} />}
                        bgColor="#0000006c"
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
          {!expandPhoto && (
            <Box
              bgColor="whitesmoke"
              mx="1"
              my="2"
              p="2"
              borderRadius={10}
              h="full"
            >
              <Flex justify="space-between" my="4">
                <Button
                  rounded="2xl"
                  onClick={() => {
                    setWebCam.off();
                    setImgSrc(null);
                  }}
                >
                  back
                </Button>

                {mode === "video" ? (
                  <Button
                    // size="sm"
                    rounded="2xl"
                    onClick={() => setMode("photo")}
                  >
                    photo
                  </Button>
                ) : (
                  <Button
                    // size="sm"
                    rounded="2xl"
                    onClick={() => setMode("video")}
                  >
                    Video
                  </Button>
                )}
                <Button isDisabled={!imgSrc} rounded="2xl" onClick={sendMedia}>
                  send
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default WebCamComp;
