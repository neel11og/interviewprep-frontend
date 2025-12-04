import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase configuration (replace with your values)
const firebaseConfig = {
  apiKey: "AIzaSyDLBLzBmlwzcTAX3jnBq6a8CiDVZWUIk1w",
  authDomain: "interviewprep-ai-58683.firebaseapp.com",
  projectId: "interviewprep-ai-58683",
  storageBucket: "interviewprep-ai-58683.appspot.com",
  messagingSenderId: "467315084998",
  appId: "1:467315084998:web:69b5d262ab6b39fb38d1c7",
  measurementId: "G-5J1P2D2WHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth instance
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;