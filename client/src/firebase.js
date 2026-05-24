import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd09QxCAeUdoUlnTsFN8YdlMQanrEEWYw",
  authDomain: "bookwiseai-87c04.firebaseapp.com",
  projectId: "bookwiseai-87c04",
  storageBucket: "bookwiseai-87c04.firebasestorage.app",
  messagingSenderId: "751399169648",
  appId: "1:751399169648:web:06ac8927f8a4b704350eb5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail };
