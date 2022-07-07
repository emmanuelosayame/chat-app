import { AddIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useRef } from "react";

const ChatDrawer = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef<HTMLInputElement>(null);

  return (
    <Box display={["block","none","none"]} >
      <IconButton
        size="xs"
        variant='ghost'
        aria-label="drawer"
        icon={<AddIcon />}
        colorScheme="teal"
        onClick={onOpen}
      />
      <Drawer
        // isFullHeight={true}
        size='xs'
        isOpen={isOpen}
        placement="bottom"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent >
          <DrawerCloseButton colorScheme='messenger' />
          <DrawerHeader fontSize={14} textAlign='center'>
            New Chat
          </DrawerHeader>
          <DrawerBody>
              <Box>                
                <Input
                size='sm'
                  ref={firstField}
                  borderRadius={12}
                  variant='filled'
                  border="0"
                  bgColor='gray.200'
                  id="username"
                  placeholder="search"
                />
                <Box h='200' >hii</Box>
              </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ChatDrawer;
