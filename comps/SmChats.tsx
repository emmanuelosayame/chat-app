import { DeleteIcon, PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";

const SmChats = () => {
    return (
      <Box pos="relative" w="100%" h='full' >
        <Flex bgColor="gray.300" py="1">
          <DeleteIcon mx="3" my="1" />
          <p>Archived</p>
        </Flex>
        <Flex flexDirection="column" pos="absolute" right={2} bottom={5}>
          <IconButton
            aria-label="a"
            size="sm"
            rounded="full"
            icon={<PhoneIcon />}
          />
          <IconButton
            aria-label="b"
            size="sm"
            rounded="full"
            icon={<SettingsIcon />}
            my="2"
          />
        </Flex>
        <Flex h="full" justify="center" align="center">
          <Text>start a new chat</Text>
        </Flex>
      </Box>
    );
}

export default SmChats;