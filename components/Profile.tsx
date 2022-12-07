import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ref, remove, set, update } from "firebase/database";
import {
  collection,
  getDocsFromServer,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import debounce from "lodash/debounce";
import { useRef, useState } from "react";
import { auth, db, rdb, storage } from "../lib/firebase";
import { UserData } from "../types";
import Avatar from "./radix/Avatar";
import { Formik, Form } from "formik";
import { useMemo } from "react";
import { diff } from "deep-object-diff";
import { userRef } from "../lib/queries";
import { profileVS } from "@lib/validations";
import { ProfileState } from "../types/reducer";

const Profile = ({
  userdata,
  toggleSM,
}: {
  userdata?: UserData;
  toggleSM: (state: boolean, page?: string) => void;
}) => {
  const user = auth.currentUser;
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const initialValues: ProfileState = {
    name: userdata?.name ?? "",
    userName: userdata?.userName ?? "",
    about: userdata?.about ?? "",
    photoURL: userdata?.photoURL,
    photo: null,
  };

  // const [state, dispatch] = useReducer(profileReducer, initialState);

  const [photo, setPhoto] = useState<File | null | undefined>(null);
  const prevPhotoURL = useMemo(
    () => photo && URL.createObjectURL(photo),
    [photo]
  );

  const userNameExists = debounce(async (userName: string) => {
    try {
      const res = await getDocsFromServer(
        query(collection(db, "Users"), where("userName", "==", `${userName}`))
      );
      return { exists: res.empty };
    } catch (err) {
      return { error: err };
    }
  }, 1000);

  const handleProfileChanges = async (values: ProfileState) => {
    const { photo: omit, ...restInitialValues } = initialValues;
    const { photo, ...rest } = values;
    const changedValues = diff(restInitialValues, rest);
    // console.log(changedValues);
    if (photo) {
      try {
        const uploadResult = await uploadBytes(
          sref(storage, `${photo.name}${Date.now()}`),
          photo
        );
        const url = await getDownloadURL(uploadResult.ref);
        await updateDoc(userRef(user), { ...changedValues, photoURL: url });
        toggleSM(true, "home");
      } catch (err) {}
    } else {
      updateDoc(userRef(user), changedValues);
      toggleSM(true, "home");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileVS}
      onSubmit={handleProfileChanges}>
      {({ dirty, errors, getFieldProps, values, setFieldValue }) => {
        return (
          <Form className=''>
            <div className='w-full justify-between flex'>
              <button
                className='text-blue-500'
                onClick={() => toggleSM(true, "account")}
                type='button'>
                Back
              </button>
              <button
                aria-label='close-setting-page'
                className='text-blue-500 disabled:text-neutral-300 '
                disabled={!dirty}
                type='submit'>
                Save
              </button>
            </div>

            <div className='flex flex-col items-center pt-8'>
              <button onClick={() => uploadRef?.current?.click()}>
                <Avatar
                  className='w-36 h-36 rounded-[40px] ring-neutral-300 ring-2'
                  src={prevPhotoURL || userdata?.photoURL}
                />
              </button>
              <div>
                <button
                  className='text-sm text-gray-400 underline mt-2'
                  onClick={() => uploadRef?.current?.click()}
                  type='button'>
                  {userdata?.photoURL ? "Change Profile" : "Add"} Photo
                </button>
                <>
                  {values.photo && (
                    <button
                      onClick={() => setFieldValue("photo", null)}
                      className='ml-3 bg-gray-100 rounded-xl p-1 text-orange-500 drop-shadow-md
                    ring-2 ring-orange-300 shadow-slate-300'>
                      <XMarkIcon width={20} />
                    </button>
                  )}
                </>
              </div>

              <input
                ref={uploadRef}
                hidden
                multiple={false}
                type='file'
                accept='image/*'
                onChange={(e) => {
                  prevPhotoURL && URL.revokeObjectURL(prevPhotoURL);
                  setFieldValue("photo", e.target.files?.[0]);
                  setPhoto(e.target.files?.[0]);
                }}
              />
              <div className='text-neutral-500'>
                <div className='relative w-72 my-3 pt-8'>
                  <label
                    className='absolute top-0 right-0 text-center left-0 text-neutral-300'
                    htmlFor='name'>
                    {errors.name ? errors.name : "name"}
                  </label>
                  {/* <p className='absolute right-0 top-4 text-orange-400 text-sm'>
                    {errors?.name}
                  </p> */}
                  <input
                    id='name'
                    aria-label='name'
                    {...getFieldProps("name")}
                    className='w-full border-b border-neutral-200 px-2'
                  />
                </div>
                <div className='relative w-72 my-3 pt-8'>
                  <label
                    className='absolute top-0 right-0 text-center left-0 text-neutral-300'
                    htmlFor='user-name'>
                    {errors.userName ? errors.userName : "username"}
                  </label>
                  <div className='absolute top-2 right-0'>
                    {<CheckCircleIcon width={30} className='text-green-500 ' />}
                  </div>
                  <input
                    id='user-name'
                    aria-label='name'
                    {...getFieldProps("userName")}
                    className='w-full border-b border-neutral-200 px-2'
                  />
                </div>
                <div className='relative w-72 my-3 pt-8'>
                  <label
                    className='absolute top-0 right-0 text-center left-0 text-neutral-300'
                    htmlFor='about'>
                    {errors.about ? errors.about : "about"}
                  </label>
                  <textarea
                    id='about'
                    aria-label='name'
                    className='w-full border-b border-neutral-200 px-2 resize-none'
                    {...getFieldProps("about")}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Profile;
