import { UserIcon } from "@heroicons/react/24/solid";
import * as RadixAvatar from "@radix-ui/react-avatar";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

const Avatar = ({ src, alt, className, fallback }: AvatarProps) => {
  const fallbackInitials = fallback
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join(" ");
  return (
    <RadixAvatar.Root
      className={`inline-flex items-center select-none overflow-hidden shadow-md ${className}`}>
      <RadixAvatar.Image
        className='AvatarImage w-full h-full object-cover'
        src={src}
        alt={alt}
      />
      <RadixAvatar.Fallback
        className='w-full h-full bg-gray-500 p-1 flex text-[whitesmoke] items-center justify-center'
        delayMs={200}>
        {!fallback ? <UserIcon width={"100%"} /> : <p>{fallbackInitials}</p>}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};

export default Avatar;
