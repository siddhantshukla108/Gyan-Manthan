import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with Email/Password
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Log in with Email/Password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Log in with Google
  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  // Log out
  function logout() {
    return signOut(auth);
  }

  // Forgot Password
  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Unblock UI immediately!
      
      if (user) {
        // Sync user to database in background
        axios.post('/auth/sync').catch(err => {
          console.error('Error syncing user:', err);
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
