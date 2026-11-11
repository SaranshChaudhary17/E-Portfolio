import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const e = import.meta.env;

const firebaseConfig = {
  apiKey: e.VITE_FIREBASE_API_KEY,
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: e.VITE_FIREBASE_PROJECT_ID,
  storageBucket: e.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: e.VITE_FIREBASE_APP_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const fn = (n) => httpsCallable(getFunctions(app), n);
export const ADMIN = e.VITE_ADMIN_EMAIL;
export const CLOUD = e.VITE_CLOUDINARY_CLOUD_NAME;
export const PRESET = e.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio';
