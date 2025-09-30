// ESM Firebase setup (for use with a dev server like Vite)
// npm install firebase
// Usage in HTML (dev): <script type="module" src="./firebase/main.js"></script>
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBALAnnA675Xp1ja5oAn0b9DBMPSQQuryY",
  authDomain: "sahalat-e37e0.firebaseapp.com",
  projectId: "sahalat-e37e0",
  storageBucket: "sahalat-e37e0.firebasestorage.app",
  messagingSenderId: "613970226895",
  appId: "1:613970226895:web:6122d6ce09d8525c7351ba"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
