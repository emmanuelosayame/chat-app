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
  useDisclosure,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
// import { PencilAltIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase/firebase";

const ChatModal = ({ text, icon }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;
  const router = useRouter();
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const data = await getDoc(doc(db, "Users", `${user?.uid}`));
      setUserData(data.data());
    })();
  }, []);

  const startChat = async (e) => {
    e.preventDefault()
    const newChatInput = inputRef.current?.value;
    // if (newChatInput === userData?.username) return;
 
    const queryUser = query(
      collection(db, "Users"),
      where("emailName", "array-contains-any", [
        `${newChatInput}`,
        `${newChatInput}`,
      ])
    );
    const userExists = await getDocs(queryUser);

    // if (userNameExist) {
      const recUID = userExists.docs.map(
        (doc) => doc.id
      );
      console.log(recUID);

      // router.push(`/${recUID}`);
    // }
    console.log("user null");
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
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="13">
            Start Chat
          </ModalHeader>
          <ModalCloseButton size="sm" />

          <InputGroup px="3">
            <InputLeftElement children={<SearchIcon mb="1" ml="8" />} />
            <form onSubmit={startChat} >
              <Input
                onSubmit={startChat}
                ref={inputRef}
                size="sm"
                variant="filled"
                type="text"
                borderRadius="12"
                placeholder="Search"
                bgColor="whitesmoke"
                _placeholder={{ color: "gray.300" }}
              />
            </form>
          </InputGroup>

          <ModalBody>
            <Box>
              <Flex p="1">
                <Avatar size="sm" mr="5" />
                New Group
              </Flex>
              <Divider ml="10" w="90%" />
              <Flex p="1">
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

export default ChatModal;
