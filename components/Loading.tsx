import { SpinnerDotted } from "spinners-react";

export const Loading = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center w-full h-full'>
      <SpinnerDotted color='#007affff' />
    </div>
  );
};
