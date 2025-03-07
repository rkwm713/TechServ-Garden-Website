/**
 * TechServ Community Garden - Firebase Configuration
 * 
 * This file contains the Firebase initialization and configuration
 * for the application. It exports the initialized Firebase instances
 * that can be used by other modules.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Initialize Analytics when supported (not available in all environments)
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(error => {
  console.error('Analytics support check failed:', error);
});

// Use Firebase emulators when in development mode
if (import.meta.env.VITE_APP_ENV === 'development' || window.location.hostname === 'localhost') {
  // Connect to auth emulator
  connectAuthEmulator(auth, 'http://localhost:9099');
  
  // Connect to Firestore emulator
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  
  // Connect to Storage emulator
  connectStorageEmulator(storage, 'localhost', 9199);
  
  // Connect to Functions emulator
  connectFunctionsEmulator(functions, 'localhost', 5001);
  
  console.log('Using Firebase emulators for local development');
}

// Export the initialized Firebase services
export {
  app,    // Firebase app instance
  auth,   // Firebase Authentication
  firestore, // Firestore database
  storage,   // Firebase Storage
  functions, // Firebase Cloud Functions
  analytics  // Firebase Analytics (may be null)
};

/**
 * A helper function to get the current timestamp in Firestore format
 */
export const serverTimestamp = () => {
  return new Date();
};

/**
 * A helper function to initialize Firestore listeners for real-time updates
 * @param {Function} onAuthStateChanged - The function to call when auth state changes
 */
export const initFirebaseListeners = (onAuthStateChanged) => {
  // Set up auth state change listener
  const unsubscribeAuth = auth.onAuthStateChanged(onAuthStateChanged);
  
  // Return unsubscribe function to clean up listeners
  return () => {
    unsubscribeAuth();
  };
};
