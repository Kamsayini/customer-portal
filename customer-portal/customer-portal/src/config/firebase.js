import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA3Yishk7-mtJ5Fg8r8bP7btR-h4g2Hl1U",
    authDomain: "ai-microgrid.firebaseapp.com",
    projectId: "ai-microgrid",
    storageBucket: "ai-microgrid.firebasestorage.app",
    messagingSenderId: "919088541487",
    appId: "1:919088541487:web:60a4b826b378691b59fbda"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In
const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

// Email/Password Sign-In
const loginWithEmailPassword = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error logging in:", error);
        throw error; 
    }
};

// Email/Password Sign-Up
const signUpWithEmailPassword = async (email, password) => {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing up:", error);
        throw error; 
    }
};

// Logout
const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export { auth, signInWithGoogle, loginWithEmailPassword, signUpWithEmailPassword, logout };

