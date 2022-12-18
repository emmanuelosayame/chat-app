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
import { Formik, Form, useFormik } from "formik";
import { useMemo } from "react";
import { diff } from "deep-object-diff";
import { userRef } from "../lib/queries";
import { profileVS } from "@lib/validations";
import Toast, { useToastTrigger } from "./radix/Toast";

type UserNameValidationError =
  | { name: "FirebaseError"; code: "unavailable"; message: string }
  | { name: "ValidationError"; message: string };

interface Values {
  name?: string;
  userName?: string;
  photo: File | null;
  about?: string;
}

const Profile = ({
  userdata,
  toggleSM,
}: {
  userdata?: UserData;
  toggleSM: (state: boolean, page?: string) => void;
}) => {
  const user = auth.currentUser;
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const initialValues: Values = {
    name: userdata?.name,
    photo: null,
    about: userdata?.about,
    userName: userdata?.userName,
  };

  const { open, setOpen, trigger } = useToastTrigger();

  const onSubmit = async (values: Values) => {
    const { photo: initialPhoto, ...initial } = initialValues;
    const { photo, ...rest } = values;
    const changedValues = diff(initial, rest);
    if (photo) {
      try {
        const uploadResult = await uploadBytes(
          sref(storage, `${photo.name}${Date.now()}`),
          photo
        );
        const url = await getDownloadURL(uploadResult.ref);
        await updateDoc(userRef(user), { ...changedValues, photoURL: url });
        toggleSM(true, "home");
      } catch (err) {
        trigger();
      }
    } else {
      updateDoc(userRef(user), changedValues);
      toggleSM(true, "home");
    }
  };

  const {
    dirty,
    errors,
    getFieldProps,
    submitForm,
    values,
    setFieldValue,
    handleSubmit,
    setFieldError,
    setFieldTouched,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: profileVS,
  });

  // console.log(values, errors);

  const preview = useMemo(
    () =>
      values.photo ? URL.createObjectURL(values.photo) : userdata?.photoURL,
    [values.photo]
  );

  const handleUserName = debounce(async (value: string) => {
    if (value === userdata?.userName) {
      setFieldValue("userName", value);
      setFieldError("userName", undefined);
      setFieldTouched("userName", undefined, false);
      return;
    }
    setFieldTouched("userName", true, false);
    if (!value || value.length < 1) {
      setFieldValue("userName", "");
      return;
    }
    try {
      await profileVS.validate({ userName: value });
      const available = (
        await getDocsFromServer(
          query(collection(db, "Users"), where("userName", "==", `${value}`))
        )
      ).empty;
      if (available) {
        setFieldValue("userName", value);
      } else setFieldError("userName", "taken");
    } catch (err) {
      const error = err as UserNameValidationError;
      if (error.name === "FirebaseError") {
        setFieldError("userName", error.code);
      } else setFieldError("userName", error.message);
    }
  }, 1000);

  return (
    <form className='' onSubmit={handleSubmit}>
      <Toast open={open} setOpen={setOpen} description='something went wrong' />
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
          type='submit'
          onClick={submitForm}>
          Save
        </button>
      </div>

      <div className='flex flex-col items-center pt-8'>
        <button onClick={() => uploadRef?.current?.click()}>
          <Avatar
            className='w-36 h-36 rounded-full ring-neutral-300 ring-2'
            src={preview}
          />
        </button>
        <div className='flex'>
          <button
            className='text-sm text-gray-400 underline mt-2'
            onClick={() => uploadRef?.current?.click()}
            type='button'>
            {userdata?.photoURL ? "Change Profile" : "Add"} Photo
          </button>
          <div>
            {values.photo && (
              <button
                onClick={() => setFieldValue("photo", null)}
                className='ml-3 bg-gray-100 rounded-xl p-1 text-orange-500 drop-shadow-md
                    ring-2 ring-orange-300 shadow-slate-300'>
                <XMarkIcon width={20} />
              </button>
            )}
          </div>
        </div>

        <input
          ref={uploadRef}
          hidden
          multiple={false}
          type='file'
          accept='image/*'
          onChange={(e) => setFieldValue("photo", e.target?.files?.[0])}
        />
        <div className='text-neutral-500'>
          <div className='relative w-72 my-3 pt-8'>
            <label
              className='absolute top-0 right-0 text-center left-0 text-neutral-300'
              htmlFor='name'>
              name
            </label>
            <p className='absolute right-0 top-4 text-orange-400 text-sm'>
              {errors?.name}
            </p>
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
              {/* {errors.userName ? errors.userName : "username"} */}
              username
            </label>
            {errors.userName ? (
              <div className='absolute top-2 right-0 text-sm'>
                {errors?.userName === "unavailable" ? (
                  <p className='text-amber-400'>offline</p>
                ) : errors?.userName ? (
                  <p>{errors?.userName}</p>
                ) : (
                  <CheckCircleIcon width={30} className='text-green-500 ' />
                )}
              </div>
            ) : null}
            <input
              id='userName'
              aria-label='name'
              defaultValue={values?.userName}
              // onBlur={handleBlur}
              onChange={(e) => handleUserName(e.target.value)}
              className='w-full border-b border-neutral-200 px-2'
            />
          </div>
          <div className='relative w-72 my-3 pt-8'>
            <label
              className='absolute top-0 right-0 text-center left-0 text-neutral-300'
              htmlFor='about'>
              about
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
    </form>
  );
};

export default Profile;
