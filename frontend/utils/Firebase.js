import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginonecard-1929b.firebaseapp.com",
  projectId: "loginonecard-1929b",
  storageBucket: "loginonecard-1929b.appspot.com",
  messagingSenderId: "277279979921",
  appId: "1:277279979921:web:0937345435cef073848230",
  measurementId: "G-B9CZD8QMNY",
};
// Temporarily opt-in: the storefront must work without Firebase credentials.
const googleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true"
  && Boolean(firebaseConfig.apiKey);
const app = googleAuthEnabled ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const provider = app ? new GoogleAuthProvider() : null;
let analytics = null;
if (app && typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}
export { auth, provider, analytics, googleAuthEnabled };
