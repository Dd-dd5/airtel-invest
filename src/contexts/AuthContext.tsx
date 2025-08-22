import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  balance: number;
  referral_code: string | null;
  referral_earnings: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  signup: (phone: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string) => Promise<boolean>;
  updateBalance: (amount: number) => void;
  addReferralEarning: (amount: number) => void;
  logTransaction: (type: string, amount: number, description: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      // Convert phone number to email format for Supabase auth
      const email = `${phone.replace(/\D/g, '')}@solar.invest`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success("Login successful");
      return true;
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
  };

  const signup = async (phone: string, password: string, fullName: string): Promise<boolean> => {
    try {
      // Convert phone number to email format for Supabase auth
      const email = `${phone.replace(/\D/g, '')}@solar.invest`;
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        phone,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success("Account created successfully! You can now log in.");
      return true;
    } catch (error) {
      toast.error("Signup failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.success("Logged out successfully");
    }
  };

  const resetPassword = async (phone: string): Promise<boolean> => {
    try {
      // Convert phone number to email format for Supabase auth
      const email = `${phone.replace(/\D/g, '')}@solar.invest`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password reset instructions sent to your registered contact");
      return true;
    } catch (error) {
      toast.error("Password reset failed");
      return false;
    }
  };

  const updateBalance = async (amount: number) => {
    if (!user || !profile) return;
    
    try {
      const newBalance = profile.balance + amount;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);
      
      if (updateError) {
        toast.error("Failed to update balance");
        return;
      }
      
      // Log transaction
      await logTransaction("balance_update", amount, `Balance ${amount > 0 ? 'increased' : 'decreased'} by KSh ${Math.abs(amount)}`);
      
      // Update local state
      setProfile({ ...profile, balance: newBalance });
    } catch (error) {
      toast.error("Failed to update balance");
    }
  };

  const addReferralEarning = async (amount: number) => {
    if (!user || !profile) return;
    
    try {
      const newEarnings = profile.referral_earnings + amount;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_earnings: newEarnings })
        .eq('user_id', user.id);
      
      if (updateError) {
        toast.error("Failed to update referral earnings");
        return;
      }
      
      // Log transaction
      await logTransaction("referral_earning", amount, `Referral earning of KSh ${amount}`);
      
      // Update local state
      setProfile({ ...profile, referral_earnings: newEarnings });
    } catch (error) {
      toast.error("Failed to update referral earnings");
    }
  };

  const logTransaction = async (type: string, amount: number, description: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          description,
        });
      
      if (error) {
        console.error('Failed to log transaction:', error);
      }
    } catch (error) {
      console.error('Failed to log transaction:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPassword,
    updateBalance,
    addReferralEarning,
    logTransaction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};