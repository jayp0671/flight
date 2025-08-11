// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl0VYLOaxYdJHOkcUxncYFrSkV3-otNxE",
  authDomain: "ewr-yhz-todo.firebaseapp.com",
  projectId: "ewr-yhz-todo",
  storageBucket: "ewr-yhz-todo.firebasestorage.app",
  messagingSenderId: "324603826374",
  appId: "1:324603826374:web:6d3d15389b855c192c07c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);
