import Header from "./Header";
import NewChatComp from "./NewChat";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";
import { auth, db, rdb } from "../lib/firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import { browserName } from "react-device-detect";
import debounce from "lodash/debounce";
import { useStore } from "../store";
import { useReducer } from "react";
import { initialState, reducer } from "@lib/reducer";
import { userRef } from "@lib/queries";
import { useFetchUserData, useFetchChats } from "@lib/hooks";

const App = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = auth.currentUser;

  const chats = useFetchChats(user);
  useFetchUserData(user);

  const userdata = useStore((state) => state.userdata);
  const [state, dispatch] = useReducer(reducer, initialState);
  const toggleNCM = useStore((state) => state.toggleNCM);

  useEffect(() => {
    router.pathname !== "/" && router.push("/");
  }, []);

  const responsiveLayout = !!router.query?.chat;

  return (
    <div className={`bg-[#000000] ${1 !== 1 && "pt-3"}`}>
      {/* new chat modal */}
      <NewChatComp
        newSearch={false}
        setNewSearch={() => {}}
        mappedChats={chats}
        chatsData={[]}
        color='#007affff'
        onClose={toggleNCM}
      />
      {/* new chat modal */}
      <div
        className={`flex h-screen w-full max-w-screen-2xl bg-white md:bg-[#f2f2f7ff]`}>
        <div
          className={`${
            responsiveLayout ? "hidden md:block" : "block"
          } w-full md:w-2/5 lg:w-2/6 relative`}>
          <div className='w-full h-full overflow-y-auto'>
            <Header
              userdata={userdata}
              editChats={() =>
                dispatch({
                  type: "edit-chats",
                  payload: state.editChats ? false : true,
                })
              }
            />
            <div className='flex w-full px-2 relative h-auto pb-3 mt-16'>
              <button
                className='inline-flex items-center bg-neutral-100 md:bg-white w-full rounded-md p-1 cursor-text'
                onClick={() => {
                  dispatch({ type: "search", payload: true });
                }}>
                <MagnifyingGlassIcon className='ml-2' width={25} />
                <p className='text-base text-neutral-400 text-center w-full mr-10'>
                  search
                </p>
              </button>
            </div>
            <div className='divider my-1' />

            <div className='relative w-full px-2'>
              {!chats || chats.length < 1 ? (
                <div className='h-full justify-center items-center'>
                  <button onClick={toggleNCM}>Start Chat</button>
                </div>
              ) : (
                <>
                  <div className='w-full' />
                  {chats?.map((chat) => {
                    return (
                      <Chat
                        key={chat.id}
                        editChats={state.editChats}
                        selectedChat={state.selectedChats?.includes(chat.id)}
                        toggleSelect={() =>
                          dispatch({
                            type: "toggle-select",
                            payload: chat.id,
                          })
                        }
                        chatId={chat.id}
                        recId={chat.recId}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        {/* page */}
        <div
          className={`${
            responsiveLayout ? "" : "hidden md:block"
          } relative h-full w-full bg-white bg-opacity-70`}>
          {/* {search ? ( */}
          <div className={`${state.search && "hidden"}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default App;

// {
//   chatList &&
//     search &&
//     chatList.map((user: any) => (
//       <div
//         key={user.item.recId}
//         className=''
//         onClick={() => {
//           setSearch(false);
//           router.push(
//             {
//               pathname: "/p/[chat]",
//               query: {
//                 chatId: user.item.chatId,
//                 recId: user.item.recId,
//                 name: user.item.name,
//                 userName: user.item.userName,
//                 photoURL: user.item.photoURL,
//               },
//             },
//             `/p/${user.item.userName}`
//           );
//         }}>
//         <div>
//           <h3 className='text-lg'>{user.item.name}</h3>
//           <p className='text-base'>{user.item.userName}</p>
//         </div>
//       </div>
//     ));
// }
