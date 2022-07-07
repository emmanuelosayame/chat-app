import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU_Ee-_PCNHsUlyV80GNoXCz0g1pT1Lrg",
  authDomain: "chatapp-levi.firebaseapp.com",
  projectId: "chatapp-levi",
  storageBucket: "chatapp-levi.appspot.com",
  messagingSenderId: "281849870118",
  appId: "1:281849870118:web:12572e4700d727ba6d73e7",
  measurementId: "G-505MS6V11B",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth(app);

export { db };
