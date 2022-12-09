import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog/dist";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { auth, db, storage } from "../lib/firebase";
import { ClockIcon, StarIcon } from "@heroicons/react/24/outline";
import { User } from "firebase/auth";

const Stickers = ({
  open,
  toggle,
  chatId,
  userData,
}: // stickerOnClose,
{
  open: boolean;
  toggle: (state: boolean) => void;
  chatId: string | string[] | undefined;
  userData: DocumentData | undefined;
  // stickerOnClose: () => void;
}) => {
  const user = auth.currentUser;
  const ref = useRef<any>();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [page, setPage] = useState("home");
  const [stickersStore, setStickersStore] = useState<DocumentData | null>(null);
  const [selectSticker, setSelectSticker] = useState<{
    state: Boolean;
    value: string | null;
  }>();

  const preview = stickerFile && URL.createObjectURL(stickerFile);

  // console.log(userData)
  const pickSticker = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e?.target.files?.[0];
    if (img && img?.size < 500000) {
      setStickerFile(img);
    }
  };

  const myStickers = undefined;
  const alreadyAdded = (ssid: string) => {
    if (myStickers) return false;
  };

  const addSticker = async (id: string, tag: string, stickerURL: string) => {
    if (!alreadyAdded(id)) {
      // await odb.stickers.add({
      //   id: id,
      //   tag: tag,
      //   date: new Date(),
      //   stickerURL: stickerURL,
      // });
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        stickers: arrayUnion({
          id: id,
          tag: tag,
          date: new Date(),
          stickerURL: stickerURL,
        }),
      });
    }
  };

  const sendSticker = (id: string, URL: string) => {
    addDoc(collection(db, "chatGroup", `${chatId}`, "messages"), {
      sender: user?.uid,
      stickerId: id,
      stickerURL: URL,
      timeSent: serverTimestamp(),
      type: "sticker",
    });
    // stickerOnClose();
  };

  return (
    <Root open={open} onOpenChange={toggle}>
      <Portal>
        <Overlay className='fixed bg-gray-800 opacity-60 z-40 inset-0 ' />
        <div className='fixed inset-0 z-50 overflow-hidden'>
          <div className='pointer-events-none fixed inset-x-2 md:right-auto w-full md:w-2/5 md:left-[50%] bottom-2 md:bottom-10 flex'>
            <Content className='pointer-events-auto w-full bg-white rounded-xl p-3 shadow-xl'>
              <div className='flex flex-col relative w-full rounded-xl bg-[#f2f2f7ff]'>
                <div className='overflow-y-auto'>
                  {page === "upload" ? (
                    <UploadPage setPage={setPage} user={user} />
                  ) : page == "store" ? (
                    <StorePage setPage={setPage} user={user} />
                  ) : (
                    <div className='p-1'>
                      <p className='text-base text-center text-blue-400'>
                        My Stickers
                      </p>
                      <p className='mx-auto text-[12px] text-center text-[#3c3c434c]'>
                        unless cache and browser data is cleared, stickers
                        remain offline.
                      </p>
                      <div className='flex items-center space-x-1'>
                        <button>
                          <ClockIcon width={25} />
                        </button>
                        <button>
                          <StarIcon width={25} />
                        </button>
                        <button onClick={() => setPage("store")}>Store</button>
                      </div>

                      <div>
                        <div className='w-full flex justify-center'>
                          <button
                            className='px-2 py-0.5 text-base text-white rounded-xl drop-shadow-md bg-blue-300'
                            onClick={() => setPage("upload")}>
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Content>
          </div>
        </div>
      </Portal>
    </Root>
  );
};

const UploadPage = ({
  setPage,
  user,
}: {
  setPage: (page: string) => void;
  user?: User | null;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const preview = file ? URL.createObjectURL(file) : null;

  const resizeImage = (file: File) => {
    return new Promise<any>((resolve) => {
      FileResizer.imageFileResizer(
        file,
        100,
        100,
        "WEBP",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  };

  const uploadSticker = async () => {
    if (file && file) {
      const stickerImg =
        file.type === "image/webp" ? file : await resizeImage(file);
      const fsid = addDoc(collection(db, "stickers"), {
        //  tag: selectSticker?.value,
        timeStamp: serverTimestamp(),
        //  star: userData?.admin ? true : false,
      });
      uploadBytes(
        sref(storage, `stickers/${(await fsid).id}.webp`),
        stickerImg,
        { cacheControl: "public,max-age=365000000,immutable" }
      )
        .then((snap) =>
          getDownloadURL(snap.ref).then(async (URL) => {
            updateDoc(doc(db, "stickers", `${(await fsid).id}`), {
              stickerURL: URL,
            });
            updateDoc(doc(db, "Users", `${user?.uid}`), {
              stickers: arrayUnion({
                id: (await fsid).id,
                // tag: selectSticker?.value ? selectSticker?.value : "others",
                date: new Date(),
                stickerURL: URL,
              }),
            });
            // await odb.stickers.add({
            //   id: (await fsid).id,
            //   tag: selectSticker?.value ? selectSticker?.value : "others",
            //   date: new Date(),
            //   stickerURL: URL,
            // });
          })
        )
        .catch(async () => deleteDoc(await fsid));
      setFile(null);
    }
  };

  return (
    <>
      <div className='flex w-full justify-between text-blue-400'>
        <button
          aria-label='cancel'
          className=''
          onClick={() => {
            setPage("home");
            setFile(null);
            preview && URL.revokeObjectURL(preview);
          }}>
          Cancel
        </button>
        <button
          aria-label='cancel'
          // disabled={selectSticker?.value && stickerFile ? false : true}
          onClick={uploadSticker}>
          Upload
        </button>
      </div>

      {/* <div className='flex justify-between items-center h-ull mx-auto'>
        {!selectSticker?.state ? (
          <button
            onClick={() => setSelectSticker({ state: true, value: null })}>
            {selectSticker?.value || "tag"}
          </button>
        ) : (
          <div className='flex flex-col h-[200px] mx-auto overflow-y-auto'>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Comrade",
                })
              }>
              Comrade
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Pawpaw",
                })
              }>
              Pawpaw
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Akii",
                })
              }>
              Akii
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Funny",
                })
              }>
              Funny
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Happy",
                })
              }>
              Happy
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() => setSelectSticker({ state: false, value: "Sad" })}>
              Sad
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Random",
                })
              }>
              Random
            </Button>
            <Button
              p='2'
              size='xs'
              variant='ghost'
              onClick={() =>
                setSelectSticker({
                  state: false,
                  value: "Others",
                })
              }>
              Others
            </Button>
          </div>
        )}
        {stickerFile && preview ? (
          <Flex
            borderRadius={15}
            w='100px'
            h='100px'
            overflow='hidden'
            border='1px solid #3c3c432d'
            mx='auto'
            align='center'
            justify='center'>
            <Image
              alt='sticker'
              referrerPolicy='no-referrer'
              loader={() => `${preview}?w=${60}&q=${75}`}
              src={preview}
              className='w-full h-full'
              width={100}
              height={100}
            />
          </Flex>
        ) : (
          <>
            <Input
              ref={uploadRef}
              hidden
              multiple={false}
              type='file'
              accept='image/*'
              onChange={pickSticker}
            />
            <Button
              size='xs'
              mx='auto'
              variant='link'
              onClick={() => uploadRef.current?.click()}>
              Select Sticker
            </Button>
          </>
        )}
      </div> */}
      <div className=''>
        <p className='text-[12px] text-[#3c3c4399]'>
          stickers uploaded would be available to the public
        </p>
      </div>
    </>
  );
};

const StorePage = ({
  setPage,
  user,
}: {
  setPage: (page: string) => void;
  user?: User | null;
}) => {
  const store: any[] = [];
  return (
    <>
      <div className='flex justify-between'>
        <button
          aria-label='cancel'
          className=''
          onClick={() => {
            setPage("home");
          }}>
          Cancel
        </button>
        <button
          aria-label='cancel'
          // disabled={selectSticker?.value && stickerFile ? false : true}
          onClick={() => {}}>
          Upload
        </button>
      </div>

      <div className='grid gap-4'>
        {store &&
          store?.map((sticker: any) => (
            <div key={sticker.id} className=''>
              {sticker.data().stickerURL && (
                <Image
                  alt='sticker'
                  referrerPolicy='no-referrer'
                  loader={() => `${sticker.data().stickerURL}?w=${60}&q=${75}`}
                  src={sticker.data().stickerURL}
                  className='w-full h-full'
                  width={100}
                  height={100}
                />
              )}

              <div className='flex absolute w-full h-full bg-[#00000090]'>
                {/* {alreadyAdded(sticker.id) ? (
                  <Text opacity={0.8} fontSize={15} color='white' mx='auto'>
                    Added
                  </Text>
                ) : (
                  <Text opacity={0.2} fontSize={15} color='white' mx='auto'>
                    Add sticker
                  </Text>
                )} */}
              </div>

              {sticker.data()?.star && (
                <div className='absolute right-1 top-1'>
                  <StarIcon width={15} color='#ffcc00b2' />
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Stickers;
