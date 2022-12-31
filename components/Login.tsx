import { NextPage } from "next";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, rdb } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import Image from "next/image";
import logo from "../public/logo-sign-in.png";
import { GoogleLogoIcon } from "./Svgs";
import { useStore } from "store";
import { Checkbox } from "./Checkbox";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Form, Formik } from "formik";
import Link from "next/link";
import { uniqueNamesGenerator, names, colors } from "unique-names-generator";
import { FirebaseError } from "firebase/app";
import { authVs } from "@lib/validations";

const Login = () => {
  const router = useRouter();
  const nameRef = (user: User) =>
    ref(
      rdb,
      `Users/${
        user?.displayName
          ? user?.displayName?.toLowerCase() + user?.uid
          : "user"
      }`
    );

  const generateUserName = () =>
    uniqueNamesGenerator({
      dictionaries: [colors, names],
      separator: "-",
    });

  const [error, setError] = useState<string | null>(null);

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
      if (!userdata?.userName) {
        await setDoc(
          doc(db, "Users", `${user?.uid}`),
          {
            userName: generateUserName(),
          },
          { merge: true }
        );
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
      setError(errorCode);
    }
  };

  const signInWithEmail = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.code);
    }
  };

  const createUser = async (values: {
    email: string;
    password: string;
    name: string;
    // userName: string;
  }) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const userName = generateUserName();
      await setDoc(doc(db, "Users", `${res.user?.uid}`), {
        name: values.name,
        userName,
      });
      await set(nameRef(res.user), {
        uid: res.user?.uid,
        name: values.name,
        userName,
      });
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.code);
    }
  };

  const signInMagicLink = () => {
    try {
      signInMagicLink();
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.code);
    }
  };

  const signupPage = router.query.screen === "signup";

  return (
    <>
      <div className='flex flex-col items-center fixed inset-0 h-full bg-gradient-to-l from-blue-400 to-blue-300'>
        <div className=' font-semibold text-white drop-shadow-lg mt-10 md:mr-56'>
          <h3 className='text-2xl'>wagwan</h3>
        </div>
        <div className='flex flex-col md:flex-row md:w-11/12 m-auto justify-between items-center p-3 max-w-screen-2xl'>
          <div className='md:w-2/5 m-5 md:m-0'>
            <p className=' text-2xl md:text-4xl'>Chat</p>
            <p className='hidden md:block mt-2 text-sm md:text-base text-white'>
              Say "hello" to a different messaging experience. An unexpected
              focus on accesibility, combined with all of the features you
              expect.
            </p>
          </div>
          <div
            className='flex flex-col items-center justify-center drop-shadow-lg rounded-xl
         space-y-3 md:mr-16 bg-white w-full md:w-96 py-3 relative'>
            {signupPage ? (
              <Formik
                initialValues={{
                  email: "",
                  name: "",
                  // userName: "",
                  password: "",
                  confirmPassword: "",
                  atc: false,
                }}
                validationSchema={authVs.register}
                onSubmit={createUser}>
                {({
                  dirty,
                  getFieldProps,
                  values,
                  setFieldValue,
                  touched,
                  errors,
                }) => {
                  return (
                    <Form>
                      <div className='w-full p-4'>
                        <p className='text-lg mb-4 text-center text-neutral-500'>
                          Welcome
                        </p>
                        <input
                          placeholder='email'
                          type='email'
                          {...getFieldProps("email")}
                          className='my-1 p-1 border-b border-b-blue-400 w-full'
                        />
                        <input
                          placeholder='name'
                          type='text'
                          {...getFieldProps("name")}
                          className='my-1 p-1 border-b border-b-blue-400 w-full'
                        />
                        <input
                          placeholder='password'
                          type='password'
                          {...getFieldProps("password")}
                          className='my-1 p-1 border-b border-b-blue-400 w-full'
                        />
                        <input
                          placeholder='confirmPassword'
                          type='password'
                          {...getFieldProps("confirmPassword")}
                          className='my-1 p-1 border-b border-b-blue-400 w-full'
                        />
                        {(touched.email ||
                          touched.password ||
                          touched.confirmPassword ||
                          touched.atc) &&
                        (errors.email ||
                          errors.password ||
                          errors.confirmPassword ||
                          errors.atc) ? (
                          <p className='text-sm text-neutral-400'>
                            {errors.email ||
                              errors.password ||
                              errors.confirmPassword ||
                              errors.atc}
                          </p>
                        ) : null}
                      </div>
                      {error && (
                        <p className='text-[12px] text-amber-200 text-center'>
                          {error}
                        </p>
                      )}
                      <div className='flex justify-between items-center h-12 w-full px-5'>
                        <div className='flex space-x-2'>
                          <Checkbox
                            checked={values.atc}
                            toggle={() => setFieldValue("atc", !values.atc)}
                          />
                          <p className='text-sm text-neutral-400'>
                            accept terms and conditions
                          </p>
                        </div>
                        <button
                          className={`rounded-full bg-green-400 drop-shadow-md p-1 disabled:opacity-50`}
                          disabled={!values.atc}
                          type='submit'>
                          <ChevronRightIcon width={30} color='white' />
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            ) : (
              <>
                <button
                  className='w-fit mx-auto text-2xl inline-flex items-center text-white rounded-full ring-2
               ring-blue-400
            hover:ring-blue-100 drop-shadow-md
             active:blue-300'
                  onClick={signInGoogle}>
                  <GoogleLogoIcon className='w-12 h-12 mx-auto' />
                  {/* <p className='mx-2'>Google</p> */}
                </button>

                <button
                  className=' px-1 bg-gray-500 hover:bg-gray-600 drop-shadow-md rounded-lg text-white text-base'
                  onClick={signInMagicLink}>
                  {/* <GoogleLogoIcon boxSize={10} /> */}
                  <p className='mx-2'>magic link</p>
                </button>

                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    rp: false,
                  }}
                  validationSchema={authVs.login}
                  onSubmit={signInWithEmail}>
                  {({
                    dirty,
                    getFieldProps,
                    values,
                    setFieldValue,
                    touched,
                    errors,
                  }) => {
                    return (
                      <Form>
                        <div className='w-full p-4'>
                          <p className='text-[12px] text-center text-neutral-400'>
                            enter your email and password
                          </p>
                          <input
                            placeholder='username'
                            {...getFieldProps("email")}
                            className='my-1 p-1 border-b border-b-blue-400 w-full'
                          />
                          <input
                            placeholder='password'
                            type='password'
                            {...getFieldProps("password")}
                            className='my-1 p-1 border-b border-b-blue-400 w-full'
                          />
                          {(touched.email || touched.password) &&
                          (errors.email || errors.password) ? (
                            <p className='text-sm text-neutral-400'>
                              {errors.email || errors.password}
                            </p>
                          ) : null}
                          {error && (
                            <p className='text-[12px] text-amber-200 text-center'>
                              {error}
                            </p>
                          )}
                        </div>
                        <div className='flex justify-between items-center h-12 w-full px-5'>
                          <div className='flex space-x-2'>
                            <Checkbox
                              checked={values.rp}
                              toggle={() => setFieldValue("rp", !values.rp)}
                            />
                            <p className='text-sm text-neutral-400'>
                              Remember me
                            </p>
                          </div>
                          {dirty ? (
                            <button
                              className='rounded-full bg-green-400 drop-shadow-md p-1'
                              type='submit'>
                              <ChevronRightIcon width={30} color='white' />
                            </button>
                          ) : null}
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            )}
            <div className='flex items-center gap-3 absolute -bottom-16'>
              {signupPage ? (
                <Link className='text-white' href={{ query: {} }}>
                  login to your account
                </Link>
              ) : (
                <Link
                  className='text-white'
                  href={{ query: { screen: "signup" } }}
                  replace={false}>
                  create account
                </Link>
              )}
              <div className='h-5 rounded-xl w-0.5 bg-blue-600' />
              <Link className='text-sm' href={"login-issue"}>
                trouble signing in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
