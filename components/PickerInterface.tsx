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
import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog/dist";
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
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { db, storage } from "../lib/firebase";
import { pickerVs } from "@lib/validations";
import { limitText } from "@lib/helpers";

interface PickerProps {
  isOpen: boolean;
  toggle: (state: boolean) => void;
  colRef: CollectionReference<DocumentData>;
  user?: User | null;
}

interface Values {
  documents?: File[];
  medias?: File[];
}
interface Errors {
  documents?: string;
  medias?: string;
}

interface State {
  values: Values;
  errors: Errors;
}

const PickerInterface = ({ isOpen, toggle, colRef, user }: PickerProps) => {
  const initialState: State = {
    values: { documents: undefined, medias: undefined },
    errors: {},
  };
  const [{ errors, values }, setState] = useState<State>(initialState);

  const handleDocuments = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    try {
      await pickerVs.validate({ documents: files });
      setState({ values: { documents: files }, errors: {} });
    } catch (err) {
      setState({ errors: { documents: "err", medias: undefined }, values: {} });
    }
  };

  // console.log(values, errors);

  const handleMedia = (e: ChangeEvent<HTMLInputElement>) => {};

  const sendMedia = async () => {};

  const sendDocument = async () => {
    // if (document && document.size < 1600000) {
    //   toggle(false);
    //   const messageRef = await addDoc(colRef, {
    //     type: "document",
    //     status: "uploading",
    //     sender: user?.uid,
    //     timeSent: serverTimestamp(),
    //     documentName: document.name,
    //     documentSize: document.size,
    //     documentType: document.type,
    //   });
    //   const chatDocumentRef = sref(storage, `ChatDocuments/${messageRef.id}`);
    //   if (document) {
    //     const uploadDocument = uploadBytesResumable(chatDocumentRef, document, {
    //       contentType: document.type,
    //       contentDisposition: `attachment; filename=${media?.file.name}`,
    //     });
    //     uploadDocument.on(
    //       "state_changed",
    //       (snapshot) => {
    //         const progress =
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         // setProgress(progress);
    //       },
    //       () => {
    //         // setError({ upload: "failed", limit: null });
    //         updateDoc(messageRef, {
    //           status: "failed",
    //         });
    //       },
    //       () => {
    //         getDownloadURL(uploadDocument.snapshot.ref)
    //           .then((url) => {
    //             // setError(null);
    //             updateDoc(messageRef, {
    //               documentURL: url,
    //               status: "saved",
    //             });
    //           })
    //           .catch(() =>
    //             updateDoc(messageRef, {
    //               status: "failed",
    //             })
    //           );
    //       }
    //     );
    //   }
    //   setDocument(null);
    // }
  };

  const page = values?.documents
    ? "document"
    : values?.medias
    ? "media"
    : "home";

  const renderPage: { [key: string]: ReactNode } = {
    home: (
      <HomePage handleMedia={handleMedia} handleDocuments={handleDocuments} />
    ),
    document: (
      <DocumentPage
        setState={setState}
        errors={errors}
        values={values}
        sendDocument={sendDocument}
      />
    ),
    media: <MediaPage />,
  };

  return (
    <>
      <button className='text-blue-500 ml-3 mr-1 ' onClick={() => toggle(true)}>
        <PlusIcon width={30} />
      </button>

      <Root open={isOpen} onOpenChange={toggle}>
        <Portal>
          <Overlay className='fixed bg-gray-800 opacity-60 z-40 inset-0 ' />
          <div className='fixed inset-0 z-50 overflow-hidden'>
            <div className='pointer-events-none fixed inset-x-2 md:right-5 md:left-auto bottom-2 md:bottom-10 flex'>
              <Content className='pointer-events-auto w-full bg-white rounded-xl p-4 shadow-xl'>
                {/* page */}
                {renderPage[page]}
              </Content>
            </div>
          </div>
        </Portal>
      </Root>
    </>
  );
};

const HomePage = ({ handleMedia, handleDocuments }: any) => {
  const documentRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);

  return (
    <div
      className='flex md:grid border p-4 border-neutral-200 w-full md:w-96 md:grid-cols-2 rounded-xl
     bg-white overflow-hidden h-36 md:h-36'>
      <button
        className='bg-white col-span-1 text-base flex h-full items-center justify-center w-full
      hover:opacity-40 border-neutral-400'
        onClick={() => mediaRef?.current?.click()}>
        <PhotoIcon color='#007affff' width={40} className='mr-2 ' />
        <h2>Photo/Video</h2>
      </button>
      <input
        ref={mediaRef}
        hidden
        multiple={true}
        type='file'
        accept='image/*,video/*'
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleMedia(e)}
      />

      <button
        className='bg-white col-span-1 flex h-full items-center justify-center w-full border-l
        hover:opacity-40 border-neutral-200'
        onClick={() => documentRef?.current?.click()}>
        <DocumentIcon color='#007affff' width={40} className='mr-2' />
        <h2>Document</h2>
      </button>
      <input
        ref={documentRef}
        hidden
        multiple={true}
        type='file'
        // accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleDocuments(e)}
      />
    </div>
  );
};

const MediaPage = () => {
  return (
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
            // setError(null);
            // setMedia(null);
            // URL.revokeObjectURL(media.URL);
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
          // onClick={sendMedia}
          // isDisabled={error?.limit ? true : false}
        >
          Send
        </Button>
      </Flex>
      {/* <Box
        mx='auto'
        w='full'
        rounded='lg'
        overflow='hidden'
        h='full'
        boxShadow='2xl'>
       
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
      </Box> */}
    </Box>
  );
};

const DocumentPage = ({
  setState,
  errors,
  values,
  sendDocument,
}: {
  documents?: File[];
  setState: Dispatch<SetStateAction<State>>;
  errors: Errors;
  values: Values;
  sendDocument: () => void;
}) => {
  const documents = values.documents;
  return (
    <>
      {documents && (
        <div className='bg-white border-neutral-200 w-full md:w-96'>
          <div className='flex w-full justify-between'>
            <button
              className='text-base text-blue-500 p-1'
              onClick={() => {
                setState({ errors: {}, values: {} });
              }}>
              Cancel
            </button>
            <p className='text-neutral-500'>{`${documents?.length} file${
              documents?.length > 1 ? "s" : ""
            }`}</p>
            <button
              className='text-base text-blue-500 p-1'
              onClick={sendDocument}
              disabled={errors?.documents ? true : false}>
              Send
            </button>
          </div>
          <div className=''>
            {documents?.slice(0, 3).map((document) => (
              <div className='text-center text-neutral-800 my-1 p-1 rounded-xl'>
                <h2 className='text-lg'>{limitText(document.name, 15)}</h2>
                <p className='text-sm'>{document.type}</p>
                <p className='text-base'>{prettyBytes(document.size)}</p>
              </div>
            ))}
          </div>
          {documents?.length > 2 && (
            <p className='text-center text-sm text-gray-400'>{`...and ${
              documents?.length - 2
            } more`}</p>
          )}
        </div>
      )}
    </>
  );
};

export default PickerInterface;
