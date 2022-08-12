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
  apiKey: "AIzaSyBU_Ee-_PCNHsUlyV80GNoXCz0g1pT1Lrg",
  authDomain: "chatapp-levi.firebaseapp.com",
  projectId: "chatapp-levi",
  storageBucket: "chatapp-levi.appspot.com",
  messagingSenderId: "281849870118",
  appId: "1:281849870118:web:12572e4700d727ba6d73e7",
  measurementId: "G-505MS6V11B",
};

const apps = getApps();

const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];
// const fuego = new Fuego(firebaseConfig);

// const db = fuego.db;
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
