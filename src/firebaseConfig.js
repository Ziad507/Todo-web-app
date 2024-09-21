import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGzOHTL50s5ryJc7kizDKZP-ynrsLtRS4",
  authDomain: "to-do-d7d40.firebaseapp.com",
  databaseURL: "https://to-do-d7d40-default-rtdb.firebaseio.com",
  projectId: "to-do-d7d40",
  storageBucket: "to-do-d7d40.appspot.com",
  messagingSenderId: "561801707970",
  appId: "1:561801707970:web:0c2639a177eba7b904565b",
  measurementId: "G-8DWSG13NKZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, database, storage, db };
