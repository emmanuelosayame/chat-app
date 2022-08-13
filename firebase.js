import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const apps = getApps();

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];
const db = getFirestore();
const auth = getAuth();
const rdb = getDatabase();
const storage = getStorage();

if (!apps.length) {
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectDatabaseEmulator(rdb, "localhost", 9000);
  // connectStorageEmulator(storage, "localhost", 9199);
  enableIndexedDbPersistence(db, rdb).catch((err) => {
    if (err.code == "failed-precondition") {
      console.log(
        "Multiple tabs open, persistence can only be enabled in one tab at a a time"
      );
    } else if (err.code == "unimplemented") {
      console.log(
        "// The current browser does not support all of the features required to enable persistence..."
      );
    }
  });
}

export { auth, db, rdb, storage };
