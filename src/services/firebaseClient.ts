import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasValue = (value?: string) => typeof value === 'string' && value.trim().length > 0;

export const isFirebaseConfigured = (): boolean => {
  return (
    hasValue(firebaseConfig.apiKey) &&
    hasValue(firebaseConfig.authDomain) &&
    hasValue(firebaseConfig.projectId) &&
    hasValue(firebaseConfig.storageBucket) &&
    hasValue(firebaseConfig.messagingSenderId) &&
    hasValue(firebaseConfig.appId)
  );
};

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return cachedApp;
};

export const getFirestoreDb = (): Firestore | null => {
  if (cachedDb) {
    return cachedDb;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  cachedDb = getFirestore(app);
  return cachedDb;
};
