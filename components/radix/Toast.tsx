import { XMarkIcon } from "@heroicons/react/24/solid";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useState } from "react";
import cx from "classnames";

interface ToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  duration?: number;
}

export const useToastTrigger = (duration: number = 400) => {
  const [open, setOpen] = useState(false);

  const trigger = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
      }, duration);
    } else {
      setOpen(true);
    }
  };
  return { trigger, open, setOpen };
};

export const Toast = ({
  open,
  setOpen,
  title,
  description,
  duration = 5000,
}: ToastProps) => {
  return (
    <ToastPrimitive.Provider duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "z-50 fixed bottom-4 inset-x-4 w-5/6 mx-auto md:bottom-4 md:right-4 md:left-auto md:top-auto md:w-full md:max-w-xs shadow-lg rounded-2xl",
          "bg-white dark:bg-gray-800",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-end:animate-toast-swipe-out",
          "translate-x-radix-toast-swipe-move-x",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}>
        <div className='flex'>
          <div className='w-0 flex-1 flex items-center pl-5 py-2'>
            <div className='w-full radix'>
              <ToastPrimitive.Title className='text-xl font-medium text-gray-900 dark:text-gray-100'>
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className='mt-1 text-sm text-gray-700 dark:text-gray-400'>
                {description}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className='flex'>
            <div className='flex flex-col px-3 py-2 space-y-1'>
              {/* <div className='h-0 flex-1 flex'>
                <ToastPrimitive.Action
                  altText='view now'
                  className='w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                  onClick={(e) => {
                    e.preventDefault();
                  }}>
                  Review
                </ToastPrimitive.Action>
              </div> */}
              <div className='h-0 flex-1 flex'>
                <ToastPrimitive.Close className='w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
