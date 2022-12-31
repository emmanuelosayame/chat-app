import * as Dialog from "@radix-ui/react-dialog/dist";
import * as Switch from "@radix-ui/react-switch/dist";
import {
  ArchiveBoxIcon,
  ChevronDownIcon,
  KeyIcon,
  MoonIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useStore } from "../store";
import Bucket from "./Bucket";
import Profile from "./Profile";
import Avatar from "./radix/Avatar";
import { UserData } from "../types";

const Settings = () => {
  const userdata = useStore((state) => state.userdata);
  const [isOpen, page] = useStore((state) => state.settingsModal);
  const toggleSM = useStore((state) => state.toggleSM);

  const renderPage: { [key: string]: ReactNode } = {
    account: <Account userdata={userdata} toggleSM={toggleSM} />,
    home: <Home userdata={userdata} toggleSM={toggleSM} />,
    profile: <Profile userdata={userdata} toggleSM={toggleSM} />,
  };

  const noUserName = userdata && !userdata.userName;

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={toggleSM}>
        <Dialog.Portal>
          <Dialog.Overlay className=' bg-gray-800 opacity-60 z-40 inset-0 fixed' />
          <div className='fixed inset-0 z-50 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-x-0 bottom-0 flex w-full h-[95%]'>
                <Dialog.Content className='pointer-events-auto relative w-screen'>
                  <div className='flex h-full flex-col bg-white rounded-t-xl w-full p-4 shadow-xl'>
                    {/* page */}
                    {renderPage[page]}
                  </div>
                </Dialog.Content>
              </div>
            </div>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

const Home = ({
  userdata,
  toggleSM,
}: {
  userdata?: UserData;
  toggleSM: (state: boolean, page?: string) => void;
}) => {
  return (
    <div className='p-1 w-full'>
      <div className='flex'>
        <>
          {userdata?.photoURL && userdata?.photoURL !== "null" && (
            <Avatar
              className='w-10 h-10 rounded-full'
              src={userdata?.photoURL}
            />
          )}
        </>
        <div className='ml-3'>
          <h3 className='inline-flex items-center text-[17px] md:text-xl'>
            {userdata?.name}
            {userdata?.verified && (
              <span className='ml-1'>
                <CheckBadgeIcon width={18} color='#007affff' />
              </span>
            )}
          </h3>
          <p className='text-[15px] md:text-base text-neutral-400'>
            {userdata?.userName}
          </p>
        </div>
        <div className='flex-1 flex justify-end'>
          <button
            className='text-white text-lg h-fit drop-shadow-sm rounded-xl md:rounded-xl bg-blue-400'
            onClick={() => toggleSM(false)}>
            <span className='hidden md:block w-16 p-0.5'>close</span>
            <ChevronDownIcon width={30} className='text-white md:hidden' />
          </button>
        </div>
      </div>
      <div className='py-3 px-5 mt-10 bg-[#74748014] rounded-xl text-neutral-600'>
        <button
          className='inline-flex items-center w-full my-1.5 hover:opacity-50'
          onClick={() => toggleSM(true, "account")}>
          <KeyIcon
            className='bg-blue-400 fill-white p-1 rounded-xl'
            width={35}
          />
          <p className='flex-1 text-start mx-3 text-lg '>Account</p>
          <ChevronRightIcon color='#3c3c434c' width={30} />
        </button>
        <div className='divider' />
        <button
          className='inline-flex items-center w-full my-1.5 hover:opacity-50'
          onClick={() => toggleSM(true, "bucket")}>
          <ArchiveBoxIcon
            className='bg-amber-400 fill-white p-1 rounded-xl'
            width={35}
          />
          <p className='flex-1 text-start mx-3 text-lg '> My Bucket</p>
          <ChevronRightIcon color='#3c3c434c' width={30} />
        </button>
        <div className='divider' />
        <button
          className='inline-flex items-center w-full my-1.5 hover:opacity-50 disabled:hover:opacity-100'
          disabled>
          <MoonIcon
            className='bg-[#c6c6c8ff] fill-gray-500 p-1 rounded-xl'
            width={35}
          />
          <p className='flex-1 text-start mx-3 text-lg '> Dark Mode</p>
          <Switch.Root
            disabled
            className=' group bg-white drop-shadow-sm relative focus:bg-opacity-75
            data-checked:bg-neutral-500 data-unchecked:bg-gray-200 dark:data-unchecked:bg-gray-800
            inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75
            '>
            <Switch.Thumb
              className=' data-checked:translate-x-5 data-unchecked:translate-x-0
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            '
            />
          </Switch.Root>
        </button>
      </div>

      <p className='text-center text-[#3c3c4399]'>coming soon</p>
    </div>
  );
};

const Account = ({
  userdata,
  toggleSM,
}: {
  userdata?: UserData;
  toggleSM: (state: boolean, page?: string) => void;
}) => {
  const router = useRouter();
  const user = auth.currentUser;

  const logout = () => {
    router.push("/");
    router.reload();

    auth.signOut();
  };

  return (
    <div className='h-auto'>
      <button className='text-blue-500' onClick={() => toggleSM(true, "home")}>
        Back
      </button>
      <div className='flex flex-col h-full pt-5'>
        <button
          className='inline-flex bg-neutral-100 text-neutral-600 rounded-xl p-1 items-center
           w-full my-1.5 hover:opacity-50'
          onClick={() => toggleSM(true, "profile")}>
          <UserIcon
            className='bg-blue-400 fill-white p-1 rounded-xl'
            width={35}
          />
          <p className='flex-1 text-start mx-3 text-base '> Edit Profile</p>
          <ChevronRightIcon color='#3c3c434c' width={30} />
        </button>

        <div className='text-neutral-600 flex-1 mt-3'>
          <h3 className='text-base mt-3 bg-neutral-100 rounded-xl p-2'>
            Email: <span className='text-sm ml-2'>{user?.email}</span>
          </h3>
          <p className='text-[#3c3c434c] text-[13px] text-center'>
            your email is private and not visible to other users
          </p>
          <h3 className='text-base mt-3 bg-neutral-100 rounded-xl p-2'>
            Last SignedIn:{" "}
            <span className='text-[13px]'>{user?.metadata.lastSignInTime}</span>
          </h3>
        </div>
        <button
          className='text-white md:w-fit md:mx-auto bg-blue-400 py-1 px-2 rounded-lg'
          onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
