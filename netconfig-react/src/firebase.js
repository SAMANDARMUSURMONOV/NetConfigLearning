import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZ-RCWNITFoILoxXCCB9H2uRlIAXpBd5c",
  authDomain: "bmiwebplatforma.firebaseapp.com",
  projectId: "bmiwebplatforma",
  storageBucket: "bmiwebplatforma.firebasestorage.app",
  messagingSenderId: "847883840932",
  appId: "1:847883840932:web:b01b596aefa3fe7e5ba531",
  measurementId: "G-CLS0FF61F9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app.options.projectId);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
