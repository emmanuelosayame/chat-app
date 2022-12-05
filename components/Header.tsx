import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useStore } from "../store";
import Settings from "./Settings";

const Header = ({
  userData,
  editChats,
}: {
  children?: ReactNode;
  editChats: () => void;
  userData: any;
}) => {
  const toggleNCM = useStore((state) => state.toggleNCM);
  return (
    <div
      className='flex justify-between h-10 top-0 left-0 bg-[#f2f2f783] w-full backdrop-blur-md z-30
     p-2 absolute items-center'>
      <Settings
        userData={userData}
        isOpen={false}
        onOpen={() => {}}
        onClose={() => {}}
        userNameSet={false}
        setUserNameSet={() => {}}
      />
      <h2 className='text-base'>wagwan</h2>
      <div className='flex items-center space-x-1'>
        <button
          aria-label='create-chat-button'
          className='text-blue-400'
          onClick={toggleNCM}>
          <PencilSquareIcon width={22} />
        </button>

        <button
          onClick={editChats}
          className='text-sm md:text-base text-blue-400'>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Header;
