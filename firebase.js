// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCf73tjf4h3LVo6kdgezn55coBPWwjMv68",
  authDomain: "workker-d9c3c.firebaseapp.com",
  projectId: "workker-d9c3c",
  storageBucket: "workker-d9c3c.appspot.com",
  
  messagingSenderId: "187403429260",
  appId: "1:187403429260:web:b54239fdc86df71e4b62a9",
  measurementId: "G-9TWNQ4M5XB"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase storage
const storage = getStorage(firebaseApp);
console.log('App name: ', firebaseApp.name);

export { storage };