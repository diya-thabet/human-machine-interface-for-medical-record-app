// YourProjectName/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// *** THIS IS YOUR ACTUAL FIREBASE CONFIG ***
const firebaseConfig = {
  apiKey: "AIzaSyDL4sgdCZZ_NuxYNArXOkUCYzADR-imbBg",
  authDomain: "diacare-b1f29.firebaseapp.com",
  projectId: "diacare-b1f29",
  storageBucket: "diacare-b1f29.appspot.com", // You could also use "diacare-b1f29.firebasestorage.app"
  messagingSenderId: "171809031889",
  appId: "1:171809031889:android:bc3f4d7ac208df1195a7f0",
  // measurementId: "G-YOUR_MEASUREMENT_ID" // Leave this commented out if you don't have a web-specific Google Analytics ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Auth service
const auth = getAuth(app);

// Get a reference to the Firestore service
const db = getFirestore(app);

// Export the services so you can use them in your components
export { app, auth, db };