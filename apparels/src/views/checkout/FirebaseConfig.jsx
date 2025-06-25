// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Replace with your own Firebase credentials
const firebaseConfig = {
    apiKey: "AIzaSyDrxuO6zYx4A_STBMx6RsHQVIHgPqAXKs4",
    authDomain: "kalkino-org.firebaseapp.com",
    projectId: "kalkino-org",
    storageBucket: "kalkino-org.firebasestorage.app",
    messagingSenderId: "919289249233",
    appId: "1:919289249233:web:9d7356a63529e0d39eb4f0",
    measurementId: "G-2XDHBTQ8LE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
