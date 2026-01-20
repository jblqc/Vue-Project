import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDV0hQBw_z1tSRrjuLCLaCUA3dAO93wWts",
  authDomain: "vue-demo-shop.firebaseapp.com",
  projectId: "vue-demo-shop",
  storageBucket: "vue-demo-shop.firebasestorage.app",
  messagingSenderId: "715204040060",
  appId: "1:715204040060:web:2a9e34d4e3a22ac9c000f9",
  measurementId: "G-VG0EMMMMMZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export { app as firebaseApp, db, analytics, auth };
