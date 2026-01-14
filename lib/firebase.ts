import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZ1VCnL844v59XoTixP3J_YVrxNmsSxrI",
  authDomain: "gameweb-4fe8b.firebaseapp.com",
  projectId: "gameweb-4fe8b",
  storageBucket: "gameweb-4fe8b.firebasestorage.app",
  messagingSenderId: "1075367080838",
  appId: "1:1075367080838:web:d7378dfe6a33f05538f207",
  measurementId: "G-B45VBQ76C6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
