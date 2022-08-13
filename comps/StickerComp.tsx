import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Text,
  useBoolean,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { auth, db, storage } from "../firebase";
import { StickerIcon } from "./Icons";
import { useLiveQuery } from "dexie-react-hooks";
import { odb } from "./OfflineDB";
import { StarIcon } from "@heroicons/react/solid";

const StickerComp = ({
  onClose,
  chatId,
  userData,
}: // stickerOnClose,
{
  onClose: () => void;
  chatId: string | string[] | undefined;
  userData: DocumentData | undefined;
  // stickerOnClose: () => void;
}) => {
  const user = auth.currentUser;
  const ref = useRef<any>();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  useOutsideClick({ ref: ref, handler: onClose });
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [uploadPage, setUploadPage] = useBoolean(false);
  const [storePage, setStorePage] = useBoolean(false);
  const [stickersStore, setStickersStore] = useState<DocumentData | null>(null);
  const [selectSticker, setSelectSticker] = useState<{
    state: Boolean;
    value: string | null;
  }>();

  const preview = stickerFile && URL.createObjectURL(stickerFile);

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
  // console.log(userData)
  const pickSticker = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e?.target.files?.[0];
    if (img && img?.size < 500000) {
      setStickerFile(img);
    }
  };

  const myStickers = useLiveQuery(() => odb.stickers.toArray());

  const alreadyAdded = (ssid: string) => {
    if (myStickers) return !!myStickers.find((msid) => msid.id === ssid);
  };

  useEffect(() => {
    if (storePage)
      (async () => {
        onSnapshot(collection(db, "stickers"), (snapshot) => {
          setStickersStore(snapshot.docs);
        });
      })();
  }, [storePage]);

  // console.log(stickersStore?.map((d) => d.data()));

  useEffect(() => {
    if (myStickers && myStickers?.length < 1) {
      (async () => {
        // const userData = await getDoc(doc(db, "Users", `${user?.uid}`));
        if (userData?.stickers)
          await odb.stickers.bulkAdd(userData.data()?.stickers);
      })();
    }
  }, []);

  const uploadSticker = async () => {
    if (stickerFile && stickerFile) {
      const stickerImg =
        stickerFile.type === "image/webp"
          ? stickerFile
          : await resizeImage(stickerFile);
      const fsid = addDoc(collection(db, "comStickers"), {
        tag: selectSticker?.value,
        timeStamp: serverTimestamp(),
        star: userData?.admin ? true : false,
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
                tag: selectSticker?.value ? selectSticker?.value : "others",
                date: new Date(),
                stickerURL: URL,
              }),
            });
            await odb.stickers.add({
              id: (await fsid).id,
              tag: selectSticker?.value ? selectSticker?.value : "others",
              date: new Date(),
              stickerURL: URL,
            });
          })
        )
        .catch(async () => deleteDoc(await fsid));
      setUploadPage.off();
    }
  };

  const addSticker = async (id: string, tag: string, stickerURL: string) => {
    if (!alreadyAdded(id)) {
      await odb.stickers.add({
        id: id,
        tag: tag,
        date: new Date(),
        stickerURL: stickerURL,
      });
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
    <>
      <Flex
        flexDirection="column"
        position="relative"
        ref={ref}
        w="full"
        minH="250px"
        py="1"
        px="2"
      >
        <Box overflowY={uploadPage ? "unset" : "auto"} w="full" h="full">
          {uploadPage ? (
            <>
              <Flex justify="space-between">
                <Button
                  aria-label="cancel"
                  // variant="ghost"
                  rounded="lg"
                  size="xs"
                  fontSize={15}
                  color="#8e8e93ff"
                  onClick={() => {
                    setUploadPage.off();
                    setStickerFile(null);
                    preview && URL.revokeObjectURL(preview);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="cancel"
                  rounded="lg"
                  size="xs"
                  fontSize={15}
                  isDisabled={
                    selectSticker?.value && stickerFile ? false : true
                  }
                  onClick={uploadSticker}
                >
                  Upload
                </Button>
              </Flex>

              <Flex justify="space-between" align="center" h="full" mx="auto">
                {!selectSticker?.state ? (
                  <Button
                    size="md"
                    onClick={() =>
                      setSelectSticker({ state: true, value: null })
                    }
                    mx="auto"
                    rounded="2xl"
                    color="#3c3c4399"
                  >
                    {selectSticker?.value || "tag"}
                  </Button>
                ) : (
                  <Flex
                    flexDirection="column"
                    maxH="200px"
                    overflowY="auto"
                    mb="10"
                    mx="auto"
                    sx={{
                      "&::-webkit-scrollbar": {
                        width: "4px",
                        backgroundColor: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        borderRadius: "4px",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Comrade" })
                      }
                    >
                      Comrade
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Pawpaw" })
                      }
                    >
                      Pawpaw
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Akii" })
                      }
                    >
                      Akii
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Funny" })
                      }
                    >
                      Funny
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Happy" })
                      }
                    >
                      Happy
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Sad" })
                      }
                    >
                      Sad
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Random" })
                      }
                    >
                      Random
                    </Button>
                    <Button
                      p="2"
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setSelectSticker({ state: false, value: "Others" })
                      }
                    >
                      Others
                    </Button>
                  </Flex>
                )}
                {stickerFile && preview ? (
                  <Flex
                    borderRadius={15}
                    w="100px"
                    h="100px"
                    overflow="hidden"
                    border="1px solid #3c3c432d"
                    mx="auto"
                    align="center"
                    justify="center"
                  >
                    <Image
                    alt="sticker"
                      referrerPolicy="no-referrer"
                      loader={() => `${preview}?w=${60}&q=${75}`}
                      src={preview}
                      width="100%"
                      height="100%"
                    />
                  </Flex>
                ) : (
                  <>
                    <Input
                      ref={uploadRef}
                      hidden
                      multiple={false}
                      type="file"
                      accept="image/*"
                      onChange={pickSticker}
                    />
                    <Button
                      size="xs"
                      mx="auto"
                      variant="link"
                      onClick={() => uploadRef.current?.click()}
                    >
                      Select Sticker
                    </Button>
                  </>
                )}
              </Flex>
              <Box
                position="absolute"
                bottom={0}
                w="full"
                fontSize={13}
                color="#3c3c4399"
                textAlign="center"
              >
                <Text lineHeight={0.6}>
                  stickers uploaded would be available to the public
                </Text>
                be sure to check the store before uploading new stickers
              </Box>
            </>
          ) : storePage ? (
            <>
              <Flex justify="space-between">
                <Button
                  aria-label="cancel"
                  rounded="lg"
                  size="xs"
                  fontSize={15}
                  onClick={setStorePage.off}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="cancel"
                  rounded="lg"
                  size="xs"
                  fontSize={15}
                  onClick={() => {
                    setStorePage.off();
                  }}
                >
                  Done
                </Button>
              </Flex>

              <Grid
                w="full"
                h="fit-content"
                gridTemplateColumns="repeat(auto-fill,minmax(80px,1fr))"
                rowGap={3}
                columnGap={2}
                gridAutoRows="80px"
                mt={3}
              >
                {stickersStore &&
                  stickersStore?.map((sticker: DocumentData) => (
                    <GridItem
                      rounded="17"
                      overflow="hidden"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bgColor="#000000ff"
                      key={sticker.id}
                      position="relative"
                      cursor={alreadyAdded(sticker.id) ? "unset" : "pointer"}
                      filter="auto"
                      blur={alreadyAdded(sticker.id) ? "0.04rem" : "unset"}
                      brightness={alreadyAdded(sticker.id) ? "40%" : "unset"}
                      role="group"
                      onClick={() =>
                        addSticker(
                          sticker.id,
                          sticker.data().tag,
                          sticker.data().stickerURL
                        )
                      }
                    >
                      {sticker.data().stickerURL && (
                        <Image
                        alt="sticker"
                          referrerPolicy="no-referrer"
                          loader={() =>
                            `${sticker.data().stickerURL}?w=${60}&q=${75}`
                          }
                          src={sticker.data().stickerURL}
                          width="100%"
                          height="100%"
                        />
                      )}

                      <Flex
                        display="none"
                        position="absolute"
                        align="center"
                        w="full"
                        h="full"
                        bgColor="#00000090"
                        _groupHover={{ display: "flex" }}
                      >
                        {alreadyAdded(sticker.id) ? (
                          <Text
                            opacity={0.8}
                            fontSize={15}
                            color="white"
                            mx="auto"
                          >
                            Added
                          </Text>
                        ) : (
                          <Text
                            opacity={0.2}
                            fontSize={15}
                            color="white"
                            mx="auto"
                          >
                            Add sticker
                          </Text>
                        )}
                      </Flex>

                      {sticker.data()?.star && (
                        <Box position="absolute" right={1} top={1}>
                          <StarIcon width={15} color="#ffcc00b2" />
                        </Box>
                      )}
                    </GridItem>
                  ))}
              </Grid>
            </>
          ) : (
            <>
              <Text fontSize="15" m="1" color="#3c3c43b0">
                My Stickers
              </Text>
              <Grid
                w="full"
                h="fit-content"
                gridTemplateColumns="repeat(auto-fill,minmax(80px,1fr))"
                rowGap={3}
                columnGap={2}
                gridAutoRows="80px"
              >
                {myStickers &&
                  myStickers?.map((sticker) => (
                    <GridItem
                      rounded="17"
                      overflow="hidden"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bgColor="#000000ff"
                      key={sticker.id}
                      cursor="pointer"
                      onClick={() =>
                        sendSticker(sticker.id, sticker.stickerURL)
                      }
                    >
                      <Image
                      alt="sticker"
                        referrerPolicy="no-referrer"
                        loader={() => `${sticker.stickerURL}?w=${60}&q=${75}`}
                        src={sticker.stickerURL}
                        width="100%"
                        height="100%"
                      />
                    </GridItem>
                  ))}
              </Grid>

              <Box position="absolute" bottom={0} w="full">
                <Text mx="auto" w="fit-content" fontSize={12} color="#3c3c434c">
                  unless cache and browser data is cleared, stickers remain
                  offline.
                </Text>
                <Box mx="auto" w="fit-content">
                  <Button size="xs" variant="link" onClick={setUploadPage.on}>
                    Upload
                  </Button>
                  <Button
                    size="xs"
                    mx="1"
                    variant="ghost"
                    onClick={setStorePage.on}
                  >
                    Store
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default StickerComp;
