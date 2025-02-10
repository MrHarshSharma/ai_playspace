import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { getAuth, GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import { storeGoogleUser, getUserByEmail } from '../server/api'; // Updated path

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

        // Check if the user already exists in Supabase
        const existingUser = await getUserByEmail(user.email);
        
        if (existingUser) {
            // User already exists, log them in directly
            setUser(existingUser);
            console.log('User logged in:', existingUser);
            return;
        }

        // User does not exist, attempt to store user in Supabase
        const storedUser = await storeGoogleUser(user);

        // Check if user was stored successfully
        if (!storedUser) {
            console.error('Failed to store user in Supabase, login aborted.');
            return; // Abort login if storing user failed
        }

        // Set user state only if storing was successful
        setUser(user); // Update user state only if storing was successful
        console.log('User signed in:', user);
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return; // Abort login if there is an error while signing in with Google
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
