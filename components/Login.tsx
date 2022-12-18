import { NextPage } from "next";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  User,
} from "firebase/auth";
import { auth, db, rdb } from "../lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import Image from "next/image";
import logo from "../public/logo-sign-in.png";
import { GoogleLogoIcon } from "./Svgs";
import { useStore } from "store";

const Login = () => {
  const nameRef = (user: User) =>
    ref(
      rdb,
      `Users/${
        user?.displayName
          ? user?.displayName?.toLowerCase() + user?.uid
          : "user"
      }`
    );

  const signInGoogle = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userdata = (await getDoc(doc(db, "Users", `${user.uid}`))).data();
      if (!userdata?.name) {
        await setDoc(
          doc(db, "Users", `${user?.uid}`),
          {
            name: `${user?.displayName}`,
          },
          { merge: true }
        );

        await set(nameRef(user), {
          uid: user?.uid,
          name: user?.displayName,
          photoURL: `${user?.photoURL && user?.photoURL}`,
        });
      }
      if (!userdata?.photoURL) {
        setDoc(
          doc(db, "Users", `${user?.uid}`),
          {
            photoURL: user?.photoURL && user?.photoURL,
          },
          { merge: true }
        );
      }
    } catch (err: any) {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(err);
    }
  };

  const signInUserName = async () => {
    // const persistedUser = useStore((state) => state.user);
    const result = await signInAnonymously(auth);
    try {
      const user = result.user;
      const userdata = (await getDoc(doc(db, "Users", `${user.uid}`))).data();
      if (!userdata?.name) {
        await setDoc(
          doc(db, "Users", `${user?.uid}`),
          {
            name: `${user?.displayName || "Someone Special"}`,
            about: "Hi 😃, there.",
          },
          { merge: true }
        );

        set(nameRef(user), {
          uid: user?.uid,
          name: user?.displayName || "Someone Special",
          photoURL: `${user?.photoURL && user?.photoURL}`,
        });
      }
      if (!userdata?.photoURL) {
        setDoc(
          doc(db, "Users", `${user?.uid}`),
          {
            photoURL: `${user?.photoURL && user?.photoURL}`,
          },
          { merge: true }
        );
      }
    } catch (err: any) {
      const errorCode = err.code;
      const errorMessage = err.message;
    }
  };

  return (
    <>
      <div className='flex items-center fixed inset-0 h-full justify-center bg-[#f2f2f7ff]'>
        <div className='flex flex-col space-y-3'>
          <button
            className='px-5 py-3 w-fit mx-auto text-2xl inline-flex items-center text-white rounded-full ring-2 ring-neutral-200 bg-blue-400
            hover:bg-blue-300 drop-shadow-md
             active:blue-300'
            onClick={signInGoogle}>
            <GoogleLogoIcon className='w-12 h-12 mx-auto' />
            {/* <p className='mx-2'>Google</p> */}
          </button>

          <button
            className='py-2 px-3 ring-2 ring-neutral-200 bg-gray-500 hover:bg-gray-600 drop-shadow-md rounded-2xl text-white text-xl'
            onClick={signInUserName}>
            {/* <GoogleLogoIcon boxSize={10} /> */}
            <p className='mx-2'>magic link</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
