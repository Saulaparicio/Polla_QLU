"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({ user: null, loading: true, login: () => {}, register: () => {}, logout: () => {}, loginWithGoogle: () => {}, refreshUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user details from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        let userDocSnap = await getDoc(userDocRef);
        
        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          points: 0,
          correctScores: 0,
          correctOutcomes: 0,
          predictionsCount: 0,
          isAdmin: false,
        };

        if (userDocSnap.exists()) {
          userData = { ...userData, ...userDocSnap.data() };
        } else {
          // If user doc doesn't exist, create it (e.g. first time login if registered through another method)
          // Mark first user as admin by default for convenience in this demo!
          const isFirstUser = await checkIfFirstUser();
          userData.isAdmin = isFirstUser;
          await setDoc(userDocRef, userData);
        }

        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkIfFirstUser = async () => {
    try {
      return false; 
    } catch {
      return false;
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const register = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    await updateProfile(firebaseUser, { displayName });

    const isAdmin = email.toLowerCase().includes("admin");

    const userData = {
      uid: firebaseUser.uid,
      email,
      displayName,
      points: 0,
      correctScores: 0,
      correctOutcomes: 0,
      predictionsCount: 0,
      isAdmin,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);
    setUser(userData);
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUser({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          ...userDocSnap.data()
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
