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
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { useGlobal } from "../context/GlobalContext";
import { } from "react-firebase-hooks/firestore";

const NewChatComp = ({ text, icon }: any) => {
  const { userData } = useGlobal();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [newChatInput, setnewChatInput] = useState<string>("");

  const startChat = async () => {
    
    if (
      newChatInput === userData?.emailName[0] ||
      newChatInput === userData?.emailName[1]
    )
      return;

    const recExist = await getDocs(query(
      collection(db, "Users"),
      where("emailName", "array-contains", `${newChatInput}`)
    ));

    if (!recExist.empty) {
      const recUID = recExist.docs.map((doc) => doc.id);
      console.log(recUID);

      // router.push(`/${recUID}`);
    }
    console.log("user null");
    // errRec(`invite ${newChatInput}`);

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
              <Input
                ref={inputRef}
                size="sm"
                variant="filled"
                type="text"
                borderRadius="12"
                placeholder="Search"
                bgColor="whitesmoke"
                _placeholder={{ color: "gray.300" }}
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
              <Flex p="1" onClick={startChat} cursor='pointer' >
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
