import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  phone: string;
  name: string;
  balance: number;
  referralCode: string;
  referralEarnings: number;
  totalReferrals: number;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  signup: (phone: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string) => Promise<boolean>;
  updateBalance: (amount: number) => void;
  addReferralEarning: (amount: number) => void;
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

// Generate referral code
const generateReferralCode = (name: string, phone: string) => {
  const nameCode = name.substring(0, 3).toUpperCase();
  const phoneCode = phone.slice(-4);
  return `${nameCode}${phoneCode}`;
};

// Real user database stored in localStorage
const getUsers = () => {
  const stored = localStorage.getItem('solar_users_db');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize empty database
  const emptyDb: any[] = [];
  localStorage.setItem('solar_users_db', JSON.stringify(emptyDb));
  return emptyDb;
};

const saveUsers = (users: any[]) => {
  localStorage.setItem('solar_users_db', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('solar_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find((u: any) => u.phone === phone && u.password === password);
    if (foundUser) {
      const userData = { 
        phone: foundUser.phone, 
        name: foundUser.name, 
        balance: foundUser.balance,
        referralCode: foundUser.referralCode,
        referralEarnings: foundUser.referralEarnings || 0,
        totalReferrals: foundUser.totalReferrals || 0
      };
      setUser(userData);
      localStorage.setItem('solar_current_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (phone: string, password: string, name: string, referralCode?: string): Promise<boolean> => {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.phone === phone);
    if (existingUser) {
      return false; // User already exists
    }
    
    // Generate referral code for new user
    const newReferralCode = generateReferralCode(name, phone);
    
    // Create new user
    const newUser = { 
      phone, 
      password, 
      name, 
      balance: 0,
      referralCode: newReferralCode,
      referralEarnings: 0,
      totalReferrals: 0
    };
    
    // If referred by someone, add referral bonus to referrer
    if (referralCode) {
      const referrer = users.find((u: any) => u.referralCode === referralCode);
      if (referrer) {
        referrer.referralEarnings = (referrer.referralEarnings || 0) + 400;
        referrer.totalReferrals = (referrer.totalReferrals || 0) + 1;
        referrer.balance += 400;
      }
    }
    
    users.push(newUser);
    saveUsers(users);
    
    const userData = { 
      phone, 
      name, 
      balance: 0,
      referralCode: newReferralCode,
      referralEarnings: 0,
      totalReferrals: 0
    };
    setUser(userData);
    localStorage.setItem('solar_current_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('solar_current_user');
  };

  const resetPassword = async (phone: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find((u: any) => u.phone === phone);
    return !!foundUser;
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const users = getUsers();
      const userIndex = users.findIndex((u: any) => u.phone === user.phone);
      
      if (userIndex !== -1) {
        users[userIndex].balance += amount;
        users[userIndex].lastActivity = new Date().toISOString();
        saveUsers(users);
        
        const updatedUser = { ...user, balance: user.balance + amount };
        setUser(updatedUser);
        localStorage.setItem('solar_current_user', JSON.stringify(updatedUser));
        
        // Log transaction for admin tracking
        logTransaction({
          userId: user.phone,
          userName: user.name,
          userPhone: user.phone,
          type: amount > 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(amount),
          status: 'completed',
          details: { method: amount > 0 ? 'M-Pesa Deposit' : 'M-Pesa Withdrawal' }
        });
      }
    }
  };

  const addReferralEarning = (amount: number) => {
    if (user) {
      const users = getUsers();
      const userIndex = users.findIndex((u: any) => u.phone === user.phone);
      
      if (userIndex !== -1) {
        users[userIndex].referralEarnings += amount;
        users[userIndex].totalReferrals += 1;
        users[userIndex].balance += amount;
        users[userIndex].lastActivity = new Date().toISOString();
        saveUsers(users);
        
        const updatedUser = { 
          ...user, 
          referralEarnings: user.referralEarnings + amount,
          totalReferrals: user.totalReferrals + 1,
          balance: user.balance + amount
        };
        setUser(updatedUser);
        localStorage.setItem('solar_current_user', JSON.stringify(updatedUser));
        
        // Log referral transaction for admin tracking
        logTransaction({
          userId: user.phone,
          userName: user.name,
          userPhone: user.phone,
          type: 'referral_earning',
          amount: amount,
          status: 'completed',
          details: { referrals: updatedUser.totalReferrals }
        });
      }
    }
  };

  const logTransaction = (transactionData: any) => {
    const existingTransactions = JSON.parse(localStorage.getItem('solar_admin_transactions') || '[]');
    const newTransaction = {
      id: `${transactionData.type}_${transactionData.userId}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...transactionData
    };
    
    existingTransactions.push(newTransaction);
    localStorage.setItem('solar_admin_transactions', JSON.stringify(existingTransactions));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    updateBalance,
    addReferralEarning,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};