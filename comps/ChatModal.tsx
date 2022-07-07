import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const ChatModal = () => {
  const btnRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        aria-label="modal-button"
        mt={1}
        ref={btnRef}
        onClick={onOpen}
        size="sm"
      >
        Start Chat
      </Button>
      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
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
              size="sm"
              variant="filled"
              type="text"
              borderRadius="12"
              placeholder="Search"
              bgColor="whitesmoke"
              _placeholder={{ color: "gray.300" }}
            />
          </InputGroup>

          <ModalBody>
            <Box>
              <Flex p="1">
                <Avatar size="sm" mr="5" />
                New Group
              </Flex>
              <Divider ml="10" w='90%' />
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
