import { CheckIcon } from "@heroicons/react/24/outline";

interface CheckboxProps {
  checked?: boolean;
  toggle?: () => void;
}
export const Checkbox = ({ checked, toggle }: CheckboxProps) => {
  return (
    <button
      className='w-6 h-6 bg-neutral-200 md:bg-white rounded-lg drop-shadow-md'
      onClick={toggle}>
      {checked && <CheckIcon width={20} />}
    </button>
  );
};
