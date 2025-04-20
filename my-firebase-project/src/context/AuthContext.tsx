'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  UserCredential, 
  User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {
    return {} as UserCredential;
  },
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap around our app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with null and true for SSR compatibility
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Track if component is mounted to avoid state updates during SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [mounted]);

  
const signInWithGoogle = async () => {
  try {
    console.log('Attempting to sign in with Google...');
    const provider = new GoogleAuthProvider();
    // This is important - it helps prevent popup blockers
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    console.log('Sign-in successful', result.user);
    return result;
  } catch (error: any) {
    console.error('Error signing in with Google', error);
    // Check if it's a popup blocked error
    if (error.code === 'auth/popup-blocked') {
      alert('Popup was blocked. Please enable popups for this site and try again.');
    } else {
      alert(`Authentication error: ${error.message}`);
    }
    throw error;
  }
};

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value ={value}>{children}</AuthContext.Provider>;
};