// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your api key here",
  authDomain: "energy-347f8.firebaseapp.com",
  databaseURL: "https://energy-347f8-default-rtdb.firebaseio.com",
  projectId: "energy-347f8",
  storageBucket: "energy-347f8.firebasestorage.app",
  messagingSenderId: "312763628721",
  appId: "1:312763628721:web:3e0946be43aed2444b3690"
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);

// Initialize Firestore
console.log("Initializing Firestore...");
export const db = getFirestore(app);
console.log("Firebase initialized successfully");
export default app;
