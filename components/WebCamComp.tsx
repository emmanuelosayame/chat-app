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
        setWebCam.off();
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

  return (
    <>
      <IconButton
        isRound
        aria-label='sticker'
        color='blue.400'
        bgColor='transparent'
        size='sm'
        icon={<CameraIcon width={30} />}
        mx='0.5'
        onClick={setWebCam.on}
      />
      {webCam && (
        <>
          <Show above='md'>
            <Flex
              w='auto'
              h='auto'
              bgColor='#ffffff6f'
              backdropFilter='auto'
              backdropBlur='lg'
              position={expandPhoto ? "fixed" : "absolute"}
              bottom={0}
              right={0}
              left={0}
              top={expandPhoto ? 0 : top}
              zIndex={expandPhoto ? 1000 : 100}
              flexDirection={direction}
              justify='center'
              align='center'
              mx='auto'>
              {vid && mode === "video" ? (
                <AspectRatio>
                  <video />
                </AspectRatio>
              ) : imgSrc && mode === "photo" ? (
                <>
                  {expandPhoto ? (
                    <Box
                      bottom={0}
                      right={0}
                      left={0}
                      w='fit-content'
                      bgColor='#fff'
                      h='full'
                      mx='auto'
                      borderRadius={10}
                      p='1'
                      position='relative'>
                      <Image
                        alt='captureImg'
                        src={imgSrc.data}
                        width={1200}
                        height={720}
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 15 }}
                      />
                      <Button
                        size='xs'
                        rounded='lg'
                        onClick={() => setExpandPhoto.off()}
                        mx='auto'
                        position='absolute'
                        left={0}
                        right={0}
                        top={5}
                        w='fit-content'
                        bgColor='#ffffff67'>
                        back
                      </Button>
                    </Box>
                  ) : (
                    <Box position='relative' mx='1'>
                      <Image
                        alt='captureImg'
                        src={imgSrc.data}
                        width={1280}
                        height={720}
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 15 }}
                      />

                      <IconButton
                        position='absolute'
                        w='fit-content'
                        bottom={4}
                        right={0}
                        left={2}
                        // mx="auto"
                        aria-label='expand-photo'
                        icon={
                          <ArrowUpOnSquareIcon color='#007affff' width={20} />
                        }
                        onClick={setExpandPhoto.on}
                        variant='ghost'
                        size='sm'
                        isRound
                      />
                      <IconButton
                        aria-label='send'
                        position='absolute'
                        bottom={0}
                        top='50%'
                        right={4}
                        // left={0}
                        w='fit-content'
                        isDisabled={!imgSrc}
                        rounded='2xl'
                        size='lg'
                        // backdropBlur="3xl"
                        // backdropFilter="auto"
                        bgColor='#ffffff75'
                        icon={<ArrowLongRightIcon color='#ffff' width={40} />}
                        onClick={sendMedia}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  position='relative'
                  borderRadius={10}
                  m='1'
                  overflow='hidden'>
                  <Webcam
                    audio={false}
                    screenshotFormat='image/webp'
                    videoConstraints={videoConstraints}
                    ref={webCamRef}
                    // style={{}}
                  />
                </Box>
              )}
              {!expandPhoto && (
                <Box
                  // bgColor="whitesmoke"
                  mx='2'
                  my='2'
                  py='1'
                  px='2'
                  borderRadius={10}
                  h='fit-content'
                  w='auto'>
                  <Stack
                    h='fit-content'
                    mx='auto'
                    direction={["row", "row", "row", "row"]}
                    w='fit-content'>
                    <Button
                      rounded='2xl'
                      onClick={() => {
                        setWebCam.off();
                        setImgSrc(null);
                      }}>
                      back
                    </Button>

                    {mode === "video" ? (
                      <>
                        {vid ? (
                          <Button
                            size='lg'
                            rounded='2xl'
                            onClick={() => setVid(null)}>
                            retake
                          </Button>
                        ) : (
                          <Box
                            aria-label='start-recording'
                            bgColor='#0000006e'
                            rounded='full'
                            p='2'
                            m='0'
                            cursor='pointer'>
                            <Box
                              w='40px'
                              h='40px'
                              bgColor='#ff4242'
                              rounded='full'
                            />
                          </Box>
                        )}
                        <Button
                          // size="sm"
                          rounded='2xl'
                          onClick={() => setMode("photo")}>
                          photo
                        </Button>
                      </>
                    ) : (
                      <>
                        {imgSrc ? (
                          <Button
                            size='lg'
                            rounded='2xl'
                            onClick={() => setImgSrc(null)}>
                            retake
                          </Button>
                        ) : (
                          <Box
                            aria-label='capture'
                            onClick={capture}
                            // icon={<CameraIcon color="#007affff" width={40} />}
                            bgColor='#00000084'
                            rounded='full'
                            p='2'
                            m='0'
                            cursor='pointer'>
                            <Box
                              w='40px'
                              h='40px'
                              bgColor='#ffffff'
                              rounded='full'
                            />
                          </Box>
                        )}
                        <Button
                          // size="sm"
                          rounded='2xl'
                          onClick={() => {
                            setMode("video");
                            setImgSrc(null);
                          }}>
                          Video
                        </Button>
                      </>
                    )}
                  </Stack>
                </Box>
              )}
            </Flex>
          </Show>

          <Show below='md'>
            <Flex
              w='auto'
              h='full'
              bgColor='#ffffff6f'
              backdropFilter='auto'
              backdropBlur='lg'
              position={expandPhoto ? "fixed" : "absolute"}
              bottom={0}
              right={0}
              left={0}
              top={expandPhoto ? 0 : top}
              zIndex={expandPhoto ? 1000 : 100}
              flexDirection={direction}
              justify='center'
              align='center'
              mx='auto'>
              {vid && mode === "video" ? (
                <AspectRatio>
                  <video />
                </AspectRatio>
              ) : imgSrc && mode === "photo" ? (
                <>
                  {expandPhoto ? (
                    <Box
                      bottom={0}
                      right={0}
                      left={0}
                      w='fit-content'
                      h='fit-content'
                      mx='auto'
                      borderRadius={10}
                      p='2'
                      position='relative'>
                      <Image
                        alt='captureImg'
                        src={imgSrc.data}
                        height={720}
                        width={720}
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <Button
                        size='xs'
                        rounded='lg'
                        onClick={() => setExpandPhoto.off()}
                        mx='auto'
                        position='absolute'
                        left={0}
                        right={0}
                        top={5}
                        w='fit-content'
                        bgColor='#ffffff67'>
                        back
                      </Button>
                    </Box>
                  ) : (
                    <Box position='relative' mx='1'>
                      <Image
                        alt='captureImg'
                        src={imgSrc.data}
                        width={720}
                        height={720}
                        loader={() => imgSrc.data}
                        style={{ borderRadius: 10 }}
                      />
                      <IconButton
                        position='absolute'
                        w='fit-content'
                        bottom={4}
                        right={0}
                        left={2}
                        // mx="auto"
                        aria-label='expand-photo'
                        icon={
                          <ArrowUpOnSquareIcon color='#007affff' width={20} />
                        }
                        onClick={setExpandPhoto.on}
                        variant='ghost'
                        size='sm'
                        isRound
                      />
                      <IconButton
                        aria-label='send'
                        position='absolute'
                        bottom={0}
                        top='50%'
                        right={4}
                        // left={0}
                        w='fit-content'
                        isDisabled={!imgSrc}
                        rounded='2xl'
                        size='lg'
                        // backdropBlur="3xl"
                        // backdropFilter="auto"
                        bgColor='#ffffff75'
                        icon={<ArrowLongRightIcon color='#ffff' width={40} />}
                        onClick={sendMedia}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  position='relative'
                  borderRadius={10}
                  m='1'
                  overflow='hidden'>
                  <Webcam
                    audio={false}
                    screenshotFormat='image/webp'
                    videoConstraints={videoConstraintsSm}
                    ref={webCamRefSm}
                    // style={{}}
                  />
                </Box>
              )}
              {!expandPhoto && (
                <Box
                  // bgColor="whitesmoke"
                  mx='2'
                  my='2'
                  py='1'
                  px='2'
                  borderRadius={10}
                  h='fit-content'
                  w='auto'>
                  <Stack
                    h='fit-content'
                    mx='auto'
                    direction={["row", "row", "row", "column"]}
                    w='fit-content'>
                    <Button
                      rounded='2xl'
                      onClick={() => {
                        setWebCam.off();
                        setImgSrc(null);
                      }}>
                      back
                    </Button>

                    {mode === "video" ? (
                      <>
                        {vid ? (
                          <Button
                            size='lg'
                            rounded='2xl'
                            onClick={() => setVid(null)}>
                            retake
                          </Button>
                        ) : (
                          <Box
                            aria-label='start-recording'
                            bgColor='#0000006e'
                            rounded='full'
                            p='2'
                            m='0'
                            cursor='pointer'>
                            <Box
                              w='40px'
                              h='40px'
                              bgColor='#ff4242'
                              rounded='full'
                            />
                          </Box>
                        )}
                        <Button
                          // size="sm"
                          rounded='2xl'
                          onClick={() => setMode("photo")}>
                          photo
                        </Button>
                      </>
                    ) : (
                      <>
                        {imgSrc ? (
                          <Button
                            size='lg'
                            rounded='2xl'
                            onClick={() => setImgSrc(null)}>
                            retake
                          </Button>
                        ) : (
                          <Box
                            aria-label='capture'
                            onClick={captureSm}
                            // icon={<CameraIcon color="#007affff" width={40} />}
                            bgColor='#00000084'
                            rounded='full'
                            p='2'
                            m='0'
                            cursor='pointer'>
                            <Box
                              w='40px'
                              h='40px'
                              bgColor='#ffffff'
                              rounded='full'
                            />
                          </Box>
                        )}
                        <Button
                          // size="sm"
                          rounded='2xl'
                          onClick={() => {
                            setMode("video");
                            setImgSrc(null);
                          }}>
                          Video
                        </Button>
                      </>
                    )}
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
