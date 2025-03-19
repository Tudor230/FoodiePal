// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth, getReactNativePersistence  } from "firebase/auth";


import Constants from "expo-constants"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
//     appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
//     measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
    apiKey: "AIzaSyCL4ezG0wtFXBCnMRnF0lwyM7AeyDTsg7w",
    authDomain: "foodiepal-f058a.firebaseapp.com",
    projectId: "foodiepal-f058a",
    storageBucket: "foodiepal-f058a.firebasestorage.app",
    messagingSenderId: "138005584",
    appId: "1:138005584:web:c954dbda46610f93c41555",
    measurementId: "G-ZX8F43FR4B"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export { auth };
export default app;