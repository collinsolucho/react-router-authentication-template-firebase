// app/lib/firebase.client.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// Firebase configuration using environment variables for security and flexibility
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Singleton pattern: Initialize Firebase only if an app doesn't already exist
// This prevents "Firebase App named '[DEFAULT]' already exists" errors during development reloads
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export the Auth instance for use in login/signup components
export const auth = getAuth(app);

// Initialize Social Auth Providers
export const googleProvider = new GoogleAuthProvider();

export const facebookProvider = new FacebookAuthProvider();
// Request 'email' permission from Facebook to ensure we can sync a unique user to MongoDB
facebookProvider.addScope("email");

export const githubProvider = new GithubAuthProvider();
