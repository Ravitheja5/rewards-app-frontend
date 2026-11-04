import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCM62kZeey478xHy8TrAaNNFh-JmUtpr_c",
  authDomain: "rewardrush-24412.firebaseapp.com",
  projectId: "rewardrush-24412",
  storageBucket: "rewardrush-24412.firebasestorage.app",
  messagingSenderId: "881830042629",
  appId: "1:881830042629:web:fbd53a42fb717ff5b5106c",
  measurementId: "G-D5NNRDSGC3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
