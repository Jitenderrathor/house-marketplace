// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1PWlE7sBY2tawYt7PwZEPCvvLsXAz_ns",
  authDomain: "house-marketplace-f4524.firebaseapp.com",
  projectId: "house-marketplace-f4524",
  storageBucket: "house-marketplace-f4524.appspot.com",
  messagingSenderId: "679859622080",
  appId: "1:679859622080:web:5b768efd8ac84708eddd25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)