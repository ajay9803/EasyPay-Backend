import { initializeApp } from "firebase/app";
import config from "./config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAWhrTbghjei-jdc7J0hQ98-3zLw5rkAE",
  authDomain: "nohara-591ab.firebaseapp.com",
  projectId: "nohara-591ab",
  storageBucket: "nohara-591ab.appspot.com",
  messagingSenderId: "666589655619",
  appId: "1:666589655619:web:27439c6e1c1e4c8eec9af6",
  measurementId: "G-0MSWZYR153",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };
