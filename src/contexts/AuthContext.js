import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { getAuth, GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleRedirectResult = async () => {
        try {
            const result = await getRedirectResult(getAuth());
            if (result) {
                const user = result.user;
                setUser(user); // Update user state
                console.log('User signed in:', user);
            } else {
              setLoading(false); // Ensure loading state is set to false if no result
            }
        } catch (error) {
            console.error('Error getting redirect result:', error);
            setLoading(false); // Ensure loading state is set to false on error
        }
    };
    handleRedirectResult();
  }, []);

  const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        setUser(user); // Update user state
        console.log('User signed in:', user);
    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
