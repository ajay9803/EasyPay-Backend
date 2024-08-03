import { initializeApp } from "firebase/app";
import config from "./config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Configurations for firebase
const firebaseConfig = {
  apiKey: config.firebase.FIREBASE_API_KEY,
  authDomain: config.firebase.FIREBASE_AUTH_DOMAIN,
  projectId: config.firebase.FIREBASE_PROJECT_ID,
  storageBucket: config.firebase.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.firebase.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.firebase.FIREBASE_APP_ID,
  measurementId: config.firebase.FIREBASE_MEASUREMENT_ID,
};

// Initialize firebase
const app = initializeApp(firebaseConfig);

// Initialize firebase storage
const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };
