// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl0VYLOaxYdJHOkcUxncYFrSkV3-otNxE",
  authDomain: "ewr-yhz-todo.firebaseapp.com",
  projectId: "ewr-yhz-todo",
  storageBucket: "ewr-yhz-todo.firebasestorage.app",
  messagingSenderId: "324603826374",
  appId: "1:324603826374:web:6d3d15389b855c192c07c7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Optional but recommended: offline/refresh persistence
enableIndexedDbPersistence(db).catch((err) => {
  // Common: 'failed-precondition' (multiple tabs) or 'unimplemented' (old browser)
  console.warn("Firestore persistence not enabled:", err?.code || err);
});
