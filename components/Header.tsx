import { PencilSquareIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { useStore } from "../store";
import Avatar from "./radix/Avatar";
// import Settings from "./Settings";

const Settings = dynamic(() => import("../components/Settings"), {
  ssr: false,
});

const Header = ({
  userdata,
  editChats,
}: {
  children?: ReactNode;
  editChats: () => void;
  userdata: any;
}) => {
  const toggleNCM = useStore((state) => state.toggleNCM);
  const toggleSM = useStore((state) => state.toggleSM);

  return (
    <div
      className='flex justify-between top-0 left-0 bg-[#f2f2f783] w-full backdrop-blur-md z-30
     py-1 px-2 absolute items-center'>
      <Avatar
        src={userdata?.photoURL}
        onClick={() => toggleSM(true, "home")}
        className='w-10 h-10 rounded-full cursor-pointer'
      />
      <Settings />
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
