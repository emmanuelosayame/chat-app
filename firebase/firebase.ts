import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU_Ee-_PCNHsUlyV80GNoXCz0g1pT1Lrg",
  authDomain: "chatapp-levi.firebaseapp.com",
  projectId: "chatapp-levi",
  storageBucket: "chatapp-levi.appspot.com",
  messagingSenderId: "281849870118",
  appId: "1:281849870118:web:12572e4700d727ba6d73e7",
  measurementId: "G-505MS6V11B",
};
const apps = getApps();
const app = null

if (!apps.length) {
  const app = initializeApp(firebaseConfig);
} else {
  const app = apps[0];
}

const db = getFirestore();
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

connectFirestoreEmulator(db, "localhost", 8080);

// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code == "failed-precondition") {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//     // ...
//   } else if (err.code == "unimplemented") {
//     // The current browser does not support all of the
//     // features required to enable persistence
//     // ...
//   }
// });

export { auth, db };
