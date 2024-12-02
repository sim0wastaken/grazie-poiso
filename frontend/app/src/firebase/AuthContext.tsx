// src/firebase/AuthContext.tsx
'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app from './firebaseConfig';
import Cookies from 'js-cookie';

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // When user is authenticated, get the ID token and store it in cookies
        const token = await user.getIdToken();
        Cookies.set('auth-token', token, { 
          expires: 7, // Token expires in 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        // When user is not authenticated, remove the token
        Cookies.remove('auth-token');
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('auth-token');
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    currentUser,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};