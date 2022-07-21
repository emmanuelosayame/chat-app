import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Toast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { auth, db } from "../firebase/firebase";

const NewChatComp = ({ userData, chats, text, icon, color }: any) => {
  const router = useRouter();
  const user = auth.currentUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newChatInput, setnewChatInput] = useState<string>("");

  const chatExist = (recId: string[]) =>
    !!chats?.data?.find(
      (doc: DocumentData | undefined) =>
        doc?.USID.filter((userId: string[] | undefined) => userId == recId)
          ?.length > 0
    );

  const startChat = async () => {
    if (
      !!chats.error ||
      newChatInput.length === 0 ||
      newChatInput === userData?.userName
    )
      return;
    const recExist = await getDocs(
      query(
        collection(db, "Users"),
        where("Uid", "array-contains", `${newChatInput}`)
      )
    );

    const recId = recExist.docs.map((doc) => doc.id);

    if (!recExist.empty && !chatExist(recId)) {
      await addDoc(collection(db, "chatGroup"), {
        USID: [`${user?.uid}`, `${recId}`],
        timeStamp: serverTimestamp(),
      });
      return;

      // router.push(`/${user}`)
    }

    return;
  };

  return (
    <>
      <Button
        aria-label="create-chat-button"
        variant="ghost"
        size="sm"
        mr={-3}
        leftIcon={icon}
        iconSpacing={0}
        // ref={btnRef}
        onClick={onOpen}
        color={color}
      >
        {text}
      </Button>
      <Modal
        onClose={onClose}
        // finalFocusRef={btnRef}
        initialFocusRef={inputRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderRadius={15} px="2" bgColor="whitesmoke" >
          <ModalHeader textAlign="center" fontSize="13">
            Start Chat
          </ModalHeader>
          <ModalCloseButton size="sm" color="blue.400" />

          <InputGroup px="5">
            <InputLeftElement children={<SearchIcon mb="1" ml="10" />} />
            <Input
              ref={inputRef}
              size="sm"
              variant="filled"
              type="text"
              borderRadius="12"
              placeholder="Search"
              bgColor="white"
              _placeholder={{ color: "gray" }}
              onChange={(e) => setnewChatInput(e.target.value)}
            />
          </InputGroup>

          <ModalBody>
            <Box>
              <Flex p="1">
                <Avatar size="sm" mr="5" />
                New Group
              </Flex>
              <Divider ml="10" w="90%" />
              <Flex p="1" onClick={startChat} cursor="pointer">
                <Avatar size="sm" mr="5" />
                Private Chat
              </Flex>
              <Flex fontSize={13} fontWeight={600} mt="3">
                All
              </Flex>
              <Divider />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChatComp;
