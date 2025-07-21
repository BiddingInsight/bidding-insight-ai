
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, SignUpDetails } from '../types';
import { db } from '../services/database';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signUp: (details: SignUpDetails) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'biddingInsight_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAdmin = user?.isAdmin ?? false;

  useEffect(() => {
    try {
      const storedUserJson = localStorage.getItem(AUTH_USER_KEY);
      if (storedUserJson) {
        const storedUser: User = JSON.parse(storedUserJson);
        // Re-validate user status on load
        if(storedUser.status === 'active') {
            setUser(storedUser);
        } else {
            localStorage.removeItem(AUTH_USER_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const openAuthModal = useCallback(() => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  }, [user]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await db.loginUser(email, password);
    if (loggedInUser.status === 'suspended') {
      alert('Your account has been suspended. Please contact an administrator.');
      throw new Error('Account suspended');
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
  };

  const signUp = async (details: SignUpDetails) => {
    console.log('User signing up:', details.email);
    const newUser = await db.addUser(details);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    // Don't close modal, let the modal handle the success view
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };
  
  const updateUserContext = async (updates: Partial<User>) => {
    if (!user) return;
    try {
        const updatedUser = await db.updateUser(user.id, updates);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
    } catch (error) {
        console.error("Failed to update user context:", error);
        // Optionally show an error to the user
    }
  };

  const value = { isAuthenticated: !!user, user, isAdmin, isAuthModalOpen, openAuthModal, closeAuthModal, signUp, login, logout, updateUserContext };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};