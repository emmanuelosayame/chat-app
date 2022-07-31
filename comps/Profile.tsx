import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { ref, remove, set, update } from "firebase/database";
import {
  collection,
  doc,
  getDocsFromServer,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import Image from "next/image";
import { useState } from "react";
import { auth, db, rdb } from "../firebase/firebase";

const Profile = ({
  profileOnClose,
  userData,
  userNameSet,
  onClose,
  setUserNameSet,
}: any) => {
  const user = auth.currentUser;
  const [error, setError] = useState(false);
  const [userNameWarning, setUserNameWarning] = useState<boolean>(false);
  const [nameChange, setNameChange] = useState<any>(
    userData?.name && userData?.name
  );
  const [userNameChange, setUserNameChange] = useState<
    { exists: boolean | undefined; value: string } | undefined
  >(undefined);
  const [aboutChange, setAboutChange] = useState<any>(
    userData?.about && userData?.about
  );

  const newNameRef = ref(rdb, `Users/${nameChange?.toLowerCase() + user?.uid}`);
  const nameRef = ref(rdb, `Users/${userData?.name.toLowerCase() + user?.uid}`);

  const handleUserNameChange = debounce(async (input) => {
    setUserNameWarning(false);
    if (input === userData?.userName) {
      setUserNameChange({ exists: undefined, value: input });
      return;
    }

    if (input.length < 4) {
      setUserNameWarning(true);
      return;
    }
    await getDocsFromServer(
      query(collection(db, "Users"), where("userName", "==", `${input}`))
    )
      .then((userName) => {
        setError(false);
        setUserNameChange({ exists: !userName.empty, value: input });
      })
      .catch((error) => setError(!!error));
  }, 1000);

  const handleProfileChanges = () => {
    if (nameChange !== userData?.name) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        name: nameChange,
      });
      remove(nameRef);
      set(newNameRef, {
        uid: user?.uid,
        name: nameChange,
        userName: user?.email,
      });
    }
    if (
      userNameChange?.value !== userData.name &&
      userNameChange?.exists === false
    ) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        userName: userNameChange?.value,
      });
    }

    if (aboutChange !== userData.about) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        about: aboutChange,
      });
    }
  };

  return (
    <Flex
      flexDirection="column"
      align="center"
      w={["full", "full", "50%", "65%"]}
      bgColor="whitesmoke"
      my="5"
      borderRadius={10}
    >
      <Flex justify="space-between" w="full">
        {/* <Button
          aria-label="close-setting-page"
          // icon={<ChevronLeftIcon width={40} />}
          variant="ghost"
          onClick={profileOnClose}
          alignSelf="start"
          // bgColor="white"
          m="2"
          size="sm"
          color="blue.300"
          borderRadius="15px"
        >
          Done
        </Button> */}
        <IconButton
          display={userNameSet ? "flex" : "none"}
          aria-label="close-setting-page"
          icon={<ChevronLeftIcon width={40} />}
          variant="ghost"
          // bgColor="white"
          m="2"
          size="sm"
          color="blue.300"
          borderRadius="15px"
          onClick={profileOnClose}
        />
        <Button
          aria-label="close-setting-page"
          // icon={<ChevronLeftIcon width={40} />}
          variant="ghost"
          // onClick={profileOnClose}
          // bgColor="white"
          // alignSelf="end"
          m="2"
          size="sm"
          color="blue.300"
          borderRadius="15px"
          onClick={() => {
            handleProfileChanges();
            userNameSet ? profileOnClose() : onClose();
            setUserNameSet(true);
          }}
        >
          Save
        </Button>
      </Flex>
      <Flex mx="auto" mt={userNameSet ? "unset" : 5}>
        {userData?.photoURL ? (
          <Box
            borderRadius="50%"
            w="90px"
            h="90px"
            overflow="hidden"
            border="1px solid #3c3c432d"
            mx="2"
          >
            <Image
              referrerPolicy="no-referrer"
              loader={() => userData?.photoURL}
              src={userData?.photoURL}
              width="100%"
              height="100%"
            />
          </Box>
        ) : (
          <Avatar mr="2" />
        )}
      </Flex>
      <Button variant="link" fontSize="15px" m="2" display="block">
        {userData?.photoURL ? "Change Profile" : "Add"} Photo
      </Button>
      <Box my="5" color="#3c3c4399">
        <Box>
          <Text textAlign="center" fontSize="18px" color="#3c3c434c	">
            name
          </Text>
          <Input
            mx="5"
            w="90%"
            variant="flushed"
            aria-label="name"
            value={nameChange}
            fontSize="22px"
            onChange={(e) => setNameChange(e.target.value)}
          />
        </Box>
        <Box>
          <Text textAlign="center" fontSize="18px" color="#3c3c434c	">
            username
          </Text>
          <Flex>
            <Input
              mx="5"
              w="90%"
              variant="flushed"
              aria-label="userName"
              defaultValue={userData?.userName}
              onChange={(e) => {
                handleUserNameChange(e.target.value);
              }}
              fontSize="22px"
              isInvalid={userNameChange?.exists}
              focusBorderColor={userNameChange?.exists ? "red.500" : "gray"}
            />
            {error ? (
              <Text
                fontSize={16}
                color="whitesmoke"
                borderRadius={10}
                bgColor="red.500"
                px="1"
                h="fit-content"
                m="1"
                fontWeight={600}
              >
                offline
              </Text>
            ) : userNameChange?.exists === true ? (
              <Text
                fontSize={17}
                color="red.500"
                borderRadius={10}
                bgColor="white"
                px="1"
                h="fit-content"
              >
                taken
              </Text>
            ) : userNameWarning ? (
              <Text
                fontSize={14}
                color="whitesmoke"
                borderRadius={20}
                bgColor="red.500"
                px="2"
                py="1"
                h="fit-content"
                m="1"
                // fontWeight={600}
              >
                cannot be less than 4 chars.
              </Text>
            ) : (
              userNameChange?.exists === false && (
                <CheckCircleIcon width={30} color="green" />
              )
            )}
          </Flex>
        </Box>
        <Box mt="10">
          <Text textAlign="center" fontSize="18px" color="#3c3c434c	">
            about
          </Text>
          <Textarea
            mx="5"
            w="90%"
            variant="flushed"
            aria-label="about"
            value={aboutChange}
            fontSize="22px"
            onChange={(e) => setAboutChange(e.target.value)}
            resize="none"
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default Profile;
