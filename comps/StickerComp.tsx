import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SlideFade,
  Text,
  useBoolean,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { ChangeEvent, useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { StickerIcon } from "./Icons";

const StickerComp = ({ onClose }: any) => {
  const ref = useRef<any>();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  useOutsideClick({ ref: ref, handler: onClose });
  const [stickerPrev, setStickerPrev] = useState<{
    URL: string | ArrayBuffer | null | undefined;
    img: File;
  } | null>(null);
  const [stickerPicker, setStickerPicker] = useBoolean(false);
  const [selectSticker, setSelectSticker] = useState<{
    state: Boolean;
    value: string | null;
  }>();

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

  const pickSticker = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e?.target.files?.[0];
    if (img && img?.size < 500000) {
      console.log("first");
      const imgRead = new FileReader();
      imgRead.readAsDataURL(img);
      imgRead.onload = (event) =>
        setStickerPrev({ URL: event.target?.result, img: img });
    }
  };

  return (
    <>
      <Flex
        flexDirection="column"
        position="relative"
        ref={ref}
        w="full"
        minH="250px"
        p="1"
      >
        <Box overflowY={stickerPicker ? "unset" : "auto"} w="full" h="full">
          {stickerPicker ? (
            <>
              <Flex justify="space-between">
                <Button
                  aria-label="cancel"
                  variant="ghost"
                  size="xs"
                  fontSize={15}
                  onClick={setStickerPicker.off}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="cancel"
                  variant="ghost"
                  size="xs"
                  fontSize={15}
                  isDisabled={stickerPrev?.img ? false : true}
                >
                  
                  Upload
                </Button>
              </Flex>

              <Flex justify="space-between" align="center" h="full" mx="auto">
                {!selectSticker?.state ? (
                  <Button
                    size="xs"
                    onClick={() =>
                      setSelectSticker({ state: true, value: null })
                    }
                    mx="auto"
                  >
                    {selectSticker?.value || "sticker type"}
                  </Button>
                ) : (
                  <Flex
                    flexDirection="column"
                    mx="auto"
                    maxH="200px"
                    overflowY="auto"
                    mb="10"
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
                {stickerPrev?.URL ? (
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
                      referrerPolicy="no-referrer"
                      loader={() => `${stickerPrev.URL}?w=${60}&q=${75}`}
                      src={stickerPrev?.URL?.toString()}
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
                      mx="5"
                      variant="link"
                      onClick={() => uploadRef.current?.click()}
                    >
                      Select Sticker
                    </Button>
                  </>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Text fontSize="15" color="#3c3c4399">
                Recent
              </Text>
              <Grid
                w="full"
                h="fit-content"
                gridTemplateColumns="repeat(auto-fill,minmax(80px,1fr))"
                rowGap={3}
                columnGap={2}
                gridAutoRows="80px"
              >
                <GridItem
                  rounded="17"
                  overflow="hidden"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="#000000ff"
                >
                  <Image
                    referrerPolicy="no-referrer"
                    loader={() =>
                      `https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2Fd05f5cc3-c6f8-48cc-9163-6b5d701cf2a4.webp?alt=media&token=1e1bd143-71e1-44ea-9d84-8216b3d45b80`
                    }
                    src="https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2Fd05f5cc3-c6f8-48cc-9163-6b5d701cf2a4.webp?alt=media&token=1e1bd143-71e1-44ea-9d84-8216b3d45b80"
                    width="100%"
                    height="100%"
                  />
                </GridItem>
                <GridItem
                  rounded="17"
                  overflow="hidden"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="#000000ff"
                >
                  <Image
                    referrerPolicy="no-referrer"
                    loader={() =>
                      `https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2F6a54ea36-5b5b-4574-95c0-859d80353293.webp?alt=media&token=013ce39a-6854-4734-914a-55993741f94d`
                    }
                    src="https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2F6a54ea36-5b5b-4574-95c0-859d80353293.webp?alt=media&token=013ce39a-6854-4734-914a-55993741f94d"
                    width="100%"
                    height="100%"
                  />
                </GridItem>
                <GridItem
                  rounded="17"
                  overflow="hidden"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="#000000ff"
                >
                  <Image
                    referrerPolicy="no-referrer"
                    loader={() =>
                      `https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2Fdc4e76bb-1584-4a65-8d14-9cbce3dd03ff.webp?alt=media&token=81b43513-dfb3-4f6f-8807-e5fa2e09849a`
                    }
                    src="https://firebasestorage.googleapis.com/v0/b/chatapp-levi.appspot.com/o/stickers%2Fdc4e76bb-1584-4a65-8d14-9cbce3dd03ff.webp?alt=media&token=81b43513-dfb3-4f6f-8807-e5fa2e09849a"
                    width="100%"
                    height="100%"
                  />
                </GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem> <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem> <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem> <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
                <GridItem>hii</GridItem>
              </Grid>
              <Text fontSize="15" color="#3c3c4399">
                Fav
              </Text>
              <Grid w="full"></Grid>

              <Flex
                position="absolute"
                bottom={0}
                bgColor="red"
                w="full"
                justify="center"
              >
                <Button
                  size="xs"
                  variant="link"
                  // onClick={() => uploadRef.current?.click()}
                  onClick={setStickerPicker.on}
                >
                  Upload
                </Button>
                <Button size="xs" variant="ghost">
                  Add
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default StickerComp;
