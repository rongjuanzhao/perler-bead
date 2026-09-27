/**
 * Firebase client-side SDK initialization.
 * Used for Google Sign-In on the web app.
 * This module is client-only — imported in Client Components.
 */
import {initializeApp, getApps, getApp, type FirebaseApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, type Auth} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

/**
 * Get the initialized Firebase App instance (singleton).
 */
export function getFirebaseApp(): FirebaseApp {
    if (!app) {
        console.log("Initializing Firebase App:", firebaseConfig)
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    }
    return app;
}

/**
 * Get the Firebase Auth instance configured for Google Sign-In.
 */
export function getFirebaseAuth(): Auth {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

/**
 * Get a GoogleAuthProvider instance with appropriate scopes.
 */
export function getGoogleProvider(): GoogleAuthProvider {
    const provider = new GoogleAuthProvider();
    return provider;
}
