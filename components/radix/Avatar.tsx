import { UserIcon } from "@heroicons/react/24/solid";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { MouseEventHandler } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const Avatar = ({ src, alt, className, fallback, onClick }: AvatarProps) => {
  const fallbackInitials = fallback
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join(" ");
  return (
    <RadixAvatar.Root
      onClick={onClick}
      className={`inline-flex items-center select-none overflow-hidden shadow-md ${className}`}>
      <RadixAvatar.Image
        className=' w-full h-full object-cover'
        src={src}
        alt={alt}
      />
      <RadixAvatar.Fallback
        className='w-full h-full bg-gray-500 p-1 flex text-[whitesmoke] items-center justify-center'
        delayMs={100}>
        {!fallback ? <UserIcon width={"100%"} /> : <p>{fallbackInitials}</p>}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};

export default Avatar;
