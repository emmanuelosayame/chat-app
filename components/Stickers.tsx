import { Root, Content } from "@radix-ui/react-dialog/dist";
import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../lib/firebase";
import {
  ClockIcon,
  StarIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { User } from "firebase/auth";
import { Sticker, UserData } from "types";
import { stickerVs } from "@lib/validations";
import { resizeImage } from "@lib/helpers";
import * as RadixSelect from "@radix-ui/react-select/dist";

interface StickersInterface {
  open: boolean;
  toggle: (state: boolean) => void;
  chatId?: string;
  userdata?: UserData;
}

interface UploadStickerProps {
  setPage: (page: string) => void;
  user?: User | null;
  userdata?: UserData;
}

interface FileState {
  file: File | null;
  error?: string;
}

const Stickers = ({ open, toggle, chatId, userdata }: StickersInterface) => {
  const user = auth.currentUser;

  const [page, setPage] = useState("my-stickers");
  const [store, setStore] = useState<Sticker[] | undefined>(undefined);

  const stickers =
    page === "my-stickers"
      ? userdata?.stickers
      : page === "recent"
      ? userdata?.stickers
      : undefined;

  useEffect(() => {
    if (page !== "store") return;
    const listener = onSnapshot(
      collection(db, "stickers") as CollectionReference<Omit<Sticker, "id">>,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStore(data);
      }
    );
    return () => {
      listener();
    };
  }, [page]);

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

  const alreadyAdded = (sid: string) =>
    !!userdata?.stickers?.some((sticker) => sticker.id === sid);

  const addToMyStickers = async (
    id: string,
    tag: string,
    stickerURL: string
  ) => {
    updateDoc(doc(db, "Users", `${user?.uid}`), {
      stickers: arrayUnion({
        id: id,
        tag: tag,
        date: new Date(),
        stickerURL: stickerURL,
      }),
    });
  };

  return (
    <Root open={open} onOpenChange={toggle}>
      <Content className='flex flex-col relative w-full bg-[#f2f2f7ff] h-64'>
        <div className=''>
          {page === "upload" ? (
            <UploadPage setPage={setPage} user={user} userdata={userdata} />
          ) : (
            <div className='p-1'>
              <p className='mx-auto text-[10px] md:text-[12px] text-center text-[#3c3c434c]'>
                unless cache and browser data is cleared, stickers remain
                offline.
              </p>
              <div className='flex items-center space-x-1'>
                <button
                  onClick={() => setPage("recent")}
                  className={`${
                    page === "recent" ? "text-blue-400" : "text-neutral-500"
                  }`}>
                  <ClockIcon width={25} />
                </button>
                <button
                  onClick={() => setPage("my-stickers")}
                  className={`${
                    page === "my-stickers"
                      ? "text-blue-400"
                      : "text-neutral-500"
                  }`}>
                  <StarIcon width={25} />
                </button>
                <button
                  onClick={() => setPage("store")}
                  className={`${
                    page === "store" ? "text-blue-400" : "text-neutral-500"
                  }`}>
                  <BuildingStorefrontIcon width={25} />
                </button>
              </div>
              <div
                className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2 overflow-y-auto 
              h-40 my-2'>
                {page === "store" ? (
                  <>
                    {store?.map((sticker) => {
                      const added = alreadyAdded(sticker.id);
                      return (
                        <div key={sticker.id} className='relative'>
                          {added && (
                            <div className='text-sm text-neutral-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                              added
                            </div>
                          )}
                          <Image
                            alt='sticker'
                            loader={() =>
                              `${sticker.stickerURL}?w=${100}&q=${75}`
                            }
                            src={sticker.stickerURL}
                            width={100}
                            height={100}
                            className={`rounded-md w-20 md:w-24 lg:w-28 bg-black  ${
                              added
                                ? "opacity-60"
                                : "cursor-pointer hover:opacity-60"
                            }`}
                            onClick={() => {
                              if (!added) {
                                addToMyStickers(
                                  sticker.id,
                                  sticker.tag,
                                  sticker.stickerURL
                                );
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {stickers?.map((sticker) => (
                      <div key={sticker.id}>
                        <Image
                          key={sticker.id}
                          alt='sticker'
                          loader={() =>
                            `${sticker.stickerURL}?w=${100}&q=${75}`
                          }
                          src={sticker.stickerURL}
                          width={100}
                          height={100}
                          className='rounded-md w-20 md:w-24 lg:w-28 bg-black cursor-pointer hover:opacity-60'
                          onClick={() =>
                            sendSticker(sticker.id, sticker.stickerURL)
                          }
                        />
                      </div>
                    ))}
                  </>
                )}
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
      </Content>
    </Root>
  );
};

const UploadPage = ({ setPage, user, userdata }: UploadStickerProps) => {
  const [state, setState] = useState<FileState>({
    file: null,
    error: undefined,
  });
  const [tag, setTag] = useState<string>();

  const preview = state.file ? URL.createObjectURL(state.file) : null;
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const pickSticker = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      await stickerVs.validate(file);
      setState({ file });
    } catch (err) {
      setState({ error: "error", file: null });
    }
  };

  const selectList = [
    { value: "funny", item: "Funny" },
    { value: "happy", item: "Happy" },
    { value: "sad", item: "Sad" },
    { value: "comrade", item: "Comrade" },
    { value: "random", item: "Random" },
  ];

  const uploadSticker = async () => {
    const file = state.file;
    if (!file) return;
    const webpImage =
      file.type === "image/webp" ? file : await resizeImage(file, 100, 100);
    try {
      const fsid = await addDoc(collection(db, "stickers"), {
        //  tag: selectSticker?.value,
        timeStamp: serverTimestamp(),
        //  star: userData?.admin ? true : false,
      });
      const uploadResult = await uploadBytes(
        sref(storage, `stickers/${(await fsid).id}.webp`),
        webpImage,
        {
          cacheControl: "public,max-age=365000000,immutable",
        }
      );
      const url = await getDownloadURL(uploadResult.ref);
      await updateDoc(doc(db, "stickers", `${fsid.id}`), {
        stickerURL: url,
      });
      await updateDoc(doc(db, "Users", `${user?.uid}`), {
        stickers: arrayUnion({
          id: fsid.id,
          // tag: selectSticker?.value ? selectSticker?.value : "others",
          date: new Date(),
          stickerURL: url,
        }),
      });
      setState({ file: null, error: undefined });
    } catch (err) {
      setState({ file: null, error: "upload failed" });
    }
  };

  return (
    <>
      <div className='flex w-full justify-between text-blue-400 py-1 px-3'>
        <button
          aria-label='cancel'
          className=''
          onClick={() => {
            setPage("recent");
            setState({ file: null, error: undefined });
            preview && URL.revokeObjectURL(preview);
          }}>
          Cancel
        </button>
        <p className='text-[12px] text-center text-neutral-400'>
          stickers uploaded would be available to the public
        </p>
        <button
          aria-label='cancel'
          disabled={!state.file}
          className='disabled:text-neutral-300'
          onClick={uploadSticker}>
          Upload
        </button>
      </div>

      <div className='overflow-y-auto p-2'>
        <div className='flex justify-center'>
          {!preview ? (
            <div className='w-44 h-44 rounded-lg bg-neutral-400' />
          ) : (
            <Image
              alt='preview'
              src={preview}
              width={100}
              height={100}
              className='w-44 h-44 rounded-lg bg-white'
            />
          )}
          <div className='ml-5 flex flex-col justify-center space-y-2'>
            <RadixSelect.Root
              // value={value}
              // defaultValue={"tag"}
              onValueChange={setTag}>
              <RadixSelect.Trigger
                className={`bg-neutral-400 text-white text-sm rounded-md outline-none py-0.5 px-2 flex justify-between items-center`}
                aria-label='tag'>
                <RadixSelect.Value
                  placeholder='select tag'
                  className='text-white text-sm'
                />
                <RadixSelect.Icon className='text-white ml-1 '>
                  <ChevronDownIcon width={25} />
                </RadixSelect.Icon>
              </RadixSelect.Trigger>
              {/* <RadixSelect.Portal> */}
              <RadixSelect.Content
                className={`shadow-lg bg-neutral-300 text-neutral-500 z-50 overflow-hidden rounded-lg`}>
                <RadixSelect.Viewport className=''>
                  {selectList.map((selectItem) => (
                    <RadixSelect.Item
                      key={selectItem.value}
                      value={selectItem.value}
                      className='py-1.5 px-5 hover:bg-blue-300 hover:text-white cursor-pointer text-base outline-none'>
                      <RadixSelect.ItemText>
                        {selectItem.item}
                      </RadixSelect.ItemText>
                      <RadixSelect.ItemIndicator />
                    </RadixSelect.Item>
                  ))}
                </RadixSelect.Viewport>
              </RadixSelect.Content>
              {/* </RadixSelect.Portal> */}
            </RadixSelect.Root>
            <input
              hidden
              type='file'
              accept='image/*'
              onChange={pickSticker}
              ref={uploadRef}
            />
            <button
              className='text-white rounded-lg text-base
             px-2 py-0.5 bg-blue-400 drop-shadow-md'
              onClick={() => {
                uploadRef.current?.click();
              }}>
              pick image
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stickers;
