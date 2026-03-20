import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFdE1tDNKNNliazJx1230vMpT1NsWkQHI",
  authDomain: "rebuild-test-1f8fb.firebaseapp.com",
  projectId: "rebuild-test-1f8fb",
  storageBucket: "rebuild-test-1f8fb.firebasestorage.app",
  messagingSenderId: "789279832291",
  appId: "1:789279832291:web:6d54606824652a07aa2dd6",
  measurementId: "G-46X58N3P0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };


