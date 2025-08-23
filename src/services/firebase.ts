import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp8Q8r0hT3ZnJJ09KmQylj35heyfOVrxY",
  authDomain: "grease-monkey-50e2d.firebaseapp.com",
  projectId: "grease-monkey-50e2d",
  storageBucket: "grease-monkey-50e2d.firebasestorage.app",
  messagingSenderId: "799214937281",
  appId: "1:799214937281:android:70e176132fc2eebb612040"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
