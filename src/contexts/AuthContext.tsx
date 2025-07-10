
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  phone: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('airtel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if (phone === '+254700000000' && password === 'password123') {
      const userData = { phone, name: 'John Doe' };
      setUser(userData);
      localStorage.setItem('airtel_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('airtel_user');
  };

  const resetPassword = async (phone: string): Promise<boolean> => {
    // Mock password reset
    console.log(`Password reset sent to ${phone}`);
    return true;
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
