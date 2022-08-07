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
  PhotographIcon,
  DocumentIcon,
  // PaperClipIcon,
} from "@heroicons/react/outline";
import { PaperClipIcon } from "@heroicons/react/solid";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as sref,
  uploadBytesResumable,
} from "firebase/storage";
import prettyBytes from "pretty-bytes";
import {
  ChangeEvent,
  ForwardRefExoticComponent,
  useRef,
  useState,
} from "react";
import { db, storage } from "../firebase/firebase";

const PickerInterface = ({
  isOpen,
  onClose,
  onOpen,
  chatId,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  chatId: string | string[] | undefined;
  user: User | null;
}) => {
  const ref = useRef<any>(null);
  const documentRef = useRef<any>(null);
  useOutsideClick({ ref: ref, handler: onClose });

  const [document, setDocument] = useState<File | null>(null);
  const [documentUploadProgress, setDocumentUploadProgress] = useState<
    number | null
  >(null);
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

  const sendDocument = async () => {
    if (document && document.size < 1600000) {
      onClose();

      const messageRef = await addDoc(
        collection(db, "chatGroup", `${chatId}`, "messages"),
        {
          type: "Document",
          status: "uploading",
          sender: user?.uid,
          timeSent: serverTimestamp(),
          documentName: document.name,
          documentSize: document.size,
          documentType: document.type,
        }
      );
      const ChatDocumentRef = sref(storage, `ChatDocuments/${messageRef.id}`);
      if (document) {
        const uploadDocument = uploadBytesResumable(ChatDocumentRef, document);
        uploadDocument.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setDocumentUploadProgress(progress);
          },
          () => setError({ upload: "failed", limit: null }),
          () => {
            getDownloadURL(uploadDocument.snapshot.ref).then((url) => {
              setError(null);
              updateDoc(messageRef, {
                documentURL: url,
                status: "saved",
              });
            });
          }
        );
      }
      setDocument(null);
    }
  };

  return (
    <Box>
      {!isOpen && (
        <IconButton
          aria-label="picker"
          size="sm"
          variant="ghost"
          rounded="full"
          icon={<PlusIcon color="#007affff" width={30} />}
          onClick={onOpen}
          mx="1"
        />
      )}
      {isOpen && (
        <Box
          as={SlideFade}
          in={isOpen}
          style={{
            zIndex: 100,
            position: "absolute",
            bottom: 55,
            right: "auto",
            left: "auto",
          }}
          ref={ref}
          // mb={[0, 0, 10]}
          position="absolute"
          h="auto"
          w={["full", "full", "50%", "33%"]}
        >
          {document ? (
            <Box
              h="full"
              bgColor="white"
              boxShadow="md"
              borderRadius={10}
              overflow="hidden"
              mx="auto"
              w="95%"
            >
              <Flex w="full" justify="space-between">
                <Button
                  onClick={() => {
                    setError(null);
                    setDocument(null);
                  }}
                  variant="ghost"
                  size="sm"
                  color="#007affff"
                  fontSize={14}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  color="#007affff"
                  onClick={sendDocument}
                  fontSize={14}
                  isDisabled={error?.limit ? true : false}
                >
                  Send
                </Button>
              </Flex>
              {error?.limit ? (
                <Text fontSize={17} textAlign="center">
                  {error.limit}
                </Text>
              ) : (
                <Stack>
                  <Text fontSize={16} textAlign="center">
                    {document.name.slice(0, 30)}...
                  </Text>
                  <Text fontSize={16} textAlign="center">
                    {document.type}
                  </Text>
                  <Text fontSize={16} textAlign="center">
                    {prettyBytes(document.size)}
                  </Text>
                </Stack>
              )}
            </Box>
          ) : (
            <>
              <Box
                display={["block", "block", "grid"]}
                gridTemplateColumns="repeat(2,1fr)"
                gridTemplateRows="repeat(2,100px)"
                border="1px solid #74748014"
                cursor="pointer"
                bgColor="white"
                boxShadow="md"
                borderRadius={10}
                overflow="hidden"
                mx="auto"
                w="95%"
              >
                <Button
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
                </Button>
                <Button
                  mx="auto"
                  as={GridItem}
                  w="full"
                  h={[10, 10, "auto"]}
                  leftIcon={<PhotographIcon color="#007affff" width={20} />}
                  borderBottom="1px solid #74748014"
                  borderRadius={0}
                  fontSize={17}
                  variant="ghost"
                  borderLeft="1px solid #74748014"
                  justifyContent={["start", "start", "center"]}
                >
                  Photo/Video
                </Button>
                <Button
                  mx="auto"
                  colSpan={2}
                  as={GridItem}
                  w="full"
                  h={[10, 10, "auto"]}
                  leftIcon={<DocumentIcon color="#007affff" width={20} />}
                  // borderBottom="1px solid #74748014"
                  borderRadius={0}
                  fontSize={17}
                  variant="ghost"
                  justifyContent={["start", "start", "center"]}
                  onClick={() => documentRef?.current?.click()}
                >
                  Document
                </Button>
                <Input
                  ref={documentRef}
                  hidden
                  multiple={true}
                  type="file"
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
    </Box>
  );
};

export default PickerInterface;
