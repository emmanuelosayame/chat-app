import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Fade,
  Grid,
  GridItem,
  IconButton,
  ScaleFade,
  Slide,
  SlideFade,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  PlusIcon,
  CameraIcon,
  PhotographIcon,
  DocumentIcon,
  // PaperClipIcon,
} from "@heroicons/react/outline";
import { PaperClipIcon } from "@heroicons/react/solid";
import { ForwardRefExoticComponent, useRef } from "react";

const PickerInterface = ({ input }: { input: string }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef<any>(null);
  useOutsideClick({ ref: ref, handler: onClose });
  return (
    <>
      {!isOpen && (
        <IconButton
          aria-label="picker"
          size="sm"
          variant="ghost"
          rounded="full"
          icon={<PlusIcon color="#007affff" width={30} />}
          onClick={onOpen}
        />
      )}
      {isOpen && (
        <Box
          as={SlideFade}
          in={isOpen}
          style={{ zIndex: 100, position: "absolute", bottom: 5 }}
          ref={ref}
          mb={[0, 0, 10]}
          w={["full", "full", "50%", "33%"]}
          h="auto"
          py="1"
        >
          <Box
            display={["block", "block", "grid"]}
            gridTemplateColumns="repeat(2,1fr)"
            gridTemplateRows="repeat(2,100px)"
            bgColor="white"
            borderRadius={10}
            boxShadow="sm"
            overflow="hidden"
            my="2"
            border="1px solid #74748014"
            cursor="pointer"
          >
            <Button
              mx="auto"
              as={GridItem}
              w="full"
              h={[10, 10, "auto"]}
              leftIcon={<CameraIcon color="#007affff" width={20} />}
              borderBottom="1px solid #74748014"
              borderRadius={0}
              fontSize={17}
              variant="ghost"
              justifyContent={["start", "start", "center"]}
            >
              Camera
            </Button>
            <Button
              mx="auto"
              as={GridItem}
              w="full"
              h={[10, 10, "auto"]}
              leftIcon={<PhotographIcon color="#007affff" width={20} />}
              borderBottom="1px solid #74748014"
              borderRadius={0}
              fontSize={17}
              variant="ghost"
              borderLeft="1px solid #74748014"
              justifyContent={["start", "start", "center"]}
            >
              Photo/Video
            </Button>
            <Button
              mx="auto"
              colSpan={2}
              as={GridItem}
              w="full"
              h={[10, 10, "auto"]}
              leftIcon={<DocumentIcon color="#007affff" width={20} />}
              // borderBottom="1px solid #74748014"
              borderRadius={0}
              fontSize={17}
              variant="ghost"
              justifyContent={["start", "start", "center"]}
            >
              Document
            </Button>
          </Box>
          <Button
            display={["unset", "unset", "none"]}
            w="full"
            h="full"
            bgColor="white"
            border="1px solid #74748014"
            p="2"
            boxShadow="lg"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      )}
    </>
  );
};

export default PickerInterface;
