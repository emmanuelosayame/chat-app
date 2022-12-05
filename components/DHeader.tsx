import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { CheckBadgeIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const DHeader = ({ userData, accountOnClose, onClose, userNameSet }: any) => {
  return (
    <>
      <div className='h-auto'>
        {!!userData?.photoURL && userData?.photoURL !== "null" ? (
          <Box
            rounded='full'
            w='60px'
            h='60px'
            overflow='hidden'
            border='1px solid #3c3c432d'
            mx='2'>
            <Image
              alt='userProfileImg'
              referrerPolicy='no-referrer'
              loader={() => `${userData?.photoURL}?w=${60}&q=${75}`}
              src={userData?.photoURL}
              className='w-full h-full'
              width={100}
              height={100}
            />
          </Box>
        ) : (
          <Avatar mr='2' size='sm' />
        )}
        <Box>
          {userData?.name ? (
            <Text fontSize={15} fontWeight={600}>
              {userData?.name}
            </Text>
          ) : (
            <Text opacity={0}>name</Text>
          )}
          <Box display='flex'>
            {userData?.userName ? (
              <Text fontWeight='thin' color='#3c3c4399' fontSize='sm' mr='1'>
                {userData?.userName}
              </Text>
            ) : (
              <Text opacity={0}>name</Text>
            )}
            {userData?.verified && (
              <CheckBadgeIcon fill='#007affff' width={20} />
            )}
          </Box>
        </Box>
      </div>

      <Button
        display={userNameSet ? "block" : "none"}
        onClick={() => {
          accountOnClose();
          onClose();
        }}
        color='#007affff'
        borderRadius={["15px", "19px"]}
        variant='outline'
        bgColor='transparent'
        _active={{ bgColor: "transparent" }}
        _hover={{ bgColor: "transparent" }}
        fontSize={[0, 12, 16, 17]}
        m='1'
        size={["sm", "md", "md"]}
        textAlign='center'
        w='fit-content'>
        <ChevronUpIcon height={20} />
        <Text display={["none", "block", "block"]} mx='-2'>
          Chats
        </Text>
      </Button>
    </>
  );
};

export default DHeader;
