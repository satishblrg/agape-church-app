import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB56YzMMD60GHGYU4aMcOAZzbXfoTKAxNg",
  authDomain: "agape-bible-church.firebaseapp.com",
  projectId: "agape-bible-church",
  storageBucket: "agape-bible-church.firebasestorage.app",
  messagingSenderId: "233451156899",
  appId: "1:233451156899:web:bbe523a7eefa0568d59616",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;