// Firebase Configuration
// Initialize Firebase with your project credentials
// Get these values from your Firebase Console: https://console.firebase.google.com

const firebaseConfig = {
  apiKey: "AIzaSyAIocAfjzTVvH56eQSCAgdIfN1A4asTunY",
  authDomain: "sabrina-grant-site.firebaseapp.com",
  projectId: "sabrina-grant-site",
  storageBucket: "sabrina-grant-site.firebasestorage.app",
  messagingSenderId: "492186976188",
  appId: "1:492186976188:web:f98cdcd740834aaa48b5b9",
  measurementId: "G-FH2BRPKKX0"
};

// Validate SDK loaded before init
if (typeof firebase === "undefined") {
  throw new Error("Firebase SDK not loaded. Confirm script tags use firebase-app-compat.js and are reachable.");
}

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase initialized", { projectId: firebaseConfig.projectId, auth: !!auth, db: !!db });

// Export for use in other files (if using modules)
const firebaseServices = { auth, db, storage };
