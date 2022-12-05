import {
  Box,
  Button,
  Flex,
  GridItem,
  IconButton,
  Input,
  SlideFade,
  Stack,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  PlusIcon,
  CameraIcon,
  PhotoIcon,
  DocumentIcon,
  // PaperClipIcon,
} from "@heroicons/react/24/outline";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as sref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import {
  ChangeEvent,
  Dispatch,
  ForwardRefExoticComponent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { db, storage } from "../firebase";

const PickerInterface = ({
  isOpen,
  onClose,
  onOpen,
  colRef,
  user,
  setProgress,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  colRef: CollectionReference<DocumentData>;
  user: User | null;
  setProgress: Dispatch<SetStateAction<number | undefined>>;
}) => {
  const ref = useRef<any>(null);
  const documentRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  useOutsideClick({ ref: ref, handler: onClose });

  const [document, setDocument] = useState<File | null>(null);
  const [media, setMedia] = useState<{ file: File; URL: string } | null>(null);

  const [error, setError] = useState<{
    limit: string | null;
    upload: string | null;
  } | null>(null);

  const handleDocuments = (e: ChangeEvent<HTMLInputElement>) => {
    const toBeUploadedDoc = e.target?.files?.[0];
    if (toBeUploadedDoc) {
      setDocument(toBeUploadedDoc);
    }
    if (toBeUploadedDoc && toBeUploadedDoc.size > 1500000) {
      setError({ limit: "cannot send files above 15mb", upload: null });
      return;
    }
  };

  // console.log(media);

  const handleMedia = (e: ChangeEvent<HTMLInputElement>) => {
    const toBeUploadedMedia = e.target?.files?.[0];
    if (toBeUploadedMedia && toBeUploadedMedia.size > 1600000) {
      setError({ limit: "cannot send files above 15mb", upload: null });
    }
    if (toBeUploadedMedia)
      setMedia({
        file: toBeUploadedMedia,
        URL: URL.createObjectURL(toBeUploadedMedia),
      });
  };

  const sendMedia = async () => {
    if (media && media.file.size < 1600000) {
      onClose();
      const messageRef = await addDoc(colRef, {
        type: media.file.type.slice(0, 5),
        status: "uploading",
        sender: user?.uid,
        timeSent: serverTimestamp(),
        imageName: media.file.name,
        imageSize: media.file.size,
      });
      const mediaRef = sref(storage, `media/${messageRef.id}`);
      if (media) {
        const uploadMedia = uploadBytesResumable(mediaRef, media.file, {
          contentType: media.file.type,
          cacheControl: "private,max-age=345600,immutable",
          contentDisposition: `attachment; filename=${media?.file.name}`,
        });
        // setUpload(uploadMedia);
        uploadMedia.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          () => {
            setError({ upload: "failed", limit: null });
            updateDoc(messageRef, {
              status: "failed",
            });
          },
          () => {
            getDownloadURL(uploadMedia.snapshot.ref)
              .then((url) => {
                setError(null);
                updateDoc(messageRef, {
                  mediaURL: url,
                  status: "saved",
                });
              })
              .catch(() =>
                updateDoc(messageRef, {
                  status: "failed",
                })
              );
          }
        );
        uploadMedia.cancel();
      }
    }
  };

  const sendDocument = async () => {
    if (document && document.size < 1600000) {
      onClose();

      const messageRef = await addDoc(colRef, {
        type: "document",
        status: "uploading",
        sender: user?.uid,
        timeSent: serverTimestamp(),
        documentName: document.name,
        documentSize: document.size,
        documentType: document.type,
      });

      const chatDocumentRef = sref(storage, `ChatDocuments/${messageRef.id}`);
      if (document) {
        const uploadDocument = uploadBytesResumable(chatDocumentRef, document, {
          contentType: document.type,
          contentDisposition: `attachment; filename=${media?.file.name}`,
        });
        uploadDocument.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          () => {
            setError({ upload: "failed", limit: null });
            updateDoc(messageRef, {
              status: "failed",
            });
          },
          () => {
            getDownloadURL(uploadDocument.snapshot.ref)
              .then((url) => {
                setError(null);
                updateDoc(messageRef, {
                  documentURL: url,
                  status: "saved",
                });
              })
              .catch(() =>
                updateDoc(messageRef, {
                  status: "failed",
                })
              );
          }
        );
      }
      setDocument(null);
    }
  };

  return (
    <div>
      {!isOpen && (
        <IconButton
          aria-label='picker'
          size='sm'
          variant='ghost'
          rounded='full'
          icon={<PlusIcon color='#007affff' width={30} />}
          onClick={onOpen}
          mx='1'
        />
      )}
      {isOpen && (
        <Box
          as={SlideFade}
          in={isOpen}
          style={{
            zIndex: 1000,
            position: "absolute",
            bottom: 55,
            right: "auto",
            left: "auto",
          }}
          ref={ref}
          // mb={[0, 0, 10]}
          position='absolute'
          h='auto'
          w={["full", "full", "50%", "33%"]}>
          {document ? (
            <Box
              h='full'
              bgColor='white'
              boxShadow='md'
              borderRadius={10}
              overflow='hidden'
              mx='auto'
              w='95%'>
              <Flex w='full' justify='space-between'>
                <Button
                  onClick={() => {
                    setError(null);
                    setDocument(null);
                  }}
                  variant='ghost'
                  size='sm'
                  color='#007affff'
                  fontSize={14}>
                  Cancel
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  color='#007affff'
                  onClick={sendDocument}
                  fontSize={14}
                  isDisabled={error?.limit ? true : false}>
                  Send
                </Button>
              </Flex>
              {error?.limit ? (
                <Text fontSize={17} textAlign='center'>
                  {error.limit}
                </Text>
              ) : (
                <Stack>
                  <Text fontSize={16} textAlign='center'>
                    {document.name.slice(0, 30)}...
                  </Text>
                  <Text fontSize={16} textAlign='center'>
                    {document.type}
                  </Text>
                  <Text fontSize={16} textAlign='center'>
                    {prettyBytes(document.size)}
                  </Text>
                </Stack>
              )}
            </Box>
          ) : media ? (
            <Box
              // w="fit-content"
              // rounded="lg"
              m={1}
              // overflow="hidden"
              h='full'>
              <Flex
                w='full'
                justify='space-between'
                h='fit-content'
                my='1'
                bgColor='white'
                boxShadow='lg'
                rounded='xl'>
                <Button
                  onClick={() => {
                    setError(null);
                    setMedia(null);
                    URL.revokeObjectURL(media.URL);
                  }}
                  variant='ghost'
                  size='sm'
                  color='#007affff'
                  fontSize={14}
                  rounded='xl'>
                  Cancel
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  color='#007affff'
                  fontSize={14}
                  rounded='xl'
                  onClick={sendMedia}
                  isDisabled={error?.limit ? true : false}>
                  Send
                </Button>
              </Flex>
              <Box
                mx='auto'
                w='full'
                rounded='lg'
                overflow='hidden'
                h='full'
                boxShadow='2xl'>
                {error && (
                  <Text fontWeight={600} textAlign='center' color='#3c3c432d'>
                    {error.limit}
                  </Text>
                )}
                {media.file.type.slice(0, 5) === "image" ? (
                  <Image
                    alt='photo/video-prev'
                    src={media.URL}
                    loader={() => media.URL}
                    className='w-full h-full'
                    layout='responsive'
                    style={{ margin: "auto" }}
                    width={100}
                    height={100}
                  />
                ) : (
                  media.file.type.slice(0, 5) === "video" && (
                    <video
                      autoPlay
                      controls
                      controlsList='nodownload noremoteplayback'
                      src={media.URL}
                      width='100%'
                      height='auto'
                      style={{ margin: "auto" }}
                    />
                  )
                )}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                display={["block", "block", "grid"]}
                gridTemplateColumns='repeat(2,1fr)'
                gridTemplateRows='repeat(2,100px)'
                border='1px solid #74748014'
                cursor='pointer'
                bgColor='white'
                boxShadow='md'
                borderRadius={10}
                overflow='hidden'
                mx='auto'
                w='95%'>
                <Button
                  mx='auto'
                  as={GridItem}
                  colSpan={2}
                  w='full'
                  h={[10, 10, "auto"]}
                  leftIcon={<PhotoIcon color='#007affff' width={20} />}
                  borderBottom='1px solid #74748014'
                  borderRadius={0}
                  fontSize={17}
                  variant='ghost'
                  borderLeft='1px solid #74748014'
                  justifyContent={["start", "start", "center"]}
                  onClick={() => mediaRef?.current?.click()}>
                  Photo/Video
                </Button>
                <Input
                  ref={mediaRef}
                  hidden
                  multiple={true}
                  type='file'
                  accept='image/*,video/*'
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleMedia(e)
                  }
                />
                {/* <Button
                  mx="auto"
                  as={GridItem}
                  w="full"
                  h={[10, 10, "auto"]}
                  leftIcon={<CameraIcon color="#007affff" width={20} />}
                  borderBottom="1px solid #74748014"
                  borderRadius={0}
                  fontSize={17}
                  variant="ghost"
                  justifyContent={["start", "start", "center"]}
                >
                  Camera
                </Button> */}
                <Button
                  mx='auto'
                  colSpan={2}
                  as={GridItem}
                  w='full'
                  h={[10, 10, "auto"]}
                  leftIcon={<DocumentIcon color='#007affff' width={20} />}
                  // borderBottom="1px solid #74748014"
                  borderRadius={0}
                  fontSize={17}
                  variant='ghost'
                  justifyContent={["start", "start", "center"]}
                  onClick={() => documentRef?.current?.click()}>
                  Document
                </Button>
                <Input
                  ref={documentRef}
                  hidden
                  multiple={true}
                  type='file'
                  // accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDocuments(e)
                  }
                />
              </Box>
              {/* <Button
                display={["unset", "unset", "none"]}
                w="full"
                h="full"
                bgColor="white"
                border="1px solid #74748014"
                p="2"
                boxShadow="lg"
                onClick={onClose}
              >
                Cancel
              </Button> */}
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default PickerInterface;
