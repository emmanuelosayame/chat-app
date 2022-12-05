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
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { auth, db, rdb, storage } from "../firebase";

const Profile = ({
  profileOpen,
  setProfileOpen,
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
  const [photoURL, setPhotoURL] = useState<string>(userData?.photoURL);
  const [photoPrev, setPhotoPrev] = useState<{
    URL: string | ArrayBuffer | null | undefined;
    file: File | null;
  }>({ URL: userData?.photoURL, file: null });

  const [name, setName] = useState<any>("");
  const [userName, setUserName] = useState<
    { exists: boolean | undefined; value: string } | undefined
  >({ exists: undefined, value: userData?.userName && userData?.userName });
  const [about, setAbout] = useState<any>(userData?.about && userData?.about);

  // console.log(photoPrev);

  useEffect(() => {
    userData?.photoURL && setPhotoURL(userData?.photoURL);
    userData?.name && setName(userData?.name);
    userData?.userName &&
      setUserName({ exists: undefined, value: userData?.userName });
    userData?.about && setAbout(userData?.about);
  }, [userData]);

  const photoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const photo = e?.target?.files?.[0];
    if (photo) {
      const photoRead = new FileReader();
      photoRead.readAsDataURL(photo);
      photoRead.onload = (event) => {
        setPhotoPrev({ URL: event.target?.result, file: photo });
      };
    }
  };

  const resizeImage = (file: File) => {
    return new Promise<any>((resolve) => {
      FileResizer.imageFileResizer(
        file,
        150,
        150,
        "WEBP",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  };

  const handleUserName = debounce(async (e) => {
    const input = e.toLowerCase();
    setUserNameWarning(false);
    if (input === userData?.userName) {
      setUserName({ exists: undefined, value: input });
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
        setUserName({ exists: !userName.empty, value: input });
      })
      .catch(() => setError(true));
  }, 1000);

  const handleProfileChanges = async () => {
    if (
      photoPrev.URL !== userData?.photoURL &&
      photoPrev.URL !== null &&
      photoPrev.file
    ) {
      const profilePhotoRef = sref(storage, `profilePhotos/${user?.uid}`);

      const optimizedPhoto =
        photoPrev.file.type === "image/webp"
          ? photoPrev.file
          : await resizeImage(photoPrev.file);
      // console.log(optimizedPhoto);
      uploadBytes(profilePhotoRef, optimizedPhoto, {
        cacheControl: "public,max-age=1000000",
      })
        .then((snap) => {
          setError(false);
          getDownloadURL(snap.ref).then((URL) => {
            // setPhotoURL(photoURL);
            updateDoc(doc(db, "Users", `${user?.uid}`), {
              photoURL: URL ? URL : null,
            });
          });
        })
        .catch(() => setError(true));
    }

    if (name !== userData?.name && name.length < 20) {
      const newNameRef = ref(rdb, `Users/${name?.toLowerCase() + user?.uid}`);
      const nameRef = ref(
        rdb,
        `Users/${userData?.name.toLowerCase() + user?.uid}`
      );
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        name: name,
      });
      remove(nameRef);
      set(newNameRef, {
        uid: user?.uid,
        name: name,
        userName: userName?.value ? userName?.value : null,
        photoURL: photoURL && photoURL !== "null" ? photoURL : null,
      });

      if (userData?.userName) {
        const userNameRef = ref(
          rdb,
          `Users/${userData?.userName.toLowerCase()}`
        );
        set(userNameRef, {
          uid: user?.uid,
          name: name,
          userName: userName?.value ? userName.value : null,
          photoURL: photoURL && photoURL !== "null" ? photoURL : null,
        });
      }
    }
    if (
      userName?.value !== userData.name &&
      userName?.exists === false &&
      userName.value.length >= 4 &&
      userName.value.length < 17
    ) {
      const newUserNameRef = ref(
        rdb,
        `Users/${userName?.value?.toLowerCase()}`
      );
      if (userData?.userName) {
        const userNameRef = ref(
          rdb,
          `Users/${userData?.userName.toLowerCase()}`
        );
        remove(userNameRef);
      }
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        userName: userName?.value,
      }).then(() => setUserNameSet(true));

      set(newUserNameRef, {
        uid: user?.uid,
        name: name ? name : user?.displayName,
        userName: userName.value ? userName.value : null,
        photoURL: photoURL && photoURL !== "null" ? photoURL : null,
      });
      const nameRef = ref(
        rdb,
        `Users/${userData?.name.toLowerCase() + user?.uid}`
      );
      set(nameRef, {
        uid: user?.uid,
        userName: userName.value ? userName.value : null,
        name: name ? name : user?.displayName,
        photoURL: photoURL && photoURL !== "null" ? photoURL : user?.photoURL,
      });
    }

    if (about !== userData.about) {
      updateDoc(doc(db, "Users", `${user?.uid}`), {
        about: about,
      });
    }
  };

  const toast = useToast();
  useEffect(() => {
    !userNameSet &&
      toast({
        position: "bottom",
        duration: 9000,
        render: () => (
          <Box
            borderRadius={20}
            bgColor='white'
            p='1'
            border='1px solid whitesmoke'>
            <Text textAlign='center' fontWeight={600}>
              username not set
            </Text>
            <Text textAlign='center' fontWeight={600} fontSize='15'>
              setup username to get started
            </Text>
          </Box>
        ),
      });
  }, []);

  return (
    <Flex
      flexDirection='column'
      align='center'
      display={profileOpen ? "flex" : ["none", "none", "none", "flex"]}
      ml={[0, 0, 0, 10]}
      w={["full", "full", "full", "60%", "65%"]}
      h='full'
      bgColor='whitesmoke'
      my={["5", "5", "auto"]}
      borderRadius={10}>
      <Flex justify='space-between' w='full'>
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
          display={userNameSet ? ["flex", "flex", "flex", "none"] : "none"}
          aria-label='close-setting-page'
          icon={<ChevronLeftIcon width={40} />}
          variant='ghost'
          m='2'
          size='sm'
          color='blue.300'
          borderRadius='15px'
          onClick={() => setProfileOpen(false)}
        />
        <Button
          aria-label='close-setting-page'
          // icon={<ChevronLeftIcon width={40} />}
          variant='ghost'
          // onClick={profileOnClose}
          // bgColor="white"
          // alignSelf="end"
          m='2'
          size='sm'
          color='blue.300'
          borderRadius='15px'
          onClick={() => {
            handleProfileChanges();
            userNameSet && setProfileOpen(false);
          }}>
          Save
        </Button>
      </Flex>

      <Flex mx='auto' mt={userNameSet ? "unset" : 3}>
        {photoPrev.URL && photoPrev.URL !== "null" ? (
          <Box
            borderRadius='50%'
            w='90px'
            h='90px'
            overflow='hidden'
            border='1px solid #3c3c432d'>
            <Image
              alt='userProfileImg'
              referrerPolicy='no-referrer'
              loader={() => `${photoPrev.URL}?w=${90}&q=${75}`}
              src={photoPrev.URL.toString()}
              className='w-full h-full'
              width={100}
              height={100}
            />
          </Box>
        ) : (
          <Avatar size='xl' />
        )}
      </Flex>
      <Button
        variant='link'
        fontSize='15px'
        m='2'
        display='block'
        onClick={() => uploadRef?.current?.click()}>
        {userData?.photoURL ? "Change Profile" : "Add"} Photo
      </Button>
      <Input
        ref={uploadRef}
        hidden
        multiple={false}
        type='file'
        accept='image/*'
        onChange={photoChange}
      />
      <Box
        my='1'
        //  color='#3c3c4399'
      >
        <Box>
          <Text textAlign='center' fontSize='18px' color='#3c3c434c	'>
            name
          </Text>
          <Input
            mx='5'
            w='90%'
            variant='flushed'
            aria-label='name'
            value={name}
            fontSize='20px'
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box>
          <Text textAlign='center' fontSize='18px' color='#3c3c434c	'>
            username
          </Text>
          <Flex>
            <Input
              mx='5'
              w='90%'
              variant='flushed'
              aria-label='userName'
              defaultValue={userData?.userName}
              onChange={(e) => {
                handleUserName(e.target.value);
              }}
              fontSize='20px'
              isInvalid={userName?.exists}
              focusBorderColor={userName?.exists ? "#ff9500ff" : "gray"}
              pos='relative'
            />
            <Box>
              {error ? (
                <Text
                  fontSize={15}
                  color='#8e8e93ff'
                  borderRadius={8}
                  bgColor='#ffffffff'
                  // p='1'
                  h='fit-content'
                  m='1'
                  w='fit-content'
                  pos='absolute'>
                  unable to connect
                </Text>
              ) : userName?.exists === true ? (
                <Text
                  fontSize={17}
                  color='#ff9500ff'
                  borderRadius={8}
                  bgColor='#ffffffff'
                  px='1'
                  h='fit-content'
                  w='fit-content'
                  pos='absolute'>
                  taken
                </Text>
              ) : userNameWarning ? (
                <Text
                  fontSize={14}
                  color='#8e8e93ff'
                  borderRadius={16}
                  bgColor='#ffffffff'
                  px='2'
                  py='1'
                  h='fit-content'
                  m='1'
                  pos='absolute'>
                  {userNameWarning}
                </Text>
              ) : (
                userName?.exists === false && (
                  <CheckCircleIcon width={30} color='green' />
                )
              )}
            </Box>
          </Flex>
        </Box>
        <Box mt='2'>
          <Text textAlign='center' fontSize='18px' color='#3c3c434c	'>
            about
          </Text>
          <Textarea
            mx='5'
            w='90%'
            sx={{
              "&::-webkit-scrollbar": {
                width: "4px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "4px",
                backgroundColor: "gray",
              },
            }}
            // rows={1}
            variant='flushed'
            aria-label='about'
            value={about}
            fontSize='19px'
            onChange={(e) => setAbout(e.target.value)}
            resize='none'
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default Profile;
