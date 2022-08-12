import { Box, Flex, Link, Progress, Text } from "@chakra-ui/react";
import { ClockIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import {
  SpinnerDotted,
  SpinnerCircular,
  SpinnerRound,
  SpinnerRomb,
  SpinnerDiamond,
} from "spinners-react";
import { auth } from "../firebase/firebase";

const Message = ({
  content,
  docUploadProgress,
}: {
  content: DocumentData;
  docUploadProgress?: number | undefined;
}) => {
  const user = auth.currentUser;
  const time =
    !!content.timeSent &&
    content.timeSent?.toDate().toLocaleTimeString("en", { timeStyle: "short" });
  const messageStyle = (userVal: string, recVal: string) => {
    if (!content.sender) return userVal;
    if (content.sender === user?.uid) {
      return userVal;
    } else return recVal;
  };

  return (
    <>
      {content.type === "sticker" ? (
        <Box alignSelf={messageStyle("end", "start")} maxWidth="100px" m="1">
          <Image
            referrerPolicy="no-referrer"
            alt="stickerImg"
            loader={() => `${content.stickerURL}?w=${100}&q=${75}`}
            src={content.stickerURL}
            width="100px"
            height="100px"
            style={{
              // zIndex: -1,
              backgroundColor: "#000000ff",
              borderRadius: 20,
            }}
          />
          <Box
            // mt="0.5"
            p="1"
            rounded="lg"
            w="fit-content"
            mx="auto"
            alignSelf="end"
            fontSize={9}
            fontWeight={500}
            bgColor={messageStyle("#5ac8faff", "#78788028")}
            color={messageStyle("gray.50", "gray")}
          >
            {content.timeSent ? (
              time
            ) : (
              <Box>
                <ClockIcon width={10} />
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Flex
          flexDirection="column"
          alignSelf={messageStyle("end", "start")}
          bgColor={messageStyle("#5ac8faff", "#78788028")}
          h="auto"
          borderRadius={12}
          m="1"
          maxW="350px"
        >
          {content.type === "image" ? (
            <Box
              alignSelf={messageStyle("end", "start")}
              mx="1"
              mt="1"
              mb="1"
              w="330px"
              display="block"
            >
              {(content.photoURL || content.mediaURL) && (
                <Image
                  referrerPolicy="no-referrer"
                  alt="captureImg"
                  loader={() => `${content.photoURL || content.mediaURL}`}
                  src={content.photoURL || content.mediaURL}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  style={{
                    // zIndex: -1,
                    backgroundColor: "#000000ff",
                    borderRadius: 10,
                    // maxWidth: "350px",
                  }}
                />
              )}
            </Box>
          ) : content.type === "video" ? (
            <Box maxW="330px" p="1">
              {content.status === "saved" ? (
                <video
                  controls
                  src={content.mediaURL}
                  style={{ borderRadius: 10 }}
                />
              ) : (
                <SpinnerRound color="#7676801e" />
              )}
            </Box>
          ) : content.type === "document" ? (
            <Flex
              flexDirection="column"
              align="center"
              color={messageStyle("#f2f2f7ff", "#3c3c4399")}
              m={1.5}
            >
              <Text fontSize={[14, 15, 16]} fontWeight={600}>
                {content.documentName.slice(0, 15)}
              </Text>
              <Text fontSize={13}>{content.documentType}</Text>
              <Text fontSize={13}>{prettyBytes(content.documentSize)}</Text>
              {content.status === "uploading" ? (
                <Box w="50px" opacity={0.5} my="1">
                  <Progress
                    hasStripe
                    rounded="full"
                    value={docUploadProgress}
                    size="xs"
                    colorScheme="gray"
                  />
                </Box>
              ) : (
                <Link
                  href={content.documentURL}
                  _hover={{ bgColor: "transparent", opacity: 0.5 }}
                >
                  <CloudDownloadIcon width={30} />
                </Link>
              )}
            </Flex>
          ) : (
            <Box
              fontSize={[14, 15, 16]}
              fontWeight={600}
              color={messageStyle("#f2f2f7ff", "#3c3c4399")}
              maxW="300px"
              flexDirection="column"
              mx="2"
              my="0.25rem"
              // minW="70px"
              lineHeight={1}
              // display="inline-block"
            >
              {content.text}
              <Box
                h="auto"
                // alignSelf="end"
                ml={1.5}
                pt={1.5}
                float="right"
                w="fit-content"
                fontSize={10}
                fontWeight={500}
                color={messageStyle("gray.50", "gray")}
                // p
                // mb="0"
                // display="inline"
              >
                {content.timeSent ? time : <ClockIcon style={{}} width={10} />}
              </Box>
            </Box>
          )}
          {content.type !== "text" && content.type && (
            <Box
              h="auto"
              alignSelf="end"
              mx={1.5}
              pb={1}
              // float="right"
              w="fit-content"
              fontSize={11}
              fontWeight={500}
              color={messageStyle("gray.50", "gray")}
              // p
              // mb="0"
              // display="inline"
            >
              {content.timeSent ? time : <ClockIcon style={{}} width={10} />}
            </Box>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
