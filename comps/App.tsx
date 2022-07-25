import type { NextPage } from "next";
import { Box, Flex, IconButton, Text, useMediaQuery } from "@chakra-ui/react";
import Header from "../comps/Header";
import NewChatComp from "../comps/NewChat";
import { PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { ArchiveIcon, PencilAltIcon } from "@heroicons/react/outline";
import SmChats from "../comps/SmChats";
import { ReactNode, useEffect } from "react";
import { useAuthUser } from "@react-query-firebase/auth";
import { auth, db, rdb } from "../firebase/firebase";
import { SpinnerDotted } from "spinners-react";
import {
  collection,
  doc,
  DocumentData,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";
import Settings from "./Settings";
import {
  useCollectionData,
  useDocumentData,
  useCollection,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { ref, set } from "firebase/database";

const View = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = auth.currentUser;
  const chatsQuery = query(
    collection(db, "chatGroup"),
    where("USID", "array-contains", `${user?.uid}`),
    orderBy("timeStamp", "desc")
  );
  const userRef = doc(db, "Users", `${user?.uid}`);
  const [chats] = useCollection(chatsQuery);
  const mappedChats = chats?.docs.map((chat: DocumentData | undefined) => {
    const [recId] = chat
      ?.data()
      .USID.filter((id: DocumentData | undefined) => id !== user?.uid);
    return { chatId: chat?.id, recId };
  });
  const [userData] = useDocumentData(userRef);
  const usersRef = ref(rdb, `Users/${user?.displayName?.toLowerCase()}`);

  useEffect(() => {
    if (user) {
      UpdateUserData();
    }
  }, [user]);
  // remember to wrap async code in useeffect

  const UpdateUserData = async () => {
    setDoc(
      doc(db, "Users", `${user?.uid}`),
      {
        Uid: [`${user?.displayName}`, `${user?.email}`],
        userName: `${user?.email}`,
        name: `${user?.displayName}`,
        photoURL: user?.photoURL,
      },
      { merge: true }
    );

    set(usersRef, {
      uid: user?.uid,
      name: user?.displayName,
      userName: user?.email,
    });
  };

  const responsiveLayout = (chatPage: string, noChatPage: string) => {
    if (!!router.query?.chat) return chatPage;
    else return noChatPage;
  };

  return (
    <Flex
      h="100vh"
      w="full"
      bgColor="whitesmoke"
      pos="fixed"
      maxW="-moz-initial"
      mx="auto"
      right="0"
      left="0"
    >
      <Box
        display={[
          responsiveLayout("none", "block"),
          responsiveLayout("none", "block"),
          "block",
        ]}
        w={["full", "full", "45%", "35%", "30%"]}
        position="relative"
      >
        <Box
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
              backgroundColor: "blue.50",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "18px",
              backgroundColor: "blue.100",
            },
          }}
          w="full"
          h="full"
          overflowY="scroll"
          // borderRight={["none", "none", "Scrollbar"]}
          // // borderRightColor="orange.300"
          // borderRightWidth="2px"
          // borderRightColor="red"
        >
          <Header>
            <NewChatComp
              userData={userData}
              mappedChats={mappedChats}
              icon={<PencilAltIcon width={22} />}
              color="blue.400"
            />
            <Settings userData={userData} />
          </Header>
          <SmChats>
            {!chats?.empty ? (
              <Box>
                {mappedChats?.map((chat: DocumentData | undefined) => {
                  return (
                    <Chat
                      key={chat?.chatId}
                      chatId={chat?.chatId}
                      recId={chat?.recId}
                    />
                  );
                })}
              </Box>
            ) : (
              <Flex h="full" justify="center" align="center">
                <NewChatComp
                  userData={userData}
                  mappedChats={mappedChats}
                  text="Start Chat"
                />
              </Flex>
            )}
          </SmChats>
        </Box>
      </Box>
      {/* next */}
      <Box
        h="full"
        bgColor="whiteAlpha.700"
        w="full"
        display={[
          responsiveLayout("block", "none"),
          responsiveLayout("block", "none"),
          "block",
        ]}
        pos="relative"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default View;
