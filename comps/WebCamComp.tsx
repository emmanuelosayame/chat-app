import {
  AspectRatio,
  Box,
  Button,
  Flex,
  IconButton,
  ResponsiveValue,
  Show,
  Stack,
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
  const [webCam, setWebCam] = useBoolean(false);
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
  const [expandPhoto, setExpandPhoto] = useBoolean(false);

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
    setWebCam.off();
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
        <>
          <Show above="md">
            <Flex
              w="auto"
              h="auto"
              bgColor="#ffffff6f"
              backdropFilter="auto"
              backdropBlur="lg"
              position={expandPhoto ? "fixed" : "absolute"}
              bottom={0}
              right={0}
              left={0}
              top={expandPhoto ? 0 : top}
              zIndex={expandPhoto ? 1000 : 100}
              flexDirection={direction}
              justify="center"
              align="center"
              mx="auto"
            >
              {vid && mode === "video" ? (
                <AspectRatio>
                  <iframe />
                </AspectRatio>
              ) : imgSrc && mode === "photo" ? (
                <>
                  {expandPhoto ? (
                    <Box
                      bottom={0}
                      right={0}
                      left={0}
                      w="fit-content"
                      bgColor="red"
                      h="full"
                      mx="auto"
                      borderRadius={10}
                      p="2"
                      position="relative"
                    >
                      <Image
                        src={imgSrc.data}
                        width="1200px"
                        height="720px"
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <Button
                        size="xs"
                        rounded="lg"
                        onClick={() => setExpandPhoto.off()}
                        mx="auto"
                        position="absolute"
                        left={0}
                        right={0}
                        top={5}
                        w="fit-content"
                        bgColor="#ffffff67"
                      >
                        back
                      </Button>
                    </Box>
                  ) : (
                    <Box position="relative" mx="1">
                      <Image
                        src={imgSrc.data}
                        width="1280px"
                        height="720px"
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <IconButton
                        position="absolute"
                        bottom={2}
                        right={0}
                        left={0}
                        w="fit-content"
                        mx="auto"
                        my="2"
                        aria-label="expand-photo"
                        icon={<ArrowsExpandIcon color="#007affff" width={20} />}
                        onClick={setExpandPhoto.on}
                        variant="ghost"
                        size="sm"
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  position="relative"
                  borderRadius={10}
                  m="1"
                  overflow="hidden"
                >
                  <Webcam
                    audio={false}
                    screenshotFormat="image/webp"
                    videoConstraints={videoConstraints}
                    ref={webCamRef}
                    style={{}}
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
                          icon={
                            <VideoCameraIcon color="#007affff" width={30} />
                          }
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
                  // bgColor="whitesmoke"
                  mx="2"
                  my="2"
                  py="1"
                  px="2"
                  borderRadius={10}
                  h="fit-content"
                  w="auto"
                >
                  <Stack
                    h="fit-content"
                    mx="auto"
                    direction={["row", "row", "row", "row"]}
                    w="fit-content"
                  >
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
                    <Button
                      isDisabled={!imgSrc}
                      rounded="2xl"
                      onClick={sendMedia}
                    >
                      send
                    </Button>
                  </Stack>
                </Box>
              )}
            </Flex>
          </Show>

          <Show below="md">
            <Flex
              w="auto"
              h="auto"
              bgColor="#ffffff6f"
              backdropFilter="auto"
              backdropBlur="lg"
              position={expandPhoto ? "fixed" : "absolute"}
              bottom={0}
              right={0}
              left={0}
              top={expandPhoto ? 0 : top}
              zIndex={expandPhoto ? 1000 : 100}
              flexDirection={direction}
              justify="center"
              align="center"
              mx="auto"
            >
              {vid && mode === "video" ? (
                <AspectRatio>
                  <iframe />
                </AspectRatio>
              ) : imgSrc && mode === "photo" ? (
                <>
                  {expandPhoto ? (
                    <Box
                      bottom={0}
                      right={0}
                      left={0}
                      w="fit-content"
                      h="fit-content"
                      mx="auto"
                      borderRadius={10}
                      p="2"
                      position="relative"
                    >
                      <Image
                        src={imgSrc.data}
                        height="720px"
                        width="720px"
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <Button
                        size="xs"
                        rounded="lg"
                        onClick={() => setExpandPhoto.off()}
                        mx="auto"
                        position="absolute"
                        left={0}
                        right={0}
                        top={5}
                        w="fit-content"
                        bgColor="#ffffff67"
                      >
                        back
                      </Button>
                    </Box>
                  ) : (
                    <Box position="relative" mx="1">
                      <Image
                        src={imgSrc.data}
                        width="720px"
                        height="720px"
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <IconButton
                        position="absolute"
                        bottom={2}
                        right={0}
                        left={0}
                        w="fit-content"
                        mx="auto"
                        my="2"
                        aria-label="expand-photo"
                        icon={<ArrowsExpandIcon color="#007affff" width={20} />}
                        onClick={setExpandPhoto.on}
                        variant="ghost"
                        size="sm"
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  position="relative"
                  borderRadius={10}
                  m="1"
                  overflow="hidden"
                >
                  <Webcam
                    audio={false}
                    screenshotFormat="image/webp"
                    videoConstraints={videoConstraintsSm}
                    ref={webCamRefSm}
                    // style={{}}
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
                          icon={
                            <VideoCameraIcon color="#007affff" width={30} />
                          }
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
                            onClick={captureSm}
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
                  // bgColor="whitesmoke"
                  mx="2"
                  my="2"
                  py="1"
                  px="2"
                  borderRadius={10}
                  h="fit-content"
                  w="auto"
                >
                  <Stack
                    h="fit-content"
                    mx="auto"
                    direction={["row", "row", "row", "column"]}
                    w="fit-content"
                  >
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
                    <Button
                      isDisabled={!imgSrc}
                      rounded="2xl"
                      onClick={sendMedia}
                    >
                      send
                    </Button>
                  </Stack>
                </Box>
              )}
            </Flex>
          </Show>
        </>
      )}
    </>
  );
};

export default WebCamCompLg;
