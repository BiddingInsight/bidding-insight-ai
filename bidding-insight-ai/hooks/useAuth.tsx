
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

interface AuthContextType {
  isSignedUp: boolean;
  isModalOpen: boolean;
  promptSignUp: () => void;
  signUp: (details: SignUpDetails) => void;
  closeModal: () => void;
}

export interface SignUpDetails {
    companyName: string;
    name: string;
    surname: string;
    email: string;
    industry: string;
    region: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'biddingInsight_isSignedUp';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedValue === 'true') {
        setIsSignedUp(true);
    }
  }, []);

  const promptSignUp = useCallback(() => {
    if (!isSignedUp) {
      setIsModalOpen(true);
    }
  }, [isSignedUp]);
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const signUp = (details: SignUpDetails) => {
    console.log('User signed up for newsletter:', details);
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsSignedUp(true);
    setIsModalOpen(false);
  };

  const value = { isSignedUp, isModalOpen, promptSignUp, signUp, closeModal };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
