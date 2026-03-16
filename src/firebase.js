// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6VbFwVhA-nPGXyPRN9llr0lXIrSTqwtM",
  authDomain: "paidforward-42c2f.firebaseapp.com",
  projectId: "paidforward-42c2f",
  storageBucket: "paidforward-42c2f.firebasestorage.app",
  messagingSenderId: "171038802962",
  appId: "1:171038802962:web:ec70ec0f503bd9615a84cb",
  measurementId: "G-90HBZKHPC7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);