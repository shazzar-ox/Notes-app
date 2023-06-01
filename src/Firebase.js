// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm69aQ55h_Sw9Zp9URIdO1u7jWfJS2AjU",
  authDomain: "react-notes-bbd31.firebaseapp.com",
  projectId: "react-notes-bbd31",
  storageBucket: "react-notes-bbd31.appspot.com",
  messagingSenderId: "858388326743",
  appId: "1:858388326743:web:83956e2330b892d6443612"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const noteCollection = collection(db, "notes")