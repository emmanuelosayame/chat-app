import { NextPage } from "next";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { auth, db, rdb } from "../firebase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import Image from "next/image";
import logo from "../public/logo-sign-in.png";
import { GoogleLogoIcon } from "./Svgs";

const Login: NextPage = () => {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("/");
  // }, []);

  const provider = new GoogleAuthProvider();

  const signIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const nameRef = ref(
          rdb,
          `Users/${
            user?.displayName
              ? user?.displayName?.toLowerCase() + user?.uid
              : "user"
          }`
        );
        getDoc(doc(db, "Users", `${user.uid}`)).then((snapshot) => {
          const userData = snapshot.data();
          if (!userData?.name) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                name: `${user?.displayName}`,
              },
              { merge: true }
            );

            set(nameRef, {
              uid: user?.uid,
              name: user?.displayName,
              photoURL: `${user?.photoURL && user?.photoURL}`,
            });
          }

          if (!userData?.photoURL) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                photoURL: `${user?.photoURL && user?.photoURL}`,
              },
              { merge: true }
            );
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const signInAnm = () => {
    signInAnonymously(auth)
      .then((result) => {
        const user = result.user;
        const nameRef = ref(
          rdb,
          `Users/${
            user?.displayName
              ? user?.displayName?.toLowerCase() + user?.uid
              : "user"
          }`
        );
        getDoc(doc(db, "Users", `${user.uid}`)).then((snapshot) => {
          const userData = snapshot.data();
          if (!userData?.name) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                name: `${user?.displayName || "Someone Special"}`,
                about:
                  "Hi 😃, welcome to my project. Really nice having you here. Hope you have fun chatting 😜 . This is still termed as a work in progress. Hit me up @biglevvi on any platform ",
              },
              { merge: true }
            );

            set(nameRef, {
              uid: user?.uid,
              name: user?.displayName || "Someone Special",
              photoURL: `${user?.photoURL && user?.photoURL}`,
            });
          }

          if (!userData?.photoURL) {
            setDoc(
              doc(db, "Users", `${user?.uid}`),
              {
                photoURL: `${user?.photoURL && user?.photoURL}`,
              },
              { merge: true }
            );
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  };

  return (
    <>
      <div className='flex items-center fixed inset-0 h-full justify-center bg-[#f2f2f7ff]'>
        <div className='flex flex-col space-y-3'>
          <button
            className='px-5 py-3 text-2xl inline-flex items-center text-white rounded-3xl bg-blue-300
            hover:bg-blue-200 drop-shadow-md
             active:blue-300'
            onClick={signIn}>
            <GoogleLogoIcon className='w-12 h-12' />
            <p className='mx-2'>Login</p>
          </button>

          <button
            className='py-3 px-8 bg-gray-500 hover:bg-gray-600 drop-shadow-md rounded-2xl text-white text-xl'
            onClick={signInAnm}>
            {/* <GoogleLogoIcon boxSize={10} /> */}
            <p className='mx-2'>Guest</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
