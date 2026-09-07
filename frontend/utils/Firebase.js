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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}
export { auth, provider, analytics };
