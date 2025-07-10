
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  phone: string;
  name: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  signup: (phone: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string) => Promise<boolean>;
  updateBalance: (amount: number) => void;
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

// Mock user database
const mockUsers = [
  { phone: '+254700000000', password: 'password123', name: 'John Doe', balance: 45750 },
  { phone: '+254712345678', password: 'demo123', name: 'Jane Smith', balance: 25300 },
  { phone: '+254733445566', password: 'test123', name: 'Bob Wilson', balance: 67890 },
];

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
    const foundUser = mockUsers.find(u => u.phone === phone && u.password === password);
    if (foundUser) {
      const userData = { 
        phone: foundUser.phone, 
        name: foundUser.name, 
        balance: foundUser.balance 
      };
      setUser(userData);
      localStorage.setItem('airtel_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (phone: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.phone === phone);
    if (existingUser) {
      return false; // User already exists
    }
    
    // Create new user
    const newUser = { phone, password, name, balance: 0 };
    mockUsers.push(newUser);
    
    const userData = { phone, name, balance: 0 };
    setUser(userData);
    localStorage.setItem('airtel_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('airtel_user');
  };

  const resetPassword = async (phone: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.phone === phone);
    return !!foundUser;
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('airtel_user', JSON.stringify(updatedUser));
      
      // Update mock database
      const userIndex = mockUsers.findIndex(u => u.phone === user.phone);
      if (userIndex !== -1) {
        mockUsers[userIndex].balance = updatedUser.balance;
      }
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    updateBalance,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
