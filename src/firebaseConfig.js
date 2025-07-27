// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLBLzBmlwzcTAX3jnBq6a8CiDVZWUIk1w",
  authDomain: "interviewprep-ai-58683.firebaseapp.com",
  projectId: "interviewprep-ai-58683",
  storageBucket: "interviewprep-ai-58683.firebasestorage.app",
  messagingSenderId: "467315084998",
  appId: "1:467315084998:web:69b5d262ab6b39fb38d1c7",
  measurementId: "G-5J1P2D2WHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);