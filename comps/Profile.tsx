import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
  useToast,
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
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import { debounce } from "lodash";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { auth, db, rdb, storage } from "../firebase/firebase";

const Profile = ({
  profileOnClose,
  userData,
  userNameSet,
  onClose,
  setUserNameSet,
}: any) => {
  const user = auth.currentUser;
  const [error, setError] = useState(false);
  const [userNameWarning, setUserNameWarning] = useState<boolean | string>(
    false
  );
  const uploadRef = useRef<HTMLInputElement | null>(null);
  // const [photoUploadFile, setPhotoUploadFile] = useState<File>();
  // console.log(photoUploadFile);
  const [photoURL, setPhotoURL] = useState<string>(userData?.photoURL);
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

  const profilesRef = sref(storage, `profilePhoto/${user?.uid}`);

  const photoChange = (photo: File | undefined) => {
    if (photo) {
      // console.log(photo)
      uploadBytes(profilesRef, photo)
        .then((snap) => {
          setError(false);
          getDownloadURL(snap.ref).then((photoURL) => setPhotoURL(photoURL));
        })
        .catch(() => setError(true));
    }
  };

  const handleUserNameChange = debounce(async (input) => {
    setUserNameWarning(false);
    if (input === userData?.userName) {
      setUserNameChange({ exists: undefined, value: input });
      return;
    }

    if (input.length < 4) {
      setUserNameWarning("cannot be less than 4");
      return;
    }
    if (input.length > 17) {
      setUserNameWarning("thats a little too long");
      return;
    }
    await getDocsFromServer(
      query(collection(db, "Users"), where("userName", "==", `${input}`))
    )
      .then((userName) => {
        setError(false);
        setUserNameChange({ exists: !userName.empty, value: input });
      })
      .catch(() => setError(true));
  }, 1000);

  const handleProfileChanges = () => {
    if (photoURL !== userData?.photoURL) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        photoURL: photoURL,
      });
    }

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
      userNameChange?.exists === false &&
      userNameChange.value.length >= 4 &&
      userNameChange.value.length < 17
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

  const toast = useToast();
  !userNameSet &&
    toast({
      position: "bottom",
      duration: 9000,
      render: () => (
        <Box
          borderRadius={20}
          bgColor="white"
          p="1"
          border="1px solid whitesmoke"
        >
          <Text textAlign="center" fontWeight={600}>
            username not set
          </Text>
          <Text textAlign="center" fontWeight={600} fontSize="15">
            setup username to get started
          </Text>
        </Box>
      ),
    });

  return (
    <Flex
      flexDirection="column"
      align="center"
      // w={["full", "full", "full", "full", "65%"]}
      w="full"
      bgColor="whitesmoke"
      my="5"
      borderRadius={10}
    >
      {/* {showToast} */}
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
          display={userNameSet ? ["flex", "flex", "flex","none"] : "none"}
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
        {photoURL ? (
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
              loader={() => `${photoURL}?w=${60}&q=${75}`}
              src={photoURL}
              width="100%"
              height="100%"
            />
          </Box>
        ) : (
          <Avatar mr="2" />
        )}
      </Flex>
      <Button
        variant="link"
        fontSize="15px"
        m="2"
        display="block"
        onClick={() => uploadRef?.current?.click()}
      >
        {userData?.photoURL ? "Change Profile" : "Add"} Photo
      </Button>
      <Input
        ref={uploadRef}
        hidden
        multiple={false}
        type="file"
        accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          photoChange(e.target?.files?.[0])
        }
      />
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
              focusBorderColor={userNameChange?.exists ? "#ff9500ff" : "gray"}
              pos="relative"
            />
            <Box>
              {error ? (
                <Text
                  fontSize={15}
                  color="#8e8e93ff"
                  borderRadius={8}
                  bgColor="#ffffffff"
                  p="1"
                  h="fit-content"
                  m="1"
                  w="fit-content"
                  pos="absolute"
                >
                  unable to connect
                </Text>
              ) : userNameChange?.exists === true ? (
                <Text
                  fontSize={17}
                  color="#ff9500ff"
                  borderRadius={8}
                  bgColor="#ffffffff"
                  px="1"
                  h="fit-content"
                  w="fit-content"
                  pos="absolute"
                >
                  taken
                </Text>
              ) : userNameWarning ? (
                <Text
                  fontSize={14}
                  color="#8e8e93ff"
                  borderRadius={16}
                  bgColor="#ffffffff"
                  px="2"
                  py="1"
                  h="fit-content"
                  m="1"
                  pos="absolute"
                >
                  {userNameWarning}
                </Text>
              ) : (
                userNameChange?.exists === false && (
                  <CheckCircleIcon width={30} color="green" />
                )
              )}
            </Box>
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
